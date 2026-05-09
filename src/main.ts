import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não declarados no DTO
      forbidNonWhitelisted: true, // lança erro se vier campo extra
      transform: true, // transforma o body no tipo do DTO automaticamente
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
