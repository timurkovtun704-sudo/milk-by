import { useCallback, useEffect, useState } from "react";

import { getCatalogData } from "../services/productService";

import type {
  CatalogProduct,
  ProductCategory,
} from "../types/catalog";

export function useCatalogData() {
  const [products, setProducts] = useState<
    readonly CatalogProduct[]
  >([]);

  const [categories, setCategories] = useState<
    readonly ProductCategory[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  // Повторная загрузка каталога
  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadCatalog() {
      setIsLoading(true);
      setHasError(false);

      try {
        const result = await getCatalogData(
          controller.signal
        );

        if (!isMounted) {
          return;
        }

        setProducts(result.products);
        setCategories(result.categories);
      } catch (error) {
        if (
          !isMounted ||
          (error instanceof Error &&
            error.name === "AbortError")
        ) {
          return;
        }

        console.error("Ошибка загрузки каталога:", error);

        setHasError(true);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [reloadKey]);

  return {
    products,
    categories,
    isLoading,
    hasError,
    reload,
  };
}
