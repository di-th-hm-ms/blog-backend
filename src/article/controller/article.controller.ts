import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of, switchMap, map } from 'rxjs';
import { ArticleIF, MediaIF, MediaPost, TagIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';
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

  @Get()
  findAll(): Observable<ArticleIF[]> {
        return this.service.findAll();
  }

  // Auto-increment ID -> Index
  @Get(':id')
  findOne(@Param('id') id: number): Observable<ArticleIF> {
    return this.service.findOne(id).pipe(
        switchMap((article: ArticleIF) =>
        //   this.s3.getTextFile(article.title).pipe(
          this.s3.getTextFile(article.body).pipe(
            map(data => {
                article.body = new TextDecoder().decode(new Uint8Array(data));
                return article;
            })
          )
        )
      );
  }

  @Post()
  create(@Body()articleIF: ArticleIF): any {
      if(!articleIF.title || !articleIF.body || !articleIF.category_id) throw new Error("title and body are required field!");
      return this.s3.uploadText(articleIF).pipe(
      mergeMap((val: any) => {
        console.log(val);
        articleIF.body = `article-bodies/${articleIF.title}.md`;
        return this.service.create(articleIF).pipe(
          mergeMap(
              (data: ArticleIF) => {
                console.log('----')
                console.log(data);
                return of(data);
          }),
          catchError(
            (error: Error) => {
              console.log(error);
              // TODO - delete it from s3;
              return this.s3.deleteText(articleIF.title).pipe(
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
      if(!articleIF.title || !articleIF.body) throw new Error("Invalid arguments");
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
          console.log("-------------")
          console.log("media")
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
}
