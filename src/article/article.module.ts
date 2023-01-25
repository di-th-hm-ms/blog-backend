import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleController } from './controller/article.controller';
import { ArticleService } from './service/article.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity]),
    ],
    controllers: [ArticleController],
    providers: [ArticleService]
})
export class ArticleModule {}
