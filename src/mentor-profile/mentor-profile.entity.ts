import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('mentor-profile')
export class MentorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.mentorProfile)
  user: User;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  about_me: string;

  @Column({ type: 'varchar', length: 255 })
  specialization: string;

  @Column({ type: 'integer' })
  years_of_experience: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  current_position: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'json' })
  expertise_areas: string[];

  @Column({ type: 'json' })
  target_audience: string[];

  @Column({ type: 'json' })
  mentoring_topics: string[];

  @Column({ type: 'json' })
  industries: string[];

  @Column({ type: 'json' })
  skills: string[];

  @Column({ type: 'text', nullable: true })
  additional_notes: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
