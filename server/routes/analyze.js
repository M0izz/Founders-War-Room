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

export default router;
