import { FastifyRequest } from "fastify";
import { FileStreamingController } from "../file.streaming.controller";

export const fileMapper = (req: FastifyRequest, file: Express.Multer.File) => {
  return `${req.protocol}://${req.headers.host}${FileStreamingController.path}${
    file.path.split("public")[1]
  }`;
};

export const filesMapper = (
  req: FastifyRequest,
  files: { [key: string]: Express.Multer.File[] },
) => {
  const result = {};
  Object.keys(files).forEach((fileKey) => {
    result[fileKey] = files[fileKey].map((file) => {
      return `${req.protocol}://${req.headers.host}${
        FileStreamingController.path
      }${file.path.split("public")[1]}`;
    });
  });
  return result;
};
