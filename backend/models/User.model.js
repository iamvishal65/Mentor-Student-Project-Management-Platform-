const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  userName:{
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  roles: {
    type: [String],
    enum: ["user", "student", "mentor", "admin"],
    default: ["user"]
  }
});

const userModel = mongoose.model("userData", userSchema);
module.exports = userModel;