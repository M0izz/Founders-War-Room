const API_BASE = '/api';

export async function analyzeIdeaStream(ideaData, sharkTankMode = false, onEvent = () => {}, sessionId = null) {
  try {
    const response = await fetch(`${API_BASE}/analyze/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ideaData,
        sharkTankMode,
        sessionId,
      }),
    });

    if (!response.ok) {
      if (response.status === 502) {
        throw new Error('The War Room backend server is unreachable (502 Bad Gateway). Please ensure the backend is running on port 3001.');
      }
      throw new Error(`Analysis stream failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || ''; // Keep incomplete trailing fragment in buffer

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const jsonStr = trimmed.slice(6);
          try {
            const event = JSON.parse(jsonStr);
            onEvent(event);
          } catch (err) {
            console.warn('[SSE PARSE ERROR]', err, jsonStr);
          }
        }
      }
    }
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the War Room server. Please ensure the backend is running.');
    }
    throw error;
  }
}

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
      if (response.status === 502) {
        throw new Error('The War Room backend server is unreachable (502 Bad Gateway). Please ensure the backend is running on port 3001.');
      }
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
