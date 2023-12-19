import { FileFilterCallback } from 'fastify-multer/lib/interfaces';
import { Request } from 'express';

export const imageFileFilter = (_req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
