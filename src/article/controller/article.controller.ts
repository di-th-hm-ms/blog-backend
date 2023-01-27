import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ArticleIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api-text')
export class ArticleController {
  constructor(private readonly service: ArticleService) {}

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
      return this.service.create(articleIF);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() articleIF: ArticleIF) {
      if(!articleIF.title || !articleIF.body) throw new Error("Invalid arguments");
      return this.service.update(id, articleIF);
  }
  @Delete(':id')
  delete(@Param('id') id: number) {
      return this.service.delete(id);
  }
}
