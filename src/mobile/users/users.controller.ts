import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { errorResponse, successResponse } from "src/_utils/necessary/response";
import { AccessControl } from "../../_utils/acl/acl.decorator";
import { AccessLevel } from "../../_utils/acl/acl.enum";
import { MongoIdDto } from "../../_utils/dtos/mongo.id.dto";
import { Public } from "../../_utils/necessary/public.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@AccessControl.metaData(AccessLevel.ADMIN)
@ApiBearerAuth("Authorization")
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "Create Mobile User" })
  @Post()
  @Public(true)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);

    return successResponse("Create User successfully", user);
  }

  @ApiOperation({ summary: "Get all of the mobile users" })
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();

    return successResponse("All of user list", users);
  }

  @ApiOperation({ summary: "Take a user information" })
  @Get(":id")
  async findOne(@Param() params: MongoIdDto) {
    const user = await this.usersService.findOne(params.id);

    if (user) {
      return successResponse("User detail", user);
    }

    return errorResponse("User not found");
  }

  @ApiOperation({ summary: "Delete user" })
  @Delete(":id")
  async remove(@Param() params: MongoIdDto) {
    const user = await this.usersService.remove(params.id);

    if (user) {
      return successResponse("Successfully removed user");
    }

    return errorResponse("Failed to delete user");
  }
}
