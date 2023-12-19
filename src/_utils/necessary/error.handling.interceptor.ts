import { CallHandler, ExecutionContext, HttpException, Module, NestInterceptor } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { catchError, Observable, throwError } from 'rxjs';

export class ErrorHandlingInterceptor implements NestInterceptor {
  constructor(private message?: string) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest() as FastifyRequest;

    return next.handle().pipe(
      catchError((err) => {
        // For validation pipe error
        if (
          err instanceof HttpException &&
          Object.keys(err).includes("response") &&
          err["response"]["validationError"]
        ) {
          return throwError(() => err);
        }

        return throwError(
          () =>
            new HttpException(
              {
                error: true,
                message:
                  this.message ??
                  `Something went wrong in ${context
                    .getClass()
                    .name.replace("Controller", "")}!`,
                timestamp: new Date().toUTCString(),
                route: request.routerPath,
                method: request.method,
                devMessage:
                  `ClassName: ${context.getClass().name} , Handler: ${
                    context.getHandler().name
                  } ... ` +
                  (err?.message || err?.detail || "Something went wrong"),
                params: request.params,
                query: request.query,
                log: request.log,
                body: request.body,
              },
              err.statusCode || 500
            )
        );
      })
    );
  }
}

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorHandlingInterceptor,
    },
  ],
})
export class ErrorHandlingModule {}
