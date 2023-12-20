import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import DBConnection from '../../constants/db';

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
export class UsersModule {
}
