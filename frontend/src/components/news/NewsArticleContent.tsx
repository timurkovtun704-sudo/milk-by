
import type {
  NewsContentBlock,
} from "../../types/news";

interface NewsArticleContentProps {
  blocks: readonly NewsContentBlock[];
}

export default function NewsArticleContent({
  blocks,
}: NewsArticleContentProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="news-article-content">
      {blocks.map((block) => {
        if (block.type === "paragraph") {
          return (
            <p key={block.id}>
              {block.text}
            </p>
          );
        }

        if (block.type === "heading") {
          if (block.level === 3) {
            return (
              <h3 key={block.id}>
                {block.text}
              </h3>
            );
          }

          return (
            <h2 key={block.id}>
              {block.text}
            </h2>
          );
        }

        if (block.type === "quote") {
          return (
            <blockquote key={block.id}>
              <p>{block.text}</p>

              {block.attribution && (
                <cite>{block.attribution}</cite>
              )}
            </blockquote>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={block.id}>
              <img
                src={block.image.url}
                alt={block.image.alt}
                loading="lazy"
              />

              {block.image.caption && (
                <figcaption>
                  {block.image.caption}
                </figcaption>
              )}
            </figure>
          );
        }

        return null;
      })}
    </div>
  );
}
