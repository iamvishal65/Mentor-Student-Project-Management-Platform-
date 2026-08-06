const express = require("express");
const router = express.Router();
const tokenVerification = require("../middlewares/TokenVerificaton.cjs");
const messageController = require("../controller/message.controller");

router.get(
  "/message/checkConversation/:otherUserId",
  tokenVerification,
  messageController.checkConversation,
);
router.get(
  "/message/allConversation",
  tokenVerification,
  messageController.allConversations,
);
router.get(
  "/message/conversation/:conversationId",
  tokenVerification,
  messageController.getConversationById,
);

module.exports = router;
