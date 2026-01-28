import { motion } from "framer-motion";
import { 
  Code2, 
  Cpu, 
  Database, 
  GitBranch, 
  Globe, 
  Layers, 
  Server, 
  Terminal, 
  Workflow
} from "lucide-react";

const TECH_STACK = [
  { name: "Gemini 1.5 Pro", icon: Cpu },
  { name: "FastAPI", icon: Server },
  { name: "React 19", icon: Globe },
  { name: "GitHub API", icon: GitBranch },
  { name: "Tailwind v4", icon: Layers },
  { name: "Python 3.12", icon: Terminal },
  { name: "PostgreSQL", icon: Database },
  { name: "Docker", icon: Code2 },
  { name: "Orchestrator", icon: Workflow },
];

export default function TechMarquee() {
  return (
    <section className="py-24 bg-[#020205] border-y border-white/5 overflow-hidden relative">
      
      <div className="absolute inset-0 bg-gradient-to-r from-[#020205] via-transparent to-[#020205] z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
        <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">
          Powered by Next-Gen Infrastructure
        </p>
      </div>

      <div className="flex overflow-hidden">
        <motion.div 
          className="flex gap-16 items-center pr-16"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {[...TECH_STACK, ...TECH_STACK].map((tech, i) => (
            <div key={i} className="flex items-center gap-4 group opacity-50 hover:opacity-100 transition-opacity cursor-default">
              <tech.icon size={28} className="text-indigo-500 group-hover:text-indigo-400 transition-colors" />
              <span className="text-xl font-semibold text-zinc-300 whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
