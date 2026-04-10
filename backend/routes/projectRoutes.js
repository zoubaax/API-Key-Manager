const express = require("express");

const {
  createProjectHandler,
  createProjectKeyHandler,
  listProjects
} = require("../controllers/projectController");
const { verifyToken } = require("../middleware/verifyToken");

const router = express.Router();

router.use(verifyToken);

router.get("/", listProjects);
router.post("/", createProjectHandler);
router.post("/:projectId/keys", createProjectKeyHandler);

module.exports = router;
