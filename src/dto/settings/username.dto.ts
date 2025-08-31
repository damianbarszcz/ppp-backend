import { IsNotEmpty, Length, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class UsernameDto {
    @Type(() => Number)
    @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
    @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
    user_id: number;

    @Length(3, 30, { message: 'Nazwa użytkownika musi mieć od 3 do 30 znaków.' })
    @IsNotEmpty({ message: 'Nazwa użytkownika jest wymagana.' })
    @Matches(/^[a-zA-Z0-9_-]+$/, {
        message: 'Nazwa użytkownika może zawierać tylko litery, cyfry, podkreślenia i myślniki.'
    })
    username: string;
}