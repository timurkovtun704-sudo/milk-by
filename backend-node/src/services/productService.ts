import { supabase } from '../config/supabase.js';
import { CreateProductDto} from '../validators/productValidator.js';

export const getAllProducts = async () => {
    const {data, error} =  await supabase
        .from('products')
        .select('*')

    if (error) throw new Error(error.message);
    return data;
};

export const getProductById = async (id: number) => {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw new Error(error.message);
    return data;
}

export const createProduct =  async (product: CreateProductDto) => {
    const { error, data } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single()
    
    if (error) throw new Error(error.message);
    return data;
}