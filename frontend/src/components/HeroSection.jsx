import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Github,
  Sparkles,
  Terminal,
} from "lucide-react";
import FloatingAgents from "./FloatingAgents";
import { useRef, useEffect } from "react";

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse Tilt Logic
  const x = useMotionValue(0);
  const yMove = useMotionValue(0);
  const rotateX = useSpring(useTransform(yMove, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 20 });

  function handleMouseMove(event) {
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    yMove.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    yMove.set(0);
  }

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[140vh] overflow-hidden bg-[#020205] perspective-2000"
    >
      
      {/* 4K CINEMATIC BACKGROUND */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#020205]/80 via-[#020205]/90 to-[#020205] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=3200&auto=format&fit=crop" 
          alt="Neural Network Background" 
          className="w-full h-full object-cover opacity-40"
        />
      </motion.div>

      {/* Floating Particles */}
      <FloatingAgents />

      <div className="relative z-20 max-w-7xl mx-auto px-6 pt-32 text-center">
        
        {/* BADGE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-md text-indigo-300 text-xs font-semibold tracking-wider uppercase shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            <Sparkles size={12} /> v2.0 Autonomous Engine
          </span>
        </motion.div>

        {/* MASSIVE HEADLINE */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-white mb-8 leading-[0.95]"
        >
          Software that <br />
          <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
             Fixes Itself.
          </span>
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          The first <span className="text-zinc-200 font-medium">autonomous agent</span> that monitors your repo, 
          diagnoses bugs, plans fixes, and merges PRs while you sleep.
          <br className="hidden md:block" />
          <span className="text-indigo-400/80">No hand-holding required.</span>
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-6 mb-24"
        >
          <Link
            to="/agent"
            className="group relative px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-zinc-200 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity" />
            <span>Launch Agent</span>
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-10 py-5 rounded-full font-semibold text-lg text-white border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Github size={20} />
            Star on GitHub
          </a>
        </motion.div>

        {/* 3D FLOATING INTERFACE PREVIEW */}
        <motion.div
          style={{ rotateX, rotateY }}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="relative bg-[#09090b] border border-white/10 rounded-xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.2)] ring-1 ring-white/5 group">
            
            {/* LASER SCANNER ANIMATION */}
            <motion.div 
               className="absolute top-0 left-0 right-0 h-[2px] bg-indigo-500/50 blur-[2px] z-30"
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
               className="absolute top-0 left-0 right-0 h-[40px] bg-gradient-to-b from-indigo-500/10 to-transparent z-20 pointer-events-none"
               animate={{ top: ["0%", "100%", "0%"] }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            {/* Fake Browser/Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                <Terminal size={10} />
                automaintainer-agent — v2.0.4
              </div>
              <div className="w-10" />
            </div>

            {/* Content Mockup */}
            <div className="p-8 font-mono text-left text-sm md:text-base bg-black/50 backdrop-blur-xl h-[400px] flex flex-col">
              <div className="space-y-4">
                <div className="flex gap-3 text-emerald-400">
                  <span className="text-zinc-600">$</span>
                  <span className="typing-effect">automaintainer watch --repo=my-dapp</span>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                >
                  <div className="text-zinc-400">[Observer] <span className="text-white">Scanning repository structure...</span></div>
                  <div className="text-zinc-400">[Observer] Found 24 files, 3 detected issues.</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="pl-4 border-l-2 border-yellow-500/30 my-4"
                >
                  <div className="text-yellow-400 font-bold mb-1">[Diagnoser] Critical Issue Detected</div>
                  <div className="text-zinc-300">Memory leak in <span className="text-indigo-400">useEffect</span> dependency array (UserDashboard.jsx:42)</div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.5 }}
                >
                  <div className="text-zinc-400">[Planner] <span className="text-purple-400">Generating fix strategy...</span></div>
                  <div className="text-zinc-400">[Executor] Applying patch...</div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 4.5 }}
                   className="mt-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400 font-bold">PR</div>
                    <div>
                      <div className="text-emerald-400 font-bold text-sm">PR #42 Created</div>
                      <div className="text-emerald-500/60 text-xs">fix: resolve memory leak in UserDashboard</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/20">Merged</div>
                </motion.div>
              </div>
            </div>

             {/* Reflection Overlay */}
             <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-transparent to-transparent pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-500" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-2xl bg-[#09090b]/80 border border-white/5 backdrop-blur-md shadow-xl hover:border-indigo-500/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-zinc-400 leading-relaxed text-sm">
        {desc}
      </p>
    </motion.div>
  )
}
