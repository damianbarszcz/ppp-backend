import {
  IsNotEmpty,
  IsNumber,
  IsEnum,
  Length,
  IsUrl,
  Matches,
} from 'class-validator';

export class ArticleDto {
  @IsNumber({}, { message: 'ID użytkownika musi być liczbą.' })
  @IsNotEmpty({ message: 'ID użytkownika jest wymagane.' })
  user_id: number;

  @Length(3, 150, { message: 'Tytuł musi mieć od 3 do 150 znaków.' })
  @IsNotEmpty({ message: 'Tytuł jest wymagany.' })
  title: string;

  @Length(25, 255, { message: 'Streszczenie musi mieć od 25 do 255 znaków.' })
  @IsNotEmpty({ message: 'Streszczenie jest wymagane.' })
  summary: string;

  @Length(500, undefined, {
    message: 'Treść artykułu musi mieć minimum 500 znaków.',
  })
  @IsNotEmpty({ message: 'Treść artykułu jest wymagana.' })
  content: string;

  @Length(1, 500, { message: 'Url grafiki musi mieć maksymalnie 500 znaków.' })
  @Matches(/^https:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i, {
    message:
      'URL grafiki musi być w formacie https:// i zawierać rozszerzenie obrazu (jpg, jpeg, png, gif, webp).',
  })
  @IsUrl({}, { message: 'URL grafiki musi być prawidłowym adresem URL.' })
  @IsNotEmpty({ message: 'URL grafiki jest wymagane.' })
  thumbnail_url?: string;

  @IsEnum(['free', 'paid'], {
    message: 'Typ treści może być tylko "free" lub "paid".',
  })
  content_type: 'free' | 'paid';
}
