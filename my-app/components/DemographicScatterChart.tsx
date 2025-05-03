'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type Props = {
  data: any[];
  groupBy: 'age' | 'gender' | 'education' | 'income_bracket' | 'location_type';
};

const groupColors = [
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
    if (age < 13) return '0-12';
    if (age < 18) return '13-17';
    if (age < 27) return '18-26';
    if (age < 40) return '27-39';
    if (age < 60) return '40-59';
    return '60+';
  }
  return value;
}

function groupData(data: any[], groupBy: string) {
  const grouped: Record<string, any[]> = {};
  for (const d of data) {
    const groupValue =
      groupBy === 'age' ? getGroupLabel(d[groupBy], groupBy) : d[groupBy];
    if (!grouped[groupValue]) grouped[groupValue] = [];
    grouped[groupValue].push({ x: d.x, y: d.y, agent_id: d.agent_id });
  }
  return grouped;
}

export default function DemographicScatterChart({ data, groupBy }: Props) {
  const grouped = groupData(data, groupBy);
  const groupKeys = Object.keys(grouped);

  return (
    <div className="bg-white dark:bg-[#1e2732] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-2 font-semibold text-gray-800 dark:text-gray-100">
        Clusters by {groupBy.replace('_', ' ').toUpperCase()}
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="Hesitancy" domain={[0, 10]} />
          <YAxis
            type="number"
            dataKey="y"
            name="Recommendation"
            domain={[0, 10]}
          />
          <Tooltip
            formatter={(value: number) => `${Math.round(value * 100)}%`}
            labelFormatter={(label) => `Agent ${label}`}
          />
          <Legend />
          {groupKeys.map((group, idx) => (
            <Scatter
              key={group}
              name={group}
              data={grouped[group]}
              fill={groupColors[idx % groupColors.length]}
              shape="circle"
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
