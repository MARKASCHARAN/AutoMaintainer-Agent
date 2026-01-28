import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Github, Twitter, Linkedin, Terminal, Cpu, Network, Zap } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-zinc-300 selection:bg-white/20">
      
      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      {/* --- HERO --- */}
      <section className="relative z-10 min-h-[80vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto border-x border-white/5">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="h-[1px] w-12 bg-zinc-600" />
            <span className="font-mono text-xs tracking-widest uppercase text-zinc-500">Manifesto v1.0</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tighter mb-8 max-w-4xl">
            The end of <br />
            <span className="text-zinc-500">manual maintenance.</span>
          </h1>
          
          <p className="max-w-xl text-xl text-zinc-400 font-light leading-relaxed">
            Software maintenance consumes 40% of engineering time. 
            We built a machine that reads code, understands intent, and safely evolves systems without human intervention.
          </p>
        </motion.div>
      </section>

      {/* --- STICKY SCROLL STORY --- */}
      <div className="relative border-t border-white/5">
         <StickySection 
            step="01" 
            title="Total Recall" 
            desc="The agent ingests your entire repository into a vector-augmented graph. It knows every function call, every variable, and every dependency."
            visual={<NetworkVisual />}
         />
         <StickySection 
            step="02" 
            title="Neural Reasoning" 
            desc="Using Gemini 1.5 Pro's massive context window, it doesn't just match patterns. It reasons about control flow and edge cases to find the root cause."
            visual={<BrainVisual />}
         />
         <StickySection 
            step="03" 
            title="Surgical Execution" 
            desc="It writes code like a senior engineer: clean, atomic commits. No blind file overwrites. It creates a dedicated branch for every fix."
            visual={<CodeVisual />}
         />
      </div>

       {/* --- BUILDER ID CARD --- */}
      <section className="py-32 px-6 border-t border-white/5 bg-[#080808]">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12 justify-center">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Lead Engineer</span>
          </div>

          <div className="relative group perspective-1000">
             <div className="relative bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-xl overflow-hidden hover:border-white/20 transition-colors duration-500">
                
                {/* Tech aesthetics */}
                <div className="absolute top-4 right-4 font-mono text-[10px] text-zinc-700">ID: MSC-001</div>
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-zinc-700">STATUS: ACTIVE</div>
                
                <div className="flex flex-col md:flex-row gap-10 items-center">
                   <div className="w-32 h-32 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/5 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent" />
                      <span className="text-3xl font-bold text-white/20">M</span>
                   </div>
                   
                   <div className="text-center md:text-left">
                      <h3 className="text-2xl font-bold text-white mb-2">Marka Sai Charan</h3>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                        <Badge>System Architect</Badge>
                        <Badge>AI Research</Badge>
                        <Badge>Full Stack</Badge>
                      </div>
                      <p className="text-zinc-400 font-mono text-sm leading-relaxed mb-6">
                        "Building the autonomous workforce of the future. My goal is to make 'legacy code' a concept of the past."
                      </p>
                      
                      <div className="flex gap-6 justify-center md:justify-start">
                         <SocialIcon icon={<Github size={18} />} />
                         <SocialIcon icon={<Twitter size={18} />} />
                         <SocialIcon icon={<Linkedin size={18} />} />
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Card Shadow/Depth */}
             <div className="absolute -inset-2 bg-gradient-to-r from-red-500/20 to-blue-500/20 rounded-xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 -z-10" />
          </div>
        </div>
      </section>

    </div>
  );
}

/* --- COMPONENTS --- */

function StickySection({ step, title, desc, visual }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh] border-b border-white/5">
       {/* Left: Text (Sticky) */}
       <div className="p-12 md:p-24 flex flex-col justify-center border-r border-white/5 bg-[#050505] relative z-20">
          <span className="font-mono text-5xl font-bold text-zinc-800 mb-8">{step}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{title}</h2>
          <p className="text-lg text-zinc-400 leading-relaxed font-light">{desc}</p>
       </div>
       
       {/* Right: Visual */}
       <div className="bg-[#080808] flex items-center justify-center p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-50" />
          {visual}
       </div>
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono text-zinc-400 uppercase tracking-wide">
      {children}
    </span>
  );
}

function SocialIcon({ icon }) {
  return (
    <a href="#" className="text-zinc-500 hover:text-white transition-colors">
      {icon}
    </a>
  );
}

/* --- VISUALS --- */

function NetworkVisual() {
  return (
    <div className="relative w-64 h-64">
       {[...Array(3)].map((_, i) => (
         <motion.div 
           key={i}
           className="absolute inset-0 border border-indigo-500/30 rounded-full"
           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
           transition={{ duration: 3, delay: i, repeat: Infinity }}
         />
       ))}
       <div className="absolute inset-0 flex items-center justify-center">
         <Network size={64} className="text-indigo-500" />
       </div>
       {/* Nodes */}
       <motion.div className="absolute top-0 left-10 w-2 h-2 bg-white rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity }} />
       <motion.div className="absolute bottom-10 right-0 w-2 h-2 bg-white rounded-full" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, delay: 1, repeat: Infinity }} />
    </div>
  )
}

function BrainVisual() {
  return (
    <div className="relative">
       <Cpu size={120} className="text-zinc-700" />
       <motion.div 
          className="absolute inset-0 text-indigo-400 mix-blend-overlay"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
       >
         <Cpu size={120} />
       </motion.div>
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         <Zap size={32} className="text-yellow-400 fill-yellow-400" />
       </div>
    </div>
  )
}

function CodeVisual() {
  return (
    <div className="w-full max-w-sm bg-black border border-white/10 rounded-lg p-6 font-mono text-xs text-zinc-500 relative overflow-hidden">
       <div className="flex gap-2 mb-4">
         <div className="w-3 h-3 rounded-full bg-red-500/20" />
         <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
         <div className="w-3 h-3 rounded-full bg-green-500/20" />
       </div>
       <div className="space-y-2">
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1 }} className="h-2 bg-zinc-800 rounded w-3/4 overflow-hidden" />
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.2 }} className="h-2 bg-indigo-900/50 rounded w-1/2 overflow-hidden" />
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.4 }} className="h-2 bg-zinc-800 rounded w-full overflow-hidden" />
         <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 1, delay: 0.6 }} className="h-2 bg-zinc-800 rounded w-2/3 overflow-hidden" />
       </div>
       <div className="absolute bottom-2 right-2 flex gap-1">
          <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
       </div>
    </div>
  )
}
