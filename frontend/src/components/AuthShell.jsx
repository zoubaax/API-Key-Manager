import { Link } from "react-router-dom";

function AuthShell({ title, subtitle, alternateText, alternateLink, children }) {
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="relative overflow-hidden rounded-[32px] border border-white/70 bg-slate-950 px-8 py-10 text-white shadow-2xl shadow-slate-900/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.32),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.22),_transparent_30%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-5">
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-amber-200">
                Smart API Gateway
              </span>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
                Secure access for every API call, without exposing a single key.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-200">
                Use Supabase authentication, role-based access, and a clean control
                plane for users and admins inside your API Key Manager.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Session persistence</p>
                <p className="mt-2 text-xl font-semibold">Built in</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">Admin routing</p>
                <p className="mt-2 text-xl font-semibold">Protected</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-300">JWT ready</p>
                <p className="mt-2 text-xl font-semibold">Backend aware</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center">
          <div className="w-full rounded-[28px] border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/60 backdrop-blur">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                {title}
              </h2>
              <p className="text-sm leading-6 text-slate-600">{subtitle}</p>
            </div>

            {children}

            <p className="mt-6 text-sm text-slate-600">
              {alternateText}{" "}
              <Link className="font-semibold text-sky-700 hover:text-sky-900" to={alternateLink.to}>
                {alternateLink.label}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AuthShell;
