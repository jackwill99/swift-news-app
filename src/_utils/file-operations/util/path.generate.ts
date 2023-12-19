import crypto from "crypto";
import fs from "fs";
import { extname } from "path";

/**
 *
 * @param root This root will be the sub-root of public folder
 * @param mediaType This should be plural noun eg.(images, videos, audios ...)
 * @param id This is optional for sub-root with specific id of `root` folder
 * @param isMulter
 * @returns
 */
export default function folderPathGenerate(
  root: string,
  mediaType: string,
  id?: string,
  isMulter = true
) {
  //! folderPath with given folder name and base path
  const folderPath = `/${root}/${new Date().getFullYear().toString()}/${
    id != null ? id + "/" : ""
  }${mediaType}`;

  if (!isMulter) {
    //! check folder and file exists
    if (!fs.existsSync(process.cwd() + folderPath)) {
      fs.mkdirSync(process.cwd() + folderPath, {
        recursive: true,
      });
    }
  }

  return folderPath;
}

export function fileNameGenerate(ext: string) {
  //! fileName
  return crypto.randomUUID().substring(1, 8) + "-" + Date.now() + "." + ext;
}

export function fileNameMulter(_req, file: Express.Multer.File, callback: (error: Error, filename: string) => void) {
  const fileExtName = extname(file.originalname).split(".")[1];
  callback(null, fileNameGenerate(fileExtName));
}
