/**
 * POST /api/analyze — Main Analysis Route
 *
 * Accepts a startup idea payload, runs the full War Room pipeline, and
 * returns the complete analysis result.
 *
 * Request body:
 *   {
 *     ideaData: { ... },       // REQUIRED — the startup idea to analyse
 *     sharkTankMode: boolean    // optional, defaults to false
 *   }
 *
 * Response:
 *   200 — Full analysis result
 *   400 — Validation error
 *   500 — Pipeline error
 */

import { Router } from 'express';
import { runWarRoom } from '../agents/orchestrator.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // ── Validate request body ───────────────────────────────────────────────
    const { ideaData, sharkTankMode = false } = req.body;

    if (!ideaData) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'ideaData is required in the request body.',
        example: {
          ideaData: {
            name: 'My Startup',
            description: 'A brief description of the idea…',
            targetMarket: 'Who is this for?',
            revenueModel: 'How does it make money?',
            stage: 'idea | mvp | growth',
          },
          sharkTankMode: false,
        },
      });
    }

    if (typeof ideaData !== 'object' || Array.isArray(ideaData)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'ideaData must be a JSON object.',
      });
    }

    console.log(
      `\n📥 POST /api/analyze — "${ideaData.name || 'Unnamed Idea'}" (Shark Tank: ${sharkTankMode})`,
    );

    // ── Run the full pipeline ───────────────────────────────────────────────
    const result = await runWarRoom(ideaData, Boolean(sharkTankMode));

    return res.status(200).json(result);
  } catch (err) {
    console.error('[ANALYZE ROUTE] Unhandled error:', err);
    return res.status(500).json({
      error: 'Pipeline error',
      message: err.message,
    });
  }
});

/**
 * POST /api/analyze/stream — SSE Real-Time Streaming Endpoint
 * Streams JSON events to the client as the boardroom session progresses.
 */
router.post('/stream', async (req, res) => {
  try {
    const { ideaData, sharkTankMode = false, sessionId = `sess_${Date.now()}` } = req.body;

    if (!ideaData || typeof ideaData !== 'object' || Array.isArray(ideaData)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'ideaData object is required.',
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendEvent = (event) => {
      try {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      } catch (err) {
        console.error('[SSE WRITE ERROR]', err);
      }
    };

    console.log(
      `\n📡 POST /api/analyze/stream — "${ideaData.name || 'Unnamed Idea'}" [Session: ${sessionId}] (SSE Stream Started)`,
    );

    const result = await runWarRoom(ideaData, Boolean(sharkTankMode), sendEvent, sessionId);

    // Send final completion event and close connection
    sendEvent({
      sessionId,
      type: 'SESSION_COMPLETED',
      timestamp: Date.now(),
      phase: 'AUDIT',
      agent: 'System',
      payload: result,
    });
    res.end();
  } catch (err) {
    console.error('[ANALYZE STREAM ROUTE] Unhandled error:', err);
    try {
      res.write(`data: ${JSON.stringify({ type: 'SESSION_FAILED', error: err.message })}\n\n`);
      res.end();
    } catch {}
  }
});

export default router;
