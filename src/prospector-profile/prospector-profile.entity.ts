import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToOne} from 'typeorm';
import {User} from "../user/user.entity";

@Entity('prospector_profile')
export class ProspectorProfile  {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, (user) => user.profile)
    user: User;

    @Column()
    user_id: number;

    @Column({ type: 'text'})
    about_me: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}