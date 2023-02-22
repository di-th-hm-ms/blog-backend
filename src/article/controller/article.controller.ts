import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of, switchMap, map } from 'rxjs';
import { ArticleIF, MediaIF, MediaPost, TagIF, ArticleTranslationIF, LanguageIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity, ArticleTranslation } from '../entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../service/s3.service';
import { MediaService } from '../service/media.service';
import { mergeMap, catchError, finalize } from 'rxjs';

@Controller('api')
export class ArticleController {
  constructor(private readonly service: ArticleService,
              private readonly s3: S3Service,
              private readonly mediaService: MediaService,
  ) {}

  @Get(':langId')
  findAll(@Param('langId') langId: number): Observable<ArticleIF[]> {
        // - Todo
        return this.service.findAll().pipe(
            switchMap((articles: ArticleIF[]) => {
                return this.service.findAllTranslationsBy({language_id: langId}).pipe(
                    switchMap((translations: ArticleTranslationIF[]) => {
                        const res = this.service.bsArticleWithTranslation(articles, translations);
                        return res
                    })
                )
            })
        )
  }

  // Auto-increment ID -> Index
  @Get(':id/lang/:langId')
  findOne(@Param('id') id: number, @Param('langId') langId: number): Observable<ArticleIF> {
    console.log(id, langId);
    return this.service.findOne(id).pipe(
        switchMap((article: ArticleIF) => {
            return this.service.findOneTranslation(id, langId).pipe(
                switchMap((translation: ArticleTranslationIF) => {
                    article.translation = translation;
                    return this.s3.getTextFile(article.translation.body).pipe(
                        map(data => {
                            article.translation.body = new TextDecoder().decode(new Uint8Array(data));
                            return article;
                        }),
                        catchError((error: any) => {
                            console.error(error);
                            return error(`Failed to get text file for article translation ${article.translation.id}`);
                        })
                    );
                }),
                switchMap((article: ArticleIF) => {
                    return of(article);
                })
            );
        })
    );
}

  @Post()
  async create(@Body()articleIF: ArticleIF) {
      console.log(articleIF)
      // Todo title -> generate blog
      if(!articleIF.translation ||
        !articleIF.translation.title ||
        //  !articleIF.translation.body ||
        //  !articleIF.translation.article_id ||
        //  !articleIF.translation.language_id ||
         !articleIF.category_id) throw new Error("title and body are required field!");
      // uniqueCheck
      const cnt = await this.service.exist({ title: articleIF.translation.title });
      if (cnt) throw new Error('This article already exists');
      // Todo generate an article based on LangId per a request.
      return this.s3.uploadText(articleIF).pipe(
      mergeMap((val: any) => {
        // after uploading as a text file, change the body into the key of the object.
        articleIF.translation.body = `article-bodies/${articleIF.translation.language_id}/${articleIF.translation.title}.md`;

        return this.service.create(articleIF).pipe(
          mergeMap(
              (data: ArticleIF) => {
                  return of(data);
          }),
          catchError(
              (error: Error) => {
                  console.log(error);
                  // TODO - delete it from s3;
                  return this.s3.deleteText(`${articleIF.translation.language_id}/${articleIF.translation.title}`).pipe(
                    mergeMap(_ => of('s3 upload error ends and cancel this process'))
                  );
              }
          )
      );
      }),
      catchError((err: Error) => {
          console.log("s3 upload err");
          return of(err);
      }),
      finalize(() => {
          return of("Status: 200");
      }));

  }

  @Put(':id')
  update(@Param('id') id: number, @Body() articleIF: ArticleIF) {
      if(!articleIF.translation.title || !articleIF.translation.body) throw new Error("Invalid arguments");
      return this.service.update(id, articleIF);
  }
  @Delete(':id')
  async delete(@Param('id') id: number, @Body() title: string) {
      // delete it from bucket
      await this.s3.deleteText(title);
      return this.service.delete(id);
  }

  // Media
  @Post('media')
  createMedia(@Body() media: MediaPost): any {
      if (!media.article_id) throw new Error("parameters are not enough");
      for (const info of media.info) {
          if (!info.key_part) throw new Error("key_part error");
      }
      let mediaIF: MediaIF = {
          key_part: '',
          article_id: 0
      };
      mediaIF.article_id = media.article_id
      for (const info of media.info) {
          mediaIF.key_part = info.key_part;
          mediaIF.type = info.type;
          this.mediaService.createMedia(mediaIF).pipe
          (mergeMap((data: MediaIF) => {
              console.log(data);
              return of(data);
          }),
          catchError((err: Error) => { return of(err); }))
      }
  }

  // tag
  @Get('tags')
  findTags(): Observable<any> {
      return this.service.findTags();
  }

  @Post('tags')
  createTag(@Body() tagIF: TagIF): Observable<any> {
      if (!tagIF.name) throw new Error("tag: parameter is not enough")
      return this.service.createTag(tagIF);
  }

  @Post('tags/attach')
  attachTag(@Body() article_id: number, tag_id: number) {
      if (!article_id || !tag_id) throw new Error("tag: parameters are not enough");
      return this.service.attachTag(article_id, tag_id);
  }

  // language
  @Get('languages/all')
  findAllLanguage(): Observable <LanguageIF[]> {
      return this.service.getLanguages();
  }
}
