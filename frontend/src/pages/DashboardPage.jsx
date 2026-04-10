import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../lib/apiClient";
import { useAuth } from "../context/useAuth";

function DashboardPage() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");

      try {
        const response = await authenticatedFetch("/dashboard");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load dashboard.");
        }

        if (isMounted) {
          setDashboardData(payload);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load dashboard.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/40 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">
              User dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
              Welcome back, {user?.email}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Your role is <span className="font-semibold text-slate-900">{role}</span>.
            </p>
          </div>

          <button
            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-50"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
            <h2 className="text-xl font-semibold text-slate-900">Backend integration</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This page calls the protected backend route using the current Supabase JWT in
              the <code>Authorization</code> header.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              {loading && "Loading dashboard response..."}
              {!loading && error && <span className="text-rose-300">{error}</span>}
              {!loading && !error && (
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(dashboardData, null, 2)}
                </pre>
              )}
            </div>
          </article>

          <aside className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
            <h2 className="text-xl font-semibold text-slate-900">Session summary</h2>
            <dl className="mt-5 space-y-4 text-sm text-slate-600">
              <div>
                <dt className="font-medium text-slate-900">Authenticated user</dt>
                <dd className="mt-1">{user?.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Role from profiles table</dt>
                <dd className="mt-1">{role}</dd>
              </div>
              <div>
                <dt className="font-medium text-slate-900">Access level</dt>
                <dd className="mt-1">Standard application user</dd>
              </div>
            </dl>
          </aside>
        </section>
      </div>
    </main>
  );
}

export default DashboardPage;
