'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
} from 'recharts';

export default function BeliefShiftChart({ data }: { data: any[] }) {
  const totalDuration = Math.max(...data.map((d) => d.duration_remaining || 0));
  console.log(data);
  const agentsMap: Record<string, any[]> = {};
  for (const entry of data) {
    if (!agentsMap[entry.agent_id]) agentsMap[entry.agent_id] = [];
    agentsMap[entry.agent_id].push(entry);
  }

  const series = Object.entries(agentsMap).map(([agent_id, entries]) => {
    const sorted = entries
      .sort((a, b) => b.duration_remaining - a.duration_remaining)
      .map((d) => ({
        time: totalDuration - d.duration_remaining,
        belief_change: d.belief_change,
      }))
      .filter((d) => d.time !== 0 && d.time !== totalDuration); // omit day 0 where change is 0

    return { agent_id, data: sorted };
  });

  return (
    <div className="bg-white dark:bg-[#1e2732] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-4 font-semibold text-gray-800 dark:text-gray-100 text-lg">
        Belief Change Trajectory
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart margin={{ top: 10, right: 20, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          >
            <Label value="Days Elapsed" position="insideBottom" offset={-5} />
          </XAxis> 
          <YAxis domain={[0, 1]} tick={{ fontSize: 12 }}>
            <Label
              value="Belief Change (Cosine Distance)"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle' }}
            />
          </YAxis>
          <Tooltip />
          <Legend />
          {series.map((agent, i) => (
            <Line
              key={agent.agent_id}
              name={`Agent ${agent.agent_id.slice(0, 4)}`}
              type="monotone"
              dataKey="belief_change"
              data={agent.data}
              stroke={COLORS[i % COLORS.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

const COLORS = [
  '#1d9bf0',
  '#22c55e',
  '#f97316',
  '#e11d48',
  '#a855f7',
  '#14b8a6',
  '#ef4444',
  '#6366f1',
];
