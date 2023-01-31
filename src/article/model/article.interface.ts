export interface ArticleIF {
    id?: number;
    title: string;
    body: string;
    created_at?: Date;
    updated_at?: Date;
    // category: Category;
    category_id?: number
    slug?: string;
}

export interface Category {
    id?: number;
    name: string;
}
