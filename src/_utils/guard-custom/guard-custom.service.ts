import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SysAdminService } from "src/admin/sys-admin/sys-admin.service";
import { verifyToken } from "../necessary/access.token";

import { FastifyRequest } from "fastify";
import MaintainMode from "../necessary/maintain.metadata";
import { mergeMetaState } from "../necessary/metaState.metadata";
import { checkPublicState } from "../necessary/public.metadata";
import { errorResponse } from "../necessary/response";
import { AccessControl } from "../acl/acl.metadata";

@Injectable()
export default class GuardCustom implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly sysAdminService: SysAdminService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // --------------- Check Maintenance Mode ---------------
    const isMaintain = mergeMetaState<boolean>(
      MaintainMode.metaName,
      MaintainMode.metaStateName,
      this.reflector,
      context
    );
    if (isMaintain.length > 0 && isMaintain[isMaintain.length - 1]) {
      throw new BadRequestException(
        errorResponse(
          "This api endPoint is maintenance now! Try again later",
          false
        )
      );
    }

    // --------------- Check For Public or Authenticated User ---------------
    const isPublic = checkPublicState(this.reflector, context);

    if (isPublic) {
      return true;
    } else {
      const req = context.switchToHttp().getRequest() as FastifyRequest;
      const bearerToken = req.headers["authorization"];
      if (typeof bearerToken === "undefined" || bearerToken == "") {
        throw new BadRequestException(
          errorResponse("Auth token required", false)
        );
      }

      const token = bearerToken.split(" ")[1];
      if (typeof token === "undefined") {
        throw new BadRequestException(errorResponse("Auth token need", false));
      }

      const decode = verifyToken(token);
      if (decode == null) {
        throw new BadRequestException(
          errorResponse("Invalid Auth token", false)
        );
      }

      // --------------- For Authorization (or) Access Control Level  ---------------
      const roles = mergeMetaState<string>(
        AccessControl.metaName,
        AccessControl.metaStateName,
        this.reflector,
        context
      );

      if (!roles || roles.length == 0) {
        return true;
      }

      if (roles.includes(decode["role"])) {
        return true;
      } else {
        throw new BadRequestException(errorResponse("You aren't authorized to access the data!", false));
      }

      // let user = null;
      //
      // if (decode["type"] === "SYSTEMADMIN") {
      //   user = await this.sysAdminService.findOne(decode["user_id"]);
      // }
      //
      // if (user != null) {
      //   const exp = moment.unix(decode["exp"]!).format("yyyy-MM-DD hh:mm:ss");
      //   const now = moment().format("yyyy-MM-DD hh:mm:ss");
      //   if (now > exp) {
      //     throw new BadRequestException(errorResponse("Token expired", false));
      //   } else {
      //     //* pass
      //     return true;
      //   }
      // } else {
      //   throw new BadRequestException(errorResponse("Invalid token", false));
      // }
    }
  }
}
