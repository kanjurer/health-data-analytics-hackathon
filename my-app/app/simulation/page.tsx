'use client';

import { getAgents, pauseRun, resumeRun, statusRun } from '@/fetchapi';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import BackButton from '@/components/BackButton';
import AgentScatterChart from '@/components/AgentScatterChart';
import { getFlag } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

type Agent = {
  id: number;
  name: string;
  description: string;
  trust: number;
  hesitancy: number;
  age: number;
  gender: string;
  nationality: string;
  education: string;
  occupation: string;
  location_type: string;
  income_bracket: string;
  marital_status: string;
  number_of_children: number;
  prior_vaccine_experience: string;
  vaccine_belief: string;
  personality_traits: string[];
};

function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export default function Simulation() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [tweetFeed, setTweetFeed] = useState<Tweet[]>([]);
  const [status, setStatus] = useState({});

  // Fetch agents on mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (err) {
        console.error('Error fetching agents:', err);
      }
    };
    fetchAgents();
  }, []);

  // Poll simulation status only when running
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (!isPaused || progress !== 100) {
      interval = setInterval(async () => {
        const status = await statusRun();
        setIsPaused(status.paused);
        setTweetFeed(status.tweetfeed);
        setStatus(status);
        console.log('Simulation status:', status);

        if (status.total_duration > 0) {
          const calculatedProgress =
            100 * (1 - status.duration_remaining / status.total_duration);
          setProgress(clamp(calculatedProgress, 0, 100));
        }

        if (status.duration_remaining === 0) {
          clearInterval(interval);
          // router.push('/dashboard');
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused, progress]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(async () => {
      const status = await statusRun();
      setIsPaused(status.paused);
      setTweetFeed(status.tweetfeed);
      setStatus(status);
      console.log('Simulation status:', status);

      if (status.total_duration > 0) {
        const calculatedProgress =
          100 * (1 - status.duration_remaining / status.total_duration);
        setProgress(clamp(calculatedProgress, 0, 100));
      }

      if (status.duration_remaining === 0) {
        clearInterval(interval);
        // router.push('/dashboard');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const togglePause = () => {
    if (isPaused) {
      resumeRun();
    } else {
      pauseRun();
    }
    setIsPaused(!isPaused);
  };

  return (
    <div className="bg-white dark:bg-[#15202b] min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 mx-auto px-4 py-6 max-w-7xl">
        {/* Left: Chart + Agent Info */}
        <div className="pr-2 h-[calc(100vh-100px)] overflow-y-auto">
          <BackButton />
          <AgentScatterChart data={status.graph} />

          {/* Selected agent detail */}
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

              {/* Add this */}
              {status.graph?.find((g) => g.agent_id === selectedAgent.id) && (
                <div className="space-y-2 mt-3 text-gray-800 dark:text-gray-300 text-sm">
                  <p>
                    <strong>🧭 X:</strong>{' '}
                    {status.graph
                      .find((g) => g.agent_id === selectedAgent.id)
                      ?.x.toFixed(2)}
                  </p>
                  <p>
                    <strong>🧭 Y:</strong>{' '}
                    {status.graph
                      .find((g) => g.agent_id === selectedAgent.id)
                      ?.y.toFixed(2)}
                  </p>
                  <p>
                    <strong>🤔 Hesitancy:</strong>{' '}
                    {
                      status.graph.find((g) => g.agent_id === selectedAgent.id)
                        ?.hesitancy
                    }
                  </p>
                  <p>
                    <strong>📣 Recommendation:</strong>{' '}
                    {
                      status.graph.find((g) => g.agent_id === selectedAgent.id)
                        ?.recommendation
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 mt-6">
            <h2 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">
              Agents
            </h2>
            <div className="space-y-4 pr-2 max-h-[calc(100vh-200px)] overflow-y-auto">
              {agents.map((agent) => {
                const isSelected = selectedAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`relative cursor-pointer bg-gray-50 dark:bg-[#192734] shadow hover:shadow-lg p-4 border rounded-xl text-sm transition ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600'
                        : 'border-gray-200 dark:border-[#2f3336]'
                    }`}
                  >
                    {isSelected && (
                      <div className="top-2 right-2 absolute font-bold text-blue-500 text-xs">
                        ✅
                      </div>
                    )}
                    <div className="mb-1 font-bold text-[#1d9bf0] text-base">
                      {agent.name}
                    </div>
                    <p className="mb-2 text-gray-400 text-xs">
                      {getFlag(agent.nationality)} {agent.nationality} ·{' '}
                      {agent.age} yrs · {agent.gender}
                    </p>
                    <p className="mb-2 text-gray-800 dark:text-gray-200 text-sm">
                      📝 {agent.description || 'No description provided.'}
                    </p>
                    <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-xs">
                      <li>🎓 Education: {agent.education}</li>
                      <li>💼 Occupation: {agent.occupation || 'N/A'}</li>
                      <li>🏙️ Location: {agent.location_type}</li>
                      <li>💰 Income: {agent.income_bracket}</li>
                      <li>
                        👨‍👩‍👧‍👦 Marital: {agent.marital_status} (
                        {agent.number_of_children} kids)
                      </li>
                      <li>💉 Experience: {agent.prior_vaccine_experience}</li>
                      <li>💬 Belief: {agent.vaccine_belief}</li>
                    </ul>
                    {agent.personality_traits &&
                      agent.personality_traits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {agent.personality_traits.map((trait, i) => (
                            <span
                              key={i}
                              className="inline-block bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full text-blue-800 dark:text-blue-200 text-xs"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Tweet Feed */}
        <div className="h-[calc(100vh-100px)] overflow-hidden">
          <div className="space-y-4 pr-2 h-full overflow-y-auto">
            <AnimatePresence initial={false}>
              {[
                [...tweetFeed].map((tw, i) => (
                  <TweetCard
                    key={`${tw.content}-${i}`}
                    index={i}
                    username={`User${i}`}
                    content={tw.content}
                    tags={[tw.created_by]}
                  />
                )),
              ]}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Bar + Pause */}
      {progress !== 100 && (
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
      )}

      {progress == 100 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => router.push('/runs')}
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] px-6 py-3 rounded-full font-semibold text-white text-base transition"
          >
            🎉 Simulation Complete — Go to Dashboard
          </button>
        </div>
      )}
    </div>
  );
}

function TweetCard({
  username,
  content,
  tags = [],
  index,
}: {
  username: string;
  content: string;
  tags?: string[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      className="space-y-2 bg-white dark:bg-[#192734] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl text-gray-800 dark:text-gray-100"
    >
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
    </motion.div>
  );
}
