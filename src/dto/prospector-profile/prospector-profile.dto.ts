import {IsNotEmpty, IsNumber, IsString, MaxLength} from 'class-validator';

export class ProspectorProfileDto {
    @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
    @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
    user_id: number;

    @IsNotEmpty({ message: 'Pole "O mnie" jest wymagane' })
    @IsString({ message: 'Pole "O mnie" musi być tekstem' })
    @MaxLength(2000, { message: 'Opis "O mnie" nie może przekraczać 2000 znaków' })
    about_me: string;
}