import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { generateToken } from "../../_utils/necessary/access.token";
import { Hashing } from "../../_utils/necessary/hashing";
import DBConnection from "../../constants/db";
import { User } from "../../entities/user.entity";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, DBConnection.coreDb) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userModel.create(createUserDto);
    user.token = generateToken({ role: createUserDto.role, id: user.id });
    user.password = await Hashing.hash(createUserDto.password);
    await user.save();

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find<User>({ status: 1, delete: 0 });
    return users;
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.userModel.findById<User>(id, null, {
      status: 1,
      delete: 0,
    });

    return user;
  }

  async remove(id: string): Promise<User | null> {
    const user = await this.userModel.findByIdAndUpdate<User>(id, {
      status: 0,
    });
    return user;
  }
}
