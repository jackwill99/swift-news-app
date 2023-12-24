import {
  CACHE_KEY_METADATA,
  CACHE_MANAGER,
  CACHE_TTL_METADATA,
} from "@nestjs/cache-manager";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  Optional,
  StreamableFile,
} from "@nestjs/common";
import { loadPackage } from "@nestjs/common/utils/load-package.util";
import { isFunction, isNil } from "@nestjs/common/utils/shared.utils";
import { HttpAdapterHost, Reflector } from "@nestjs/core";
import { Cache } from "cache-manager";
import { FastifyRequest } from "fastify";
import { Observable, of } from "rxjs";
import { tap } from "rxjs/operators";
import CacheRedis from "./cache-redis.metadata";
import CacheReset from "./cache-reset.decorator";

/**
 *
 * ### Check the official code to notice and modify CacheInterceptor because this depends on official code and combine with my ideas.
 * [Check it out!](https://github.com/nestjs/cache-manager/blob/master/lib/interceptors/cache.interceptor.ts) `Commit Id => b641e229820c791fb8d906fdee6dccc56f7004b7
 */
@Injectable()
export class CacheRedisInterceptor implements NestInterceptor {
  @Optional()
  @Inject()
  protected readonly httpAdapterHost: HttpAdapterHost;

  protected allowedMethods = ["GET"];

  private cacheManagerIsv5OrGreater: boolean;

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    protected readonly reflector: Reflector,
  ) {
    // We need to check if the cache-manager package is v5 or greater
    // because the set method signature changed in v5
    const cacheManagerPackage = loadPackage(
      "cache-manager",
      "CacheModule",
      () => require("cache-manager"),
    );
    this.cacheManagerIsv5OrGreater = "memoryStore" in cacheManagerPackage;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    //jack
    const cacheRedis =
      this.reflector.get(CacheRedis.metaName, context.getHandler()) ??
      this.reflector.get(CacheRedis.metaName, context.getClass()) ??
      null;
    if (cacheRedis === null || !(cacheRedis as boolean)) {
      console.log("No cache");
      this.cacheOperation(context, this.reflector).then((r) => {
        console.log("End cache operation");
      });
      return next.handle();
    }
    //jack

    const key = this.trackBy(context, this.reflector);
    const ttlValueOrFactory =
      this.reflector.get(CACHE_TTL_METADATA, context.getHandler()) ??
      this.reflector.get(CACHE_TTL_METADATA, context.getClass()) ??
      null;

    if (!key) {
      return next.handle();
    }
    try {
      const value = await this.cacheManager.get(key);
      if (!isNil(value)) {
        // jack
        Logger.warn("Return from cached data ( " + key + " )");
        // jack
        return of(value);
      }
      const ttl = isFunction(ttlValueOrFactory)
        ? await ttlValueOrFactory(context)
        : ttlValueOrFactory;

      return next.handle().pipe(
        tap(async (response) => {
          if (response instanceof StreamableFile) {
            return;
          }

          // jack
          const args: [string, unknown] = [key, response];
          // jack

          if (!isNil(ttl)) {
            args.push(this.cacheManagerIsv5OrGreater ? ttl : { ttl });
          }

          try {
            await this.cacheManager.set(...args);
          } catch (err) {
            Logger.error(
              `An error has occurred when inserting "key: ${key}", "value: ${response}"`,
              "CacheInterceptor",
            );
          }
        }),
      );
    } catch {
      return next.handle();
    }
  }

  protected trackBy(
    context: ExecutionContext,
    reflector: Reflector,
  ): string | undefined {
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const isHttpApp = httpAdapter && !!httpAdapter.getRequestMethod;
    const cacheMetadata = this.reflector.get(
      CACHE_KEY_METADATA,
      context.getHandler(),
    );

    if (!isHttpApp || cacheMetadata) {
      return cacheMetadata;
    }

    const request = context.getArgByIndex(0);

    if (!this.isRequestCacheable(context)) {
      return undefined;
    }

    return httpAdapter.getRequestUrl(request);
  }

  protected isRequestCacheable(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as FastifyRequest;
    return this.allowedMethods.includes(req.method);
  }

  // jack
  /**
   *
   *  Not cached data may be that don't need to cache(some data desn't need like random query)
   *  or request is un-cacheable(update/patch/delete query).
   *  Find the api resource according to regex pattern.
   */
  protected async cacheOperation(
    context: ExecutionContext,
    reflector: Reflector,
  ) {
    /**
     * ! QueryAll with random is Get method and never cached before
     * * So, we don't need to find out and delete with this resource 🚀
     */
    if (this.isRequestCacheable(context)) {
      return;
    }

    const httpAdapter = this.httpAdapterHost.httpAdapter;
    const request = context.getArgByIndex(0);
    const url = httpAdapter.getRequestUrl(request);

    const urlRegex =
      /(\/api\/[\w\d]*\/)([\w]*\/[\w]*)(\/[\w\d]*)?([?=\.&\/\[\]\"\'\w\d]*)?/;
    const urlMatch = url.match(urlRegex);
    await this.resetCacheData(
      urlMatch[2].split("/")[1],
      context,
      reflector,
      this.cacheManager,
    );
  }

  /**
   *
   * Find out to reset the cached resources and delete cached all ✨
   */
  protected async resetCacheData(
    resourseUrl: string,
    context: ExecutionContext,
    reflector: Reflector,
    cacheManager: Cache,
  ) {
    const resetCaches =
      reflector.get<string[]>(CacheReset.metaName, context.getHandler()) ??
      reflector.get<string[]>(CacheReset.metaName, context.getClass()) ??
      null;
    const keys = await cacheManager.store.keys();

    if (resetCaches == null) {
      //? key may be eg (users, posts)
      this.deleteCache(cacheManager, keys, resourseUrl);
    } else {
      resetCaches.push(resourseUrl);
      resetCaches.map((v) => {
        //? key may be eg (users, posts)
        this.deleteCache(cacheManager, keys, v);
      });
    }
  }

  /**
   * Cache clean up 🧹
   */
  protected deleteCache(cacheManager: Cache, keys: string[], key: string) {
    /**
     * * examples ---
     * /api/v1/sys/users
     * /api/v1/web/users
     * /api/v2/sys/users
     * /api/v2/web/users
     */
    const apiReg = new RegExp(`/api/[\\w\\d]*/[\\w]*/${key}`, "g");

    keys.map(async (v) => {
      if (v.search(apiReg) !== -1) {
        Logger.error("Cached Reset " + v);
        await cacheManager.del(v);
      }
    });
  }

  // jack
}
