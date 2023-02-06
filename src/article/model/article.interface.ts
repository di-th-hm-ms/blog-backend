export interface ArticleIF {
    id?: number;
    title: string;
    body: string;
    summary: string;
    created_at?: Date;
    updated_at?: Date;
    // category: Category;
    category_id?: number
    slug?: string;
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
    article_id: number
}
