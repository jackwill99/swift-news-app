import { FastifyRequest } from "fastify";
import fs from "fs";
import { FileStreamingController } from "../file.streaming.controller";
import folderPathGenerate, { fileNameGenerate } from "./path.generate";

export default function fileUpload(
  req: FastifyRequest,
  data: string | Buffer,
  root: string,
  mediaType: string,
  id?: string,
) {
  const { NODE_ENV } = process.env;

  //! base path
  const basePath = NODE_ENV === "development" ? "public" : "public";

  //! image data
  let imageData: string;
  let writeFileOption: fs.WriteFileOptions;

  // default extension is png
  let ext: string = "png";

  if (typeof data === "string") {
    //! split base64
    const base64ToArray = data.split(";base64,");

    //! extension
    ext = base64ToArray[0].split("/")[1];

    imageData = base64ToArray[1];
    writeFileOption = "base64";
  } else {
    imageData = Buffer.from(data).toString("binary");
    writeFileOption = "binary";
  }

  const imagePath =
    folderPathGenerate(basePath + "/" + root, mediaType, id, false) +
    "/" +
    fileNameGenerate(ext);

  //! write file
  fs.writeFileSync(process.cwd() + imagePath, imageData, writeFileOption);

  return `${req.protocol}://${req.headers.host}${FileStreamingController.path}${
    imagePath.split("public")[1]
  }`;
}
