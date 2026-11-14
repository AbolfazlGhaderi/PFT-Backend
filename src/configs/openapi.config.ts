import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SecuritySchemeObject, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { EnvLoaderService } from '@plugins';
import { HEADER_KEYS } from '@constants';
import { EnvKeys } from '@/common/enums/env-keys.enum.js';

export function openApiConfig(app: INestApplication): void {
  // configs
  const document = new DocumentBuilder()
    .setTitle(EnvLoaderService.getOrFail(EnvKeys.SWAGGER_TITLE))
    .setDescription(EnvLoaderService.getOrFail(EnvKeys.SWAGGER_DESCRIPTION))
    .setVersion(EnvLoaderService.getOrFail(EnvKeys.SWAGGER_VERSION))
    .addBearerAuth(swaggerAuthConfig(), 'Authorization')
    .addBasicAuth({
      type: 'http',
    })
    .addApiKey({ type: 'apiKey', in: 'header', name: HEADER_KEYS.OTP_TOKEN.key }, HEADER_KEYS.OTP_TOKEN.name)
    .build();

  const SwaggerDocument = SwaggerModule.createDocument(app, document, {
    deepScanRoutes: true,
  });

  const NODE_ENV = EnvLoaderService.get<string>(EnvKeys.NODE_ENV, 'development');
  if (NODE_ENV === 'production') return;

  SwaggerModule.setup(EnvLoaderService.get(EnvKeys.SWAGGER_PATH, 'docs/swagger'), app, SwaggerDocument);

  app.use(
    EnvLoaderService.get(EnvKeys.SCALAR_PATH, '/docs/scalar'),
    apiReference({
      theme: 'deepSpace',
      spec: {
        content: SwaggerDocument,
      },
    }),
  );
}

function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat: 'JWT',
    in: 'header',
    scheme: 'bearer',
  };
}
