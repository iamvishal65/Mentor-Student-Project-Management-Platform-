const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
    required: true,
  },
  enrollment_number: {
    type: String,
    required: true,
    unique: true,
  },
  admissionYear: {
    type: Number,
    required: true,
    
  },
  github: {
    connected: { type: Boolean, default: false },
    accessTokenEnc: String,
    iv: String,
    authTag: String,
    connectedAt: Date,
  },
});

const studentModel = mongoose.model("studentData", studentSchema);
module.exports = studentModel;
