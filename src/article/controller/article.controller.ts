import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ArticleIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../service/s3.service';

@Controller('api-text')
export class ArticleController {
  constructor(private readonly service: ArticleService,
              private readonly s3: S3Service
  ) {}

  @Get()
  findAll(): string {
    return "findAll";
  }

  // Auto-increment ID -> Index
  @Get(':id')
  findOne(@Param('id') id: number): Observable<ArticleIF> {
      return this.service.findOne(id);
  }

  @Post()
  create(@Body()articleIF: ArticleIF): Observable<ArticleIF> {
      if(!articleIF.title || !articleIF.body) throw new Error("title and body are required field!");
      // body -> s3.url
      // s3 -> db(err -> delete it from s3)
      return this.service.create(articleIF);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() articleIF: ArticleIF) {
      if(!articleIF.title || !articleIF.body) throw new Error("Invalid arguments");
      return this.service.update(id, articleIF);
  }
  @Delete(':id')
  async delete(@Param('id') id: number, @Body() title: string) {
      // delete it from bucket
      await this.s3.deleteText(id, title);
      return this.service.delete(id);
  }
}
