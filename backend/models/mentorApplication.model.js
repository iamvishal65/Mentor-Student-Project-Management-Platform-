const mongoose = require("mongoose");

const mentorApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  nextEligibleAt: {
    type: Date,
  },
});

const MentorApplicationModel = mongoose.model(
  "MentorApplicationModel",
  mentorApplicationSchema,
);
module.exports = MentorApplicationModel;
