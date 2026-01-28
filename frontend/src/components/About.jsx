import { motion, useScroll, useTransform } from "framer-motion";
import {
  Eye,
  Brain,
  Map,
  Code2,
  ShieldCheck,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useRef } from "react";

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const yHero = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#020205] text-white overflow-hidden selection:bg-indigo-500/30">

      {/* 4K Background Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[180px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[180px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">

        {/* --- HERO SECTION --- */}
        <motion.section 
          style={{ y: yHero, opacity: opacityHero }}
          className="min-h-[90vh] flex flex-col items-center justify-center text-center pt-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md"
          >
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter mb-8 leading-[0.9]"
          >
            Autonomous <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
              Engineering
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl text-xl md:text-2xl text-zinc-400 leading-relaxed"
          >
            We are moving beyond "Copilots". <br />
            AutoMaintainer is a self-governing agent that treats your codebase like a living organism—diagnosing, fixing, and verifying autonomously.
          </motion.p>
        </motion.section>

        {/* --- ARCHITECTURE GRID --- */}
        <section className="py-32">
          <SectionTitle title="The Cognitive Architecture" subtitle="How it thinks, plans, and acts." />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ArchitectureCard 
              icon={<Eye className="w-8 h-8 text-cyan-400" />} 
              title="Observer" 
              desc="Continuously monitors file changes, logs, and build artifacts. Builds a real-time dependency graph of the repo." 
              delay={0}
            />
            <ArchitectureCard 
              icon={<Brain className="w-8 h-8 text-purple-400" />} 
              title="Reasoning Engine" 
              desc="Uses Gemini 1.5 Pro (1M context) to 'grok' the entire codebase, identifying root causes beyond simple stack traces." 
              delay={0.1}
            />
            <ArchitectureCard 
              icon={<Map className="w-8 h-8 text-yellow-400" />} 
              title="Strategic Planner" 
              desc="Formulates a multi-step repair plan. Decomposes complex bugs into atomic, verifiable edits." 
              delay={0.2}
            />
            <ArchitectureCard 
              icon={<Code2 className="w-8 h-8 text-indigo-400" />} 
              title="Surgical Executor" 
              desc="Applies AST-aware transformations. It doesn't rewrite files; it performs precise surgery on functions and classes." 
              delay={0.3}
            />
            <ArchitectureCard 
              icon={<ShieldCheck className="w-8 h-8 text-emerald-400" />} 
              title="Verification Loop" 
              desc="The firewall against hallucinations. Runs tests after every edit. If tests fail, it self-corrects." 
              delay={0.4}
            />
             <ArchitectureCard 
              icon={<Github className="w-8 h-8 text-white" />} 
              title="Autonomy Layer" 
              desc="Interacts with the real world. Opens PRs, comments on issues, and manages git branches without human help." 
              delay={0.5}
            />
          </div>
        </section>

        {/* --- PHILOSOPHY --- */}
        <section className="py-32 border-t border-white/5">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <h2 className="text-5xl font-bold mb-8 leading-tight">
                  Most tools generate text. <br />
                  <span className="text-indigo-400">We generate fixes.</span>
                </h2>
                <div className="space-y-6 text-lg text-zinc-400">
                  <p>
                    The problem with LLMs isn't intelligence—it's <strong>integration</strong>. A chat interface is not an engineering workflow. 
                  </p>
                  <p>
                    AutoMaintainer closes the loop. It doesn't wait for a prompt. It wakes up when a build fails, fixes it, and goes back to sleep.
                  </p>
                </div>
             </motion.div>
             
             <div className="relative h-[400px] w-full bg-gradient-to-br from-indigo-900/20 to-black border border-white/10 rounded-3xl p-8 overflow-hidden group">
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent z-10" />
                
                {/* Simulated Code Rain / Activity */}
                <div className="font-mono text-xs text-indigo-300 space-y-2 opacity-60 group-hover:opacity-100 transition-opacity">
                   <div className="flex gap-4"><span className="text-zinc-500">09:41:22</span> [Observer] Detected crash in <span className="text-white">UserAuth.ts</span></div>
                   <div className="flex gap-4"><span className="text-zinc-500">09:41:24</span> [Planner] Hypothesis: Null reference in JWT parser</div>
                   <div className="flex gap-4"><span className="text-zinc-500">09:41:25</span> [Executor] Applying patch to line 42...</div>
                   <div className="flex gap-4"><span className="text-zinc-500">09:41:28</span> [Verifier] Running `npm test`... <span className="text-emerald-400">PASSED</span></div>
                   <div className="flex gap-4"><span className="text-zinc-500">09:41:30</span> [GitHub] PR #104 Created: "fix: handle null jwt payload"</div>
                </div>

                <div className="absolute bottom-8 right-8 z-20">
                  <div className="px-6 py-3 bg-white text-black font-bold rounded-full flex items-center gap-2">
                    Autonomous Mode <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>
             </div>
           </div>
        </section>

        {/* --- BUILDER PROFILE --- */}
        <section className="py-32 border-t border-white/5">
           <SectionTitle title="The Builder" subtitle="Forged in code, driven by automation." />
           
           <div className="max-w-4xl mx-auto bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden group">
             {/* Glow Effect */}
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full group-hover:bg-indigo-600/20 transition-colors duration-700" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-14">
               {/* Avatar */}
               <div className="relative">
                 <div className="w-40 h-40 rounded-full bg-zinc-800 border-2 border-white/10 overflow-hidden shadow-2xl relative z-10">
                   {/* Placeholder for avatar, utilizing gradient/initials if no image */}
                   <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-black flex items-center justify-center text-4xl font-bold text-white/20">M</div>
                 </div>
                 {/* Decorative rings */}
                 <div className="absolute inset-0 rounded-full border border-indigo-500/30 scale-110 animate-pulse" />
                 <div className="absolute inset-0 rounded-full border border-purple-500/20 scale-125 animation-delay-500" />
               </div>

               <div className="text-center md:text-left">
                 <h3 className="text-3xl font-bold text-white mb-2">Marka Sai Charan</h3>
                 <p className="text-indigo-400 font-medium tracking-wide uppercase text-sm mb-6">Full Stack Engineer & AI Researcher</p>
                 
                 <p className="text-zinc-400 leading-relaxed mb-8 max-w-lg">
                   "I build systems that build themselves. AutoMaintainer is the culmination of my work in agentic workflows, combining rigorous software engineering principles with probabilistic AI models."
                 </p>

                 <div className="flex gap-4 justify-center md:justify-start">
                   <SocialLink href="#" icon={<Github size={20} />} label="GitHub" />
                   <SocialLink href="#" icon={<Twitter size={20} />} label="Twitter" />
                   <SocialLink href="#" icon={<Linkedin size={20} />} label="LinkedIn" />
                 </div>
               </div>
             </div>
           </div>
        </section>

      </div>
    </div>
  );
}

/* --- UI COMPONENTS --- */

function SectionTitle({ title, subtitle }) {
  return (
    <div className="text-center mb-20">
      <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
      <p className="text-zinc-400 text-lg">{subtitle}</p>
    </div>
  );
}

function ArchitectureCard({ icon, title, desc, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      viewport={{ once: true }}
      className="group p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-900/60 transition-all duration-300 backdrop-blur-sm"
    >
      <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-300 border border-white/5">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a 
      href={href} 
      className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 hover:text-white transition-all text-zinc-400"
      aria-label={label}
    >
      {icon}
    </a>
  );
}
