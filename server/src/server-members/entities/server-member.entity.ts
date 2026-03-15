import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Server } from '../../servers/entities/server.entity';

@Entity({ name: 'server_members' })
export class ServerMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Server)
  server: Server;

  @Column()
  serverId: number;

  @CreateDateColumn()
  joinedAt: Date;
}
