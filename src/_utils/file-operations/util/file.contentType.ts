import { extname } from "path";

export default function getContentType(type: string) {
  let ext = extname(type).split(".")[1];

  // Normally, if url is requested to image or gif, there is an extension of the file type
  if (ext.length == 0) {
    return "application/json";
  }

  const contentReverse = {
    txt: "plain",
    jpg: "jpeg",
  };

  if (Object.keys(contentReverse).includes(ext)) {
    ext = contentReverse[ext];
  }

  const content = [
    "text/css",
    "text/csv",
    "text/html",
    "text/plain",
    "text/xml",
    // audio
    "audio/mpeg",
    "audio/x-ms-wma",
    "audio/x-wav",
    // images
    "image/gif",
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-icon",
    "image/svg+xml",
  ];

  const result = content.filter((v, i) => {
    if (v.includes(ext)) {
      return v;
    }
  });

  if (result.length > 0) {
    return result[0];
  } else {
    return "application/json";
  }
}
