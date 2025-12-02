// ===============================
// 📌 VALIDATE MIDDLEWARE OF JOI
// ===============================
const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "validate field",
        error: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export default validateMiddleware;
