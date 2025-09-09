import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { NotificationModule } from '../notification/notification.module';
import { FollowerModule } from '../follower/follower.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    NotificationModule,
    FollowerModule,
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
  exports: [ArticleService],
})
export class ArticleModule {}
