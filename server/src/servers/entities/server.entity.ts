import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity('servers')
export class Server extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ unique: true })
  inviteCode: string;

  @ManyToOne(() => User)
  owner: User;

  @Column()
  ownerId: number;
}
