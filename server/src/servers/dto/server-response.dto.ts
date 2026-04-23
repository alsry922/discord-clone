import { Expose } from 'class-transformer';

export class ServerResponseDto {
  @Expose() id: number;
  @Expose() name: string;
  @Expose() icon: string;
  @Expose() inviteCode: string;
  @Expose() ownerId: number;
  @Expose() createdAt: Date;
}
