const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
      },
    },
  },
  { timestamps: true }
);

const conversationModel = mongoose.model(
  "conversation",
  conversationSchema
);

module.exports = conversationModel;
