import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import {Team} from "./team.entity";

@Entity('team_details')
export class TeamDetails {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => Team)
    @JoinColumn()
    team: Team;

    @Column({ type: 'varchar', length: 128 })
    description: string;

    @Column('simple-array')
    tags: string[];

    @Column({ type: 'varchar', length: 128 })
    team_avatar_color: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}