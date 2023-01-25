import { Controller, Get, Post, Put, Delete, Request, Body, Param } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { ArticleIF } from '../model/article.interface';
import { ArticleService } from '../service/article.service';

@Controller()
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
    create(@Body()articleIF: ArticleIF, @Request() req): Observable<ArticleIF> {
        // ORMにによってSaveされた内容が帰ってくる。
        return this.service.create(articleIF);
    }
}
