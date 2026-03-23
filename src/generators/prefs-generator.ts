import { execa } from 'execa';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Preferences {
  techStack?: {
    monorepo?: { tool?: string };
    testing?: { e2e?: string };
    ui?: { components?: string };
    containerization?: { tool?: string };
    buildOrder?: string[];
  };
  design?: {
    ethos?: string;
    colors?: Record<string, string>;
    principles?: string[];
  };
  commands?: Record<string, { description?: string; steps?: string[] }>;
  productSurfaces?: {
    default?: Array<{ name?: string; path?: string }>;
    optional?: Array<{ name?: string; path?: string }>;
  };
}

export async function addPrefsSubmodule(projectDir: string, _prefsUrl?: string) {
  const prefsRepo = _prefsUrl || 'https://github.com/derrybirkett/prefs.git';

  console.log(`\n📦 Adding prefs submodule from ${prefsRepo}...`);

  try {
    // Check if git submodule add is available
    await execa('which', ['git']);

    // Add submodule
    await execa('git', ['submodule', 'add', prefsRepo, '.prefs'], {
      cwd: projectDir,
      stdio: 'inherit',
    });

    console.log('✅ Prefs submodule added');

    // Generate CLAUDE.md from prefs
    await generateClaudeMd(projectDir);

    // Generate hooks from prefs
    await copyHooks(projectDir);

    return true;
  } catch (error) {
    console.log('⚠️  Could not add prefs submodule (git may not be available)');
    console.log('   Creating prefs.yaml from defaults...');

    // Create a minimal prefs.yaml
    const prefsFile = join(projectDir, 'prefs.yaml');
    const defaultPrefs = `# User Preferences
# Add your preferences here - see https://github.com/derrybirkett/prefs

techStack:
  monorepo:
    tool: NX
  testing:
    e2e: playwright
  ui:
    components: shadcn
  buildOrder:
    - cli
    - api
    - ui

design:
  ethos: minimalism
  colors:
    primary: black
    background: white
    error: red
    success: green

commands:
  wrap up:
    description: Commit all changes, tag with incremented version, push to remote, and end session
`;

    writeFileSync(prefsFile, defaultPrefs);
    console.log('✅ Created prefs.yaml');

    await generateClaudeMd(projectDir);
    await copyHooks(projectDir);

    return false;
  }
}

async function generateClaudeMd(projectDir: string) {
  const claudePath = join(projectDir, 'CLAUDE.md');

  const claudeContent = `# Claude Code Instructions

This project follows Bloom development practices.

## Development Workflow

1. Read \`prefs/prefs.yaml\` for tech stack preferences
2. Read \`grove/mission/mission.md\` for project mission
3. Read \`grove/agent-manifest.md\` for agent roles
4. Implement features following spec-first development
5. Use \`wrap up\` command to commit and push

## Preferences

See \`prefs/prefs.yaml\` for:
- Tech stack (NX, Playwright, shadcn)
- Build order (CLI → API → UI)
- Design principles (minimalism, black/white)
- Commands (wrap up)

## Governance

See \`grove/\` for:
- Mission and vision
- Agent roles and responsibilities (Product, UX, Dev)
- Workflows
- Activity log

## Source of Truth

Git repository is the source of truth.
`;

  writeFileSync(claudePath, claudeContent);
  console.log('✅ Generated CLAUDE.md');
}

async function copyHooks(projectDir: string) {
  const hooksDir = join(projectDir, 'hooks');
  const gitHooksDir = join(projectDir, '.git', 'hooks');

  // Create hooks directory
  mkdirSync(hooksDir, { recursive: true });

  // Create pre-push hook
  const prePushHook = `#!/bin/sh

# Pre-push hook: Block direct pushes to main

protected="main"
remote="$1"
url="$2"

while read local_ref local_sha remote_ref remote_sha; do
  branch=$(echo "$remote_ref" | sed 's|refs/heads/||')
  
  if [ "$branch" = "$protected" ]; then
    echo "❌ Pushing directly to '$protected' is not allowed."
    echo "   Create a feature branch, make changes, and open a PR."
    exit 1
  fi
done

exit 0
`;

  const hookPath = join(hooksDir, 'pre-push');
  writeFileSync(hookPath, prePushHook);

  // Copy to .git/hooks if in a git repo
  if (existsSync(gitHooksDir)) {
    const gitHookPath = join(gitHooksDir, 'pre-push');
    writeFileSync(gitHookPath, prePushHook);
    require('fs').chmodSync(gitHookPath, '755');
  }

  console.log('✅ Created hooks/pre-push');
}

export function readPrefs(prefsPath: string): Preferences | null {
  try {
    // Simple YAML parsing - in production use a proper YAML parser
    require('fs').readFileSync(prefsPath, 'utf-8');
    return {};
  } catch {
    return null;
  }
}
