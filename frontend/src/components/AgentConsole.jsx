import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RepoInput from './RepoInput';
import AgentTimeline from './AgentTimeline';
import LogsConsole from './LogsConsole';
import ResultSummary from './ResultSummary';

export default function AgentConsole() {
  const [repoUrl, setRepoUrl] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [result, setResult] = useState(null);
  const [steps, setSteps] = useState([
    { id: 'observer', name: 'Observer', status: 'pending' },
    { id: 'diagnoser', name: 'Diagnoser', status: 'pending' },
    { id: 'planner', name: 'Planner', status: 'pending' },
    { id: 'executor', name: 'Executor', status: 'pending' },
    { id: 'verifier', name: 'Verifier', status: 'pending' },
    { id: 'pr-manager', name: 'PR Manager', status: 'pending' },
  ]);

  const runAgent = async () => {
    if (!repoUrl) return;

    setIsRunning(true);
    setResult(null);
    setLogs([]);
    setSteps(prev => prev.map(s => ({ ...s, status: 'pending' })));

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const streamUrl =
  `${BASE_URL}/stream-agent?repo_url=${encodeURIComponent(repoUrl)}`;


    const eventSource = new EventSource(streamUrl);

    eventSource.onmessage = (event) => {
      const rawLog = event.data;
      const match = rawLog.match(/^\[(.*?)\s*\]\s*(.*)$/);
      const agent = match ? match[1] : 'System';
      const message = match ? match[2] : rawLog;

      setLogs(prev => [...prev.slice(-99), { agent, message }]);

      const agentStepMap = {
        Observer: 'observer',
        Diagnoser: 'diagnoser',
        Planner: 'planner',
        Executor: 'executor',
        Verifier: 'verifier',
        GitHub: 'pr-manager',
        'PR Manager': 'pr-manager'
      };

      if (agentStepMap[agent]) {
        const activeStepId = agentStepMap[agent];
        const stepIds = ['observer', 'diagnoser', 'planner', 'executor', 'verifier', 'pr-manager'];

        setSteps(prev =>
          prev.map(s => {
            const stepIndex = stepIds.indexOf(s.id);
            const activeIndex = stepIds.indexOf(activeStepId);

            if (s.id === activeStepId) return { ...s, status: 'running' };
            if (stepIndex < activeIndex) return { ...s, status: 'complete' };
            return s;
          })
        );
      }
    };

    eventSource.addEventListener('result', (event) => {
      const resultData = JSON.parse(event.data);

      setSteps(prev => prev.map(s => ({ ...s, status: 'complete' })));

      setResult({
        status: 'success',
        attempts: resultData.attempts || 1,
        filesChanged: resultData.files_changed || [],
        pullRequestUrl: resultData.pr,
        prTitle: resultData.pr_title || 'AutoMaintainer Fix',
      });

      eventSource.close();
      setIsRunning(false);
    });

    eventSource.onerror = () => {
      if (eventSource.readyState === EventSource.CLOSED) {
        setIsRunning(false);
      }
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 md:py-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Command Center</h1>
        <p className="text-zinc-400 text-sm md:text-base">
          Initialize autonomous maintenance for your repository.
        </p>
      </motion.div>

      {/* Input */}
      <RepoInput
        value={repoUrl}
        onChange={setRepoUrl}
        onLaunch={runAgent}
        isRunning={isRunning}
        disabled={isRunning}
      />

      {/* Main Panels */}
      <motion.div
        layout
        transition={{ layout: { duration: 0.4, ease: 'easeInOut' } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 h-[800px] md:h-auto lg:h-[600px]"
      >
        <motion.div layout className="h-[300px] lg:h-full overflow-hidden">
          <AgentTimeline steps={steps} />
        </motion.div>

        <motion.div layout className="h-[400px] lg:h-full overflow-hidden">
          <LogsConsole logs={logs} />
        </motion.div>
      </motion.div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <ResultSummary result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
