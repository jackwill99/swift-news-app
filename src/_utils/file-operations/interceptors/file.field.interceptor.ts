import {
  CallHandler,
  ExecutionContext,
  Inject,
  mixin,
  NestInterceptor,
  Optional,
  Type,
} from "@nestjs/common";
import { Request } from "express";
import FastifyMulter from "fastify-multer";
import { FileFilterCallback } from "fastify-multer/lib/interfaces";
import fs from "fs";
import { diskStorage, Multer } from "multer";
import { join } from "path";
import { Observable } from "rxjs";
import folderPathGenerate, { fileNameMulter } from "../util/path.generate";

class FileFieldInterceptorType {
  /**
   * @param fieldName  This must be the same property of your body dto to store the value of input file. And, req.file is also your file. You can store the file info into your variable by using UploadFile decorator in nestjs
   */
  fieldName: string;
  /**
   * @param rootFolder Sub-folder name of public folder. You won't need to declare your `parent public folder name`
   */
  rootFolder: string;
  /**
   * @param mediaType  Sub-folder name of `rootFolder` or particular `id` folder by categorize of media type
   */
  mediaType: string;
  /**
   * @param id         (Optional) Sub-folder name of `rootFolder` folder by a particular id
   */
  id?: (req: Request) => string | undefined = undefined;
  /**
   * @param fileFilter To check and filter of input file
   */
  fileFilter?: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback,
  ) => void;
}

/**
 *
 * #### All the folder name should not include `/` prefix
 * @param fieldName  This must be the same property of your body dto to store the value of input file. And, req.file is also your file. You can store the file info into your variable by using UploadFile decorator in nestjs
 * @param rootFolder Sub-folder name of public folder. You won't need to declare your `parent public folder name`
 * @param mediaType  Sub-folder name of `rootFolder` or particular `id` folder by categorize of media type
 * @param id         (Optional) Sub-folder name of `rootFolder` folder by a particular id
 * @param fileFilter To check and filter of input file
 * @returns
 */
export function FileFieldInterceptor(
  field: FileFieldInterceptorType,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: any;

    constructor(
      @Optional()
      @Inject("MULTER_MODULE_OPTIONS")
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({
        ...options,
        storage: diskStorage({
          destination: (req, file, callback) => {
            const folderGenerate = folderPathGenerate(
              field.rootFolder,
              field.mediaType,
              field.id == null ? undefined : field.id(req),
            );
            const result = join(process.cwd() + "/public/" + folderGenerate);
            if (!fs.existsSync(result)) {
              fs.mkdirSync(result, { recursive: true });
            }
            callback(null, result);
          },
          filename: fileNameMulter,
        }),
        fileFilter: field.fileFilter,
      });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(field.fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              // const error = transformException(err);
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}
