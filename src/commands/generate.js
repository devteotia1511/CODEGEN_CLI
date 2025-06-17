import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import validatePackageName from 'validate-npm-package-name';
import * as emoji from 'node-emoji';
import { Logger } from '../utils/logger.js';
import { TemplateManager } from '../utils/templates.js';
import { ConfigManager } from '../utils/config.js';

const logger = new Logger();
const templateManager = new TemplateManager();
const config = new ConfigManager();

// Get the user's Downloads directory
function getDownloadsPath() {
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (process.platform === 'win32') {
    return path.join(homeDir, 'Downloads');
  } else {
    return path.join(homeDir, 'Downloads');
  }
}

export async function generateProject(options = {}) {
  try {
    logger.info(`${emoji.get('rocket')} Starting project generation for "${options.name}"...`);

    // For web interface, we expect all options to be provided
    if (!options.name || !options.framework) {
      throw new Error('Project name and framework are required');
    }

    const projectDetails = {
      name: options.name,
      framework: options.framework,
      features: options.features || [],
      packageManager: options.packageManager || 'npm',
      template: options.template
    };
    
    // Validate project name
    if (!validateProjectName(projectDetails.name)) {
      throw new Error('Invalid project name');
    }

    // Set project path to Downloads folder
    const downloadsPath = getDownloadsPath();
    const projectPath = path.join(downloadsPath, projectDetails.name);
    projectDetails.projectPath = projectPath;

    // Check if directory already exists and remove it
    if (await fs.pathExists(projectPath)) {
      logger.info(`Removing existing directory "${projectDetails.name}" from Downloads...`);
      await fs.remove(projectPath);
    }

    // Generate the project
    await scaffoldProject(projectDetails);
    
    // Show success message
    logger.success(`Project "${projectDetails.name}" generated successfully in Downloads folder!`);
    
    // Return project details for UI display
    return {
      success: true,
      projectPath: projectPath,
      projectDetails
    };

  } catch (error) {
    logger.error('Failed to generate project:', error.message);
    throw error;
  }
}

async function getProjectDetails(options) {
  // If all required options are provided, skip prompts (web API call)
  if (options.name && options.framework) {
    return {
      name: options.name,
      framework: options.framework,
      features: options.features || [],
      packageManager: options.packageManager || 'npm',
      template: options.template
    };
  }

  const questions = [];

  // Project name
  if (!options.name) {
    questions.push({
      type: 'input',
      name: 'name',
      message: `${emoji.get('file_folder')} Project name:`,
      validate: (input) => {
        if (!input.trim()) return 'Project name is required';
        const validation = validatePackageName(input.trim());
        if (!validation.validForNewPackages) {
          return validation.errors?.[0] || 'Invalid package name';
        }
        return true;
      },
      filter: (input) => input.trim().toLowerCase()
    });
  }

  // Framework selection
  if (!options.framework) {
    questions.push({
      type: 'list',
      name: 'framework',
      message: `${emoji.get('gear')} Choose a framework:`,
      choices: [
        { name: 'React', value: 'react' },
        { name: 'Vue.js', value: 'vue' },
        { name: 'Angular', value: 'angular' },
        { name: 'Svelte', value: 'svelte' },
        { name: 'Next.js', value: 'nextjs' },
        { name: 'Nuxt.js', value: 'nuxtjs' },
        { name: 'Express.js', value: 'express' },
        { name: 'Vanilla JavaScript', value: 'vanilla' }
      ]
    });
  }

  // Features selection
  questions.push({
    type: 'checkbox',
    name: 'features',
    message: `${emoji.get('sparkles')} Select features to include:`,
    choices: [
      { name: 'TypeScript', value: 'typescript', checked: true },
      { name: 'ESLint', value: 'eslint', checked: true },
      { name: 'Prettier', value: 'prettier', checked: true },
      { name: 'Jest Testing', value: 'jest' },
      { name: 'Cypress E2E', value: 'cypress' },
      { name: 'Tailwind CSS', value: 'tailwind' },
      { name: 'Sass/SCSS', value: 'sass' },
      { name: 'PWA Support', value: 'pwa' },
      { name: 'Docker', value: 'docker' },
      { name: 'GitHub Actions', value: 'github-actions' }
    ]
  });

  // Package manager
  questions.push({
    type: 'list',
    name: 'packageManager',
    message: `${emoji.get('package')} Package manager:`,
    choices: [
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
      { name: 'pnpm', value: 'pnpm' }
    ],
    default: 'npm'
  });

  const answers = await inquirer.prompt(questions);
  
  return {
    name: options.name || answers.name,
    framework: options.framework || answers.framework,
    features: answers.features || [],
    packageManager: answers.packageManager || 'npm',
    template: options.template
  };
}

