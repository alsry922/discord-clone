import { Injectable } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { Server } from './entities/server.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'node:crypto';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Channel } from '../channels/entities/channel.entity';
import { ServerException } from './exceptions/server.exception';
import { plainToInstance } from 'class-transformer';
import { ServerResponseDto } from './dto/server-response.dto';

@Injectable()
export class ServersService {
  constructor(
    private readonly dataSource: DataSource,
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
    const server = await this.dataSource.transaction(async (manager) => {
      const server = this.serverRepository.create({
        ...createServerDto,
        ownerId: userId,
        // uuid v4 (랜덤 기반) 생성
        inviteCode: randomUUID(),
      });
      await manager.save(server);

      const serverMember = this.serverMemberRepository.create({
        userId,
        serverId: server.id,
      });
      await manager.save(serverMember);

      const channel = this.channelRepository.create({
        name: '일반',
        serverId: server.id,
      });

      await manager.save(channel);
      return server;
    });
    return plainToInstance(ServerResponseDto, server);
  }

  async findAll(userId: number) {
    // note
    //  .createQueryBuilder('server')
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
    const servers = await this.serverRepository
      // servers alias server
      .createQueryBuilder('server')
      // server_members alias member
      .innerJoin('server_members', 'member', 'member.server_id = server.id')
      .where('member.user_id = :userId', { userId })
      .getMany();
    return plainToInstance(ServerResponseDto, servers);
  }

  async findOne(id: number, userId: number) {
    //note
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
    const server = await this.findServerOrFail(id);

    // 서버 멤버인지 확인
    const member = await this.serverMemberRepository.findOne({
      where: { serverId: id, userId },
    });
    if (!member) {
      throw ServerException.notMember();
    }
    return plainToInstance(ServerResponseDto, server);
  }

  async update(id: number, userId: number, updateServerDto: UpdateServerDto) {
    const server = await this.findServerOrFail(id);
    if (server.ownerId !== userId) {
      throw ServerException.forbidden();
    }
    // NOTE: Object.assign(target, source): source의 프로퍼티를 target에 덮어쓰기(프로퍼티가 있든 없든 무조건 덮어씀)
    //  얕은 복사라 중첩 객체가 생기면 병합이 아닌 교체가 일어남.
    //  그 때는 필드별 수동 할당이나 lodash.merge 사용 고려
    Object.assign(server, updateServerDto);

    const updatedServer = await this.serverRepository.save(server);
    return plainToInstance(ServerResponseDto, updatedServer);
  }

  async remove(id: number, userId: number) {
    const server = await this.findServerOrFail(id);

    if (server.ownerId !== userId) {
      throw ServerException.forbidden();
    }

    const removedServer = await this.serverRepository.softRemove(server);
    // note 지워지는 건 특별한 response 반환 대신 지워진 엔티티의 id만 제공
    return removedServer.id;
  }

  async join(inviteCode: string, userId: number) {
    const server = await this.serverRepository.findOne({
      where: { inviteCode },
    });
    if (!server) {
      throw ServerException.notFound();
    }

    const existingMember = await this.serverMemberRepository.findOne({
      where: { serverId: server.id, userId },
    });

    if (existingMember) {
      return plainToInstance(ServerResponseDto, server);
    }

    const member = this.serverMemberRepository.create({
      userId,
      serverId: server.id,
    });
    await this.serverMemberRepository.save(member);

    return plainToInstance(ServerResponseDto, server);
  }

  private async findServerOrFail(serverId: number): Promise<Server> {
    const server = await this.serverRepository.findOne({
      where: { id: serverId },
    });

    if (!server) {
      throw ServerException.notFound();
    }

    return server;
  }
}
