export interface Product {
    id: number;

    name: string;

    description: string | null;

    price?: number | null;

    image_url: string | null;

    category: string | null;

    fat_procent: number;

    weight: string;

    storage_conditions: string;

    shelf_life: string;

    energy_value: string;

    items_per_case: string;

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

    fat_procent: number;

    weight: string;

    storage_conditions: string;

    shelf_life: string;

    energy_value: string;

    items_per_case: string;
}

export type UpdateProductDto = Partial<CreateProductDto>;