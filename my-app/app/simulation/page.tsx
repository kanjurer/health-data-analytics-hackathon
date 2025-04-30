'use client';

import { useEffect, useState, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import BackButton from '@/components/BackButton';
import AgentScatterChart from '@/components/AgentScatterChart';

type Agent = {
  id: number;
  name: string;
  description: string;
  trust: number;
  hesitancy: number;
};

function generateInitialAgents(n: number): Agent[] {
  return Array.from({ length: n }, (_, id) => {
    const trust = 0.4;
    const hesitancy = 0.3;
    return {
      id,
      name: `Agent ${id + 1}`,
      description: `A simulated persona with trust=${trust.toFixed(
        2
      )} and hesitancy=${hesitancy.toFixed(2)}`,
      trust,
      hesitancy,
    };
  });
}

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export default function Simulation() {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const [agents, setAgents] = useState<Agent[]>(generateInitialAgents(10));
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Agent update loop
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          trust: clamp(agent.trust + 0.002, 0, 1),
          hesitancy: clamp(agent.hesitancy + 0.002, 0, 1),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Progress bar loop
  useEffect(() => {
    if (isPaused) {
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 200);

    return () => {
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isPaused]);

  const togglePause = () => setIsPaused(!isPaused);

  return (
    <div className="bg-white dark:bg-[#15202b] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Main 2-column layout */}
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mx-auto px-4 py-6 max-w-7xl">
        {/* Left: Agent Chart & List */}
        <div className="pr-2 h-[calc(100vh-100px)] overflow-y-auto">
          <BackButton />
          <AgentScatterChart data={agents} />

          {/* Agent Detail View */}
          {selectedAgent && (
            <div className="bg-blue-100 dark:bg-[#1d2a36] shadow-md mt-4 p-4 border border-[#1d9bf0] rounded-xl text-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-[#1d9bf0]">
                  {selectedAgent.name}
                </span>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="text-[#1d9bf0] text-xs hover:underline"
                >
                  Close
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {selectedAgent.description}
              </p>
              <p className="mt-2 text-gray-700 dark:text-gray-300">
                Trust: {selectedAgent.trust.toFixed(2)}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Hesitancy: {selectedAgent.hesitancy.toFixed(2)}
              </p>
            </div>
          )}

          {/* Agent List */}
          <div className="space-y-2 mt-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              Agents
            </h2>
            <div className="space-y-2 pr-2 max-h-60 overflow-y-auto">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className="bg-white hover:bg-gray-100 dark:bg-[#192734] dark:hover:bg-[#253341] p-3 border border-gray-200 dark:border-[#2f3336] rounded-lg w-full text-left transition"
                >
                  <div className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                    {agent.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                    {agent.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Scrollable Tweet Feed */}
        <div className="h-[calc(100vh-100px)] overflow-hidden">
          <div className="space-y-4 pr-2 h-full overflow-y-auto">
            {[...Array(20)].map((_, i) => (
              <TweetCard
                key={i}
                username={`User${i}`}
                content={`This is tweet #${i + 1}`}
                tags={['vaccine', 'hesitancy', 'simulation']}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bottom-0 left-0 z-50 fixed flex justify-between items-center bg-white dark:bg-[#1e2732] p-3 px-6 border-gray-200 dark:border-gray-700 border-t w-full">
        <div className="relative bg-gray-200 dark:bg-gray-700 rounded-full w-full h-2 overflow-hidden">
          <div
            className="absolute bg-[#1d9bf0] h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={togglePause}
          className="ml-4 text-[#1d9bf0] hover:text-[#1a8cd8] transition"
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
      </div>
    </div>
  );
}

function TweetCard({
  username,
  content,
  tags = [],
}: {
  username: string;
  content: string;
  tags?: string[];
}) {
  return (
    <div className="space-y-2 bg-white dark:bg-[#192734] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl text-gray-800 dark:text-gray-100">
      <div className="font-semibold text-sm">@{username}</div>
      <div className="text-gray-700 dark:text-gray-300 text-sm">{content}</div>
      <div className="flex flex-wrap gap-2 pt-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-block bg-[#e1ecf4] dark:bg-[#253341] px-3 py-1 rounded-full font-medium text-[#1d9bf0] text-xs"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
