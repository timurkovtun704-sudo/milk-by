
import type {
  CatalogAttributeValue,
  CatalogFilterDefinition,
  CatalogFilterSelection,
  CatalogFilterOption,
  CatalogNumberRange,
  CatalogPrimitive,
  CatalogProduct,
  CatalogSortOption,
  CategoryOption,
  ProductCategory,
} from "../types/catalog";

export function normalizeCatalogText(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase()
    .trim();
}

export function getCategoryBranchIds(
  categories: readonly ProductCategory[],
  rootId: string
): Set<string> {
  const result = new Set<string>([rootId]);

  let changed = true;

  while (changed) {
    changed = false;

    for (const category of categories) {
      if (
        category.parentId &&
        result.has(category.parentId) &&
        !result.has(category.id)
      ) {
        result.add(category.id);
        changed = true;
      }
    }
  }

  return result;
}

function getCategoryScopeIds(
  categories: readonly ProductCategory[],
  selectedCategoryId: string
): Set<string> {
  const result = getCategoryBranchIds(
    categories,
    selectedCategoryId
  );

  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  let currentId: string | null = selectedCategoryId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);
    result.add(currentId);

    const currentCategory = categoryMap.get(currentId);

    currentId = currentCategory?.parentId ?? null;
  }

  return result;
}

export function getCategoryOptions(
  categories: readonly ProductCategory[]
): CategoryOption[] {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const children = new Map<
    string | null,
    ProductCategory[]
  >();

  for (const category of categories) {
    const parentId =
      category.parentId &&
      categoryMap.has(category.parentId)
        ? category.parentId
        : null;

    const currentChildren = children.get(parentId) ?? [];

    currentChildren.push(category);
    children.set(parentId, currentChildren);
  }

  for (const group of children.values()) {
    group.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  const result: CategoryOption[] = [];
  const visited = new Set<string>();

  function visit(parentId: string | null, depth: number) {
    const currentChildren = children.get(parentId) ?? [];

    for (const category of currentChildren) {
      if (visited.has(category.id)) {
        continue;
      }

      visited.add(category.id);

      result.push({
        category,
        depth,
      });

      visit(category.id, depth + 1);
    }
  }

  visit(null, 0);

  for (const category of categories) {
    if (!visited.has(category.id)) {
      visited.add(category.id);

      result.push({
        category,
        depth: 0,
      });

      visit(category.id, 1);
    }
  }

  return result;
}

export function getProductsInCategory(
  products: readonly CatalogProduct[],
  categories: readonly ProductCategory[],
  categoryId?: string
): CatalogProduct[] {
  if (!categoryId) {
    return [...products];
  }

  const categoryIds = getCategoryBranchIds(
    categories,
    categoryId
  );

  return products.filter((product) =>
    categoryIds.has(product.categoryId)
  );
}

export function getAvailableFilterDefinitions(
  definitions: readonly CatalogFilterDefinition[],
  categories: readonly ProductCategory[],
  selectedCategoryId?: string
): CatalogFilterDefinition[] {
  const categoryScope = selectedCategoryId
    ? getCategoryScopeIds(categories, selectedCategoryId)
    : new Set<string>();

  return definitions.filter((definition) => {
    const applicableIds = definition.categoryIds;

    if (!applicableIds || applicableIds.length === 0) {
      return true;
    }

    if (!selectedCategoryId) {
      return false;
    }

    return applicableIds.some((id) =>
      categoryScope.has(id)
    );
  });
}

function getAttributeValues(
  value: CatalogAttributeValue | undefined
): CatalogPrimitive[] {
  if (value === undefined || value === null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value as CatalogPrimitive[];
  }

  return [value as CatalogPrimitive];
}

function matchesValue(
  actual: CatalogPrimitive,
  expected: string
): boolean {
  return (
    normalizeCatalogText(actual) ===
    normalizeCatalogText(expected)
  );
}

function matchesRange(
  actualValues: readonly CatalogPrimitive[],
  range: CatalogNumberRange
): boolean {
  const hasMin = range.min !== undefined;
  const hasMax = range.max !== undefined;

  if (!hasMin && !hasMax) {
    return true;
  }

  return actualValues.some((value) => {
    if (value === null || value === "") {
      return false;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return false;
    }

    if (hasMin && numberValue < range.min!) {
      return false;
    }

    if (hasMax && numberValue > range.max!) {
      return false;
    }

    return true;
  });
}

function matchesFilter(
  product: CatalogProduct,
  definition: CatalogFilterDefinition,
  selection: CatalogFilterSelection
): boolean {
  const values = getAttributeValues(
    product.attributes?.[definition.key]
  );

  if (values.length === 0) {
    return false;
  }

  switch (definition.type) {
    case "select": {
      if (typeof selection !== "string") {
        return true;
      }

      return values.some((value) =>
        matchesValue(value, selection)
      );
    }

    case "multi-select": {
      if (!Array.isArray(selection) || selection.length === 0) {
        return true;
      }

      return values.some((actual) =>
        selection.some((expected) =>
          matchesValue(actual, expected)
        )
      );
    }

    case "boolean": {
      if (typeof selection !== "boolean") {
        return true;
      }

      return values.some(
        (value) => value === selection
      );
    }

    case "range": {
      if (
        typeof selection !== "object" ||
        selection === null ||
        Array.isArray(selection)
      ) {
        return true;
      }

      return matchesRange(
        values,
        selection as CatalogNumberRange
      );
    }

    default:
      return true;
  }
}

function getCategorySearchText(
  product: CatalogProduct,
  categories: readonly ProductCategory[]
): string {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category])
  );

  const names: string[] = [];

  let currentId: string | null = product.categoryId;
  const visited = new Set<string>();

  while (currentId && !visited.has(currentId)) {
    visited.add(currentId);

    const category = categoryMap.get(currentId);

    if (!category) {
      break;
    }

    names.push(category.name);
    currentId = category.parentId ?? null;
  }

  return names.join(" ");
}

