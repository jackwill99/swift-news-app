import { Controller, Get, Req, Res, StreamableFile } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { FastifyReply, FastifyRequest } from "fastify";
import { createReadStream } from "fs";
import { join } from "path";
import { Public } from "../necessary/public.decorator";
import getContentType from "./util/file.contentType";

@Controller("storage")
@Public(true)
@ApiExcludeController(true)
export class FileStreamingController {
  public static path = "/api/v1/storage";
  @Get("*")
  getFile(
    @Req() req: FastifyRequest,
    @Res({ passthrough: true }) res: FastifyReply
  ) {
    const file = createReadStream(
      join(process.cwd(), `/public/${req.params["*"]}`)
    );
    file.on("error", (err) => {
      console.log("Sorry, Failed to response file content!");
      res.send();
    });

    res.headers({
      "Content-Type": getContentType(req.params["*"]),
      // "Content-Disposition": 'attachment; filename="image.svg"',
    });

    return new StreamableFile(file);
  }
}
