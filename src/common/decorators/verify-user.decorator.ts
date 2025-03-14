import { SetMetadata, UseGuards, UsePipes } from '@nestjs/common';
import { CheckExistUserGuard } from 'src/modules/auth/guards/check-exist-user.guard';
import { JwtGuard } from 'src/modules/auth/guards/jwt.guard';

export const VerifyUser = (...args: string[]) => UseGuards();
