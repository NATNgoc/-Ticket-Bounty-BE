import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { ExpressUserRequestKey, UserRequestBodyProps } from 'src/common/types/guard.type';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { checkPassingFlag } from 'src/common/helper';

@Injectable()
export class CheckExistUserGuard implements CanActivate {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly reflector: Reflector){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    if (checkPassingFlag(this.reflector, context)) return true
    const request = context.switchToHttp().getRequest<Request>();
    const id = request.user.id; 
    const isExistingUser = await this.userRepository.findOneBy({
      id: id
    });
    if (!isExistingUser) {
      throw new NotFoundException("User không tồn tại")
    }
    request[ExpressUserRequestKey] = {
      ...isExistingUser
    } ;
    return true;
  }
}
