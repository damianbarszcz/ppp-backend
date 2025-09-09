import { IsEmail, IsIn, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Podany adres email jest nieprawidłowy.' })
  @IsNotEmpty({ message: 'Musisz podać adres email.' })
  email: string;

  @IsNotEmpty({ message: 'Musisz podać hasło.' })
  password: string;

  @IsNotEmpty({ message: 'Podaj swoje imię.' })
  name: string;

  @IsNotEmpty({ message: 'Podaj swoje nazwisko.' })
  surname: string;

  @IsIn(['M', 'P'], { message: 'Nieprawidłowy typ konta.' })
  @IsNotEmpty({ message: 'Typ konta jest wymagany.' })
  account_type: string;
}
