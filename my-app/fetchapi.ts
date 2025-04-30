export async function startSimulation(config: SimulationConfig) {
  const response = await fetch('/api/start_simulation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });

  if (!response.ok) {
    throw new Error('Failed to start simulation');
  }

  const data = await response.json();
  return data;
}
