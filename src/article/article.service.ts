import {ConflictException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './article.entity';
import { ArticleDto } from "../dto/article/article.dto";

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
    ) {}

    public async getMentorArticles(mentor_id: number): Promise<Article[]> {
        return await this.articleRepository.find({
            where: { mentor_id: mentor_id },
            order: { created_at: 'DESC' }
        });
    }

    public async createArticle(ArticleDto: ArticleDto): Promise<Article> {
        const { title, summary, content, content_type, thumbnail_url, user_id } = ArticleDto;

        await this.checkTitleExists(user_id, title);

        const article : Article = this.articleRepository.create({
            mentor_id: user_id,
            title,
            summary,
            content,
            content_type,
            thumbnail_url: thumbnail_url,
            slug: this.generateSlug(title),
            published_at: new Date()
        });

        return await this.articleRepository.save(article);
    }

    private async checkTitleExists(user_id: number, title: string): Promise<void> {
        const existingArticle = await this.articleRepository.findOne({
            where: {
                mentor_id: user_id,
                title: title
            }
        });

        if (existingArticle) {
            throw new ConflictException({
                success: false,
                errors: [{
                    field: 'title',
                    message: 'Artykuł o takim tytule już istnieje.'
                }]
            });
        }
    }

    private generateSlug(title: string): string {
        const base_slug : string = title
            .toLowerCase()
            .replace(/ł/g, 'l')
            .replace(/ą/g, 'a')
            .replace(/ę/g, 'e')
            .replace(/ó/g, 'o')
            .replace(/ś/g, 's')
            .replace(/ć/g, 'c')
            .replace(/ń/g, 'n')
            .replace(/ż/g, 'z')
            .replace(/ź/g, 'z')
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        const timestamp = Date.now();
        const timestamp_str = timestamp.toString();
        const max_base_length = 255 - timestamp_str.length - 1;

        const truncated_slug = base_slug.length > max_base_length
            ? base_slug.substring(0, max_base_length).replace(/-$/, '')
            : base_slug;

        return `${truncated_slug}-${timestamp}`;
    }
}