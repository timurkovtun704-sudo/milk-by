
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import {
  isLocale,
  localeCodes,
} from "../i18n/messages";

import type {
  Locale,
  SiteMessages,
} from "../i18n/messages";

interface SiteHeaderProps {
  locale: Locale;
  messages: SiteMessages;
  onLocaleChange: (locale: Locale) => void;
}

const languageLabels: Record<Locale, string> = {
  ru: "RU",
  be: "BY",
  en: "EN",
  zh: "中文",
};

export default function SiteHeader({
  locale,
  messages,
  onLocaleChange,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    {
      label: messages.navigation.products,
      path: `/${locale}/products`,
    },
    {
      label: messages.navigation.news,
      path: `/${locale}/news`,
    },
    {
      label: messages.navigation.about,
      path: `/${locale}/about`,
    },
    {
      label: messages.navigation.export,
      path: `/${locale}/export`,
    },
    {
      label: messages.navigation.partners,
      path: `/${locale}/partners`,
    },
    {
      label: messages.navigation.contacts,
      path: `/${locale}/contacts`,
    },
  ];

  function handleLanguageChange(value: string) {
    if (isLocale(value)) {
      onLocaleChange(value);
    }
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link
          className="site-brand"
          to={`/${locale}`}
          aria-label={messages.brand}
        >
          <span className="site-brand__name">
            {messages.brand}
          </span>

          <span className="site-brand__caption">
            {messages.companyName}
          </span>
        </Link>

        <nav
          id="primary-navigation"
          className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}
          aria-label={messages.common.primaryNavigation}
        >
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `main-nav__link ${
                  isActive ? "main-nav__link--active" : ""
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="site-header__controls">
          <label className="language-control">
            <span className="visually-hidden">
              {messages.common.language}
            </span>

            <select
              value={locale}
              onChange={(event) =>
                handleLanguageChange(event.currentTarget.value)
              }
            >
              {localeCodes.map((code) => (
                <option key={code} value={code}>
                  {languageLabels[code]}
                </option>
              ))}
            </select>
          </label>

          <button
            className={`menu-toggle ${
              menuOpen ? "menu-toggle--active" : ""
            }`}
            type="button"
            aria-label={
              menuOpen
                ? messages.common.closeMenu
                : messages.common.openMenu
            }
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
