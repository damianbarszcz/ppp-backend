import { IsString, IsNotEmpty, MinLength, MaxLength,  IsNumber } from 'class-validator';

export class CreateTeamDto {
    @IsString({ message: 'Nazwa zespołu musi być tekstem' })
    @IsNotEmpty({ message: 'Nazwa zespołu jest wymagana' })
    @MinLength(3, { message: 'Nazwa zespołu musi mieć co najmniej 3 znaki' })
    @MaxLength(100, { message: 'Nazwa zespołu nie może być dłuższa niż 100 znaków' })
    title: string;

    @IsString({ message: 'Opis musi być tekstem' })
    @IsNotEmpty({ message: 'Opis zespołu jest wymagany' })
    @MinLength(10, { message: 'Opis zespołu musi mieć co najmniej 10 znaków' })
    @MaxLength(500, { message: 'Opis zespołu nie może być dłuższy niż 500 znaków' })
    description: string;

    @IsNumber({}, { message: 'ID użytkownika musi być liczbą' })
    user_id: number;
}