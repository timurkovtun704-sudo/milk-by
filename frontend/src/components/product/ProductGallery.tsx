
import { useState } from "react";

import type { ProductImage } from "../../types/catalog";
import type { CatalogUiMessages } from "../../i18n/catalogMessages";

interface ProductGalleryProps {
  images?: readonly ProductImage[];
  fallbackImageUrl?: string | null;
  productName: string;
  messages: CatalogUiMessages;
}

export default function ProductGallery({
  images = [],
  fallbackImageUrl,
  productName,
  messages,
}: ProductGalleryProps) {
  const [activeImageId, setActiveImageId] =
    useState<string | null>(null);

  const galleryImages: readonly ProductImage[] =
    images.length > 0
      ? images
      : fallbackImageUrl
        ? [
            {
              id: "main-image",
              url: fallbackImageUrl,
              alt: productName,
            },
          ]
        : [];

  const activeImage =
    galleryImages.find(
      (image) => image.id === activeImageId
    ) ?? galleryImages[0];

  return (
    <section
      className="product-gallery"
      aria-label={messages.productGalleryTitle}
    >
      <div className="product-gallery__main">
        {activeImage ? (
          <img
            src={activeImage.url}
            alt={activeImage.alt || productName}
          />
        ) : (
          <span className="product-gallery__empty">
            {messages.noImage}
          </span>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className="product-gallery__thumbnails">
          {galleryImages.map((image, index) => {
            const isActive = image.id === activeImage.id;

            return (
              <button
                className={`product-gallery__thumbnail ${
                  isActive
                    ? "product-gallery__thumbnail--active"
                    : ""
                }`}
                type="button"
                key={image.id}
                aria-label={`${productName}: ${index + 1}`}
                aria-pressed={isActive}
                onClick={() => setActiveImageId(image.id)}
              >
                <img
                  src={image.url}
                  alt=""
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
