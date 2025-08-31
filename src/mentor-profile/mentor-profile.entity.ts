import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import {User} from "../user/user.entity";

@Entity('mentor-profile')
export class MentorProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    mentor_id: number;

    @ManyToOne(() => User, user => user.mentor_profile)
    @JoinColumn({ name: 'mentor_id' })
    mentor_profile: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}