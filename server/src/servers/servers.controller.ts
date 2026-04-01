import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
// import Request from 'express'
// 위와 같이 쓰면 export = e 가 allowSyntheticDefaultImports 옵션 때문에 e 함수를 Request라는 이름으로 가져오게 됨.
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  create(
    @CurrentUser() user: JwtPayload,
    @Body() createServerDto: CreateServerDto,
  ) {
    return this.serversService.create(user.sub, createServerDto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtPayload) {
    return this.serversService.findAll(user.sub);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtPayload, @Param('id') id: number) {
    return this.serversService.findOne(id, user.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: number,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    return this.serversService.update(id, user.sub, updateServerDto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtPayload, @Param('id') id: number) {
    return this.serversService.remove(id, user.sub);
  }

  @Post('join/:inviteCode')
  join(
    @CurrentUser() user: JwtPayload,
    @Param('inviteCode') inviteCode: string,
  ) {
    return this.serversService.join(inviteCode, user.sub);
  }
}
