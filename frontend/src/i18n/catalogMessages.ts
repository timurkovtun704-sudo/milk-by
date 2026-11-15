
import type { Locale } from "./messages";

export interface CatalogUiMessages {
  searchLabel: string;
  searchPlaceholder: string;

  categoryLabel: string;
  allCategories: string;

  filtersTitle: string;
  filtersButton: string;
  clearFilters: string;
  noAvailableFilters: string;

  allValues: string;
  yes: string;
  no: string;

  minimum: string;
  maximum: string;

  sortLabel: string;
  sortNameAsc: string;
  sortNameDesc: string;
  sortNewest: string;

  resultsCount: string;

  noResultsTitle: string;
  noResultsDescription: string;

  detailsAction: string;
  formatsLabel: string;
  noImage: string;

  productUnavailableTitle: string;
  productUnavailableDescription: string;
  backToCatalog: string;

  productGalleryTitle: string;
  productSpecificationsTitle: string;
  productPackagingTitle: string;
  productPackagingAttributesTitle: string;
  productRelatedTitle: string;

  productNoSpecifications: string;
  productPackagingSelect: string;
  productWeight: string;
  productVolume: string;
  productShelfLife: string;

  // Названия шести фиксированных характеристик товара
  characteristicFatProcent: string;
  characteristicWeight: string;
  characteristicStorageConditions: string;
  characteristicShelfValue: string;
  characteristicEnergyValue: string;
  characteristicItemPerCase: string;
}

export const catalogMessages: Record<
  Locale,
  CatalogUiMessages
