import { Test, TestingModule } from '@nestjs/testing';
import { ServersService } from './servers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from './entities/server.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { Channel } from '../channels/entities/channel.entity';
import { CreateServerDto } from './dto/create-server.dto';
import { randomUUID } from 'node:crypto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdateServerDto } from './dto/update-server.dto';
import { mock } from 'node:test';

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
      expect(server.inviteCode).toBe('fixed-uuid');
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

  describe('update 테스트', () => {
    it('서버 조회 실패시 NotFoundException이 발생한다', async () => {
      // Arrange
      const id = 1;
      const userId = 1;
      const updateServerDto: UpdateServerDto = {
        name: '이름 수정',
      };
      mockServerRepo.findOne.mockResolvedValue(null);

      // Act, Arrange
      await expect(service.update(id, userId, updateServerDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('서버 소유자가 아닌 경우 ForbiddenException이 발생한다', async () => {
      // arrange
      const id = 1;
      const userId = 1;
      const updateServerDto: UpdateServerDto = {
        name: '이름 수정',
      };
      mockServerRepo.findOne.mockResolvedValue({
        id: 1,
        ownerId: 2,
      });

      // Act, Assert
      await expect(service.update(id, userId, updateServerDto)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('서버를 수정한다.', async () => {
      const id = 1;
      const userId = 1;
      const updateServerDto: UpdateServerDto = {
        name: '이름 수정',
      };

      mockServerRepo.findOne.mockResolvedValue({
        id: 1,
        ownerId: 1,
      });

      mockServerRepo.save.mockResolvedValue({
        ...updateServerDto,
        id: 1,
      });
      // Act
      const server = await service.update(id, userId, updateServerDto);

      // Assert
      // note: toBe는 참조가 같은지 비교, 객체 비교시 내용이 같아도 다른 인스턴스면 실패
      // note: toEqual은 객체 내용 재귀적으로 비교함. 참조가 달라도 내용이 같으면 통과
      // note: toStrictEqaul도 있음. 나중에 참조할 것.
      expect(server.name).toBe('이름 수정');
      expect(mockServerRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, ownerId: 1, name: '이름 수정' }),
      );
    });
  });

  describe('remove 테스트', () => {
    const id = 1;
    const userId = 1;
    it('서버 조회 실패 시 NotFoundException 발생', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValue(null);
      // Act, Assert
      await expect(service.remove(id, userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('서버 소유자가 아니면 ForbiddenException 발생', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValue({
        id,
        ownerId: 2,
      });
      // Act, Assert
      await expect(service.remove(id, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('서버를 삭제한다', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValue({
        id,
        ownerId: userId,
      });
      // Act
      await service.remove(id, userId);
      // Assert
      expect(mockServerRepo.softRemove).toHaveBeenCalledWith(
        // note: toHaveBeenCalledWith에 일반 객체를 넣으면 완전 일치(toEqual 처럼 모든 프로퍼티가 똑같아야 통과)를 검증함
        expect.objectContaining({ id, ownerId: 1 }),
      );
    });
  });

  describe('join 메소드 테스트', () => {
    const inviteCode = randomUUID();
    const serverId = 1;
    const ownerId = 1;
    const userId = 2;
    it('서버 조회 실패시 NotFoundException 발생', async () => {
      // Arrange
      const mockServer = null;
      mockServerRepo.findOne.mockResolvedValue(mockServer);
      // Act, Assert
      await expect(service.join(inviteCode, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
    it('이미 서버 멤버면 그냥 server 반환', async () => {
      // Arrange
      const mockServer = {
        id: serverId,
        ownerId,
      };
      const mockServerMember = {
        id: 1,
        serverId,
        userId,
      };
      mockServerRepo.findOne.mockResolvedValue(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValue(mockServerMember);
      // Act
      const result = await service.join(inviteCode, userId);
      // Assert
      expect(result).toEqual(mockServer);
    });
    it('서버 참가 유저가 서버 멤버가 아니면 서버 멤버로 추가', async () => {
      // Arrange
      const mockServer = {
        id: serverId,
        ownerId,
      };
      const mockServerMember = {
        userId,
        serverId,
      };
      mockServerRepo.findOne.mockResolvedValue(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValue(null);
      mockServerMemberRepo.create.mockReturnValue(mockServerMember);
      mockServerMemberRepo.save.mockResolvedValue(mockServerMember);
      // Act
      const result = await service.join(inviteCode, userId);
      // Assert
      expect(mockServerMemberRepo.save).toHaveBeenCalledWith(
        expect.objectContaining(mockServerMember),
      );
      expect(result).toEqual(mockServer);
    });
  });
});
