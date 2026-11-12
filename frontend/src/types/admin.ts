
export type AdminNoticeVariant = "info" | "success" | "warning";

export interface AdminNoticeData {
  message: string;
  variant: AdminNoticeVariant;
}

export type AdminSection =
  | "dashboard"
  | "categories"
  | "products"
  | "news"
  | "translations"
  | "seo";
