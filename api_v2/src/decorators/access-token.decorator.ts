import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const AccessToken = createParamDecorator((_, ctx: ExecutionContext) => {
  const headers = ctx.getArgs()[2].req.headers;

  return headers['access-token'];
});
