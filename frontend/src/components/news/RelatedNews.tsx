
import NewsCard from "./NewsCard";

import type {
  NewsArticle,
  NewsCategory,
} from "../../types/news";

import type { Locale } from "../../i18n/messages";

import type {
  NewsUiMessages,
} from "../../i18n/newsMessages";

interface RelatedNewsProps {
  articles: readonly NewsArticle[];
  categories: readonly NewsCategory[];
  locale: Locale;
  messages: NewsUiMessages;
}

export default function RelatedNews({
  articles,
  categories,
  locale,
  messages,
}: RelatedNewsProps) {
  if (articles.length === 0) {
    return null;
  }

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category,
    ])
  );

  return (
    <section className="related-news">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {messages.relatedTitle}
          </p>

          <h2>{messages.relatedTitle}</h2>
        </div>
      </div>

      <div className="news-grid news-grid--related">
        {articles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            category={
              article.categoryId
                ? categoryMap.get(article.categoryId)
                : undefined
            }
            locale={locale}
            messages={messages}
          />
        ))}
      </div>
    </section>
  );
}
