import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_DECORATOR_KEY } from "../constants";

export function checkPassingFlag(reflector: Reflector, context: ExecutionContext) {
    const isPassingFlag = reflector.get<string>(IS_PUBLIC_DECORATOR_KEY, context.getHandler());
    if (isPassingFlag) {
      return true;
    }
}
