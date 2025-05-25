import {
    Entity,
    PrimaryGeneratedColumn,
    OneToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    BeforeInsert
} from 'typeorm';
import {TeamDetails} from "./team-details.entity";
import {User} from "../user/user.entity";

@Entity('teams')
export class Team {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ unique: true, type: 'varchar', length: 100 })
    title: string;

    @Column({ unique: true, type: 'varchar', length: 150 })
    slug: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    creator: User;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    @OneToOne(() => TeamDetails, teamDetails => teamDetails.team)
    team_details: TeamDetails;

    @BeforeInsert()
    generateSlug() {
        const baseSlug = this.title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');

        const uniqueCode = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

        this.slug = `${baseSlug}-#${uniqueCode}`;
    }
}