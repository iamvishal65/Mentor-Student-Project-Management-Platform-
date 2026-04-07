const verifyToken=require('../services/tokenVerification')

module.exports = async function tokenVerification(req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(409).json({ message: "you don't provide the token" });
    }
    const decoded = verifyToken(token);
    if(!decoded) return res.status(409).json({ message: "invalid token" })
    req.token = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "token is expired re-loggin" });
  }
};
