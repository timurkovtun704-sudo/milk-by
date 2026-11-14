
import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuth } from "../../hooks/useAuth";

import { adminApiMessages } from "../../i18n/adminApiMessages";

import { getProductCategories } from "../../services/productService";
import { createCategory } from "../../services/categoryService";

import type { ProductCategory } from "../../types/catalog";

import "../../styles/admin.css";
import "../../styles/admin-api.css";

export default function AdminCategoriesPage() {
  const { locale, messages, notify } = useAdminContext();
  const { accessToken } = useAuth();

  const labels = adminApiMessages[locale];

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  // Получение актуального списка категорий
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCategories() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await getProductCategories(
          controller.signal
        );

        if (active) {
          setCategories(result);
        }
      } catch (error) {
        if (
          !active ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        console.error("Ошибка загрузки категорий:", error);

        setLoadError(
          error instanceof Error
            ? error.message
            : labels.categoriesError
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadCategories();

    return () => {
      active = false;
      controller.abort();
    };
  }, [reloadKey, labels.categoriesError]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!accessToken) {
      notify("Не найден токен авторизации", "warning");
      return;
    }

    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      return;
    }

    setIsSaving(true);

    try {
      await createCategory(
        { name: trimmedName },
        accessToken
      );

      notify(labels.categoryCreateSuccess, "success");

      setCategoryName("");
      setFormOpen(false);
      setReloadKey((current) => current + 1);
    } catch (error) {
      console.error("Ошибка создания категории:", error);

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeading
        title={messages.categories.title}
        description={messages.categories.description}
        action={
          <button
            className="admin-button admin-button--primary"
            type="button"
            onClick={() => setFormOpen((current) => !current)}
          >
            <span aria-hidden="true">+</span>
            {messages.categories.addTitle}
          </button>
        }
      />

      {formOpen && (
        <section className="admin-form-panel">
          <div className="admin-form-panel__heading">
            <div>
              <h2>{messages.categories.formTitle}</h2>
            </div>

            <button
              className="admin-icon-button"
              type="button"
              aria-label={messages.common.close}
              onClick={() => setFormOpen(false)}
              disabled={isSaving}
            >
              ×
            </button>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-field">
              <label htmlFor="category-name">
                {labels.categoryName} *
              </label>

              <input
                id="category-name"
                name="name"
                type="text"
                value={categoryName}
                onChange={(event) =>
                  setCategoryName(event.currentTarget.value)
                }
                maxLength={150}
                required
                disabled={isSaving}
                placeholder={labels.categoryName}
              />
            </div>

            <p className="admin-api-hint">
              {messages.categories.noParentOptions}
            </p>

            <div className="admin-form__actions">
              <button
                className="admin-button admin-button--primary"
                type="submit"
                disabled={isSaving || !categoryName.trim()}
              >
                {isSaving ? labels.saving : labels.save}
              </button>

              <button
                className="admin-button admin-button--secondary"
                type="button"
                onClick={() => setFormOpen(false)}
                disabled={isSaving}
              >
                {labels.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      {isLoading ? (
        <p className="admin-api-state" role="status">
          {labels.categoriesLoading}
        </p>
      ) : loadError ? (
        <section className="admin-api-state" role="alert">
          <h2>{labels.categoriesError}</h2>
          <p>{loadError}</p>

          <button
            className="admin-button admin-button--secondary"
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
          >
            {labels.retry}
          </button>
        </section>
      ) : categories.length === 0 ? (
        <section className="admin-empty-list">
          <h2>{messages.categories.noCategoriesTitle}</h2>
          <p>{messages.categories.noCategoriesDescription}</p>
        </section>
      ) : (
        <section className="admin-data-list">
          {categories.map((category) => (
            <article
              className="admin-data-card"
              key={category.id}
            >
              <div className="admin-data-card__content">
                <h2>{category.name}</h2>
                <div className="admin-data-card__meta">
                  <span>URL: {category.slug}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
