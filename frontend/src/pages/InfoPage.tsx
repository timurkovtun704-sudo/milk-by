import EmptyState from "../components/EmptyState";
import B2BContactForm from "../components/b2b/B2BContactForm";
import ContactInformation from "../components/ContactInformation";

import { useSiteContext } from "../hooks/useSiteContext";

import type { InfoPageKey } from "../i18n/messages";

interface InfoPageProps {
  page: InfoPageKey;
}

export default function InfoPage({ page }: InfoPageProps) {
  const { locale, messages } = useSiteContext();

  const pageContent = messages.info[page];

  const showContactForm =
    page === "export" || page === "partners";

  return (
    <section className="inner-page">
      <div className="container">
        <header className="page-heading">
          <p className="eyebrow">
            {messages.home.contentEyebrow}
          </p>

          <h1>{pageContent.title}</h1>

          <p className="page-heading__description">
            {pageContent.description}
          </p>
        </header>

        {page === "contacts" ? (
          <ContactInformation locale={locale} />
        ) : showContactForm ? (
          <B2BContactForm locale={locale} />
        ) : (
          <EmptyState
            title={pageContent.empty.title}
            description={pageContent.empty.description}
          />
        )}
      </div>
    </section>
  );
}