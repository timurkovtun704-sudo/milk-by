
import { supabase } from '../config/supabase.js';

export interface ProductSearchOptions {
  search?: string;
  category?: string;
  fatContent?: number;
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
    fatContent,
    sortBy = 'name',
    order = 'asc',
    page = 1,
    limit = 12,
  } = options;

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));

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

  // Фильтр жирности подключается после добавления
  // столбца fat_content в таблицу products.
  if (fatContent !== undefined) {
    query = query.eq('fat_content', fatContent);
  }

  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  const { data, error, count } = await query
    .order(sortBy, { ascending: order === 'asc' })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  return {
    products: data ?? [],
    total: count ?? 0,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil((count ?? 0) / safeLimit),
  };
};
