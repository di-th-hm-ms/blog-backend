import { Controller, Post, UseInterceptors, UploadedFile, Param, Get, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3 } from 'aws-sdk';
import { ArticleIF } from '../model/article.interface';
import { S3Service } from '../service/s3.service';

@Controller('api-s3')
export class ImagesController {
//   private readonly s3 = new S3({
//     accessKeyId: process.env.S3_ACCESS_KEY_LOCAL,
//     secretAccessKey: process.env.S3_SECRET_KEY_LOCAL,
//     // region: process.env.S3_REGION,
//   });

    constructor(
        private service: S3Service
    ) {}

  @Post('img-upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() image) {
        await this.service.uploadImage(image);
  }

  @Get(':key')
  async downloadImage(@Param('key') key: string) {
    return this.service.getImage(key);
  }

//   @Post('text-upload')
//   async uploadText(@Body() data: ArticleIF) {
//     if (data) {
//         await this.service.uploadText(data);
//         console.log('end uploadText')
//     }
//   }
}
