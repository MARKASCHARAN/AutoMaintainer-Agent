import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";

const TAG_COLORS = {
  Observer: "text-cyan-400",
  Diagnoser: "text-yellow-400",
  Planner: "text-purple-400",
  Executor: "text-indigo-400",
  Verifier: "text-emerald-400",
  "PR Manager": "text-pink-400",
};

export default function LogsConsole({ logs }) {
  const consoleRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCopy = () => {
    const text = logs.map(l => `[${l.agent}] ${l.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="border border-white/5 rounded-xl bg-[#0a0a0a] overflow-hidden flex flex-col h-full font-mono text-sm leading-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#0f0f0f] backdrop-blur">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-zinc-500" />
          <span className="text-zinc-400">Live Agent Logs</span>
        </div>

        <button
          onClick={handleCopy}
          className="text-zinc-600 hover:text-white transition-colors flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-xs text-emerald-500">Copied</span>
            </>
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>

      {/* Console */}
      <div
        ref={consoleRef}
        className="flex-grow p-4 overflow-y-auto space-y-1 text-zinc-300 min-h-[400px]"
      >
        {logs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full flex items-center justify-center text-zinc-700"
          >
            <span className="animate-pulse">Waiting for agent to initialize…</span>
          </motion.div>
        ) : (
          <AnimatePresence initial={false}>
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="break-all"
              >
                <span className="text-zinc-600 mr-2 select-none">
                  {new Date().toLocaleTimeString("en-US", { hour12: false })}
                </span>
                <span
                  className={`font-medium mr-2 ${
                    TAG_COLORS[log.agent] || "text-zinc-400"
                  }`}
                >
                  {log.agent}
                </span>
                <span className="text-zinc-300">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
}
