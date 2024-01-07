import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { SysAdminModule } from "src/admin/sys-admin/sys-admin.module";
import GuardCustom from "./guard-custom.service";

@Global()
@Module({
  imports: [SysAdminModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GuardCustom,
    },
  ],
})
export class GuardCustomModule {}
