import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Server } from '../../servers/entities/server.entity';
import { ChannelType } from '../enums/channel-type.enum';
import { BaseEntity } from '../../common/base.entity';

@Entity('channels')
export class Channel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // 기본값은 text가 된다.
  @Column({
    type: 'enum',
    enum: ChannelType,
    default: ChannelType.TEXT,
  })
  type: ChannelType;

  @ManyToOne(() => Server)
  server: Server;

  @Column()
  serverId: number;
}
