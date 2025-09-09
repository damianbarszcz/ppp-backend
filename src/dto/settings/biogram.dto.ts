import { Length, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class BiogramDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
  user_id: number;

  @Length(0, 150, { message: 'Biogram może mieć maksymalnie 150 znaków.' })
  biogram: string;
}
