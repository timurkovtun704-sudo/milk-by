
import { useMemo, useState } from "react";

import EmptyState from "../components/EmptyState";

import CatalogSearch from "../components/catalog/CatalogSearch";
import CatalogFilterPanel from "../components/catalog/CatalogFilterPanel";
import ProductCard from "../components/catalog/ProductCard";

import { useSiteContext } from "../hooks/useSiteContext";
import { useCatalog } from "../hooks/useCatalog";
import { useCatalogData } from "../hooks/useCatalogData";

import { catalogMessages } from "../i18n/catalogMessages";
import { catalogDataMessages } from "../i18n/catalogDataMessages";

import type {
  CatalogFilterDefinition,
  CatalogSortOption,
} from "../types/catalog";

import "../styles/catalog.css";

// Названия фильтра жирности на четырёх языках
const FAT_CONTENT_LABELS = {
  ru: "Жирность",
  be: "Тлустасць",
  en: "Fat content",
  zh: "脂肪含量",
} as const;

export default function ProductsPage() {
  const { locale, messages } = useSiteContext();

  const labels = catalogMessages[locale];
  const dataLabels = catalogDataMessages[locale];

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  // Загружаем реальные товары и категории из backend
  const catalogData = useCatalogData();

  // Формируем доступные фильтры на основании полученных данных
  const filterDefinitions = useMemo<
    CatalogFilterDefinition[]
  >(() => {
    const hasFatContent = catalogData.products.some(
      (product) =>
        typeof product.attributes?.fatContent === "number"
    );

    if (!hasFatContent) {
      return [];
    }

    return [
      {
        id: "fat-content",
        key: "fatContent",
        label: FAT_CONTENT_LABELS[locale],
        type: "range",
        unit: "%",
      },
    ];
  }, [catalogData.products, locale]);

  // Сохраняем существующую логику каталога
  const catalog = useCatalog({
    products: catalogData.products,
    categories: catalogData.categories,
    filterDefinitions,
  });

  const categoryMap = useMemo(
    () =>
      new Map(
        catalog.categories.map((category) => [
          category.id,
          category,
        ])
      ),
    [catalog.categories]
  );

  return (
    <section className="catalog-page">
      <div className="container">
        <header className="page-heading catalog-page__heading">
          <p className="eyebrow">
            {messages.catalog.eyebrow}
          </p>

          <h1>{messages.catalog.title}</h1>

          <p className="page-heading__description">
            {messages.catalog.description}
          </p>
        </header>

        <div className="catalog-toolbar">
          <CatalogSearch
            value={catalog.search}
            suggestions={catalog.suggestions}
            messages={labels}
            onChange={catalog.setSearch}
          />

          <div className="catalog-sort">
            <label htmlFor="catalog-sort">
              {labels.sortLabel}
            </label>

            <select
              id="catalog-sort"
              value={catalog.sort}
              disabled={
                catalogData.isLoading ||
                catalog.totalProducts === 0
              }
              onChange={(event) =>
                catalog.setSort(
                  event.currentTarget.value as CatalogSortOption
                )
              }
            >
              <option value="name-asc">
                {labels.sortNameAsc}
              </option>

              <option value="name-desc">
                {labels.sortNameDesc}
              </option>

              <option value="newest">
                {labels.sortNewest}
              </option>
            </select>
          </div>

          <button
            type="button"
            className="catalog-mobile-toggle"
            aria-expanded={mobileFiltersOpen}
            onClick={() =>
              setMobileFiltersOpen((current) => !current)
            }
          >
            {mobileFiltersOpen
              ? messages.common.closeMenu
              : labels.filtersButton}
          </button>
        </div>

        <div className="catalog-layout">
          <div
            className={`catalog-layout__sidebar ${
              mobileFiltersOpen
                ? "catalog-layout__sidebar--open"
                : ""
            }`}
          >
            <CatalogFilterPanel
              categories={catalog.categories}
              products={catalog.categoryProducts}
              selectedCategoryId={catalog.categoryId}
              definitions={catalog.availableFilters}
              selectedFilters={catalog.selectedFilters}
              messages={labels}
              hasActiveCriteria={catalog.hasActiveCriteria}
              onCategoryChange={(categoryId: string) => {
                catalog.changeCategory(categoryId);
                setMobileFiltersOpen(false);
              }}
              onFilterChange={catalog.changeFilter}
              onReset={() => {
                catalog.clearAll();
                setMobileFiltersOpen(false);
              }}
            />
          </div>

          <div className="catalog-results">
            <div
              className="catalog-results__heading"
              aria-live="polite"
            >
              <p>
                {catalogData.isLoading
                  ? dataLabels.loading
                  : labels.resultsCount.replace(
                      "{count}",
                      String(catalog.resultCount)
                    )}
              </p>

              {catalog.hasActiveCriteria && (
                <button
                  type="button"
                  className="catalog-results__reset"
                  onClick={catalog.clearAll}
                >
                  {labels.clearFilters}
                </button>
              )}
            </div>

            {catalogData.isLoading ? (
              <p role="status">
                {dataLabels.loading}
              </p>
            ) : catalogData.hasError ? (
              <div role="alert">
                <EmptyState
                  title={dataLabels.errorTitle}
                  description={dataLabels.errorDescription}
                />

                <button
                  type="button"
                  className="button button--secondary"
                  onClick={catalogData.reload}
                >
                  {dataLabels.retry}
                </button>
              </div>
            ) : catalog.totalProducts === 0 ? (
              <EmptyState
                title={messages.catalog.empty.title}
                description={messages.catalog.empty.description}
              />
            ) : catalog.filteredProducts.length === 0 ? (
              <EmptyState
                title={labels.noResultsTitle}
                description={labels.noResultsDescription}
              />
            ) : (
              <div className="product-grid">
                {catalog.filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={categoryMap.get(product.categoryId)}
                    locale={locale}
                    messages={labels}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
