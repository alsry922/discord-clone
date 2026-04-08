import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server } from './entities/server.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Channel } from '../channels/entities/channel.entity';

@Injectable()
export class ServersService {
  constructor(
    // FIXME: InjectRepository가 뭐지? jpa처럼 interface를 따로 나누어야 하나?
    // note: 나중에 필요하면 리팩토링
    @InjectRepository(Server)
    private readonly serverRepository: Repository<Server>,
    @InjectRepository(ServerMember)
    private readonly serverMemberRepository: Repository<ServerMember>,
    @InjectRepository(Channel)
    private readonly channelRepository: Repository<Channel>,
  ) {}
  async create(userId: number, createServerDto: CreateServerDto) {
    // FIXME: transaction 처리?
    const server = this.serverRepository.create({
      ...createServerDto,
      ownerId: userId,
      // uuid v4 (랜덤 기반) 생성
      inviteCode: randomUUID(),
    });

    await this.serverRepository.save(server);

    const serverMember = this.serverMemberRepository.create({
      userId,
      serverId: server.id,
    });

    await this.serverMemberRepository.save(serverMember);

    const channel = this.channelRepository.create({
      name: '일반',
      serverId: server.id,
    });

    await this.channelRepository.save(channel);

    // FIXME: 서비스에서 엔티티를 그대로 반환?
    return server;
  }

  async findAll(userId: number) {
    // .createQueryBuilder('server')
    //     .select(['server.id', 'server.name'])   // 특정 컬럼만 조회
    //     .leftJoin(...)                          // LEFT JOIN
    //     .innerJoin(...)                         // INNER JOIN
    //     .where('server.name = :name', { name }) // WHERE
    //     .andWhere(...)                          // AND 조건 추가
    //     .orWhere(...)                           // OR 조건 추가
    //     .orderBy('server.createdAt', 'DESC')    // ORDER BY
    //     .skip(0)                                // OFFSET (페이지네이션)
    //     .take(10)                               // LIMIT
    //     .getMany()                              // 결과 배열
    //     .getOne()                               // 결과 하나
    //     .getCount()                             // COUNT

    // 내가 속한 서버 목록
    // FIXME: 서비스에서 엔티티를 그대로 반환?
    return (
      this.serverRepository
        // servers alias server
        .createQueryBuilder('server')
        // server_members alias member
        .innerJoin('server_members', 'member', 'member.server_id = server.id')
        .where('member.user_id = :userId', { userId })
        .getMany()
    );
  }

  async findOne(id: number, userId: number) {
    // find, findOne 같은 조회 옵션 사용이 가능함.
    // findOne은 LIMIT 1이 붙어서 단건 반환이 됨.
    // this.serverRepository.find({
    //   where: { ownerId: 1 }, // 조건
    //   relations: { owner: true }, // 관계된 entity도 같이 가져옴 (JOIN)
    //   select: { id: true, name: true }, // 특정 컬럼만
    //   order: { createdAt: 'DESC' }, // 정렬
    //   skip: 0, // OFFSET
    //   take: 10, // LIMIT
    // });
    const server = await this.serverRepository.findOne({
      where: { id },
    });

    // FIXME: 에러 종류(코드) 정의?
    // FIXME: 반복되는 서버를 찾고, 있는지 확인하는 작업 리팩토링?
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }

    // 서버 멤버인지 확인
    const member = await this.serverMemberRepository.findOne({
      where: { serverId: id, userId },
    });
    if (!member) {
      throw new ForbiddenException('이 서버의 멤버가 아닙니다.');
    }
    // FIXME: 서비스에서 엔티티를 그대로 반환?
    return server;
  }

  async update(id: number, userId: number, updateServerDto: UpdateServerDto) {
    const server = await this.serverRepository.findOne({ where: { id } });
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    if (server.ownerId !== userId) {
      throw new ForbiddenException('서버 소유자만 수정할 수 있습니다.');
    }

    Object.assign(server, updateServerDto);

    // FIXME: 서비스에서 엔티티를 그대로 반환?
    return this.serverRepository.save(server);
  }

  async remove(id: number, userId: number) {
    const server = await this.serverRepository.findOne({ where: { id } });
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }
    if (server.ownerId !== userId) {
      throw new ForbiddenException('서버의 소유자만 삭제할 수 있습니다');
    }

    // FIXME: 서비스에서 엔티티를 그대로 반환?
    await this.serverRepository.softRemove(server);
  }

  async join(inviteCode: string, userId: number) {
    const server = await this.serverRepository.findOne({
      where: { inviteCode },
    });
    if (!server) {
      throw new NotFoundException('서버를 찾을 수 없습니다.');
    }

    const existingMember = await this.serverMemberRepository.findOne({
      where: { serverId: server.id, userId },
    });

    // FIXME: 서비스에서 엔티티를 그대로 반환?
    if (existingMember) {
      return server;
    }

    const member = this.serverMemberRepository.create({
      userId,
      serverId: server.id,
    });
    await this.serverMemberRepository.save(member);

    // FIXME: 서비스에서 엔티티를 그대로 반환?
    return server;
  }
}
