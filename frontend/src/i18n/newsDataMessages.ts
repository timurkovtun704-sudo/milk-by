
import type { Locale } from "./messages";

export interface NewsDataMessages {
  loading: string;
  loadErrorTitle: string;
  loadErrorDescription: string;
}

export const newsDataMessages: Record<
  Locale,
  NewsDataMessages
> = {
  ru: {
    loading: "Загрузка новостей...",
    loadErrorTitle: "Не удалось загрузить новости",
    loadErrorDescription:
      "Проверьте подключение к серверу и попробуйте обновить страницу.",
  },

  be: {
    loading: "Загрузка навін...",
    loadErrorTitle: "Не ўдалося загрузіць навіны",
    loadErrorDescription:
      "Праверце падключэнне да сервера і паспрабуйце абнавіць старонку.",
  },

  en: {
    loading: "Loading news...",
    loadErrorTitle: "Failed to load news",
    loadErrorDescription:
      "Check the server connection and try refreshing the page.",
  },

  zh: {
    loading: "正在加载新闻...",
    loadErrorTitle: "无法加载新闻",
    loadErrorDescription:
      "请检查服务器连接，然后尝试刷新页面。",
  },
};
