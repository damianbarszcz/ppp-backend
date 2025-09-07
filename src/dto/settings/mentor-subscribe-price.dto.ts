import {IsNumber, IsNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';

export class MentorSubscribePriceDto {
    @Type(() => Number)
    @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
    user_id: number;

    @IsNotEmpty({ message: 'Pole Cena jest wymagane.' })
    mentor_subscribe_price: number;
}