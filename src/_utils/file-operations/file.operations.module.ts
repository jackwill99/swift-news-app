import { Module } from "@nestjs/common";
import { FileStreamingController } from "./file.streaming.controller";

@Module({
  controllers: [FileStreamingController],
})
export class FileOperationModule {}
