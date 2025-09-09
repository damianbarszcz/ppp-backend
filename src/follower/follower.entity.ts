import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('followers')
@Unique(['user_id', 'mentor_id'])
@Index(['mentor_id'])
@Index(['user_id'])
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mentor_id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'mentor_id' })
  followedUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  follower: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
