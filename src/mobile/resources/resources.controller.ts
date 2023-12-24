import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { AccessLevel } from "../../_utils/acl/acl.enum";
import { AccessControl } from "../../_utils/acl/acl.metadata";
import { Public } from "../../_utils/necessary/public.metadata";
import { ResourcesService } from "./resources.service";

@ApiTags("Resource")
@Public(false)
@AccessControl.metaData(AccessLevel.ADMIN)
@ApiBearerAuth("Authorization")
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @ApiOperation({ summary: "Take the data resources" })
  @Get()
  takeAll() {
    return this.resourcesService.takeAll();
  }
}
