import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import { Logger } from './logger.js';
import { ConfigManager } from './config.js';

const logger = new Logger();
const config = new ConfigManager();

export class TemplateManager {
  constructor() {
    this.templatesDir = null;
    this.init();
  }

  async init() {
    const configData = await config.getConfig();
    this.templatesDir = configData.templatesDirectory;
    await this.ensureDefaultTemplates();
  }

  async ensureDefaultTemplates() {
    try {
      await fs.ensureDir(this.templatesDir);
      
      // Check if we have any templates, if not create default ones
      const existingTemplates = await this.listTemplates();
      if (existingTemplates.length === 0) {
        await this.createDefaultTemplates();
      }
    } catch (error) {
      logger.error('Failed to initialize templates:', error.message);
    }
  }

  async createDefaultTemplates() {
    const defaultTemplates = [
      {
        name: 'react-basic',
        framework: 'react',
        description: 'Basic React application with modern tooling',
        features: ['typescript', 'eslint', 'prettier'],
        version: '1.0.0',
        author: 'CodeGen CLI'
      },
      {
        name: 'vue-starter',
        framework: 'vue',
        description: 'Vue.js starter template with composition API',
        features: ['typescript', 'eslint', 'prettier'],
        version: '1.0.0',
        author: 'CodeGen CLI'
      },
      {
        name: 'express-api',
        framework: 'express',
        description: 'Express.js REST API with middleware',
        features: ['typescript', 'eslint', 'jest'],
        version: '1.0.0',
        author: 'CodeGen CLI'
      }
    ];

    for (const template of defaultTemplates) {
      await this.createTemplate(template);
    }
  }

  async listTemplates() {
    try {
      const templateDirs = await fs.readdir(this.templatesDir);
      const templates = [];

      for (const dir of templateDirs) {
        const templatePath = path.join(this.templatesDir, dir);
        const configPath = path.join(templatePath, 'template.json');
        
        if (await fs.pathExists(configPath)) {
          const templateConfig = await fs.readJson(configPath);
          const files = await this.getTemplateFiles(templatePath);
          
          templates.push({
            ...templateConfig,
            files,
            path: templatePath
          });
        }
      }

      return templates;
    } catch (error) {
      logger.debug('Error listing templates:', error.message);
      return [];
    }
  }

  async getTemplateFiles(templatePath) {
    try {
      const files = await glob('**/*', {
        cwd: templatePath,
        ignore: ['template.json', 'node_modules/**'],
        nodir: true
      });
      return files;
    } catch (error) {
      return [];
    }
  }

  async createTemplate(templateData) {
    const templateDir = path.join(this.templatesDir, templateData.name);
    await fs.ensureDir(templateDir);

    // Save template configuration
    const templateConfig = {
      ...templateData,
      createdAt: new Date().toISOString(),
      files: []
    };

    await fs.writeJson(path.join(templateDir, 'template.json'), templateConfig, { spaces: 2 });

    // Create base template files based on framework
    await this.generateTemplateFiles(templateDir, templateData);
  }

  async generateTemplateFiles(templateDir, templateData) {
    const { framework, features } = templateData;

    switch (framework) {
      case 'react':
        await this.createReactTemplate(templateDir, features);
        break;
      case 'vue':
        await this.createVueTemplate(templateDir, features);
        break;
      case 'express':
        await this.createExpressTemplate(templateDir, features);
        break;
      case 'vanilla':
        await this.createVanillaTemplate(templateDir, features);
        break;
      default:
        await this.createGenericTemplate(templateDir, features);
    }
  }

  async createReactTemplate(templateDir, features) {
    const isTypeScript = features.includes('typescript');
    const ext = isTypeScript ? 'tsx' : 'jsx';

    // Create src directory structure
    await fs.ensureDir(path.join(templateDir, 'src'));
    await fs.ensureDir(path.join(templateDir, 'public'));

    // Main App component
    const appContent = `${isTypeScript ? 'import React from \'react\';\n' : ''}
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to {{projectName}}</h1>
        <p>A React application generated with CodeGen CLI</p>
      </header>
    </div>
  );
}

export default App;`;

    await fs.writeFile(path.join(templateDir, `src/App.${ext}`), appContent);

    // Main entry point
    const indexContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    await fs.writeFile(path.join(templateDir, `src/main.${isTypeScript ? 'tsx' : 'jsx'}`), indexContent);

    // Basic CSS
    const cssContent = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 40px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}`;

    await fs.writeFile(path.join(templateDir, 'src/index.css'), cssContent);

    // HTML template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.${isTypeScript ? 'tsx' : 'jsx'}"></script>
  </body>
</html>`;

