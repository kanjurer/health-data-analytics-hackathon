'use client';

import { useEffect, useState } from 'react';
import { getAllRuns, getRunDetails } from '@/fetchapi';
import BackButton from '@/components/BackButton';
import DemographicScatterChart from '@/components/DemographicScatterChart';
import BeliefShiftChart from '@/components/BeliefShiftChart';
import GroupBeliefChart from '@/components/GroupBeliefChart';

export default function RunHistoryPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [runDetail, setRunDetail] = useState<any | null>(null);

  useEffect(() => {
    getAllRuns()
      .then(setRuns)
      .catch((err) => console.error('Failed to load runs', err));
  }, []);

  useEffect(() => {
    if (!selectedRunId) return;
    getRunDetails(selectedRunId)
      .then(setRunDetail)
      .catch((err) => console.error('Failed to load run details', err));
  }, [selectedRunId]);

  const isComplete = runDetail?.run?.duration_remaining === 0;

  const enrichedGraph =
    runDetail?.graph
      ?.filter((entry: any) => entry.duration_remaining === 0)
      .map((entry: any) => {
        const agent = runDetail.agents.find(
          (a: any) => a.id === entry.agent_id
        );
        return {
          ...entry,
          ...agent,
        };
      }) || [];

  return (
    <div className="bg-[#f5f8fa] dark:bg-[#15202b] px-4 py-8 min-h-screen text-[#0f1419] dark:text-white">
      <div className="flex gap-6 mx-auto max-w-7xl">
        {/* Sidebar */}
        <div className="flex-shrink-0 w-64">
          <BackButton />
          <h2 className="mb-4 font-semibold text-lg">Simulation Runs</h2>
          <div className="space-y-2 pr-2 max-h-[calc(100vh-120px)] overflow-y-auto">
            {runs.map((run) => (
              <button
                key={run.id}
                onClick={() => setSelectedRunId(run.id)}
                className={`block w-full text-left p-3 rounded-lg border transition text-sm shadow-sm ${
                  selectedRunId === run.id
                    ? 'bg-blue-100 dark:bg-[#1d3f61] border-blue-400'
                    : 'bg-white dark:bg-[#1e2732] border-gray-200 dark:border-[#2f3336]'
                }`}
              >
                <div className="font-semibold">
                  Run ID: {run.id.slice(0, 8)}...
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">
                  Pop: {run.population}, Fake: {run.fake_actors}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-grow">
          {!runDetail && (
            <div className="mt-20 text-gray-500 dark:text-gray-400 text-center">
              Select a run from the sidebar to view details.
            </div>
          )}

          {runDetail && (
            <div className="space-y-6">
              <h1 className="font-bold text-2xl text-center tracking-tight">
                Summary for Run #{runDetail.run.id.slice(0, 8)}
              </h1>

              <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-3">
                <Stat title="Population" value={runDetail.run.population} />
                <Stat title="Duration" value={runDetail.run.total_duration} />
                <Stat title="Bad Agents" value={runDetail.run.num_bad_agents} />
                <Stat
                  title="Good Agents"
                  value={runDetail.run.num_good_agents}
                />
                <Stat
                  title="Naive Agents"
                  value={runDetail.run.num_naive_agents}
                />
              </div>

              {isComplete && (
                <div className="space-y-6">
                  {[
                    'age',
                    'gender',
                    'education',
                    'income_bracket',
                    'location_type',
                  ].map((group) => (
                    <div
                      key={group}
                      className="gap-6 grid sm:grid-cols-1 lg:grid-cols-2"
                    >
                      <DemographicScatterChart
                        data={enrichedGraph}
                        groupBy={group}
                      />
                      <GroupBeliefChart
                        data={runDetail.graph}
                        agents={runDetail.agents}
                        groupBy={group}
                      />
                    </div>
                  ))}
                </div>
              )}

              <BeliefShiftChart data={runDetail.graph} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white dark:bg-[#192734] shadow-sm p-4 border border-gray-200 dark:border-[#2f3336] rounded-xl">
      <div className="mb-1 text-gray-500 dark:text-gray-400 text-sm">
        {title}
      </div>
      <div className="font-bold text-xl">{value}</div>
    </div>
  );
}
