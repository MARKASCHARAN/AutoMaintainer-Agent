import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Circle } from "lucide-react";

export default function AgentTimeline({ steps }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="border border-white/5 rounded-xl bg-zinc-900/50 p-6 h-full backdrop-blur"
    >
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-6">
        Pipeline Steps
      </h3>

      <div className="space-y-2">
        <AnimatePresence>
          {steps.map((step) => {
            const isComplete = step.status === "complete";
            const isRunning = step.status === "running";
            const isPending = step.status === "pending";

            return (
              <motion.div
                key={step.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`
                  relative flex items-center gap-3 p-3 rounded-lg overflow-hidden
                  transition-colors
                  ${isRunning ? "bg-indigo-500/10" : "hover:bg-white/5"}
                `}
              >
                {/* Subtle animated glow when running */}
                {isRunning && (
                  <motion.div
                    className="absolute inset-0 bg-indigo-500/10 blur-xl"
                    animate={{ opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Icon */}
                <div className="relative z-10 flex-shrink-0">
                  {isComplete && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Check size={16} className="text-emerald-500" />
                    </motion.div>
                  )}

                  {isRunning && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.4 }}
                    >
                      <Loader2 size={16} className="text-indigo-500 animate-spin" />
                    </motion.div>
                  )}

                  {isPending && <Circle size={16} className="text-zinc-700" />}
                </div>

                {/* Name */}
                <div className="relative z-10 flex-grow">
                  <span
                    className={`text-sm font-medium ${
                      isComplete
                        ? "text-zinc-300"
                        : isRunning
                        ? "text-indigo-400"
                        : "text-zinc-500"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Running label */}
                <AnimatePresence>
                  {isRunning && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 text-xs text-indigo-500 font-mono"
                    >
                      Running…
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
