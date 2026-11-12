
import { useEffect } from "react";

import {
  Navigate,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

import {
  isLocale,
  messages as translations,
} from "../i18n/messages";

import type { Locale } from "../i18n/messages";

export default function SiteLayout() {
  const { locale: localeParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLocale(localeParam)) {
      document.documentElement.lang = localeParam;
    }
  }, [localeParam]);

  if (!isLocale(localeParam)) {
    return <Navigate to="/ru" replace />;
  }

  const locale: Locale = localeParam;
  const currentMessages = translations[locale];

  function handleLocaleChange(nextLocale: Locale) {
    const pathParts = location.pathname.split("/");

    pathParts[1] = nextLocale;

    const nextPath =
      pathParts.join("/") + location.search + location.hash;

    navigate(nextPath);
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        {currentMessages.common.skipToContent}
      </a>

      <SiteHeader
        locale={locale}
        messages={currentMessages}
        onLocaleChange={handleLocaleChange}
      />

      <main id="main-content" className="site-main">
        <Outlet
          context={{
            locale,
            messages: currentMessages,
          }}
        />
      </main>

      <SiteFooter
        locale={locale}
        messages={currentMessages}
      />
    </div>
  );
}
