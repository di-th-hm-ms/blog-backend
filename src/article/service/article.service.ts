import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, Media, Tag, ArticleTag, ArticleTranslation, Language } from '../entities/article.entity';
import { ArticleIF, TagIF, ArticleTranslationIF, LanguageIF } from '../model/article.interface'
import { Repository } from 'typeorm';
import { switchMap, map } from 'rxjs/operators';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(ArticleTranslation)
        private readonly translationRepository: Repository<ArticleTranslation>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(ArticleTag)
        private readonly articleTagRepository: Repository<ArticleTag>,
        @InjectRepository(Language)
        private readonly languageRepository: Repository<Language>
    ) {}

    // generate slug and put it into Interface
    // create(articleIF: ArticleIF, languages: LanguageIF[]): any {
    create(articleIF: ArticleIF): any {
        const date = new Date();
        articleIF.created_at = date;
        articleIF.updated_at = date;
        return this.generateSlug(articleIF.translation.title).pipe(
            switchMap((slug: string) => {
                articleIF.translation.slug = slug;
                const translation: ArticleTranslationIF = articleIF.translation
                // you need to adapt to before where body is changed.
                if (!translation) return of(new Error('no translation error'));
                // Todo enのみを返す
                return from(this.articleRepository.save(articleIF)).pipe(
                    switchMap((savedArticle: ArticleIF) => {
                        translation.article_id = savedArticle.id;
                        return from(this.translationRepository.save(translation)).pipe(
                            switchMap((savedTranslation: ArticleTranslationIF) => {
                                savedArticle.translation = savedTranslation;
                                return of(savedArticle);
                            })
                        )
                    })
                );
                return from(this.translationRepository.save(translation)).pipe(
                    switchMap(() => {
                        return this.articleRepository.save(articleIF)
                    })
                )
            })
        )
    }

    // Todo
    generateMultilingualArticle() {
        // GPT API
        console.log('chat gpt')
        // markdown気泡は変えずに言語だけ変える
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

    // for unique title
    async exist(content: any) {
        // { title : '' }
        return this.translationRepository.countBy(content);
    }


    update(id: number, articleIF: ArticleIF): Observable<ArticleIF> {
        console.log(articleIF.translation.body);
        articleIF.updated_at = new Date();
        return this.generateSlug(articleIF.translation.title).pipe(
            switchMap((slug: string) => {
                articleIF.translation.slug = slug;
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

    // translation(content)
    findAllTranslationsBy(dic: any): Observable<any> {
        return from(this.translationRepository.findBy(dic));
    }
    findOneTranslation(articleId: number, langId: number): Observable<any> {
        return from(this.translationRepository.findOneBy({
            article_id: articleId,
            language_id: langId
        }));
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

    bsArticleWithTranslation(articles: ArticleIF[], translations: ArticleTranslationIF[]): Observable<ArticleIF[]> {
        const result: ArticleIF[] = [];
        articles.sort((a, b) => a.id! - b.id!); // Sort articles by id for binary search
        let left: number, right: number, mid: number;
        for (const translation of translations) {
            left = 0, right = articles.length-1, mid = 0;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                if (articles[mid].id! === translation.article_id) {
                    articles[mid].translation = translation;
                    result.push(articles[mid]);
                    break; // Found the article, break out of the loop
                }
                else if (articles[mid].id! < translation.article_id) {
                    left = mid + 1;
                }
                else {
                    right = mid - 1;
                }
            }
        }
        return of(result);
    }

    // language
    getLanguages(): Observable<LanguageIF[]> {
        return from(this.languageRepository.find());
    }
}
