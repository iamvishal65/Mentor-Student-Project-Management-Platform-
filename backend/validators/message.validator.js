const { z } = require("zod");
const sendMessageSchema = z.object({
  conversationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId"),

  message: z
    .string()
    .min(1, "message cannot be empty")
    .max(200, "message too long"),

  messageType: z
    .enum(["text", "image", "file","typing","read"])
    .default("text"),
});
module.exports ={sendMessageSchema}