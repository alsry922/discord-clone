import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { Request } from 'express';

// FIXME: createParamDecorator 와 setMetaData의 차이?
//  둘 다 데코레이터를 만드는데 무슨 차이지
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<Request>();
    // FIXME: 오류 코드 정의?
    if (!request.user) {
      throw new UnauthorizedException();
    }
    return request.user;
  },
);
