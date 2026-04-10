const {
  addApiKeyToProject,
  createProject,
  getProjectById,
  listProjectsForUser
} = require("../services/projectService");

function canAccessProject(user, project) {
  return user.role === "admin" || project.owner_id === user.id;
}

async function listProjects(req, res, next) {
  try {
    const projects = await listProjectsForUser(req.user);
    return res.status(200).json({ projects });
  } catch (error) {
    return next(error);
  }
}

async function createProjectHandler(req, res, next) {
  try {
    const { name, description = "" } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 3) {
      return res.status(400).json({ error: "Project name must be at least 3 characters long." });
    }

    const project = await createProject({
      name: name.trim(),
      description: typeof description === "string" ? description.trim() : "",
      ownerId: req.user.id
    });

    return res.status(201).json({ project });
  } catch (error) {
    return next(error);
  }
}

async function createProjectKeyHandler(req, res, next) {
  try {
    const { projectId } = req.params;
    const { name, provider, value } = req.body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Key name must be at least 2 characters long." });
    }

    if (!provider || typeof provider !== "string" || provider.trim().length < 2) {
      return res.status(400).json({ error: "Provider is required." });
    }

    if (!value || typeof value !== "string" || value.trim().length < 10) {
      return res.status(400).json({ error: "API key value looks too short." });
    }

    const project = await getProjectById(projectId);

    if (!canAccessProject(req.user, project)) {
      return res.status(403).json({ error: "Forbidden: you cannot modify this project." });
    }

    const apiKey = await addApiKeyToProject({
      projectId,
      name: name.trim(),
      provider: provider.trim(),
      value: value.trim()
    });

    return res.status(201).json({ apiKey });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listProjects,
  createProjectHandler,
  createProjectKeyHandler
};
