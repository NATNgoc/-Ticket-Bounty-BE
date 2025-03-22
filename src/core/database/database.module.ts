import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSoucre, dataSoucreOption } from 'ormconfig';
import { EnvKeyConstant } from 'src/common/constants';
import { ENTITIES } from 'src/core/database/entities.constant';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get(EnvKeyConstant.HOST_DB),
          port: configService.get(EnvKeyConstant.PORT_DB),
          username: configService.get(EnvKeyConstant.USER_DB),
          password: configService.get(EnvKeyConstant.PASS_DB),
          database: configService.get(EnvKeyConstant.NAME_DB),
          entities: ENTITIES,
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    // TypeOrmModule.forRoot(dataSoucreOption)
    
  ],
})
export class DatabaseModule {}
