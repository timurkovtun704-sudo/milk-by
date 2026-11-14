import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";
import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuth } from "../../hooks/useAuth";

import seoApiMessages from "../../i18n/seoApiMessages";

import {
  createSeoEntry,
  deleteSeoEntry,
  getSeoEntries,
  updateSeoEntry,
  createSeoRedirect,
  deleteSeoRedirect,
  getSeoRedirects,
  updateSeoRedirect,
} from "../../services/seoService";

import type {
  SeoEntry,
  SeoRedirect,
  SeoEntityType,
  SeoLanguage,
} from "../../services/seoService";

import "../../styles/seo-admin.css";

type SeoTab = "entries" | "redirects";

interface EntryForm {
  id: number | null;
  entity_type: SeoEntityType;
  entity_id: string;
  language_code: SeoLanguage;
  path: string;
  title: string;
  description: string;
  h1: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  is_indexable: boolean;
  is_followable: boolean;
  is_published: boolean;
}

interface RedirectForm {
  id: number | null;
  language_code: SeoLanguage;
  source_path: string;
  destination_path: string;
  is_active: boolean;
}

const PAGE_SIZE = 50;

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error ? error.message : fallback;
}

function createEmptyEntryForm(locale: SeoLanguage): EntryForm {
  return {
    id: null,
    entity_type: "page",
    entity_id: "",
    language_code: locale,
    path: `/${locale}/`,
    title: "",
    description: "",
    h1: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image_url: "",
    is_indexable: true,
    is_followable: true,
    is_published: false,
  };
}

function createEmptyRedirectForm(locale: SeoLanguage): RedirectForm {
  return {
    id: null,
    language_code: locale,
    source_path: `/${locale}/`,
    destination_path: `/${locale}/`,
    is_active: true,
  };
}

