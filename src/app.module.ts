import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ThrottlerModule } from "@nestjs/throttler";
import { CacheRedisModule } from "./_utils/cache-redis/cache-redis.module";
import { FileOperationModule } from "./_utils/file-operations/file.operations.module";
import { GuardCustomModule } from "./_utils/guard-custom/guard-custom.module";
import { ErrorHandlingModule } from "./_utils/necessary/error.handling.interceptor";
import DBConnection from "./constants/db";
import { MobileModule } from "./mobile/mobile.module";

@Module({
  imports: [
    MobileModule,
    ConfigModule.forRoot(),
    GuardCustomModule,
    ThrottlerModule.forRoot([
      // No more than 3 calls in a second
      {
        name: "short",
        ttl: 1000,
        limit: 3,
      },
      // No more than 20 calls in 10 second
      {
        name: "medium",
        ttl: 10000,
        limit: 20,
      },
      // No more than 100 calls in a minute
      {
        name: "long",
        ttl: 60000,
        limit: 100,
      },
    ]),
    MongooseModule.forRoot(process.env["CORE_DATABASE_URL"]!, {
      connectionName: DBConnection.coreDb,
    }),
    ErrorHandlingModule,
    CacheRedisModule,
    FileOperationModule,
  ],
})
export class AppModule {}
