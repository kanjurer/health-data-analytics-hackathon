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
} from 'recharts';

const COLORS = [
  '#1d9bf0',
  '#22c55e',
  '#f97316',
  '#e11d48',
  '#a855f7',
  '#14b8a6',
];

function getGroupLabel(value: any, groupBy: string): string {
  if (groupBy === 'age') {
    const age = parseInt(value);
    if (age < 13) return '0–12';
    if (age < 18) return '13–17';
    if (age < 27) return '18–26';
    if (age < 40) return '27–39';
    if (age < 60) return '40–59';
    return '60+';
  }
  return value;
}

export default function GroupBeliefChart({
  data,
  agents,
  groupBy,
}: {
  data: any[];
  agents: any[];
  groupBy: string;
}) {
  // Join agent metadata into data
  const enriched = data.map((entry) => {
    const agent = agents.find((a) => a.id === entry.agent_id);
    return {
      ...entry,
      group: getGroupLabel(agent?.[groupBy], groupBy),
    };
  });

  // Organize data into: { group -> { time -> values[] } }
  const groupedData: Record<string, Record<number, number[]>> = {};
  for (const entry of enriched) {
    if (!entry.group) continue;
    if (!groupedData[entry.group]) groupedData[entry.group] = {};
    if (!groupedData[entry.group][entry.duration_remaining])
      groupedData[entry.group][entry.duration_remaining] = [];
    if (!entry.belief_change) continue;
    groupedData[entry.group][entry.duration_remaining].push(
      entry.belief_change
    );
  }

  // Format data for chart
  const chartData: Record<number, any> = {};
  for (const group in groupedData) {
    for (const time in groupedData[group]) {
      const t = parseInt(time);
      if (!chartData[t]) chartData[t] = { time: t };
      const avg =
        groupedData[group][t].reduce((a, b) => a + b, 0) /
        groupedData[group][t].length;
      chartData[t][group] = parseFloat(avg.toFixed(4));
    }
  }

  const sorted = Object.values(chartData).sort(
    (a: any, b: any) => a.time - b.time
  );

  return (
    <div className="bg-white dark:bg-[#1e2732] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
        Average Belief Change by {groupBy.replace('_', ' ').toUpperCase()}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={sorted}
          margin={{ top: 10, right: 20, bottom: 10, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            type="number"
            name="Day"
            tickFormatter={(t) => `Day ${t}`}
          />
          <YAxis domain={[0, 1]} name="Belief Change" />
          <Tooltip />
          <Legend />
          {Object.keys(groupedData).map((group, i) => (
            <Line
              key={group}
              name={group}
              dataKey={group}
              type="monotone"
              stroke={COLORS[i % COLORS.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
