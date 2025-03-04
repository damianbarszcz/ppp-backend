import { Entity, Column, PrimaryGeneratedColumn,  OneToOne, JoinColumn  } from 'typeorm';
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
}