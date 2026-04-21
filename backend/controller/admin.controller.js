const { default: mongoose } = require("mongoose");
const MentorApplication = require("../models/mentorApplication.model");
const userModel = require("../models/User.model");
const {
  fetchAllApplication,
  changeStatusToApprove,
  changeStatusToReject,
} = require("../services/admin.services");

async function approveApplication(req, res) {
  try {
    if (!req.roles.includes("admin")) {
      return res.status(409).json({
        message: "Not a admin",
      });
    }
    const applicationId  = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "applicationId is not correct" });
    }
    changeStatusToApprove(applicationId);
    res.status(200).json({ message: "Application approved" });
  } catch (error) {
    console.log(error);
  }
}
async function rejectApplication(req, res) {
  try {
    if (!req.roles.includes("admin")) {
      return res.status(409).json({
        message: "Not a admin",
      });
    }
    const applicationId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ message: "applicationId is not correct" });
    }
    changeStatusToReject(applicationId);
    res.status(200).json({ message: "Application Rejected" });
  } catch (error) {
    console.log(error);
  }
}
async function allApplicationForMentorRole(req, res) {
  try {
    const applications = await fetchAllApplication();

    return res.status(200).json({
      message:
        applications.length === 0
          ? "No applications found"
          : "All applications fetched successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
module.exports = { approveApplication,rejectApplication, allApplicationForMentorRole };
