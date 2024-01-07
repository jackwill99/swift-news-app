import compression from "@fastify/compress";
import helmet from "@fastify/helmet";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { contentParser } from "fastify-multer";
import { join } from "path";
import { validationPipe } from "./_utils/necessary/validation.pipe";
import { AppModule } from "./app.module";
import Misc from "./constants/misc";

export default async function applicationConfig() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 30 * 1024 * 1024 }),
  );

  /**
   * Add global hook
   */
  app
    .getHttpAdapter()
    .getInstance()
    .addHook("onRequest", async (req, res) => {
      // req.socket["encrypted"] = process.env.NODE_ENV === "production";
      res.header("X-Powered-By", "JackWill(https://jackwill.tech)");
    });

  /**
   * Global Prefix
   */
  app.setGlobalPrefix("api");

  /**
   * CORS origin
   */
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  /**
   * When using `apollo-server-fastify` and `@fastify/helmet`, there may be a problem with CSP on the GraphQL playground.
   * To config the CSP, read docs [https://docs.nestjs.com/security/helmet#use-with-fastify]
   */
  if (process.env["NODE_ENV"] !== "development") {
    await app.register(helmet);
  }

  /**
   * For uploading files using Multer
   */
  await app.register(contentParser);
  app.useStaticAssets({
    root: join(__dirname, "..", "public"),
  });

  /**
   * API Versioning
   */
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: Misc.majorVersion,
    prefix: "v",
  });

  /**
   * HTTP request validation pipe with DTO by using class-validator package
   */
  app.useGlobalPipes(validationPipe);

  /**
   * Compression can greatly decrease the size of the response body, thereby increasing the speed of a web app.
   */
  await app.register(compression, { encodings: ["gzip", "deflate"] });

  return app;
}
