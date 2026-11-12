export interface Product{
    id: number;
    name: string;
    description:string | null;
    price: number | null;
    image_url: string | null;
    category: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}


export interface CreateProductDto {
    name: string;
    description:string | null;
    price: number | null;
    image_url: string | null;
    category: string | null;
    is_active?: boolean;
}


export type UpdateProductDto = Partial<CreateProductDto>