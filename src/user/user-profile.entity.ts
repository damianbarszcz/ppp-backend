import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    surname: string;

    @Column({ nullable: true })
    phone: string;

    @OneToOne(() => User, (user) => user.profile)
    user: User;
}