
import { localeCodes } from "../../i18n/messages";

import type { Locale } from "../../i18n/messages";
import type { AdminMessages } from "../../i18n/adminMessages";

interface AdminHeaderProps {
  locale: Locale;
  messages: AdminMessages;
  onLocaleChange: (locale: Locale) => void;
  onMenuToggle: () => void;
}

const languageLabels: Record<Locale, string> = {
  ru: "RU",
  be: "BY",
  en: "EN",
  zh: "中文",
};

export default function AdminHeader({
  locale,
  messages,
  onLocaleChange,
  onMenuToggle,
}: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          type="button"
          className="admin-header__menu"
          aria-label={messages.common.close}
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="admin-header__context">
          <span>{messages.panelName}</span>
          <strong>{messages.panelDescription}</strong>
        </div>
      </div>

      <div className="admin-header__right">
        <label className="admin-language">
          <span className="visually-hidden">
            {messages.common.language}
          </span>

          <select
            value={locale}
            onChange={(event) =>
              onLocaleChange(event.currentTarget.value as Locale)
            }
          >
            {localeCodes.map((code) => (
              <option value={code} key={code}>
                {languageLabels[code]}
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  );
}
