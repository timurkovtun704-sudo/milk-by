
import { Link, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";
import ProductDetailView from "../components/product/ProductDetailView";

import { useSiteContext } from "../hooks/useSiteContext";
import { useProductData } from "../hooks/useProductData";

import { catalogMessages } from "../i18n/catalogMessages";
import { catalogDataMessages } from "../i18n/catalogDataMessages";

import "../styles/product.css";

export default function ProductDetailPage() {
  const { locale, messages } = useSiteContext();

  const { slug } = useParams<{ slug: string }>();

  const labels = catalogMessages[locale];
  const dataLabels = catalogDataMessages[locale];

  // Получаем товар по числовому ID из URL
  const productData = useProductData(slug);

  const category = productData.product
    ? productData.categories.find(
        (item) =>
          item.id === productData.product?.categoryId
      )
    : undefined;

  return (
    <section className="inner-page">
      <div className="container">
        <nav
          className="product-breadcrumbs"
          aria-label={messages.common.primaryNavigation}
        >
          <Link to={`/${locale}`}>
            {messages.navigation.home}
          </Link>

          <span aria-hidden="true">/</span>

          <Link to={`/${locale}/products`}>
            {messages.catalog.title}
          </Link>

          {category && (
            <>
              <span aria-hidden="true">/</span>
              <span>{category.name}</span>
            </>
          )}

          {productData.product && (
            <>
              <span aria-hidden="true">/</span>
              <span aria-current="page">
                {productData.product.name}
              </span>
            </>
          )}
        </nav>

        {productData.isLoading ? (
          <p role="status" className="product-loading">
            {dataLabels.productLoading}
          </p>
        ) : productData.hasError ? (
          <div className="product-detail-unavailable" role="alert">
            <EmptyState
              title={dataLabels.productErrorTitle}
              description={dataLabels.productErrorDescription}
            />

            <button
              type="button"
              className="button button--secondary"
              onClick={productData.reload}
            >
              {dataLabels.retry}
            </button>

            <Link
              className="button button--primary"
              to={`/${locale}/products`}
            >
              {labels.backToCatalog}
            </Link>
          </div>
        ) : productData.isNotFound || !productData.product ? (
          <div className="product-detail-unavailable">
            <EmptyState
              title={labels.productUnavailableTitle}
              description={labels.productUnavailableDescription}
            />

            <Link
              className="button button--primary"
              to={`/${locale}/products`}
            >
              {labels.backToCatalog}
            </Link>
          </div>
        ) : (
          <ProductDetailView
            product={productData.product}
            category={category}
            categories={productData.categories}
          />
        )}
      </div>
    </section>
  );
}
