import { execa } from 'execa';

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
  // Construct hatch story from parsed intent
  const hatchStory = `${intent.solution}. Users can ${intent.suggestedFeatures.slice(0, 5).join(', ')}.`;

  try {
    // Check if hatch is installed
    await execa('which', ['hatch']);

    // Call hatch init with the generated story
    await execa('hatch', ['init', projectName, '--story', hatchStory], {
      stdio: 'inherit',
    });
  } catch (error) {
    console.log('\n⚠️  hatch not found. Skipping code generation.');
    console.log('To generate code, install hatch:');
    console.log('   git clone https://github.com/derrybirkett/hatch.git');
    console.log('   cd hatch && npm install && npm link');
    console.log('\nThen run:');
    console.log(`   hatch init ${projectName} --story "${hatchStory}"`);
  }
}
