import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerMembersService {
  create() {
    return 'This action adds a new serverMember';
  }

  findAll() {
    return `This action returns all serverMembers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serverMember`;
  }

  update(id: number) {
    return `This action updates a #${id} serverMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} serverMember`;
  }
}
