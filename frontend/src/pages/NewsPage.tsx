
import { useMemo } from "react";

import EmptyState from "../components/EmptyState";

import NewsSearch from "../components/news/NewsSearch";
import NewsFilters from "../components/news/NewsFilters";
import NewsArchive from "../components/news/NewsArchive";
import NewsCard from "../components/news/NewsCard";

import { useSiteContext } from "../hooks/useSiteContext";
import { useNews } from "../hooks/useNews";

import { newsMessages } from "../i18n/newsMessages";

import "../styles/news.css";

export default function NewsPage() {
  const { locale, messages } = useSiteContext();

  const labels = newsMessages[locale];

  // Источники данных пока пустые.
  // Впоследствии сюда будут переданы ответы реального API.
  const news = useNews();

  const categoryMap = useMemo(
    () =>
      new Map(
        news.categories.map((category) => [
          category.id,
          category,
        ])
      ),
    [news.categories]
  );

  return (
    <section className="news-page">
      <div className="container">
        <header className="page-heading news-page__heading">
          <p className="eyebrow">
            {messages.news.eyebrow}
          </p>

          <h1>{messages.news.title}</h1>

          <p className="page-heading__description">
            {messages.news.description}
          </p>
        </header>

        <div className="news-toolbar">
          <NewsSearch
            value={news.search}
            messages={labels}
            onChange={news.setSearch}
          />

          <NewsFilters
            categories={news.availableCategories}
            selectedCategoryId={news.categoryId}
            sort={news.sort}
            messages={labels}
            onCategoryChange={news.setCategoryId}
            onSortChange={news.setSort}
          />
        </div>

        {news.archiveYears.length > 0 && (
          <NewsArchive
            years={news.archiveYears}
            selectedYear={news.year}
            messages={labels}
            onChange={news.setYear}
          />
        )}

        <div className="news-results">
          <div
            className="news-results__heading"
            aria-live="polite"
          >
            <p>
              {labels.resultsCount.replace(
                "{count}",
                String(news.resultCount)
              )}
            </p>

            {news.hasActiveCriteria && (
              <button
                className="news-results__reset"
                type="button"
                onClick={news.clearFilters}
              >
                {labels.clearFilters}
              </button>
            )}
          </div>

          {news.totalCount === 0 ? (
            <EmptyState
              title={messages.news.empty.title}
              description={messages.news.empty.description}
            />
          ) : news.filteredArticles.length === 0 ? (
            <EmptyState
              title={labels.noResultsTitle}
              description={labels.noResultsDescription}
            />
          ) : (
            <>
              <div className="news-grid">
                {news.visibleArticles.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    category={
                      article.categoryId
                        ? categoryMap.get(article.categoryId)
                        : undefined
                    }
                    locale={locale}
                    messages={labels}
                  />
                ))}
              </div>

              {news.canLoadMore && (
                <div className="news-load-more">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={news.loadMore}
                  >
                    {labels.loadMore}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
