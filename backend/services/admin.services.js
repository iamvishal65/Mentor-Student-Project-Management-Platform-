const MentorApplicationModel = require("../models/mentorApplication.model");

async function fetchAllApplication() {
  return await MentorApplicationModel.find({ status: "PENDING" });
}
async function changeStatusToApprove(Id) {
  return await MentorApplicationModel.findByIdAndUpdate(
    Id,
    { status: "APPROVED" },   // ✅ correct
    { new: true }             // optional but useful
  );
}

async function changeStatusToReject(Id) {
  return await MentorApplicationModel.findByIdAndUpdate(
    Id,
    { status: "REJECTED" },   // ✅ correct
    { new: true }
  );
}
module.exports = {
  fetchAllApplication,
  changeStatusToApprove,
  changeStatusToReject,
};
