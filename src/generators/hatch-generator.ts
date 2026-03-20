import { execa } from 'execa';
import { mkdirSync, renameSync, rmSync, existsSync } from 'fs';
import { join } from 'path';

interface ParsedIntent {
  primaryUser: string;
  secondaryUsers: string[];
  problem: string;
  solution: string;
  vision: string;
  metrics: string[];
  suggestedFeatures: string[];
}

export async function generateHatchCode(projectName: string, intent: ParsedIntent) {
  const hatchStory = intent.problem;
  const hatchDescription = intent.solution || intent.problem;
  const targetDir = process.cwd();
  const projectDir = join(targetDir, projectName);

  try {
    // Check if hatch is installed
    await execa('which', ['hatch']);

    // Create a temp directory for hatch to scaffold into
    const tempDir = join(targetDir, '_hatch_temp');
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true });
    }
    mkdirSync(tempDir);

    // Call hatch init in temp directory
    await execa('hatch', [
      'init', projectName,
      '--story', hatchStory,
      '--description', hatchDescription,
      '--author', 'Seed User',
      '--no-git',
      '--no-install'
    ], {
      cwd: tempDir,
      stdio: 'inherit',
    });

    // Move hatch-generated files into project directory
    const hatchOutputDir = join(tempDir, projectName);
    if (existsSync(hatchOutputDir)) {
      const items = ['apps', 'libs', 'package.json', 'nx.json', 'tsconfig.json', 'README.md', '.github', 'docker-compose.yml'];
      for (const item of items) {
        const src = join(hatchOutputDir, item);
        const dest = join(projectDir, item);
        if (existsSync(src)) {
          if (existsSync(dest)) {
            rmSync(dest, { recursive: true });
          }
          renameSync(src, dest);
        }
      }
    }

    // Clean up temp directory
    rmSync(tempDir, { recursive: true });

    console.log('\n✅ Hatch scaffolding complete');
  } catch (error) {
    console.log('\n⚠️  hatch not found or failed. Skipping code generation.');
    console.log('To generate code, install hatch:');
    console.log('   git clone https://github.com/derrybirkett/hatch.git');
    console.log('   cd hatch && npm install && npm link');
    console.log('\nThen run:');
    console.log(`   hatch init ${projectName} --story "${hatchStory}" --description "${hatchDescription}"`);
  }
}
