import { join } from 'node:path';

import { defineConfig } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvLoaderService } from '@plugins';
import { EnvKeys } from '@enums';

EnvLoaderService.load();
const baseDir = process.cwd();
const DATABASE_DIR = 'app/database';
const DATABASE_ENTITIES_PATH_JS = `dist/${DATABASE_DIR}/entities/**.entity.js`;
const DATABASE_ENTITIES_PATH_TS = `src/${DATABASE_DIR}/entities/**.entity.ts`;

const DATABASE_MIGRATIONS_PATH_JS = `dist/${DATABASE_DIR}/migrations`;
const DATABASE_MIGRATIONS_PATH_TS = `src/${DATABASE_DIR}/migrations`;

export default defineConfig({
  debug: EnvLoaderService.getOrFail<boolean>(EnvKeys.DB_LOGGING),
  driver: PostgreSqlDriver,
  dbName: EnvLoaderService.getOrFail(EnvKeys.DB_NAME),
  host: EnvLoaderService.getOrFail(EnvKeys.DB_HOST),
  port: Number(EnvLoaderService.getOrFail(EnvKeys.DB_PORT)),
  password: EnvLoaderService.getOrFail(EnvKeys.DB_PASSWORD),
  user: EnvLoaderService.getOrFail(EnvKeys.DB_USERNAME),
  entities: [join(baseDir, DATABASE_ENTITIES_PATH_JS)],
  forceUtcTimezone: true,
  extensions: [Migrator],
  migrations: {
    path: join(baseDir, DATABASE_MIGRATIONS_PATH_JS),
    pathTs: join(baseDir, DATABASE_MIGRATIONS_PATH_TS),
  },
});
