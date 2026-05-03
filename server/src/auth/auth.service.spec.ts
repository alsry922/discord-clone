import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

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
    it('회원가입이 성공하면 ', () => {});
    expect(service).toBeDefined();
  });
});
