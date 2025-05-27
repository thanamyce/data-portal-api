// src/common/decorators/req-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.reqUser; // 👈 the payload set by your AuthGuard
  },
);
