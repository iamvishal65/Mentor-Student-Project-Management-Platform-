const { z } = require("zod");

const studentSchema = z.object({
  enrollment_number: z
    .string()
    .regex(/^[A-Z]{3}[0-9]{8}$/, "invalid enrollment number format")
    .transform((val) => val.toUpperCase()),
  admissionYear: z
    .coerce.number()
    .min(2000)
    .max(new Date().getFullYear(), "Admission year cannot be in the future"),
});




module.exports = studentSchema;
