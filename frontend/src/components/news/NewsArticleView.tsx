
import { Link } from "react-router-dom";

import NewsArticleContent from "./NewsArticleContent";
import RelatedNews from "./RelatedNews";

import { useSiteContext } from "../../hooks/useSiteContext";
import { useDocumentMetadata } from "../../hooks/useDocumentMetadata";

import { newsMessages } from "../../i18n/newsMessages";

import { formatNewsDate } from "../../utils/news";

import type {
  NewsArticle,
  NewsCategory,
} from "../../types/news";

import "../../styles/news.css";

interface NewsArticleViewProps {
  article: NewsArticle;

  category?: NewsCategory;

  categories: readonly NewsCategory[];

  relatedArticles?: readonly NewsArticle[];
}

export default function NewsArticleView({
  article,
  category,
  categories,
  relatedArticles = [],
}: NewsArticleViewProps) {
  const { locale, messages } = useSiteContext();

  const labels = newsMessages[locale];

  const formattedDate = formatNewsDate(
    article.publishedAt,
    locale
  );

  useDocumentMetadata(
    article.seo?.title?.trim() || article.title,
    article.seo?.description ?? article.summary,
    article.seo?.canonicalUrl
  );

  return (
    <article className="news-article">
      <div className="container">
        <nav
          className="news-breadcrumbs"
          aria-label={messages.common.primaryNavigation}
        >
          <Link to={`/${locale}`}>
            {messages.navigation.home}
          </Link>

          <span aria-hidden="true">/</span>

          <Link to={`/${locale}/news`}>
            {messages.navigation.news}
          </Link>

          {category && (
            <>
              <span aria-hidden="true">/</span>
              <span>{category.name}</span>
            </>
          )}
        </nav>

        <header className="news-article__header">
          {category && (
            <span className="news-article__category">
              {category.name}
            </span>
          )}

          <h1>{article.title}</h1>

          {article.summary && (
            <p className="news-article__summary">
              {article.summary}
            </p>
          )}

          <div className="news-article__meta">
            {formattedDate && (
              <>
                <span>{labels.publishedLabel}</span>

                <time dateTime={article.publishedAt}>
                  {formattedDate}
                </time>
              </>
            )}
          </div>
        </header>

        {article.coverImage?.url && (
          <figure className="news-article__cover">
            <img
              src={article.coverImage.url}
              alt={
                article.coverImage.alt || article.title
              }
            />

            {article.coverImage.caption && (
              <figcaption>
                {article.coverImage.caption}
              </figcaption>
            )}
          </figure>
        )}

        <div className="news-article__layout">
          <div className="news-article__body">
            {article.content.length > 0 ? (
              <NewsArticleContent
                blocks={article.content}
              />
            ) : (
              <p className="news-article__unavailable">
                {labels.articleContentUnavailable}
              </p>
            )}
          </div>
        </div>

        <div className="news-article__back">
          <Link
            className="text-link"
            to={`/${locale}/news`}
          >
            ← {labels.backToNews}
          </Link>
        </div>

        <RelatedNews
          articles={relatedArticles}
          categories={categories}
          locale={locale}
          messages={labels}
        />
      </div>
    </article>
  );
}
