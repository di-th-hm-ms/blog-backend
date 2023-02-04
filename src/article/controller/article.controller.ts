import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of, switchMap, map } from 'rxjs';
import { ArticleIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../service/s3.service';

@Controller('api')
export class ArticleController {
  constructor(private readonly service: ArticleService,
              private readonly s3: S3Service
  ) {}

  @Get()
  findAll(): Observable<ArticleIF[]> {
        return this.service.findAll();
  }

  // Auto-increment ID -> Index
  @Get(':id')
  findOne(@Param('id') id: number): Observable<ArticleIF> {
    //   return this.service.findOne(id);
    //   return this.service.findOne(id).subscribe((article: ArticleIF) => this.s3.getTextFile(article.title));
    //   return this.service.findOne(id).pipe(
    //       switchMap((article: ArticleIF) => {
    //           this.s3.getTextFile(article.title).pipe(
    //               map((data: string) => {
    //               article.body = data;
    //               return article;
    //           }));
    //       }));
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
      // body -> s3.url
      // s3 -> db(err -> delete it from s3)
      this.s3.uploadText(articleIF).subscribe(
          (val: any) => {
            console.log(val);
            articleIF.body = `article-bodies/${articleIF.title}.md`;
            return this.service.create(articleIF).subscribe(
                (data: ArticleIF) => {
                    console.log(data);
                    return data;
                },
                (error: Error) => {
                    console.log(error);
                    // TODO - delete it from s3;
                    this.s3.deleteText(articleIF.title).subscribe(_ => {
                        return of('s3 upload error ends and cancel this process');
                    });
                }
            );
          },
          (err: Error) => {
            console.log("s3 upload err");
            return of(err);
          },
          () => {
              return of("Status: 200");
          });

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
}
