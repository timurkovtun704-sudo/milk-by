
import { Link } from "react-router-dom";

import milkWorldLogo from "../assets/images/assetslogo.png";
import EmptyState from "../components/EmptyState";
import { useSiteContext } from "../hooks/useSiteContext";

export default function HomePage() {
  const { locale, messages } = useSiteContext();

  const directions = [
    {
      number: "01",
      title: messages.navigation.products,
      description: messages.home.productsDescription,
      path: `/${locale}/products`,
    },
    {
      number: "02",
      title: messages.navigation.news,
      description: messages.home.newsDescription,
      path: `/${locale}/news`,
    },
    {
      number: "03",
      title: messages.navigation.about,
      description: messages.home.aboutDescription,
      path: `/${locale}/about`,
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="container hero__layout">
          <div className="hero__content">
            <p className="eyebrow">{messages.home.eyebrow}</p>

            <h1>{messages.home.title}</h1>

            <p className="hero__description">
              {messages.home.description}
            </p>

            <div className="hero__actions">
              <Link
                className="button button--primary"
                to={`/${locale}/products`}
              >
                {messages.home.catalogAction}
                <span aria-hidden="true">↗</span>
              </Link>

              <Link
                className="button button--secondary"
                to={`/${locale}/partners`}
              >
                {messages.home.partnersAction}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
  <img
    className="hero-visual__logo"
    src={milkWorldLogo}
    alt={messages.companyName}
  />
</div>
        </div>
      </section>

      <section className="directions-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                {messages.home.directionsEyebrow}
              </p>

              <h2>{messages.home.directionsTitle}</h2>
            </div>
          </div>

          <div className="directions-grid">
            {directions.map((direction) => (
              <Link
                className="direction-card"
                key={direction.number}
                to={direction.path}
              >
                <span className="direction-card__number">
                  {direction.number}
                </span>

                <div className="direction-card__content">
                  <h3>{direction.title}</h3>
                  <p>{direction.description}</p>
                </div>

                <span
                  className="direction-card__arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-content">
        <div className="container">
          <div className="section-heading section-heading--simple">
            <div>
              <p className="eyebrow">
                {messages.home.contentEyebrow}
              </p>
              <h2>{messages.catalog.title}</h2>
            </div>

            <Link
              className="text-link"
              to={`/${locale}/products`}
            >
              {messages.home.catalogAction}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <EmptyState
            title={messages.catalog.empty.title}
            description={messages.catalog.empty.description}
            variant="compact"
          />
        </div>
      </section>

      <section className="home-news">
        <div className="container">
          <div className="section-heading section-heading--simple">
            <div>
              <p className="eyebrow">
                {messages.home.contentEyebrow}
              </p>
              <h2>{messages.news.title}</h2>
            </div>

            <Link
              className="text-link"
              to={`/${locale}/news`}
            >
              {messages.navigation.news}
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <EmptyState
            title={messages.news.empty.title}
            description={messages.news.empty.description}
            variant="compact"
          />
        </div>
      </section>
    </>
  );
}
