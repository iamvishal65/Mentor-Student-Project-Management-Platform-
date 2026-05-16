const profileModel = require("../models/profile.model");

async function searchProfile(q) {}
async function createNewProfile({ name, userName }, userId) {
  await profileModel.create({
    userId,
    name,
    userName,
  });
}
async function updateUserProfile(id,role) {
  await userModel.findByIdAndUpdate(userId, {
    $addToSet: { roles: role },
  });
}
module.exports = { createNewProfile,updateUserProfile };
