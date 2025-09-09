import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../user/user.entity';

@Unique(['user_id', 'contact_user_id'])
@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  creator: User;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted'],
    default: 'pending',
  })
  status: 'pending' | 'accepted';

  @Column()
  contact_user_id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'contact_user_id' })
  contact_user: User;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
