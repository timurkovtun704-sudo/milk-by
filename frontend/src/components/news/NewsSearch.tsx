
import { useId } from "react";

import type { NewsUiMessages } from "../../i18n/newsMessages";

interface NewsSearchProps {
  value: string;
  messages: NewsUiMessages;
  onChange: (value: string) => void;
}

export default function NewsSearch({
  value,
  messages,
  onChange,
}: NewsSearchProps) {
  const inputId = useId();

  return (
    <div className="news-search">
      <label htmlFor={inputId}>
        {messages.searchLabel}
      </label>

      <div className="news-search__field">
        <span aria-hidden="true">⌕</span>

        <input
          id={inputId}
          type="search"
          value={value}
          placeholder={messages.searchPlaceholder}
          autoComplete="off"
          onChange={(event) =>
            onChange(event.currentTarget.value)
          }
        />
      </div>
    </div>
  );
}
