import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from "argon2"
import { JwtTokenService } from './jwt.service';
@Injectable()
export class AuthService {

    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService:JwtTokenService){}


    async deleteUser(id: string) {
        const isExistingUser = await this.userRepository.findOneBy({id})
        if (!isExistingUser) {
            throw new NotFoundException("User không tồn tại")
        }
        await this.userRepository.remove(isExistingUser)
        return true
    }

    async refreshToken(token: string) {
        try {
            const isTokenValid = await this.jwtService.verifyToken(token)
            const isExistingUser = await this.userRepository.findOneBy({id: isTokenValid.user_id})
            if (!isExistingUser) {
                throw new ForbiddenException("Unvalid user")
            }

            if (! await argon.verify(isExistingUser.refreshToken, token)) {
                throw new ForbiddenException("Unvalid Refresh Token")
            }
            const {accessToken, refreshToken} = await this.getPairToken(isExistingUser.id)
            isExistingUser.refreshToken = await argon.hash(refreshToken)
            await this.userRepository.save(isExistingUser)
            console.log("moi refresh token cho user", isExistingUser.id)
            return {
                accessToken,
                refreshToken
            }
        } catch (error) {
            throw new ForbiddenException(error.message || "Unvalid Token")
        }
        
    }

    async signUp(dto: CreateUserDto) {
        const isExistingUser = await this.userRepository.findOneBy({
            email: dto.email,
        })   
        if (isExistingUser) {
            throw new ConflictException("Email đã tồn tại")
        }
        const result = await this.userRepository.save(this.userRepository.create({
            ...dto,
            password: await argon.hash(dto.password)
        }))
        if (!result) {
            throw new InternalServerErrorException("Đã có lỗi xảy ra")
        }
        return true;
    }

    async getPairToken(user_id: string): Promise<{accessToken: string, refreshToken: string}> {
        const [accessToken, refreshToken] = await this.jwtService.genNewPairToken({
            user_id: user_id,
         })
         return {
             accessToken: accessToken,
             refreshToken: refreshToken
         }
    }


    async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({
            email: email
        })
        if (!user) {
            throw new NotFoundException("Email không tồn tại")
        }
        const isPasswordValid = await argon.verify(user.password, password)
        if (!isPasswordValid) {
            throw new ForbiddenException("Mật khẩu không đúng")
        }
        const {accessToken, refreshToken} = await this.getPairToken(user.id)

        user.refreshToken=await argon.hash(refreshToken)
        
        await this.userRepository.save(user)

        return {
            userId: user.id,
            accessToken,
            refreshToken
        }
    }

    
}
