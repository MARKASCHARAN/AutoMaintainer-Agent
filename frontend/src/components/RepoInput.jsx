import { motion } from "framer-motion";
import { Github, Play, Loader2, Sparkles } from "lucide-react";

export default function RepoInput({ value, onChange, onLaunch, isRunning, disabled }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col md:flex-row gap-4 items-center mb-8"
    >
      {/* Input */}
      <motion.div
        whileFocus={{ scale: 1.01 }}
        className="relative flex-grow w-full group"
      >
        {/* Animated icon */}
        <motion.div
          animate={value ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors"
        >
          <Github size={18} />
        </motion.div>

        {/* Glow on focus */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none bg-indigo-500/5 blur-xl" />

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="github.com/username/repository"
          className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm text-zinc-200 
                     placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 
                     focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono relative z-10"
        />
      </motion.div>

      {/* Button */}
      <motion.button
        whileHover={!disabled ? { scale: 1.04 } : {}}
        whileTap={!disabled ? { scale: 0.96 } : {}}
        onClick={onLaunch}
        disabled={disabled || !value}
        className="relative w-full md:w-auto h-[50px] px-8 rounded-xl font-medium text-sm whitespace-nowrap
                   bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500
                   flex items-center justify-center gap-2 shadow-[0_0_0_0_rgba(99,102,241,0.6)]
                   hover:shadow-[0_0_30px_4px_rgba(99,102,241,0.35)]
                   overflow-hidden"
      >
        {/* Animated shimmer */}
        {!disabled && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          />
        )}

        <span className="relative z-10 flex items-center gap-2">
          {isRunning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Loader2 size={16} />
              </motion.div>
              Agent Running
            </>
          ) : (
            <>
              <Play size={16} fill="currentColor" />
              Launch Agent
            </>
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}
