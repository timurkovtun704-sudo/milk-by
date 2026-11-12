
import { Link } from "react-router-dom";

import type {
  Locale,
  SiteMessages,
} from "../i18n/messages";

interface SiteFooterProps {
  locale: Locale;
  messages: SiteMessages;
}

export default function SiteFooter({
  locale,
  messages,
}: SiteFooterProps) {
  const links = [
    {
      label: messages.navigation.products,
      path: "products",
    },
    {
      label: messages.navigation.news,
      path: "news",
    },
    {
      label: messages.navigation.about,
      path: "about",
    },
    {
      label: messages.navigation.export,
      path: "export",
    },
    {
      label: messages.navigation.partners,
      path: "partners",
    },
    {
      label: messages.navigation.contacts,
      path: "contacts",
    },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__main">
          <div className="site-footer__identity">
            <Link
              className="site-brand site-brand--footer"
              to={`/${locale}`}
            >
              <span className="site-brand__name">
                {messages.brand}
              </span>

              <span className="site-brand__caption">
                {messages.companyName}
              </span>
            </Link>

            <p>{messages.footer.description}</p>
          </div>

          <div className="site-footer__navigation">
            <h2>{messages.footer.navigationTitle}</h2>

            <nav aria-label={messages.footer.navigationTitle}>
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={`/${locale}/${link.path}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>
            © {new Date().getFullYear()} {messages.companyName}
          </span>

          <span>{messages.footer.copyright}</span>
        </div>
      </div>
    </footer>
  );
}
