
import type { Locale } from "./messages";
import type { InfoPageKey } from "./messages";

export type SeoManagedPage =
  | "home"
  | "products"
  | "news"
  | InfoPageKey;

export interface SeoPageOption {
  value: SeoManagedPage;
  label: string;
}

export const adminSeoPageOptions: Record<
  Locale,
  readonly SeoPageOption[]
> = {
  ru: [
    { value: "home", label: "Главная" },
    { value: "products", label: "Продукция" },
    { value: "news", label: "Новости" },
    { value: "about", label: "О компании" },
    { value: "export", label: "Экспорт" },
    { value: "partners", label: "Партнёрам" },
    { value: "contacts", label: "Контакты" },
  ],

  be: [
    { value: "home", label: "Галоўная" },
    { value: "products", label: "Прадукцыя" },
    { value: "news", label: "Навіны" },
    { value: "about", label: "Пра кампанію" },
    { value: "export", label: "Экспарт" },
    { value: "partners", label: "Партнёрам" },
    { value: "contacts", label: "Кантакты" },
  ],

  en: [
    { value: "home", label: "Home" },
    { value: "products", label: "Products" },
    { value: "news", label: "News" },
    { value: "about", label: "About us" },
    { value: "export", label: "Export" },
    { value: "partners", label: "Partners" },
    { value: "contacts", label: "Contacts" },
  ],

  zh: [
    { value: "home", label: "首页" },
    { value: "products", label: "产品" },
    { value: "news", label: "新闻" },
    { value: "about", label: "关于我们" },
    { value: "export", label: "出口" },
    { value: "partners", label: "合作伙伴" },
    { value: "contacts", label: "联系方式" },
  ],
};
