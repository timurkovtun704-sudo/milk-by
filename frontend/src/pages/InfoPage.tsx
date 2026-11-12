
import EmptyState from "../components/EmptyState";
import { useSiteContext } from "../hooks/useSiteContext";

import type { InfoPageKey } from "../i18n/messages";

interface InfoPageProps {
  page: InfoPageKey;
}

export default function InfoPage({ page }: InfoPageProps) {
  const { messages } = useSiteContext();
  const pageContent = messages.info[page];

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

        <EmptyState
          title={pageContent.empty.title}
          description={pageContent.empty.description}
        />
      </div>
    </section>
  );
}
