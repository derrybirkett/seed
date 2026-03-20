import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { join } from 'path';
import { parseIntent } from '../parsers/intent-parser.js';
import { generateGroveGovernance } from '../generators/grove-generator.js';
import { generateHatchCode } from '../generators/hatch-generator.js';
import { addPrefsSubmodule } from '../generators/prefs-generator.js';
import { validateAlignment } from '../validators/alignment-validator.js';

interface InitOptions {
  story?: string;
  vision?: string;
  metric?: string[];
  provider: 'anthropic' | 'openai' | 'local';
  hatch: boolean;
  install: boolean;
  llm: boolean;
  prefs: boolean | string;
  grove: boolean;
}

export async function initCommand(projectName: string | undefined, options: InitOptions) {
  console.log(chalk.green.bold('\n🌱 Seed - Plant your idea\n'));

  try {
    // Step 1: Gather intent
    const intent = await gatherIntent(projectName, options);

    let parsed: {
      primaryUser: string;
      secondaryUsers: string[];
      problem: string;
      solution: string;
      vision: string;
      metrics: string[];
      suggestedFeatures: string[];
    };

    // Step 2: Parse intent (LLM or direct)
    if (options.llm) {
      const spinner = ora('Analyzing intent with AI...').start();
      try {
        parsed = await parseIntent(intent, options.provider);
        spinner.succeed('Intent parsed successfully');
      } catch (error) {
        spinner.fail('Failed to parse intent');
        throw error;
      }
    } else {
      console.log(chalk.cyan('\n📋 Direct Mission (no LLM):\n'));
      parsed = {
        primaryUser: 'user',
        secondaryUsers: [],
        problem: intent.story || 'No story provided',
        solution: 'See mission description',
        vision: intent.vision || 'Not specified',
        metrics: intent.metrics || ['No metrics specified'],
        suggestedFeatures: [],
      };
      console.log(`   Story: ${intent.story}`);
      console.log(`   Vision: ${parsed.vision}`);
      console.log(`   Metrics: ${parsed.metrics.join(', ')}`);
    }

    // Step 3: Show preview and confirm
    console.log(chalk.cyan('\n📋 Generated Mission:\n'));
    console.log(`   Primary User: ${parsed.primaryUser}`);
    console.log(`   Problem: ${parsed.problem}`);
    console.log(`   Solution: ${parsed.solution}`);
    console.log(`   Vision: ${parsed.vision}`);
    console.log(`\n   Success Metrics:`);
    parsed.metrics.forEach(m => console.log(`   - ${m}`));

    const { approve } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'approve',
        message: 'Approve mission?',
        default: true,
      },
    ]);

    if (!approve) {
      console.log(chalk.yellow('\n❌ Mission rejected. Exiting.'));
      return;
    }

    // Step 4: Generate grove (agentic layer)
    if (options.grove) {
      const groveSpinner = ora('Seeding intent into grove...').start();
      await generateGroveGovernance(intent.projectName, parsed);
      groveSpinner.succeed('Grove seeded with mission');
    }

    // Step 5: Add prefs
    if (options.prefs) {
      const prefsSpinner = ora('Adding preferences...').start();
      const projectPath = join(process.cwd(), intent.projectName);
      const prefsUrl = typeof options.prefs === 'string' ? options.prefs : undefined;
      await addPrefsSubmodule(projectPath, prefsUrl);
      prefsSpinner.succeed('Preferences added');
    }

    // Step 6: Generate hatch (stack scaffold)
    if (options.hatch) {
      const hatchSpinner = ora('Scaffolding with hatch...').start();
      await generateHatchCode(intent.projectName, parsed);
      hatchSpinner.succeed('Stack scaffolded');
    }

    // Step 7: Validate alignment
    if (options.grove) {
      const alignSpinner = ora('Validating alignment...').start();
      const alignment = await validateAlignment(intent.projectName);
      alignSpinner.succeed(`Alignment: ${alignment.score}%`);
    }

    // Step 8: Summary
    console.log(chalk.green.bold('\n✅ Project planted successfully!\n'));
    console.log(chalk.cyan('📦 Your project:'), chalk.bold(intent.projectName + '/'));
    console.log(chalk.cyan('\nComponents:'));
    if (options.grove) console.log('   ✓ grove/ - Agentic layer');
    if (options.prefs) console.log('   ✓ prefs/ - Your preferences');
    if (options.hatch) console.log('   ✓ apps/ - Scaffolded stack');
    
    console.log(chalk.cyan('\nNext steps:'));
    console.log(`   cd ${intent.projectName}`);
    if (options.install) {
      console.log(`   pnpm install`);
    }
    console.log(`   pnpm dev`);
    console.log(chalk.dim('\nAgents read grove/ at session start to understand context.'));
  } catch (error) {
    console.error(chalk.red('\n❌ Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

async function gatherIntent(projectName: string | undefined, options: InitOptions) {
  // If all required info provided via flags, skip interactive mode
  if (projectName && options.story && options.vision && options.metric) {
    return {
      projectName,
      story: options.story,
      vision: options.vision,
      metrics: options.metric,
    };
  }

  // Interactive mode
  console.log(chalk.cyan("Let's understand your project intent:\n"));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: projectName,
      validate: (input) => input.length > 0 || 'Project name is required',
    },
    {
      type: 'input',
      name: 'role',
      message: 'Who are you? (your role)',
      default: 'developer',
    },
    {
      type: 'input',
      name: 'primaryUser',
      message: "Who's your primary user?",
      validate: (input) => input.length > 0 || 'Primary user is required',
    },
    {
      type: 'input',
      name: 'goal',
      message: 'What do they want to accomplish?',
      validate: (input) => input.length > 0 || 'Goal is required',
    },
    {
      type: 'input',
      name: 'outcome',
      message: 'Why does this matter to them?',
      validate: (input) => input.length > 0 || 'Outcome is required',
    },
    {
      type: 'input',
      name: 'vision',
      message: "What's your 12-month vision?",
      default: options.vision,
    },
    {
      type: 'input',
      name: 'metric',
      message: 'Key success metric? (e.g., "avg_conversion:>50%")',
    },
  ]);

  // Construct story from parts
  const story =
    options.story ||
    `As a ${answers.role}, I want ${answers.primaryUser} to ${answers.goal}, so they can ${answers.outcome}`;

  return {
    projectName: answers.projectName,
    story,
    vision: answers.vision,
    metrics: options.metric || [answers.metric],
  };
}
