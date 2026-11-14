
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminHeader from "../components/admin/AdminHeader";
import AdminNotice from "../components/admin/AdminNotice";

import { useAuth } from "../hooks/useAuth";

import {
  isLocale,
} from "../i18n/messages";

import {
  adminMessages,
} from "../i18n/adminMessages";

import {
  authMessages,
} from "../i18n/authMessages";

import type { Locale } from "../i18n/messages";

import type {
  AdminNoticeData,
  AdminNoticeVariant,
} from "../types/admin";

import "../styles/admin.css";
import "../styles/auth.css";

export default function AdminLayout() {
  const { locale: localeParam } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    user,
    role,
    isAuthenticated,
    logout,
  } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notice, setNotice] =
    useState<AdminNoticeData | null>(null);

  const locale: Locale = isLocale(localeParam)
    ? localeParam
    : "ru";

  const messages = adminMessages[locale];
  const authLabels = authMessages[locale];

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const notify = useCallback(
    (
      message: string,
      variant: AdminNoticeVariant = "info"
    ) => {
      setNotice({
        message,
        variant,
      });
    },
    []
  );

  function changeLocale(nextLocale: Locale) {
    const pathParts = location.pathname.split("/");

    pathParts[1] = nextLocale;

    navigate(
      pathParts.join("/") +
        location.search +
        location.hash
    );
  }

  // Проверка локали
  if (!isLocale(localeParam)) {
    return <Navigate to="/ru/admin/login" replace />;
  }

  // Защита административной панели от неавторизованных пользователей
  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${locale}/admin/login`}
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  // Допускаются только администратор и редактор
  if (role !== "admin" && role !== "editor") {
    return (
      <main className="admin-access-denied">
        <h1>{authLabels.accessDenied}</h1>

        <button
          type="button"
          className="button button--primary"
          onClick={logout}
        >
          {authLabels.logout}
        </button>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar
        locale={locale}
        messages={messages}
        isOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader
          locale={locale}
          messages={messages}
          onLocaleChange={changeLocale}
          onMenuToggle={() =>
            setSidebarOpen((current) => !current)
          }
        />

        {/* Информация о текущей административной сессии */}
        <div className="admin-session-bar">
          <span className="admin-session-bar__identity">
            {user?.email ?? user?.id}
          </span>

          <span className="admin-session-bar__role">
            {role}
          </span>

          <button
            type="button"
            className="admin-session-bar__logout"
            onClick={() => {
              logout();
              navigate(`/${locale}/admin/login`, {
                replace: true,
              });
            }}
          >
            {authLabels.logout}
          </button>
        </div>

        <main className="admin-content">
          <Outlet
            context={{
              locale,
              messages,
              notify,
            }}
          />
        </main>

        <footer className="admin-footer">
          <span>Молочный Мир</span>
          <span>{messages.common.frontendMode}</span>
        </footer>
      </div>

      {notice && (
        <AdminNotice
          notice={notice}
          closeLabel={messages.feedback.closeNotice}
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
}
