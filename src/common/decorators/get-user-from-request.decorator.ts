import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserInReq = createParamDecorator((_data: any, req: Request) => {
    return req.user;
});