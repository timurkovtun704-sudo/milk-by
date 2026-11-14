
import { useEffect } from "react";

export interface DocumentMetadataOptions {
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  isIndexable?: boolean;
  isFollowable?: boolean;
}

export function useDocumentMetadata(
  title: string,
  description?: string | null,
  canonicalUrl?: string | null,
  options?: DocumentMetadataOptions
) {
  const ogTitle = options?.ogTitle;
  const ogDescription = options?.ogDescription;
  const ogImageUrl = options?.ogImageUrl;

  const isIndexable = options?.isIndexable;
  const isFollowable = options?.isFollowable;

  useEffect(() => {
    const previousTitle = document.title;

    document.title = title;

    interface MetaSnapshot {
      element: HTMLMetaElement;
      created: boolean;
      previousContent: string;
    }

    const snapshots: MetaSnapshot[] = [];

    // Изменение meta-тега с сохранением предыдущего значения
    function setMeta(
      attribute: "name" | "property",
      key: string,
      content: string | null | undefined,
      createIfMissing = false
    ) {
      const selector = `meta[${attribute}="${key}"]`;

      let element =
        document.head.querySelector<HTMLMetaElement>(selector);

      const created = !element;

      if (!element && createIfMissing) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }

      if (!element) {
        return;
      }

      snapshots.push({
        element,
        created,
        previousContent: element.content,
      });

      element.content = content ?? "";
    }

    // Основное описание страницы
    setMeta(
      "name",
      "description",
      description ?? "",
      true
    );

    // Open Graph
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", ogDescription);
    setMeta("property", "og:image", ogImageUrl);

    // Директивы для поисковых роботов
    const robotsParts = [
      isIndexable === false ? "noindex" : "index",
      isFollowable === false ? "nofollow" : "follow",
    ];

    const robotsContent =
      isIndexable === false || isFollowable === false
        ? robotsParts.join(", ")
        : null;

    setMeta(
      "name",
      "robots",
      robotsContent
    );

    // Canonical URL
    let canonicalLink =
      document.head.querySelector<HTMLLinkElement>(
        'link[rel="canonical"]'
      );

    const createdCanonicalLink =
      !canonicalLink && Boolean(canonicalUrl);

    const previousCanonicalUrl =
      canonicalLink?.href ?? "";

    if (!canonicalLink && canonicalUrl) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }

    if (canonicalLink) {
      canonicalLink.href = canonicalUrl ?? "";
    }

    return () => {
      document.title = previousTitle;

      // Восстанавливаем предыдущие meta-теги
      for (const snapshot of snapshots.reverse()) {
        if (snapshot.created) {
          snapshot.element.remove();
        } else {
          snapshot.element.content = snapshot.previousContent;
        }
      }

      // Восстанавливаем canonical
      if (canonicalLink) {
        if (createdCanonicalLink) {
          canonicalLink.remove();
        } else {
          canonicalLink.href = previousCanonicalUrl;
        }
      }
    };
  }, [
    title,
    description,
    canonicalUrl,
    ogTitle,
    ogDescription,
    ogImageUrl,
    isIndexable,
    isFollowable,
  ]);
}
