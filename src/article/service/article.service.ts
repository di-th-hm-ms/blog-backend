import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, Media, Tag, ArticleTag } from '../entities/article.entity';
import { ArticleIF, TagIF } from '../model/article.interface'
import { Repository } from 'typeorm';
import { switchMap } from 'rxjs/operators';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(ArticleTag)
        private readonly articleTagRepository: Repository<ArticleTag>
    ) {}

    // generate slug and put it into Interface
    create(articleIF: ArticleIF): Observable<ArticleIF> {
        const date = new Date();
        articleIF.created_at = date;
        articleIF.updated_at = date;
        return this.generateSlug(articleIF.title).pipe(
            switchMap((slug: string) => {
                articleIF.slug = slug;
                return from(this.articleRepository.save(articleIF));
            })
        )
    }

    generateSlug(str: string): Observable<string> {
        return of(slugify(str));
    }

    findAll(): Observable<ArticleIF[]> {
        return from(this.articleRepository.find());
    }

    findOne(id: number): Observable<ArticleIF> {
        return from(this.articleRepository.findOneById(id));
        // from(this.articleRepository.findOneById(id)).subscribe(
        //     (data: ArticleIF) => {
        //         data.body
        //     }
        // )
    }


    update(id: number, articleIF: ArticleIF): Observable<ArticleIF> {
        console.log(articleIF.body);
        articleIF.updated_at = new Date();
        return this.generateSlug(articleIF.title).pipe(
            switchMap((slug: string) => {
                articleIF.slug = slug;
                return from(this.articleRepository.update(id, articleIF)).pipe(
                switchMap(() => this.articleRepository.findOneById(id)),
                // map(article => article),
                // catchError(err => of({ err }))
                );
            })
        );
    }

    delete(id: number): Observable<any> {
        return from(this.articleRepository.delete(id));
    }

    // tag
    findTags(): Observable<TagIF[]> {
        return from(this.tagRepository.find());
    }

    createTag(tagIF: TagIF): Observable<TagIF> {
        // insert new one into tag
        return from(this.tagRepository.save(tagIF));
    }

    // article_tag
    attachTag(article_id: number, tag_id: number): Observable<any> {
        // article_id and tag_id
        return of(this.articleTagRepository.save({
            article_id: article_id,
            tag_id: tag_id
        }))
    }

    detachTagByTagId(id: number) {
        // delete article_tag where both ids are corresponded.
        return of(this.articleTagRepository.delete({tag_id: id}))
    }

    detachTagByArticleId(id: number) {
        // delete article_tag where both ids are corresponded.
        return of(this.articleTagRepository.delete({article_id: id}))
    }

    findArticleTagsByTag(tagId: number): Observable<ArticleTag[]> {
        return from(this.articleTagRepository.findBy({ tag_id: tagId }));
    }
}
