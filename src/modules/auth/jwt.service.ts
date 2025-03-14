import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import TokenPayload from './dto/create-token.dto';
import { EnvKeyConstant } from 'src/common/constants';

@Injectable()
export class JwtTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService:ConfigService
  ) {}

  async verifyToken( token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token, {
      secret: `${this.configService.get<string>(EnvKeyConstant.JWT_SECRET)}`,
    });
  }

  async generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<string>(EnvKeyConstant.JWT_SECRET)}`,
      expiresIn: `${this.configService.get<string>(
        EnvKeyConstant.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
      )}`,
    });
  }

  async generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      secret: `${this.configService.get<string>(EnvKeyConstant.JWT_SECRET)}`,
      expiresIn: `${this.configService.get<string>(
        EnvKeyConstant.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      )}`,
    });
  }

  public async genNewPairToken(
    tokenPayload: TokenPayload,
  ): Promise<[string, string]> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken({
        ...tokenPayload,
      }),
      this.generateRefreshToken({
        ...tokenPayload,
      }),
    ]);
    return [accessToken, refreshToken];
  }
}