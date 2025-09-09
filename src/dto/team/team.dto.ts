import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateTeamDto {
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą' })
  user_id: number;

  @MinLength(3, { message: 'Nazwa zespołu musi mieć co najmniej 3 znaki' })
  @MaxLength(100, {
    message: 'Nazwa zespołu nie może być dłuższa niż 100 znaków',
  })
  @IsString({ message: 'Nazwa zespołu musi być tekstem' })
  @IsNotEmpty({ message: 'Nazwa zespołu jest wymagana' })
  title: string;

  @MinLength(10, { message: 'Opis zespołu musi mieć co najmniej 10 znaków' })
  @MaxLength(500, {
    message: 'Opis zespołu nie może być dłuższy niż 500 znaków',
  })
  @IsString({ message: 'Opis musi być tekstem' })
  @IsNotEmpty({ message: 'Opis zespołu jest wymagany' })
  description: string;

  @IsArray({ message: 'Członkowie muszą być tablicą' })
  @IsOptional()
  @IsNumber({}, { each: true, message: 'ID członka musi być liczbą' })
  members?: number[];
}
