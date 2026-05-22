const { z } = require("zod");

const mentorregisterSchema = z.object({
  
  designation: z
    .string()
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
});



module.exports={ mentorregisterSchema}