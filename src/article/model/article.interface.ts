export interface ArticleIF {
    id?: number;
    title: string;
    body: string;
    summary: string;
    created_at?: Date;
    updated_at?: Date;
    category_id?: number
    slug?: string;
    header_image?: string;
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
export interface TagPost {
    article_id: number
    tag_ids: number[]
}
