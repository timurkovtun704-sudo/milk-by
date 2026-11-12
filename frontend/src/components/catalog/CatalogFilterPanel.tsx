
import {
  getCategoryOptions,
  getFilterOptions,
  getNumericBounds,
} from "../../utils/catalog";

import type {
  CatalogFilterDefinition,
  CatalogFilterSelection,
  CatalogNumberRange,
  CatalogProduct,
  ProductCategory,
} from "../../types/catalog";

import type { CatalogUiMessages } from "../../i18n/catalogMessages";

interface CatalogFilterPanelProps {
  categories: readonly ProductCategory[];
  products: readonly CatalogProduct[];
  selectedCategoryId: string;
  definitions: readonly CatalogFilterDefinition[];

  selectedFilters: Readonly<
    Record<string, CatalogFilterSelection>
  >;

  messages: CatalogUiMessages;
  hasActiveCriteria: boolean;

  onCategoryChange: (categoryId: string) => void;

  onFilterChange: (
    filterId: string,
    value: CatalogFilterSelection | undefined
  ) => void;

  onReset: () => void;
}

// Проверяем, что объект является числовым диапазоном,
// а не массивом значений.
function isCatalogNumberRange(
  value: CatalogFilterSelection | undefined
): value is CatalogNumberRange {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export default function CatalogFilterPanel({
  categories,
  products,
  selectedCategoryId,
  definitions,
  selectedFilters,
  messages,
  hasActiveCriteria,
  onCategoryChange,
  onFilterChange,
  onReset,
}: CatalogFilterPanelProps) {
  const categoryOptions = getCategoryOptions(categories);

  return (
    <aside className="catalog-filter-panel">
      <div className="catalog-filter-panel__heading">
        <h2>{messages.filtersTitle}</h2>

        <button
          type="button"
          className="catalog-filter-panel__reset"
          disabled={!hasActiveCriteria}
          onClick={onReset}
        >
          {messages.clearFilters}
        </button>
      </div>

      {/* Выбор категории */}

      <div className="catalog-filter">
        <label
          className="catalog-filter__label"
          htmlFor="catalog-category"
        >
          {messages.categoryLabel}
        </label>

        <select
          id="catalog-category"
          value={selectedCategoryId}
          disabled={categories.length === 0}
          onChange={(event) =>
            onCategoryChange(event.currentTarget.value)
          }
        >
          <option value="">
            {messages.allCategories}
          </option>

          {categoryOptions.map(({ category, depth }) => (
            <option
              key={category.id}
              value={category.id}
            >
              {"\u00A0".repeat(depth * 3)}
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Динамические характеристики */}

      <div className="catalog-filter-panel__fields">
        {definitions.length === 0 ? (
          <p className="catalog-filter-panel__empty">
            {messages.noAvailableFilters}
          </p>
        ) : (
          definitions.map((definition) => {
            const selection = selectedFilters[definition.id];

            // Одиночный выбор

            if (definition.type === "select") {
              const options = getFilterOptions(
                definition,
                products
              );

              return (
                <div
                  className="catalog-filter"
                  key={definition.id}
                >
                  <label
                    className="catalog-filter__label"
                    htmlFor={`filter-${definition.id}`}
                  >
                    {definition.label}
                  </label>

                  <select
                    id={`filter-${definition.id}`}
                    value={
                      typeof selection === "string"
                        ? selection
                        : ""
                    }
                    disabled={options.length === 0}
                    onChange={(event) =>
                      onFilterChange(
                        definition.id,
                        event.currentTarget.value || undefined
                      )
                    }
                  >
                    <option value="">
                      {messages.allValues}
                    </option>

                    {options.map((option) => (
                      <option
                        key={`${typeof option.value}-${String(option.value)}`}
                        value={String(option.value)}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            // Множественный выбор

            if (definition.type === "multi-select") {
              const options = getFilterOptions(
                definition,
                products
              );

              const selectedValues = Array.isArray(selection)
                ? selection
                : [];

              return (
                <fieldset
                  className="catalog-filter"
                  key={definition.id}
                  disabled={options.length === 0}
                >
                  <legend className="catalog-filter__label">
                    {definition.label}
                  </legend>

                  <div className="catalog-filter__options">
                    {options.map((option, index) => {
                      const optionValue = String(option.value);
                      const inputId =
                        `filter-${definition.id}-${index}`;

                      return (
                        <label
                          className="catalog-filter__checkbox"
                          htmlFor={inputId}
                          key={`${typeof option.value}-${optionValue}`}
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={selectedValues.includes(
                              optionValue
                            )}
                            onChange={(event) => {
                              const nextValues =
                                event.currentTarget.checked
                                  ? [...selectedValues, optionValue]
                                  : selectedValues.filter(
                                      (value) =>
                                        value !== optionValue
                                    );

                              onFilterChange(
                                definition.id,
                                nextValues.length > 0
                                  ? nextValues
                                  : undefined
                              );
                            }}
                          />

                          <span>{option.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            }

            // Логический выбор

            if (definition.type === "boolean") {
              const booleanValue =
                typeof selection === "boolean"
                  ? String(selection)
                  : "";

              return (
                <div
                  className="catalog-filter"
                  key={definition.id}
                >
                  <label
                    className="catalog-filter__label"
                    htmlFor={`filter-${definition.id}`}
                  >
                    {definition.label}
                  </label>

                  <select
                    id={`filter-${definition.id}`}
                    value={booleanValue}
                    onChange={(event) => {
                      const value = event.currentTarget.value;

                      onFilterChange(
                        definition.id,
                        value === ""
                          ? undefined
                          : value === "true"
                      );
                    }}
                  >
                    <option value="">
                      {messages.allValues}
                    </option>

                    <option value="true">
                      {messages.yes}
                    </option>

                    <option value="false">
                      {messages.no}
                    </option>
                  </select>
                </div>
              );
            }

            // Числовой диапазон

            if (definition.type === "range") {
              const range: CatalogNumberRange =
                isCatalogNumberRange(selection)
                  ? selection
                  : {};

              const bounds = getNumericBounds(
                definition,
                products
              );

              function updateRange(
                key: keyof CatalogNumberRange,
                rawValue: string
              ) {
                const nextRange: CatalogNumberRange = {
                  ...range,
                  [key]:
                    rawValue === ""
                      ? undefined
                      : Number(rawValue),
                };

                onFilterChange(
                  definition.id,
                  nextRange.min === undefined &&
                    nextRange.max === undefined
                    ? undefined
                    : nextRange
                );
              }

              return (
                <fieldset
                  className="catalog-filter"
                  key={definition.id}
                >
                  <legend className="catalog-filter__label">
                    {definition.label}
                    {definition.unit
                      ? ` (${definition.unit})`
                      : ""}
                  </legend>

                  <div className="catalog-filter__range">
                    <label>
                      <span>{messages.minimum}</span>

                      <input
                        type="number"
                        value={range.min ?? ""}
                        min={bounds.min}
                        max={bounds.max}
                        step={definition.step ?? "any"}
                        onChange={(event) =>
                          updateRange(
                            "min",
                            event.currentTarget.value
                          )
                        }
                      />
                    </label>

                    <label>
                      <span>{messages.maximum}</span>

                      <input
                        type="number"
                        value={range.max ?? ""}
                        min={bounds.min}
                        max={bounds.max}
                        step={definition.step ?? "any"}
                        onChange={(event) =>
                          updateRange(
                            "max",
                            event.currentTarget.value
                          )
                        }
                      />
                    </label>
                  </div>
                </fieldset>
              );
            }

            return null;
          })
        )}
      </div>
    </aside>
  );
}
