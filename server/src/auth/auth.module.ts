import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // forFeature / forFeatureAsync
    // forRoot로 설정된 것을 기반으로, 특정 모듈에서 추가 설정
    // 인프라는 공유하되, "나는 이것만 쓸게"라고 모듈별로 범위를 좁힘
    TypeOrmModule.forFeature([User]),
    // register / registerAsync
    // 해당 모듈에서만 사용하는 독립적인 설정
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
