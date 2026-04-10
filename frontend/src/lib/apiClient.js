import { supabase } from "./supabaseClient";

const backendBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function authenticatedFetch(path, options = {}) {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers || {});

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${backendBaseUrl}${path}`, {
    ...options,
    headers
  });
}
