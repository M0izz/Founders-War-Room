import express from 'express';
import orchestrator from '../agents/orchestrator.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { ideaData, sharkTankMode } = req.body;
    const result = await orchestrator.runWarRoom(ideaData, sharkTankMode);
    const { agentResults, grimReaper, chairmanVerdict, meta } = result;
    const getResult = (key) => agentResults.find((r) => r.key === key) || {};

    const conversation = [];
    // Chairman intro
    conversation.push({ speaker: 'chairman', text: ['Welcome to the boardroom meeting.'] });

    // Core agents in scripted order
    const coreOrder = ['ceo', 'cto', 'investor', 'marketing', 'customer', 'riskAdvisor'];
    coreOrder.forEach((k) => {
      const r = getResult(k);
      const txt = r.verdict || (r.recommendations && r.recommendations[0]) || '';
      conversation.push({ speaker: k, text: [txt] });
    });

    // Grim Reaper
    const grimText = grimReaper.deathSentence || (grimReaper.causeOfDeath && grimReaper.causeOfDeath[0] && grimReaper.causeOfDeath[0].cause) || '';
    conversation.push({ speaker: 'grimReaper', text: [grimText] });

    // Open Debate (CEO → Investor → Marketing)
    ['ceo', 'investor', 'marketing'].forEach((k) => {
      const r = getResult(k);
      const txt = r.verdict || '';
      conversation.push({ speaker: k, text: [txt] });
    });

    // Chairman final verdict
    const finalText = chairmanVerdict.recommendation || chairmanVerdict.executiveSummary || '';
    conversation.push({ speaker: 'chairman', text: [finalText] });

    res.json({ conversation, scores: meta });
  } catch (err) {
    next(err);
  }
});

export default router;
