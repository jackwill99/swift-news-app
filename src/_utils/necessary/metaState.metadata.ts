import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export enum MetaStateEnum {
  OVERRIDE = "OVERRIDE",
  MERGE = "MERGE",
}

export const MetaState = (
  metaStateName: string,
  state: MetaStateEnum = MetaStateEnum.OVERRIDE
) => SetMetadata(metaStateName, state);

export function mergeMetaState<T>(
  name: string,
  metaStateName: string,
  reflector: Reflector,
  context: ExecutionContext
): T[] {
  const guard = reflector.get<MetaStateEnum>(
    metaStateName,
    context.getHandler()
  );

  let result: boolean;
  if (!guard) {
    result = false;
  } else {
    result = guard == MetaStateEnum.MERGE;
  }

  if (result) {
    return reflector.getAllAndMerge<T[]>(name, [
      context.getHandler(),
      context.getClass()
    ]);
  } else {
    const handle = reflector.get<T>(name, context.getHandler());
    if (handle === undefined) {
      const classHandle = reflector.get<T>(name, context.getClass());
      if (classHandle !== undefined) {
        if (Array.isArray(classHandle)) {
          return [...classHandle];
        } else {
          return [classHandle];
        }
      }

      return [];
    }

    if (Array.isArray(handle)) {
      return [...handle];
    } else {
      return [handle];
    }
  }
}
