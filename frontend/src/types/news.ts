
export interface NewsImage {
  url: string;
  alt: string;
  caption?: string | null;
}

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

export interface NewsSeoMetadata {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
}

export interface NewsCategory {
  id: string;
  slug: string;
  name: string;
}

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

export type NewsSortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc";

export interface NewsArchiveYear {
  year: string;
  count: number;
}
