import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HeroSection from './components/HeroSection';
import FeatureGrid from './components/FeatureGrid';
import AgentConsole from './components/AgentConsole';
import ArchitectureView from './components/About';
import DemoShowcase from './components/DemoShowcase';
import FloatingAgents from './components/FloatingAgents';
import TechMarquee from './components/TechMarquee';
import AgentWorkflow from './components/AgentWorkflow';
import WobbleShowcase from './components/WobbleShowcase';



// Landing Page Component
function LandingPage() {
  return (
    <div className="flex flex-col bg-black">
      <HeroSection />
      <div className="relative z-20">
        <TechMarquee />
        <WobbleShowcase />
        <AgentWorkflow />
        <DemoShowcase />
      </div>
      <FloatingAgents />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LandingPage />} />
        <Route path="agent" element={<AgentConsole />} />
        <Route path="about" element={<ArchitectureView />} />
      </Route>
    </Routes>
  );
}

export default App;


