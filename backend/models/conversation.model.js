import mongoose from "mongoose";

const converstaionSchema = new mongoose.Schema({
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

const converstaionModel=mongoose.model("converstaion", converstaionSchema);
module.exports=converstaionModel;
