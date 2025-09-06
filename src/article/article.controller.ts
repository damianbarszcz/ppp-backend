import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    Post,
    Res,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { Response } from 'express';
import { ArticleDto } from "../dto/article/article.dto";
import { validate } from "class-validator";
import { plainToInstance } from 'class-transformer';

@Controller('articles')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) {}

    @Get('mentor/:mentorId')
    public async getMentorPosts(@Param('mentorId') mentorId: string, @Res() res: Response): Promise<any> {
        const posts  = await this.articleService.getMentorArticles(Number(mentorId));

        return res.status(HttpStatus.OK).json({
            success: true,
            data: posts
        });
    }

    @Post('create')
    public async createArticle(@Body() body: any, @Res() res: Response): Promise<any> {
        try {
            const dto = plainToInstance(ArticleDto, body);
            const errors = await validate(dto);

            if (errors.length > 0) {
                const formattedErrors = errors.map(error => ({
                    field: error.property,
                    message: Object.values(error.constraints || {})[0]
                }));

                return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
                    success: false,
                    errors: formattedErrors
                });
            }

            await this.articleService.createArticle(dto);

            return res.status(HttpStatus.CREATED).json({
                success: true,
                message: 'Twój artykuł został poprawnie utworzony.',
            });

        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });
        }
    }
}