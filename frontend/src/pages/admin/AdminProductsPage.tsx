
import { useState } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

import type { ProductCategory } from "../../types/catalog";

export default function AdminProductsPage() {
  const { messages, notify } = useAdminContext();

  const [formOpen, setFormOpen] = useState(false);

  const [attributeRows, setAttributeRows] =
    useState<number[]>([]);

  const [packagingRows, setPackagingRows] =
    useState<number[]>([]);

  const [nextAttributeId, setNextAttributeId] = useState(0);
  const [nextPackagingId, setNextPackagingId] = useState(0);

  // Пока реальных категорий нет.
  // Они появятся после подключения API.
  const categories: readonly ProductCategory[] = [];

  function openForm() {
    setFormOpen(true);
    setAttributeRows([]);
    setPackagingRows([]);
    setNextAttributeId(0);
    setNextPackagingId(0);
  }

  function closeForm() {
    setFormOpen(false);
    setAttributeRows([]);
    setPackagingRows([]);
  }

  function addAttribute() {
    setAttributeRows((previous) => [
      ...previous,
      nextAttributeId,
    ]);

    setNextAttributeId((previous) => previous + 1);
  }

  function addPackaging() {
    setPackagingRows((previous) => [
      ...previous,
      nextPackagingId,
    ]);

    setNextPackagingId((previous) => previous + 1);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (categories.length === 0) {
      notify(
        messages.products.noCategories,
        "warning"
      );

      return;
    }

    notify(
      `${messages.feedback.formChecked} ${messages.feedback.notSaved}`,
      "info"
    );
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
            onClick={() =>
              formOpen ? closeForm() : openForm()
            }
          >
            <span aria-hidden="true">+</span>
            {messages.products.addTitle}
          </button>
        }
      />

      {formOpen && (
        <section className="admin-form-panel">
          <div className="admin-form-panel__heading">
            <div>
              <h2>{messages.products.formTitle}</h2>
              <p>{messages.products.noCategories}</p>
            </div>

            <button
              className="admin-icon-button"
              type="button"
              aria-label={messages.common.close}
              onClick={closeForm}
            >
              ×
            </button>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <section className="admin-form-section">
              <h3>{messages.products.formTitle}</h3>

              <div className="admin-form__grid">
                <div className="admin-field">
                  <label htmlFor="product-name">
                    {messages.products.name}
                    <span>*</span>
                  </label>

                  <input
                    id="product-name"
                    name="name"
                    type="text"
                    required
                    maxLength={200}
                    placeholder={messages.products.name}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="product-slug">
                    {messages.products.slug}
                  </label>

                  <input
                    id="product-slug"
                    name="slug"
                    type="text"
                    maxLength={200}
                    placeholder={messages.products.slug}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="product-category">
                  {messages.products.category}
                  <span>*</span>
                </label>

                <select
                  id="product-category"
                  name="categoryId"
                  required
                  disabled={categories.length === 0}
                  defaultValue=""
                >
                  <option value="">
                    {messages.common.selectOption}
                  </option>

                  {categories.map((category) => (
                    <option
                      value={category.id}
                      key={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>

                <small>{messages.products.noCategories}</small>
              </div>

              <div className="admin-field">
                <label htmlFor="product-description">
                  {messages.products.descriptionField}
                </label>

                <textarea
                  id="product-description"
                  name="description"
                  rows={5}
                  maxLength={10000}
                  placeholder={messages.products.descriptionField}
                />
              </div>
            </section>

            <section className="admin-form-section">
              <h3>{messages.products.images}</h3>

              <div className="admin-field">
                <label htmlFor="product-images">
                  {messages.products.images}
                </label>

                <input
                  id="product-images"
                  name="images"
                  type="file"
                  accept="image/*"
                  multiple
                />

                <small>{messages.products.imagesHelp}</small>
              </div>
            </section>

            <section className="admin-form-section">
              <div className="admin-form-section__heading">
                <h3>{messages.products.characteristics}</h3>

                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={addAttribute}
                >
                  + {messages.common.addAttribute}
                </button>
              </div>

              {attributeRows.map((rowId) => (
                <div
                  className="admin-dynamic-row"
                  key={rowId}
                >
                  <div className="admin-field">
                    <label
                      htmlFor={`attribute-name-${rowId}`}
                    >
                      {messages.products.attributeName}
                    </label>

                    <input
                      id={`attribute-name-${rowId}`}
                      name={`attributes[${rowId}][name]`}
                      type="text"
                    />
                  </div>

                  <div className="admin-field">
                    <label
                      htmlFor={`attribute-value-${rowId}`}
                    >
                      {messages.products.attributeValue}
                    </label>

                    <input
                      id={`attribute-value-${rowId}`}
                      name={`attributes[${rowId}][value]`}
                      type="text"
                    />
                  </div>

                  <button
                    type="button"
                    className="admin-icon-button admin-icon-button--remove"
                    aria-label={messages.common.remove}
                    onClick={() =>
                      setAttributeRows((previous) =>
                        previous.filter((id) => id !== rowId)
                      )
                    }
                  >
                    ×
                  </button>
                </div>
              ))}
            </section>

            <section className="admin-form-section">
              <div className="admin-form-section__heading">
                <h3>{messages.products.packagings}</h3>

                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={addPackaging}
                >
                  + {messages.common.addPackaging}
                </button>
              </div>

              {packagingRows.map((rowId) => (
                <div
                  className="admin-dynamic-group"
                  key={rowId}
                >
                  <div className="admin-dynamic-group__heading">
                    <strong>
                      {messages.products.packagingName}
                    </strong>

                    <button
                      type="button"
                      className="admin-icon-button admin-icon-button--remove"
                      aria-label={messages.common.remove}
                      onClick={() =>
                        setPackagingRows((previous) =>
                          previous.filter((id) => id !== rowId)
                        )
                      }
                    >
                      ×
                    </button>
                  </div>

                  <div className="admin-form__grid admin-form__grid--three">
                    <div className="admin-field">
                      <label htmlFor={`packaging-name-${rowId}`}>
                        {messages.products.packagingName}
                      </label>

                      <input
                        id={`packaging-name-${rowId}`}
                        name={`packagings[${rowId}][name]`}
                        type="text"
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`packaging-weight-${rowId}`}>
                        {messages.products.weight}
                      </label>

                      <input
                        id={`packaging-weight-${rowId}`}
                        name={`packagings[${rowId}][weight]`}
                        type="number"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`packaging-volume-${rowId}`}>
                        {messages.products.volume}
                      </label>

                      <input
                        id={`packaging-volume-${rowId}`}
                        name={`packagings[${rowId}][volume]`}
                        type="number"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`packaging-unit-${rowId}`}>
                        {messages.products.unit}
                      </label>

                      <input
                        id={`packaging-unit-${rowId}`}
                        name={`packagings[${rowId}][unit]`}
                        type="text"
                      />
                    </div>

                    <div className="admin-field">
                      <label htmlFor={`packaging-shelf-${rowId}`}>
                        {messages.products.shelfLife}
                      </label>

                      <input
                        id={`packaging-shelf-${rowId}`}
                        name={`packagings[${rowId}][shelfLife]`}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="admin-form-section">
              <h3>{messages.products.status}</h3>

              <div className="admin-field">
                <label htmlFor="product-status">
                  {messages.products.status}
                </label>

                <select
                  id="product-status"
                  name="status"
                  defaultValue="draft"
                >
                  <option value="draft">
                    {messages.products.draft}
                  </option>

                  <option value="published">
                    {messages.products.published}
                  </option>

                  <option value="hidden">
                    {messages.products.hidden}
                  </option>
                </select>
              </div>
            </section>

            <section className="admin-form-section">
              <h3>SEO</h3>

              <div className="admin-field">
                <label htmlFor="product-seo-title">
                  {messages.products.seoTitle}
                </label>

                <input
                  id="product-seo-title"
                  name="seoTitle"
                  type="text"
                  maxLength={70}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="product-seo-description">
                  {messages.products.seoDescription}
                </label>

                <textarea
                  id="product-seo-description"
                  name="seoDescription"
                  rows={3}
                  maxLength={180}
                />
              </div>
            </section>

            <div className="admin-form__actions">
              <button
                className="admin-button admin-button--primary"
                type="submit"
              >
                {messages.common.checkForm}
              </button>

              <button
                className="admin-button admin-button--secondary"
                type="button"
                onClick={closeForm}
              >
                {messages.common.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-empty-list">
        <div className="admin-empty-list__symbol">
          PR
        </div>

        <h2>{messages.common.noRecords}</h2>

        <p>{messages.common.noRecordsDescription}</p>
      </section>
    </div>
  );
}
