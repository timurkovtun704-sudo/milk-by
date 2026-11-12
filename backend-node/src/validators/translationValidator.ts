export interface Translations{
    id: number;
    translation_key: string;
    language_code: string;
    translated_text: string;
    created_at: string;
    updated_at: string;
}

export interface CreateTranslationsDto {
    translation_key: string;
    language_code: string;
    translated_text: string;
}