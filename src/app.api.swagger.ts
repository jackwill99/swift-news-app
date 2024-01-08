import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import DBConnection from "./constants/db";
import { mobileImports } from "./mobile/mobile.module";

/**
 * Swagger General Config
 */
function swaggerConfig() {
  return (
    new DocumentBuilder()
      .setDescription("News api for training swift project")
      .addServer(DBConnection.host_1, "Local Development Server")
      .addServer(DBConnection.server_1, "Production Server")
      // .addBearerAuth(
      //   {
      //     type: 'http',
      //     in: 'header',
      //     description:
      //       '##### Auth token in header of this form `Authorization: Bearer xxxx.yyyy.zzzz ,`',
      //     scheme: 'bearer',
      //     bearerFormat: 'JWT',
      //   },
      //   'Authorization',
      // )
      .addBearerAuth(undefined, "Authorization")
  );
}

/*
  When you need default bearer authentication, replace your authentication with default
 */
function defaultBearerAuth() {
  return {
    authAction: {
      Authorization: {
        name: "Authorization",
        schema: {
          description: "Default bearer authentication",
          type: "http",
          in: "header",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        value:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJpZCI6IjY1ODJiZWQ0ZWQxZjYwNGRiMmYxYTM3OSIsImlhdCI6MTcwMzA2NzM0OCwiZXhwIjoxNzA1NjU5MzQ4fQ.I-ys1sFGEg060Uhgasj-r4vVN5Fk9o3lbgM41WkMTRo",
      },
    },
  };
}

export default async function applicationSwaggerConfig(
  app: NestFastifyApplication,
) {
  /**
   * Swagger for Admin
   */
  const adminConfig = swaggerConfig()
    .setTitle("Mobile APIs")
    .setVersion("1.0")
    .setExternalDoc(
      "Export to Postman Collection",
      `${DBConnection.host_1}/api/mobile-json`,
    )
    .build();
  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: mobileImports,
  });
  SwaggerModule.setup("api/mobile", app, adminDocument, {
    swaggerOptions: {
      defaultModelsExpandDepth: -1,
      docExpansion: "none",
      ...defaultBearerAuth(),
    },
  });
}
