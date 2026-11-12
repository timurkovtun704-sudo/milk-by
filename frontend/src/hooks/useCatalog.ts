
import { useEffect, useMemo, useState } from "react";

import type {
  CatalogFilterDefinition,
  CatalogFilterSelection,
  CatalogProduct,
  CatalogSortOption,
  ProductCategory,
} from "../types/catalog";

import {
  filterCatalogProducts,
  getAvailableFilterDefinitions,
  getProductsInCategory,
  getSearchSuggestions,
  sortCatalogProducts,
} from "../utils/catalog";

const EMPTY_PRODUCTS: readonly CatalogProduct[] = [];
const EMPTY_CATEGORIES: readonly ProductCategory[] = [];
const EMPTY_FILTERS: readonly CatalogFilterDefinition[] = [];

interface UseCatalogOptions {
  products?: readonly CatalogProduct[];
  categories?: readonly ProductCategory[];
  filterDefinitions?: readonly CatalogFilterDefinition[];
}

export function useCatalog({
  products = EMPTY_PRODUCTS,
  categories = EMPTY_CATEGORIES,
  filterDefinitions = EMPTY_FILTERS,
}: UseCatalogOptions = {}) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [sort, setSort] =
    useState<CatalogSortOption>("name-asc");

  const [selectedFilters, setSelectedFilters] =
    useState<Record<string, CatalogFilterSelection>>({});

  useEffect(() => {
    if (
      categoryId &&
      !categories.some((category) => category.id === categoryId)
    ) {
      setCategoryId("");
      setSelectedFilters({});
    }
  }, [categoryId, categories]);

  const categoryProducts = useMemo(
    () =>
      getProductsInCategory(
        products,
        categories,
        categoryId || undefined
      ),
    [products, categories, categoryId]
  );

  const availableFilters = useMemo(
    () =>
      getAvailableFilterDefinitions(
        filterDefinitions,
        categories,
        categoryId || undefined
      ),
    [filterDefinitions, categories, categoryId]
  );

  const filteredProducts = useMemo(() => {
    const result = filterCatalogProducts(
      products,
      categories,
      filterDefinitions,
      search,
      categoryId,
      selectedFilters
    );

    return sortCatalogProducts(result, sort);
  }, [
    products,
    categories,
    filterDefinitions,
    search,
    categoryId,
    selectedFilters,
    sort,
  ]);

  const suggestions = useMemo(
    () => getSearchSuggestions(products, search),
    [products, search]
  );

  const activeFilterCount =
    Object.keys(selectedFilters).length;

  const hasActiveCriteria =
    search.trim().length > 0 ||
    categoryId.length > 0 ||
    activeFilterCount > 0;

  function changeCategory(nextCategoryId: string) {
    setCategoryId(nextCategoryId);
    setSelectedFilters({});
  }

  function changeFilter(
    filterId: string,
    value: CatalogFilterSelection | undefined
  ) {
    setSelectedFilters((previous) => {
      const next = { ...previous };

      const shouldRemove =
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0);

      if (shouldRemove) {
        delete next[filterId];
      } else {
        next[filterId] = value;
      }

      return next;
    });
  }

  function clearAll() {
    setSearch("");
    setCategoryId("");
    setSelectedFilters({});
    setSort("name-asc");
  }

  return {
    products,
    categories,
    filterDefinitions,

    search,
    setSearch,

    categoryId,
    changeCategory,

    sort,
    setSort,

    selectedFilters,
    changeFilter,

    categoryProducts,
    availableFilters,
    filteredProducts,
    suggestions,

    totalProducts: products.length,
    resultCount: filteredProducts.length,
    activeFilterCount,
    hasActiveCriteria,

    clearAll,
  };
}
