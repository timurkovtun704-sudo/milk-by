
import { Link, useParams } from "react-router-dom";

import EmptyState from "../components/EmptyState";

import { useSiteContext } from "../hooks/useSiteContext";
import { catalogMessages } from "../i18n/catalogMessages";

export default function ProductDetailPage() {
  const { slug } = useParams();

  const { locale } = useSiteContext();
  const labels = catalogMessages[locale];

  if (!slug) {
    return (
      <section className="inner-page">
        <div className="container">
          <EmptyState
            title={labels.productUnavailableTitle}
            description={labels.productUnavailableDescription}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="inner-page">
      <div className="container">
        <div className="product-detail-placeholder">
          <EmptyState
            title={labels.productUnavailableTitle}
            description={labels.productUnavailableDescription}
          />

          <Link
            className="text-link"
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
