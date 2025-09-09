import { IsNotEmpty, MinLength, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class PasswordDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
  @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
  user_id: number;

  @IsNotEmpty({ message: 'Obecne hasło jest wymagane.' })
  currentPassword: string;

  @MinLength(8, { message: 'Nowe hasło musi mieć co najmniej 8 znaków.' })
  @IsNotEmpty({ message: 'Nowe hasło jest wymagane.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Hasło musi zawierać co najmniej: jedną małą literę, jedną wielką literę, jedną cyfrę i jeden znak specjalny.',
  })
  newPassword: string;
}
