const studentModel = require("../models/Student.model");

async function checkStudent(userId) {
  return studentModel.findOne({userId});
}

async function newStudent({
  enrollment_number,
  admissionYear,
},userId) {
  const check = await checkStudent(userId);
  if (check) {
    const err = new Error("Student already registered");
    err.statusCode = 409;
    throw err;
  }
  const newS = await studentModel.create({
    userId,
    enrollment_number,
    admissionYear,
  });
  
  return newS;
}

module.exports={newStudent}
