import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  MaxLength,
  MinLength,
  Min,
  Max,
} from 'class-validator';

export class MentorProfileDto {
  @IsNotEmpty({ message: 'ID użytkownika jest wymagane' })
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą' })
  user_id: number;

  @IsNotEmpty({ message: 'Opis o sobie jest wymagany' })
  @IsString({ message: 'Opis o sobie musi być tekstem' })
  @MinLength(50, { message: 'Opis o sobie musi mieć minimum 50 znaków' })
  @MaxLength(5000, { message: 'Opis o sobie nie może przekraczać 5000 znaków' })
  about_me: string;

  @IsNotEmpty({ message: 'Specjalizacja jest wymagana' })
  @IsString({ message: 'Specjalizacja musi być tekstem' })
  @MaxLength(255, { message: 'Specjalizacja nie może przekraczać 255 znaków' })
  specialization: string;

  @IsNotEmpty({ message: 'Lata doświadczenia są wymagane' })
  @IsNumber({}, { message: 'Lata doświadczenia musi być liczbą' })
  @Min(0, { message: 'Lata doświadczenia nie mogą być ujemne' })
  @Max(50, { message: 'Lata doświadczenia nie mogą przekraczać 50 lat' })
  years_of_experience: number;

  @IsOptional()
  @IsString({ message: 'Obecne stanowisko musi być tekstem' })
  @MaxLength(255, {
    message: 'Obecne stanowisko nie może przekraczać 255 znaków',
  })
  current_position?: string;

  @IsOptional()
  @IsString({ message: 'Lokalizacja musi być tekstem' })
  @MaxLength(255, { message: 'Lokalizacja nie może przekraczać 255 znaków' })
  location?: string;

  // === OBSZARY WIEDZY I EKSPERTYZA ===
  @IsOptional()
  @IsArray({ message: 'Obszary ekspertyzy muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy obszar ekspertyzy musi być tekstem' })
  expertise_areas?: string[];

  @IsOptional()
  @IsArray({ message: 'Branże muszą być tablicą' })
  @IsString({ each: true, message: 'Każda branża musi być tekstem' })
  industries?: string[];

  @IsOptional()
  @IsArray({ message: 'Umiejętności muszą być tablicą' })
  @IsString({ each: true, message: 'Każda umiejętność musi być tekstem' })
  skills?: string[];

  @IsOptional()
  @IsArray({ message: 'Technologie muszą być tablicą' })
  @IsString({ each: true, message: 'Każda technologia musi być tekstem' })
  technologies?: string[];

  // === PROFIL MENTORSKI ===
  @IsOptional()
  @IsArray({ message: 'Grupa docelowa musi być tablicą' })
  @IsString({ each: true, message: 'Każda grupa docelowa musi być tekstem' })
  target_audience?: string[];

  @IsOptional()
  @IsArray({ message: 'Tematy mentoringu muszą być tablicą' })
  @IsString({ each: true, message: 'Każdy temat mentoringu musi być tekstem' })
  mentoring_topics?: string[];

  // === USTAWIENIA PROFILU ===
  @IsOptional()
  @IsString({ message: 'Bio musi być tekstem' })
  @MaxLength(200, { message: 'Bio nie może przekraczać 200 znaków' })
  bio?: string;
}
