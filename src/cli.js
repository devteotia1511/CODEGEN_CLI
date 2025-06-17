#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import boxen from 'boxen';
import * as emoji from 'node-emoji';
import { showMainMenu } from './commands/menu.js';
import { generateProject } from './commands/generate.js';
import { manageTemplates } from './commands/templates.js';
import { configureSettings } from './commands/settings.js';
import { Logger } from './utils/logger.js';
import { ConfigManager } from './utils/config.js';

const program = new Command();
const logger = new Logger();
const config = new ConfigManager();

// Initialize configuration
await config.init();

// Display welcome banner
function displayWelcome() {
  console.clear();
  
  const title = figlet.textSync('CodeGen CLI', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });

  const gradientTitle = gradient(['#FF6B6B', '#4ECDC4', '#45B7D1'])(title);
  
  console.log(gradientTitle);
  
  const welcomeBox = boxen(
    chalk.white.bold(`Welcome to CodeGen CLI! ${emoji.get('rocket')}\n\n`) +
    chalk.gray('A modern tool for generating boilerplate code\n') +
    chalk.gray('with interactive templates and smart scaffolding.'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a'
    }
  );
  
  console.log(welcomeBox);
}

// Setup CLI commands
program
  .name('codegen')
  .description('Modern CLI tool for generating boilerplate code')
  .version('1.0.0');

program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(async () => {
    displayWelcome();
    await showMainMenu();
  });

program
  .command('generate')
  .alias('g')
  .description('Generate a new project')
  .option('-n, --name <name>', 'Project name')
  .option('-f, --framework <framework>', 'Framework (react, vue, angular, etc.)')
  .option('-t, --template <template>', 'Template to use')
  .action(async (options) => {
    displayWelcome();
    await generateProject(options);
  });

program
  .command('templates')
  .alias('t')
  .description('Manage templates')
  .action(async () => {
    displayWelcome();
    await manageTemplates();
  });

program
  .command('config')
  .alias('c')
  .description('Configure settings')
  .action(async () => {
    displayWelcome();
    await configureSettings();
  });

// Default action - show interactive menu
program.action(async () => {
  displayWelcome();
  await showMainMenu();
});

// Handle unknown commands
program.on('command:*', () => {
  logger.error('Invalid command. Use --help to see available commands.');
  process.exit(1);
});

// Parse command line arguments
program.parse();