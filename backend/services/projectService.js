const { adminClient } = require("./supabase");

function getProjectClient() {
  if (!adminClient) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for project management.");
  }

  return adminClient;
}

async function listProjectsForUser(user) {
  const client = getProjectClient();
  let query = client
    .from("projects")
    .select(
      `
        id,
        name,
        description,
        owner_id,
        created_at,
        api_keys (
          id,
          name,
          provider,
          status,
          created_at
        )
      `
    )
    .order("created_at", { ascending: false });

  if (user.role !== "admin") {
    query = query.eq("owner_id", user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

async function createProject({ name, description, ownerId }) {
  const client = getProjectClient();
  const { data, error } = await client
    .from("projects")
    .insert({
      name,
      description,
      owner_id: ownerId
    })
    .select("id, name, description, owner_id, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getProjectById(projectId) {
  const client = getProjectClient();
  const { data, error } = await client
    .from("projects")
    .select("id, name, description, owner_id, created_at")
    .eq("id", projectId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function addApiKeyToProject({ projectId, name, provider, value }) {
  const client = getProjectClient();
  const { data, error } = await client
    .from("api_keys")
    .insert({
      project_id: projectId,
      name,
      provider,
      key_value: value
    })
    .select("id, project_id, name, provider, status, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  listProjectsForUser,
  createProject,
  getProjectById,
  addApiKeyToProject
};
