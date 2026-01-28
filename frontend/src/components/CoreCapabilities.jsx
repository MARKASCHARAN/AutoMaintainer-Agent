import { motion } from "framer-motion";
import { 
  BrainCircuit, 
  ShieldAlert, 
  GitMerge, 
  Terminal, 
  Zap, 
  Search 
} from "lucide-react";

export default function CoreCapabilities() {
  return (
    <section className="py-32 bg-[#05060f] relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-black to-transparent" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-white text-transparent bg-clip-text mb-6">
            Everything you need to <br />
            <span className="text-indigo-400">automate maintenance.</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            AutoMaintainer isn't just a wrapper around an LLM. It's a complete engineering platform designed to handle the messy reality of code.
          </p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Large Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-2 rounded-3xl p-8 bg-zinc-900/50 border border-white/10 hover:border-indigo-500/30 transition-colors flex flex-col justify-between group overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <BrainCircuit size={200} />
            </div>
            
            <div className="z-10">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">Deep Context Awareness</h3>
              <p className="text-zinc-400 leading-relaxed max-w-md">
                Most AI tools only see the file you give them. AutoMaintainer builds a mental map of your entire dependency tree to understand how a change in `utils.js` breaks `UserDashboard.jsx`.
              </p>
            </div>
          </motion.div>

          {/* Tall Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="md:row-span-2 rounded-3xl p-8 bg-zinc-900/50 border border-white/10 hover:border-pink-500/30 transition-colors flex flex-col group relative overflow-hidden"
          >
             <div className="absolute bottom-[-20px] right-[-20px] p-10 opacity-10 group-hover:opacity-20 transition-opacity">
               <ShieldAlert size={180} />
             </div>
             
             <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-6">
                <ShieldAlert size={24} />
             </div>
             <h3 className="text-2xl font-bold text-zinc-100 mb-4">Hallucination Firewall</h3>
             <div className="space-y-4 text-zinc-400 leading-relaxed">
               <p>We don't trust the model. Every generated patch goes through a rigid verification layer:</p>
               <ul className="space-y-3 text-sm">
                 <li className="flex gap-2 items-center"><span className="text-green-400">✓</span> Syntax Validation</li>
                 <li className="flex gap-2 items-center"><span className="text-green-400">✓</span> Dependency Check</li>
                 <li className="flex gap-2 items-center"><span className="text-green-400">✓</span> Build Integrity</li>
                 <li className="flex gap-2 items-center"><span className="text-green-400">✓</span> Test Regression</li>
               </ul>
             </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-zinc-900/50 border border-white/10 hover:border-cyan-500/30 transition-colors flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Search size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Smart Diagnosis</h3>
              <p className="text-zinc-400 text-sm">Reads error logs & stack traces like a senior engineer.</p>
            </div>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="rounded-3xl p-8 bg-zinc-900/50 border border-white/10 hover:border-emerald-500/30 transition-colors flex flex-col justify-between"
          >
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <GitMerge size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-zinc-100 mb-2">Clean PRs</h3>
              <p className="text-zinc-400 text-sm">Writes semantic commits and detailed PR descriptions.</p>
            </div>
          </motion.div>

          {/* Large Card 5 */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             viewport={{ once: true }}
             className="md:col-span-2 rounded-3xl p-8 bg-gradient-to-br from-indigo-900/20 to-zinc-900/50 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-8 group"
          >
            <div className="flex-1">
              <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mb-6">
                <Terminal size={24} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-100 mb-2">CLI & Web Interface</h3>
              <p className="text-zinc-400 leading-relaxed">
                Run it from your terminal or visualize the agent's thought process in our real-time web console. Total observability into every decision.
              </p>
            </div>
            {/* Abstract visual */}
            <div className="hidden md:flex gap-2">
               <div className="w-2 h-16 bg-indigo-500 rounded-full animate-pulse" />
               <div className="w-2 h-24 bg-cyan-500 rounded-full animate-pulse delay-75" />
               <div className="w-2 h-12 bg-pink-500 rounded-full animate-pulse delay-150" />
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
