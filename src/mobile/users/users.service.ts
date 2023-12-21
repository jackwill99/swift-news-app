import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generateToken } from "../../_utils/necessary/access.token";
import {
  errorResponse,
  successResponse,
} from "../../_utils/necessary/response";
import DBConnection from "../../constants/db";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, DBConnection.coreDb) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    user.token = generateToken({ role: createUserDto.role, id: user.id });
    await user.save();

    return successResponse("Create User successfully", user);
  }

  async findAll() {
    const users = await this.userModel.find({ status: 1, delete: 0 });
    return successResponse("All of user list", users);
  }

  async findOne(id: string) {
    const user = await this.userModel.findById<User>(id, null, {
      status: 1,
      delete: 0,
    });
    try {
      if (user!) {
        return successResponse("User Details", user);
      }
    } catch (e) {
      return errorResponse(e);
    }
  }

  async remove(id: string) {
    await this.userModel.findByIdAndUpdate(id, { status: 0 });
    return successResponse("Successfully removed user");
  }
}
