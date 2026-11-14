
import type { Locale } from "./messages";

export interface CatalogDataMessages {
  loading: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;

  productLoading: string;
  productErrorTitle: string;
  productErrorDescription: string;
}

export const catalogDataMessages: Record<
  Locale,
  CatalogDataMessages
> = {
  ru: {
    loading: "Загрузка каталога...",
    errorTitle: "Не удалось загрузить каталог",
    errorDescription:
      "Проверьте подключение к серверу и попробуйте ещё раз.",
    retry: "Повторить попытку",

    productLoading: "Загрузка информации о товаре...",
    productErrorTitle: "Не удалось загрузить товар",
    productErrorDescription:
      "Проверьте подключение к серверу и попробуйте ещё раз.",
  },

  be: {
    loading: "Загрузка каталога...",
    errorTitle: "Не ўдалося загрузіць каталог",
    errorDescription:
      "Праверце злучэнне з серверам і паспрабуйце яшчэ раз.",
    retry: "Паўтарыць спробу",

    productLoading: "Загрузка інфармацыі пра тавар...",
    productErrorTitle: "Не ўдалося загрузіць тавар",
    productErrorDescription:
      "Праверце злучэнне з серверам і паспрабуйце яшчэ раз.",
  },

  en: {
    loading: "Loading catalogue...",
    errorTitle: "Could not load the catalogue",
    errorDescription:
      "Check the server connection and try again.",
    retry: "Retry",

    productLoading: "Loading product information...",
    productErrorTitle: "Could not load the product",
    productErrorDescription:
      "Check the server connection and try again.",
  },

  zh: {
    loading: "正在加载产品目录...",
    errorTitle: "无法加载产品目录",
    errorDescription:
      "请检查服务器连接，然后重试。",
    retry: "重试",

    productLoading: "正在加载产品信息...",
    productErrorTitle: "无法加载产品",
    productErrorDescription:
      "请检查服务器连接，然后重试。",
  },
};
