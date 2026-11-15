import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuth } from "../../hooks/useAuth";

import { adminApiMessages } from "../../i18n/adminApiMessages";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  getProductCategories,
  updateAdminProduct,
} from "../../services/productService";

import type {
  AdminProduct,
  CreateAdminProductDto,
  UpdateAdminProductDto,
} from "../../services/productService";

import type { ProductCategory } from "../../types/catalog";

import {
  EMPTY_PRODUCT_CHARACTERISTICS,
  characteristicsToFormValues,
  getProductCharacteristicDefinitions,
  readProductCharacteristics,
} from "../../utils/productCharacteristics";

import type {
  ProductCharacteristicFormValues,
} from "../../utils/productCharacteristics";

import "../../styles/admin.css";
import "../../styles/admin-api.css";

interface ProductFormState extends ProductCharacteristicFormValues {
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  isActive: boolean;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  description: "",
  imageUrl: "",
  category: "",
  isActive: true,
  ...EMPTY_PRODUCT_CHARACTERISTICS,
};

type RequiredProductCharacteristics = Pick<
  CreateAdminProductDto,
  | "fat_procent"
  | "weight"
  | "storage_conditions"
  | "shelf_life"
  | "energy_value"
  | "items_per_case"
>;

const REQUIRED_TEXT_CHARACTERISTIC_KEYS = [
  "weight",
  "storage_conditions",
  "shelf_life",
  "energy_value",
  "items_per_case",
] as const;

