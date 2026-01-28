import { motion } from "framer-motion";
import { Eye, Brain, Map, Code2, ShieldCheck } from "lucide-react";

export default function ArchitectureView() {
  const steps = [
    { icon: Eye, title: "Observer", desc: "Monitors repository state, commits, failures, context." },
    { icon: Brain, title: "Diagnoser", desc: "Builds mental model of failure using Gemini reasoning." },
    { icon: Map, title: "Planner", desc: "Designs minimal, safe patch strategy step-by-step." },
    { icon: Code2, title: "Executor", desc: "Applies constrained diffs — never blind edits." },
    { icon: ShieldCheck, title: "Verifier", desc: "Runs builds/tests before real-world action." },
  ];

  return (
    <section className="relative overflow-hidden py-28">
      
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-300px] -translate-x-1/2 w-[900px] h-[900px] bg-indigo-600/10 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Autonomous Architecture
          </h2>
          <p className="text-zinc-400 text-lg max-w-3xl mx-auto leading-relaxed">
            AutoMaintainer is not a script.  
            It is a closed-loop autonomous system that perceives, reasons, acts, and verifies —
            similar to how real engineers operate.
          </p>
        </motion.div>

        {/* Pipeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8">

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-zinc-900/70 border border-white/5 backdrop-blur rounded-2xl p-6 h-full hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">

                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-indigo-500/10 mb-6 group-hover:bg-indigo-500/20 transition">
                  <step.icon className="text-indigo-400" size={22} />
                </div>

                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Animated connection line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-indigo-500/40 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Philosophy block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-24 max-w-4xl mx-auto text-center bg-zinc-900/60 border border-white/5 rounded-3xl p-10 backdrop-blur"
        >
          <h3 className="text-2xl font-bold mb-6">
            Why This Architecture Matters
          </h3>
          <p className="text-zinc-400 leading-relaxed text-lg">
            Most AI tools generate code once and hope for the best.  
            AutoMaintainer instead forms a **self-correcting feedback loop**.  
            Every failure strengthens the next decision.  
            This is not automation. This is **autonomous engineering**.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
