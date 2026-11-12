
import { useState } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

export default function AdminCategoriesPage() {
  const { messages, notify } = useAdminContext();

  const [formOpen, setFormOpen] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    notify(
      `${messages.feedback.formChecked} ${messages.feedback.notSaved}`,
      "info"
    );
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
              <p>{messages.common.frontendModeDescription}</p>
            </div>

            <button
              className="admin-icon-button"
              type="button"
              aria-label={messages.common.close}
              onClick={() => setFormOpen(false)}
            >
              ×
            </button>
          </div>

          <form
            className="admin-form"
            onSubmit={handleSubmit}
          >
            <div className="admin-form__grid">
              <div className="admin-field">
                <label htmlFor="category-name">
                  {messages.categories.name}
                  <span>*</span>
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  maxLength={150}
                  required
                  placeholder={messages.categories.name}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="category-slug">
                  {messages.categories.slug}
                </label>

                <input
                  id="category-slug"
                  name="slug"
                  type="text"
                  maxLength={180}
                  placeholder={messages.categories.slug}
                />
              </div>
            </div>

            <div className="admin-field">
              <label htmlFor="category-parent">
                {messages.categories.parent}
              </label>

              <select
                id="category-parent"
                name="parentId"
                defaultValue=""
                disabled
              >
                <option value="">
                  {messages.categories.rootCategory}
                </option>
              </select>

              <small>
                {messages.categories.noParentOptions}
              </small>
            </div>

            <div className="admin-field">
              <label htmlFor="category-description">
                {messages.categories.descriptionField}
              </label>

              <textarea
                id="category-description"
                name="description"
                rows={4}
                maxLength={2000}
                placeholder={messages.categories.descriptionField}
              />
            </div>

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
                onClick={() => setFormOpen(false)}
              >
                {messages.common.cancel}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-empty-list">
        <div className="admin-empty-list__symbol">
          CT
        </div>

        <h2>{messages.categories.noCategoriesTitle}</h2>

        <p>{messages.categories.noCategoriesDescription}</p>
      </section>
    </div>
  );
}
