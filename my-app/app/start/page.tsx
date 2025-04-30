'use client';

import { useState } from 'react';
import { startSimulation } from '@/fetchapi';

export default function Start() {
  const [population, setPopulation] = useState(100);
  const [fakeActors, setFakeActors] = useState(20);
  const [duration, setDuration] = useState(30);
  const [speed, setSpeed] = useState(1);

  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDesc, setNewAgentDesc] = useState('');
  const [customAgents, setCustomAgents] = useState<AgentMeta[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config = { population, fakeActors, duration, speed, customAgents };

    startSimulation(config)
      .then((res) => {
        console.log('Simulation started:', res);
      })
      .catch((err) => {
        console.error('Error starting simulation:', err);
      });
  };

  const handleAddAgent = () => {
    if (!newAgentName.trim()) return;
    setCustomAgents((prev) => [
      ...prev,
      { name: newAgentName.trim(), description: newAgentDesc.trim() },
    ]);
    setNewAgentName('');
    setNewAgentDesc('');
  };

  return (
    <div className="flex justify-center items-center bg-white dark:bg-[#15202b] px-4 min-h-screen text-[#0f1419] dark:text-white transition-colors duration-300">
      <div className="bg-white dark:bg-[#1e2732] shadow-md p-6 border border-gray-200 dark:border-[#2f3336] rounded-2xl w-full max-w-md">
        <h1 className="mb-6 font-bold text-black dark:text-white text-xl sm:text-2xl text-center">
          Start Simulation
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <TwitterField
            label="Population Size"
            value={population}
            onChange={(v) => setPopulation(Number(v))}
            min={1}
          />
          <TwitterField
            label="% Fake Actors"
            value={fakeActors}
            onChange={(v) => setFakeActors(Number(v))}
            min={0}
            max={100}
          />
          <TwitterField
            label="Time Span (days)"
            value={duration}
            onChange={(v) => setDuration(Number(v))}
            min={1}
          />
          <TwitterField
            label="Simulation Speed (x)"
            value={speed}
            onChange={(v) => setSpeed(Number(v))}
            min={0.1}
            step={0.1}
          />

          {/* Custom Agents */}
          <div className="space-y-4 pt-6 border-gray-200 dark:border-[#2f3336] border-t">
            <h2 className="font-bold text-gray-600 dark:text-gray-300 text-sm">
              Custom Agents
            </h2>

            <div className="space-y-3 bg-gray-50 dark:bg-[#1a1e26] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-2xl">
              <input
                type="text"
                placeholder="Name (e.g., SkepticSam)"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="bg-white dark:bg-[#192734] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-800 dark:text-white text-sm"
              />

              <textarea
                placeholder="Description (optional)"
                value={newAgentDesc}
                onChange={(e) => setNewAgentDesc(e.target.value)}
                className="bg-white dark:bg-[#192734] px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-800 dark:text-white text-sm"
                rows={2}
              />

              <button
                type="button"
                onClick={handleAddAgent}
                className="bg-[#1d9bf0] hover:bg-[#1a8cd8] py-2 rounded-full w-full font-semibold text-white text-sm transition"
              >
                Add Agent
              </button>
            </div>

            {customAgents.length > 0 && (
              <div className="space-y-2">
                {customAgents.map((agent, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start bg-gray-100 dark:bg-[#253341] p-3 border border-gray-200 dark:border-[#2f3336] rounded-xl text-sm"
                  >
                    <div className="space-y-1">
                      <div className="font-semibold text-[#1d9bf0]">
                        @{agent.name}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-xs">
                        {agent.description || 'No description'}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setCustomAgents((prev) =>
                          prev.filter((_, i) => i !== idx)
                        )
                      }
                      className="ml-4 font-semibold text-red-500 hover:text-red-700 text-xs transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] shadow-sm py-3 rounded-full w-full font-semibold text-white text-base transition"
          >
            Start Simulation
          </button>
        </form>
      </div>
    </div>
  );
}

function TwitterField({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  onChange: (val: string) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm">
        {label}
      </label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-gray-100 text-sm placeholder-gray-400 dark:placeholder-gray-500"
      />
    </div>
  );
}
