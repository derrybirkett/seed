import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { parseIntent } from '../parsers/intent-parser.js';
import { generatePipGovernance } from '../generators/pip-generator.js';
import { generateHatchCode } from '../generators/hatch-generator.js';
import { validateAlignment } from '../validators/alignment-validator.js';

interface InitOptions {
  story?: string;
  vision?: string;
  metric?: string[];
  provider: 'anthropic' | 'openai' | 'local';
  hatch: boolean;
  install: boolean;
}

export async function initCommand(projectName: string | undefined, options: InitOptions) {
  console.log(chalk.green.bold('\n🌱 Seed - Bootstrap governed projects with AI\n'));

  // Step 1: Gather intent (interactive or from flags)
  const intent = await gatherIntent(projectName, options);

  // Step 2: Parse intent with LLM
  const spinner = ora('Analyzing intent with AI...').start();
  try {
    const parsed = await parseIntent(intent, options.provider);
    spinner.succeed('Intent parsed successfully');

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

    // Step 4: Generate pip governance
    const pipSpinner = ora('Generating governance layer (pip)...').start();
    await generatePipGovernance(intent.projectName, parsed);
    pipSpinner.succeed('Governance layer created');

    // Step 5: Generate hatch code (if enabled)
    if (options.hatch) {
      const hatchSpinner = ora('Generating technical foundation (hatch)...').start();
      await generateHatchCode(intent.projectName, parsed);
      hatchSpinner.succeed('Technical foundation created');
    }

    // Step 6: Validate alignment
    const alignSpinner = ora('Validating alignment...').start();
    const alignment = await validateAlignment(intent.projectName);
    alignSpinner.succeed(`Alignment: ${alignment.score}%`);

    // Step 7: Next steps
    console.log(chalk.green.bold('\n✅ Project initialized successfully!\n'));
    console.log(chalk.cyan('📦 Your project:'), chalk.bold(intent.projectName + '/'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(`   cd ${intent.projectName}`);
    if (options.install) {
      console.log(`   pnpm install`);
    }
    console.log(`   pnpm dev`);
    console.log(chalk.dim('\nThen iterate using pip patterns in .pip/patterns/agent-workflows/'));
  } catch (error) {
    spinner.fail('Failed to parse intent');
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
