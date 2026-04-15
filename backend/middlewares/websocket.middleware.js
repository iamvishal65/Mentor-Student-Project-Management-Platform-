const verifyToken = require("../services/tokenVerification");

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const [key, value] = cookie.trim().split("=");
    cookies[key] = value;
  });

  return cookies;
}

function checkUser(ws, req, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;
    if (!token) {
      ws.close();
      return;
    }
    const decoded = verifyToken(token);
    if (!decoded) {
      ws.close();
      return;
    }
    // attach to ws (important)
    ws.id = decoded.id;
    next();
  } catch (error) {
    ws.close();
  }
}

function chekUserPermission(ws, req, next) {}

function applyMiddleware(ws, req, middlewares, handler) {
  let i = 0;
  function next() {
    if (i < middlewares.length) {
      const mw = middlewares[i++];
      mw(ws, req, next);
    } else {
      handler();
    }
  }
  next();
}

module.exports = { checkUser, chekUserPermission,applyMiddleware };
