import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import DBConnection from "../../constants/db";
import { User, UserSchema } from "../../entities/user.entity";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: User.name, schema: UserSchema }],
      DBConnection.coreDb,
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
