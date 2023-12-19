import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';

/*
  This is the collection of modules that is related with admin.
  Benefit is you can separate multiple swagger with specific module, and they are independent with each other
 */
export const adminImports = [];

@Module({
  imports: [
    ...adminImports,
    RouterModule.register([
      {
        path: 'sys',
        children: [],
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AdminModule {
}
