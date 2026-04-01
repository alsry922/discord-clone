import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Server } from '../servers/entities/server.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Channel, ServerMember, Server])],
  controllers: [ChannelsController],
  providers: [ChannelsService],
})
export class ChannelsModule {}
