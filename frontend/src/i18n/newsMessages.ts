
import type { Locale } from "./messages";

export interface NewsUiMessages {
  searchLabel: string;
  searchPlaceholder: string;

  categoryLabel: string;
  allCategories: string;

  archiveTitle: string;
  allYears: string;

  sortLabel: string;
  newest: string;
  oldest: string;
  titleAsc: string;
  titleDesc: string;

  resultsCount: string;

  noResultsTitle: string;
  noResultsDescription: string;

  readMore: string;
  noImage: string;

  loadMore: string;
  clearFilters: string;

  articleUnavailableTitle: string;
  articleUnavailableDescription: string;
  backToNews: string;

  relatedTitle: string;

  publishedLabel: string;
  articleContentUnavailable: string;
}

export const newsMessages: Record<Locale, NewsUiMessages> = {
  ru: {
    searchLabel: "Поиск новостей",
    searchPlaceholder: "Введите заголовок или ключевое слово",

    categoryLabel: "Категория",
    allCategories: "Все категории",

    archiveTitle: "Архив новостей",
    allYears: "Все годы",

    sortLabel: "Сортировка",
    newest: "Сначала новые",
    oldest: "Сначала старые",
    titleAsc: "По названию: А–Я",
    titleDesc: "По названию: Я–А",

    resultsCount: "Найдено публикаций: {count}",

    noResultsTitle: "Ничего не найдено",
    noResultsDescription:
      "Попробуйте изменить поисковый запрос или параметры фильтрации.",

    readMore: "Читать далее",
    noImage: "Изображение отсутствует",

    loadMore: "Показать ещё",
    clearFilters: "Сбросить фильтры",

    articleUnavailableTitle: "Новость недоступна",
    articleUnavailableDescription:
      "Не удалось получить опубликованный материал. Возможно, он был снят с публикации или адрес изменился.",
    backToNews: "Вернуться к новостям",

    relatedTitle: "Связанные публикации",

    publishedLabel: "Дата публикации",
    articleContentUnavailable: "Текст публикации пока недоступен.",
  },

  be: {
    searchLabel: "Пошук навін",
    searchPlaceholder: "Увядзіце загаловак або ключавое слова",

    categoryLabel: "Катэгорыя",
    allCategories: "Усе катэгорыі",

    archiveTitle: "Архіў навін",
    allYears: "Усе гады",

    sortLabel: "Сартаванне",
    newest: "Спачатку новыя",
    oldest: "Спачатку старыя",
    titleAsc: "Па назве: А–Я",
    titleDesc: "Па назве: Я–А",

    resultsCount: "Знойдзена публікацый: {count}",

    noResultsTitle: "Нічога не знойдзена",
    noResultsDescription:
      "Паспрабуйце змяніць пошукавы запыт або параметры фільтрацыі.",

    readMore: "Чытаць далей",
    noImage: "Выява адсутнічае",

    loadMore: "Паказаць яшчэ",
    clearFilters: "Скінуць фільтры",

    articleUnavailableTitle: "Навіна недаступная",
    articleUnavailableDescription:
      "Не ўдалося атрымаць апублікаваны матэрыял. Магчыма, ён быў зняты з публікацыі або адрас змяніўся.",
    backToNews: "Вярнуцца да навін",

    relatedTitle: "Звязаныя публікацыі",

    publishedLabel: "Дата публікацыі",
    articleContentUnavailable: "Тэкст публікацыі пакуль недаступны.",
  },

  en: {
    searchLabel: "Search news",
    searchPlaceholder: "Enter a headline or keyword",

    categoryLabel: "Category",
    allCategories: "All categories",

    archiveTitle: "News archive",
    allYears: "All years",

    sortLabel: "Sort by",
    newest: "Newest first",
    oldest: "Oldest first",
    titleAsc: "Title: A–Z",
    titleDesc: "Title: Z–A",

    resultsCount: "Publications found: {count}",

    noResultsTitle: "No results found",
    noResultsDescription:
      "Try changing your search query or filter settings.",

    readMore: "Read more",
    noImage: "No image available",

    loadMore: "Load more",
    clearFilters: "Clear filters",

    articleUnavailableTitle: "News article unavailable",
    articleUnavailableDescription:
      "The published article could not be retrieved. It may have been unpublished or its address may have changed.",
    backToNews: "Back to news",

    relatedTitle: "Related publications",

    publishedLabel: "Publication date",
    articleContentUnavailable: "The article content is currently unavailable.",
  },

  zh: {
    searchLabel: "搜索新闻",
    searchPlaceholder: "输入标题或关键词",

    categoryLabel: "类别",
    allCategories: "所有类别",

    archiveTitle: "新闻档案",
    allYears: "所有年份",

    sortLabel: "排序",
    newest: "最新优先",
    oldest: "最早优先",
    titleAsc: "标题：A–Z",
    titleDesc: "标题：Z–A",

    resultsCount: "找到的文章：{count}",

    noResultsTitle: "未找到结果",
    noResultsDescription: "请尝试更改搜索内容或筛选条件。",

    readMore: "阅读更多",
    noImage: "暂无图片",

    loadMore: "加载更多",
    clearFilters: "清除筛选",

    articleUnavailableTitle: "新闻暂不可用",
    articleUnavailableDescription:
      "无法获取已发布的文章。该文章可能已取消发布或地址已更改。",
    backToNews: "返回新闻",

    relatedTitle: "相关文章",

    publishedLabel: "发布日期",
    articleContentUnavailable: "文章内容暂不可用。",
  },
};
