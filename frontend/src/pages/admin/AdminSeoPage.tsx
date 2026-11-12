
import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

import { adminSeoPageOptions } from "../../i18n/adminSeoMessages";

export default function AdminSeoPage() {
  const { locale, messages, notify } = useAdminContext();

  const pages = adminSeoPageOptions[locale];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    notify(
      `${messages.feedback.formChecked} ${messages.feedback.notSaved}`,
      "info"
    );
  }

  return (
    <div className="admin-page">
      <AdminPageHeading
        title={messages.seo.title}
        description={messages.seo.description}
      />

      <section className="admin-form-panel">
        <div className="admin-form-panel__heading">
          <div>
            <h2>{messages.seo.title}</h2>
            <p>{messages.seo.help}</p>
          </div>
        </div>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-field">
            <label htmlFor="seo-page">
              {messages.seo.page}
              <span>*</span>
            </label>

            <select
              id="seo-page"
              name="page"
              required
              defaultValue=""
            >
              <option value="" disabled>
                {messages.common.selectOption}
              </option>

              {pages.map((page) => (
                <option
                  value={page.value}
                  key={page.value}
                >
                  {page.label}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="seo-title">
              {messages.seo.pageTitle}
            </label>

            <input
              id="seo-title"
              name="title"
              type="text"
              maxLength={70}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="seo-description">
              {messages.seo.pageDescription}
            </label>

            <textarea
              id="seo-description"
              name="description"
              rows={4}
              maxLength={180}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="seo-h1">
              {messages.seo.h1}
            </label>

            <input
              id="seo-h1"
              name="h1"
              type="text"
              maxLength={200}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="seo-canonical">
              {messages.seo.canonical}
            </label>

            <input
              id="seo-canonical"
              name="canonical"
              type="url"
              placeholder="https://"
            />
          </div>

          <div className="admin-form__actions">
            <button
              className="admin-button admin-button--primary"
              type="submit"
            >
              {messages.common.checkForm}
            </button>
          </div>
        </form>
      </section>

      <div className="admin-development-note">
        <strong>{messages.common.frontendMode}</strong>
        <p>{messages.common.frontendModeDescription}</p>
      </div>
    </div>
  );
}
