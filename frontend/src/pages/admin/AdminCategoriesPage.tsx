
import {
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuth } from "../../hooks/useAuth";

import { adminApiMessages } from "../../i18n/adminApiMessages";

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from "../../services/categoryService";

import type { ProductCategory } from "../../types/catalog";

import "../../styles/admin.css";
import "../../styles/admin-api.css";

export default function AdminCategoriesPage() {
  const { locale, messages, notify } = useAdminContext();
  const { accessToken, role } = useAuth();

  const labels = adminApiMessages[locale];

  const canDelete = role === "admin";

  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [categoryName, setCategoryName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] =
    useState<string | null>(null);

  const [reloadKey, setReloadKey] = useState(0);

  // Загрузка категорий с числовыми ID
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadCategories() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await getAdminCategories(
          controller.signal
        );

        if (active) {
          setCategories(result);
        }
      } catch (error) {
        if (
          !active ||
          (error instanceof Error &&
            error.name === "AbortError")
        ) {
          return;
        }

        console.error(
          "Ошибка загрузки категорий:",
          error
        );

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

  function openCreateForm() {
    setEditingCategoryId(null);
    setCategoryName("");
    setFormOpen(true);
  }

  function openEditForm(category: ProductCategory) {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingCategoryId(null);
    setCategoryName("");
  }

  // Создание или переименование категории
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
      if (editingCategoryId) {
        await updateCategory(
          editingCategoryId,
          { name: trimmedName },
          accessToken
        );

        notify(
          labels.categoryUpdateSuccess,
          "success"
        );
      } else {
        await createCategory(
          { name: trimmedName },
          accessToken
        );

        notify(
          labels.categoryCreateSuccess,
          "success"
        );
      }

      closeForm();

      setReloadKey((current) => current + 1);
    } catch (error) {
      console.error(
        "Ошибка сохранения категории:",
        error
      );

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

  // Удаление категории
  async function handleDelete(
    category: ProductCategory
  ) {
    if (!accessToken || !canDelete) {
      return;
    }

    const confirmed = window.confirm(
      `${labels.confirmDeleteCategory}\n\n${category.name}`
    );

    if (!confirmed) {
      return;
    }

    setDeletingCategoryId(category.id);

    try {
      await deleteCategory(
        category.id,
        accessToken
      );

      notify(
        labels.categoryDeleteSuccess,
        "success"
      );

      if (editingCategoryId === category.id) {
        closeForm();
      }

      setReloadKey((current) => current + 1);
    } catch (error) {
      console.error(
        "Ошибка удаления категории:",
        error
      );

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    } finally {
      setDeletingCategoryId(null);
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
            onClick={openCreateForm}
            disabled={isSaving || deletingCategoryId !== null}
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
              <h2>
                {editingCategoryId
                  ? labels.edit
                  : messages.categories.formTitle}
              </h2>
            </div>

            <button
              className="admin-icon-button"
              type="button"
              aria-label={messages.common.close}
              onClick={closeForm}
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
                  setCategoryName(
                    event.currentTarget.value
                  )
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
                disabled={
                  isSaving ||
                  !categoryName.trim() ||
                  deletingCategoryId !== null
                }
              >
                {isSaving
                  ? labels.saving
                  : labels.save}
              </button>

              <button
                className="admin-button admin-button--secondary"
                type="button"
                onClick={closeForm}
                disabled={isSaving}
              >
                {labels.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      {isLoading ? (
        <p
          className="admin-api-state"
          role="status"
        >
          {labels.categoriesLoading}
        </p>
      ) : loadError ? (
        <section
          className="admin-api-state"
          role="alert"
        >
          <h2>{labels.categoriesError}</h2>
          <p>{loadError}</p>

          <button
            className="admin-button admin-button--secondary"
            type="button"
            onClick={() =>
              setReloadKey((current) => current + 1)
            }
          >
            {labels.retry}
          </button>
        </section>
      ) : categories.length === 0 ? (
        <section className="admin-empty-list">
          <h2>
            {messages.categories.noCategoriesTitle}
          </h2>

          <p>
            {messages.categories.noCategoriesDescription}
          </p>
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
                  <span>ID: {category.id}</span>
                </div>
              </div>

              <div className="admin-data-card__actions">
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={() => openEditForm(category)}
                  disabled={
                    isSaving ||
                    deletingCategoryId !== null
                  }
                >
                  {labels.edit}
                </button>

                {canDelete && (
                  <button
                    className="admin-button admin-button--danger"
                    type="button"
                    onClick={() =>
                      void handleDelete(category)
                    }
                    disabled={
                      deletingCategoryId !== null ||
                      isSaving
                    }
                  >
                    {deletingCategoryId === category.id
                      ? labels.saving
                      : labels.delete}
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </div>
  );
}
