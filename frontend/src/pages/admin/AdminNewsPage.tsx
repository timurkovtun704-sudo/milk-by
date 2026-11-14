
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { FormEvent } from "react";

import AdminPageHeading from "../../components/admin/AdminPageHeading";
import "../../styles/admin-news.css";

import { useAdminContext } from "../../hooks/useAdminContext";
import { useAuth } from "../../hooks/useAuth";

import { adminNewsApiMessages } from "../../i18n/adminNewsApiMessages";

import {
  createAdminNews,
  createAdminNewsCategory,
  deleteAdminNews,
  deleteAdminNewsCategory,
  getAdminNews,
  getAdminNewsCategories,
  publishAdminNews,
  unpublishAdminNews,
  updateAdminNews,
} from "../../services/adminNewsService";

import type {
  AdminNewsArticle,
  AdminNewsCategory,
  AdminNewsPayload,
} from "../../services/adminNewsService";

import "../../styles/admin.css";
import "../../styles/admin-api.css";

interface NewsFormState {
  title: string;
  slug: string;
  categoryId: string;
  publishedAt: string;
  content: string;
  imageUrl: string;
  isPublished: boolean;
}

const EMPTY_FORM: NewsFormState = {
  title: "",
  slug: "",
  categoryId: "",
  publishedAt: "",
  content: "",
  imageUrl: "",
  isPublished: false,
};

