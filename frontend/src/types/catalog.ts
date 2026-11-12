
export type CatalogPrimitive = string | number | boolean | null;

export type CatalogAttributeValue =
  | CatalogPrimitive
  | readonly CatalogPrimitive[];

export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

export interface ProductSeoMetadata {
  title?: string | null;
  description?: string | null;
  canonicalUrl?: string | null;
}

export interface ProductPackaging {
  id: string;
  label: string;

  weight?: number | null;
  volume?: number | null;
  unit?: string | null;

  shelfLife?: string | null;
  imageUrl?: string | null;

  attributes?: Readonly<
    Record<string, CatalogAttributeValue>
  >;

  attributeLabels?: Readonly<
    Record<string, string>
  >;
}

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;

  description?: string | null;

  imageUrl?: string | null;
  images?: readonly ProductImage[];

  categoryId: string;

  keywords?: readonly string[];

  attributes?: Readonly<
    Record<string, CatalogAttributeValue>
  >;

  attributeLabels?: Readonly<
    Record<string, string>
  >;

  packagings?: readonly ProductPackaging[];

  publishedAt?: string | null;

  seo?: ProductSeoMetadata;
}

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
  parentId?: string | null;
}

export interface CatalogFilterOption {
  value: string | number | boolean;
  label: string;
}

export type CatalogFilterType =
  | "select"
  | "multi-select"
  | "boolean"
  | "range";

export interface CatalogFilterDefinition {
  id: string;
  key: string;
  label: string;
  type: CatalogFilterType;

  categoryIds?: readonly string[];

  options?: readonly CatalogFilterOption[];

  min?: number;
  max?: number;
  step?: number;

  unit?: string;
}

export interface CatalogNumberRange {
  min?: number;
  max?: number;
}

export type CatalogFilterSelection =
  | string
  | readonly string[]
  | boolean
  | CatalogNumberRange;

export type CatalogSortOption =
  | "name-asc"
  | "name-desc"
  | "newest";

export interface CategoryOption {
  category: ProductCategory;
  depth: number;
}
