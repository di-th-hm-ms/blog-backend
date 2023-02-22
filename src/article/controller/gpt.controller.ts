import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of, switchMap, map } from 'rxjs';
import { ArticleIF, MediaIF, MediaPost, TagIF, ArticleTranslationIF, LanguageIF, GptProperties } from '../model/article.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../service/s3.service';
import { MediaService } from '../service/media.service';
import { mergeMap, catchError, finalize } from 'rxjs';
import { GptService } from '../service/gpt.service';

@Controller('gpt/api')
export class GptController {
    constructor(
        private gptService: GptService
    ) {}

    @Post()
    generateWithString(@Body() input: GptProperties): Observable<any> {
        return this.gptService.generate(input);
    }

    @Post('sum')
    sumUp(@Body() input: GptProperties): Observable<any> {
        return this.gptService.sumUp(input);
    }
}
