import inquirer from 'inquirer';
import chalk from 'chalk';
import * as emoji from 'node-emoji';
import { Logger } from '../utils/logger.js';
import { ConfigManager } from '../utils/config.js';

const logger = new Logger();
const config = new ConfigManager();

export async function configureSettings() {
  try {
    logger.info(`${emoji.get('wrench')} Configuration Settings\n`);

    const currentConfig = await config.getConfig();

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to configure?',
        choices: [
          {
            name: `${emoji.get('gear')} General preferences`,
            value: 'general'
          },
          {
            name: `${emoji.get('art')} Default templates`,
            value: 'templates'
          },
          {
            name: `${emoji.get('package')} Package manager`,
            value: 'package-manager'
          },
          {
            name: `${emoji.get('computer')} Development environment`,
            value: 'dev-env'
          },
          {
            name: `${emoji.get('eyes')} View current configuration`,
            value: 'view'
          },
          {
            name: `${emoji.get('arrows_counterclockwise')} Reset to defaults`,
            value: 'reset'
          },
          {
            name: `${emoji.get('leftwards_arrow_with_hook')} Back to main menu`,
            value: 'back'
          }
        ]
      }
    ]);

    switch (action) {
      case 'general':
        await configureGeneral();
        break;
      case 'templates':
        await configureTemplates();
        break;
      case 'package-manager':
        await configurePackageManager();
        break;
      case 'dev-env':
        await configureDevelopmentEnvironment();
        break;
      case 'view':
        await viewCurrentConfiguration();
        break;
      case 'reset':
        await resetConfiguration();
        break;
      case 'back':
        return;
    }

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      return;
    }
    logger.error('Configuration error:', error.message);
  }
}

async function configureGeneral() {
  const currentConfig = await config.getConfig();

  const settings = await inquirer.prompt([
    {
      type: 'input',
      name: 'defaultAuthor',
      message: 'Default author name:',
      default: currentConfig.defaultAuthor || ''
    },
    {
      type: 'input',
      name: 'defaultEmail',
      message: 'Default email:',
      default: currentConfig.defaultEmail || ''
    },
    {
      type: 'list',
      name: 'logLevel',
      message: 'Log level:',
      choices: ['error', 'warn', 'info', 'debug'],
      default: currentConfig.logLevel || 'info'
    },
    {
      type: 'confirm',
      name: 'autoInstallDependencies',
      message: 'Auto-install dependencies after project generation?',
      default: currentConfig.autoInstallDependencies !== false
    },
    {
      type: 'confirm',
      name: 'showTips',
      message: 'Show helpful tips during generation?',
      default: currentConfig.showTips !== false
    }
  ]);

  await config.updateConfig(settings);
  logger.success('General preferences updated!');
}

async function configureTemplates() {
  const currentConfig = await config.getConfig();

  const settings = await inquirer.prompt([
    {
      type: 'input',
      name: 'templatesDirectory',
      message: 'Custom templates directory:',
      default: currentConfig.templatesDirectory || './templates'
    },
    {
      type: 'confirm',
      name: 'autoUpdateTemplates',
      message: 'Auto-update templates from registry?',
      default: currentConfig.autoUpdateTemplates !== false
    },
    {
      type: 'list',
      name: 'defaultFramework',
      message: 'Default framework for new projects:',
      choices: ['react', 'vue', 'angular', 'svelte', 'express', 'vanilla'],
      default: currentConfig.defaultFramework || 'react'
    }
  ]);

  await config.updateConfig(settings);
  logger.success('Template preferences updated!');
}

