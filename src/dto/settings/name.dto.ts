import { IsNotEmpty, Length, IsNumber, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class NameDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
  @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
  user_id: number;

  @Length(2, 50, { message: 'Imię musi mieć od 2 do 50 znaków.' })
  @IsNotEmpty({ message: 'Pole imię jest wymagane.' })
  @Matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, {
    message: 'Imię może zawierać tylko litery i spacje.',
  })
  name: string;

  @Length(2, 50, { message: 'Nazwisko musi mieć od 2 do 50 znaków.' })
  @IsNotEmpty({ message: 'Pole nazwisko jest wymagane.' })
  @Matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/, {
    message: 'Nazwisko może zawierać tylko litery, spacje i myślniki.',
  })
  surname: string;
}
