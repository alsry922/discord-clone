import { ChannelType } from '../enums/channel-type.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ChannelType)
  type: ChannelType;
}
