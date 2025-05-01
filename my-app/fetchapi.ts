export async function createAgent(agent: AgentMeta) {
  const response = await fetch('http://localhost:8000/create_agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(agent),
  });

  if (!response.ok) {
    throw new Error('Failed to create agent');
  }

  const data = await response.json();
  return data;
}

export async function getAgents() {
  const response = await fetch('http://localhost:8000/agents', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch agents');
  }

  const data = await response.json();
  return data;
}

export async function deleteAgent(agentId: string) {
  const response = await fetch(
    `http://localhost:8000/delete_agent/${agentId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to delete agent');
  }

  const data = await response.json();
  return data;
}

export async function startRun(config: SimulationConfig) {
  console.log(config);
  const response = await fetch('http://localhost:8000/start_run', {
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

export async function stopRun() {
  const response = await fetch('http://localhost:8000/stop_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to stop simulation');
  }

  const data = await response.json();
  return data;
}

export async function pauseRun() {
  const response = await fetch('http://localhost:8000/pause_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to pause simulation');
  }

  const data = await response.json();
  return data;
}

export async function resumeRun() {
  const response = await fetch('http://localhost:8000/resume_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to resume simulation');
  }

  const data = await response.json();
  return data;
}

export async function statusRun() {
  const response = await fetch('http://localhost:8000/status_run', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get simulation status');
  }

  const data = await response.json();
  return data;
}

export async function resetRun() {
  const response = await fetch('http://localhost:8000/reset_run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reset simulation');
  }

  const data = await response.json();
  return data;
}

export async function getAllRuns() {
  const response = await fetch('http://localhost:8000/runs/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch runs');
  }

  const data = await response.json();
  return data;
}

export async function getRunDetails(runId: string) {
  const response = await fetch(`http://localhost:8000/summary_run/${runId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch run details');
  }

  const data = await response.json();
  return data;
}
