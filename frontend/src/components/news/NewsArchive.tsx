
import type {
  NewsArchiveYear,
} from "../../types/news";

import type {
  NewsUiMessages,
} from "../../i18n/newsMessages";

interface NewsArchiveProps {
  years: readonly NewsArchiveYear[];
  selectedYear: string;
  messages: NewsUiMessages;
  onChange: (year: string) => void;
}

export default function NewsArchive({
  years,
  selectedYear,
  messages,
  onChange,
}: NewsArchiveProps) {
  if (years.length === 0) {
    return null;
  }

  return (
    <section className="news-archive">
      <div className="news-archive__heading">
        <h2>{messages.archiveTitle}</h2>
      </div>

      <div
        className="news-archive__years"
        aria-label={messages.archiveTitle}
      >
        <button
          type="button"
          className={`news-archive__year ${
            selectedYear === ""
              ? "news-archive__year--active"
              : ""
          }`}
          aria-pressed={selectedYear === ""}
          onClick={() => onChange("")}
        >
          {messages.allYears}
        </button>

        {years.map((item) => (
          <button
            type="button"
            key={item.year}
            className={`news-archive__year ${
              selectedYear === item.year
                ? "news-archive__year--active"
                : ""
            }`}
            aria-pressed={selectedYear === item.year}
            onClick={() => onChange(item.year)}
          >
            <span>{item.year}</span>
            <span className="news-archive__count">
              {item.count}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
