/**
 * Azure OpenAI Client
 *
 * Configures the `openai` SDK to point at the Azure OpenAI deployment and
 * exposes a single `callAgent` helper that wraps chat completions with
 * structured JSON output, error handling, and executionMode metadata.
 */

import OpenAI from 'openai';

let _client = null;

function getClient() {
  if (!_client) {
    const endpoint = (process.env.AZURE_OPENAI_ENDPOINT || '').replace(/\/+$/, '');
    _client = new OpenAI({
      apiKey: process.env.AZURE_API_KEY,
      baseURL: endpoint,
      defaultQuery: { 'api-version': process.env.AZURE_API_VERSION },
      defaultHeaders: { 'api-key': process.env.AZURE_API_KEY },
    });
  }
  return _client;
}

const EXECUTIVE_VOICE_INSTRUCTIONS = `
MANDATORY BOARD MEMBER ROLEPLAY GUIDELINES:
- You are participating in a live executive board meeting. Speak like a skeptical, sharp executive, not a marketing copywriter.
- Do NOT use generic startup buzzwords (e.g. "strong GTM", "scalable solution", "massive TAM", "strong PMF", "compelling value proposition", "category-defining", "viral growth", "robust architecture") UNLESS you immediately explain the concrete evidence behind the statement.
- You MUST reference concrete facts from the provided startup idea (Name, Description, Target Audience, Revenue Model, Industry).
- Distinguish clearly:
  1. What the founder explicitly claims
  2. What is actually supported by the provided information
  3. What you are assuming
  4. What critical evidence is missing
- If another board member's position is provided, directly challenge or agree with their specific claim with evidence-based reasoning.
`;

export async function callAgent(systemPrompt, userMessage, options = {}) {
  const { temperature = 0.7, maxTokens = 4096, agentName = 'Agent' } = options;

  const fullSystemPrompt = `${systemPrompt}\n\n${EXECUTIVE_VOICE_INSTRUCTIONS}`;

  // If no API key set or invalid key, return intelligent agentic fallback with FALLBACK executionMode
  if (
    !process.env.AZURE_API_KEY ||
    process.env.AZURE_API_KEY.includes('your-') ||
    process.env.AZURE_API_KEY === 'placeholder'
  ) {
    console.log(`[MODEL] ${agentName} request started (Mode: FALLBACK)`);
    const fallbackRes = generateFallbackResponse(fullSystemPrompt, userMessage, agentName);
    console.log(`[MODEL] ${agentName} response received (Mode: FALLBACK)`);
    return { ...fallbackRes, executionMode: 'FALLBACK' };
  }

  let lastError = null;

  try {
    const client = getClient();
    const messages = [
      { role: 'system', content: fullSystemPrompt },
      { role: 'user', content: userMessage },
    ];
    const deploymentName = process.env.AZURE_DEPLOYMENT_NAME;

    console.log(`[MODEL] ${agentName} request started (Mode: LIVE_AI)`);
    console.log(`[MODEL] ${agentName} endpoint=${process.env.AZURE_OPENAI_ENDPOINT} deployment=${deploymentName}`);

    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.chat.completions.create({
          model: deploymentName,
          messages,
          temperature,
          max_tokens: maxTokens,
        });

        const content = response.choices?.[0]?.message?.content;
        if (!content) {
          throw new Error('Azure OpenAI returned no content');
        }

        try {
          const parsed = JSON.parse(content);
          console.log(`[MODEL] ${agentName} response received (Mode: LIVE_AI)`);
          return { ...parsed, executionMode: 'LIVE_AI' };
        } catch (parseErr) {
          lastError = parseErr;
          console.warn(`[MODEL] ${agentName} response parse failed: ${parseErr.message}`);
          console.warn(`[MODEL] ${agentName} raw content: ${content}`);
          throw parseErr;
        }
      } catch (err) {
        lastError = err;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
      }
    }
  } catch (err) {
    lastError = err;
  }

  console.warn(`[MODEL] ${agentName} Azure API error (${lastError?.message}) — defaulting to FALLBACK response.`);
  const fallbackRes = generateFallbackResponse(fullSystemPrompt, userMessage, agentName);
  return { ...fallbackRes, executionMode: 'FALLBACK' };
}

