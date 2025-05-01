'use client';

import { useEffect, useState } from 'react';
import { getAgents, createAgent, deleteAgent } from '@/fetchapi';
import { getFlag } from '@/utils/utils';
import {
  GENDERS,
  EDUCATION,
  INCOME,
  VACCINE_EXPERIENCE,
  VACCINE_BELIEF,
  NATIONALITIES,
  LOCATION_TYPE,
  MARITAL,
} from '@/utils/utils';

export default function CreateAgentPage() {
  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [success, setSuccess] = useState(false);
  const [traitInput, setTraitInput] = useState('');

  const [form, setForm] = useState<AgentMeta>({
    id: '',
    name: '',
    age: 30,
    gender: 'Prefer not to say',
    nationality: 'India',
    education: 'High School',
    income_bracket: 'Middle',
    occupation: '',
    location_type: 'Urban',
    marital_status: 'Single',
    number_of_children: 0,
    prior_vaccine_experience: 'Neutral',
    vaccine_belief: 'Neutral',
    description: '',
    personality_traits: [],
  });

  const fetchAgents = async () => {
    try {
      const data = await getAgents();
      setAgents(data);
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    try {
      const res = await createAgent(form);
      if (res.ok || res.id) {
        setSuccess(true);
        setForm({
          ...form,
          name: '',
          occupation: '',
          description: '',
          personality_traits: [],
        });
        setTraitInput('');
        await fetchAgents();
      }
    } catch (err) {
      console.error('Error adding agent:', err);
    }
  };

  const handleTraitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && traitInput.trim()) {
      e.preventDefault();
      if (!form.personality_traits?.includes(traitInput.trim())) {
        setForm((prev) => ({
          ...prev,
          personality_traits: [
            ...(prev.personality_traits || []),
            traitInput.trim(),
          ],
        }));
      }
      setTraitInput('');
    }
  };

  const removeTrait = (index: number) => {
    setForm((prev) => ({
      ...prev,
      personality_traits: (prev.personality_traits || []).filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAgent(id);
      fetchAgents();
    } catch (err) {
      console.error('Error deleting agent:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-[#15202b] px-4 py-10 min-h-screen text-[#0f1419] dark:text-white">
      <div className="gap-8 grid grid-cols-1 lg:grid-cols-2 mx-auto max-w-7xl">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-[#1e2732] shadow-md p-6 border border-gray-200 dark:border-[#2f3336] rounded-xl h-fit"
        >
          <h1 className="mb-2 font-bold text-xl text-center">
            Add New Predefined Agent
          </h1>

          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <TextInput
              label="Name"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              required
            />
            <TextInput
              label="Age"
              type="number"
              value={form.age}
              onChange={(v) => setForm({ ...form, age: Number(v) })}
            />
            <SelectInput
              label="Gender"
              value={form.gender}
              options={GENDERS}
              onChange={(v) => setForm({ ...form, gender: v })}
            />
            <SelectInput
              label="Nationality"
              value={form.nationality}
              options={NATIONALITIES.map((c) => `${getFlag(c.code)} ${c.name}`)}
              onChange={(val) =>
                setForm({
                  ...form,
                  nationality: val.split(' ').slice(1).join(' '),
                })
              }
            />
            <SelectInput
              label="Education"
              value={form.education}
              options={EDUCATION}
              onChange={(v) => setForm({ ...form, education: v })}
            />
            <SelectInput
              label="Income"
              value={form.income_bracket}
              options={INCOME}
              onChange={(v) => setForm({ ...form, income_bracket: v })}
            />
            <TextInput
              label="Occupation"
              value={form.occupation}
              onChange={(v) => setForm({ ...form, occupation: v })}
            />
            <SelectInput
              label="Location Type"
              value={form.location_type}
              options={LOCATION_TYPE}
              onChange={(v) => setForm({ ...form, location_type: v })}
            />
            <SelectInput
              label="Marital Status"
              value={form.marital_status}
              options={MARITAL}
              onChange={(v) => setForm({ ...form, marital_status: v })}
            />
            <TextInput
              label="# of Children"
              type="number"
              value={form.number_of_children}
              onChange={(v) =>
                setForm({ ...form, number_of_children: Number(v) })
              }
            />
            <SelectInput
              label="Vaccine Experience"
              value={form.prior_vaccine_experience}
              options={VACCINE_EXPERIENCE}
              onChange={(v) =>
                setForm({ ...form, prior_vaccine_experience: v })
              }
            />
            <SelectInput
              label="Vaccine Belief"
              value={form.vaccine_belief}
              options={VACCINE_BELIEF}
              onChange={(v) => setForm({ ...form, vaccine_belief: v })}
            />
          </div>

          <TextArea
            label="Description"
            value={form.description || ''}
            onChange={(v) => setForm({ ...form, description: v })}
          />

          <div className="space-y-2">
            <label className="block font-medium text-sm">
              Personality Traits
            </label>
            <div className="flex flex-wrap gap-2">
              {(form.personality_traits || []).map((trait, i) => (
                <span
                  key={i}
                  className="flex items-center bg-[#e1ecf4] dark:bg-[#253341] px-3 py-1 rounded-full font-medium text-[#1d9bf0] text-xs"
                >
                  {trait}
                  <button
                    onClick={() => removeTrait(i)}
                    className="top-2 right-2 absolute text-red-500 hover:text-red-700 text-xs"
                    title="Delete"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type a trait and press Enter"
              value={traitInput}
              onChange={(e) => setTraitInput(e.target.value)}
              onKeyDown={handleTraitKeyDown}
              className="bg-white dark:bg-gray-800 mt-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-white text-sm"
            />
          </div>

          <button
            type="submit"
            className="bg-[#1d9bf0] hover:bg-[#1a8cd8] py-2 rounded-full w-full font-semibold text-white"
          >
            Save Agent
          </button>
          {success && (
            <p className="text-green-500 text-sm text-center">
              Agent added successfully!
            </p>
          )}
        </form>

        {/* Agent Cards */}
        <div className="bg-white dark:bg-[#1e2732] shadow-md p-6 border border-gray-200 dark:border-[#2f3336] rounded-xl max-h-[calc(100vh-120px)] overflow-y-auto">
          <h2 className="mb-4 font-semibold text-lg text-center">
            All Predefined Agents
          </h2>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="relative bg-gray-50 dark:bg-[#192734] shadow hover:shadow-lg p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl text-sm transition"
              >
                <button
                  onClick={() => handleDelete(agent.id)}
                  className="top-2 right-2 absolute text-red-500 hover:text-red-700 text-xs"
                  title="Delete"
                >
                  ✕
                </button>
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
                  <li>🏙️ Location Type: {agent.location_type}</li>
                  <li>💰 Income: {agent.income_bracket}</li>
                  <li>
                    👨‍👩‍👧‍👦 Marital Status: {agent.marital_status} (
                    {agent.number_of_children} kids)
                  </li>
                  <li>
                    💉 Vaccine Experience: {agent.prior_vaccine_experience}
                  </li>
                  <li>💬 Vaccine Belief: {agent.vaccine_belief}</li>
                </ul>
                {agent.personality_traits &&
                  agent.personality_traits?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {agent.personality_traits &&
                        agent.personality_traits.map((trait, i) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = 'text',
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-white text-sm"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-white text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-sm">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="bg-white dark:bg-gray-800 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-[#1d9bf0] focus:ring-2 w-full text-gray-900 dark:text-white text-sm"
      />
    </div>
  );
}
