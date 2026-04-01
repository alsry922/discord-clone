import { Module } from '@nestjs/common';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Channel } from '../channels/entities/channel.entity';

@Module({
  imports: [
    // server 생성시 소유자를 server-member에 추가해야 하고, 기본 channel도 생성해야함.
    TypeOrmModule.forFeature([Server, ServerMember, Channel]),
  ],
  controllers: [ServersController],
  providers: [ServersService],
})
export class ServersModule {}
