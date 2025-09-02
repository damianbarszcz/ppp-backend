import {IsArray, IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';

export class ProspectorProfileDto {
    @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
    @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
    user_id: number;

    @IsNotEmpty({ message: 'Pole "O mnie" jest wymagane' })
    @IsString({ message: 'Pole "O mnie" musi być tekstem' })
    @MaxLength(2000, { message: 'Opis "O mnie" nie może przekraczać 2000 znaków' })
    about_me: string;

    // === NOWE POLA Z KREATORA ===

    @IsOptional()
    @IsArray()
    collaboration_areas?: string[];

    @IsOptional()
    @IsString()
    @IsIn(['daily', 'few-times-week', 'weekly', 'bi-weekly', 'monthly'])
    meeting_frequency?: string;

    @IsOptional()
    @IsString()
    @IsIn(['30min', '1hour', '2hours', 'flexible'])
    session_length?: string;

    @IsOptional()
    @IsArray()
    time_preferences?: string[];

    @IsOptional()
    @IsArray()
    work_styles?: string[];

    @IsOptional()
    @IsString()
    @IsIn(['junior', 'mid', 'senior', 'expert', 'any'])
    experience_level?: string;

    @IsOptional()
    @IsArray()
    industries?: string[];

    @IsOptional()
    @IsArray()
    required_skills?: string[];

    @IsOptional()
    @IsArray()
    languages?: string[];

    @IsOptional()
    @IsString()
    @IsIn(['long-term', 'short-term', 'one-time', 'startup', 'consulting'])
    project_type?: string;

    @IsOptional()
    @IsString()
    @IsIn(['full-time', 'part-time', 'project-based', 'consultations', 'flexible'])
    time_commitment?: string;

    @IsOptional()
    @IsArray()
    work_modes?: string[];

    @IsOptional()
    @IsString()
    @IsIn(['up-to-50', '50-100', '100-200', '200-plus', 'negotiable'])
    budget_range?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsArray()
    priorities?: string[];

    @IsOptional()
    @IsArray()
    personality_traits?: string[];

    @IsOptional()
    @IsArray()
    specific_requirements?: string[];

    @IsOptional()
    @IsArray()
    deal_breakers?: string[];

    @IsOptional()
    @IsString()
    additional_notes?: string;

    // === DODATKOWE POLA ===

    @IsOptional()
    @IsBoolean()
    is_available_as_mentor?: boolean;

    @IsOptional()
    @IsBoolean()
    is_looking_for_partners?: boolean;

    @IsOptional()
    @IsNumber()
    mentor_rating?: number;

    @IsOptional()
    @IsNumber()
    completed_projects?: number;

    @IsOptional()
    @IsString()
    @IsIn(['active', 'busy', 'inactive'])
    availability_status?: string;
}