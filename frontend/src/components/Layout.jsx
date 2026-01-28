import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* Add padding-top to offset fixed navbar */}
      <main className="flex-grow w-full pt-16">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
