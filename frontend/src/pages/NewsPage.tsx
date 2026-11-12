
import EmptyState from "../components/EmptyState";
import { useSiteContext } from "../hooks/useSiteContext";

export default function NewsPage() {
  const { messages } = useSiteContext();

  return (
    <section className="inner-page">
      <div className="container">
        <header className="page-heading">
          <p className="eyebrow">
            {messages.news.eyebrow}
          </p>

          <h1>{messages.news.title}</h1>

          <p className="page-heading__description">
            {messages.news.description}
          </p>
        </header>

        <EmptyState
          title={messages.news.empty.title}
          description={messages.news.empty.description}
        />
      </div>
    </section>
  );
}
