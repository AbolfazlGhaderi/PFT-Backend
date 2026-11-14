import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

import { ENVType } from '@types';
import { validateEnvs } from './validate.js';
import { LoggerService } from 'logger-nestjs';
import { DEFAULT_LOGGER_CONFIG } from '@configs';
import { EnvKeys } from '@enums';

export class EnvLoaderService {
  private static variables: Record<string, unknown> = {};
  private static logger = new LoggerService(DEFAULT_LOGGER_CONFIG).setContext(EnvLoaderService.name);

  static load() {
    // 1. Load *.config.json files
    const jsonDirPath = path.resolve(process.cwd(), process.env.CONFIG_DIR || 'devops');

    if (fs.existsSync(jsonDirPath)) {
      try {
        const files = fs.readdirSync(jsonDirPath);

        files.forEach(file => {
          if (!file.endsWith('app-config.json')) {
            this.logger.warn(`Skipping file: ${file}`);
            return;
          }

          const content: unknown = JSON.parse(fs.readFileSync(path.resolve(jsonDirPath, file), 'utf-8'));

          if (typeof content !== 'object' || content === null) {
            throw new TypeError(`Invalid config file: ${file}`);
          }

          this.variables = {
            ...this.variables,
            ...content,
          };
        });
      } catch (error) {
        this.logger.error(error);
        throw error;
      }
    } else {
      const errorMessage = `\u001B[31mConfig directory not found: ${jsonDirPath}\u001B[0m\n`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    // 2. Load .env
    const envPath = path.resolve(process.cwd(), '.env');

    if (fs.existsSync(envPath)) {
      const parsed = dotenv.parse(fs.readFileSync(envPath));

      this.variables = {
        ...this.variables,
        ...parsed,
      };
    }

    // 3. Merge process.env (highest priority)
    this.variables = {
      ...this.variables,
      ...process.env,
    };

    // 4. Sync everything back into process.env
    Object.entries(this.variables).forEach(([key, value]) => {
      process.env[key] = String(value);
    });

    // 5. Validate required keys
    this.validate();

    // 6. Custom validation (Joi / Zod / Custom)
    validateEnvs(this.variables);

    return this.variables;
  }

  static validate() {
    const missingEnvVariables = Object.keys(EnvKeys).filter(variable => !process.env[variable] || process.env[variable] === '');

    if (missingEnvVariables.length > 0) {
      const errorMessage = `\u001B[31mMissing environment variable(s): < ${missingEnvVariables.join(' >, < ')} >\u001B[0m\n`;
      this.logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }

  static get<T = string>(key: keyof ENVType, defaultValue?: T): T {
    return (this.variables[key] ?? defaultValue ?? '') as T;
  }

  static getAll(): Record<string, unknown> {
    return this.variables;
  }

  static getOrFail<T = string>(key: keyof ENVType): T {
    if (Reflect.has(this.variables, key)) {
      return this.variables[key] as T;
    }

    throw new Error(`\u001B[31mMissing environment variable(s): < ${String(key)} >\u001B[0m\n`);
  }
}
