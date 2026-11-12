
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

import {
  isLocale,
} from "../i18n/messages";

import {
  adminMessages,
} from "../i18n/adminMessages";

import type { Locale } from "../i18n/messages";

import type {
  AdminNoticeData,
  AdminNoticeVariant,
} from "../types/admin";

import "../styles/admin.css";

export default function AdminLayout() {
  const { locale: localeParam } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notice, setNotice] =
    useState<AdminNoticeData | null>(null);

  const locale: Locale = isLocale(localeParam)
    ? localeParam
    : "ru";

  const messages = adminMessages[locale];

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

  if (!isLocale(localeParam)) {
    return <Navigate to="/ru/admin" replace />;
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
