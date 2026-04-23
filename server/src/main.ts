import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: 'http://localhost:5173',
  };
  app.enableCors(corsOptions);
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
  // note: 필터는 역순으로 실행됨.(HttpExceptionFilter → AllExceptionFilter 순)
  //  이건 NestJS DI 컨테이너 밖에서 등록하는 방식임
  //  필터가 서비스 같은 걸 주입받을 필요가 있으면 DI 컨테이너 안에서 등록하는 방식인 APP_FILTER를 활용해야 함.
  app.useGlobalFilters(new AllExceptionFilter(), new HttpExceptionFilter());
  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      // note: Expose 데코레이터 있는 필드만 노출
      excludeExtraneousValues: true, // 글로벌 기본값으로 설정
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Discord Clone API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
