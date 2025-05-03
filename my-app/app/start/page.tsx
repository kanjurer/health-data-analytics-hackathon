'use client';

import { useState, useEffect } from 'react';
import { getAgents, startRun } from '@/fetchapi';
import { getFlag } from '@/utils/utils';
import { useRouter } from 'next/navigation';

export default function Start() {
  const router = useRouter();
  const [population, setPopulation] = useState(100);
  const [fakeActors, setFakeActors] = useState(20);
  const [duration, setDuration] = useState(30);
  const [speed, setSpeed] = useState(1);

  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [selectedPredefined, setSelectedPredefined] = useState<AgentMeta[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

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

  const toggleAgentSelection = (agent: AgentMeta) => {
    setSelectedPredefined((prev) =>
      prev.some((a) => a.id === agent.id)
        ? prev.filter((a) => a.id !== agent.id)
        : [...prev, agent]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const config = {
      population,
      fakeActors,
      duration,
      speed,
      agents: selectedPredefined,
      countries: selectedCountries,
      exposure: 2,
    };

    try {
      const res = await startRun(config);
      console.log('Simulation started:', res);
      router.push('/simulation'); // redirect to simulation page
    } catch (err) {
      console.error('Error starting simulation:', err);
    }
  };

  const allCountries = [
    { name: 'India', code: 'IN' },
    { name: 'China', code: 'CN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Canada', code: 'CA' },
    { name: 'USA', code: 'US' },
    { name: 'France', code: 'FR' },
  ];

  const getFlagEmoji = (code: string) =>
    code
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );

  return (
    <div className="bg-white dark:bg-[#15202b] px-4 py-8 min-h-screen text-[#0f1419] dark:text-white transition-colors duration-300">
      <h1 className="mb-6 font-bold text-black dark:text-white text-xl sm:text-2xl text-center">
        Start Simulation
      </h1>

      <form
        onSubmit={handleSubmit}
        className="gap-8 grid grid-cols-1 lg:grid-cols-2 mx-auto max-w-7xl"
      >
        {/* LEFT: SETTINGS */}
        <div className="space-y-6">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <TwitterField
              label="Population Size"
              value={population}
              onChange={(v) => setPopulation(Number(v))}
              min={1}
            />
            <TwitterField
              label="Fake Actors"
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
          </div>

          {/* Country Selector */}
          <div className="space-y-2">
            <label className="block font-semibold text-gray-700 dark:text-gray-300 text-sm">
              Target Countries
            </label>
            <select
              className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl w-full text-sm"
              onChange={(e) => {
                const selected = e.target.value;
                if (selected && !selectedCountries.includes(selected)) {
                  setSelectedCountries([...selectedCountries, selected]);
                }
              }}
              value=""
            >
              <option value="" disabled>
                Select a country
              </option>
              {allCountries
                .filter((c) => !selectedCountries.includes(c.name))
                .map((country) => (
                  <option key={country.name} value={country.name}>
                    {getFlagEmoji(country.code)} {country.name}
                  </option>
                ))}
            </select>

            <div className="flex flex-wrap gap-2 pt-2">
              {selectedCountries.map((name) => {
                const flag = getFlagEmoji(
                  allCountries.find((c) => c.name === name)?.code || ''
                );
                return (
                  <span
                    key={name}
                    className="flex items-center bg-[#e1ecf4] dark:bg-[#253341] px-3 py-1 rounded-full font-medium text-[#1d9bf0] text-xs"
                  >
                    {flag} {name}
                    <button
                      onClick={() =>
                        setSelectedCountries((prev) =>
                          prev.filter((c) => c !== name)
                        )
                      }
                      className="ml-2 text-[10px] hover:text-red-500"
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="pt-2">
            <h3 className="mb-2 font-semibold text-sm">Selected Agents</h3>

            {selectedPredefined.length === 0 ? (
              <div className="bg-yellow-50 dark:bg-[#332f0d] p-4 border border-yellow-200 dark:border-yellow-600 rounded-xl text-yellow-800 dark:text-yellow-100 text-sm text-center">
                <p className="mb-3 font-medium">⚠️ Oops! No agents selected.</p>
                <p className="mb-4 text-gray-600 dark:text-gray-400 text-xs">
                  You need at least one agent from the list to start the
                  simulation or add more agents from the builder.
                </p>
                <a
                  href="/agents"
                  className="inline-block bg-[#1d9bf0] hover:bg-[#1a8cd8] px-4 py-2 rounded-full font-semibold text-white text-xs transition"
                >
                  ➕ Go Add Agents
                </a>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedPredefined.map((agent) => (
                  <span
                    key={agent.id}
                    className="bg-[#e1ecf4] dark:bg-[#253341] px-3 py-1 rounded-full font-medium text-[#1d9bf0] text-xs"
                  >
                    {agent.name}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] py-3 rounded-full w-full font-semibold text-white text-base transition"
          >
            Start Simulation
          </button>
        </div>

        {/* RIGHT: AGENTS LIST */}
        <div className="space-y-4 pr-2 max-h-[calc(100vh-150px)] overflow-y-auto">
          {/* Controls */}
          <div className="flex justify-end gap-4 pr-2">
            <button
              type="button"
              onClick={() => setSelectedPredefined(agents)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-full text-white text-xs transition"
            >
              ✅ Select All
            </button>
            <button
              type="button"
              onClick={() => setSelectedPredefined([])}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full text-white text-xs transition"
            >
              ♻️ Reset
            </button>
          </div>

          {agents.map((agent) => {
            const isSelected = selectedPredefined.some(
              (a) => a.id === agent.id
            );
            return (
              <div
                key={agent.id}
                onClick={() => toggleAgentSelection(agent)}
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
                  {getFlag(agent.nationality)} {agent.nationality} · {agent.age}{' '}
                  yrs · {agent.gender}
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
                  agent.personality_traits?.length > 0 && (
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
      </form>
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
        className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-white text-sm"
      />
    </div>
  );
}
