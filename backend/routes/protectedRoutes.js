const express = require("express");

const { getDashboard, getAdminPanel } = require("../controllers/protectedController");
const { verifyToken } = require("../middleware/verifyToken");
const { requireRole } = require("../middleware/requireRole");

const router = express.Router();

router.get("/dashboard", verifyToken, getDashboard);
router.get("/admin", verifyToken, requireRole("admin"), getAdminPanel);

module.exports = router;
