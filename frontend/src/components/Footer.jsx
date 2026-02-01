import { motion } from "framer-motion";
import {
  Github,
  Twitter,
  BookOpen,
  Sparkles,
  Linkedin,
  Globe,
} from "lucide-react";

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
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-indigo-400" />
              <h2 className="text-xl font-semibold text-zinc-100">
                AutoMaintainer Agent
              </h2>
            </div>
            <p className="max-w-md text-zinc-400 leading-relaxed text-sm">
              An autonomous engineering system that observes, reasons, executes,
              and evolves. Built to explore the future of self-healing software
              infrastructure.
            </p>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
            {/* Product */}
            <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Product
              </p>
              <ul className="space-y-3">
                <li>
                  <FooterLink label="Agent Console" href="#" />
                </li>
                <li>
                  <FooterLink label="Architecture" href="#" />
                </li>
                <li>
                  <FooterLink label="Demo Mode" href="#" />
                </li>
              </ul>
            </div>

            {/* Resources */}
            {/* <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Resources
              </p>
              <ul className="space-y-3">
                <li>
                  <FooterLink label="Documentation" href="#" />
                </li>
                <li>
                  <FooterLink label="API Reference" href="#" />
                </li>
                <li>
                  <FooterLink label="Roadmap" href="#" />
                </li>
              </ul>
            </div> */}

            {/* Community / Socials */}
            <div>
              <p className="text-zinc-500 mb-4 uppercase tracking-widest text-xs">
                Community
              </p>
              <ul className="space-y-3">
                <li>
                  <FooterLink
                    label="GitHub"
                    icon={<Github size={14} />}
                    href="https://github.com/MARKASCHARAN"
                  />
                </li>

                <li>
                  <FooterLink
                    label="Twitter / X"
                    icon={<Twitter size={14} />}
                    href="https://twitter.com/markasaicharan"
                  />
                </li>

                <li>
                  <FooterLink
                    label="LinkedIn"
                    icon={<Linkedin size={14} />}
                    href="https://linkedin.com/in/markasaicharan"
                  />
                </li>

                <li>
                  <FooterLink
                    label="Blog / Portfolio"
                    icon={<Globe size={14} />}
                    href="https://markasaicharan.dev"
                  />
                </li>
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
          <span>
            © 2026 AutoMaintainer Agent — Built for the autonomous future.
          </span>
          <span className="text-zinc-600">
            Made by Marka Sai Charan
          </span>
        </motion.div>
      </div>
    </footer>
  );
}

function FooterLink({ label, icon, href }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ x: 4 }}
      className="flex items-center gap-2 text-zinc-400 hover:text-indigo-400 transition-colors"
    >
      {icon}
      {label}
    </motion.a>
  );
}
