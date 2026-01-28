import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";

export default function DemoShowcase() {
  return (
    <section className="relative py-32 overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[900px] bg-indigo-600/10 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-6"
        >
          See the Agent in Action
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-lg max-w-3xl mx-auto mb-16"
        >
          Real logs. Real fixes. Real pull requests.  
          This is not a simulation.
        </motion.p>

        {/* Video container */}
        <motion.div
  initial={{ opacity: 0, scale: 0.96 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
  viewport={{ once: true }}
  className="relative rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_80px_rgba(99,102,241,0.15)] aspect-video group cursor-pointer"
  onClick={() => window.open("https://www.youtube.com/watch?v=2YYjPs8t8MI", "_blank")}
>
  {/* YouTube Thumbnail (4K quality) */}
  <img
    src="https://img.youtube.com/vi/2YYjPs8t8MI/maxresdefault.jpg"
    alt="Demo Preview"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Dark cinematic overlay */}
  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />

  {/* Play button center */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur border border-white/10 rounded-full text-white group-hover:scale-105 transition-transform">
      <PlayCircle size={22} />
      Watch Demo
    </div>
  </div>

  {/* Bottom badge */}
  <div className="absolute bottom-6 right-6 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur rounded-full border border-white/10 text-sm text-zinc-300">
    Live Preview
  </div>
</motion.div>

      </div>
    </section>
  );
}
