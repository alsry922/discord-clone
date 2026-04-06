import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from './config/snake-naming.strategy';
import { UsersModule } from './users/users.module';
import { ServersModule } from './servers/servers.module';
import { ServerMembersModule } from './server-members/server-members.module';
import { ChannelsModule } from './channels/channels.module';
import { MessagesModule } from './messages/messages.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // NOTE
    //  forRoot / forRootAsync
    //  앱 전체에서 한 번 설정하고 공유하는 전역 설정(인프라 세팅과 비슷)
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        // NOTE: PGTZ 환경 변수를 'UTC'로 설정
        //  pg 드라이버(client)(node-postgres)가 PostgreSQL 서버와 통신할 때 사용되는 세션 타임존을 지정하는 환경변수
        //  타임스탬프를 UTC로 처리하게 함.(PostgreSQL이 "이 클라이언트는 UTC 기준이야"라고 인식)
        //  PostreSQL용으로 추가된 옵션
        // useUTC: true,
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
    }),
    UsersModule,
    ServersModule,
    ServerMembersModule,
    ChannelsModule,
    MessagesModule,
    AuthModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
  ],
})
export class AppModule {}
