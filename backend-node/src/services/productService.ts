
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
        .from('products')
        .select('category')
        .not('category', 'is', null);

    if (error) throw new Error(error.message);

    return [...new Set(data.map(item => item.category).filter(Boolean))];
};
