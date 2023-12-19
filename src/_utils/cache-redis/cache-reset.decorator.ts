import { SetMetadata } from '@nestjs/common';
import { DecoratorType } from '../interfaces/decorator.type';

const CacheReset: DecoratorType = {
  metaName: 'cache_reset',
  metaStateName: 'cache_reset_state',
  /*
   Relevant resource url
   eg. /api/v1/sys/users => "users"
   eg. /api/v1/sys/users/1234 => "users:id"
   */
  metaData: (resourceEndPoints: string[]) =>
    SetMetadata('cache_reset', resourceEndPoints),
};

export default CacheReset;
