
import { useState } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

import type { NewsCategory } from "../../types/news";

export default function AdminNewsPage() {
  const { messages, notify } = useAdminContext();

  const [formOpen, setFormOpen] = useState(false);

  // Категории будут поступать из будущего API.
  const categories: readonly NewsCategory[] = [];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (categories.length === 0) {
      notify(
        messages.news.noCategories,
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
        title={messages.news.title}
        description={messages.news.description}
        action={
          <button
            className="admin-button admin-button--primary"
            type="button"
            onClick={() => setFormOpen((current) => !current)}
          >
            <span aria-hidden="true">+</span>
            {messages.news.addTitle}
          </button>
        }
      />

      {formOpen && (
        <section className="admin-form-panel">
          <div className="admin-form-panel__heading">
            <div>
              <h2>{messages.news.formTitle}</h2>

              <p>
                {messages.common.frontendModeDescription}
              </p>
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
            <section className="admin-form-section">
              <h3>{messages.news.formTitle}</h3>

              <div className="admin-form__grid">
                <div className="admin-field">
                  <label htmlFor="news-title">
                    {messages.news.headline}
                    <span>*</span>
                  </label>

                  <input
                    id="news-title"
                    name="title"
                    type="text"
                    required
                    maxLength={250}
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="news-slug">
                    {messages.news.slug}
                  </label>

                  <input
                    id="news-slug"
                    name="slug"
                    type="text"
                    maxLength={200}
                  />
                </div>
              </div>

              <div className="admin-form__grid">
                <div className="admin-field">
                  <label htmlFor="news-date">
                    {messages.news.date}
                    <span>*</span>
                  </label>

                  <input
                    id="news-date"
                    name="publishedAt"
                    type="date"
                    required
                  />
                </div>

                <div className="admin-field">
                  <label htmlFor="news-category">
                    {messages.news.category}
                    <span>*</span>
                  </label>

                  <select
                    id="news-category"
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

                  <small>{messages.news.noCategories}</small>
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="news-summary">
                  {messages.news.summary}
                </label>

                <textarea
                  id="news-summary"
                  name="summary"
                  rows={3}
                  maxLength={1000}
                />
              </div>
            </section>

            <section className="admin-form-section">
              <h3>{messages.news.image}</h3>

              <div className="admin-field">
                <label htmlFor="news-image">
                  {messages.news.image}
                </label>

                <input
                  id="news-image"
                  name="coverImage"
                  type="file"
                  accept="image/*"
                />

                <small>{messages.news.imageHelp}</small>
              </div>
            </section>

            <section className="admin-form-section">
              <h3>{messages.news.content}</h3>

              <div className="admin-field">
                <label htmlFor="news-content">
                  {messages.news.content}
                  <span>*</span>
                </label>

                <textarea
                  id="news-content"
                  name="content"
                  rows={12}
                  required
                />
              </div>
            </section>

            <section className="admin-form-section">
              <h3>{messages.news.status}</h3>

              <div className="admin-field">
                <label htmlFor="news-status">
                  {messages.news.status}
                </label>

                <select
                  id="news-status"
                  name="status"
                  defaultValue="draft"
                >
                  <option value="draft">
                    {messages.news.draft}
                  </option>

                  <option value="published">
                    {messages.news.published}
                  </option>
                </select>
              </div>
            </section>

            <section className="admin-form-section">
              <h3>SEO</h3>

              <div className="admin-field">
                <label htmlFor="news-seo-title">
                  {messages.news.seoTitle}
                </label>

                <input
                  id="news-seo-title"
                  name="seoTitle"
                  type="text"
                  maxLength={70}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="news-seo-description">
                  {messages.news.seoDescription}
                </label>

                <textarea
                  id="news-seo-description"
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
          NW
        </div>

        <h2>{messages.common.noRecords}</h2>

        <p>{messages.common.noRecordsDescription}</p>
      </section>
    </div>
  );
}
