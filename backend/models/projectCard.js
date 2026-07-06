const mongoose = require("mongoose");

const projectCardSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    index:true
  },
  description: {
    type: String,
    required: true,
  },
  repoLink: {
    type: String,
    unique: true,
    required: true,
  },
  imageLink: {
    type: String,
    required: false,
  },
  deployLink:{
    type:String,
    required:false
  },
  visibility:{
    type:Boolean,
    default:false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "studentData",
    required: true,
  },

},{ timestamps: true });
const projectCard = mongoose.model("projectCard", projectCardSchema);
module.exports = { projectCard };
