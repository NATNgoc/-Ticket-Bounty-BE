import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { EnvKeyConstant } from 'src/common/constants';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const port = +configService.get<number>(EnvKeyConstant.PORT) | 3000;
  await app.listen(port);
}
bootstrap();