async function configurePackageManager() {
  const currentConfig = await config.getConfig();

  const settings = await inquirer.prompt([
    {
      type: 'list',
      name: 'defaultPackageManager',
      message: 'Default package manager:',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'pnpm', value: 'pnpm' }
      ],
      default: currentConfig.defaultPackageManager || 'npm'
    },
    {
      type: 'confirm',
      name: 'useExactVersions',
      message: 'Use exact versions in package.json?',
      default: currentConfig.useExactVersions || false
    },
    {
      type: 'input',
      name: 'npmRegistry',
      message: 'NPM registry URL:',
      default: currentConfig.npmRegistry || 'https://registry.npmjs.org/'
    }
  ]);

  await config.updateConfig(settings);
  logger.success('Package manager preferences updated!');
}

async function configureDevelopmentEnvironment() {
  const currentConfig = await config.getConfig();

  const settings = await inquirer.prompt([
    {
      type: 'list',
      name: 'preferredEditor',
      message: 'Preferred code editor:',
      choices: ['vscode', 'sublime', 'atom', 'vim', 'emacs', 'other'],
      default: currentConfig.preferredEditor || 'vscode'
    },
    {
      type: 'confirm',
      name: 'openInEditor',
      message: 'Open generated projects in editor automatically?',
      default: currentConfig.openInEditor !== false
    },
    {
      type: 'list',
      name: 'terminalShell',
      message: 'Preferred terminal shell:',
      choices: ['bash', 'zsh', 'fish', 'powershell', 'cmd'],
      default: currentConfig.terminalShell || 'bash'
    },
    {
      type: 'confirm',
      name: 'generateGitignore',
      message: 'Generate .gitignore files automatically?',
      default: currentConfig.generateGitignore !== false
    }
  ]);

  await config.updateConfig(settings);
  logger.success('Development environment preferences updated!');
}

async function viewCurrentConfiguration() {
  const currentConfig = await config.getConfig();

  console.log(chalk.bold.cyan('\n📋 Current Configuration:\n'));

  const configDisplay = `
${chalk.bold('General:')}
  ${chalk.gray('Author:')} ${currentConfig.defaultAuthor || 'Not set'}
  ${chalk.gray('Email:')} ${currentConfig.defaultEmail || 'Not set'}
  ${chalk.gray('Log Level:')} ${currentConfig.logLevel || 'info'}
  ${chalk.gray('Auto-install Dependencies:')} ${currentConfig.autoInstallDependencies !== false ? 'Yes' : 'No'}
  ${chalk.gray('Show Tips:')} ${currentConfig.showTips !== false ? 'Yes' : 'No'}

${chalk.bold('Templates:')}
  ${chalk.gray('Templates Directory:')} ${currentConfig.templatesDirectory || './templates'}
  ${chalk.gray('Auto-update Templates:')} ${currentConfig.autoUpdateTemplates !== false ? 'Yes' : 'No'}
  ${chalk.gray('Default Framework:')} ${currentConfig.defaultFramework || 'react'}

${chalk.bold('Package Manager:')}
  ${chalk.gray('Default Package Manager:')} ${currentConfig.defaultPackageManager || 'npm'}
  ${chalk.gray('Use Exact Versions:')} ${currentConfig.useExactVersions ? 'Yes' : 'No'}
  ${chalk.gray('NPM Registry:')} ${currentConfig.npmRegistry || 'https://registry.npmjs.org/'}

${chalk.bold('Development Environment:')}
  ${chalk.gray('Preferred Editor:')} ${currentConfig.preferredEditor || 'vscode'}
  ${chalk.gray('Open in Editor:')} ${currentConfig.openInEditor !== false ? 'Yes' : 'No'}
  ${chalk.gray('Terminal Shell:')} ${currentConfig.terminalShell || 'bash'}
  ${chalk.gray('Generate .gitignore:')} ${currentConfig.generateGitignore !== false ? 'Yes' : 'No'}
  `;

  console.log(configDisplay);
}

async function resetConfiguration() {
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Are you sure you want to reset all settings to defaults?',
      default: false
    }
  ]);

  if (confirm) {
    await config.resetToDefaults();
    logger.success('Configuration reset to defaults!');
  } else {
    logger.info('Reset cancelled.');
  }
}