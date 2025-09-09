import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsEmail,
  MaxLength,
  MinLength,
  IsIn,
  IsUrl,
} from 'class-validator';

export class ProspectorProfileDto {
  @IsNotEmpty({ message: 'ID użytkownika jest wymagane' })
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą' })
  user_id: number;

  @IsNotEmpty({ message: 'Opis o sobie jest wymagany' })
  @IsString({ message: 'Opis o sobie musi być tekstem' })
  @MinLength(50, { message: 'Opis o sobie musi mieć minimum 50 znaków' })
  @MaxLength(5000, { message: 'Opis o sobie nie może przekraczać 5000 znaków' })
  about_me: string;

  // === PODSTAWOWE INFORMACJE ===
  @IsOptional()
  @IsEmail({}, { message: 'Nieprawidłowy format email' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Specjalizacja musi być tekstem' })
  @MaxLength(255, { message: 'Specjalizacja nie może przekraczać 255 znaków' })
  specialization?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL portfolio musi być prawidłowy' })
  @MaxLength(500, { message: 'URL portfolio nie może przekraczać 500 znaków' })
  portfolio_url?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL LinkedIn musi być prawidłowy' })
  @MaxLength(500, { message: 'URL LinkedIn nie może przekraczać 500 znaków' })
  linkedin_url?: string;

  @IsOptional()
  @IsString({ message: 'Lokalizacja musi być tekstem' })
  @MaxLength(255, { message: 'Lokalizacja nie może przekraczać 255 znaków' })
  location?: string;

  // === OBSZARY WSPÓŁPRACY ===
  @IsOptional()
  @IsArray({ message: 'Obszary współpracy muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy obszar współpracy musi być tekstem' })
  collaboration_areas?: string[];

  // === PREFERENCJE KOMUNIKACYJNE ===
  @IsOptional()
  @IsString({ message: 'Częstotliwość spotkań musi być tekstem' })
  @IsIn(['daily', 'few-times-week', 'weekly', 'bi-weekly', 'monthly'], {
    message: 'Nieprawidłowa częstotliwość spotkań',
  })
  meeting_frequency?: string;

  @IsOptional()
  @IsString({ message: 'Długość sesji musi być tekstem' })
  @IsIn(['30min', '1hour', '2hours', 'flexible'], {
    message: 'Nieprawidłowa długość sesji',
  })
  session_length?: string;

  @IsOptional()
  @IsArray({ message: 'Preferencje czasowe muszą być tablicą' })
  @IsString({
    each: true,
    message: 'Każda preferencja czasowa musi być tekstem',
  })
  time_preferences?: string[];

  @IsOptional()
  @IsArray({ message: 'Style pracy muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy styl pracy musi być tekstem' })
  work_styles?: string[];

  // === KOMPETENCJE I DOŚWIADCZENIE ===
  @IsOptional()
  @IsString({ message: 'Poziom doświadczenia musi być tekstem' })
  @IsIn(['junior', 'mid', 'senior', 'expert', 'any'], {
    message: 'Nieprawidłowy poziom doświadczenia',
  })
  experience_level?: string;

  @IsOptional()
  @IsArray({ message: 'Branże muszą być tablicą' })
  @IsString({ each: true, message: 'Każda branża musi być tekstem' })
  industries?: string[];

  @IsOptional()
  @IsArray({ message: 'Wymagane umiejętności muszą być tablicą' })
  @IsString({ each: true, message: 'Każda umiejętność musi być tekstem' })
  required_skills?: string[];

  @IsOptional()
  @IsArray({ message: 'Języki muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy język musi być tekstem' })
  languages?: string[];

  // === FORMAT WSPÓŁPRACY ===
  @IsOptional()
  @IsString({ message: 'Typ projektu musi być tekstem' })
  @IsIn(['long-term', 'short-term', 'one-time', 'startup', 'consulting'], {
    message: 'Nieprawidłowy typ projektu',
  })
  project_type?: string;

  @IsOptional()
  @IsString({ message: 'Zaangażowanie czasowe musi być tekstem' })
  @IsIn(
    ['full-time', 'part-time', 'project-based', 'consultations', 'flexible'],
    {
      message: 'Nieprawidłowe zaangażowanie czasowe',
    },
  )
  time_commitment?: string;

  @IsOptional()
  @IsArray({ message: 'Tryby pracy muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy tryb pracy musi być tekstem' })
  work_modes?: string[];

  @IsOptional()
  @IsString({ message: 'Zakres budżetowy musi być tekstem' })
  @IsIn(['up-to-50', '50-100', '100-200', '200-plus', 'negotiable'], {
    message: 'Nieprawidłowy zakres budżetowy',
  })
  budget_range?: string;

  // === DOPASOWANIE I OCZEKIWANIA ===
  @IsOptional()
  @IsArray({ message: 'Priorytety muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy priorytet musi być tekstem' })
  priorities?: string[];

  @IsOptional()
  @IsArray({ message: 'Cechy osobowości muszą być tablicą' })
  @IsString({ each: true, message: 'Każda cecha osobowości musi być tekstem' })
  personality_traits?: string[];

  @IsOptional()
  @IsArray({ message: 'Specyficzne wymagania muszą być tablicą' })
  @IsString({ each: true, message: 'Każde wymaganie musi być tekstem' })
  specific_requirements?: string[];

  @IsOptional()
  @IsArray({ message: 'Deal breakers muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy deal breaker musi być tekstem' })
  deal_breakers?: string[];

  @IsOptional()
  @IsString({ message: 'Dodatkowe uwagi muszą być tekstem' })
  @MaxLength(2000, {
    message: 'Dodatkowe uwagi nie mogą przekraczać 2000 znaków',
  })
  additional_notes?: string;

  // === USTAWIENIA PROFILU ===
  @IsOptional()
  @IsString({ message: 'Status dostępności musi być tekstem' })
  @IsIn(['active', 'busy', 'inactive'], {
    message: 'Nieprawidłowy status dostępności',
  })
  availability_status?: string;

  @IsOptional()
  @IsArray({ message: 'Preferowane narzędzia muszą być tablicą' })
  @IsString({ each: true, message: 'Każde narzędzie musi być tekstem' })
  preferred_tools?: string[];

  @IsOptional()
  @IsArray({ message: 'Osiągnięcia muszą być tablicą' })
  @IsString({ each: true, message: 'Każde osiągnięcie musi być tekstem' })
  achievements?: string[];

  @IsOptional()
  @IsArray({ message: 'Dostępne dni muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy dzień musi być tekstem' })
  available_days?: string[];

  @IsOptional()
  @IsString({ message: 'Strefa czasowa musi być tekstem' })
  @MaxLength(50, { message: 'Strefa czasowa nie może przekraczać 50 znaków' })
  timezone?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Maksymalna liczba projektów musi być liczbą' })
  max_concurrent_projects?: number;
}