function validateProjectName(name) {
  const validation = validatePackageName(name);
  
  if (!validation.validForNewPackages) {
    logger.error('Invalid project name:');
    if (validation.errors) {
      validation.errors.forEach(error => logger.error(`  • ${error}`));
    }
    if (validation.warnings) {
      validation.warnings.forEach(warning => logger.warning(`  • ${warning}`));
    }
    return false;
  }
  
  return true;
}

async function scaffoldProject(details) {
  try {
    // Create project directory
    logger.info('Creating project directory in Downloads...');
    await fs.ensureDir(details.projectPath);
    
    // Generate base template
    logger.info('Generating base template...');
    await templateManager.generateFromTemplate(details.framework, details.projectPath, details);
    
    // Add selected features
    if (details.features.length > 0) {
      logger.info(`Adding selected features: ${details.features.join(', ')}...`);
      for (const feature of details.features) {
        logger.info(`Adding ${feature}...`);
        await templateManager.addFeature(details.projectPath, feature, details);
        await new Promise(resolve => setTimeout(resolve, 200)); // Small delay for UX
      }
    }
    
    // Create package.json
    logger.info('Creating package.json...');
    await createPackageJson(details);
    
    // Install dependencies
    logger.info('Preparing dependency information...');
    await installDependencies(details);
    
    logger.success(`Project "${details.name}" created successfully in Downloads folder!`);
    
  } catch (error) {
    logger.error('Failed to create project');
    throw error;
  }
}

async function createPackageJson(details) {
  const packageJson = {
    name: details.name,
    version: '1.0.0',
    description: `A ${details.framework} project generated with CodeGen CLI`,
    main: 'index.js',
    scripts: getScriptsForFramework(details.framework, details.features),
    dependencies: getDependenciesForFramework(details.framework, details.features),
    devDependencies: getDevDependenciesForFramework(details.framework, details.features),
    private: true
  };

  await fs.writeJson(path.join(details.projectPath, 'package.json'), packageJson, { spaces: 2 });
}

function getScriptsForFramework(framework, features) {
  const baseScripts = {
    react: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    vue: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    express: {
      start: 'node index.js',
      dev: 'nodemon index.js'
    }
  };

  let scripts = baseScripts[framework] || { start: 'node index.js' };

  if (features.includes('eslint')) {
    scripts.lint = 'eslint . --ext .js,.jsx,.ts,.tsx';
    scripts['lint:fix'] = 'eslint . --ext .js,.jsx,.ts,.tsx --fix';
  }

  if (features.includes('jest')) {
    scripts.test = 'jest';
    scripts['test:watch'] = 'jest --watch';
  }

  return scripts;
}

function getDependenciesForFramework(framework, features) {
  const baseDependencies = {
    react: { react: '^18.2.0', 'react-dom': '^18.2.0' },
    vue: { vue: '^3.3.0' },
    express: { express: '^4.18.0' },
    vanilla: {}
  };

  let dependencies = { ...(baseDependencies[framework] || {}) };

  if (features.includes('tailwind')) {
    dependencies.tailwindcss = '^3.3.0';
  }

  return dependencies;
}

function getDevDependenciesForFramework(framework, features) {
  let devDependencies = {};

  if (['react', 'vue'].includes(framework)) {
    devDependencies.vite = '^4.4.0';
  }

  if (features.includes('typescript')) {
    devDependencies.typescript = '^5.0.0';
    if (framework === 'react') {
      devDependencies['@types/react'] = '^18.2.0';
      devDependencies['@types/react-dom'] = '^18.2.0';
    }
  }

  if (features.includes('eslint')) {
    devDependencies.eslint = '^8.45.0';
  }

  if (features.includes('prettier')) {
    devDependencies.prettier = '^3.0.0';
  }

  if (features.includes('jest')) {
    devDependencies.jest = '^29.6.0';
  }

  return devDependencies;
}

async function installDependencies(details) {
  // For web interface, we'll skip actual installation but provide feedback
  logger.info(`Dependencies will be installed when you run '${details.packageManager} install' in the project directory.`);
  
  // Simulate a brief delay for UX
  await new Promise(resolve => setTimeout(resolve, 1000));
}

function showSuccessMessage(details) {
  console.log('\n');
  
  const successBox = `
${chalk.green.bold('🎉 Success!')} Your project has been created!

${chalk.bold('Project Details:')}
${chalk.gray('Name:')} ${chalk.cyan(details.name)}
${chalk.gray('Framework:')} ${chalk.cyan(details.framework)}
${chalk.gray('Features:')} ${chalk.cyan(details.features.join(', ') || 'None')}
${chalk.gray('Package Manager:')} ${chalk.cyan(details.packageManager)}

${chalk.bold('Next Steps:')}
${chalk.gray('1.')} cd ${details.name}
${chalk.gray('2.')} ${details.packageManager} install
${chalk.gray('3.')} ${details.packageManager} run dev

${chalk.dim('Happy coding! 🚀')}
  `;

  console.log(successBox);
}