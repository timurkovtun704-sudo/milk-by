
import { supabase } from '../config/supabase.js';
import { CreateProductDto, UpdateProductDto } from '../validators/productValidator.js';


export const getAllProducts = async () => {
    const { data, error } = await supabase
        .from('products')
        .select('*');

    if (error) throw new Error(error.message);

    return data;
};


export const getProductById = async (id: number) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};

export const deleteProduct = async (id: number) => {
    const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)
        .select('id')
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};


export const createProduct = async (product: CreateProductDto) => {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

    if (error) {
        throw error;
    }
    return data;
};


export const updateProduct = async (
    id: number,
    product: UpdateProductDto
) => {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .maybeSingle();

    if (error) throw new Error(error.message);

    return data;
};


export const getCategories = async () => {
    const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('id', { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(item => item.name);
};

export const createCategory = async (name: string) => {
    const { data, error } = await supabase
        .from('categories')
        .insert({ name })
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const renameCategory = async (
    id: number,
    newName: string
) => {
    const { data, error } = await supabase
        .rpc('rename_category', {
            p_category_id: id,
            p_new_name: newName
        });

    if (error) throw error;

    return data;
};

export const deleteCategory = async (id: number) => {
    // Находим категорию
    const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
        .eq('id', id)
        .maybeSingle();

    if (categoryError) throw categoryError;

    if (!category) {
        return { notFound: true };
    }

    // Проверяем, есть ли товары в этой категории
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category', category.name)
        .limit(1);

    if (productsError) throw productsError;

    if (products && products.length > 0) {
        return { inUse: true };
    }

    // Удаляем категорию
    const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

    if (deleteError) throw deleteError;

    return { deleted: true };
};