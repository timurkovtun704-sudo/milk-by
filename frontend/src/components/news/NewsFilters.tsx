
import type {
  NewsCategory,
  NewsSortOption,
} from "../../types/news";

import type {
  NewsUiMessages,
} from "../../i18n/newsMessages";

interface NewsFiltersProps {
  categories: readonly NewsCategory[];

  selectedCategoryId: string;

  sort: NewsSortOption;

  messages: NewsUiMessages;

  onCategoryChange: (value: string) => void;
  onSortChange: (value: NewsSortOption) => void;
}

export default function NewsFilters({
  categories,
  selectedCategoryId,
  sort,
  messages,
  onCategoryChange,
  onSortChange,
}: NewsFiltersProps) {
  return (
    <div className="news-filters">
      <div className="news-filter">
        <label htmlFor="news-category">
          {messages.categoryLabel}
        </label>

        <select
          id="news-category"
          value={selectedCategoryId}
          disabled={categories.length === 0}
          onChange={(event) =>
            onCategoryChange(event.currentTarget.value)
          }
        >
          <option value="">
            {messages.allCategories}
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="news-filter">
        <label htmlFor="news-sort">
          {messages.sortLabel}
        </label>

        <select
          id="news-sort"
          value={sort}
          onChange={(event) =>
            onSortChange(
              event.currentTarget.value as NewsSortOption
            )
          }
        >
          <option value="newest">
            {messages.newest}
          </option>

          <option value="oldest">
            {messages.oldest}
          </option>

          <option value="title-asc">
            {messages.titleAsc}
          </option>

          <option value="title-desc">
            {messages.titleDesc}
          </option>
        </select>
      </div>
    </div>
  );
}
