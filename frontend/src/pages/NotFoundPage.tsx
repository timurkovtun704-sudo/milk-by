
import { Link } from "react-router-dom";

import { useSiteContext } from "../hooks/useSiteContext";

export default function NotFoundPage() {
  const { locale, messages } = useSiteContext();

  return (
    <section className="not-found-page">
      <div className="container">
        <span className="not-found-page__code">404</span>

        <h1>{messages.common.notFoundTitle}</h1>

        <p>{messages.common.notFoundDescription}</p>

        <Link
          className="button button--primary"
          to={`/${locale}`}
        >
          {messages.common.backHome}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
