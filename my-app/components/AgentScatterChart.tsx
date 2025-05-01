'use client';

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AgentScatterChart({
  data,
  onPointClick,
}: {
  data: {
    agent_id: string;
    x: number;
    y: number;
  }[];
  onPointClick?: (id: string) => void;
}) {
  return (
    <div className="bg-white dark:bg-[#1e2732] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-2 text-gray-500 dark:text-gray-400 text-sm">
        🧬 Real-Time Population Cluster View
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="x"
            name="Hesitancy"
            domain={[0, 1]}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Recommendation"
            domain={[0, 1]}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${Math.round(value * 100)}%`,
              name,
            ]}
          />
          <Scatter
            name="Agents"
            data={data}
            fill="#1d9bf0"
            shape="circle"
            onClick={(e: any) => {
              if (onPointClick && e?.payload?.agent_id) {
                onPointClick(e.payload.agent_id);
              }
            }}
            animationDuration={300}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
