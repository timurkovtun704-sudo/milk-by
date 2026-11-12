
import type {
  NewsArchiveYear,
  NewsArticle,
  NewsCategory,
  NewsSortOption,
} from "../types/news";

import type { Locale } from "../i18n/messages";

export function normalizeNewsText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

export function getNewsYear(
  publishedAt: string
): string | null {
  const date = new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return String(date.getFullYear());
}

function getArticleContentText(
  article: NewsArticle
): string {
  return article.content
    .map((block) => {
      if (block.type === "image") {
        return [
          block.image.alt,
          block.image.caption ?? "",
        ].join(" ");
      }

      return block.text;
    })
    .join(" ");
}

function getArticleCategoryName(
  article: NewsArticle,
  categories: readonly NewsCategory[]
): string {
  if (!article.categoryId) {
    return "";
  }

  return (
    categories.find(
      (category) => category.id === article.categoryId
    )?.name ?? ""
  );
}

function matchesNewsSearch(
  article: NewsArticle,
  categories: readonly NewsCategory[],
  query: string
): boolean {
  if (!query) {
    return true;
  }

  const searchableText = [
    article.title,
    article.summary ?? "",
    getArticleContentText(article),
    getArticleCategoryName(article, categories),
    ...(article.keywords ?? []),
  ].join(" ");

  return normalizeNewsText(searchableText).includes(query);
}

export function filterNewsArticles(
  articles: readonly NewsArticle[],
  categories: readonly NewsCategory[],
  search: string,
  categoryId: string,
  year: string
): NewsArticle[] {
  const query = normalizeNewsText(search);

  return articles.filter((article) => {
    if (
      categoryId &&
      article.categoryId !== categoryId
    ) {
      return false;
    }

    if (
      year &&
      getNewsYear(article.publishedAt) !== year
    ) {
      return false;
    }

    return matchesNewsSearch(
      article,
      categories,
      query
    );
  });
}

export function sortNewsArticles(
  articles: readonly NewsArticle[],
  sort: NewsSortOption
): NewsArticle[] {
  const result = [...articles];

  result.sort((a, b) => {
    if (sort === "title-asc") {
      return a.title.localeCompare(b.title);
    }

    if (sort === "title-desc") {
      return b.title.localeCompare(a.title);
    }

    const aDate = Date.parse(a.publishedAt);
    const bDate = Date.parse(b.publishedAt);

    const aValid = Number.isFinite(aDate);
    const bValid = Number.isFinite(bDate);

    if (!aValid && !bValid) {
      return a.title.localeCompare(b.title);
    }

    if (!aValid) {
      return 1;
    }

    if (!bValid) {
      return -1;
    }

    return sort === "newest"
      ? bDate - aDate
      : aDate - bDate;
  });

  return result;
}

export function getNewsArchiveYears(
  articles: readonly NewsArticle[]
): NewsArchiveYear[] {
  const counts = new Map<string, number>();

  for (const article of articles) {
    const year = getNewsYear(article.publishedAt);

    if (!year) {
      continue;
    }

    counts.set(year, (counts.get(year) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([year, count]) => ({
      year,
      count,
    }))
    .sort((a, b) => Number(b.year) - Number(a.year));
}

export function getNewsCategoriesInUse(
  articles: readonly NewsArticle[],
  categories: readonly NewsCategory[]
): NewsCategory[] {
  const usedCategoryIds = new Set(
    articles
      .map((article) => article.categoryId)
      .filter((id): id is string => Boolean(id))
  );

  return categories.filter((category) =>
    usedCategoryIds.has(category.id)
  );
}

export function getRelatedNewsArticles(
  currentArticle: NewsArticle,
  articles: readonly NewsArticle[],
  limit = 3
): NewsArticle[] {
  const relatedIds = currentArticle.relatedArticleIds ?? [];

  if (relatedIds.length === 0) {
    return [];
  }

  const articlesById = new Map(
    articles.map((article) => [
      article.id,
      article,
    ])
  );

  return relatedIds
    .map((id) => articlesById.get(id))
    .filter(
      (article): article is NewsArticle =>
        article !== undefined &&
        article.id !== currentArticle.id
    )
    .slice(0, limit);
}

export function formatNewsDate(
  publishedAt: string,
  locale: Locale
): string {
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    publishedAt
  );

  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3])
      )
    : new Date(publishedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localeMap: Record<Locale, string> = {
    ru: "ru-RU",
    be: "be-BY",
    en: "en-GB",
    zh: "zh-CN",
  };

  return new Intl.DateTimeFormat(localeMap[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
