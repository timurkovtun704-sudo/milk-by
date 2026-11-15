import { useMemo } from "react";
import { Link } from "react-router-dom";

import milkWorldLogo from "../assets/images/assetslogo.png";

import EmptyState from "../components/EmptyState";
import ProductCard from "../components/catalog/ProductCard";
import NewsCard from "../components/news/NewsCard";

import { useSiteContext } from "../hooks/useSiteContext";
import { useCatalogData } from "../hooks/useCatalogData";
import { useNewsData } from "../hooks/useNewsData";

import { catalogMessages } from "../i18n/catalogMessages";
import { catalogDataMessages } from "../i18n/catalogDataMessages";
import { newsMessages } from "../i18n/newsMessages";

import { sortCatalogProducts } from "../utils/catalog";

import "../styles/catalog.css";
import "../styles/news.css";
import "../styles/home.css";

export default function HomePage() {
  const { locale, messages } = useSiteContext();

  const productLabels = catalogMessages[locale];
  const productDataLabels = catalogDataMessages[locale];
  const newsLabels = newsMessages[locale];

  // Получаем реальные товары из backend.
  const catalogData = useCatalogData();

  // Получаем опубликованные новости из backend.
  const newsData = useNewsData();

  // Формируем список последних добавленных товаров.
  const featuredProducts = useMemo(
    () =>
      sortCatalogProducts(
        catalogData.products,
        "newest"
      ).slice(0, 4),
    [catalogData.products]
  );

  // Формируем список последних опубликованных новостей.
  const latestNews = useMemo(
    () =>
      [...newsData.articles]
        .sort((a, b) => {
          const aDate = Date.parse(a.publishedAt);
          const bDate = Date.parse(b.publishedAt);

          if (!Number.isFinite(aDate)) {
            return Number.isFinite(bDate) ? 1 : 0;
          }

          if (!Number.isFinite(bDate)) {
            return -1;
          }

          return bDate - aDate;
        })
        .slice(0, 3),
    [newsData.articles]
  );

  // Подготавливаем категории для карточек товаров.
  const productCategoryMap = useMemo(
    () =>
      new Map(
        catalogData.categories.map((category) => [
          category.id,
          category,
        ])
      ),
    [catalogData.categories]
  );

  // Подготавливаем категории для карточек новостей.
  const newsCategoryMap = useMemo(
    () =>
      new Map(
        newsData.categories.map((category) => [
          category.id,
          category,
        ])
      ),
    [newsData.categories]
  );

  const directions = [
    {
      number: "01",
      title: messages.navigation.products,
      description: messages.home.productsDescription,
      path: `/${locale}/products`,
    },
    {
      number: "02",
      title: messages.navigation.news,
      description: messages.home.newsDescription,
      path: `/${locale}/news`,
    },
    {
      number: "03",
      title: messages.navigation.about,
      description: messages.home.aboutDescription,
      path: `/${locale}/about`,
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="container hero__layout">
          <div className="hero__content">
            <p className="eyebrow">
              {messages.home.eyebrow}
            </p>

            <h1>{messages.home.title}</h1>

            <p className="hero__description">
              {messages.home.description}
            </p>

            <div className="hero__actions">
              <Link
                className="button button--primary"
                to={`/${locale}/products`}
              >
                {messages.home.catalogAction}
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                className="button button--secondary"
                to={`/${locale}/partners`}
              >
                {messages.home.partnersAction}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <img
              className="hero-visual__logo"
              src={milkWorldLogo}
              alt={messages.companyName}
            />
          </div>
        </div>
      </section>

      <section className="directions-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {messages.home.directionsEyebrow}
              </p>

              <h2>{messages.home.directionsTitle}</h2>
            </div>
          </div>

          <div className="directions-grid">
            {directions.map((direction) => (
              <Link
                className="direction-card"
                key={direction.number}
                to={direction.path}
              >
                <span className="direction-card__number">
                  {direction.number}
                </span>

                <div className="direction-card__content">
                  <h3>{direction.title}</h3>
                  <p>{direction.description}</p>
                </div>

                <span
                  className="direction-card__arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Товары из существующего каталога */}
      <section className="home-content">
        <div className="container">
          <div className="section-heading section-heading--simple">
            <div>
              <p className="eyebrow">
                {messages.home.contentEyebrow}
              </p>

              <h2>{messages.catalog.title}</h2>
            </div>

            <Link
              className="text-link"
              to={`/${locale}/products`}
            >
              {messages.home.catalogAction}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {catalogData.isLoading ? (
            <p role="status">
              {productDataLabels.loading}
            </p>
          ) : catalogData.hasError ? (
            <div role="alert">
              <EmptyState
                title={productDataLabels.errorTitle}
                description={productDataLabels.errorDescription}
                variant="compact"
              />

              <button
                type="button"
                className="button button--secondary"
                onClick={catalogData.reload}
              >
                {productDataLabels.retry}
              </button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <EmptyState
              title={messages.catalog.empty.title}
              description={messages.catalog.empty.description}
              variant="compact"
            />
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={productCategoryMap.get(
                    product.categoryId
                  )}
                  locale={locale}
                  messages={productLabels}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Новости из существующего новостного модуля */}
      <section className="home-news">
        <div className="container">
          <div className="section-heading section-heading--simple">
            <div>
              <p className="eyebrow">
                {messages.home.contentEyebrow}
              </p>

              <h2>{messages.news.title}</h2>
            </div>

            <Link
              className="text-link"
              to={`/${locale}/news`}
            >
              {messages.navigation.news}
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {newsData.isLoading ? (
            <p role="status">
              {productDataLabels.loading}
            </p>
          ) : newsData.error ? (
            <div role="alert">
              <EmptyState
                title={messages.news.empty.title}
                description={newsData.error}
                variant="compact"
              />
            </div>
          ) : latestNews.length === 0 ? (
            <EmptyState
              title={messages.news.empty.title}
              description={messages.news.empty.description}
              variant="compact"
            />
          ) : (
            <div className="home-news__grid">
              {latestNews.map((article) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  category={
                    article.categoryId
                      ? newsCategoryMap.get(
                          article.categoryId
                        )
                      : undefined
                  }
                  locale={locale}
                  messages={newsLabels}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}