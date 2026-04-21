const verifyToken = require("../services/tokenVerification");

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(";").forEach((cookie) => {
    const separatorIndex = cookie.indexOf("=");         // ✅ split only on first "="
    if (separatorIndex === -1) return;

    const key = cookie.slice(0, separatorIndex).trim();
    const value = decodeURIComponent(                   // ✅ decode URL-encoded values
      cookie.slice(separatorIndex + 1).trim()
    );
    cookies[key] = value;
  });

  return cookies;
}

function checkUser(ws, req, next) {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies.token;

    if (!token) {
      ws.close(1008, "Unauthorized: No token");
      return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      ws.close(1008, "Unauthorized: Invalid token");
      return;
    }

    ws.userId = decoded.id;
    next();
  } catch (error) {
    console.error("checkUser error:", error.message);
    ws.close(1008, "Unauthorized");
  }
}

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

module.exports = { checkUser, applyMiddleware };
