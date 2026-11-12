
import { useEffect } from "react";

export function useDocumentMetadata(
  title: string,
  description?: string | null,
  canonicalUrl?: string | null
) {
  useEffect(() => {
    const previousTitle = document.title;

    document.title = title;

    let descriptionMeta =
      document.head.querySelector<HTMLMetaElement>(
        'meta[name="description"]'
      );

    const createdDescriptionMeta = !descriptionMeta;
    const previousDescription = descriptionMeta?.content ?? "";

    if (!descriptionMeta) {
      descriptionMeta = document.createElement("meta");
      descriptionMeta.name = "description";
      document.head.appendChild(descriptionMeta);
    }

    descriptionMeta.content = description ?? "";

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

    if (canonicalLink && canonicalUrl) {
      canonicalLink.href = canonicalUrl;
    }

    return () => {
      document.title = previousTitle;

      if (descriptionMeta) {
        if (createdDescriptionMeta) {
          descriptionMeta.remove();
        } else {
          descriptionMeta.content = previousDescription;
        }
      }

      if (canonicalLink) {
        if (createdCanonicalLink) {
          canonicalLink.remove();
        } else {
          canonicalLink.href = previousCanonicalUrl;
        }
      }
    };
  }, [title, description, canonicalUrl]);
}