function matchesSearch(
  product: CatalogProduct,
  categories: readonly ProductCategory[],
  query: string
): boolean {
  if (!query) {
    return true;
  }

  const searchableText = [
    product.name,
    product.description ?? "",
    ...(product.keywords ?? []),
    getCategorySearchText(product, categories),
  ].join(" ");

  return normalizeCatalogText(searchableText).includes(query);
}

export function filterCatalogProducts(
  products: readonly CatalogProduct[],
  categories: readonly ProductCategory[],
  definitions: readonly CatalogFilterDefinition[],
  search: string,
  categoryId: string,
  selectedFilters: Readonly<
    Record<string, CatalogFilterSelection>
  >
): CatalogProduct[] {
  const categoryProducts = getProductsInCategory(
    products,
    categories,
    categoryId || undefined
  );

  const availableDefinitions = getAvailableFilterDefinitions(
    definitions,
    categories,
    categoryId || undefined
  );

  const definitionsMap = new Map(
    availableDefinitions.map((definition) => [
      definition.id,
      definition,
    ])
  );

  const normalizedQuery = normalizeCatalogText(search);

  return categoryProducts.filter((product) => {
    if (
      !matchesSearch(
        product,
        categories,
        normalizedQuery
      )
    ) {
      return false;
    }

    for (const [filterId, selection] of Object.entries(
      selectedFilters
    )) {
      const definition = definitionsMap.get(filterId);

      if (!definition) {
        continue;
      }

      if (
        !matchesFilter(product, definition, selection)
      ) {
        return false;
      }
    }

    return true;
  });
}

export function sortCatalogProducts(
  products: readonly CatalogProduct[],
  sort: CatalogSortOption
): CatalogProduct[] {
  const result = [...products];

  result.sort((a, b) => {
    if (sort === "name-asc") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "name-desc") {
      return b.name.localeCompare(a.name);
    }

    const aDate = a.publishedAt
      ? Date.parse(a.publishedAt)
      : Number.NaN;

    const bDate = b.publishedAt
      ? Date.parse(b.publishedAt)
      : Number.NaN;

    const aValid = Number.isFinite(aDate);
    const bValid = Number.isFinite(bDate);

    if (!aValid && !bValid) {
      return a.name.localeCompare(b.name);
    }

    if (!aValid) {
      return 1;
    }

    if (!bValid) {
      return -1;
    }

    return bDate - aDate;
  });

  return result;
}

export function getFilterOptions(
  definition: CatalogFilterDefinition,
  products: readonly CatalogProduct[]
): CatalogFilterOption[] {
  if (definition.options && definition.options.length > 0) {
    return [...definition.options];
  }

  const uniqueValues = new Map<string, CatalogFilterOption>();

  for (const product of products) {
    const values = getAttributeValues(
      product.attributes?.[definition.key]
    );

    for (const value of values) {
      if (value === null) {
        continue;
      }

      const normalized = normalizeCatalogText(value);

      if (!normalized || uniqueValues.has(normalized)) {
        continue;
      }

      uniqueValues.set(normalized, {
        value,
        label: String(value),
      });
    }
  }

  return [...uniqueValues.values()].sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

export function getNumericBounds(
  definition: CatalogFilterDefinition,
  products: readonly CatalogProduct[]
): { min?: number; max?: number } {
  const values: number[] = [];

  for (const product of products) {
    const attributeValues = getAttributeValues(
      product.attributes?.[definition.key]
    );

    for (const value of attributeValues) {
      if (value === null || value === "") {
        continue;
      }

      const numberValue = Number(value);

      if (Number.isFinite(numberValue)) {
        values.push(numberValue);
      }
    }
  }

  return {
    min:
      definition.min ??
      (values.length > 0 ? Math.min(...values) : undefined),

    max:
      definition.max ??
      (values.length > 0 ? Math.max(...values) : undefined),
  };
}

export function getSearchSuggestions(
  products: readonly CatalogProduct[],
  search: string,
  limit = 6
): string[] {
  const query = normalizeCatalogText(search);

  if (!query) {
    return [];
  }

  const suggestions: string[] = [];
  const used = new Set<string>();

  for (const product of products) {
    const normalizedName = normalizeCatalogText(product.name);

    if (
      normalizedName.includes(query) &&
      !used.has(normalizedName)
    ) {
      used.add(normalizedName);
      suggestions.push(product.name);
    }

    if (suggestions.length >= limit) {
      break;
    }
  }

  return suggestions;
}
