// ===============================
// 📌 VALIDATE MIDDLEWARE OF JOI
// ===============================

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Collect all messages
      const messages = error.details.map((err) => err.message);
      return res.status(400).json({ errors: messages });
    }
    next();
  };
};
export default validateMiddleware;
