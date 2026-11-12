
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";

import { useSiteContext } from "../hooks/useSiteContext";
import { catalogMessages } from "../i18n/catalogMessages";

import "../styles/product.css";

export default function ProductDetailPage() {
  const { locale, messages } = useSiteContext();

  const labels = catalogMessages[locale];

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
        </nav>

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
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
