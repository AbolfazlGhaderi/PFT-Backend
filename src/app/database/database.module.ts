import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Global, Module, Provider } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { AuditSubscriber } from './audit.subscriber.js';
import { EntityName, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { EnvLoaderService } from '@plugins';
import { EnvKeys } from '@enums';

const entities = loadEntities() as EntityName<Partial<unknown>>[];
const repositories = loadRepositories();

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      inject: [ClsService],
      useFactory: async (cls: ClsService) => ({
        debug: false,
        driver: PostgreSqlDriver,
        dbName: EnvLoaderService.getOrFail(EnvKeys.DB_NAME),
        host: EnvLoaderService.getOrFail(EnvKeys.DB_HOST),
        port: Number(EnvLoaderService.getOrFail(EnvKeys.DB_PORT)),
        password: EnvLoaderService.getOrFail(EnvKeys.DB_PASSWORD),
        user: EnvLoaderService.getOrFail(EnvKeys.DB_USERNAME),
        entities: ['./dist/app/database/entities/**.entity.js'],
        entitiesTs: ['./src/app/database/entities/**.entity.ts'],
        forceUtcTimezone: true,
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

function loadEntities(): Provider[] {
  const entityPath = join(import.meta.dirname, 'entities');
  const providers: Provider[] = [];

  if (!existsSync(entityPath)) return providers;

  const files = readdirSync(entityPath);

  files.forEach(async file => {
    if (!file.endsWith('.entity.js') || file.startsWith('base.')) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
     const imported = await import(join(entityPath, file))

    Object.values(imported).forEach(exported => {
      if (typeof exported === 'function') {
        providers.push(exported as Provider);
      }
    });
  });
  return providers;
}

function loadRepositories(): Provider[] {
  const repositoryPath = join(import.meta.dirname, 'repositories');
  const providers: Provider[] = [];

  if (!existsSync(repositoryPath)) return providers;

  const files = readdirSync(repositoryPath);

  files.forEach(async file => {
    if (!file.endsWith('.repository.js') || file.startsWith('base.')) return;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const imported = await import(join(repositoryPath, file));

    Object.values(imported).forEach(exported => {
      if (typeof exported === 'function') {
        providers.push(exported as Provider);
      }
    });
  });
  return providers;
}
