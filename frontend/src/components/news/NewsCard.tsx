
import { Link } from "react-router-dom";

import type {
  NewsArticle,
  NewsCategory,
} from "../../types/news";

import type { Locale } from "../../i18n/messages";

import type {
  NewsUiMessages,
} from "../../i18n/newsMessages";

import { formatNewsDate } from "../../utils/news";

interface NewsCardProps {
  article: NewsArticle;
  category?: NewsCategory;
  locale: Locale;
  messages: NewsUiMessages;
}

export default function NewsCard({
  article,
  category,
  locale,
  messages,
}: NewsCardProps) {
  const formattedDate = formatNewsDate(
    article.publishedAt,
    locale
  );

  return (
    <article className="news-card">
      <Link
        className="news-card__link"
        to={`/${locale}/news/${encodeURIComponent(article.slug)}`}
      >
        <div className="news-card__media">
          {article.coverImage?.url ? (
            <img
              src={article.coverImage.url}
              alt={article.coverImage.alt || article.title}
              loading="lazy"
            />
          ) : (
            <span className="news-card__no-image">
              {messages.noImage}
            </span>
          )}
        </div>

        <div className="news-card__body">
          <div className="news-card__meta">
            {formattedDate && (
              <time dateTime={article.publishedAt}>
                {formattedDate}
              </time>
            )}

            {category && (
              <>
                <span
                  className="news-card__separator"
                  aria-hidden="true"
                >
                  /
                </span>

                <span>{category.name}</span>
              </>
            )}
          </div>

          <h2>{article.title}</h2>

          {article.summary && (
            <p className="news-card__summary">
              {article.summary}
            </p>
          )}

          <span className="news-card__read-more">
            {messages.readMore}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
