import { Entity, Column, PrimaryGeneratedColumn,  OneToOne, JoinColumn,   OneToMany, CreateDateColumn, UpdateDateColumn,  } from 'typeorm';
import {UserProfile} from "./user-profile.entity";
import {Follower} from "../follower/follower.entity";
import {Article} from "../article/article.entity";
import {MentorProfile} from "../mentor-profile/mentor-profile.entity";

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

    @Column({ default: 0 })
    password_length: number;

    @OneToOne(() => UserProfile, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile: UserProfile;

    @OneToMany(() => Follower, follower => follower.followedUser)
    followers: Follower[];

    @OneToMany(() => Follower, follower => follower.follower)
    following: Follower[];

    @OneToMany(() => Article, article => article.mentor)
    articles: Article[];

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}