const mentorModel=require('../models/Mentor.model,');
const MentorApplicationModel=require('../models/mentorApplication.model')


async function checkMentor(userId) {
  return await mentorModel.findOne(userId);
}

async function createMentor({
  firstName,
  lastName,
  designation
},userId) {
  const catchDuplicate = await checkMentor({userId});
  if (catchDuplicate) {
    throw new Error("mentor already registered");
  }
  
  const newMentor = await mentorModel.create({
    firstName,
    lastName,
    designation
  });
  return newMentor;
}

async function checkMentorApplication(userId) {
  return MentorApplicationModel.findOne({ userId })
}
 async function checkApplicationStatus(applicationId){
  const application=MentorApplicationModel.findOne({ applicationId });
  return application.status;
 }


module.exports={createMentor,checkMentor,checkMentorApplication,checkApplicationStatus}