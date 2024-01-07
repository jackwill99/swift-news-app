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

class FileFieldsInterceptorType {
  /**
   * @param params  The particular maxCount is the limit of file uploading for it's particular `name: string`. The particular `name: string` must be the same property of your body dto to store the value of input files. And, req.files is also your files. You can store the files info into your variable by using UploadFiles decorator in nestjs
   */
  params: { name: string; maxCount: number }[];
  /**
   * @param rootFolder Sub-folder name of public folder. You won't need to declare your `parent public folder name`
   */
  rootFolder: string;
  /**
   * @param mediaType  Sub-folder name of `rootFolder` or particular `id` folder by categorize of media type. You can separate mediaType according to particular `name: string`(fieldname)
   */
  mediaType: (req: Request, file: Express.Multer.File) => string;
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
 * #### All of the folder name should not include `/` prefix
 * @param params  The particular maxCount is the limit of file uploading for it's particular `name: string`. The particular `name: string` must be the same property of your body dto to store the value of input files. And, req.files is also your files. You can store the files info into your variable by using UploadFiles decorator in nestjs
 * @param rootFolder Sub-folder name of public folder. You won't need to declare your `parent public folder name`
 * @param mediaType  Sub-folder name of `rootFolder` or particular `id` folder by categorize of media type. You can separate mediaType according to particular `name: string`(fieldname)
 * @param id         (Optional) Sub-folder name of `rootFolder` folder by a particular id
 * @param fileFilter To check and filter of input file
 * @returns
 */
export function FileFieldsInterceptor(
  field: FileFieldsInterceptorType,
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
              field.mediaType(req, file),
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
        this.multer.fields(field.params)(
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
