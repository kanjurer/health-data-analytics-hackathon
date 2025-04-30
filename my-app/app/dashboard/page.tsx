'use client';

import BackButton from '@/components/BackButton';

export default function Dashboard() {
  return (
    <div className="bg-[#f5f8fa] dark:bg-[#15202b] px-4 py-8 min-h-screen text-[#0f1419] dark:text-white">
      <div className="space-y-8 mx-auto max-w-5xl">
        <BackButton />
        <h1 className="mb-4 font-bold text-2xl text-center tracking-tight">
          Simulation Summary Dashboard
        </h1>

        {/* Summary Stats */}
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Tweets Seen" value="3,520" />
          <StatCard title="Avg. Hesitancy Score" value="0.42" />
          <StatCard title="Fake Tweet Exposure (%)" value="36%" />
          <StatCard title="Mean Credibility" value="0.61" />
          <StatCard title="Most Common Tag" value="#Booster" />
          <StatCard title="Median Hesitancy Δ" value="+0.12" />
        </div>

        {/* Placeholder: Graph Sections */}
        <div className="gap-6 grid grid-cols-1 lg:grid-cols-2 pt-6">
          <GraphCard title="Hesitancy Over Time" />
          <GraphCard title="Fake vs Real Tweet Exposure" />
          <GraphCard title="Engagement by Credibility" />
          <GraphCard title="Belief Shift Distribution" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white dark:bg-[#192734] shadow-sm p-5 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-1 text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </div>
      <div className="font-bold text-xl">{value}</div>
    </div>
  );
}

function GraphCard({ title }: { title: string }) {
  return (
    <div className="flex justify-center items-center bg-white dark:bg-[#192734] shadow-sm p-5 border border-gray-200 dark:border-[#2f3336] rounded-xl h-64 text-gray-500 dark:text-gray-400">
      {title} (Coming Soon)
    </div>
  );
}
