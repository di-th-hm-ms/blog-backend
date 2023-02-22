import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, Media, Tag, ArticleTag, ArticleTranslation, Language } from './entities/article.entity';
import { ArticleController } from './controller/article.controller';
import { ArticleService } from './service/article.service';
import { S3Service } from './service/s3.service';
import { ImagesController } from './controller/image.controller';
import { MediaService } from './service/media.service';
import { TagController } from './controller/tag.controller';
import { GptService } from './service/gpt.service';
import { HttpModule } from '@nestjs/axios';
import { GptController } from './controller/gpt.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArticleEntity,
            ArticleTranslation,
            Language,
            Media,
            Tag,
            ArticleTag]),
            HttpModule,
    ],
    controllers: [
        ArticleController,
        ImagesController,
        TagController,
        GptController
    ],
    providers: [
        ArticleService,
        S3Service,
        MediaService,
        GptService
    ],
})
export class ArticleModule {}
