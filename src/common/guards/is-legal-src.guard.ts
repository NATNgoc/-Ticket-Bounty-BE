import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRequestBodyProps } from '../types/guard.type';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { checkPassingFlag } from '../helper';
import { KEY_ID_DECORATOR_KEY } from '../constants';

// This guard is used to check if the user is legal to access the resource.
// T is a generic for service

export abstract class IsLegalSourceGuard<T extends BaseService> implements CanActivate {
  
  constructor(private readonly reflector: Reflector, private readonly service: T) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    if (checkPassingFlag(this.reflector, context)) return true
    const request = context.switchToHttp().getRequest<Request>();
    const srcId = request.params[this.reflector.get<string>(KEY_ID_DECORATOR_KEY, context.getHandler())];
    const userId = request.user.id;
    const isLegalResource = await this.service.findOneByResourceIdAndUserId(srcId, userId);
    if (!isLegalResource) {
      throw new ForbiddenException("Bạn không có quyền truy cập tài nguyên này");
    }
    return true;
  }
}
