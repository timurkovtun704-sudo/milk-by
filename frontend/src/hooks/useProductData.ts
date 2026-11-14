
import { useCallback, useEffect, useState } from "react";

import {
  getProductById,
  getProductCategories,
} from "../services/productService";

import { ApiError } from "../services/apiClient";

import type {
  CatalogProduct,
  ProductCategory,
} from "../types/catalog";

export function useProductData(productId?: string) {
  const [product, setProduct] =
    useState<CatalogProduct | null>(null);

  const [categories, setCategories] = useState<
    readonly ProductCategory[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadProduct() {
      setProduct(null);
      setCategories([]);
      setIsLoading(true);
      setHasError(false);
      setIsNotFound(false);

      // Проверяем ID до обращения к backend
      if (
        !productId ||
        !/^[1-9]\d*$/.test(productId) ||
        !Number.isSafeInteger(Number(productId))
      ) {
        setIsNotFound(true);
        setIsLoading(false);
        return;
      }

      try {
        const [loadedProduct, loadedCategories] =
          await Promise.all([
            getProductById(
              productId,
              controller.signal
            ),
            getProductCategories(
              controller.signal
            ),
          ]);

        if (!isMounted) {
          return;
        }

        if (!loadedProduct) {
          setIsNotFound(true);
          return;
        }

        setProduct(loadedProduct);
        setCategories(loadedCategories);
      } catch (error) {
        if (
          !isMounted ||
          (error instanceof Error &&
            error.name === "AbortError")
        ) {
          return;
        }

        if (
          error instanceof ApiError &&
          error.status === 404
        ) {
          setIsNotFound(true);
        } else {
          console.error(
            "Ошибка загрузки товара:",
            error
          );

          setHasError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProduct();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [productId, reloadKey]);

  return {
    product,
    categories,
    isLoading,
    hasError,
    isNotFound,
    reload,
  };
}
