function LoadingSpinner({ label = "Loading...", fullScreen = false }) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center px-6"
          : "flex items-center justify-center py-8"
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-amber-500" />
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
