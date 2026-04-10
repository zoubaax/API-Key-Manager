const { adminClient, authClient } = require("./supabase");

async function ensureProfile(user) {
  if (!user) {
    return null;
  }

  const client = adminClient || authClient;
  const payload = {
    id: user.id,
    email: user.email,
    role: "user"
  };

  const { data, error } = await client
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("id, email, role, created_at")
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function getProfileById(userId) {
  const client = adminClient || authClient;
  const { data, error } = await client
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", userId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

module.exports = {
  ensureProfile,
  getProfileById
};
