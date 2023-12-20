import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import DBConnection from '../../constants/db';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { successResponse } from '../../_utils/necessary/response';
import { generateToken } from '../../_utils/necessary/access.token';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name, DBConnection.coreDb) private userModel: Model<User>,
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);
    user.token = generateToken({ 'role': createUserDto.role,"id":user.id });
    await user.save();

    return successResponse('Create User successfully', user);
  }

  async findAll() {
    return this.userModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
