import { Controller, Get } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../_utils/necessary/public.decorator';
import { AccessControl } from '../../_utils/acl/acl.decorator';
import { AccessLevel } from '../../_utils/acl/acl.enum';

@ApiTags('Resource')
@Public(false)
@AccessControl.metaData(AccessLevel.ADMIN)
@ApiBearerAuth('Authorization')
@Controller()
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {
  }

  @ApiOperation({ summary: 'Take the data resources' })
  @Get()
  takeAll() {
    return this.resourcesService.takeAll();
  }

}
