// Изображение новости
export interface NewsImage {
  url: string;
  alt: string;
  caption?: string | null;
}

// Блоки содержимого новости
export type NewsContentBlock =
  | {
      id: string;
      type: "paragraph";
      text: string;
    }
  | {
      id: string;
      type: "heading";
      text: string;
      level?: 2 | 3;
    }
  | {
      id: string;
      type: "quote";
      text: string;
      attribution?: string | null;
    }
  | {
      id: string;
      type: "image";
      image: NewsImage;
    };

// SEO-метаданные новости
export interface NewsSeoMetadata {
  title?: string | null;
  description?: string | null;
  h1?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  isIndexable?: boolean;
  isFollowable?: boolean;
}

// Категория новости
export interface NewsCategory {
  id: string;
  slug: string;
  name: string;
}

// Новость
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  summary?: string | null;
  publishedAt: string;
  categoryId?: string | null;
  coverImage?: NewsImage | null;
  content: readonly NewsContentBlock[];
  keywords?: readonly string[];
  relatedArticleIds?: readonly string[];
  seo?: NewsSeoMetadata;
}

// Варианты сортировки новостей
export type NewsSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

// Данные архивного года
export interface NewsArchiveYear {
  year: string;
  count: number;
}