export default function AdminProductsPage() {
  const { locale, messages, notify } = useAdminContext();
  const { accessToken, role } = useAuth();

  const labels = adminApiMessages[locale];

  const characteristicDefinitions =
    getProductCharacteristicDefinitions(locale);

  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    null
  );

  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);

  const [reloadKey, setReloadKey] = useState(0);

  const canDelete = role === "admin";

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  // Загрузка товаров и категорий из backend
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadData() {
      if (!accessToken) {
        setLoadError("Не найден токен авторизации");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const [loadedProducts, loadedCategories] =
          await Promise.all([
            getAdminProducts(accessToken, controller.signal),
            getProductCategories(controller.signal),
          ]);

        if (!active) {
          return;
        }

        setProducts(loadedProducts);
        setCategories(loadedCategories);
      } catch (error) {
        if (
          !active ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        console.error(
          "Ошибка загрузки административных товаров:",
          error
        );

        setLoadError(
          error instanceof Error
            ? error.message
            : labels.loadError
        );
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [accessToken, reloadKey, labels.loadError]);

  // Открытие формы создания товара
  function openCreateForm() {
    setEditingProductId(null);

    setForm({
      ...EMPTY_FORM,
      category: categories[0]?.name ?? "",
    });

    setFormOpen(true);
  }

  // Открытие формы редактирования товара
  function openEditForm(product: AdminProduct) {
    setEditingProductId(product.id);

    const characteristics = readProductCharacteristics(
      product.attributes ?? {}
    );

    setForm({
      name: product.name,
      description: product.description ?? "",
      imageUrl: product.imageUrl ?? "",
      category: product.categoryId,
      isActive: product.isActive,

      ...characteristicsToFormValues(characteristics),
    });

    setFormOpen(true);
  }

  // Закрытие формы и сброс её состояния
  function closeForm() {
    setFormOpen(false);
    setEditingProductId(null);
    setForm(EMPTY_FORM);
  }

  // Обновление отдельного поля формы
  function updateField<K extends keyof ProductFormState>(
    key: K,
    value: ProductFormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  // Проверка и формирование обязательных характеристик
  function getRequiredCharacteristics():
    | RequiredProductCharacteristics
    | null {
    const fatText = form.fat_procent.trim();

    if (fatText === "") {
      notify(
        "Массовая доля жира обязательна для заполнения",
        "warning"
      );

      return null;
    }

    const fatProcent = Number(fatText);

    if (
      !Number.isFinite(fatProcent) ||
      fatProcent < 0 ||
      fatProcent > 100
    ) {
      notify(
        "Массовая доля жира должна быть числом от 0 до 100",
        "warning"
      );

      return null;
    }

    // Проверяем обязательные текстовые характеристики
    for (const key of REQUIRED_TEXT_CHARACTERISTIC_KEYS) {
      if (!form[key].trim()) {
        const definition = characteristicDefinitions.find(
          (item) => item.key === key
        );

        notify(
          `${definition?.label ?? key}: обязательное поле`,
          "warning"
        );

        return null;
      }
    }

    return {
      fat_procent: fatProcent,
      weight: form.weight.trim(),
      storage_conditions: form.storage_conditions.trim(),
      shelf_life: form.shelf_life.trim(),
      energy_value: form.energy_value.trim(),
      items_per_case: form.items_per_case.trim(),
    };
  }

  // Сохранение товара
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!accessToken) {
      notify("Не найден токен авторизации", "warning");
      return;
    }

    if (!form.category) {
      notify(labels.noCategories, "warning");
      return;
    }

    const characteristicValues = getRequiredCharacteristics();

    if (!characteristicValues) {
      return;
    }

    setIsSaving(true);

    try {
      if (editingProductId) {
        const payload: UpdateAdminProductDto = {
          name: form.name.trim(),
          description: form.description.trim(),
          image_url: form.imageUrl.trim(),
          category: form.category,
          is_active: form.isActive,

          ...characteristicValues,
        };

        await updateAdminProduct(
          editingProductId,
          payload,
          accessToken
        );

        notify(labels.updateSuccess, "success");
      } else {
        const payload: CreateAdminProductDto = {
          name: form.name.trim(),
          description: form.description.trim(),
          image_url: form.imageUrl.trim(),
          category: form.category,
          is_active: form.isActive,

          ...characteristicValues,
        };

        await createAdminProduct(payload, accessToken);

        notify(labels.createSuccess, "success");
      }

      closeForm();
      reload();
    } catch (error) {
      console.error("Ошибка сохранения товара:", error);

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

  // Удаление товара
  async function handleDelete(product: AdminProduct) {
    if (!accessToken || !canDelete) {
      return;
    }

    if (!window.confirm(labels.confirmDelete)) {
      return;
    }

    try {
      await deleteAdminProduct(product.id, accessToken);

      notify(labels.deleteSuccess, "success");
      reload();
    } catch (error) {
      console.error("Ошибка удаления товара:", error);

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    }
  }

  return (
    <div className="admin-page">
      <AdminPageHeading
        title={messages.products.title}
        description={messages.products.description}
        action={
          <button
            className="admin-button admin-button--primary"
            type="button"
            onClick={openCreateForm}
            disabled={categories.length === 0}
          >
            <span aria-hidden="true">+</span>
            {messages.products.addTitle}
          </button>
        }
      />

      {categories.length === 0 && !isLoading && (
        <p className="admin-api-hint">
          {labels.noCategories}
        </p>
      )}

      {formOpen && (
        <section className="admin-form-panel">
          <div className="admin-form-panel__heading">
            <div>
              <h2>
                {editingProductId
                  ? labels.edit
                  : labels.create}
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

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="product-name">
                {labels.name} *
              </label>

              <input
                id="product-name"
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField("name", event.currentTarget.value)
                }
                maxLength={200}
                required
                disabled={isSaving}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="product-description">
                {labels.description} *
              </label>

              <textarea
                id="product-description"
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.currentTarget.value)
                }
                rows={5}
                maxLength={10000}
                required
                disabled={isSaving}
              />
            </div>

            {/* Шесть фиксированных характеристик товара */}
            <section className="admin-form-section">
              <h3>{messages.products.characteristics}</h3>

              <div className="admin-form-grid">
                {characteristicDefinitions.map((definition) => (
                  <div className="admin-field" key={definition.key}>
                    <label htmlFor={`product-${definition.key}`}>
                      {definition.label}
                      {definition.unit
                        ? ` (${definition.unit})`
                        : ""} *
                    </label>

                    <input
                      id={`product-${definition.key}`}
                      type={definition.type}
                      value={form[definition.key]}
                      onChange={(event) =>
                        updateField(
                          definition.key,
                          event.currentTarget.value
                        )
                      }
                      min={
                        definition.key === "fat_procent"
                          ? 0
                          : undefined
                      }
                      max={
                        definition.key === "fat_procent"
                          ? 100
                          : undefined
                      }
                      step={
                        definition.key === "fat_procent"
                          ? "0.01"
                          : undefined
                      }
                      maxLength={
                        definition.type === "text"
                          ? 1000
                          : undefined
                      }
                      required
                      disabled={isSaving}
                    />
                  </div>
                ))}
              </div>
            </section>

            <div className="admin-field">
              <label htmlFor="product-image-url">
                {labels.imageUrl} *
              </label>

              <input
                id="product-image-url"
                type="url"
                value={form.imageUrl}
                onChange={(event) =>
                  updateField("imageUrl", event.currentTarget.value)
                }
                placeholder="https://example.com/product.jpg"
                required
                disabled={isSaving}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="product-category">
                {labels.category} *
              </label>

              <select
                id="product-category"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.currentTarget.value)
                }
                required
                disabled={isSaving || categories.length === 0}
              >
                <option value="">
                  {messages.common.selectOption}
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="product-status">
                {labels.status}
              </label>

              <select
                id="product-status"
                value={form.isActive ? "active" : "inactive"}
                onChange={(event) =>
                  updateField(
                    "isActive",
                    event.currentTarget.value === "active"
                  )
                }
                disabled={isSaving}
              >
                <option value="active">
                  {labels.active}
                </option>

                <option value="inactive">
                  {labels.inactive}
                </option>
              </select>
            </div>

            <p className="admin-api-hint">
              {messages.products.imagesHelp}
              {" "}
              {messages.products.packagings}:{" "}
              {messages.common.notAvailable}.
            </p>

            <div className="admin-form__actions">
              <button
                className="admin-button admin-button--primary"
                type="submit"
                disabled={isSaving || categories.length === 0}
              >
                {isSaving ? labels.saving : labels.save}
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
        <p role="status" className="admin-api-state">
          {labels.loading}
        </p>
      ) : loadError ? (
        <section className="admin-api-state" role="alert">
          <h2>{labels.loadError}</h2>
          <p>{loadError}</p>

          <button
            className="admin-button admin-button--secondary"
            type="button"
            onClick={reload}
          >
            {labels.retry}
          </button>
        </section>
      ) : products.length === 0 ? (
        <section className="admin-empty-list">
          <h2>{labels.noProducts}</h2>
        </section>
      ) : (
        <section className="admin-data-list">
          {products.map((product) => (
            <article
              className="admin-data-card"
              key={product.id}
            >
              <div className="admin-data-card__main">
                {product.imageUrl && (
                  <img
                    className="admin-data-card__image"
                    src={product.imageUrl}
                    alt=""
                    loading="lazy"
                  />
                )}

                <div className="admin-data-card__content">
                  <h2>{product.name}</h2>

                  <p>{product.description}</p>

                  <div className="admin-data-card__meta">
                    <span>{product.categoryId}</span>

                    <span
                      className={
                        product.isActive
                          ? "admin-status admin-status--active"
                          : "admin-status admin-status--inactive"
                      }
                    >
                      {product.isActive
                        ? labels.active
                        : labels.inactive}
                    </span>

                    <span>ID: {product.id}</span>
                  </div>
                </div>
              </div>

              <div className="admin-data-card__actions">
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={() => openEditForm(product)}
                >
                  {labels.edit}
                </button>

                {canDelete && (
                  <button
                    className="admin-button admin-button--danger"
                    type="button"
                    onClick={() => void handleDelete(product)}
                  >
                    {labels.delete}
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