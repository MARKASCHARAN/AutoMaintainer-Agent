import { motion } from "framer-motion";
import { Bot, ShieldCheck, GitPullRequest } from "lucide-react";

const features = [
  {
    icon: Bot,
    label: "AGENT LOOP",
    title: "Observe → Reason → Act",
    description:
      "A structured agent lifecycle that continuously observes repositories, diagnoses root causes, plans minimal fixes, and executes them safely."
  },
  {
    icon: ShieldCheck,
    label: "SAFETY LAYER",
    title: "Hallucination-Resistant Execution",
    description:
      "Every patch is validated against real file contents, rejected if unsafe, and verified through tests or build checks before touching GitHub."
  },
  {
    icon: GitPullRequest,
    label: "REAL-WORLD OUTPUT",
    title: "Autonomous GitHub Integration",
    description:
      "Creates commits, pushes branches, generates PR descriptions, and opens real pull requests using the GitHub API."
  }
];

export default function FeatureGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 mt-24">
      {/* Section header (not hero-like) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mb-12"
      >
        <p className="text-xs uppercase tracking-widest text-indigo-400 mb-3">
          Architecture Overview
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-zinc-100 mb-4">
          Designed as an autonomous system, not a chatbot
        </h2>
        <p className="text-zinc-400 leading-relaxed">
          AutoMaintainer is structured like real infrastructure software — with clear separation of reasoning, safety, execution, and verification layers.
        </p>
      </motion.div>

      {/* Feature rows (not cards) */}
      <div className="space-y-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="group grid grid-cols-1 md:grid-cols-5 gap-6 p-6 rounded-2xl border border-white/5 bg-zinc-900/40 hover:border-indigo-500/20 transition-all"
            >
              {/* Icon column */}
              <div className="md:col-span-1 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 group-hover:bg-indigo-500/10 transition">
                  <Icon size={22} className="text-indigo-400" />
                </div>
              </div>

              {/* Content */}
              <div className="md:col-span-4">
                <p className="text-xs tracking-widest text-zinc-500 mb-2">
                  {f.label}
                </p>
                <h3 className="text-xl font-semibold text-zinc-100 mb-2">
                  {f.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-3xl">
                  {f.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
