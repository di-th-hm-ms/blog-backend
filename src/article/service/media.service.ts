import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../entities/article.entity';
import { MediaIF } from '../model/article.interface';
import { Repository } from 'typeorm';
import { switchMap } from 'rxjs/operators';
import slugify from 'slugify';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
    ) {}
    // Media
    createMedia(mediaIF: MediaIF): Observable<MediaIF> {
        return from(this.mediaRepository.save(mediaIF));
    }

    getMedia(id: number): Observable<MediaIF[]> {
        return from(this.mediaRepository.findBy({ article_id: id }));
    }
}
