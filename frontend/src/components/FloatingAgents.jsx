import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FloatingAgents() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const count = 25;
    setParticles(
      Array.from({ length: count }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 6 + Math.random() * 10,
        duration: 8 + Math.random() * 12,
      }))
    );
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500/40 blur-md shadow-[0_0_20px_rgba(99,102,241,0.6)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: ["0%", "30%", "0%"],
            y: ["0%", "-40%", "0%"],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
