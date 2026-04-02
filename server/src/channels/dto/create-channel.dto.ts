import { ChannelType } from '../enums/channel-type.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({ example: '내 채널' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ChannelType, example: ChannelType.TEXT })
  @IsEnum(ChannelType)
  type: ChannelType;
}
