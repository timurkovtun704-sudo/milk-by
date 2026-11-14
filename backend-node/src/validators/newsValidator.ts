
export interface News {
    id: number;
    category_id: number | null;
    title: string;
    slug: string;
    content: string;
    image_url: string | null;
    published_at: string | null;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateNewsDto {
    category_id?: number | null;
    title: string;
    slug: string;
    content: string;
    image_url?: string | null;
    published_at?: string | null;
    is_published?: boolean;
}

export type UpdateNewsDto = Partial<CreateNewsDto>;

export interface NewsCategory {
    id: number;
    name: string;
    created_at: string;
}
