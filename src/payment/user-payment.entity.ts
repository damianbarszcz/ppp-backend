import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user_payments')
export class UserPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.profile)
  user: User;

  @Column()
  user_id: number;

  @Column({ nullable: true })
  mentor_id: number;

  @Column()
  price_id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column()
  status: string;

  @Column()
  subscription_type: string;

  @Column({ type: 'timestamp with time zone', nullable: true })
  current_period_start: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  current_period_end: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  canceled_at: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
