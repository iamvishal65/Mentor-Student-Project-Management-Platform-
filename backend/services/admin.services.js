const MentorApplicationModel = require("../models/mentorApplication.model");

async function fetchAllApplication() {
    return  await MentorApplicationModel.find({status: "PENDING"})
}

module.exports={fetchAllApplication}
