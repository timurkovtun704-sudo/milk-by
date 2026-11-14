
import { useEffect, useState } from "react";

import { Link, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import NewsArticleView from "../components/news/NewsArticleView";

import { useSiteContext } from "../hooks/useSiteContext";

import { newsMessages } from "../i18n/newsMessages";
import { newsDataMessages } from "../i18n/newsDataMessages";

import {
  getNewsArticleBySlug,
  getNewsCategories,
} from "../services/newsService";

import {
  getPublicSeoMetadata,
} from "../services/publicSeoService";

import type {
  NewsArticle,
  NewsCategory,
} from "../types/news";

import "../styles/news.css";

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { locale, messages } = useSiteContext();

  const labels = newsMessages[locale];
  const dataLabels = newsDataMessages[locale];

  const [article, setArticle] =
    useState<NewsArticle | null>(null);

  const [categories, setCategories] =
    useState<NewsCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isActive = true;

    const controller = new AbortController();

    async function loadArticle() {
      setIsLoading(true);
      setHasError(false);
      setArticle(null);
      setCategories([]);

      if (!slug) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const localizedPath =
        `/${locale}/news/${slug}`;

      try {
        // Загружаем новость, категории и SEO независимо.
        const [
          articleResult,
          categoriesResult,
          seoResult,
        ] = await Promise.allSettled([
          getNewsArticleBySlug(slug),
          getNewsCategories(),
          getPublicSeoMetadata(
            localizedPath,
            controller.signal
          ),
        ]);

        if (!isActive) {
          return;
        }

        // Новость обязательна для отображения страницы
        if (articleResult.status === "rejected") {
          throw articleResult.reason;
        }

        const loadedArticle = articleResult.value;

        // Категории необязательны для открытия новости
        if (categoriesResult.status === "fulfilled") {
          setCategories(categoriesResult.value);
        } else {
          console.warn(
            "Не удалось загрузить категории новости:",
            categoriesResult.reason
          );
        }

        // SEO-данные дополняют новость, но не заменяют её
        if (seoResult.status === "fulfilled") {
          setArticle({
            ...loadedArticle,
            seo: seoResult.value
              ? {
                  ...loadedArticle.seo,
                  ...seoResult.value,
                }
              : loadedArticle.seo,
          });
        } else {
          console.warn(
            "Не удалось загрузить SEO-метаданные новости:",
            seoResult.reason
          );

          setArticle(loadedArticle);
        }
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error(
          "Ошибка загрузки публикации:",
          error
        );

        setHasError(true);
        setArticle(null);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadArticle();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [slug, locale]);

  const category = article?.categoryId
    ? categories.find(
        (item) => item.id === article.categoryId
      )
    : undefined;

  return (
    <section className="inner-page">
      <div className="container">
        {isLoading ? (
          <p className="news-data-status" role="status">
            {dataLabels.loading}
          </p>
        ) : hasError || !article ? (
          <>
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
            </nav>

            <div className="news-detail-unavailable">
              <EmptyState
                title={labels.articleUnavailableTitle}
                description={labels.articleUnavailableDescription}
              />

              <Link
                className="button button--primary"
                to={`/${locale}/news`}
              >
                {labels.backToNews}
                <span aria-hidden="true">←</span>
              </Link>
            </div>
          </>
        ) : (
          <NewsArticleView
            article={article}
            category={category}
            categories={categories}
            relatedArticles={[]}
          />
        )}
      </div>
    </section>
  );
}
