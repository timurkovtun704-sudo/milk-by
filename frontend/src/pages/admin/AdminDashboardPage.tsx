
import { Link } from "react-router-dom";

import AdminPageHeading from "../../components/admin/AdminPageHeading";

import { useAdminContext } from "../../hooks/useAdminContext";

export default function AdminDashboardPage() {
  const { locale, messages } = useAdminContext();

  const sections = [
    {
      title: messages.navigation.categories,
      description: messages.categories.description,
      path: `/${locale}/admin/categories`,
      symbol: "CT",
    },
    {
      title: messages.navigation.products,
      description: messages.products.description,
      path: `/${locale}/admin/products`,
      symbol: "PR",
    },
    {
      title: messages.navigation.news,
      description: messages.news.description,
      path: `/${locale}/admin/news`,
      symbol: "NW",
    },
    {
      title: messages.navigation.translations,
      description: messages.translations.description,
      path: `/${locale}/admin/translations`,
      symbol: "LN",
    },
    {
      title: messages.navigation.seo,
      description: messages.seo.description,
      path: `/${locale}/admin/seo`,
      symbol: "SE",
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminPageHeading
        title={messages.dashboard.title}
        description={messages.dashboard.description}
      />

      <section className="admin-status">
        <div className="admin-status__indicator" />

        <div>
          <h2>{messages.dashboard.statusTitle}</h2>
          <p>{messages.dashboard.statusDescription}</p>
        </div>

        <span className="admin-status__badge">
          Frontend only
        </span>
      </section>

      <section className="admin-dashboard__sections">
        <div className="admin-section-heading">
          <div>
            <h2>{messages.dashboard.quickActions}</h2>
            <p>
              {messages.dashboard.quickActionsDescription}
            </p>
          </div>
        </div>

        <div className="admin-shortcuts">
          {sections.map((section) => (
            <Link
              to={section.path}
              className="admin-shortcut"
              key={section.path}
            >
              <span className="admin-shortcut__symbol">
                {section.symbol}
              </span>

              <div className="admin-shortcut__content">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>

              <span
                className="admin-shortcut__arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="admin-development-note">
        <strong>{messages.common.frontendMode}</strong>
        <p>{messages.common.frontendModeDescription}</p>
      </div>
    </div>
  );
}
