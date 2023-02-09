import { Controller, Get, Post, Put, Delete, Request, Body, Param, UploadedFile } from '@nestjs/common';
import { Observable, of, switchMap, map } from 'rxjs';
import { ArticleIF, MediaIF, MediaPost, TagIF, TagPost } from '../model/article.interface';
import { ArticleService } from '../service/article.service';
import { ArticleEntity } from '../entities/article.entity';

@Controller('tags')
export class TagController {
  constructor(private readonly service: ArticleService,
  ) {}
  // tag
  @Get()
  findTags(): Observable<any> {
      return this.service.findTags();
  }

  @Post()
  createTag(@Body() tagIF: TagIF): Observable<any> {
      if (!tagIF.name) throw new Error("tag: parameter is not enough")
      return this.service.createTag(tagIF);
  }

  @Post('attach')
//   attachTag(@Body() article_id: number, tag_id: number): any {
  attachTag(@Body() data: TagPost): any {
      for (const tag_id of data.tag_ids) {
          if (!data.article_id || !tag_id) continue;
          this.service.attachTag(data.article_id, tag_id);
      }
  }
}
