export interface ArticleIF {
    id?: number;
    translation?: ArticleTranslationIF
    created_at?: Date;
    updated_at?: Date;
    category_id?: number
    header_image?: string;
}

export interface ArticleTranslationIF {
    id?: number
    title: string;
    body: string;
    summary: string;
    slug?: string;
    article_id: number
    language_id: number
}

export interface LanguageIF {
    id?: number
    name: string
    language: string
}

export interface CategoryIF {
    id?: number;
    name: string;
}

export interface MediaPost {
    article_id: number
    info: {
        type: 'image' | 'video'
        key_part: string
    }[]
}
export interface MediaIF {
    id?: number;
    type?: 'image' | 'video';
    key_part: string;
    article_id: number;
}

export interface TagIF {
    id?: number;
    name: string;
    description?: string;
}
export interface ArticleTag {
    article_id: number
    tag_ids: number[]
}

export interface GptReqBody {
    model: string;
    prompt: string;
    temperature: number;
    max_tokens: number;
}

// export interface GptReqOptions {
//     method: 'POST';
//     headers: {
//         'Content-Type': string;
//         'Authorization': string;
//     }
//     payload?: string;
// }
export interface GptReqOptions {
    'headers': {
        'Content-Type': string;
        'Authorization': string;
    }
}

export interface GptProperties {
    prompt: string;
    language: string;
}
