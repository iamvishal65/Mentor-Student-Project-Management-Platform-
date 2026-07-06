const userModel = require("../models/User.model");
const { hashedPassword } = require("../utils/hashPassword.util");
const { comparePassword } = require("../utils/hashPassword.util");

async function checkEmail(email) {
  return await userModel.findOne({ email });
}
async function checkUserName(userName) {
  return await userModel.findOne({ userName });
}
async function createUser({ name, userName, email, password }) {
  const catchDuplicate = await checkEmail(email);
  if (catchDuplicate) {
    const err = new Error("user already registered");
    err.statusCode = 409;
    throw err;
  }
  const catchDuplicateUserName = await checkUserName(userName);
  if (catchDuplicateUserName) {
    const err = new Error("change userName");
    err.statusCode = 409;
    throw err;
  }
  const hashPassword = await hashedPassword(password);

  const newUser = await userModel.create({
    name,
    userName,
    email,
    password: hashPassword,
  });
  return newUser;
}

async function checkUser({ email, password }) {
  const res = await userModel.findOne({ email });
  if (!res) throw new Error("Register first");

  const check = await comparePassword(password, res.password);
  if (!check) throw new Error("wrong password");

  return res;
}

async function checkLoggedIn(userId) {
  const user = await userModel.findById(userId);
  return user;
}

async function roleAddition(userId, role) {
  const confirm = await userModel.find({ userId }, role);
  if (!confirm) {
    const err = new Error("user not registered");
    err.statusCode = 409;
    throw err;
  }
  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { roles: role },
  });
}


module.exports = {
  createUser,
  checkEmail,
  checkUser,
  checkLoggedIn,
  roleAddition,
  
};
