
import { useState } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

import { localeCodes } from "../../i18n/messages";

import type { Locale } from "../../i18n/messages";

const languageLabels: Record<Locale, string> = {
  ru: "Русский",
  be: "Белорусский",
  en: "English",
  zh: "中文",
};

export default function AdminTranslationsPage() {
  const { messages } = useAdminContext();

  const [sourceLanguage, setSourceLanguage] =
    useState<Locale>("ru");

  const [targetLanguage, setTargetLanguage] =
    useState<Locale>("be");

  const [contentType, setContentType] =
    useState("products");

  return (
    <div className="admin-page">
      <AdminPageHeading
        title={messages.translations.title}
        description={messages.translations.description}
      />

      <section className="admin-form-panel">
        <div className="admin-form-panel__heading">
          <div>
            <h2>{messages.translations.contentType}</h2>

            <p>{messages.translations.description}</p>
          </div>
        </div>

        <div className="admin-form">
          <div className="admin-form__grid">
            <div className="admin-field">
              <label htmlFor="translation-type">
                {messages.translations.contentType}
              </label>

              <select
                id="translation-type"
                value={contentType}
                onChange={(event) =>
                  setContentType(event.currentTarget.value)
                }
              >
                <option value="categories">
                  {messages.translations.categories}
                </option>

                <option value="products">
                  {messages.translations.products}
                </option>

                <option value="news">
                  {messages.translations.news}
                </option>

                <option value="pages">
                  {messages.translations.pages}
                </option>
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="translation-source">
                {messages.translations.sourceLanguage}
              </label>

              <select
                id="translation-source"
                value={sourceLanguage}
                onChange={(event) =>
                  setSourceLanguage(
                    event.currentTarget.value as Locale
                  )
                }
              >
                {localeCodes.map((code) => (
                  <option value={code} key={code}>
                    {languageLabels[code]}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="translation-target">
                {messages.translations.targetLanguage}
              </label>

              <select
                id="translation-target"
                value={targetLanguage}
                onChange={(event) =>
                  setTargetLanguage(
                    event.currentTarget.value as Locale
                  )
                }
              >
                {localeCodes
                  .filter((code) => code !== sourceLanguage)
                  .map((code) => (
                    <option value={code} key={code}>
                      {languageLabels[code]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-table-panel">
        <div className="admin-table-panel__heading">
          <h2>{messages.translations.title}</h2>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{messages.translations.tableItem}</th>
                <th>{messages.translations.tableRussian}</th>
                <th>{messages.translations.tableBelarusian}</th>
                <th>{messages.translations.tableEnglish}</th>
                <th>{messages.translations.tableChinese}</th>
                <th>{messages.translations.tableStatus}</th>
              </tr>
            </thead>

            <tbody />
          </table>
        </div>

        <div className="admin-table-empty">
          <span>—</span>

          <h3>{messages.translations.emptyTitle}</h3>

          <p>{messages.translations.emptyDescription}</p>
        </div>
      </section>
    </div>
  );
}
