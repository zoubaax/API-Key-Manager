const express = require("express");

const authController = require("../controllers/authController");
const { authRateLimiter } = require("../middleware/authRateLimiter");
const { logLoginAttempt } = require("../middleware/loginAttemptLogger");
const { verifyToken } = require("../middleware/verifyToken");
const {
  validateRegisterInput,
  validateLoginInput
} = require("../middleware/validateAuthInput");

const router = express.Router();

router.post("/register", authRateLimiter, validateRegisterInput, authController.register);
router.post("/login", authRateLimiter, validateLoginInput, logLoginAttempt, authController.login);
router.get("/google", authRateLimiter, authController.googleAuth);
router.get("/callback", authController.oauthCallback);
router.post("/logout", verifyToken, authController.logout);

module.exports = router;
