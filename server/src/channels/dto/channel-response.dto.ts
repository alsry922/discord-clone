import { Expose } from 'class-transformer';

export class ChannelResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() type: string;
  @Expose() serverId: number;
  @Expose() createdAt: Date;
}
