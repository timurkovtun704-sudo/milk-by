
import { useDocumentMetadata } from "./useDocumentMetadata";

export function useProductMetadata(
  title: string,
  description?: string | null,
  canonicalUrl?: string | null
) {
  useDocumentMetadata(
    title,
    description,
    canonicalUrl
  );
}
