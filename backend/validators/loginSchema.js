const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string()
    .email("Valid email required")
    .max(50),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(30, "Password must be at most 30 characters"),
});

module.exports = loginSchema;