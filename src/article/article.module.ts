import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, Media } from './entities/article.entity';
import { ArticleController } from './controller/article.controller';
import { ArticleService } from './service/article.service';
import { S3Service } from './service/s3.service';
import { ImagesController } from './controller/image.controller';
import { MediaService } from './service/media.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ArticleEntity, Media]),
    ],
    controllers: [
        ArticleController,
        ImagesController
    ],
    providers: [
        ArticleService,
        S3Service,
        MediaService
    ],
})
export class ArticleModule {}
