const MentorApplication = require("../models/mentorApplication.model");
const userModel = require("../models/User.model");
const { fetchAllApplication } = require("../services/admin.services");


async function approveMentor(req, res) {
  if(!req.roles.include("admin")){ 
      return res.status(409).json({
        message: "Not a admin",
      });
    }
  const { userId } = req.params;
  const application = await MentorApplication.findOne({ userId });
  if (!application || application.status !== "PENDING") {
    return res.status(400).json({ message: "Invalid application" });
  }

  application.status = "APPROVED";
  await application.save();

  await userModel.findByIdAndUpdate(userId, { roles: "MENTOR" });

  res.json({ message: "Mentor approved" });
}
async function allApplicationForMentorRole(req, res) {
  try {
    const applications = await fetchAllApplication();

    return res.status(200).json({
      message: applications.length === 0
        ? "No applications found"
        : "All applications fetched successfully",
      count: applications.length,
      applications
    });

  } catch (error) {
    console.error("error is:" + error);
    return res.status(500).json({ message: error.message });
  }
}
module.exports={approveMentor,allApplicationForMentorRole}