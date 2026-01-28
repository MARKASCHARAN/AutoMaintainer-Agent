const STATUS_CONFIG = {
  pending: { dot: 'bg-zinc-600', text: 'text-zinc-500' },
  running: { dot: 'bg-indigo-500 animate-pulse', text: 'text-indigo-400' },
  complete: { dot: 'bg-emerald-500', text: 'text-emerald-400' },
  error: { dot: 'bg-rose-500', text: 'text-rose-400' },
};

export default function StatusPill({ status, children }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  
  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/5 bg-white/5 text-xs font-medium ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {children}
    </span>
  );
}
