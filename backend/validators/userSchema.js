const { z } = require("zod");

const userSchema = z.object({
  name: z
    .string()
    .trim()
    .regex(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)
    .max(50),
  userName: z
    .string()
    .regex(/[A-Za-z0-9@$!%*?&]/)
    .max(50)
    .describe("invalid text"),

  email: z.string().email().max(50).describe("valid email required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&]/, "Password must contain at least one special character"),
});

module.exports = userSchema;