    await fs.writeFile(path.join(templateDir, 'index.html'), htmlContent);

    // Vite config
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`;

    await fs.writeFile(path.join(templateDir, 'vite.config.js'), viteConfig);

    if (isTypeScript) {
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          useDefineForClassFields: true,
          lib: ["ES2020", "DOM", "DOM.Iterable"],
          module: "ESNext",
          skipLibCheck: true,
          moduleResolution: "bundler",
          allowImportingTsExtensions: true,
          resolveJsonModule: true,
          isolatedModules: true,
          noEmit: true,
          jsx: "react-jsx",
          strict: true,
          noUnusedLocals: true,
          noUnusedParameters: true,
          noFallthroughCasesInSwitch: true
        },
        include: ["src"],
        references: [{ path: "./tsconfig.node.json" }]
      };

      await fs.writeJson(path.join(templateDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
    }
  }

  async createVueTemplate(templateDir, features) {
    const isTypeScript = features.includes('typescript');

    await fs.ensureDir(path.join(templateDir, 'src'));

    const appContent = `<template>
  <div id="app">
    <header>
      <h1>Welcome to {{projectName}}</h1>
      <p>A Vue.js application generated with CodeGen CLI</p>
    </header>
  </div>
</template>

<script${isTypeScript ? ' lang="ts"' : ''}>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>`;

    await fs.writeFile(path.join(templateDir, 'src/App.vue'), appContent);

    const mainContent = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`;

    await fs.writeFile(path.join(templateDir, `src/main.${isTypeScript ? 'ts' : 'js'}`), mainContent);

