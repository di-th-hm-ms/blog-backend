import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from '../entities/article.entity';
import { ArticleIF } from '../model/article.interface'
import { Repository } from 'typeorm';
import { switchMap } from 'rxjs/operators';
import slugify from 'slugify';
import { S3 } from 'aws-sdk';

@Injectable()
export class S3Service {
    private readonly s3 = new S3({
        accessKeyId: process.env.S3_ACCESS_KEY_LOCAL,
        secretAccessKey: process.env.S3_SECRET_KEY_LOCAL,
        region: process.env.S3_REGION,
    });
    constructor(
    ) {}

    // Image
    async uploadImage(image: any) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            // Key: `${Date.now()}-${image.originalname}`,
            Key: `articleImages/${image.originalname}`,
            Body: image.buffer,
            ContentType: image.mimetype,
        };
        try {
            await this.s3.upload(params).promise();
        } catch (error) {
            console.log(error);
        }
    }

    async getImage(key: string) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `articleImages/${key}`,
        };
        return this.s3.getObject(params).promise();
        // return image.Body;
    }

    // Text

    // getTextFile(title: string): Observable<any> {
    getTextFile(body: string): Observable<any> {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            // Key: `article-bodies/${title}.md`,
            Key: body,
        }
        return from(this.s3.getObject(params).createReadStream());
    }

    uploadText(articleIF: ArticleIF): Observable<any> {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `article-bodies/${articleIF.title}.md`,
            Body: articleIF.body
        }
        // try {
        //     await this.s3.upload(params).promise();
        // } catch (error) {
        //     console.log(error);
        // }
        return from(this.s3.upload(params).promise());
    }

    deleteText(title: string) {
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: 'article-bodies/' + title + '.md',
        }
        return from(this.s3.deleteObject(params).promise());
    }
}
