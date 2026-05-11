const mongoose = require("mongoose");

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

    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent"
    },

    deletedForEveryone: {
      type: Boolean,
      default: false
    },

    deletedForMeBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData"
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);