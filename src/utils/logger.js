import chalk from 'chalk';
import * as emoji from 'node-emoji';

export class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  setLevel(level) {
    this.level = level;
  }

  shouldLog(level) {
    return this.levels[level] <= this.levels[this.level];
  }

  error(message, ...args) {
    if (this.shouldLog('error')) {
      console.error(chalk.red(`${emoji.get('x')} ${message}`), ...args);
    }
  }

  warn(message, ...args) {
    if (this.shouldLog('warn')) {
      console.warn(chalk.yellow(`${emoji.get('warning')} ${message}`), ...args);
    }
  }

  warning(message, ...args) {
    this.warn(message, ...args);
  }

  info(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(chalk.blue(`${emoji.get('information_source')} ${message}`), ...args);
    }
  }

  success(message, ...args) {
    if (this.shouldLog('info')) {
      console.info(chalk.green(`${emoji.get('white_check_mark')} ${message}`), ...args);
    }
  }

  debug(message, ...args) {
    if (this.shouldLog('debug')) {
      console.debug(chalk.gray(`${emoji.get('bug')} ${message}`), ...args);
    }
  }

  log(message, ...args) {
    console.log(message, ...args);
  }
}