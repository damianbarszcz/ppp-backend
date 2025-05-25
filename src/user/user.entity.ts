import { Entity, Column, PrimaryGeneratedColumn,  OneToOne, JoinColumn,    CreateDateColumn, UpdateDateColumn,  } from 'typeorm';
import {UserProfile} from "./user-profile.entity";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ length: 255 })
    password: string;

    @Column({ length: 1 })
    account_type: string;

    @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile: UserProfile;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}