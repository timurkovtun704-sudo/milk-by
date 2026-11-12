
import { useId } from "react";

import type { CatalogUiMessages } from "../../i18n/catalogMessages";

interface CatalogSearchProps {
  value: string;
  suggestions: readonly string[];
  messages: CatalogUiMessages;
  onChange: (value: string) => void;
}

export default function CatalogSearch({
  value,
  suggestions,
  messages,
  onChange,
}: CatalogSearchProps) {
  const inputId = useId();
  const listId = useId();

  return (
    <div className="catalog-search">
      <label htmlFor={inputId}>
        {messages.searchLabel}
      </label>

      <div className="catalog-search__field">
        <span aria-hidden="true">⌕</span>

        <input
          id={inputId}
          type="search"
          value={value}
          list={listId}
          placeholder={messages.searchPlaceholder}
          autoComplete="off"
          onChange={(event) =>
            onChange(event.currentTarget.value)
          }
        />

        <datalist id={listId}>
          {suggestions.map((suggestion) => (
            <option
              key={suggestion}
              value={suggestion}
            />
          ))}
        </datalist>
      </div>
    </div>
  );
}
