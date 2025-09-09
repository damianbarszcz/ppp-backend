import { IsNotEmpty } from 'class-validator';

export class ContactDto {
  @IsNotEmpty({ message: 'Nazwa użytkownika jest wymagana' })
  username: string;

  @IsNotEmpty({ message: 'ID użytkownika jest wymagane' })
  user_id: number;
}