function createSlug(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

function getDateForInput(value: string | null): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(
  value: string | null,
  locale: string
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const localeMap: Record<string, string> = {
    ru: "ru-RU",
    be: "be-BY",
    en: "en-GB",
    zh: "zh-CN",
  };

  return new Intl.DateTimeFormat(
    localeMap[locale] ?? "ru-RU",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  ).format(date);
}

export default function AdminNewsPage() {
  const { locale, messages, notify } = useAdminContext();
  const { accessToken, role } = useAuth();

  const labels = adminNewsApiMessages[locale];

  const canDelete = role === "admin";

  const [news, setNews] = useState<AdminNewsArticle[]>([]);
  const [categories, setCategories] = useState<AdminNewsCategory[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isCategorySaving, setIsCategorySaving] = useState(false);
  const [deletingNewsId, setDeletingNewsId] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [changingStatusId, setChangingStatusId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsFormState>(EMPTY_FORM);

  const [categoryName, setCategoryName] = useState("");

  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  const categoryMap = useMemo(
    () =>
      new Map(
        categories.map((category) => [
          category.id,
          category.name,
        ])
      ),
    [categories]
  );

  // Загрузка новостей и категорий из backend
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function loadData() {
      if (!accessToken) {
        setLoadError(labels.tokenMissing);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);

      try {
        const [loadedNews, loadedCategories] =
          await Promise.all([
            getAdminNews(accessToken, controller.signal),
            getAdminNewsCategories(controller.signal),
          ]);

        if (!active) {
          return;
        }

        setNews(loadedNews);
        setCategories(loadedCategories);
      } catch (error) {
        if (
          !active ||
          (error instanceof Error && error.name === "AbortError")
        ) {
          return;
        }

        console.error(
          "Ошибка загрузки административных новостей:",
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
  }, [
    accessToken,
    reloadKey,
    labels.loadError,
    labels.tokenMissing,
  ]);

  function openCreateForm() {
    setEditingNewsId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(article: AdminNewsArticle) {
    setEditingNewsId(article.id);

    setForm({
      title: article.title,
      slug: article.slug,
      categoryId: article.categoryId ?? "",
      publishedAt: getDateForInput(article.publishedAt),
      content: article.content,
      imageUrl: article.imageUrl ?? "",
      isPublished: article.isPublished,
    });

    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingNewsId(null);
    setForm(EMPTY_FORM);
  }

  function updateField<K extends keyof NewsFormState>(
    key: K,
    value: NewsFormState[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function buildPayload(): AdminNewsPayload | null {
    const title = form.title.trim();
    const slug = form.slug.trim() || createSlug(title);
    const content = form.content.trim();

    if (!title || !slug || !content) {
      notify(
        labels.title + ", " + labels.slug + ", " + labels.content,
        "warning"
      );

      return null;
    }

    if (slug.length > 200) {
      notify(labels.slug, "warning");
      return null;
    }

    if (form.isPublished && !form.publishedAt) {
      notify(labels.date, "warning");
      return null;
    }

    let categoryId: number | null = null;

    if (form.categoryId) {
      categoryId = Number(form.categoryId);

      if (
        !Number.isSafeInteger(categoryId) ||
        categoryId <= 0
      ) {
        notify(labels.category, "warning");
        return null;
      }
    }

    // Для даты без времени используем середину дня UTC,
    // чтобы при отображении в других часовых поясах
    // не смещалась календарная дата.
    const publishedAt = form.publishedAt
      ? `${form.publishedAt}T12:00:00.000Z`
      : null;

    return {
      category_id: categoryId,
      title,
      slug,
      content,
      image_url: form.imageUrl.trim() || null,
      published_at: publishedAt,
      is_published: form.isPublished,
    };
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!accessToken) {
      notify(labels.tokenMissing, "warning");
      return;
    }

    const payload = buildPayload();

    if (!payload) {
      return;
    }

    setIsSaving(true);

    try {
      if (editingNewsId) {
        await updateAdminNews(
          editingNewsId,
          payload,
          accessToken
        );

        notify(labels.updateSuccess, "success");
      } else {
        await createAdminNews(payload, accessToken);

        notify(labels.createSuccess, "success");
      }

      closeForm();
      reload();
    } catch (error) {
      console.error("Ошибка сохранения публикации:", error);

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

  async function handleDelete(article: AdminNewsArticle) {
    if (!accessToken || !canDelete) {
      return;
    }

    if (!window.confirm(labels.confirmDelete)) {
      return;
    }

    setDeletingNewsId(article.id);

    try {
      await deleteAdminNews(article.id, accessToken);

      notify(labels.deleteSuccess, "success");
      reload();
    } catch (error) {
      console.error("Ошибка удаления публикации:", error);

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    } finally {
      setDeletingNewsId(null);
    }
  }

  async function handlePublicationToggle(
    article: AdminNewsArticle
  ) {
    if (!accessToken) {
      notify(labels.tokenMissing, "warning");
      return;
    }

    setChangingStatusId(article.id);

    try {
      if (article.isPublished) {
        await unpublishAdminNews(article.id, accessToken);
        notify(labels.unpublishSuccess, "success");
      } else {
        await publishAdminNews(article.id, accessToken);
        notify(labels.publishSuccess, "success");
      }

      reload();
    } catch (error) {
      console.error("Ошибка изменения статуса публикации:", error);

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    } finally {
      setChangingStatusId(null);
    }
  }

  async function handleCreateCategory(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!accessToken) {
      notify(labels.tokenMissing, "warning");
      return;
    }

    const name = categoryName.trim();

    if (!name) {
      notify(labels.categoryName, "warning");
      return;
    }

    setIsCategorySaving(true);

    try {
      await createAdminNewsCategory(name, accessToken);

      setCategoryName("");
      notify(labels.categoryCreateSuccess, "success");
      reload();
    } catch (error) {
      console.error("Ошибка создания категории новостей:", error);

      notify(
        error instanceof Error
          ? error.message
          : labels.operationError,
        "warning"
      );
    } finally {
      setIsCategorySaving(false);
    }
  }

  async function handleDeleteCategory(
    category: AdminNewsCategory
  ) {
    if (!accessToken || !canDelete) {
      return;
    }

    if (!window.confirm(labels.categoryDeleteConfirm)) {
      return;
    }

    setDeletingCategoryId(category.id);

    try {
      await deleteAdminNewsCategory(
        category.id,
        accessToken
      );

      notify(labels.categoryDeleteSuccess, "success");
      reload();
    } catch (error) {
      console.error("Ошибка удаления категории новостей:", error);

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
    <div className="admin-page admin-news-page">
      <AdminPageHeading
        title={messages.news.title}
        description={messages.news.description}
        action={
          <button
            className="admin-button admin-button--primary"
            type="button"
            onClick={openCreateForm}
            disabled={isSaving}
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
              <h2>
                {editingNewsId
                  ? labels.edit
                  : messages.news.formTitle}
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
            <section className="admin-form-section">
              <div className="admin-field">
                <label htmlFor="admin-news-title">
                  {labels.title} *
                </label>

                <input
                  id="admin-news-title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.currentTarget.value
                    )
                  }
                  maxLength={250}
                  required
                  disabled={isSaving}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="admin-news-slug">
                  {labels.slug}
                </label>

                <input
                  id="admin-news-slug"
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.currentTarget.value
                    )
                  }
                  maxLength={200}
                  placeholder={createSlug(form.title)}
                  disabled={isSaving}
                />

                <small>{labels.slugHelp}</small>
              </div>

              <div className="admin-form__grid">
                <div className="admin-field">
                  <label htmlFor="admin-news-category">
                    {labels.category}
                  </label>

                  <select
                    id="admin-news-category"
                    value={form.categoryId}
                    onChange={(event) =>
                      updateField(
                        "categoryId",
                        event.currentTarget.value
                      )
                    }
                    disabled={isSaving}
                  >
                    <option value="">
                      {labels.noCategory}
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-field">
                  <label htmlFor="admin-news-date">
                    {labels.date}
                    {form.isPublished && <span>*</span>}
                  </label>

                  <input
                    id="admin-news-date"
                    type="date"
                    value={form.publishedAt}
                    onChange={(event) =>
                      updateField(
                        "publishedAt",
                        event.currentTarget.value
                      )
                    }
                    required={form.isPublished}
                    disabled={isSaving}
                  />
                </div>
              </div>

              <div className="admin-field">
                <label htmlFor="admin-news-image">
                  {labels.imageUrl}
                </label>

                <input
                  id="admin-news-image"
                  type="url"
                  value={form.imageUrl}
                  onChange={(event) =>
                    updateField(
                      "imageUrl",
                      event.currentTarget.value
                    )
                  }
                  placeholder="https://example.com/image.jpg"
                  disabled={isSaving}
                />
              </div>

              <div className="admin-field">
                <label htmlFor="admin-news-status">
                  {labels.status}
                </label>

                <select
                  id="admin-news-status"
                  value={form.isPublished ? "published" : "draft"}
                  onChange={(event) =>
                    updateField(
                      "isPublished",
                      event.currentTarget.value === "published"
                    )
                  }
                  disabled={isSaving}
                >
                  <option value="draft">
                    {labels.draft}
                  </option>

                  <option value="published">
                    {labels.published}
                  </option>
                </select>
              </div>
            </section>

            <section className="admin-form-section">
              <div className="admin-field">
                <label htmlFor="admin-news-content">
                  {labels.content} *
                </label>

                <textarea
                  id="admin-news-content"
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      "content",
                      event.currentTarget.value
                    )
                  }
                  rows={14}
                  maxLength={100000}
                  required
                  disabled={isSaving}
                />
              </div>
            </section>

            <p className="admin-api-hint">
              {labels.slugHelp}
              {" "}
              {labels.imageUrl}: URL изображения передаётся серверу как строка.
            </p>

            <div className="admin-form__actions">
              <button
                className="admin-button admin-button--primary"
                type="submit"
                disabled={isSaving}
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

      <section className="admin-form-panel admin-news-categories">
        <div className="admin-form-panel__heading">
          <div>
            <h2>{labels.categoriesTitle}</h2>
          </div>
        </div>

        <form
          className="admin-form__grid"
          onSubmit={handleCreateCategory}
        >
          <div className="admin-field">
            <label htmlFor="admin-news-category-name">
              {labels.categoryName}
            </label>

            <input
              id="admin-news-category-name"
              type="text"
              value={categoryName}
              onChange={(event) =>
                setCategoryName(event.currentTarget.value)
              }
              maxLength={150}
              required
              disabled={isCategorySaving}
            />
          </div>

          <div className="admin-field admin-news-categories__submit">
            <span aria-hidden="true">&nbsp;</span>

            <button
              className="admin-button admin-button--primary"
              type="submit"
              disabled={
                isCategorySaving ||
                !categoryName.trim()
              }
            >
              {isCategorySaving
                ? labels.saving
                : labels.categoryCreate}
            </button>
          </div>
        </form>

        {categories.length === 0 ? (
          <p className="admin-api-hint">
            {labels.categoriesEmpty}
          </p>
        ) : (
          <div className="admin-news-categories__list">
            {categories.map((category) => (
              <div
                className="admin-news-categories__item"
                key={category.id}
              >
                <span>{category.name}</span>

                <span className="admin-news-categories__id">
                  ID: {category.id}
                </span>

                {canDelete && (
                  <button
                    className="admin-button admin-button--danger"
                    type="button"
                    onClick={() =>
                      void handleDeleteCategory(category)
                    }
                    disabled={
                      deletingCategoryId === category.id
                    }
                  >
                    {deletingCategoryId === category.id
                      ? labels.saving
                      : labels.categoryDelete}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

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
      ) : news.length === 0 ? (
        <section className="admin-empty-list">
          <h2>{labels.noNews}</h2>
        </section>
      ) : (
        <section className="admin-data-list">
          {news.map((article) => (
            <article
              className="admin-data-card"
              key={article.id}
            >
              <div className="admin-data-card__main">
                {article.imageUrl && (
                  <img
                    className="admin-data-card__image"
                    src={article.imageUrl}
                    alt=""
                    loading="lazy"
                  />
                )}

                <div className="admin-data-card__content">
                  <h2>{article.title}</h2>

                  <p>
                    {article.content.length > 280
                      ? `${article.content.slice(0, 280)}...`
                      : article.content}
                  </p>

                  <div className="admin-data-card__meta">
                    <span>
                      {article.categoryId
                        ? categoryMap.get(article.categoryId) ??
                          `${labels.category}: ${article.categoryId}`
                        : labels.noCategory}
                    </span>

                    <span
                      className={
                        article.isPublished
                          ? "admin-status admin-status--active"
                          : "admin-status admin-status--inactive"
                      }
                    >
                      {article.isPublished
                        ? labels.published
                        : labels.draft}
                    </span>

                    <span>
                      {formatDate(
                        article.publishedAt ?? article.createdAt,
                        locale
                      )}
                    </span>

                    <span>ID: {article.id}</span>
                  </div>
                </div>
              </div>

              <div className="admin-data-card__actions">
                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={() => openEditForm(article)}
                  disabled={isSaving}
                >
                  {labels.edit}
                </button>

                <button
                  className="admin-button admin-button--secondary"
                  type="button"
                  onClick={() =>
                    void handlePublicationToggle(article)
                  }
                  disabled={
                    changingStatusId === article.id
                  }
                >
                  {changingStatusId === article.id
                    ? labels.saving
                    : article.isPublished
                      ? labels.unpublish
                      : labels.publish}
                </button>

                {canDelete && (
                  <button
                    className="admin-button admin-button--danger"
                    type="button"
                    onClick={() => void handleDelete(article)}
                    disabled={deletingNewsId === article.id}
                  >
                    {deletingNewsId === article.id
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
