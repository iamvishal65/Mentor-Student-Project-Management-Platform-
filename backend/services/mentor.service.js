const mentorModel=require('../models/Mentor.model,');
const MentorApplicationModel=require('../models/mentorApplication.model')


async function checkMentor(userId) {
  return await mentorModel.findOne(userId);
}

async function createMentor({designation},userId) {
  const catchDuplicate = await checkMentor({userId});
  if (catchDuplicate) {
    throw new Error("mentor already registered");
  }
  
  const newMentor = await mentorModel.create({
    designation,
    userId
  });
  return newMentor;
}

async function checkMentorApplication(userId) {
  return MentorApplicationModel.findOne({ userId })
}

async function reapplyForMentor(todayDate, id) {
  const nextDate = new Date(todayDate);
  nextDate.setDate(today.getDate() + 15);
  if(id)throw Error ("No id");
  await MentorApplicationModel.findByIdAndUpdate({id},{
    createdAt:todayDate,
    nextEligibleAt:nextDate
  })
  return nextDate;
}

async function newApplication(id,todayDate) {
  const nextDate = new Date(todayDate);
  nextDate.setDate(todayDate.getDate() + 15);
  if(!id)throw Error ("No id");
  await MentorApplicationModel.create({
    userId:id,
    status:"PENDING",
    createdAt:todayDate,
    nextEligibleAt:nextDate
  })
  return nextDate;
}


module.exports={createMentor,checkMentorApplication,reapplyForMentor,newApplication}