function generateFallbackResponse(systemPrompt, userMessage, agentName = 'Agent') {
  const isChairman = agentName === 'Chairman' || systemPrompt.includes('ultimate decision-maker');
  const isReaper = agentName === 'Grim Reaper' || (systemPrompt.includes('Death Predictor') && !isChairman);
  const isCEO = agentName === 'CEO' || systemPrompt.includes('Vision Strategist');
  const isCTO = agentName === 'CTO' || systemPrompt.includes('Feasibility Engineer');
  const isInvestor = agentName === 'Investor' || systemPrompt.includes('Business Viability');
  const isCustomer = agentName === 'Customer' || systemPrompt.includes('Demand Validator');
  const isMarketing = agentName === 'Marketing' || systemPrompt.includes('Growth Architect');
  const isRisk = agentName === 'Risk Advisor' || systemPrompt.includes('Operational Risk');

  let startupName = 'Startup';
  let industry = 'Tech';
  let description = 'Core product workflow';
  let targetAudience = 'target users';
  let revenueModel = 'Subscription';

  const nameMatch = userMessage.match(/"name":\s*"([^"]+)"/i);
  if (nameMatch && nameMatch[1]) startupName = nameMatch[1].trim();

  const indMatch = userMessage.match(/"industry":\s*"([^"]+)"/i);
  if (indMatch && indMatch[1]) industry = indMatch[1].trim();

  const descMatch = userMessage.match(/"description":\s*"([^"]+)"/i);
  if (descMatch && descMatch[1]) description = descMatch[1].trim();

  const audMatch = userMessage.match(/"targetAudience":\s*"([^"]+)"/i);
  if (audMatch && audMatch[1]) targetAudience = audMatch[1].trim();

  const revMatch = userMessage.match(/"revenueModel":\s*"([^"]+)"/i);
  if (revMatch && revMatch[1]) revenueModel = revMatch[1].trim();

  if (isReaper) {
    return {
      agentName: 'Grim Reaper',
      role: 'Death Predictor',
      deathSentence: `Why ${startupName} dies: ${targetAudience} won't change existing operational habits for '${description.slice(0, 45)}', and sales cycles for ${revenueModel} will exhaust cash reserves before scale.`,
      failureProbability: 42,
      causeOfDeath: [
        { rank: 1, cause: `Workflow Resistance among ${targetAudience}`, evidence: `Existing habits block quick adoption of '${description.slice(0, 35)}'` },
        { rank: 2, cause: `Monetization Friction (${revenueModel})`, evidence: `Willingness-to-pay remains unvalidated prior to 90-day pilot proof` },
        { rank: 3, cause: 'Incumbent Copycat Threat', evidence: `Platform leaders in ${industry} can bundle feature parity for free` }
      ],
      hiddenRisks: [`Data compliance traps during offline ${industry} operations`, `High onboarding friction for non-technical ${targetAudience}`],
      earlyWarningSignals: [`Pilot agreements for ${startupName} stall past 90 days`, 'Zero B2B contract renewals in Quarter 1'],
      survivalRecommendations: [`Secure 3 signed letters of intent from ${targetAudience}`, 'Implement local offline encrypted data fallback'],
      score: 4.2,
      confidence: 0.88
    };
  }

  if (isChairman) {
    return {
      executiveSummary: `The board sees real opportunity in ${startupName} for ${targetAudience}, but monetization (${revenueModel}) and operational compliance remain key prerequisites before capital allocation.`,
      consensus: [
        `Clear problem statement addressing urgent pain for ${targetAudience}`,
        `Feasible MVP scope buildable within 90 days in ${industry}`,
        `Direct user demand for '${description.slice(0, 40)}'`
      ],
      criticalSplits: [
        `Investor favors immediate pilot proof of ${revenueModel} vs CEO prioritizing rapid user acquisition`
      ],
      recommendation: 'PROCEED WITH CONDITIONS',
      reasoningChain: `The thesis for ${startupName} solves a real pain point in ${industry}. Technical feasibility is high, but revenue validation with ${targetAudience} and compliance audits must precede major funding.`,
      topActions: [
        `Validate ${revenueModel} pricing with 10 key decision makers among ${targetAudience}`,
        `Build 90-day core MVP for ${startupName} with under 2-minute setup time`,
        `Complete regulatory and security compliance audit for ${industry}`
      ],
      scores: {
        healthScore: 84,
        investmentReadiness: 78,
        marketPotential: 89,
        riskIndex: 42,
        innovationScore: 86
      },
      swot: {
        strengths: [
          `Clear value proposition solving '${description.slice(0, 40)}'`,
          `High initial enthusiasm from target users (${targetAudience})`,
          `Differentiated operational angle in ${industry}`
        ],
        weaknesses: [
          `Unproven ${revenueModel} monetization at scale`,
          `Potential sales cycle friction in ${industry}`
        ],
        opportunities: [
          `Expansion across ${industry} enterprise channels`,
          'Strategic API integrations with industry incumbents'
        ],
        threats: [
          'Regulatory compliance delays',
          `Competitor platform features targeting ${targetAudience}`
        ]
      }
    };
  }

  if (isCEO) {
    return {
      agentName: 'CEO',
      role: 'Vision Strategist',
      score: 8.6,
      confidence: 0.90,
      keyObservations: [
        `The thesis behind ${startupName} addresses an urgent gap for ${targetAudience}.`,
        `Core problem statement: ${description.slice(0, 60)}`
      ],
      strengths: [`Clear vision targeting ${targetAudience}`, `Sharp positioning in ${industry}`],
      concerns: [`Ensuring long-term product expansion beyond the initial ${revenueModel} hook`],
      recommendations: [`Expand ${startupName} into a full platform for ${industry}`],
      verdict: `I see strong market potential for ${startupName} in ${industry}, provided we execute tightly on '${description.slice(0, 40)}' for ${targetAudience}.`
    };
  }

  if (isCTO) {
    return {
      agentName: 'CTO',
      role: 'Feasibility Engineer',
      score: 8.4,
      confidence: 0.92,
      keyObservations: [
        `The tech stack for ${startupName} can be deployed as an MVP in 90 days.`,
        `Zero-latency requirements when serving ${targetAudience}.`
      ],
      strengths: [`Lightweight MVP architecture for ${industry}`, 'Low technical risk for initial version'],
      concerns: ['Offline system resilience and data encryption'],
      recommendations: [`Build offline encrypted caching for ${startupName}`],
      verdict: `Technically feasible architecture for ${startupName}. The core challenge isn't engineering — it's reliable data integration.`
    };
  }

  if (isInvestor) {
    return {
      agentName: 'Investor',
      role: 'Business Viability Analyst',
      score: 7.2,
      confidence: 0.85,
      keyObservations: [
        `The ${revenueModel} model requires direct willingness-to-pay proof from ${targetAudience}.`,
        `High LTV potential if enterprise contracts lock in.`
      ],
      strengths: [`Addressable market opportunity in ${industry}`, `Clear ${revenueModel} pricing structure`],
      concerns: [`Unvalidated sales cycle length for ${targetAudience}`],
      recommendations: [`Validate ${revenueModel} pricing with 3 paid pilots among ${targetAudience}`],
      verdict: `I like the market size for ${startupName}, but I won't assume recurring revenue until ${targetAudience} sign paid pilots.`
    };
  }

  if (isCustomer) {
    return {
      agentName: 'Customer',
      role: 'Demand Validator',
      score: 9.1,
      confidence: 0.94,
      keyObservations: [
        `Target users (${targetAudience}) experience urgent pain regarding '${description.slice(0, 50)}'.`,
        `Zero onboarding friction is mandatory.`
      ],
      strengths: [`Solves daily headache for ${targetAudience}`, 'Immediate productivity/safety gain'],
      concerns: ['Onboarding friction if setup requires complex configuration'],
      recommendations: [`Ensure setup for ${startupName} takes less than 2 minutes`],
      verdict: `As a representative of ${targetAudience}, I need this immediately, but if onboarding takes over 2 minutes, adoption drops.`
    };
  }

  if (isMarketing) {
    return {
      agentName: 'Marketing',
      role: 'Growth Architect',
      score: 7.8,
      confidence: 0.86,
      keyObservations: [
        `Strong organic word-of-mouth potential among ${targetAudience}.`,
        `Clear acquisition loops in ${industry}.`
      ],
      strengths: [`High word-of-mouth potential for ${startupName}`, 'Clear positioning narrative'],
      concerns: [`Direct channel distribution strategy for ${targetAudience} needs formal playbook`],
      recommendations: [`Launch targeted pilot campaign in top 5 ${industry} hubs`],
      verdict: `Strong organic acquisition channel potential for ${startupName}, provided we target ${targetAudience} directly.`
    };
  }

  if (isRisk) {
    return {
      agentName: 'Risk Advisor',
      role: 'Operational Risk Analyst',
      score: 6.5,
      confidence: 0.89,
      keyObservations: [
        `Regulatory compliance and data protection in ${industry} require active legal audit.`,
        `Operational liability when serving ${targetAudience}.`
      ],
      strengths: ['Clear risk awareness around compliance'],
      concerns: [`Liability risks when serving ${targetAudience}`, 'Regulatory approval timelines'],
      recommendations: [`Retain specialized regulatory counsel for ${industry} compliance`],
      verdict: `Significant operational and compliance landmines in ${industry} that must be cleared before public rollout of ${startupName}.`
    };
  }

  return {
    agentName: 'Executive Advisor',
    role: 'Board Advisor',
    score: 8.0,
    confidence: 0.85,
    keyObservations: [`Solid strategic alignment for ${startupName}`],
    strengths: ['Clear market opportunity and functional scope'],
    concerns: ['Requires execution discipline and pilot validation'],
    recommendations: ['Proceed with structured MVP testing'],
    verdict: `Strong foundational thesis for ${startupName} ready for board review.`
  };
}

export default { callAgent };