    // HTML template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{projectName}}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${isTypeScript ? 'ts' : 'js'}"></script>
  </body>
</html>`;

    await fs.writeFile(path.join(templateDir, 'index.html'), htmlContent);
  }

  async createExpressTemplate(templateDir, features) {
    const isTypeScript = features.includes('typescript');
    const ext = isTypeScript ? 'ts' : 'js';

    const indexContent = `${isTypeScript ? 'import express, { Request, Response } from \'express\';\n' : 'const express = require(\'express\');\n'}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req${isTypeScript ? ': Request' : ''}, res${isTypeScript ? ': Response' : ''}) => {
  res.json({
    message: 'Welcome to {{projectName}} API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req${isTypeScript ? ': Request' : ''}, res${isTypeScript ? ': Response' : ''}) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});

${isTypeScript ? 'export default app;' : 'module.exports = app;'}`;

    await fs.writeFile(path.join(templateDir, `index.${ext}`), indexContent);

    if (isTypeScript) {
      const tsConfig = {
        compilerOptions: {
          target: "ES2020",
          module: "commonjs",
          lib: ["ES2020"],
          outDir: "./dist",
          rootDir: "./",
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          resolveJsonModule: true
        },
        include: ["**/*"],
        exclude: ["node_modules", "dist"]
      };

      await fs.writeJson(path.join(templateDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
    }
  }

  async createVanillaTemplate(templateDir, features) {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{projectName}}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to {{projectName}}</h1>
        <p>A vanilla JavaScript project generated with CodeGen CLI</p>
        <button id="clickBtn">Click me!</button>
        <p id="message"></p>
    </div>
    <script src="script.js"></script>
</body>
</html>`;

    const cssContent = `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f4f4f4;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
    background: white;
    margin-top: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin: 1rem 0;
}

button:hover {
    background-color: #0056b3;
}`;

    const jsContent = `document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('clickBtn');
    const message = document.getElementById('message');
    let clickCount = 0;

    button.addEventListener('click', function() {
        clickCount++;
        message.textContent = \`Button clicked \${clickCount} time\${clickCount === 1 ? '' : 's'}!\`;
    });

    console.log('{{projectName}} initialized successfully!');
});`;

    await fs.writeFile(path.join(templateDir, 'index.html'), htmlContent);
    await fs.writeFile(path.join(templateDir, 'style.css'), cssContent);
    await fs.writeFile(path.join(templateDir, 'script.js'), jsContent);
  }

  async createGenericTemplate(templateDir, features) {
    const readmeContent = `# {{projectName}}

A project generated with CodeGen CLI

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start development:
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

${features.map(feature => `- ${feature}`).join('\n')}

## License

MIT
`;

    await fs.writeFile(path.join(templateDir, 'README.md'), readmeContent);
  }

  async generateFromTemplate(framework, projectName, projectDetails) {
    const templates = await this.listTemplates();
    const template = templates.find(t => t.framework === framework) || templates[0];

    if (!template) {
      throw new Error(`No template found for framework: ${framework}`);
    }

    await this.scaffoldFromTemplate(template, projectName, projectDetails);
  }

  async scaffoldFromTemplate(template, projectName, projectDetails) {
    const templatePath = template.path;
    const files = await glob('**/*', {
      cwd: templatePath,
      ignore: ['template.json'],
      nodir: true
    });

    for (const file of files) {
      const sourcePath = path.join(templatePath, file);
      const targetPath = path.join(projectName, file);

      await fs.ensureDir(path.dirname(targetPath));

      let content = await fs.readFile(sourcePath, 'utf-8');
      
      // Replace template variables
      content = content.replace(/\{\{projectName\}\}/g, projectName);
      content = content.replace(/\{\{projectDescription\}\}/g, projectDetails.description || '');
      
      await fs.writeFile(targetPath, content);
    }
  }

  async addFeature(projectPath, feature, projectDetails) {
    switch (feature) {
      case 'eslint':
        await this.addESLint(projectPath, projectDetails);
        break;
      case 'prettier':
        await this.addPrettier(projectPath);
        break;
      case 'jest':
        await this.addJest(projectPath, projectDetails);
        break;
      case 'tailwind':
        await this.addTailwind(projectPath, projectDetails);
        break;
      case 'docker':
        await this.addDocker(projectPath, projectDetails);
        break;
      default:
        logger.debug(`Feature ${feature} not implemented yet`);
    }
  }

  async addESLint(projectPath, projectDetails) {
    const eslintConfig = {
      env: {
        browser: true,
        es2021: true,
        node: true
      },
      extends: [
        'eslint:recommended'
      ],
      parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
      },
      rules: {}
    };

    if (projectDetails.framework === 'react') {
      eslintConfig.extends.push('@eslint/js/recommended', 'plugin:react/recommended');
      eslintConfig.plugins = ['react'];
      eslintConfig.settings = {
        react: {
          version: 'detect'
        }
      };
    }

    await fs.writeJson(path.join(projectPath, '.eslintrc.json'), eslintConfig, { spaces: 2 });
  }

  async addPrettier(projectPath) {
    const prettierConfig = {
      semi: true,
      trailingComma: 'es5',
      singleQuote: true,
      printWidth: 80,
      tabWidth: 2
    };

    await fs.writeJson(path.join(projectPath, '.prettierrc'), prettierConfig, { spaces: 2 });
  }

  async addJest(projectPath, projectDetails) {
    const jestConfig = {
      testEnvironment: 'node'
    };

    if (projectDetails.framework === 'react') {
      jestConfig.testEnvironment = 'jsdom';
      jestConfig.setupFilesAfterEnv = ['<rootDir>/src/setupTests.js'];
    }

    await fs.writeJson(path.join(projectPath, 'jest.config.json'), jestConfig, { spaces: 2 });
  }

  async addTailwind(projectPath, projectDetails) {
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;

    await fs.writeFile(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);

    // Add Tailwind directives to CSS
    const cssPath = path.join(projectPath, 'src/index.css');
    if (await fs.pathExists(cssPath)) {
      const existingCSS = await fs.readFile(cssPath, 'utf-8');
      const tailwindDirectives = `@tailwind base;
@tailwind components;
@tailwind utilities;

`;
      await fs.writeFile(cssPath, tailwindDirectives + existingCSS);
    }
  }

  async addDocker(projectPath, projectDetails) {
    const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]`;

    const dockerIgnore = `node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.nyc_output
.vscode`;

    await fs.writeFile(path.join(projectPath, 'Dockerfile'), dockerfile);
    await fs.writeFile(path.join(projectPath, '.dockerignore'), dockerIgnore);
  }
}