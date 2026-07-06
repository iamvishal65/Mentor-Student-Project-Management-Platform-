const profileModel = require("../models/profile.model");

async function searchProfile(q) {
  return await profileModel.findOne({ userName: q });
}
async function createNewProfile({ name, userName }, userId) {
  await profileModel.create({
    user: userId,
    userName: userName,
    Name: name,
  });
}
async function updateUserProfile(userId, role) {
  return await profileModel.findOneAndUpdate(
    { user: userId },
    {
      $addToSet: {
        roles: role,
      },
    },
    {
      new: true,
    }
  );
}
module.exports = { createNewProfile, updateUserProfile, searchProfile };
