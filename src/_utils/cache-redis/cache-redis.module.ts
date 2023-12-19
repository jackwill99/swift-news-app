import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { redisStore } from "cache-manager-redis-yet";
import { CacheRedisInterceptor } from "./cache-redis.interceptor";

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          ttl: 43200000, // equally 12 hr
          socket: {
            host: "localhost",
            port: 6379,
          },
        }),
      }),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheRedisInterceptor,
    },
  ],
})
export class CacheRedisModule {}
