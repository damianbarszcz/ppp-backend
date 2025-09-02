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

    // === NOWE KOLUMNY Z KREATORA POSZUKIWAŃ ===

    // Obszary współpracy (Stage 2)
    @Column({ type: 'json', nullable: true })
    collaboration_areas: string[];

    // Preferencje komunikacyjne (Stage 3)
    @Column({ type: 'varchar', length: 50, nullable: true })
    meeting_frequency: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    session_length: string;

    @Column({ type: 'json', nullable: true })
    time_preferences: string[];

    @Column({ type: 'json', nullable: true })
    work_styles: string[];

    // Kompetencje i doświadczenie (Stage 4)
    @Column({ type: 'varchar', length: 50, nullable: true })
    experience_level: string;

    @Column({ type: 'json', nullable: true })
    industries: string[];

    @Column({ type: 'json', nullable: true })
    required_skills: string[];

    @Column({ type: 'json', nullable: true })
    languages: string[];

    // Format współpracy (Stage 5)
    @Column({ type: 'varchar', length: 50, nullable: true })
    project_type: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    time_commitment: string;

    @Column({ type: 'json', nullable: true })
    work_modes: string[];

    @Column({ type: 'varchar', length: 50, nullable: true })
    budget_range: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    location: string;

    // Dopasowanie i oczekiwania (Stage 6)
    @Column({ type: 'json', nullable: true })
    priorities: string[];

    @Column({ type: 'json', nullable: true })
    personality_traits: string[];

    @Column({ type: 'json', nullable: true })
    specific_requirements: string[];

    @Column({ type: 'json', nullable: true })
    deal_breakers: string[];

    @Column({ type: 'text', nullable: true })
    additional_notes: string;

    // === DODATKOWE POLA DLA DOPASOWANIA ===

    // Czy użytkownik może być mentorem
    @Column({ type: 'boolean', default: false })
    is_available_as_mentor: boolean;

    // Czy szuka partnerów do zespołu
    @Column({ type: 'boolean', default: true })
    is_looking_for_partners: boolean;

    // Rating jako mentor (jeśli applicable)
    @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
    mentor_rating: number;

    // Liczba ukończonych projektów
    @Column({ type: 'integer', default: 0 })
    completed_projects: number;

    // Status dostępności
    @Column({ type: 'varchar', length: 50, default: 'active' }) // active, busy, inactive
    availability_status: string;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;
}