import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import GuardCustom from './guard-custom.service';

@Global()
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: GuardCustom,
    },
  ],
})
export class GuardCustomModule {
}
