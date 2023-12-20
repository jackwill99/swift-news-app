import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../_utils/necessary/public.decorator';
import { AccessControl } from '../../_utils/acl/acl.decorator';
import { AccessLevel } from '../../_utils/acl/acl.enum';

@ApiTags('Users')
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
  @ApiBearerAuth('Authorization')
  @Get()
  @AccessControl.metaData(AccessLevel.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Take a user information' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update User info' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
