import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { adminImports } from './admin/admin.module';
import DBConnection from './constants/db';

/**
 * Swagger General Config
 */
function swaggerConfig() {
  return new DocumentBuilder()
    .setDescription('News api for training swift project')
    .addServer(DBConnection.host_1, 'Local Development Server')
    .addBearerAuth(
      {
        type: 'http',
        in: 'header',
        description:
          '##### Auth token in header of this form `Authorization: Bearer xxxx.yyyy.zzzz ,`',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    );
}

export default async function applicationSwaggerConfig(
  app: NestFastifyApplication,
) {
  /**
   * Swagger for Admin
   */
  const adminConfig = swaggerConfig()
    .setTitle('Mobile APIs')
    .setVersion('1.0')
    .setExternalDoc('Export to Postman Collection', `${DBConnection.host_1}/api/mobile-json`)
    .build();
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: adminImports,
  });
  SwaggerModule.setup('api/mobile', app, adminDocument, {
    swaggerOptions: { defaultModelsExpandDepth: -1, docExpansion: 'none' },
  });
}
