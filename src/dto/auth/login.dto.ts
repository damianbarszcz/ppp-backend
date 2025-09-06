import {IsEmail, IsNotEmpty} from 'class-validator';

export class LoginDto {
    @IsEmail({}, { message: 'Podany adres email jest nieprawidłowy.' })
    @IsNotEmpty({ message: 'Musisz podać adres email.' })
    email: string;

    @IsNotEmpty({ message: 'Musisz podać hasło.' })
    password: string;
}