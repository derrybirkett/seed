import Anthropic from '@anthropic-ai/sdk';

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
  if (provider === 'anthropic') {
    return parseWithAnthropic(intent);
  } else if (provider === 'openai') {
    throw new Error('OpenAI provider not yet implemented. Use --provider anthropic');
  } else if (provider === 'local') {
    throw new Error('Local provider not yet implemented. Use --provider anthropic');
  } else {
    throw new Error(`Unknown provider: ${provider}`);
  }
}

async function parseWithAnthropic(intent: Intent): Promise<ParsedIntent> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      'ANTHROPIC_API_KEY not found. Set it with: export ANTHROPIC_API_KEY="sk-ant-..."'
    );
  }

  const client = new Anthropic({ apiKey });

  const prompt = `You are an expert product strategist helping parse user intent for a new software project.

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

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  // Extract JSON from response
  const content = message.content[0];
  if (content.type !== 'text') {
    throw new Error('Unexpected response type from Claude');
  }

  // Parse JSON from text (Claude might wrap it in markdown)
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to extract JSON from Claude response');
  }

  const parsed = JSON.parse(jsonMatch[0]) as ParsedIntent;

  // Override with user-provided values if present
  if (intent.vision) {
    parsed.vision = intent.vision;
  }
  if (intent.metrics?.length) {
    parsed.metrics = intent.metrics;
  }

  return parsed;
}
