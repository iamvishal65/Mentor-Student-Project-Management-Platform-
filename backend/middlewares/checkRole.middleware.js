module.exports = function checkRole(req, res, next) {
  try {
    const roles = req.token.roles;

    if (!roles) {
      return res.status(401).json({ message: "No roles found" });
    }

    req.roles = roles;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Error in role identification" });
  }
};

