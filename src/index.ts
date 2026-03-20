#!/usr/bin/env node

import { Command } from 'commander';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('seed')
  .description('AI-powered intent bridge for governed project bootstrapping')
  .version('0.1.0');

program
  .command('init [project-name]')
  .description('Initialize a new governed project from intent')
  .option('-s, --story <story>', 'User story describing the project intent')
  .option('--vision <vision>', '12-month vision statement')
  .option('-m, --metric <metric>', 'Success metric (can be repeated)', (value, previous?: string[]) => {
    return previous ? [...previous, value] : [value];
  })
  .option('--provider <provider>', 'LLM provider (openrouter, anthropic, openai, auto)', 'auto')
  .option('--no-hatch', 'Skip hatch code generation (pip only)')
  .option('--no-install', 'Skip installing dependencies')
  .action(initCommand);

program
  .command('check')
  .description('Check alignment between mission and codebase (coming soon)')
  .action(() => {
    console.log('🚧 Coming in v0.4.0 - Continuous alignment checking');
  });

program
  .command('update')
  .description('Update mission or code to restore alignment (coming soon)')
  .action(() => {
    console.log('🚧 Coming in v0.4.0 - Alignment restoration');
  });

program.parse();
