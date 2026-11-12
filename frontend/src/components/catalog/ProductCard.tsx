
import { Link } from "react-router-dom";

import type {
  CatalogProduct,
  ProductCategory,
} from "../../types/catalog";

import type { Locale } from "../../i18n/messages";

import type {
  CatalogUiMessages,
} from "../../i18n/catalogMessages";

interface ProductCardProps {
  product: CatalogProduct;

  category?: ProductCategory;

  locale: Locale;

  messages: CatalogUiMessages;
}

export default function ProductCard({
  product,
  category,
  locale,
  messages,
}: ProductCardProps) {
  const imageUrl =
    product.images?.[0]?.url ??
    product.imageUrl;

  const imageAlt =
    product.images?.[0]?.alt ||
    product.name;

  return (
    <article className="product-card">
      <Link
        className="product-card__link"
        to={`/${locale}/products/${encodeURIComponent(product.slug)}`}
      >
        <div className="product-card__media">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              loading="lazy"
            />
          ) : (
            <span className="product-card__no-image">
              {messages.noImage}
            </span>
          )}
        </div>

        <div className="product-card__body">
          {category && (
            <span className="product-card__category">
              {category.name}
            </span>
          )}

          <h2>{product.name}</h2>

          {product.description && (
            <p className="product-card__description">
              {product.description}
            </p>
          )}

          {product.packagings &&
            product.packagings.length > 0 && (
              <div className="product-card__formats">
                <span>{messages.formatsLabel}</span>

                <p>
                  {product.packagings
                    .map((item) => item.label)
                    .join(", ")}
                </p>
              </div>
            )}

          <span className="product-card__details">
            {messages.detailsAction}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
    </article>
  );
}
