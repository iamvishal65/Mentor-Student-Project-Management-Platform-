import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
      required: true
    },

    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true
    },

    message: {
      type: String,
      trim: true
    },

    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text"
    },

    isRead: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

const messageModel= mongoose.model("Message", messageSchema);
module.exports=messageModel;