const MentorApplication = require("../models/mentorApplication.model");
const userModel = require("../models/User.model");

async function approveMentor(req, res) {
  
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
async function allApplicationForMentorRole(req,res) {
  try {
    if(!req.roles.include("admin")){ 
      return res.status(409).json({
        message: "Not a admin",
      });
    }
  } catch (error) {
    
  }
}

module.exports={approveMentor,allApplicationForMentorRole}