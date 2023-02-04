import { Controller, Post, UseInterceptors, UploadedFile, Param, Get, Body, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, map } from 'rxjs';
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
      console.log("img upload start")
        await this.service.uploadImage(image);
  }

  @Get(':key')
  // downloadImage(@Param('key') key: string, @Res() res): Observable<any> {
  async downloadImage(@Param('key') key: string, @Res() res) {
      console.log(key)
      const image = await this.service.getImage(key);
      // res.contentType(image.ContentType);
      res.contentType('blob');
      res.send(image.Body);
  }

//   @Post('text-upload')
//   async uploadText(@Body() data: ArticleIF) {
//     if (data) {
//         await this.service.uploadText(data);
//         console.log('end uploadText')
//     }
//   }
}
