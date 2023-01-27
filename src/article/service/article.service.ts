import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleIF } from '../model/article.interface'
import { Repository } from 'typeorm';
import { switchMap } from 'rxjs/operators';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
    ) {}

    // generate slug and put it into Interface
    create(articleIF: ArticleIF): Observable<ArticleIF> {
        console.log(articleIF);
        console.log(articleIF.title);
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

    findOne(id: number): Observable<ArticleIF> {
        return from(this.articleRepository.findOneById(id));
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
}
