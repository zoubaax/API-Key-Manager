import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { useAuth } from "../context/useAuth";

function RegisterPage() {
  const { signup, signupWithGoogle, session, loading, authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setPageError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setPageError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setPageError("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const result = await signup(email, password);

      if (result.session) {
        setSuccessMessage("Account created successfully. You can continue into the app.");
      } else {
        setSuccessMessage(
          "Account created. Check your email if your Supabase project requires email confirmation."
        );
      }
    } catch (error) {
      setPageError(error.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignup() {
    setSubmitting(true);
    setPageError("");
    setSuccessMessage("");

    try {
      await signupWithGoogle();
    } catch (error) {
      setPageError(error.message || "Google sign-up failed.");
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create account"
      subtitle="Register with email and password. New users receive the default role of user."
      alternateText="Already registered?"
      alternateLink={{ to: "/login", label: "Go to sign in" }}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Confirm password</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Re-enter your password"
            required
          />
        </label>

        {(pageError || authError) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {pageError || authError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <button
          className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        <button
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          type="button"
          onClick={handleGoogleSignup}
          disabled={submitting}
        >
          Create account with Google
        </button>
      </form>
    </AuthShell>
  );
}

export default RegisterPage;
