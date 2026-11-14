
import { useState } from "react";

import type { FormEvent } from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

import { isLocale } from "../i18n/messages";
import { authMessages } from "../i18n/authMessages";

import type { Locale } from "../i18n/messages";

import "../styles/auth.css";

export default function AdminLoginPage() {
  const { locale: localeParam } = useParams();

  const locale: Locale = isLocale(localeParam)
    ? localeParam
    : "ru";

  const labels = authMessages[locale];

  const navigate = useNavigate();
  const location = useLocation();

  const { login, logout, isAuthenticated, role } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    null
  );

  if (!isLocale(localeParam)) {
    return <Navigate to="/ru/admin/login" replace />;
  }

  // Если пользователь уже авторизован, повторный вход не нужен
  if (
    isAuthenticated &&
    (role === "admin" || role === "editor")
  ) {
    return (
      <Navigate
        to={`/${locale}/admin`}
        replace
      />
    );
  }

  const locationState = location.state as
    | { from?: string }
    | null;

  const requestedPath = locationState?.from;

  const redirectPath =
    typeof requestedPath === "string" &&
    requestedPath.startsWith(`/${locale}/admin`) &&
    !requestedPath.includes("/admin/login")
      ? requestedPath
      : `/${locale}/admin`;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const session = await login(
        email.trim(),
        password
      );

      const userRole =
        session.user.app_metadata?.role;

      if (
        userRole !== "admin" &&
        userRole !== "editor"
      ) {
        logout();
        setErrorMessage(labels.accessDenied);
        return;
      }

      navigate(redirectPath, {
        replace: true,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Не удалось выполнить вход"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <header className="auth-card__header">
          <p className="eyebrow">Milk World</p>
          <h1>{labels.title}</h1>
          <p>{labels.description}</p>
        </header>

        {errorMessage && (
          <div
            className="auth-card__error"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <div className="auth-form__field">
            <label htmlFor="auth-email">
              {labels.emailLabel}
            </label>

            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="username"
              placeholder={labels.emailPlaceholder}
              value={email}
              maxLength={254}
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setEmail(event.currentTarget.value)
              }
            />
          </div>

          <div className="auth-form__field">
            <label htmlFor="auth-password">
              {labels.passwordLabel}
            </label>

            <input
              id="auth-password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={labels.passwordPlaceholder}
              value={password}
              required
              disabled={isSubmitting}
              onChange={(event) =>
                setPassword(event.currentTarget.value)
              }
            />
          </div>

          <button
            className="button button--primary auth-form__submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? labels.submitting
              : labels.submit}
          </button>
        </form>

        <Link
          className="auth-card__back"
          to={`/${locale}`}
        >
          {labels.backToSite}
        </Link>
      </section>
    </main>
  );
}
