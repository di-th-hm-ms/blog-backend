import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './entities/article.entity';
import { ArticleController } from './controller/article.controller';
import { ArticleService } from './service/article.service';
import { S3Service } from './service/s3.service';
import { ImagesController } from './controller/image.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity]),
    ],
    controllers: [ArticleController, ImagesController],
    providers: [ArticleService, S3Service]
})
export class ArticleModule {}
