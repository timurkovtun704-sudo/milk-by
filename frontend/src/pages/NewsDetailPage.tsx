
import { Link } from "react-router-dom";

import EmptyState from "../components/EmptyState";

import { useSiteContext } from "../hooks/useSiteContext";

import { newsMessages } from "../i18n/newsMessages";

import "../styles/news.css";

export default function NewsDetailPage() {
  const { locale, messages } = useSiteContext();

  const labels = newsMessages[locale];

  return (
    <section className="inner-page">
      <div className="container">
        <nav
          className="news-breadcrumbs"
          aria-label={messages.common.primaryNavigation}
        >
          <Link to={`/${locale}`}>
            {messages.navigation.home}
          </Link>

          <span aria-hidden="true">/</span>

          <Link to={`/${locale}/news`}>
            {messages.navigation.news}
          </Link>
        </nav>

        <div className="news-detail-unavailable">
          <EmptyState
            title={labels.articleUnavailableTitle}
            description={labels.articleUnavailableDescription}
          />

          <Link
            className="button button--primary"
            to={`/${locale}/news`}
          >
            {labels.backToNews}
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
