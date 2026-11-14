
import { supabase } from '../config/supabase.js';
import {
    CreateNewsDto,
    UpdateNewsDto
} from '../validators/newsValidator.js';

// Получить опубликованные новости с поиском и фильтрами
export const getAllNews = async (
    search?: string,
    categoryId?: number,
    year?: number
) => {
    let query = supabase
        .from('news')
        .select('*')
        .eq('is_published', true);

    // Поиск по названию новости
    if (search) {
        query = query.ilike('title', `%${search}%`);
    }

    // Фильтр по категории
    if (categoryId !== undefined) {
        query = query.eq('category_id', categoryId);
    }

    // Архив новостей за выбранный год
    if (year !== undefined) {
        const startDate = `${year}-01-01T00:00:00.000Z`;
        const endDate = `${year + 1}-01-01T00:00:00.000Z`;

        query = query
            .gte('published_at', startDate)
            .lt('published_at', endDate);
    }

    const { data, error } = await query
        .order('published_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
};

// Получить все новости, включая черновики (для админки)
export const getAllNewsForAdmin = async () => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return data;
};

// Получить только опубликованную новость по ID
export const getNewsById = async (id: number) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Получить опубликованную новость по slug
export const getNewsBySlug = async (slug: string) => {
    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Создать новость
export const createNews = async (news: CreateNewsDto) => {
    const { data, error } = await supabase
        .from('news')
        .insert(news)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
};

// Обновить новость
export const updateNews = async (
    id: number,
    news: UpdateNewsDto
) => {
    const { data, error } = await supabase
        .from('news')
        .update({
            ...news,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Удалить новость
export const deleteNews = async (id: number) => {
    const { data, error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Опубликовать новость
export const publishNews = async (id: number) => {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('news')
        .update({
            is_published: true,
            published_at: now,
            updated_at: now
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Снять новость с публикации
export const unpublishNews = async (id: number) => {
    const { data, error } = await supabase
        .from('news')
        .update({
            is_published: false,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

// Получить категории новостей
export const getNewsCategories = async () => {
    const { data, error } = await supabase
        .from('news_categories')
        .select('*')
        .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    return data;
};

// Создать категорию
export const createNewsCategory = async (name: string) => {
    const { data, error } = await supabase
        .from('news_categories')
        .insert({ name })
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
};

// Удалить категорию
export const deleteNewsCategory = async (id: number) => {
    const { data, error } = await supabase
        .from('news_categories')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};
