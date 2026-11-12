
import ProductCard from "../catalog/ProductCard";

import type {
  CatalogProduct,
  ProductCategory,
} from "../../types/catalog";

import type { Locale } from "../../i18n/messages";
import type { CatalogUiMessages } from "../../i18n/catalogMessages";

interface RelatedProductsProps {
  products: readonly CatalogProduct[];

  categories: readonly ProductCategory[];

  locale: Locale;

  messages: CatalogUiMessages;
}

export default function RelatedProducts({
  products,
  categories,
  locale,
  messages,
}: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  const categoryMap = new Map(
    categories.map((category) => [
      category.id,
      category,
    ])
  );

  return (
    <section className="related-products">
      <div className="section-heading">
        <div>
          <p className="eyebrow">
            {messages.productRelatedTitle}
          </p>

          <h2>{messages.productRelatedTitle}</h2>
        </div>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={categoryMap.get(product.categoryId)}
            locale={locale}
            messages={messages}
          />
        ))}
      </div>
    </section>
  );
}
