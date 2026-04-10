function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

function validateRegisterInput(req, res, next) {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "A valid email address is required." });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long."
    });
  }

  return next();
}

function validateLoginInput(req, res, next) {
  const { email, password } = req.body;

  if (!isValidEmail(email) || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  return next();
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
