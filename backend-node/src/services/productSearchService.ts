import { supabase } from '../config/supabase.js';

export interface ProductSearchOptions {
    search?: string;

    category?: string;

    fatProcent?: number;

    weight?: string;

    storageConditions?: string;

    shelfLife?: string;

    energyValue?: string;

    itemsPerCase?: string;

    sortBy?: 'name' | 'created_at';

    order?: 'asc' | 'desc';

    page?: number;

    limit?: number;
}

export const searchProducts = async (
    options: ProductSearchOptions
) => {
    const {
        search,
        category,
        fatProcent,
        weight,
        storageConditions,
        shelfLife,
        energyValue,
        itemsPerCase,
        sortBy = 'name',
        order = 'asc',
        page = 1,
        limit = 12,
    } = options;

    const safePage = Math.max(1, page);

    const safeLimit = Math.min(
        100,
        Math.max(1, limit)
    );

    let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .eq('is_active', true);

    if (search?.trim()) {
        const value = search.trim().replace(/[,%()]/g, '');

        if (value) {
            query = query.ilike('name', `%${value}%`);
        }
    }

    if (category?.trim()) {
        query = query.eq('category', category.trim());
    }

    if (fatProcent !== undefined) {
        query = query.gte('fat_procent', fatProcent);
    }

    if (weight?.trim()) {
        query = query.eq('weight', weight.trim());
    }

    if (storageConditions?.trim()) {
        query = query.eq(
            'storage_conditions',
            storageConditions.trim()
        );
    }

    if (shelfLife?.trim()) {
        query = query.eq('shelf_life', shelfLife.trim());
    }

    if (energyValue?.trim()) {
        query = query.eq('energy_value', energyValue.trim());
    }

    if (itemsPerCase?.trim()) {
        query = query.eq(
            'items_per_case',
            itemsPerCase.trim()
        );
    }

    const from = (safePage - 1) * safeLimit;
    const to = from + safeLimit - 1;

    const { data, error, count } = await query
        .order(sortBy, {
            ascending: order === 'asc',
        })
        .range(from, to);

    if (error) {
        throw new Error(error.message);
    }

    return {
        products: data ?? [],
        total: count ?? 0,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(
            (count ?? 0) / safeLimit
        ),
    };
};