import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('servers/:serverId/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Post()
  create(
    @Param('serverId') serverId: number,
    @CurrentUser() currentUser: JwtPayload,
    @Body() createChannelDto: CreateChannelDto,
  ) {
    return this.channelsService.create(
      serverId,
      currentUser.sub,
      createChannelDto,
    );
  }

  @Get()
  findAll(
    @Param('serverId') serverId: number,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.channelsService.findAll(serverId, currentUser.sub);
  }

  @Get(':id')
  findOne(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id') id: number,
    @Param('serverId') serverId: number,
  ) {
    return this.channelsService.findOne(serverId, id, currentUser.sub);
  }

  @Patch(':id')
  update(
    @CurrentUser() currentUser: JwtPayload,
    @Param('id') id: number,
    @Param('serverId') serverId: number,
    @Body() updateChannelDto: UpdateChannelDto,
  ) {
    return this.channelsService.update(
      serverId,
      id,
      currentUser.sub,
      updateChannelDto,
    );
  }

  @Delete(':id')
  remove(
    @CurrentUser() currentUser: JwtPayload,
    @Param('serverId') serverId: number,
    @Param('id') id: number,
  ) {
    return this.channelsService.remove(serverId, id, currentUser.sub);
  }
}
