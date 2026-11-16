import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, Provider } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { AuditSubscriber } from './audit.subscriber.js';
import { EntityName, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvLoaderService } from '@plugins';
import { EnvKeys } from '@enums';

const entities = (await loadEntities()) as EntityName<Partial<unknown>>[];
const repositories = await loadRepositories();

@Global()
@Module({
  imports: [
    // driver-specific DI tokens (PostgreSqlMikroORM) only register when the driver is known at module registration time
    MikroOrmModule.forRootAsync({
      driver: PostgreSqlDriver,
      inject: [ClsService],
      useFactory: async (cls: ClsService) => ({
        debug: EnvLoaderService.getOrFail<boolean>(EnvKeys.DB_LOGGING),
        driver: PostgreSqlDriver,
        dbName: EnvLoaderService.getOrFail(EnvKeys.DB_NAME),
        host: EnvLoaderService.getOrFail(EnvKeys.DB_HOST),
        port: Number(EnvLoaderService.getOrFail(EnvKeys.DB_PORT)),
        password: EnvLoaderService.getOrFail(EnvKeys.DB_PASSWORD),
        user: EnvLoaderService.getOrFail(EnvKeys.DB_USERNAME),
        forceUtcTimezone: true,
        entities: ['./dist/app/database/entities/**.entity.js'],
        entitiesTs: ['./src/app/database/entities/**.entity.ts'],
        pool: {
          min: 2,
          max: 10,
          idleTimeoutMillis: 10_000,
          acquireTimeoutMillis: 5_000,
        },
        subscribers: [new AuditSubscriber(cls)],
      }),
    }),
    MikroOrmModule.forFeature([...entities]),
  ],
  providers: [...repositories],
  exports: [MikroOrmModule],
})
export class DatabaseModule {}

async function loadEntities(): Promise<Provider[]> {
  const entityPath = join(import.meta.dirname, 'entities');
  const providers: Provider[] = [];

  if (!existsSync(entityPath)) return providers;

  const files = readdirSync(entityPath);

  for (const file of files) {
    if (!file.endsWith('.entity.js') || file.startsWith('base.')) continue;

    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const imported = await import(pathToFileURL(join(entityPath, file)).href);

    Object.values(imported).forEach(exported => {
      if (typeof exported === 'function') {
        providers.push(exported as Provider);
      }
    });
  }
  return providers;
}

async function loadRepositories(): Promise<Provider[]> {
  const repositoryPath = join(import.meta.dirname, 'repositories');
  const providers: Provider[] = [];

  if (!existsSync(repositoryPath)) return providers;

  const files = readdirSync(repositoryPath);

  for (const file of files) {
    if (!file.endsWith('.repository.js') || file.startsWith('base.')) continue;

    // oxlint-disable-next-line typescript/no-unsafe-assignment
    const imported = await import(pathToFileURL(join(repositoryPath, file)).href);

    Object.values(imported).forEach(exported => {
      if (typeof exported === 'function') {
        providers.push(exported as Provider);
      }
    });
  }
  return providers;
}