> = {
  ru: {
    searchLabel: "Поиск продукции",
    searchPlaceholder: "Введите название или ключевое слово",

    categoryLabel: "Категория",
    allCategories: "Все категории",

    filtersTitle: "Фильтры",
    filtersButton: "Показать фильтры",
    clearFilters: "Сбросить фильтры",
    noAvailableFilters:
      "Дополнительные фильтры появятся после получения характеристик продукции.",

    allValues: "Все значения",
    yes: "Да",
    no: "Нет",

    minimum: "От",
    maximum: "До",

    sortLabel: "Сортировка",
    sortNameAsc: "По названию: А–Я",
    sortNameDesc: "По названию: Я–А",
    sortNewest: "Сначала новые",

    resultsCount: "Найдено товаров: {count}",

    noResultsTitle: "Ничего не найдено",
    noResultsDescription:
      "Измените параметры поиска или сбросьте выбранные фильтры.",

    detailsAction: "Подробнее",
    formatsLabel: "Доступные фасовки",
    noImage: "Изображение отсутствует",

    productUnavailableTitle: "Информация о товаре недоступна",
    productUnavailableDescription:
      "Не удалось получить информацию об этой продукции.",
    backToCatalog: "Вернуться в каталог",

    productGalleryTitle: "Фотографии",
    productSpecificationsTitle: "Характеристики",
    productPackagingTitle: "Варианты фасовки",
    productPackagingAttributesTitle: "Характеристики выбранной фасовки",
    productRelatedTitle: "Связанные товары",

    productNoSpecifications: "Характеристики не указаны",
    productPackagingSelect: "Выберите фасовку",
    productWeight: "Масса",
    productVolume: "Объём",
    productShelfLife: "Срок годности",

    characteristicFatProcent: "Массовая доля жира",
    characteristicWeight: "Масса продукта",
    characteristicStorageConditions: "Условия хранения",
    characteristicShelfValue: "Срок годности",
    characteristicEnergyValue: "Энергетическая ценность",
    characteristicItemPerCase:
      "Количество товара в транспортной упаковке",
  },

  be: {
    searchLabel: "Пошук прадукцыі",
    searchPlaceholder: "Увядзіце назву або ключавое слова",

    categoryLabel: "Катэгорыя",
    allCategories: "Усе катэгорыі",

    filtersTitle: "Фільтры",
    filtersButton: "Паказаць фільтры",
    clearFilters: "Скінуць фільтры",
    noAvailableFilters:
      "Дадатковыя фільтры з'явяцца пасля атрымання характарыстык прадукцыі.",

    allValues: "Усе значэнні",
    yes: "Так",
    no: "Не",

    minimum: "Ад",
    maximum: "Да",

    sortLabel: "Сартаванне",
    sortNameAsc: "Па назве: А–Я",
    sortNameDesc: "Па назве: Я–А",
    sortNewest: "Спачатку новыя",

    resultsCount: "Знойдзена тавараў: {count}",

    noResultsTitle: "Нічога не знойдзена",
    noResultsDescription:
      "Змяніце параметры пошуку або скіньце выбраныя фільтры.",

    detailsAction: "Падрабязней",
    formatsLabel: "Даступныя фасоўкі",
    noImage: "Выява адсутнічае",

    productUnavailableTitle: "Інфармацыя пра тавар недаступная",
    productUnavailableDescription:
      "Не ўдалося атрымаць інфармацыю пра гэтую прадукцыю.",
    backToCatalog: "Вярнуцца ў каталог",

    productGalleryTitle: "Фатаграфіі",
    productSpecificationsTitle: "Характарыстыкі",
    productPackagingTitle: "Варыянты фасоўкі",
    productPackagingAttributesTitle: "Характарыстыкі выбранай фасоўкі",
    productRelatedTitle: "Звязаныя тавары",

    productNoSpecifications: "Характарыстыкі не ўказаны",
    productPackagingSelect: "Выберыце фасоўку",
    productWeight: "Маса",
    productVolume: "Аб'ём",
    productShelfLife: "Тэрмін прыдатнасці",

    characteristicFatProcent: "Масавая доля тлушчу",
    characteristicWeight: "Маса прадукту",
    characteristicStorageConditions: "Умовы захоўвання",
    characteristicShelfValue: "Тэрмін прыдатнасці",
    characteristicEnergyValue: "Энергетычная каштоўнасць",
    characteristicItemPerCase:
      "Колькасць тавару ў транспартнай упакоўцы",
  },

  en: {
    searchLabel: "Product search",
    searchPlaceholder: "Enter a name or keyword",

    categoryLabel: "Category",
    allCategories: "All categories",

    filtersTitle: "Filters",
    filtersButton: "Show filters",
    clearFilters: "Clear filters",
    noAvailableFilters:
      "Additional filters will appear when product specifications are available.",

    allValues: "All values",
    yes: "Yes",
    no: "No",

    minimum: "From",
    maximum: "To",

    sortLabel: "Sort by",
    sortNameAsc: "Name: A–Z",
    sortNameDesc: "Name: Z–A",
    sortNewest: "Newest first",

    resultsCount: "Products found: {count}",

    noResultsTitle: "No results found",
    noResultsDescription:
      "Change your search criteria or clear the selected filters.",

    detailsAction: "View details",
    formatsLabel: "Available formats",
    noImage: "No image available",

    productUnavailableTitle: "Product information is unavailable",
    productUnavailableDescription:
      "Information about this product could not be retrieved.",
    backToCatalog: "Back to catalogue",

    productGalleryTitle: "Photos",
    productSpecificationsTitle: "Specifications",
    productPackagingTitle: "Packaging options",
    productPackagingAttributesTitle: "Selected packaging specifications",
    productRelatedTitle: "Related products",

    productNoSpecifications: "No specifications provided",
    productPackagingSelect: "Select packaging",
    productWeight: "Weight",
    productVolume: "Volume",
    productShelfLife: "Shelf life",

    characteristicFatProcent: "Mass fraction of fat",
    characteristicWeight: "Product weight",
    characteristicStorageConditions: "Storage conditions",
    characteristicShelfValue: "Shelf life",
    characteristicEnergyValue: "Energy value",
    characteristicItemPerCase:
      "Number of items per transport package",
  },

  zh: {
    searchLabel: "产品搜索",
    searchPlaceholder: "输入名称或关键词",

    categoryLabel: "类别",
    allCategories: "所有类别",

    filtersTitle: "筛选",
    filtersButton: "显示筛选",
    clearFilters: "清除筛选",
    noAvailableFilters: "获取产品参数后将显示其他筛选条件。",

    allValues: "所有值",
    yes: "是",
    no: "否",

    minimum: "最小值",
    maximum: "最大值",

    sortLabel: "排序",
    sortNameAsc: "名称：A–Z",
    sortNameDesc: "名称：Z–A",
    sortNewest: "最新优先",

    resultsCount: "找到的产品：{count}",

    noResultsTitle: "未找到结果",
    noResultsDescription: "请更改搜索条件或清除已选筛选。",

    detailsAction: "查看详情",
    formatsLabel: "可选规格",
    noImage: "暂无图片",

    productUnavailableTitle: "产品信息暂不可用",
    productUnavailableDescription:
      "无法获取该产品的信息。",
    backToCatalog: "返回产品目录",

    productGalleryTitle: "产品图片",
    productSpecificationsTitle: "产品参数",
    productPackagingTitle: "包装规格",
    productPackagingAttributesTitle: "所选包装规格参数",
    productRelatedTitle: "相关产品",

    productNoSpecifications: "暂无产品参数",
    productPackagingSelect: "选择包装规格",
    productWeight: "重量",
    productVolume: "容量",
    productShelfLife: "保质期",

    characteristicFatProcent: "脂肪质量分数",
    characteristicWeight: "产品重量",
    characteristicStorageConditions: "储存条件",
    characteristicShelfValue: "保质期",
    characteristicEnergyValue: "能量值",
    characteristicItemPerCase: "每个运输包装中的产品数量",
  },
};
