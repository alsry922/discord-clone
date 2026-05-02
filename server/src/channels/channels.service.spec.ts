import { Test } from '@nestjs/testing';
import { ChannelsService } from './channels.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Server } from '../servers/entities/server.entity';
import { ChannelType } from './enums/channel-type.enum';
import { ServerException } from '../servers/exceptions/server.exception';
import { Channel } from './entities/channel.entity';
import { ServerMember } from '../server-members/entities/server-member.entity';
import { ServerError } from '../servers/constants/server-error-code';
import { Repository } from 'typeorm';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { plainToInstance } from 'class-transformer';
import { ChannelResponseDto } from './dto/channel-response.dto';
import { ChannelException } from './exceptions/channel.exception';
import { ChannelError } from './constants/channel-error-code';

describe('ChannelsService', () => {
  let service: ChannelsService;
  let mockServerRepo: DeepMocked<Repository<Server>>;
  let mockChannelRepo: DeepMocked<Repository<Channel>>;
  let mockServerMemberRepo: DeepMocked<Repository<ServerMember>>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      providers: [ChannelsService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(Server)) {
          return createMock<Repository<Server>>();
        }
        if (token === getRepositoryToken(Channel)) {
          return createMock<Repository<Channel>>();
        }
        if (token === getRepositoryToken(ServerMember)) {
          return createMock<Repository<ServerMember>>();
        }
      })
      .compile();

    service = module.get<ChannelsService>(ChannelsService);
    mockServerRepo = module.get<DeepMocked<Repository<Server>>>(
      getRepositoryToken(Server),
    );
    mockChannelRepo = module.get<DeepMocked<Repository<Channel>>>(
      getRepositoryToken(Channel),
    );
    mockServerMemberRepo = module.get<DeepMocked<Repository<ServerMember>>>(
      getRepositoryToken(ServerMember),
    );
  });

  describe('create 테스트', () => {
    const serverId = 1;
    const userId = 1;
    const createChannelDto = {
      name: '채널1',
      type: ChannelType.TEXT,
    };
    it('서버가 없으면 notFound ServerException이 발생한다', async () => {
      // Arrange
      expect.assertions(2);

      mockServerRepo.findOne.mockResolvedValueOnce(null);

      // Act, Assert
      try {
        await service.create(serverId, userId, createChannelDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_FOUND,
        );
      }
    });
    it('owner가 아니면 forbidden ServerException이 발생한다', async () => {
      // Arrange
      expect.assertions(2);

      const mockServer = {
        id: 1,
        name: '서버1',
        ownerId: 2,
      } as Server;
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      // Act
      try {
        await service.create(serverId, userId, createChannelDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.FORBIDDEN,
        );
      }
    });
    it('올바르게 채널이 생성되면 channelResponseDto를 반환한다', async () => {
      // Arrange
      const mockServer = {
        id: serverId,
        name: '서버1',
        ownerId: userId,
      } as Server;

      const mockChannel = {
        id: 1,
        name: createChannelDto.name,
        type: createChannelDto.type,
        serverId: serverId,
      } as Channel;

      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockChannelRepo.create.mockReturnValueOnce(mockChannel);
      mockChannelRepo.save.mockResolvedValueOnce(mockChannel);
      // Act
      const result = await service.create(serverId, userId, createChannelDto);
      // Assertion
      expect(mockServerRepo.findOne).toHaveBeenCalledWith({
        where: { id: serverId },
      });
      expect(mockChannelRepo.create).toHaveBeenCalledWith({
        ...createChannelDto,
        serverId,
      });
      expect(mockChannelRepo.save).toHaveBeenCalledWith(mockChannel);
      expect(result).toEqual(plainToInstance(ChannelResponseDto, mockChannel));
    });
  });

  describe('findAll 테스트', () => {
    const serverId = 1;
    const userId = 1;
    it('존재하는 서버가 없으면 notFound ServerException이 발생한다', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(null);
      expect.assertions(2);
      // Act, Assertion
      try {
        await service.findAll(serverId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_FOUND,
        );
      }
    });
    it('서버 멤버가 아니면 notMember ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      const mockServer = {
        id: serverId,
        name: '서버1',
        ownerId: userId,
      } as Server;
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.findAll(serverId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_MEMBER,
        );
      }
    });
    it('채널 목록 조회에 성공하면 channelResponseDto 배열을 반환한다', async () => {
      // Arrange
      const mockServer = {
        id: serverId,
        name: '서버1',
        ownerId: userId,
      } as Server;
      const mockServerMember = {
        id: 1,
        userId,
        serverId,
      } as ServerMember;
      const mockChannels = [
        {
          id: 1,
          name: '채널1',
        },
        {
          id: 2,
          name: '채널2',
        },
      ] as Channel[];
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValueOnce(mockServerMember);
      mockChannelRepo.find.mockResolvedValueOnce(mockChannels);
      // Act
      const result = await service.findAll(serverId, userId);
      // Assertion
      expect(result).toEqual(plainToInstance(ChannelResponseDto, mockChannels));
      expect(mockChannelRepo.find).toHaveBeenCalledWith({
        where: { serverId },
      });
      expect(mockServerMemberRepo.findOne).toHaveBeenCalledWith({
        where: { serverId, userId },
      });
      expect(mockServerRepo.findOne).toHaveBeenCalledWith({
        where: { id: serverId },
      });
    });
  });

  describe('findOne 테스트', () => {
    const serverId = 1;
    const channelId = 1;
    const userId = 1;
    const mockServer = {
      id: serverId,
      name: '서버1',
      ownerId: userId,
    } as Server;
    const mockServerMember = {
      id: 1,
      serverId,
      userId,
    } as ServerMember;
    const mockChannel = {
      id: channelId,
      name: '채널1',
      serverId,
    } as Channel;
    it('서버가 존재하지 않으면 notFound ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(null);
      // Act
      try {
        await service.findOne(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_FOUND,
        );
      }
    });
    it('서버에 가입된 멤버가 아니라면 notMember ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.findOne(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_MEMBER,
        );
      }
    });
    it('채널이 없으면 notFound ChannelException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValueOnce(mockServerMember);
      mockChannelRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.findOne(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ChannelException);
        expect((error as ChannelException).getResponse()).toEqual(
          ChannelError.NOT_FOUND,
        );
      }
    });
    it('채널 조회에 올바르게 성공하면 ChannelResponseDto를 반환한다', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockServerMemberRepo.findOne.mockResolvedValueOnce(mockServerMember);
      mockChannelRepo.findOne.mockResolvedValueOnce(mockChannel);
      // Act
      const result = await service.findOne(serverId, channelId, userId);
      // Assert
      expect(result).toEqual(plainToInstance(ChannelResponseDto, mockChannel));
      expect(mockServerRepo.findOne).toHaveBeenCalledWith({
        where: { id: serverId },
      });
      expect(mockServerMemberRepo.findOne).toHaveBeenCalledWith({
        where: { serverId, userId },
      });
      expect(mockChannelRepo.findOne).toHaveBeenCalledWith({
        where: { id: channelId },
      });
    });
  });
  describe('update 테스트', () => {
    const serverId = 1;
    const channelId = 1;
    const userId = 1;
    const mockServer = {
      id: serverId,
      name: '서버1',
      ownerId: userId,
    } as Server;
    const mockChannel = {
      id: channelId,
      name: '채널1',
      serverId,
    } as Channel;
    const updateChannelDto = {
      name: '채널2',
    };
    it('서버가 존재하지 않으면 notFound ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(null);
      // Act
      try {
        await service.update(serverId, channelId, userId, updateChannelDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_FOUND,
        );
      }
    });
    it('서버 소유자가 아니면 forbidden ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      const mockServer = {
        id: serverId,
        name: '서버1',
        ownerId: 2,
      } as Server;
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      // Act, Assertion
      try {
        await service.update(serverId, channelId, userId, updateChannelDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.FORBIDDEN,
        );
      }
    });
    it('채널이 존재하지 않으면 notFound ChannelException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockChannelRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.update(serverId, channelId, userId, updateChannelDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ChannelException);
        expect((error as ChannelException).getResponse()).toEqual(
          ChannelError.NOT_FOUND,
        );
      }
    });
    it('채널 업데이트에 성공하면 channelResponseDto를 반환한다', async () => {
      // Arrange
      const updatedChannel = {
        ...mockChannel,
        ...updateChannelDto,
      };
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockChannelRepo.findOne.mockResolvedValueOnce(mockChannel);
      mockChannelRepo.save.mockResolvedValueOnce(updatedChannel);
      // Act
      const result = await service.update(
        serverId,
        channelId,
        userId,
        updateChannelDto,
      );
      // Assertion
      expect(result).toEqual(
        plainToInstance(ChannelResponseDto, updatedChannel),
      );
      expect(mockServerRepo.findOne).toHaveBeenCalledWith({
        where: { id: serverId },
      });
      expect(mockChannelRepo.findOne).toHaveBeenCalledWith({
        where: { id: channelId },
      });
      expect(mockChannelRepo.save).toHaveBeenCalledWith(updatedChannel);
    });
  });
  describe('remove 테스트', () => {
    const serverId = 1;
    const channelId = 1;
    const userId = 1;
    const mockServer = {
      id: serverId,
      name: '서버1',
      ownerId: userId,
    } as Server;
    const mockChannel = {
      id: channelId,
      name: '채널1',
      serverId,
    } as Channel;
    it('서버가 존재하지 않으면 NotFound ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.remove(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.NOT_FOUND,
        );
      }
    });
    it('서버 소유자가 아니면 Forbidden ServerException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      const userId = 2;
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      // Act, Assertion
      try {
        await service.remove(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ServerException);
        expect((error as ServerException).getResponse()).toEqual(
          ServerError.FORBIDDEN,
        );
      }
    });
    it('채널이 존재하지 않으면 NotFound ChannelException이 발생한다', async () => {
      expect.assertions(2);
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockChannelRepo.findOne.mockResolvedValueOnce(null);
      // Act, Assertion
      try {
        await service.remove(serverId, channelId, userId);
      } catch (error) {
        expect(error).toBeInstanceOf(ChannelException);
        expect((error as ChannelException).getResponse()).toEqual(
          ChannelError.NOT_FOUND,
        );
      }
    });
    it('채널 삭제에 성공하면 채널 id를 반환한다', async () => {
      // Arrange
      mockServerRepo.findOne.mockResolvedValueOnce(mockServer);
      mockChannelRepo.findOne.mockResolvedValueOnce(mockChannel);
      mockChannelRepo.softRemove.mockResolvedValueOnce(mockChannel);
      // Act
      const result = await service.remove(serverId, channelId, userId);
      // Assertion
      expect(result).toBe(channelId);
      expect(mockServerRepo.findOne).toHaveBeenCalledWith({
        where: { id: serverId },
      });
      expect(mockChannelRepo.findOne).toHaveBeenCalledWith({
        where: { id: channelId },
      });
      expect(mockChannelRepo.softRemove).toHaveBeenCalledWith(mockChannel);
    });
  });
});
