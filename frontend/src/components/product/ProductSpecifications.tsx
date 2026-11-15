
import type {
  CatalogAttributeValue,
} from "../../types/catalog";

import type { CatalogUiMessages } from "../../i18n/catalogMessages";
import type { Locale } from "../../i18n/messages";

import {
  getVisibleProductCharacteristics,
} from "../../utils/productCharacteristics";

interface ProductSpecificationsProps {
  title: string;

  locale?: Locale;

  fixedCharacteristics?: boolean;

  attributes?: Readonly<
    Record<string, CatalogAttributeValue>
  >;

  attributeLabels?: Readonly<
    Record<string, string>
  >;

  messages: CatalogUiMessages;
}

function formatAttributeValue(
  value: CatalogAttributeValue,
  messages: CatalogUiMessages
): string {
  if (value === null) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? messages.yes : messages.no;
  }

  if (Array.isArray(value)) {
    return value
      .filter((item) => item !== null)
      .map((item) => {
        if (typeof item === "boolean") {
          return item ? messages.yes : messages.no;
        }

        return String(item);
      })
      .join(", ");
  }

  return String(value);
}

export default function ProductSpecifications({
  title,
  locale = "ru",
  fixedCharacteristics = false,
  attributes = {},
  attributeLabels = {},
  messages,
}: ProductSpecificationsProps) {
  // Фиксированные характеристики самого товара
  if (fixedCharacteristics) {
    const entries = getVisibleProductCharacteristics(
      attributes,
      locale
    );

    if (entries.length === 0) {
      return (
        <section className="product-specifications">
          <h2>{title}</h2>

          <p className="product-specifications__empty">
            {messages.productNoSpecifications}
          </p>
        </section>
      );
    }

    return (
      <section className="product-specifications">
        <h2>{title}</h2>

        <dl className="product-specifications__list">
          {entries.map((item) => (
            <div
              className="product-specifications__item"
              key={item.key}
            >
              <dt>{item.label}</dt>

              <dd>
                {String(item.value)}
                {item.unit ? ` ${item.unit}` : ""}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    );
  }

  // Универсальные характеристики упаковки
  const entries = Object.entries(attributes)
    .map(([key, value]) => ({
      key,
      label: attributeLabels[key] || key,
      value: formatAttributeValue(value, messages),
    }))
    .filter((item) => item.value.length > 0);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="product-specifications">
      <h2>{title}</h2>

      <dl className="product-specifications__list">
        {entries.map((item) => (
          <div
            className="product-specifications__item"
            key={item.key}
          >
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
