import { Injectable } from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, Media, Tag, ArticleTag, ArticleTranslation, Language } from '../entities/article.entity';
import { ArticleIF, TagIF, ArticleTranslationIF, LanguageIF, GptReqBody, GptReqOptions } from '../model/article.interface'
import { Repository } from 'typeorm';
import { switchMap, map } from 'rxjs/operators';
import slugify from 'slugify';
// import openai from 'openai';
import { HttpService } from '@nestjs/axios'

// const openAI = require('openai');

@Injectable()
export class GptService {

    model = "text-davinci-003";
    model2 = "davinci";
    temperature = 0;
    maxTokens = 1080;
    url = "https://api.openai.com/v1/completions"

    constructor(
        private httpService: HttpService
    ) {}

    generate(input: any): Observable<any> {
        console.log(input)
        return this.gpt(`Generate an article about ${input.prompt} with markdown format, which has within 150 words in ${input.language} a bit casually.`)
    }

    sumUp(input: any): Observable<any> {
        console.log(input)
        return this.gpt(`Sum up these sentences below without markdown within 50 words in ${input.language}. ${input.prompt}`);
    }

    gpt(prompt: string): Observable<any> {
        const requestBody: GptReqBody = {
            'model': this.model,
            'prompt': prompt,
            'temperature': this.temperature,
            'max_tokens': this.maxTokens
        }
        const requestOptions: GptReqOptions = {
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_SECRET}`,
            },
        }
        return this.httpService.post(this.url, requestBody, requestOptions).pipe(map((response) => {
            console.log(response)
            const replacer = (key, value) => {
                // If the value is an object that has a circular reference, return null
                if (typeof value === 'object' && value !== null) {
                  if (seen.has(value)) {
                    return null;
                  }
                  seen.add(value);
                }
                return value;
              };
              const seen = new WeakSet();
              const json = JSON.stringify(response.data, replacer);
              console.log(json)
              const choices = JSON.parse(json).choices;
              return { choice: choices[0].text };
        }))
        // openAI.Completion.create(requestBody).then((response) => {
        // console.log(response.choices[0].text);
        // }).catch((error) => {
        // console.error(error);
        // });
    }
}
