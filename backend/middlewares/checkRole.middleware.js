const userModel = require("../models/User.model");

module.exports=async function checkRole(req, res, next) {
  try {
    const id = req.token.id;
    const user = await userModel.findById(id);
    if (!user) {
      const err = new Error("user not registered");
      err.statusCode = 401;
      throw err;
    }
    req.roles=user.roles;
    next();

  } catch (error) {
    
    return res.status(401).json({ message: "Error in role identification"+error});
  }
}

