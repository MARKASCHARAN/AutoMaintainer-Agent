import { motion } from "framer-motion";
import { Eye, Brain, Hammer, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Eye,
    title: "1. Visual Observation",
    desc: "The agent clones your repo and builds a complete file map, understanding dependencies and context."
  },
  {
    icon: Brain,
    title: "2. Neural Reasoning",
    desc: "Gemini 1.5 Pro analyzes the issue against the codebase to formulate a hypothesis."
  },
  {
    icon: Hammer,
    title: "3. Precision Repair",
    desc: "It writes a minimal, surgical patch. No hallucinated imports. No broken syntax."
  },
  {
    icon: CheckCircle2,
    title: "4. Verification Loop",
    desc: "Runs npm test. If it fails, it reads the error and fixes its own fix. Autonomous."
  }
];

export default function AgentWorkflow() {
  return (
    <section className="py-32 bg-black relative">
       {/* Background Grid */}
       <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent mb-6">
            The Autonomous Loop
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Most agents stops at "Generation". We go further.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-[60px] left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                  {/* Glowing Pulse Ring */}
                  <motion.div 
                    className="absolute inset-0 rounded-full border border-indigo-500/30"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                  />
                  <div className="w-24 h-24 rounded-full bg-[#0a0a0c] border border-white/10 flex items-center justify-center z-10 group-hover:border-indigo-500/50 transition-colors">
                    <step.icon size={36} className="text-indigo-400" />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-lg z-20">
                    {i + 1}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-zinc-100 mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Mobile Line */}
                {i < steps.length - 1 && (
                  <div className="w-0.5 h-12 bg-indigo-500/20 my-6 md:hidden" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
