import inquirer from 'inquirer';
import chalk from 'chalk';
import * as emoji from 'node-emoji';
import { generateProject } from './generate.js';
import { manageTemplates } from './templates.js';
import { configureSettings } from './settings.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger();

export async function showMainMenu() {
  try {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: `${emoji.get('sparkles')} What would you like to do?`,
        choices: [
          {
            name: `${emoji.get('rocket')} Generate new project`,
            value: 'generate'
          },
          {
            name: `${emoji.get('building_construction')} Add components/modules`,
            value: 'add'
          },
          {
            name: `${emoji.get('gear')} Manage templates`,
            value: 'templates'
          },
          {
            name: `${emoji.get('wrench')} Configure settings`,
            value: 'settings'
          },
          {
            name: `${emoji.get('wave')} Exit`,
            value: 'exit'
          }
        ],
        pageSize: 6
      }
    ]);

    switch (action) {
      case 'generate':
        await generateProject();
        break;
      case 'add':
        await addComponents();
        break;
      case 'templates':
        await manageTemplates();
        break;
      case 'settings':
        await configureSettings();
        break;
      case 'exit':
        logger.success('Thanks for using CodeGen CLI! Happy coding! 🚀');
        process.exit(0);
        break;
    }

    // Show menu again unless user exits
    if (action !== 'exit') {
      const { continueMenu } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'continueMenu',
          message: 'Would you like to return to the main menu?',
          default: true
        }
      ]);

      if (continueMenu) {
        console.log('\n');
        await showMainMenu();
      } else {
        logger.success('Thanks for using CodeGen CLI! Happy coding! 🚀');
      }
    }
  } catch (error) {
    if (error.name === 'ExitPromptError') {
      logger.info('\nGoodbye! 👋');
      process.exit(0);
    }
    logger.error('An error occurred in the main menu:', error.message);
  }
}

async function addComponents() {
  logger.info('🔧 Component/Module addition feature coming soon!');
  
  const { componentType } = await inquirer.prompt([
    {
      type: 'list',
      name: 'componentType',
      message: 'What would you like to add?',
      choices: [
        'React Component',
        'Vue Component',
        'Angular Component',
        'Service/Utility',
        'Test File',
        'Documentation'
      ]
    }
  ]);

  logger.info(`Selected: ${componentType}`);
  logger.warning('This feature is under development. Stay tuned!');
}