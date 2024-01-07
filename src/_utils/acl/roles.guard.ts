// import { ExecutionContext, Injectable } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";
// import GuardCustom from "../guard-custom/guard-custom.service";
// import { mergeMetaState } from "../necessary/metaState.decorator";
// import { roleMeta, roleMetaState } from "./roles.decorator";
//
// @Injectable()
// export class RolesGuard extends GuardCustom {
//   activate(
//     context: ExecutionContext,
//     reflector: Reflector
//   ): boolean | Promise<boolean> {
//     const roles = mergeMetaState<string>(
//       roleMeta,
//       roleMetaState,
//       reflector,
//       context
//     );
//
//     if (!roles) {
//       return true;
//     }
//
//     const request = context.switchToHttp().getRequest();
//     const role = request.query["role"];
//
//     return roles.includes(role);
//   }
// }
