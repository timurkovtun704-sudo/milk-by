
import { useEffect, useState } from "react";

import type {
  NewsArticle,
  NewsCategory,
} from "../types/news";

import {
  getNewsCategories,
  getNewsList,
} from "../services/newsService";

interface UseNewsDataResult {
  articles: readonly NewsArticle[];
  categories: readonly NewsCategory[];
  isLoading: boolean;
  error: string | null;
}

export function useNewsData(): UseNewsDataResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [categories, setCategories] = useState<NewsCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadNewsData() {
      setIsLoading(true);
      setError(null);

      const [articlesResult, categoriesResult] =
        await Promise.allSettled([
          getNewsList(),
          getNewsCategories(),
        ]);

      if (!isActive) {
        return;
      }

      if (articlesResult.status === "fulfilled") {
        setArticles(articlesResult.value);
      } else {
        setArticles([]);
        setError(
          articlesResult.reason instanceof Error
            ? articlesResult.reason.message
            : "Не удалось загрузить новости"
        );
      }

      if (categoriesResult.status === "fulfilled") {
        setCategories(categoriesResult.value);
      } else {
        setCategories([]);
      }

      setIsLoading(false);
    }

    void loadNewsData();

    return () => {
      isActive = false;
    };
  }, []);

  return {
    articles,
    categories,
    isLoading,
    error,
  };
}
