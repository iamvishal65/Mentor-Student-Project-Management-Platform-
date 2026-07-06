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
    const l=await updateUserProfile(userId,"student");
    console.log(l);
    
    if (user.error) {
      return res.status(400).json({ message: user.error.message, success: false });
    }
    await roleAddition(userId,"student");
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("error is :" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}
async function allStundet(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(parseInt(req.query.limit || "10", 10), 50);
    const skip = (page - 1) * limit;

    const filter = {
      role: "STUDENT",
    };

    const totalStudents = await User.countDocuments(filter);

    const students = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        totalDocs: totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
        hasNextPage: page * limit < totalStudents,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
module.exports={registerStudent}