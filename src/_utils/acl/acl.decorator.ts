import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from './acl.enum';
import { DecoratorType } from '../interfaces/decorator.type';

/*
  Access Control Level
 */
export const AccessControl: DecoratorType = {
  metaName: 'accessControl',
  metaStateName: 'accessControlState',
  metaData: (...roles: AccessLevel[]) => SetMetadata('accessControl', roles),
};