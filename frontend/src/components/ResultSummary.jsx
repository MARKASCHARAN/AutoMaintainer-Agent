import { motion } from "framer-motion";
import { CheckCircle2, GitPullRequest, ArrowRight, FileCode } from "lucide-react";

export default function ResultSummary({ result }) {
  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="mt-8 border border-emerald-500/20 bg-emerald-500/5 rounded-xl p-6 overflow-hidden relative"
    >
      {/* Subtle success glow */}
      <motion.div
        className="absolute inset-0 bg-emerald-500/10 blur-3xl pointer-events-none"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start">
        
        {/* Left Success Block */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="md:w-64 flex-shrink-0"
        >
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0px rgba(16,185,129,0.4)",
                  "0 0 30px rgba(16,185,129,0.4)",
                  "0 0 0px rgba(16,185,129,0.4)",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="rounded-full"
            >
              <CheckCircle2 className="text-emerald-500" size={26} />
            </motion.div>

            <h2 className="text-lg font-semibold text-emerald-400">
              Execution Verified
            </h2>
          </div>

          <p className="text-sm text-zinc-400 pl-9">
            Agent successfully diagnosed, planned, and fixed the issue in{" "}
            {result.attempts} attempt.
          </p>
        </motion.div>

        {/* Right Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          {/* Files */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-zinc-900 border border-white/5 rounded-lg p-4 transition-all"
          >
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <FileCode size={14} /> Affected Files
            </h3>

            <div className="flex flex-wrap gap-2">
              {result.filesChanged.map((file, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-mono border border-white/5"
                >
                  {file}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* PR Card */}
          <motion.a
            href={result.pullRequestUrl}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            className="group bg-zinc-900 border border-white/5 hover:border-indigo-500/30 rounded-lg p-4 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                <GitPullRequest size={14} /> Pull Request
              </h3>

              <p className="text-sm text-indigo-400 font-medium group-hover:underline break-all line-clamp-2">
                {result.prTitle || "View Pull Request"}
              </p>
            </div>

            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex justify-end mt-2"
            >
              <ArrowRight size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </motion.div>
  );
}
