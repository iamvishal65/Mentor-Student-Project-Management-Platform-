const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true,
      unique: true,
      index: true,
    },
    userName: {
      type: String,
      unique:true,
      required:true
    },
    Name: {
      type: String,
      required:true
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    roles: {
      type: [String],
      enum: ["user", "student", "mentor", "admin"],
      default: ["user"],
    },
    socialLinks: {
      github: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      portfolio: { type: String, trim: true, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Profile", profileSchema);
