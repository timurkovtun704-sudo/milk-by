
import { useMemo, useState } from "react";

import type {
  NewsArticle,
  NewsCategory,
  NewsSortOption,
} from "../types/news";

import {
  filterNewsArticles,
  getNewsArchiveYears,
  getNewsCategoriesInUse,
  sortNewsArticles,
} from "../utils/news";

const EMPTY_ARTICLES: readonly NewsArticle[] = [];
const EMPTY_CATEGORIES: readonly NewsCategory[] = [];

const INITIAL_VISIBLE_COUNT = 9;
const VISIBLE_STEP = 9;

interface UseNewsOptions {
  articles?: readonly NewsArticle[];
  categories?: readonly NewsCategory[];
}

export function useNews({
  articles = EMPTY_ARTICLES,
  categories = EMPTY_CATEGORIES,
}: UseNewsOptions = {}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [year, setYear] = useState("");

  const [sort, setSort] =
    useState<NewsSortOption>("newest");

  const [visibleCount, setVisibleCount] = useState(
    INITIAL_VISIBLE_COUNT
  );

  const availableCategories = useMemo(
    () => getNewsCategoriesInUse(articles, categories),
    [articles, categories]
  );

  const archiveYears = useMemo(
    () => getNewsArchiveYears(articles),
    [articles]
  );

  const filteredArticles = useMemo(() => {
    const result = filterNewsArticles(
      articles,
      categories,
      search,
      categoryId,
      year
    );

    return sortNewsArticles(result, sort);
  }, [
    articles,
    categories,
    search,
    categoryId,
    year,
    sort,
  ]);

  const visibleArticles = useMemo(
    () => filteredArticles.slice(0, visibleCount),
    [filteredArticles, visibleCount]
  );

  const hasActiveCriteria =
    search.trim().length > 0 ||
    categoryId.length > 0 ||
    year.length > 0;

  const canLoadMore =
    visibleCount < filteredArticles.length;

  function changeSearch(value: string) {
    setSearch(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeCategory(value: string) {
    setCategoryId(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeYear(value: string) {
    setYear(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function changeSort(value: NewsSortOption) {
    setSort(value);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function clearFilters() {
    setSearch("");
    setCategoryId("");
    setYear("");
    setSort("newest");
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }

  function loadMore() {
    setVisibleCount((current) => current + VISIBLE_STEP);
  }

  return {
    articles,
    categories,

    search,
    setSearch: changeSearch,

    categoryId,
    setCategoryId: changeCategory,

    year,
    setYear: changeYear,

    sort,
    setSort: changeSort,

    availableCategories,
    archiveYears,

    filteredArticles,
    visibleArticles,

    totalCount: articles.length,
    resultCount: filteredArticles.length,

    hasActiveCriteria,
    canLoadMore,

    clearFilters,
    loadMore,
  };
}
