import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      // Note DTO에 정의 안 된 property 자동으로 제거
      whitelist: true,
      // Note
      //  DTO에 없는 property가 오면 400 에러
      //  class-validator 데코레이터가 없으면 모든 프로퍼티가 DTO에 정의 안된 것으로 취급됨
      forbidNonWhitelisted: true,
      // Note
      //  타입 자동 변환
      //    primitive 타입 변환
      //    route parameter는 항상 string인데, 타입 힌트를 보고 자동으로 변환해줌.
      //  DTO 클래스 인스턴스화
      //    @Body를 통해 받는 객체는 plain object임.
      //    내부적으로 class-transformer의 plainToInstance를 호출해서 DTO 클래스로 만들어줌
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
