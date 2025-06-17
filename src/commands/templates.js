import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import * as emoji from 'node-emoji';
import { Logger } from '../utils/logger.js';
import { TemplateManager } from '../utils/templates.js';

const logger = new Logger();
const templateManager = new TemplateManager();

export async function manageTemplates() {
  try {
    logger.info(`${emoji.get('gear')} Template Management\n`);

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          {
            name: `${emoji.get('eyes')} View available templates`,
            value: 'view'
          },
          {
            name: `${emoji.get('art')} Create custom template`,
            value: 'create'
          },
          {
            name: `${emoji.get('pencil2')} Modify existing template`,
            value: 'modify'
          },
          {
            name: `${emoji.get('inbox_tray')} Import template`,
            value: 'import'
          },
          {
            name: `${emoji.get('outbox_tray')} Export template`,
            value: 'export'
          },
          {
            name: `${emoji.get('leftwards_arrow_with_hook')} Back to main menu`,
            value: 'back'
          }
        ]
      }
    ]);

    switch (action) {
      case 'view':
        await viewTemplates();
        break;
      case 'create':
        await createTemplate();
        break;
      case 'modify':
        await modifyTemplate();
        break;
      case 'import':
        await importTemplate();
        break;
      case 'export':
        await exportTemplate();
        break;
      case 'back':
        return;
    }

  } catch (error) {
    if (error.name === 'ExitPromptError') {
      return;
    }
    logger.error('Template management error:', error.message);
  }
}

async function viewTemplates() {
  const spinner = ora('Loading templates...').start();
  
  try {
    const templates = await templateManager.listTemplates();
    spinner.stop();

    if (templates.length === 0) {
      logger.warning('No templates found.');
      return;
    }

    console.log(chalk.bold('\n📋 Available Templates:\n'));

    templates.forEach((template, index) => {
      console.log(`${chalk.cyan(`${index + 1}.`)} ${chalk.bold(template.name)}`);
      console.log(`   ${chalk.gray('Framework:')} ${template.framework}`);
      console.log(`   ${chalk.gray('Description:')} ${template.description || 'No description'}`);
      console.log(`   ${chalk.gray('Features:')} ${template.features?.join(', ') || 'None'}`);
      console.log(`   ${chalk.gray('Version:')} ${template.version || '1.0.0'}`);
      console.log('');
    });

    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: 'Select a template to view details:',
        choices: [
          ...templates.map(t => ({ name: t.name, value: t })),
          { name: 'Back', value: null }
        ]
      }
    ]);

    if (selectedTemplate) {
      await showTemplateDetails(selectedTemplate);
    }

  } catch (error) {
    spinner.fail('Failed to load templates');
    logger.error(error.message);
  }
}

async function showTemplateDetails(template) {
  console.log('\n' + chalk.bold.cyan(`📄 Template: ${template.name}`) + '\n');
  
  const details = `
${chalk.bold('Framework:')} ${template.framework}
${chalk.bold('Version:')} ${template.version || '1.0.0'}
${chalk.bold('Description:')} ${template.description || 'No description'}
${chalk.bold('Author:')} ${template.author || 'Unknown'}
${chalk.bold('Features:')} ${template.features?.join(', ') || 'None'}
${chalk.bold('Created:')} ${template.createdAt || 'Unknown'}
${chalk.bold('Files:')} ${template.files?.length || 0} files
  `;

  console.log(details);

  if (template.files && template.files.length > 0) {
    const { showFiles } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'showFiles',
        message: 'Show template files?',
        default: false
      }
    ]);

    if (showFiles) {
      console.log(chalk.bold('\n📁 Template Files:\n'));
      template.files.forEach(file => {
        console.log(`  ${chalk.gray('•')} ${file}`);
      });
    }
  }
}

async function createTemplate() {
  logger.info('🎨 Creating a new template...\n');

  const templateData = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Template name:',
      validate: input => input.trim() ? true : 'Template name is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Template description:'
    },
    {
      type: 'list',
      name: 'framework',
      message: 'Framework:',
      choices: ['react', 'vue', 'angular', 'svelte', 'express', 'vanilla']
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:'
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Default features:',
      choices: [
        'typescript',
        'eslint',
        'prettier',
        'jest',
        'tailwind',
        'sass',
        'pwa',
        'docker'
      ]
    }
  ]);

  const spinner = ora('Creating template...').start();

  try {
    await templateManager.createTemplate(templateData);
    spinner.succeed(chalk.green(`Template "${templateData.name}" created successfully!`));
  } catch (error) {
    spinner.fail('Failed to create template');
    logger.error(error.message);
  }
}

async function modifyTemplate() {
  const spinner = ora('Loading templates...').start();
  
  try {
    const templates = await templateManager.listTemplates();
    spinner.stop();

    if (templates.length === 0) {
      logger.warning('No templates found to modify.');
      return;
    }

    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: 'Select template to modify:',
        choices: templates.map(t => ({ name: t.name, value: t }))
      }
    ]);

    const { modifications } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'modifications',
        message: 'What would you like to modify?',
        choices: [
          'Description',
          'Features',
          'Files',
          'Configuration'
        ]
      }
    ]);

    logger.info(`Modifying template: ${selectedTemplate.name}`);
    logger.warning('Template modification feature is under development.');

  } catch (error) {
    spinner.fail('Failed to load templates');
    logger.error(error.message);
  }
}

async function importTemplate() {
  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Import template from:',
      choices: [
        'Local file',
        'GitHub repository',
        'URL',
        'Template registry'
      ]
    }
  ]);

  logger.info(`Import from: ${source}`);
  logger.warning('Template import feature is under development.');
}

async function exportTemplate() {
  const spinner = ora('Loading templates...').start();
  
  try {
    const templates = await templateManager.listTemplates();
    spinner.stop();

    if (templates.length === 0) {
      logger.warning('No templates found to export.');
      return;
    }

    const { selectedTemplate } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedTemplate',
        message: 'Select template to export:',
        choices: templates.map(t => ({ name: t.name, value: t }))
      }
    ]);

    const { exportFormat } = await inquirer.prompt([
      {
        type: 'list',
        name: 'exportFormat',
        message: 'Export format:',
        choices: [
          'ZIP archive',
          'TAR.GZ archive',
          'JSON configuration',
          'GitHub repository'
        ]
      }
    ]);

    logger.info(`Exporting template: ${selectedTemplate.name} as ${exportFormat}`);
    logger.warning('Template export feature is under development.');

  } catch (error) {
    spinner.fail('Failed to load templates');
    logger.error(error.message);
  }
}