import { Body, Controller, Delete, ForbiddenException, Get, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtTokenService } from './jwt.service';
import { VerifyUser } from 'src/common/decorators/verify-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly jwtS: JwtTokenService) {}

    @Post("sign-up")
    @HttpCode(200)
    async signUp(@Body() dto: CreateUserDto) {
        return await this.authService.signUp(dto)
    }

    @Post("login")
    @HttpCode(200)
    async login(@Body() dto: LoginUserDto, @Req() req: Request) {
        return await this.authService.login(dto.email, dto.password)
    }

    @Get()

    @Delete("temp")
    @HttpCode(200)
    async deleteUser(@Body() {id}: {id: string}) {
        return await this.authService.deleteUser(id)
    }

    @Post("refreshtoken")
    @HttpCode(200)
    async refreshToken(@Headers("refreshtoken") refreshToken: string) {
        if (!refreshToken) {
            throw new ForbiddenException("Unvalid Token")
        }
         return await this.authService.refreshToken(refreshToken)
    }
}
