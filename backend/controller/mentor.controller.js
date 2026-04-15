const { checkMentor, checkMentorApplication, checkApplicationStatus } = require("../services/mentor.service");
const { mentorregisterSchema } = require("../validators/mentor.validator");
async function applyForMentor(req, res) {
  try {
    const userId = req.user.id;

    //add if else or switch by checking remaning day

    // const existing = await checkMentorApplication(userId);
    // if (existing) {
    //   const applicationStatus=existing.status;
    //   const nextEligibleAt=existing.nextEligibleAt;
    //   res.status(201).json({ message: "User already applied" ,status:applicationStatus,nextEligibleAt:nextEligibleAt});
    // }
    // const newApplication=

    res.status(201).json({ message: "Mentor application submitted" });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

async function newMentor(req, res) {
  try {
    const validateUser = mentorregisterSchema.safeParse(req.body);
    if (!validateUser.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validateUser.error.issues.map((err) => ({
          field: err.path[0],
          message: err.message,
          success: false,
        })),
      });
    }
    const data = validateUser.data;
    const userId = req.token.id;
    const newMentor = checkMentor(data, userId);
    if (newMentor.error) {
      return res.status(400).json({ message: error.message, success: false });
    }

    res.status(201).json({
      success: true,
      message: "mentor registered successfully",
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

module.exports = { applyForMentor, newMentor };
