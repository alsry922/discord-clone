import { Test, TestingModule } from '@nestjs/testing';
import { ServerMembersService } from './server-members.service';

describe('ServerMembersService', () => {
  let service: ServerMembersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerMembersService],
    }).compile();

    service = module.get<ServerMembersService>(ServerMembersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
