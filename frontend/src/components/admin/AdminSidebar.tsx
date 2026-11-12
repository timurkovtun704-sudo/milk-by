
import { NavLink, Link } from "react-router-dom";

import type { Locale } from "../../i18n/messages";
import type { AdminMessages } from "../../i18n/adminMessages";
import type { AdminSection } from "../../types/admin";

interface AdminSidebarProps {
  locale: Locale;
  messages: AdminMessages;
  isOpen: boolean;
  onNavigate: () => void;
}

export default function AdminSidebar({
  locale,
  messages,
  isOpen,
  onNavigate,
}: AdminSidebarProps) {
  const navigation: {
    section: AdminSection;
    label: string;
    symbol: string;
    path: string;
  }[] = [
    {
      section: "dashboard",
      label: messages.navigation.dashboard,
      symbol: "OV",
      path: `/${locale}/admin`,
    },
    {
      section: "categories",
      label: messages.navigation.categories,
      symbol: "CT",
      path: `/${locale}/admin/categories`,
    },
    {
      section: "products",
      label: messages.navigation.products,
      symbol: "PR",
      path: `/${locale}/admin/products`,
    },
    {
      section: "news",
      label: messages.navigation.news,
      symbol: "NW",
      path: `/${locale}/admin/news`,
    },
    {
      section: "translations",
      label: messages.navigation.translations,
      symbol: "LN",
      path: `/${locale}/admin/translations`,
    },
    {
      section: "seo",
      label: messages.navigation.seo,
      symbol: "SE",
      path: `/${locale}/admin/seo`,
    },
  ];

  return (
    <>
      {isOpen && (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label={messages.common.close}
          onClick={onNavigate}
        />
      )}

      <aside
        className={`admin-sidebar ${
          isOpen ? "admin-sidebar--open" : ""
        }`}
      >
        <Link
          to={`/${locale}/admin`}
          className="admin-brand"
          onClick={onNavigate}
        >
          <span className="admin-brand__symbol">М</span>

          <span>
            <strong>{messages.panelName}</strong>
            <small>{messages.panelDescription}</small>
          </span>
        </Link>

        <div className="admin-sidebar__label">
          {messages.navigation.dashboard}
        </div>

        <nav className="admin-nav">
          {navigation.map((item) => (
            <NavLink
              key={item.section}
              to={item.path}
              end={item.section === "dashboard"}
              onClick={onNavigate}
              className={({ isActive }) =>
                `admin-nav__link ${
                  isActive ? "admin-nav__link--active" : ""
                }`
              }
            >
              <span
                className="admin-nav__symbol"
                aria-hidden="true"
              >
                {item.symbol}
              </span>

              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__bottom">
          <Link
            to={`/${locale}`}
            className="admin-back-link"
            onClick={onNavigate}
          >
            <span aria-hidden="true">↗</span>
            {messages.navigation.backToSite}
          </Link>
        </div>
      </aside>
    </>
  );
}
