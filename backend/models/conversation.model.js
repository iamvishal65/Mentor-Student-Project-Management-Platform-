const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userData",
        required: true,
      },
    ],

    isGroup: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

// Multikey index
conversationSchema.index({ participants: 1 });

const conversationModel = mongoose.model("conversation", conversationSchema);

module.exports = conversationModel;
