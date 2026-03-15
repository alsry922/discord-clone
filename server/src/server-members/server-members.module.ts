import { Module } from '@nestjs/common';
import { ServerMembersService } from './server-members.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServerMember } from './entities/server-member.entity';

@Module({
  imports: [
    // forFeature -> 각 모듈에서 이 기능을 쓰겠다.
    TypeOrmModule.forFeature([ServerMember]),
  ],
  controllers: [],
  providers: [ServerMembersService],
})
export class ServerMembersModule {}
