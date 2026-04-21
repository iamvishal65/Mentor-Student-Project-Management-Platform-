const sendMessageSchema = require("../validators/message.validator");

function validateMessage(msg) {
  const validate = sendMessageSchema.safeParse(msg);
  if (!validate.success) {
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      errors: validate.error.issues.map((err) => ({
        field: err.path[0],
        message: err.message,
      })),
    });
  }
}
module.exports = {validateMessage};
