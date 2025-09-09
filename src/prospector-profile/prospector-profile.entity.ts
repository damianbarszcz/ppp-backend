import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('prospector_profile')
export class ProspectorProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.prospectorProfile)
  user: User;

  @Column()
  user_id: number;

  @Column({ type: 'text' })
  about_me: string;

  @Column({ type: 'varchar', length: 255 })
  specialization: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'json' })
  collaboration_areas: string[];

  @Column({ type: 'json'})
  work_modes: string[];

  @Column({ type: 'varchar', length: 50})
  experience_level: string;

  @Column({ type: 'json'})
  industries: string[];

  @Column({ type: 'json', nullable: true  })
  required_skills: string[];

  @Column({ type: 'varchar', length: 50 })
  project_type: string;

  @Column({ type: 'varchar', length: 50 })
  time_commitment: string;

  @Column({ type: 'varchar', length: 50, nullable: true  })
  budget_range: string;

  @Column({ type: 'varchar', length: 50, default: 'active' })
  availability_status: string;

  @Column({ type: 'text', nullable: true })
  additional_notes: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
