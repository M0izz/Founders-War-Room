/**
 * Azure OpenAI Client
 *
 * Configures the `openai` SDK to point at the Azure OpenAI deployment and
 * exposes a single `callAgent` helper that wraps chat completions with
 * structured JSON output, error handling, and one automatic retry.
 */

import OpenAI from 'openai';

// ── Lazy-initialised client (env vars aren't available at import time) ────────
let _client = null;

/**
 * Return (or create) the singleton OpenAI client configured for Azure.
 * @returns {OpenAI}
 */
function getClient() {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.AZURE_API_KEY,
      baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_DEPLOYMENT_NAME}`,
      defaultQuery: { 'api-version': process.env.AZURE_API_VERSION },
      defaultHeaders: { 'api-key': process.env.AZURE_API_KEY },
    });
  }
  return _client;
}

/**
 * Call an Azure-hosted GPT model with a system prompt and user message,
 * requesting structured JSON output.
 *
 * Includes one automatic retry on transient failures.
 *
 * @param {string} systemPrompt  — The system-level instruction for the agent.
 * @param {string} userMessage   — The user-level message (startup idea data, etc.).
 * @param {object} [options]     — Optional overrides.
 * @param {number} [options.temperature=0.7] — Sampling temperature.
 * @param {number} [options.maxTokens=4096]  — Max tokens in the response.
 * @returns {Promise<object>} Parsed JSON from the model's response.
 */
export async function callAgent(systemPrompt, userMessage, options = {}) {
  const { temperature = 0.7, maxTokens = 4096 } = options;
  const client = getClient();

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage },
  ];

  let lastError = null;

  // Attempt + 1 retry
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await client.chat.completions.create({
        model: process.env.AZURE_DEPLOYMENT_NAME,
        messages,
        temperature,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' },
      });

      const content = response.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('Empty response from Azure OpenAI');
      }

      return JSON.parse(content);
    } catch (err) {
      lastError = err;
      console.warn(
        `[Azure Client] Attempt ${attempt + 1} failed: ${err.message}`,
      );

      // Wait briefly before retry
      if (attempt === 0) {
        await new Promise((r) => setTimeout(r, 1500));
      }
    }
  }

  // Both attempts failed
  throw new Error(
    `[Azure Client] All retries exhausted. Last error: ${lastError?.message}`,
  );
}

export default { callAgent };
