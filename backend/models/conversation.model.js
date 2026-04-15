const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
    },
  ],
  lastMessage: {
    text: String,
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "userData" },
  },
},{timestamps:true});

const conversationModel=mongoose.model("converstaion", conversationSchema);
module.exports=conversationModel;
