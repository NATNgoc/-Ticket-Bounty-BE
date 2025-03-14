import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtTokenService } from '../jwt.service';
import { ExpressUserRequestKey, UserRequestBodyProps } from 'src/common/types/guard.type';
import { Request } from 'express';
import { checkPassingFlag } from 'src/common/helper';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtTokenService
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      if (checkPassingFlag(this.reflector, context)) return true
      const request = context.switchToHttp().getRequest<Request>();
      const token = request.headers['authorization'];
      if (!token) {
        throw new ForbiddenException("Token không hợp lệ")
      }
      
      const isValidJWT = await this.jwtService.verifyToken(token);
      if (!isValidJWT) {
        throw new ForbiddenException("Token không hợp lệ")
      }
      const body = {
        id: isValidJWT.user_id
      }
      request[ExpressUserRequestKey] = {
        ...body
      } 
      return true
      } catch (error) {
        throw new ForbiddenException(error.message)
      }
  }
}

/*

- grid-template-row:
- grid-template-column:
- grid-auto-row: maxmin(100px, 1fr)
- grid-auto-column:
- grid-template-ares:
- jutify-content:
- align-content
- jutify-items
- align-items
- grid-row-gap
- grid-column-gap

- grid-column-start/end
- grid-row-start/end
- grid-area
- justify-self
- align-self
- place

*/


