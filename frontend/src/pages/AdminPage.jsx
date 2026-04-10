import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticatedFetch } from "../lib/apiClient";
import { useAuth } from "../context/useAuth";

function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadAdminPanel() {
      setLoading(true);
      setError("");

      try {
        const response = await authenticatedFetch("/admin");
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load admin panel.");
        }

        if (isMounted) {
          setAdminData(payload);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Failed to load admin panel.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadAdminPanel();

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
        <header className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
                Admin panel
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Control center for {user?.email}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                This route is available only when the profile role is <code>admin</code>.
              </p>
            </div>

            <button
              className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-semibold text-white transition hover:bg-white/15"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
            <h2 className="text-xl font-semibold text-slate-900">Protected response</h2>
            <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
              {loading && "Loading admin response..."}
              {!loading && error && <span className="text-rose-300">{error}</span>}
              {!loading && !error && (
                <pre className="overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(adminData, null, 2)}
                </pre>
              )}
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200/70 bg-white/90 p-6 shadow-lg shadow-slate-200/30">
            <h2 className="text-xl font-semibold text-slate-900">Role-based routing</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              The app reads the role from the <code>profiles</code> table after login and uses
              it to send standard users to <code>/dashboard</code> and admins to <code>/admin</code>.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Supabase session persists across refreshes.</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">JWT is attached automatically when calling the backend.</li>
              <li className="rounded-2xl bg-slate-50 px-4 py-3">Unauthorized users are redirected away from admin routes.</li>
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}

export default AdminPage;
