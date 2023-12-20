import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { UsersModule } from './users/users.module';

/*
  This is the collection of modules that is related with admin.
  Benefit is you can separate multiple swagger with specific module, and they are independent with each other
 */
export const mobileImports = [UsersModule];

@Module({
  imports: [
    ...mobileImports,
    RouterModule.register([
      {
        path: 'mobile',
        children: [
          {
            path: 'users',
            module: UsersModule,
          },
        ],
      },
    ]),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class MobileModule {
}
