import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", label: "Home" },
  { path: "/agent", label: "Agent" },
  { path: "/about", label: "About" },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* Top Navbar (Visible on both mobile + desktop) */}
      <nav className="sticky top-0 z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
  to="/"
  className="text-xl md:text-2xl font-bold px-4 py-1 rounded-xl
             bg-white/5 backdrop-blur border border-white/10
             hover:bg-white/10 transition"
>
  <span className="text-purple-400">Auto</span>
  <span className="text-white ml-1">Maintainer</span>
</Link>


          {/* Desktop Tabs */}
          <div className="hidden md:flex relative items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10">
            {tabs.map((tab) => {
              const active = pathname === tab.path;

              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="relative px-4 py-1.5 text-sm font-medium text-zinc-400 hover:text-white"
                >
                  {active && (
                    <motion.div
                      layoutId="desktop-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Bottom Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
        <div className="flex justify-around items-center h-14">
          {tabs.map((tab) => {
            const active = pathname === tab.path;

            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="relative flex flex-col items-center justify-center text-xs text-zinc-400"
              >
                {active && (
                  <motion.div
                    layoutId="mobile-indicator"
                    className="absolute -top-1 w-8 h-1 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={active ? "text-white font-medium" : ""}>
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
