import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/useAuth";

function LoginPage() {
  const { login, loginWithGoogle, session, role, loading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");

  const redirectTarget =
    location.state?.from?.pathname || (role === "admin" ? "/admin" : "/dashboard");

  if (!loading && session) {
    return <Navigate to={redirectTarget} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setPageError("");

    try {
      const result = await login(email, password);
      navigate(result.role === "admin" ? "/admin" : "/dashboard", { replace: true });
    } catch (error) {
      setPageError(error.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleLogin() {
    setSubmitting(true);
    setPageError("");

    try {
      await loginWithGoogle();
    } catch (error) {
      setPageError(error.message || "Google login failed.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your email and password or continue with Google through Supabase Auth."
      alternateText="Need an account?"
      alternateLink={{ to: "/register", label: "Create one" }}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-400"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none ring-0 transition focus:border-sky-400"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />
        </label>

        {(pageError || authError) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {pageError || authError}
          </div>
        )}

        <button
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <button
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          type="button"
          onClick={handleGoogleLogin}
          disabled={submitting}
        >
          Continue with Google
        </button>
      </form>

      <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
        Your session stays active across refreshes using Supabase session persistence.
      </div>
    </AuthShell>
  );
}

export default LoginPage;
