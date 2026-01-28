import React from "react";
import { WobbleCard } from "./ui/wobble-card";

export default function WobbleShowcase() {
  return (
    <section className="py-20 bg-black overflow-hidden px-4 md:px-6">
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold bg-white text-transparent bg-clip-text mb-6">
          System Intelligence
        </h2>
        <p className="text-zinc-400 text-lg">
          Powered by advanced reasoning models and a secure execution sandbox.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        
        {/* Card 1 */}
        <WobbleCard
          containerClassName="col-span-1 lg:col-span-2 h-full bg-pink-900/40 min-h-[500px] lg:min-h-[300px]"
          className=""
        >
          <div className="max-w-xs">
            <h2 className="text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Autonomous Orchestration Engine
            </h2>
            <p className="mt-4 text-left text-base/6 text-zinc-200">
              The agent doesn't just guess. It orchestrates a multi-step loop: Observer, Diagnoser, Planner, Executor, and Verifier.
            </p>
          </div>
          {/* Abstract Graphic */}
          <div className="absolute -right-10 -bottom-10 opacity-50">
             <div className="w-64 h-64 bg-pink-500 blur-[100px] rounded-full" />
          </div>
        </WobbleCard>

        {/* Card 2 */}
        <WobbleCard containerClassName="col-span-1 min-h-[300px] bg-indigo-900/40">
          <h2 className="max-w-80 text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
            Noise Reduction
          </h2>
          <p className="mt-4 max-w-[26rem] text-left text-base/6 text-zinc-200">
            It filters out non-critical logs and focuses only on breaking changes and distinct errors.
          </p>
        </WobbleCard>
        
        {/* Card 3 */}
        <WobbleCard containerClassName="col-span-1 lg:col-span-3 bg-blue-900/40 min-h-[500px] lg:min-h-[600px] xl:min-h-[300px]">
          <div className="max-w-sm">
            <h2 className="max-w-sm md:max-w-lg text-left text-balance text-base md:text-xl lg:text-3xl font-semibold tracking-[-0.015em] text-white">
              Gemini 3.5 Pro Reasoning
            </h2>
            <p className="mt-4 max-w-[26rem] text-left text-base/6 text-zinc-200">
              Utilizing a 1M token context window to understand your entire repository structure at once, not just snippets.
            </p>
          </div>
           {/* Abstract Graphic */}
           <div className="absolute -right-10 -bottom-10 opacity-50">
             <div className="w-96 h-96 bg-blue-500 blur-[120px] rounded-full" />
          </div>
        </WobbleCard>
      </div>
    </section>
  );
}
