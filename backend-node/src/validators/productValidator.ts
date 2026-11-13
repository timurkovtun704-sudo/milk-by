export interface Product {
    id: number;
    name: string;
    description: string;
    image_url: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateProductDto {
    name: string;
    description: string;
    image_url: string;
    category: string;
    is_active: boolean;
}

export type UpdateProductDto = Partial<CreateProductDto>;