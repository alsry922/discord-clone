import { Injectable } from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { Server } from '../servers/entities/server.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { ChannelException } from './exceptions/channel.exception';
import { ServerException } from '../servers/exceptions/server.exception';
import { plainToInstance } from 'class-transformer';
import { ChannelResponseDto } from './dto/channel-response.dto';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(ServerMember)
    private readonly serverMemberRepository: Repository<ServerMember>,
  ) {}
  async create(
    serverId: number,
    userId: number,
    createChannelDto: CreateChannelDto,
  ) {
    // 서버 있는지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });

    if (!server) {
      throw ServerException.notFound();
    }
    // owner인지 확인
    if (server.ownerId !== userId) {
      throw ServerException.forbidden();
    }
    // 채널 생성 후 저장
    const channel = this.channelRepository.create({
      ...createChannelDto,
      serverId,
    });
    const savedChannel = await this.channelRepository.save(channel);
    return plainToInstance(ChannelResponseDto, savedChannel);
  }

  async findAll(serverId: number, userId: number) {
    // 서버가 존재하는 지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw ServerException.notFound();
    }
    // 서버 멤버인지 확인
    const serverMember = await this.serverMemberRepository.findOne({
      where: { serverId: serverId, userId: userId },
    });

    if (!serverMember) {
      throw ServerException.notMember();
    }
    // 채널 목록 반환
    const channels = await this.channelRepository.find({
      where: { serverId: serverId },
    });

    return plainToInstance(ChannelResponseDto, channels);
  }

  async findOne(serverId: number, id: number, userId: number) {
    // 존재하는 서버인지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw ServerException.notFound();
    }
    // 서버 멤버인지 확인
    const serverMember = await this.serverMemberRepository.findOne({
      where: { serverId: serverId, userId: userId },
    });
    if (!serverMember) {
      throw ServerException.notMember();
    }
    // 존재하는 채널인지 확인
    const channel = await this.findChannelOrFail(id);

    // 채널 찾아서 반환
    return plainToInstance(ChannelResponseDto, channel);
  }

  async update(
    serverId: number,
    id: number,
    userId: number,
    updateChannelDto: UpdateChannelDto,
  ) {
    // 존재하는 서버인지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw ServerException.notFound();
    }
    // 서버 소유자인지 확인
    if (server.ownerId !== userId) {
      throw ServerException.forbidden();
    }
    // 존재하는 채널인지 확인
    const channel = await this.findChannelOrFail(id);

    // NOTE: Object.assign은 얕은 복사라 중첩 객체가 생기면 병합이 아닌 교체가 일어남.
    //  그 때는 필드별 수동 할당이나 lodash.merge 사용 고려
    Object.assign(channel, updateChannelDto);
    // NOTE: save는 entity에 id가 있으면 update, id가 없으면 insert로 동작
    const updatedChannel = await this.channelRepository.save(channel);
    return plainToInstance(ChannelResponseDto, updatedChannel);
  }

  async remove(serverId: number, id: number, userId: number) {
    // 존재하는 서버인지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw ServerException.notFound();
    }
    // 서버 소유자인지 확인
    if (server.ownerId !== userId) {
      throw ServerException.forbidden();
    }
    // 존재하는 채널인지 확인
    const channel = await this.findChannelOrFail(id);

    const removedChannel = await this.channelRepository.softRemove(channel);
    return removedChannel.id;
  }

  private async findChannelOrFail(channelId: number) {
    const channel = await this.channelRepository.findOne({
      where: { id: channelId },
    });
    if (!channel) {
      throw ChannelException.notFound();
    }
    return channel;
  }
}
