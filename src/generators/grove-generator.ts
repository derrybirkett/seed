import fs from 'fs-extra';
import path from 'path';

interface ParsedIntent {
  primaryUser: string;
  secondaryUsers: string[];
  problem: string;
  solution: string;
  vision: string;
  metrics: string[];
  suggestedFeatures: string[];
}

export async function generateGroveGovernance(projectName: string, intent: ParsedIntent) {
  const projectPath = path.join(process.cwd(), projectName);
  const grovePath = path.join(projectPath, 'grove');

  await fs.ensureDir(path.join(grovePath, 'mission'));
  await fs.ensureDir(path.join(grovePath, 'workflows'));
  await fs.ensureDir(path.join(grovePath, 'patterns'));
  await fs.ensureDir(path.join(grovePath, 'docs'));

  const missionTemplate = `# Mission

## Who It Serves
- Primary: ${intent.primaryUser}
${intent.secondaryUsers.map(u => `- Secondary: ${u}`).join('\n')}

## Problem We Solve
${intent.problem}

## Solution Overview
${intent.solution || 'See project implementation'}

## Vision
${intent.vision}

## Success Metrics
${intent.metrics.map(m => `- ${m}`).join('\n')}

## Non-Goals
- Explicitly list what we are NOT doing

## Current Status
- Stage: discovery
- Next milestone: MVP - validate core metrics
`;

  await fs.writeFile(path.join(grovePath, 'mission', 'mission.md'), missionTemplate);

  const manifestTemplate = `# Grove Agent Manifest

Lightweight agent model for autonomous product development.

## Agent Roles

### Product Agent
**Focus**: What we build
- Owns mission and roadmap
- Prioritizes features
- Defines success metrics

### UX Agent
**Focus**: How it works for users
- Owns user experience decisions
- Reviews UI/UX changes
- Validates user flows

### Dev Agent
**Focus**: How we build it
- Owns technical architecture
- Reviews code quality
- Manages dependencies

## Workflow

### Development Cycle
\`\`\`
Product → UX → Dev → Test → Deploy
\`\`\`

## Decision Rights

| Decision Type | Primary | Secondary |
|--------------|---------|-----------|
| Feature scope | Product | - |
| UX patterns | UX | Dev |
| Architecture | Dev | Product |
| Tech stack | Dev | - |
`;

  await fs.writeFile(path.join(grovePath, 'agent-manifest.md'), manifestTemplate);

  const activityTemplate = `# Activity Log

Track development activity. Updated on each significant change.

| Date | Agent | Change | Rationale | Links |
|------|-------|--------|-----------|-------|
| ${new Date().toISOString().split('T')[0]} | seed | Initialized project | Bootstrap from user intent | mission.md |

## Guidelines

### What to Log
- Feature completions
- Architecture decisions
- Bug fixes
- Design changes

### What NOT to Log
- Minor typos
- Formatting changes
`;

  await fs.ensureDir(path.join(grovePath, 'docs'));
  await fs.writeFile(path.join(grovePath, 'docs', 'activity-log.md'), activityTemplate);

  const workflowTemplate = `# Development Workflow

## Feature Development

### 1. Pick Up Work
- Review mission.md for context
- Check activity log for recent changes
- Pick next item from roadmap

### 2. Implement
- Make changes
- Write tests
- Update docs if needed

### 3. Wrap Up
- Update activity log
- Commit with conventional message
- Push to branch

## Conventional Commits

\`\`\`
feat: new feature
fix: bug fix
docs: documentation
refactor: code restructure
test: adding tests
chore: maintenance
\`\`\`
`;

  await fs.writeFile(path.join(grovePath, 'workflows', 'development.md'), workflowTemplate);

  await fs.writeFile(
    path.join(grovePath, 'README.md'),
    `# Grove

Autonomous agentic layer for this project.

Agents read grove at session start to understand context and responsibilities.

## Structure

- \`mission/\` - Project mission and goals
- \`agent-manifest.md\` - Product/UX/Dev responsibilities
- \`workflows/\` - How work gets done
- \`docs/\` - Activity log

See [Bloom system](../../README.md) for full context.
`
  );
}