export default function AdminSeoPage() {
  const { locale, messages } = useAdminContext();
  const { session } = useAuth();

  const token = session?.accessToken ?? null;

  const language = locale as SeoLanguage;
  const t = seoApiMessages[language] ?? seoApiMessages.ru;

  const [activeTab, setActiveTab] = useState<SeoTab>("entries");

  const [entries, setEntries] = useState<SeoEntry[]>([]);
  const [redirects, setRedirects] = useState<SeoRedirect[]>([]);

  const [entriesPage, setEntriesPage] = useState(1);
  const [redirectsPage, setRedirectsPage] = useState(1);

  const [entriesTotalPages, setEntriesTotalPages] = useState(1);
  const [redirectsTotalPages, setRedirectsTotalPages] = useState(1);

  const [entriesTotal, setEntriesTotal] = useState(0);
  const [redirectsTotal, setRedirectsTotal] = useState(0);

  const [entityFilter, setEntityFilter] =
    useState<SeoEntityType | "all">("all");

  const [languageFilter, setLanguageFilter] =
    useState<SeoLanguage | "all">("all");

  const [entriesLoading, setEntriesLoading] = useState(false);
  const [redirectsLoading, setRedirectsLoading] = useState(false);

  const [entriesError, setEntriesError] = useState("");
  const [redirectsError, setRedirectsError] = useState("");

  const [entryForm, setEntryForm] = useState<EntryForm | null>(null);
  const [redirectForm, setRedirectForm] =
    useState<RedirectForm | null>(null);

  const [savingEntry, setSavingEntry] = useState(false);
  const [savingRedirect, setSavingRedirect] = useState(false);

  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");

  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((current) => current + 1);
  }, []);

  // Загрузка SEO-записей
  useEffect(() => {
    if (!token) {
      setEntries([]);
      return;
    }

    const controller = new AbortController();

    async function loadEntries() {
      setEntriesLoading(true);
      setEntriesError("");

      try {
        const result = await getSeoEntries(
          token!,
          {
            page: entriesPage,
            limit: PAGE_SIZE,
            entity_type:
              entityFilter === "all" ? undefined : entityFilter,
            language_code:
              languageFilter === "all" ? undefined : languageFilter,
          },
          controller.signal,
        );

        setEntries(result.items);
        setEntriesTotal(result.pagination.total);
        setEntriesTotalPages(
          Math.max(1, result.pagination.totalPages),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setEntriesError(
            getErrorMessage(error, t.loadError),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setEntriesLoading(false);
        }
      }
    }

    void loadEntries();

    return () => controller.abort();
  }, [
    token,
    entriesPage,
    entityFilter,
    languageFilter,
    refreshKey,
    t.loadError,
  ]);

  // Загрузка 301-редиректов
  useEffect(() => {
    if (!token) {
      setRedirects([]);
      return;
    }

    const controller = new AbortController();

    async function loadRedirects() {
      setRedirectsLoading(true);
      setRedirectsError("");

      try {
        const result = await getSeoRedirects(
          token!,
          redirectsPage,
          PAGE_SIZE,
          controller.signal,
        );

        setRedirects(result.items);
        setRedirectsTotal(result.pagination.total);
        setRedirectsTotalPages(
          Math.max(1, result.pagination.totalPages),
        );
      } catch (error) {
        if (!controller.signal.aborted) {
          setRedirectsError(
            getErrorMessage(error, t.loadError),
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setRedirectsLoading(false);
        }
      }
    }

    void loadRedirects();

    return () => controller.abort();
  }, [token, redirectsPage, refreshKey, t.loadError]);

  function startCreateEntry() {
    setActionError("");
    setNotice("");
    setEntryForm(createEmptyEntryForm(language));
  }

  function startEditEntry(entry: SeoEntry) {
    setActionError("");
    setNotice("");

    setEntryForm({
      id: entry.id,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id === null
        ? ""
        : String(entry.entity_id),
      language_code: entry.language_code,
      path: entry.path,
      title: entry.title,
      description: entry.description,
      h1: entry.h1,
      canonical_url: entry.canonical_url ?? "",
      og_title: entry.og_title ?? "",
      og_description: entry.og_description ?? "",
      og_image_url: entry.og_image_url ?? "",
      is_indexable: entry.is_indexable,
      is_followable: entry.is_followable,
      is_published: entry.is_published,
    });
  }

  async function handleEntrySubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !entryForm) {
      return;
    }

    setSavingEntry(true);
    setActionError("");
    setNotice("");

    try {
      let entityId: number | null = null;

      if (entryForm.entity_type !== "page") {
        entityId = Number(entryForm.entity_id);

        if (
          !Number.isSafeInteger(entityId) ||
          entityId <= 0
        ) {
          setActionError(t.invalidId);
          setSavingEntry(false);
          return;
        }
      }

      if (entryForm.id === null) {
        await createSeoEntry(token, {
          entity_type: entryForm.entity_type,
          entity_id: entityId,
          language_code: entryForm.language_code,
          path: entryForm.path.trim(),
          title: entryForm.title.trim(),
          description: entryForm.description.trim(),
          h1: entryForm.h1.trim(),
          canonical_url: entryForm.canonical_url.trim() || null,
          og_title: entryForm.og_title.trim() || null,
          og_description: entryForm.og_description.trim() || null,
          og_image_url: entryForm.og_image_url.trim() || null,
          is_indexable: entryForm.is_indexable,
          is_followable: entryForm.is_followable,
          is_published: entryForm.is_published,
        });

        setNotice(t.created);
      } else {
        await updateSeoEntry(token, entryForm.id, {
          path: entryForm.path.trim(),
          title: entryForm.title.trim(),
          description: entryForm.description.trim(),
          h1: entryForm.h1.trim(),
          canonical_url: entryForm.canonical_url.trim() || null,
          og_title: entryForm.og_title.trim() || null,
          og_description: entryForm.og_description.trim() || null,
          og_image_url: entryForm.og_image_url.trim() || null,
          is_indexable: entryForm.is_indexable,
          is_followable: entryForm.is_followable,
          is_published: entryForm.is_published,
        });

        setNotice(t.updated);
      }

      setEntryForm(null);
      refresh();
    } catch (error) {
      setActionError(
        getErrorMessage(error, t.entrySaveError),
      );
    } finally {
      setSavingEntry(false);
    }
  }

  async function handleDeleteEntry(entry: SeoEntry) {
    if (!token || !window.confirm(t.entryDeleteConfirm)) {
      return;
    }

    setActionError("");
    setNotice("");

    try {
      await deleteSeoEntry(token, entry.id);
      setNotice(t.deleted);

      if (entries.length === 1 && entriesPage > 1) {
        setEntriesPage((current) => current - 1);
      } else {
        refresh();
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error, t.entrySaveError),
      );
    }
  }

  function startCreateRedirect() {
    setActionError("");
    setNotice("");
    setRedirectForm(createEmptyRedirectForm(language));
  }

  function startEditRedirect(redirect: SeoRedirect) {
    setActionError("");
    setNotice("");

    setRedirectForm({
      id: redirect.id,
      language_code: redirect.language_code,
      source_path: redirect.source_path,
      destination_path: redirect.destination_path,
      is_active: redirect.is_active,
    });
  }

  async function handleRedirectSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !redirectForm) {
      return;
    }

    setSavingRedirect(true);
    setActionError("");
    setNotice("");

    try {
      if (redirectForm.id === null) {
        await createSeoRedirect(token, {
          language_code: redirectForm.language_code,
          source_path: redirectForm.source_path.trim(),
          destination_path: redirectForm.destination_path.trim(),
          is_active: redirectForm.is_active,
        });

        setNotice(t.redirectCreated);
      } else {
        await updateSeoRedirect(token, redirectForm.id, {
          destination_path: redirectForm.destination_path.trim(),
          is_active: redirectForm.is_active,
        });

        setNotice(t.redirectUpdated);
      }

      setRedirectForm(null);
      refresh();
    } catch (error) {
      setActionError(
        getErrorMessage(error, t.redirectSaveError),
      );
    } finally {
      setSavingRedirect(false);
    }
  }

  async function handleDeleteRedirect(redirect: SeoRedirect) {
    if (!token || !window.confirm(t.redirectDeleteConfirm)) {
      return;
    }

    setActionError("");
    setNotice("");

    try {
      await deleteSeoRedirect(token, redirect.id);
      setNotice(t.redirectDeleted);

      if (redirects.length === 1 && redirectsPage > 1) {
        setRedirectsPage((current) => current - 1);
      } else {
        refresh();
      }
    } catch (error) {
      setActionError(
        getErrorMessage(error, t.redirectSaveError),
      );
    }
  }

  const entityTypeLabel = (type: SeoEntityType) => {
    return {
      page: t.page,
      product: t.product,
      news: t.news,
    }[type];
  };

  return (
    <div className="admin-page seo-admin">
      <AdminPageHeading
        title={messages.seo.title}
        description={messages.seo.description}
      />

      {!token && (
        <div className="seo-admin__message seo-admin__message--error">
          {t.accessError}
        </div>
      )}

      {notice && (
        <div className="seo-admin__message seo-admin__message--success">
          {notice}
        </div>
      )}

      {actionError && (
        <div className="seo-admin__message seo-admin__message--error">
          {actionError}
        </div>
      )}

      <div className="seo-admin__tabs">
        <button
          type="button"
          className={
            activeTab === "entries"
              ? "seo-admin__tab seo-admin__tab--active"
              : "seo-admin__tab"
          }
          onClick={() => {
            setActiveTab("entries");
            setActionError("");
          }}
        >
          {t.tabsEntries}
        </button>

        <button
          type="button"
          className={
            activeTab === "redirects"
              ? "seo-admin__tab seo-admin__tab--active"
              : "seo-admin__tab"
          }
          onClick={() => {
            setActiveTab("redirects");
            setActionError("");
          }}
        >
          {t.tabsRedirects}
        </button>
      </div>

      {/* SEO-метаданные */}
      {activeTab === "entries" && (
        <section className="seo-admin__section">
          <div className="seo-admin__section-heading">
            <div>
              <h2>{t.tabsEntries}</h2>
              <p>{t.entriesHelp}</p>
            </div>

            <button
              type="button"
              className="admin-button admin-button--primary"
              onClick={startCreateEntry}
              disabled={!token}
            >
              + {t.create}
            </button>
          </div>

          <div className="seo-admin__filters">
            <label>
              {t.entityType}

              <select
                value={entityFilter}
                onChange={(event) => {
                  setEntityFilter(
                    event.target.value as SeoEntityType | "all",
                  );
                  setEntriesPage(1);
                }}
              >
                <option value="all">{t.allTypes}</option>
                <option value="page">{t.page}</option>
                <option value="product">{t.product}</option>
                <option value="news">{t.news}</option>
              </select>
            </label>

            <label>
              {t.language}

              <select
                value={languageFilter}
                onChange={(event) => {
                  setLanguageFilter(
                    event.target.value as SeoLanguage | "all",
                  );
                  setEntriesPage(1);
                }}
              >
                <option value="all">{t.allLanguages}</option>
                <option value="ru">Русский</option>
                <option value="be">Беларуская</option>
                <option value="en">English</option>
                <option value="zh">中文</option>
              </select>
            </label>
          </div>

          {entryForm && (
            <form
              className="seo-admin__form"
              onSubmit={handleEntrySubmit}
            >
              <div className="seo-admin__form-heading">
                <h3>{t.entryForm}</h3>

                <button
                  type="button"
                  className="seo-admin__text-button"
                  onClick={() => setEntryForm(null)}
                >
                  {t.cancel}
                </button>
              </div>

              <div className="seo-admin__form-grid">
                <label>
                  {t.entityType}

                  <select
                    value={entryForm.entity_type}
                    disabled={entryForm.id !== null}
                    onChange={(event) => {
                      const type = event.target.value as SeoEntityType;

                      setEntryForm({
                        ...entryForm,
                        entity_type: type,
                        entity_id: "",
                      });
                    }}
                  >
                    <option value="page">{t.page}</option>
                    <option value="product">{t.product}</option>
                    <option value="news">{t.news}</option>
                  </select>
                </label>

                <label>
                  {t.language}

                  <select
                    value={entryForm.language_code}
                    disabled={entryForm.id !== null}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        language_code: event.target.value as SeoLanguage,
                      });
                    }}
                  >
                    <option value="ru">Русский</option>
                    <option value="be">Беларуская</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </label>

                {entryForm.entity_type !== "page" && (
                  <label>
                    {t.entityId}

                    <input
                      type="number"
                      min="1"
                      step="1"
                      required
                      disabled={entryForm.id !== null}
                      value={entryForm.entity_id}
                      placeholder={t.entityIdHint}
                      onChange={(event) => {
                        setEntryForm({
                          ...entryForm,
                          entity_id: event.target.value,
                        });
                      }}
                    />
                  </label>
                )}

                <label className="seo-admin__field-wide">
                  {t.path}

                  <input
                    type="text"
                    required
                    maxLength={1000}
                    value={entryForm.path}
                    placeholder={t.pagePathHint}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        path: event.target.value,
                      });
                    }}
                  />
                </label>

                <label>
                  {t.title}

                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={entryForm.title}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        title: event.target.value,
                      });
                    }}
                  />
                </label>

                <label>
                  {t.h1}

                  <input
                    type="text"
                    required
                    maxLength={200}
                    value={entryForm.h1}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        h1: event.target.value,
                      });
                    }}
                  />
                </label>

                <label className="seo-admin__field-wide">
                  {t.description}

                  <textarea
                    required
                    maxLength={500}
                    rows={3}
                    value={entryForm.description}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        description: event.target.value,
                      });
                    }}
                  />
                </label>

                <label className="seo-admin__field-wide">
                  {t.canonical}

                  <input
                    type="url"
                    value={entryForm.canonical_url}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        canonical_url: event.target.value,
                      });
                    }}
                    placeholder="https://example.com/page"
                  />
                </label>

                <label>
                  {t.ogTitle}

                  <input
                    type="text"
                    maxLength={200}
                    value={entryForm.og_title}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        og_title: event.target.value,
                      });
                    }}
                  />
                </label>

                <label>
                  {t.ogImage}

                  <input
                    type="text"
                    maxLength={2000}
                    value={entryForm.og_image_url}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        og_image_url: event.target.value,
                      });
                    }}
                  />
                </label>

                <label className="seo-admin__field-wide">
                  {t.ogDescription}

                  <textarea
                    rows={2}
                    maxLength={500}
                    value={entryForm.og_description}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        og_description: event.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className="seo-admin__checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={entryForm.is_indexable}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        is_indexable: event.target.checked,
                      });
                    }}
                  />
                  {t.indexable}
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={entryForm.is_followable}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        is_followable: event.target.checked,
                      });
                    }}
                  />
                  {t.followable}
                </label>

                <label>
                  <input
                    type="checkbox"
                    checked={entryForm.is_published}
                    onChange={(event) => {
                      setEntryForm({
                        ...entryForm,
                        is_published: event.target.checked,
                      });
                    }}
                  />
                  {t.published}
                </label>
              </div>

              <div className="seo-admin__form-actions">
                <button
                  type="button"
                  className="seo-admin__button"
                  onClick={() => setEntryForm(null)}
                  disabled={savingEntry}
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button--primary"
                  disabled={savingEntry}
                >
                  {savingEntry ? t.saving : t.save}
                </button>
              </div>
            </form>
          )}

          {entriesLoading && (
            <p className="seo-admin__state">{t.loading}</p>
          )}

          {entriesError && (
            <div className="seo-admin__message seo-admin__message--error">
              {entriesError}

              <button
                type="button"
                className="seo-admin__text-button"
                onClick={refresh}
              >
                {t.retry}
              </button>
            </div>
          )}

          {!entriesLoading && !entriesError && entries.length === 0 && (
            <p className="seo-admin__state">{t.noEntries}</p>
          )}

          <div className="seo-admin__list">
            {entries.map((entry) => (
              <article
                className="seo-admin__item"
                key={entry.id}
              >
                <div className="seo-admin__item-content">
                  <div className="seo-admin__item-topline">
                    <span className="seo-admin__tag">
                      {entityTypeLabel(entry.entity_type)}
                    </span>

                    <span className="seo-admin__tag">
                      {entry.language_code.toUpperCase()}
                    </span>

                    <span
                      className={
                        entry.is_published
                          ? "seo-admin__status seo-admin__status--active"
                          : "seo-admin__status"
                      }
                    >
                      {entry.is_published ? t.published : t.inactive}
                    </span>
                  </div>

                  <h3>{entry.title}</h3>
                  <p className="seo-admin__path">{entry.path}</p>
                  <p>{entry.description}</p>

                  {entry.entity_id !== null && (
                    <small>
                      {t.entityId}: {entry.entity_id}
                    </small>
                  )}
                </div>

                <div className="seo-admin__item-actions">
                  <button
                    type="button"
                    className="seo-admin__button"
                    onClick={() => startEditEntry(entry)}
                  >
                    {t.edit}
                  </button>

                  <button
                    type="button"
                    className="seo-admin__button seo-admin__button--danger"
                    onClick={() => void handleDeleteEntry(entry)}
                  >
                    {t.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="seo-admin__pagination">
            <button
              type="button"
              className="seo-admin__button"
              disabled={entriesPage <= 1 || entriesLoading}
              onClick={() => setEntriesPage((page) => page - 1)}
            >
              {t.previous}
            </button>

            <span>
              {t.pageNumber} {entriesPage} / {entriesTotalPages}
              {" · "}
              {t.total}: {entriesTotal}
            </span>

            <button
              type="button"
              className="seo-admin__button"
              disabled={
                entriesPage >= entriesTotalPages || entriesLoading
              }
              onClick={() => setEntriesPage((page) => page + 1)}
            >
              {t.next}
            </button>
          </div>
        </section>
      )}

      {/* 301-редиректы */}
      {activeTab === "redirects" && (
        <section className="seo-admin__section">
          <div className="seo-admin__section-heading">
            <div>
              <h2>{t.tabsRedirects}</h2>
              <p>{t.redirectsHelp}</p>
            </div>

            <button
              type="button"
              className="admin-button admin-button--primary"
              onClick={startCreateRedirect}
              disabled={!token}
            >
              + {t.create}
            </button>
          </div>

          {redirectForm && (
            <form
              className="seo-admin__form"
              onSubmit={handleRedirectSubmit}
            >
              <div className="seo-admin__form-heading">
                <h3>
                  {redirectForm.id === null
                    ? t.createRedirect
                    : t.editRedirect}
                </h3>

                <button
                  type="button"
                  className="seo-admin__text-button"
                  onClick={() => setRedirectForm(null)}
                >
                  {t.cancel}
                </button>
              </div>

              <div className="seo-admin__form-grid">
                <label>
                  {t.language}

                  <select
                    value={redirectForm.language_code}
                    disabled={redirectForm.id !== null}
                    onChange={(event) => {
                      const newLanguage = event.target.value as SeoLanguage;

                      setRedirectForm({
                        ...redirectForm,
                        language_code: newLanguage,
                      });
                    }}
                  >
                    <option value="ru">Русский</option>
                    <option value="be">Беларуская</option>
                    <option value="en">English</option>
                    <option value="zh">中文</option>
                  </select>
                </label>

                <label>
                  {t.statusCode}

                  <input type="text" value="301" disabled />
                </label>

                <label className="seo-admin__field-wide">
                  {t.sourcePath}

                  <input
                    type="text"
                    required
                    maxLength={1000}
                    disabled={redirectForm.id !== null}
                    value={redirectForm.source_path}
                    onChange={(event) => {
                      setRedirectForm({
                        ...redirectForm,
                        source_path: event.target.value,
                      });
                    }}
                  />
                </label>

                <label className="seo-admin__field-wide">
                  {t.destinationPath}

                  <input
                    type="text"
                    required
                    maxLength={1000}
                    value={redirectForm.destination_path}
                    onChange={(event) => {
                      setRedirectForm({
                        ...redirectForm,
                        destination_path: event.target.value,
                      });
                    }}
                  />
                </label>
              </div>

              <div className="seo-admin__checkboxes">
                <label>
                  <input
                    type="checkbox"
                    checked={redirectForm.is_active}
                    onChange={(event) => {
                      setRedirectForm({
                        ...redirectForm,
                        is_active: event.target.checked,
                      });
                    }}
                  />
                  {t.active}
                </label>
              </div>

              <div className="seo-admin__form-actions">
                <button
                  type="button"
                  className="seo-admin__button"
                  onClick={() => setRedirectForm(null)}
                  disabled={savingRedirect}
                >
                  {t.cancel}
                </button>

                <button
                  type="submit"
                  className="admin-button admin-button--primary"
                  disabled={savingRedirect}
                >
                  {savingRedirect ? t.saving : t.save}
                </button>
              </div>
            </form>
          )}

          {redirectsLoading && (
            <p className="seo-admin__state">{t.loading}</p>
          )}

          {redirectsError && (
            <div className="seo-admin__message seo-admin__message--error">
              {redirectsError}

              <button
                type="button"
                className="seo-admin__text-button"
                onClick={refresh}
              >
                {t.retry}
              </button>
            </div>
          )}

          {!redirectsLoading &&
            !redirectsError &&
            redirects.length === 0 && (
              <p className="seo-admin__state">{t.noRedirects}</p>
            )}

          <div className="seo-admin__list">
            {redirects.map((redirect) => (
              <article
                className="seo-admin__item"
                key={redirect.id}
              >
                <div className="seo-admin__item-content">
                  <div className="seo-admin__item-topline">
                    <span className="seo-admin__tag">
                      {redirect.language_code.toUpperCase()}
                    </span>

                    <span className="seo-admin__tag">
                      {redirect.status_code}
                    </span>

                    <span
                      className={
                        redirect.is_active
                          ? "seo-admin__status seo-admin__status--active"
                          : "seo-admin__status"
                      }
                    >
                      {redirect.is_active ? t.active : t.inactive}
                    </span>
                  </div>

                  <p className="seo-admin__path">
                    {redirect.source_path}
                  </p>

                  <p className="seo-admin__destination">
                    → {redirect.destination_path}
                  </p>
                </div>

                <div className="seo-admin__item-actions">
                  <button
                    type="button"
                    className="seo-admin__button"
                    onClick={() => startEditRedirect(redirect)}
                  >
                    {t.edit}
                  </button>

                  <button
                    type="button"
                    className="seo-admin__button seo-admin__button--danger"
                    onClick={() => void handleDeleteRedirect(redirect)}
                  >
                    {t.delete}
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="seo-admin__pagination">
            <button
              type="button"
              className="seo-admin__button"
              disabled={redirectsPage <= 1 || redirectsLoading}
              onClick={() => setRedirectsPage((page) => page - 1)}
            >
              {t.previous}
            </button>

            <span>
              {t.pageNumber} {redirectsPage} / {redirectsTotalPages}
              {" · "}
              {t.total}: {redirectsTotal}
            </span>

            <button
              type="button"
              className="seo-admin__button"
              disabled={
                redirectsPage >= redirectsTotalPages ||
                redirectsLoading
              }
              onClick={() => setRedirectsPage((page) => page + 1)}
            >
              {t.next}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}