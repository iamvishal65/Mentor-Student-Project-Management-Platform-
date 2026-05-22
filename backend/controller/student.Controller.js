const { roleAddition } = require('../services/user.services');
const studentSchema=require('../validators/student.validator')
const {newStudent}=require('../services/student.service');
const { updateUserProfile } = require('../services/profile.services');


async function registerStudent(req, res) {
  try {
    const validateUser = studentSchema.safeParse(req.body);
    if (!validateUser.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validateUser.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
          success: false,
        })),
      });
    }
    const data = validateUser.data;
    const userId = req.token.id
    const user = await newStudent(data,userId);
    await updateUserProfile(userId,"student");
    if (user.error) {
      return res.status(400).json({ message: user.error.message, success: false });
    }
    await roleAddition(userId,"STUDENT");
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

module.exports={registerStudent}