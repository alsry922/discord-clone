import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';
import { Repository } from 'typeorm';
import { Server } from '../servers/entities/server.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';

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
    // FIXME: 에러 코드 정의?
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    // owner인지 확인
    // FIXME: 에러 코드 정의?
    if (server.ownerId !== userId) {
      throw new ForbiddenException('서버 소유자만 가능합니다.');
    }
    // 채널 생성 후 저장
    const channel = this.channelRepository.create({
      ...createChannelDto,
      serverId,
    });
    const savedChannel = await this.channelRepository.save(channel);
    // FIXME: ENTITY 그대로 반환?
    return savedChannel;
  }

  async findAll(serverId: number, userId: number) {
    // 서버가 존재하는 지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    // 서버 멤버인지 확인
    const serverMember = await this.serverMemberRepository.findOne({
      where: { serverId: serverId, userId: userId },
    });
    if (!serverMember) {
      throw new ForbiddenException('서버 멤버만 가능합니다.');
    }
    // 채널 목록 반환
    const channels = await this.channelRepository.find({
      where: { serverId: serverId },
    });

    // FIXME: ENTITY 그대로 반환?
    return channels;
  }

  async findOne(serverId: number, id: number, userId: number) {
    // 존재하는 서버인지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    // 서버 멤버인지 확인
    const serverMember = await this.serverMemberRepository.findOne({
      where: { serverId: serverId, userId: userId },
    });
    if (!serverMember) {
      throw new ForbiddenException('서버 멤버만 가능합니다.');
    }
    // 존재하는 채널인지 확인
    const channel = await this.channelRepository.findOne({
      where: { id },
    });
    if (!channel) {
      throw new NotFoundException('채널을 찾을 수 없습니다.');
    }
    // 채널 찾아서 반환
    // FIXME: ENTITY 그대로 반환?
    return channel;
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
    // FIXME: 에러 코드 정의?
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    // 서버 소유자인지 확인
    // FIXME: 에러 코드 정의?
    if (server.ownerId !== userId) {
      throw new ForbiddenException('서버 소유자만 가능합니다.');
    }
    // 존재하는 채널인지 확인
    const channel = await this.channelRepository.findOne({
      where: { id },
    });
    if (!channel) {
      throw new NotFoundException('채널을 찾을 수 없습니다.');
    }
    // 채널 수정하고 반환
    Object.assign(channel, updateChannelDto);
    // FIXME: ENTITY 그대로 반환?
    // NOTE: save는 entity에 id가 있으면 update, id가 없으면 insert로 동작
    return this.channelRepository.save(channel);
  }

  async remove(serverId: number, id: number, userId: number) {
    // 존재하는 서버인지 확인
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });
    // FIXME: 에러 코드 정의?
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    // 서버 소유자인지 확인
    // FIXME: 에러 코드 정의?
    if (server.ownerId !== userId) {
      throw new ForbiddenException('서버 소유자만 가능합니다.');
    }
    // 존재하는 채널인지 확인
    const channel = await this.channelRepository.findOne({
      where: { id },
    });
    if (!channel) {
      throw new NotFoundException('채널을 찾을 수 없습니다.');
    }
    await this.channelRepository.softRemove(channel);
    // FIXME: ENTITY 그대로 반환?
    return channel;
  }
}
