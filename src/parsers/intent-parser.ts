interface Intent {
  projectName: string;
  story: string;
  vision?: string;
  metrics?: string[];
}

interface ParsedIntent {
  primaryUser: string;
  secondaryUsers: string[];
  problem: string;
  solution: string;
  vision: string;
  metrics: string[];
  suggestedFeatures: string[];
}

export async function parseIntent(intent: Intent, provider: string): Promise<ParsedIntent> {
  // Auto-detect provider based on available API keys
  const effectiveProvider = detectProvider(provider);
  
  if (effectiveProvider === 'openrouter') {
    return parseWithOpenRouter(intent);
  } else if (effectiveProvider === 'anthropic') {
    return parseWithAnthropic(intent);
  } else if (effectiveProvider === 'openai') {
    return parseWithOpenAI(intent);
  } else {
    throw new Error(
      `No LLM provider available. Set one of:\n` +
      `  - OPENROUTER_API_KEY (recommended - 100+ models)\n` +
      `  - ANTHROPIC_API_KEY\n` +
      `  - OPENAI_API_KEY`
    );
  }
}

function detectProvider(preferred: string): string {
  // If user specified a provider, try that first
  if (preferred === 'openrouter') {
    if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  } else if (preferred === 'anthropic') {
    if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  } else if (preferred === 'openai') {
    if (process.env.OPENAI_API_KEY) return 'openai';
  } else if (preferred === 'local') {
    // Local could be OpenRouter pointing to local model
    if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  }
  
  // Auto-detect: check in order of preference
  if (process.env.OPENROUTER_API_KEY) return 'openrouter';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.OPENAI_API_KEY) return 'openai';
  
  return 'none';
}

async function parseWithAnthropic(intent: Intent): Promise<ParsedIntent> {
  const Anthropic = await import('@anthropic-ai/sdk');
  const apiKey = process.env.ANTHROPIC_API_KEY!;

  const client = new Anthropic.default({ apiKey });

  const prompt = buildPrompt(intent);

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  return parseResponse(message.content[0], intent);
}

async function parseWithOpenRouter(intent: Intent): Promise<ParsedIntent> {
  const apiKey = process.env.OPENROUTER_API_KEY!;
  const prompt = buildPrompt(intent);

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter error: ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return parseResponseText(data.choices[0].message.content, intent);
}

async function parseWithOpenAI(intent: Intent): Promise<ParsedIntent> {
  const apiKey = process.env.OPENAI_API_KEY!;
  const prompt = buildPrompt(intent);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI error: ${error}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return parseResponseText(data.choices[0].message.content, intent);
}

function buildPrompt(intent: Intent): string {
  return `You are an expert product strategist helping parse user intent for a new software project.

Given this user story:
"${intent.story}"

${intent.vision ? `And this vision: "${intent.vision}"` : ''}
${intent.metrics?.length ? `And these metrics: ${intent.metrics.join(', ')}` : ''}

Please analyze and extract the following in JSON format:

{
  "primaryUser": "Who is the main user? (e.g., 'small business owners')",
  "secondaryUsers": ["Array of secondary user types"],
  "problem": "What problem are they facing? (one clear sentence)",
  "solution": "What solution does this project provide? (one clear sentence)",
  "vision": "12-month ambitious outcome (or use provided vision)",
  "metrics": ["Array of 3-5 SMART success metrics with targets (e.g., 'Average conversion rate improvement >50%')"],
  "suggestedFeatures": ["Array of 5-8 features needed to achieve the metrics"]
}

Be specific and actionable. Ensure metrics are measurable with clear targets.`;
}

function parseResponse(content: { type: string; text?: string }, intent: Intent): ParsedIntent {
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }
  return parseResponseText(content.text || '', intent);
}

function parseResponseText(text: string, intent: Intent): ParsedIntent {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as ParsedIntent;

  if (intent.vision) parsed.vision = intent.vision;
  if (intent.metrics?.length) parsed.metrics = intent.metrics;

  return parsed;
}
