import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../_utils/necessary/public.decorator';
import { AccessControl } from '../../_utils/acl/acl.decorator';
import { AccessLevel } from '../../_utils/acl/acl.enum';
import { MongoIdDto } from '../../_utils/dtos/mongo.id.dto';

@ApiTags('Users')
@AccessControl.metaData(AccessLevel.ADMIN)
@ApiBearerAuth('Authorization')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @ApiOperation({ summary: 'Create Mobile User' })
  @Post()
  @Public(true)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all of the mobile users' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Take a user information' })
  @Get(':id')
  findOne(@Param() params: MongoIdDto) {
    return this.usersService.findOne(params.id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  remove(@Param() params: MongoIdDto) {
    return this.usersService.remove(params.id);
  }
}
