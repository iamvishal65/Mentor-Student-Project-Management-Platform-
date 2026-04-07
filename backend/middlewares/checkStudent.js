const userModel = require("../models/User.model");

module.exports=async function checkStudent(req, res, next) {
  try {
    const id = req.token.id;

    const user = await userModel.findById(id);
    if (!user) {
      const err = new Error("user not registered");
      err.statusCode = 401;
      throw err;
    }
    if (!user.roles.includes("STUDENT")) {
      return  res.status(403).json({
        message:"Student registration needed",
        requiresStudentRegistration:true
      })
    }
    next();

  } catch (error) {
    
    return res.status(401).json({ message: "Error in role identification"+error});
  }
}

