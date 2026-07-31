/**
 * Founder's War Room — Express.js API Server
 *
 * Entry point that wires up middleware, routes, and starts listening.
 * The .env file lives one level up (project root).
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

import analyzeRouter from './routes/analyze.js';

// ── Load environment variables from the project root ──────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// ── Create Express app ────────────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ── Routes ────────────────────────────────────────────────────────────────────

/** Health-check endpoint */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'founders-war-room',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/** Main analysis endpoint */
app.use('/api/analyze', analyzeRouter);

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[SERVER ERROR]', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// ── Export Express App for Serverless / Local ─────────────────────────
export default app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n🏛️  Founder's War Room API listening on http://localhost:${PORT}`);
    console.log(`   Health check → GET  /api/health`);
    console.log(`   Analyze      → POST /api/analyze\n`);
  });
}
