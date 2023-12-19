import { ExecutionContext, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const Public = (state: boolean) => SetMetadata("public", state);

export function checkPublicState(
  reflector: Reflector,
  context: ExecutionContext
): boolean {
  const guard: null | boolean = reflector.get("public", context.getHandler());
  if (guard == null) {
    const guardClass: null | boolean = reflector.get(
      "public",
      context.getClass()
    );

    if (guardClass == null) {
      return false;
    }
    return guardClass;
  }
  return guard;
}
