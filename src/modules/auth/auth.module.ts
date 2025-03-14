import { Global, Module } from '@nestjs/common';import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthController } from './auth.controller';
import { JwtTokenService } from './jwt.service';
import { CheckExistUserGuard } from './guards/check-exist-user.guard';
import { JwtGuard } from './guards/jwt.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AuthService, JwtTokenService, CheckExistUserGuard, JwtGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtTokenService, CheckExistUserGuard, JwtGuard, TypeOrmModule.forFeature([User])],
})
export class AuthModule {}
