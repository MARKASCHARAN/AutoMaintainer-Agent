import { motion } from "framer-motion";
import { Github, Twitter, BookOpen, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-zinc-950">
      
      {/* Ambient animated background */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-600/10 blur-[160px] rounded-full"
          animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-cyan-600/10 blur-[160px] rounded-full"
          animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        
        {/* Top branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between gap-10 mb-14"
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-indigo-400" />
              <h2 className="text-xl font-semibold text-zinc-100">
                AutoMaintainer Agent
              </h2>
            </div>
            <p className="max-w-md text-zinc-400 leading-relaxed text-sm">
              An autonomous engineering system that observes, reasons, executes, and evolves.
              Built to explore the future of self-healing software infrastructure.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
            <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Product
              </p>
              <ul className="space-y-3">
                <li><FooterLink label="Agent Console" /></li>
                <li><FooterLink label="Architecture" /></li>
                <li><FooterLink label="Demo Mode" /></li>
              </ul>
            </div>

            <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Resources
              </p>
              <ul className="space-y-3">
                <li><FooterLink label="Documentation" /></li>
                <li><FooterLink label="API Reference" /></li>
                <li><FooterLink label="Roadmap" /></li>
              </ul>
            </div>

            <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Community
              </p>
              <ul className="space-y-3">
                <li><FooterLink label="GitHub" icon={<Github size={14} />} /></li>
                <li><FooterLink label="Twitter" icon={<Twitter size={14} />} /></li>
                <li><FooterLink label="Blog" icon={<BookOpen size={14} />} /></li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500"
        >
          <span>© 2026 AutoMaintainer Agent — Built for the autonomous future.</span>
          <span className="text-zinc-600">
            Crafted for VETROX Agentic 3.0 Hackathon
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ label, icon }) {
  return (
    <motion.a
      href="#"
      whileHover={{ x: 4 }}
      className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-colors"
    >
      {icon}
      {label}
    </motion.a>
  );
}
