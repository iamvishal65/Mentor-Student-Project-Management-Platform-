const { z } = require("zod");

const sendMessageSchema = z.object({
  receiverId: z.string(),

  conversationId: z.string().nullable().optional(),

  message: z
    .string()
    .min(1, "message cannot be empty")
    .max(200, "message too long"),

  messageType: z
    .enum(["text", "image", "file"])
    .default("text"),

  timestamp: z.coerce.date().optional(),
});

module.exports = { sendMessageSchema };