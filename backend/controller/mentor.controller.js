const {
  checkMentorApplication,
  newApplication,
  reapplyForMentor,
  createMentor,
} = require("../services/mentor.service");
const { updateUserProfile } = require("../services/profile.services");
const { roleAddition } = require("../services/user.services");
const { mentorregisterSchema } = require("../validators/mentor.validator");
async function applicationState(req, res) {
  try {
    // ✅ Already mentor
    if (req.roles.includes("mentor")) {
      return res.status(409).json({
        message: "Already a mentor",
      });
    }

    const userId = req.token.id;
    const existing = await checkMentorApplication(userId);
    const todayDate = new Date();

    // ✅ Existing application
    if (existing) {
      if (existing.status !== "APPROVED") {
        // ❌ Not eligible yet
        if (todayDate < existing.nextEligibleAt) {
          return res.status(200).json({
            message: "User already applied",
            status: existing.status,
            nextEligibleAt: existing.nextEligibleAt,
          });
        }

        return res.status(200).json({
          message: "Eligible to reapply",
          status: "REJECTED",
          nextEligibleAt: todayDate,
        });
      }
      return res.status(200).json({
        message: "User already applied",
        status: existing.status,
        nextEligibleAt: existing.nextEligibleAt,
      });
    }
    return res.status(200).json({
      message: "User not applied",
      status: "NOT APPLIED",
    });
  } catch (error) {
    console.error("error is:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

async function applyForMentor(req, res) {
  try {
    // ✅ Already mentor
    if (req.roles.includes("mentor")) {
      return res.status(409).json({
        message: "Already a mentor",
      });
    }
    const userId = req.token.id;
    const existing = await checkMentorApplication(userId);
    const todayDate = new Date();

    // ✅ Existing application
    if (existing) {
      if (existing.status !== "APPROVED") {
        if (todayDate >= existing.nextEligibleAt) {
          // ✅ Reapply
          const newDate = await reapplyForMentor(todayDate, existing.userId);
          return res.status(200).json({
            message: "Application re-applied",
            status: "PENDING",
            nextEligibleAt: newDate,
          });
        }
      }
      return res.status(200).json({
        message: "Application approved",
        status: "APPROVED",
      });
    }

    // ✅ First-time application
    const nextEligibleAt = await newApplication(userId, todayDate);

    return res.status(201).json({
      message: "Mentor application submitted",
      status: "PENDING",
      nextEligibleAt,
    });
  } catch (error) {
    console.error("error is:", error);
    return res.status(500).json({
      message: error.message,
      success: false,
    });
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
    
    await createMentor(data,userId);
    await updateUserProfile(userId,"mentor");
    await roleAddition(userId,"mentor")
    res.status(201).json({
      success: true,
      message: "mentor registered successfully",
    });
  } catch (error) {
    console.error("error is:" + error);
    res.status(500).json({ message: error.message, success: false });
  }
}

module.exports = { applyForMentor, newMentor, applicationState };
