import { Test, TestingModule } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Channel } from '../channels/entities/channel.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { randomUUID } from 'node:crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

const mockServerRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  softRemove: jest.fn(),
};

const mockServerMemberRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
};

const mockChannelRepo = {
  create: jest.fn(),
  save: jest.fn(),
};

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('fixed-uuid'),
}));

describe('ServersService', () => {
  let service: ServersService;

  beforeEach(async () => {
    // note: clearAllMocks는 호출 기록만 초기화 함
    // jest.clearAllMocks();
    // note: resetAllMocks는 설정한 반환값/구현까지 초기화
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServersService,
        {
          provide: getRepositoryToken(Server),
          useValue: mockServerRepo,
        },
        {
          provide: getRepositoryToken(ServerMember),
          useValue: mockServerMemberRepo,
        },
        {
          provide: getRepositoryToken(Channel),
          useValue: mockChannelRepo,
        },
      ],
    }).compile();

    service = module.get<ServersService>(ServersService);
  });

  describe('create 메소드 테스트', () => {
    it('서버를 생성한다.', async () => {
      // Arrange (준비)
      const userId = 1;
      const createServerDto: CreateServerDto = {
        name: '테스트 채널',
      };

      mockServerRepo.create.mockReturnValue({
        id: 1,
        icon: null,
        name: createServerDto.name,
        inviteCode: randomUUID(),
        ownerId: userId,
      });

      mockServerMemberRepo.create.mockReturnValue({
        id: 1,
        userId,
        serverId: 1,
      });

      mockChannelRepo.create.mockReturnValue({
        id: 1,
        name: '일반',
        type: 'text',
        serverId: 1,
      });

      // Act
      const server = await service.create(userId, createServerDto);

      // Assert
      expect(server.id).toBe(1);
      expect(server.inviteCode).toBe(randomUUID());
      expect(mockServerRepo.create).toHaveBeenCalledWith({
        ...createServerDto,
        ownerId: userId,
        inviteCode: 'fixed-uuid',
      });
      expect(mockServerMemberRepo.create).toHaveBeenCalledWith({
        userId,
        serverId: server.id,
      });
      expect(mockChannelRepo.create).toHaveBeenCalledWith({
        name: '일반',
        serverId: server.id,
      });
    });
  });

  describe('findOne 테스트', () => {
    it('서버 조회에 실패한 경우 NotFoundException이 발생한다.', async () => {
      // Arrange
      const id = 1;
      const userId = 1;
      mockServerRepo.findOne.mockResolvedValue(null);

      // Act, Assert
      await expect(service.findOne(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('서버 멤버가 아니라면 서버 조회시 ForbiddenException이 발생한다', async () => {
      // Arrange
      const id = 1;
      const userId = 1;
      mockServerRepo.findOne.mockResolvedValue({
        id,
      });
      mockServerMemberRepo.findOne.mockResolvedValue(null);

      // Act, Assert
      await expect(service.findOne(id, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('서버 조회에 성공했다면 server를 반환한다.', async () => {
      // Arrange
      const id = 1;
      const userId = 1;
      mockServerRepo.findOne.mockResolvedValue({
        id,
      });
      mockServerMemberRepo.findOne.mockResolvedValue({
        userId,
      });

      // Act
      const server = await service.findOne(id, userId);

      // Assert
      expect(server.id).toBe(1);
    });
  });
});
