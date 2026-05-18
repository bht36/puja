export function AuthButton({ loading, children, className = '', ...props }) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`w-full py-3 rounded-xl bg-[#C28142] hover:bg-[#A66B35] active:scale-[0.98] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
      )}
      {children}
    </button>
  );
}

export function MessageAlert({ type = 'error', message }) {
  if (!message) return null;
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-amber-50 border-amber-200 text-amber-700',
  };
  const icons = { error: '✕', success: '✓', info: 'ℹ' };
  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium ${styles[type]}`}>
      <span className="mt-0.5 shrink-0 font-bold">{icons[type]}</span>
      <span>{message}</span>
    </div>
  );
}
