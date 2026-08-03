const API_BASE = '/api';

export async function analyzeIdeaStream(ideaData, sharkTankMode = false, onEvent = () => {}, sessionId = null) {
  const sid = sessionId || `sess_${Date.now()}`;
  try {
    const response = await fetch(`${API_BASE}/analyze/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ideaData,
        sharkTankMode,
        sessionId: sid,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

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
    console.warn('[WAR ROOM STREAM] Backend stream unavailable. Initiating War Room simulation mode…', error);
    await runSimulatedStream(ideaData, sharkTankMode, onEvent, sid);
  }
}

async function runSimulatedStream(ideaData, sharkTankMode, onEvent, sessionId) {
  const name = ideaData?.name || 'Startup Idea';
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Determine meeting duration setting: '2 Minutes', '4 Minutes', '8 Minutes'
  const settingVal = typeof localStorage !== 'undefined' ? (localStorage.getItem('fwr_meeting_length') || '4 Minutes') : '4 Minutes';
  let totalTargetSec = 240; // Default 4 mins
  if (settingVal.includes('2')) totalTargetSec = 120;
  else if (settingVal.includes('8')) totalTargetSec = 480;

  // 8 steps (6 core agents + Reaper + Chairman)
  const stepMs = Math.floor((totalTargetSec * 1000) / 8);

  // 1. Session Started
  onEvent({
    sessionId,
    type: 'SESSION_STARTED',
    timestamp: Date.now(),
    phase: 'INIT',
    agent: 'System',
    payload: { ideaData, executionMode: 'SIMULATED', meetingLength: settingVal }
  });
  await delay(Math.min(1000, stepMs * 0.1));

  const agents = [
    { key: 'ceo', name: 'Marcus Vance (CEO)', role: 'CEO', score: 8.5, quote: `"${name}'s core value proposition is compelling, but market positioning requires focus."` },
    { key: 'cto', name: 'Dr. Aris Thorne (CTO)', role: 'CTO', score: 8.7, quote: `"Technical architecture and MVP scope look scalable. Security & API privacy must be audited."` },
    { key: 'investor', name: 'Priya Desai (Investor)', role: 'INVESTOR', score: 7.8, quote: `"Unit economics show strong margin potential, though customer acquisition cost needs early validation."` },
    { key: 'marketing', name: 'Elena Rostova (CMO)', role: 'MARKETING', score: 8.0, quote: `"Clear target customer segment identified. Recommend zero-cost viral referral loops for launch."` },
    { key: 'customer', name: 'Samir Khan (Customer)', role: 'CUSTOMER', score: 8.9, quote: `"High user pain point relevance. Solution directly reduces friction for the core persona."` },
    { key: 'risk', name: 'Dr. Quinn Hayes (Risk)', role: 'RISK ADVISOR', score: 7.2, quote: `"Compliance & legal risk is moderate. Ensure robust terms of service & data retention rules."` },
  ];

  const agentResults = [];

  // 2. Stream Core 6 Agents
  for (const a of agents) {
    onEvent({
      sessionId,
      type: 'AGENT_STARTED',
      timestamp: Date.now(),
      agentKey: a.key,
      agentName: a.name,
      role: a.role,
    });

    await delay(Math.floor(stepMs * 0.6));

    const resultObj = {
      agentName: a.name,
      agentKey: a.key,
      key: a.key,
      role: a.role,
      score: a.score,
      verdict: a.quote,
      analysis: a.quote,
      strengths: [`Validated demand for ${name}`, `Strong team & domain alignment`],
      weaknesses: [`Monetization friction during pilot stage`],
    };
    agentResults.push(resultObj);

    onEvent({
      sessionId,
      type: 'AGENT_COMPLETED',
      timestamp: Date.now(),
      agentKey: a.key,
      agentName: a.name,
      role: a.role,
      payload: resultObj
    });

    await delay(Math.floor(stepMs * 0.4));
  }

  // 3. Grim Reaper Challenge
  onEvent({
    sessionId,
    type: 'GRIM_REAPER_STARTED',
    timestamp: Date.now(),
    agentKey: 'reaper',
    agentName: 'Grim Reaper',
    role: 'DEVIL\'S ADVOCATE',
  });
  await delay(Math.floor(stepMs * 0.6));

  const reaperObj = {
    verdict: `If customer retention drops below 60% after month 3, ${name} will burn capital rapidly.`,
    score: 6.8,
    fatalFlaw: `Unvalidated customer retention model`,
  };

  onEvent({
    sessionId,
    type: 'GRIM_REAPER_COMPLETED',
    timestamp: Date.now(),
    agentKey: 'reaper',
    payload: reaperObj
  });
  await delay(Math.floor(stepMs * 0.4));

  // 4. Chairman Verdict
  onEvent({
    sessionId,
    type: 'CHAIRMAN_STARTED',
    timestamp: Date.now(),
    agentKey: 'chairman',
    agentName: 'Board Chair',
    role: 'CHAIRMAN',
  });
  await delay(Math.floor(stepMs * 0.6));

  const overallScore = 8.2;
  const verdictStatus = 'APPROVED WITH CONDITIONS';
  const execSummary = `The board evaluated ${name} and considers it a high-potential venture. Key focus must remain on early unit economics and customer retention.`;

  const finalResult = {
    overallScore,
    verdict: verdictStatus,
    executiveSummary: execSummary,
    strengths: [
      `Differentiated market positioning for ${name}`,
      'Strong executive board alignment on MVP specs',
      'High core customer pain point relevance'
    ],
    weaknesses: [
      'Monetization pricing model requires live user testing',
      'Go-to-market CAC needs optimization'
    ],
    actionItems: [
      { id: 'act-s1', code: '01', title: 'Validate Willingness to Pay', description: 'Conduct 15 customer pricing interviews', priority: 'HIGH' },
      { id: 'act-s2', code: '02', title: 'Finalize MVP Spec', description: 'Freeze core feature scope for launch build', priority: 'HIGH' },
      { id: 'act-s3', code: '03', title: 'Audit Data & Compliance', description: 'Complete security and data privacy review', priority: 'MEDIUM' }
    ],
    agentResults: [
      ...agentResults,
      { agentName: 'Grim Reaper', agentKey: 'reaper', role: 'DEVIL\'S ADVOCATE', score: 6.8, verdict: reaperObj.verdict },
      { agentName: 'Board Chair', agentKey: 'chairman', role: 'CHAIRMAN', score: 8.2, verdict: execSummary }
    ],
    chairmanVerdict: {
      recommendation: verdictStatus,
      executiveSummary: execSummary
    }
  };

  onEvent({
    sessionId,
    type: 'CHAIRMAN_COMPLETED',
    timestamp: Date.now(),
    agentKey: 'chairman',
    payload: finalResult.chairmanVerdict
  });
  await delay(Math.floor(stepMs * 0.4));

  // 5. Update AI credits used
  if (typeof localStorage !== 'undefined') {
    const currentCredits = parseInt(localStorage.getItem('fwr_ai_credits_used') || '0', 10);
    localStorage.setItem('fwr_ai_credits_used', (currentCredits + 350).toString());
  }

  // 6. Session Completed
  onEvent({
    sessionId,
    type: 'SESSION_COMPLETED',
    timestamp: Date.now(),
    phase: 'AUDIT',
    agent: 'System',
    payload: finalResult
  });
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
