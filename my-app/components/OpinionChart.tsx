import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export default function OpinionChart({
  data,
  metric,
}: {
  data: any[];
  metric: 'hesitancy' | 'recommendation';
}) {
  const grouped = data.reduce((acc, entry, i) => {
    const id = entry.agent_id;
    if (!acc[id]) acc[id] = [];
    acc[id].push({
      index: data.length - i, // recent on the right
      value: entry[metric],
    });
    return acc;
  }, {} as Record<string, { index: number; value: string }[]>);

  const agents = Object.keys(grouped);
  const numericData = [];

  // Align data points by step index
  for (let i = 0; i < Math.max(...agents.map((a) => grouped[a].length)); i++) {
    const row: any = { step: i };
    for (const id of agents) {
      const entry = grouped[id][i];
      if (entry)
        row[id.slice(0, 6)] = parseFloat(
          (entry.value.match(/(\d+(\.\d+)?)/) || [0])[0]
        ); // crude numeric parse from natural text
    }
    numericData.push(row);
  }

  return (
    <div className="bg-white dark:bg-[#192734] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <h3 className="mb-2 font-semibold text-gray-700 dark:text-gray-300 text-sm capitalize">
        {metric} over time
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={numericData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="step" />
          <YAxis domain={[0, 1]} />
          <Tooltip />
          <Legend />
          {agents.map((id) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id.slice(0, 6)}
              stroke="#1d9bf0"
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
