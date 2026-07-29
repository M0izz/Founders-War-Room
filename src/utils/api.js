const API_BASE = '/api';

export async function analyzeIdea(ideaData, sharkTankMode = false) {
  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
      ideaData,
      sharkTankMode,
    }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Analysis failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the War Room server. Please ensure the backend is running.');
    }
    throw error;
  }
}

export async function healthCheck() {
  try {
    const response = await fetch(`${API_BASE}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
export async function fetchBoardroom(ideaData, sharkTankMode = false) {
  try {
    const response = await fetch(`${API_BASE}/boardroom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ideaData,
        sharkTankMode,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `Boardroom fetch failed with status ${response.status}`);
    }

    const data = await response.json();
    return data; // { conversation: [...], scores: {...} }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the War Room server. Please ensure the backend is running.');
    }
    throw error;
  }
}
