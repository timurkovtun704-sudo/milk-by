
import { useState } from "react";

import { Link } from "react-router-dom";

import ProductGallery from "./ProductGallery";
import ProductSpecifications from "./ProductSpecifications";
import ProductPackagingSelector from "./ProductPackagingSelector";
import RelatedProducts from "./RelatedProducts";

import { useSiteContext } from "../../hooks/useSiteContext";
import { useProductMetadata } from "../../hooks/useProductMetadata";

import { catalogMessages } from "../../i18n/catalogMessages";

import type {
  CatalogProduct,
  ProductCategory,
} from "../../types/catalog";

import "../../styles/product.css";

interface ProductDetailViewProps {
  product: CatalogProduct;

  category?: ProductCategory;

  categories: readonly ProductCategory[];

  relatedProducts?: readonly CatalogProduct[];
}

export default function ProductDetailView({
  product,
  category,
  categories,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const { locale, messages } = useSiteContext();

  const labels = catalogMessages[locale];

  const [selectedPackagingId, setSelectedPackagingId] =
    useState<string | null>(
      product.packagings?.[0]?.id ?? null
    );

  const selectedPackaging =
    product.packagings?.find(
      (item) => item.id === selectedPackagingId
    ) ?? product.packagings?.[0] ?? null;

  useProductMetadata(
    product.seo?.title?.trim() || product.name,
    product.seo?.description ?? product.description,
    product.seo?.canonicalUrl
  );

  return (
    <article className="product-detail">
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

          <span aria-hidden="true">/</span>

          <span aria-current="page">
            {product.name}
          </span>
        </nav>

        <div className="product-detail__layout">
          <ProductGallery
            images={product.images}
            fallbackImageUrl={
              selectedPackaging?.imageUrl ??
              product.imageUrl
            }
            productName={product.name}
            messages={labels}
          />

          <div className="product-detail__information">
            {category && (
              <span className="product-detail__category">
                {category.name}
              </span>
            )}

            <h1>{product.name}</h1>

            {product.description && (
              <p className="product-detail__description">
                {product.description}
              </p>
            )}

            <ProductPackagingSelector
              packagings={product.packagings ?? []}
              selectedPackagingId={
                selectedPackaging?.id ?? null
              }
              onSelect={setSelectedPackagingId}
              messages={labels}
            />

            <ProductSpecifications
              title={labels.productSpecificationsTitle}
              attributes={product.attributes}
              attributeLabels={product.attributeLabels}
              messages={labels}
            />

            {selectedPackaging && (
              <ProductSpecifications
                title={labels.productPackagingAttributesTitle}
                attributes={selectedPackaging.attributes}
                attributeLabels={
                  selectedPackaging.attributeLabels
                }
                messages={labels}
              />
            )}
          </div>
        </div>

        <RelatedProducts
          products={relatedProducts}
          categories={categories}
          locale={locale}
          messages={labels}
        />
      </div>
    </article>
  );
}
