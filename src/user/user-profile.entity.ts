import { Entity, Column, PrimaryGeneratedColumn,  OneToOne, JoinColumn,    CreateDateColumn, UpdateDateColumn,  } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column()
    username: string;

    @Column()
    user_avatar_color: string;

    @Column({ type: 'float', nullable: true })
    mentor_subscribe_price: number;

    @Column({ type: 'text', nullable: true })
    biogram: string;

    @OneToOne(() => User, (user) => user.profile)
    user: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}