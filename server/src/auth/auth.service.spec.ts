import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AuthException } from './exceptions/auth.exception';
import { AuthError } from './constants/auth-error-code.constant';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));
describe('AuthService', () => {
  let service: AuthService;
  let mockUserRepo: DeepMocked<Repository<User>>;
  let mockJwtService: DeepMocked<JwtService>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === getRepositoryToken(User)) {
          return createMock<Repository<User>>();
        }
        if (token === JwtService) {
          return createMock<JwtService>();
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
    mockUserRepo = module.get<DeepMocked<Repository<User>>>(
      getRepositoryToken(User),
    );
    mockJwtService = module.get<DeepMocked<JwtService>>(JwtService);
  });

  describe('register 테스트', () => {
    const createAuthDto = {
      email: 'test@test.com',
      username: 'test',
      password: '1234',
    };
    it('이미 가입된 회원이라면 Conflict 예외가 발생한다.', async () => {
      // Arrange
      const mockUser = { id: 1 } as User;
      mockUserRepo.findOne.mockResolvedValueOnce(mockUser);
      // Act
      try {
        await service.register(createAuthDto);
      } catch (error) {
        expect(error).toBeInstanceOf(AuthException);
        expect((error as AuthException).getResponse()).toEqual(
          AuthError.CONFLICT,
        );
      }
    });
    it('회원가입이 정상적으로 완료되었다면 아무것도 반환하지 않는다', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: createAuthDto.email,
        nickname: createAuthDto.username,
        password: 'hashed',
      } as User;

      mockUserRepo.findOne.mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashed');
      mockUserRepo.create.mockReturnValueOnce(mockUser);
      mockUserRepo.save.mockResolvedValueOnce(mockUser);

      // Act
      const result = await service.register(createAuthDto);

      // Assert
      expect(result).toBeUndefined();
      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: createAuthDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(createAuthDto.password, 10);
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: createAuthDto.email,
        nickname: createAuthDto.username,
        password: 'hashed',
      });
      expect(mockUserRepo.save).toHaveBeenCalledWith(mockUser);
    });
  });
});
