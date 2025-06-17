import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ConfigManager {
  constructor() {
    this.configDir = path.join(process.env.HOME || process.env.USERPROFILE || __dirname, '.codegen-cli');
    this.configFile = path.join(this.configDir, 'config.json');
    this.defaultConfig = {
      defaultAuthor: '',
      defaultEmail: '',
      logLevel: 'info',
      autoInstallDependencies: true,
      showTips: true,
      templatesDirectory: path.join(this.configDir, 'templates'),
      autoUpdateTemplates: true,
      defaultFramework: 'react',
      defaultPackageManager: 'npm',
      useExactVersions: false,
      npmRegistry: 'https://registry.npmjs.org/',
      preferredEditor: 'vscode',
      openInEditor: true,
      terminalShell: 'bash',
      generateGitignore: true
    };
    this.config = { ...this.defaultConfig };
  }

  async init() {
    try {
      await fs.ensureDir(this.configDir);
      
      if (await fs.pathExists(this.configFile)) {
        const existingConfig = await fs.readJson(this.configFile);
        this.config = { ...this.defaultConfig, ...existingConfig };
      } else {
        await this.saveConfig();
      }

      // Ensure templates directory exists
      await fs.ensureDir(this.config.templatesDirectory);
      
    } catch (error) {
      console.error('Failed to initialize configuration:', error.message);
      this.config = { ...this.defaultConfig };
    }
  }

  async getConfig() {
    return { ...this.config };
  }

  async updateConfig(updates) {
    this.config = { ...this.config, ...updates };
    await this.saveConfig();
  }

  async resetToDefaults() {
    this.config = { ...this.defaultConfig };
    await this.saveConfig();
  }

  async saveConfig() {
    try {
      await fs.writeJson(this.configFile, this.config, { spaces: 2 });
    } catch (error) {
      console.error('Failed to save configuration:', error.message);
    }
  }

  getConfigDir() {
    return this.configDir;
  }
}