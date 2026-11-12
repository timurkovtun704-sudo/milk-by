
import type { ProductPackaging } from "../../types/catalog";
import type { CatalogUiMessages } from "../../i18n/catalogMessages";

interface ProductPackagingSelectorProps {
  packagings: readonly ProductPackaging[];

  selectedPackagingId: string | null;

  onSelect: (id: string) => void;

  messages: CatalogUiMessages;
}

export default function ProductPackagingSelector({
  packagings,
  selectedPackagingId,
  onSelect,
  messages,
}: ProductPackagingSelectorProps) {
  if (packagings.length === 0) {
    return null;
  }

  const selected =
    packagings.find(
      (item) => item.id === selectedPackagingId
    ) ?? packagings[0];

  return (
    <section className="packaging-selector">
      <h2>{messages.productPackagingTitle}</h2>

      <span className="packaging-selector__label">
        {messages.productPackagingSelect}
      </span>

      <div
        className="packaging-selector__options"
        role="group"
        aria-label={messages.productPackagingTitle}
      >
        {packagings.map((packaging) => (
          <button
            type="button"
            key={packaging.id}
            className={`packaging-option ${
              selected.id === packaging.id
                ? "packaging-option--active"
                : ""
            }`}
            aria-pressed={selected.id === packaging.id}
            onClick={() => onSelect(packaging.id)}
          >
            {packaging.label}
          </button>
        ))}
      </div>

      <div className="packaging-selector__details">
        {selected.weight !== undefined &&
          selected.weight !== null && (
            <div>
              <span>{messages.productWeight}</span>

              <strong>
                {selected.weight}
                {selected.unit
                  ? ` ${selected.unit}`
                  : ""}
              </strong>
            </div>
          )}

        {selected.volume !== undefined &&
          selected.volume !== null && (
            <div>
              <span>{messages.productVolume}</span>

              <strong>
                {selected.volume}
                {selected.unit
                  ? ` ${selected.unit}`
                  : ""}
              </strong>
            </div>
          )}

        {selected.shelfLife && (
          <div>
            <span>{messages.productShelfLife}</span>
            <strong>{selected.shelfLife}</strong>
          </div>
        )}
      </div>
    </section>
  );
}
