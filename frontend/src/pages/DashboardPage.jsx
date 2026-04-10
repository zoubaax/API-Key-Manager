import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../lib/apiClient";
import { useAuth } from "../context/useAuth";

function DashboardPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectSubmitting, setProjectSubmitting] = useState(false);
  const [keyForms, setKeyForms] = useState({});
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProjects() {
      setLoading(true);
      setError("");

      try {
        const response = await authenticatedFetch("/projects");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load projects.");
        }

        if (isMounted) {
          const nextProjects = payload.projects || [];
          setProjects(nextProjects);
          setSelectedProjectId((current) => current || nextProjects[0]?.id || null);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load projects.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshProjects() {
    const response = await authenticatedFetch("/projects");
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error || "Failed to refresh projects.");
    }

    const nextProjects = payload.projects || [];
    setProjects(nextProjects);
    setSelectedProjectId((current) => {
      if (!nextProjects.length) {
        return null;
      }

      const stillExists = nextProjects.some((project) => project.id === current);
      return stillExists ? current : nextProjects[0].id;
    });
  }

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  async function handleCreateProject(event) {
    event.preventDefault();
    setProjectSubmitting(true);
    setError("");
    setActionMessage("");

    try {
      const response = await authenticatedFetch("/projects", {
        method: "POST",
        body: JSON.stringify({
          name: projectName,
          description: projectDescription
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to create project.");
      }

      setProjectName("");
      setProjectDescription("");
      setActionMessage(`Project "${payload.project.name}" created successfully.`);
      await refreshProjects();
      setSelectedProjectId(payload.project.id);
    } catch (createError) {
      setError(createError.message || "Failed to create project.");
    } finally {
      setProjectSubmitting(false);
    }
  }

  function updateKeyForm(projectId, field, value) {
    setKeyForms((current) => ({
      ...current,
      [projectId]: {
        ...current[projectId],
        [field]: value
      }
    }));
  }

  async function handleAddKey(event, projectId) {
    event.preventDefault();
    setError("");
    setActionMessage("");

    const form = keyForms[projectId] || {};

    try {
      const response = await authenticatedFetch(`/projects/${projectId}/keys`, {
        method: "POST",
        body: JSON.stringify({
          name: form.name || "",
          provider: form.provider || "",
          value: form.value || ""
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to add API key.");
      }

      setKeyForms((current) => ({
        ...current,
        [projectId]: {
          name: "",
          provider: "",
          value: ""
        }
      }));
      setActionMessage(`API key "${payload.apiKey.name}" added successfully.`);
      await refreshProjects();
    } catch (keyError) {
      setError(keyError.message || "Failed to add API key.");
    }
  }

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || projects[0] || null;
  const totalKeys = projects.reduce((total, project) => total + (project.api_keys?.length || 0), 0);

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[30px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
          <div className="flex h-full flex-col">
            <div className="border-b border-white/10 pb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">
                Smart API Gateway
              </p>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight">Workspace</h1>
              <p className="mt-2 text-sm leading-6 text-slate-300">{user?.email}</p>
              <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
                {role}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Projects</p>
                <p className="mt-2 text-2xl font-semibold">{projects.length}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-300">Keys</p>
                <p className="mt-2 text-2xl font-semibold">{totalKeys}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
                  Your projects
                </h2>
                <span className="text-xs text-slate-400">{loading ? "Syncing..." : "Ready"}</span>
              </div>

              <div className="mt-3 space-y-2">
                {projects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    Create your first project to start organizing keys.
                  </div>
                ) : (
                  projects.map((project) => (
                    <button
                      key={project.id}
                      className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                        selectedProject?.id === project.id
                          ? "bg-amber-300 text-slate-950 shadow-lg"
                          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{project.name}</p>
                          <p
                            className={`mt-1 text-xs ${
                              selectedProject?.id === project.id ? "text-slate-700" : "text-slate-300"
                            }`}
                          >
                            {project.description || "No description yet"}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                            selectedProject?.id === project.id
                              ? "bg-slate-950/10 text-slate-800"
                              : "bg-white/10 text-slate-200"
                          }`}
                        >
                          {project.api_keys?.length || 0}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <button
              className="mt-auto rounded-2xl border border-white/15 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="space-y-4">
          <header className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/40">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              Project dashboard
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Build projects and attach API keys
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              Use the sidebar to move between projects. The main panel is focused on creation,
              inspection, and key management for the currently selected workspace.
            </p>
          </header>

          {(error || actionMessage) && (
            <section
              className={`rounded-2xl border px-4 py-3 text-sm ${
                error
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {error || actionMessage}
            </section>
          )}

          <section className="grid gap-4 xl:grid-cols-[380px_1fr]">
            <article className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
              <h3 className="text-xl font-semibold text-slate-900">Create project</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Start a new workspace for a provider or use case, then add multiple keys inside it.
              </p>

              <form className="mt-5 space-y-4" onSubmit={handleCreateProject}>
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Project name</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Google APIs"
                    required
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                    value={projectDescription}
                    onChange={(event) => setProjectDescription(event.target.value)}
                    placeholder="Optional notes about quota strategy or provider details."
                  />
                </label>

                <button
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  type="submit"
                  disabled={projectSubmitting}
                >
                  {projectSubmitting ? "Creating project..." : "Create project"}
                </button>
              </form>
            </article>

            <article className="rounded-[30px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
              {loading ? (
                <div className="rounded-2xl bg-slate-50 px-4 py-10 text-sm text-slate-600">
                  Loading selected project...
                </div>
              ) : !selectedProject ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 px-5 py-10 text-sm text-slate-600">
                  No project selected yet. Create one from the left panel to begin.
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Selected project
                      </p>
                      <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                        {selectedProject.name}
                      </h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                        {selectedProject.description || "No description yet."}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                      {selectedProject.api_keys?.length || 0} keys
                    </span>
                  </div>

                  <div className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Current keys
                      </h4>
                      <div className="mt-3 space-y-3">
                        {(selectedProject.api_keys || []).length === 0 ? (
                          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                            No keys added yet for this project.
                          </div>
                        ) : (
                          selectedProject.api_keys.map((apiKey) => (
                            <div
                              key={apiKey.id}
                              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="font-semibold text-slate-900">{apiKey.name}</p>
                                  <p className="text-sm text-slate-600">{apiKey.provider}</p>
                                </div>
                                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                                  {apiKey.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <form
                      className="space-y-4 rounded-[26px] bg-slate-50 p-5"
                      onSubmit={(event) => handleAddKey(event, selectedProject.id)}
                    >
                      <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Add API key
                      </h4>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">Key name</span>
                        <input
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                          value={(keyForms[selectedProject.id] || {}).name || ""}
                          onChange={(event) =>
                            updateKeyForm(selectedProject.id, "name", event.target.value)
                          }
                          placeholder="Primary key"
                          required
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">Provider</span>
                        <input
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                          value={(keyForms[selectedProject.id] || {}).provider || ""}
                          onChange={(event) =>
                            updateKeyForm(selectedProject.id, "provider", event.target.value)
                          }
                          placeholder="Google Maps"
                          required
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-sm font-medium text-slate-700">API key value</span>
                        <input
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-sky-400"
                          value={(keyForms[selectedProject.id] || {}).value || ""}
                          onChange={(event) =>
                            updateKeyForm(selectedProject.id, "value", event.target.value)
                          }
                          placeholder="Paste the real API key"
                          required
                        />
                      </label>
                      <button
                        className="w-full rounded-2xl border border-slate-900 bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800"
                        type="submit"
                      >
                        Add key to project
                      </button>
                    </form>
                  </div>
                </>
              )}
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
