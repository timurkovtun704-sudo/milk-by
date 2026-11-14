
import type { Locale } from "./messages";

export interface AdminNewsApiMessages {
  loading: string;
  loadError: string;
  retry: string;
  noNews: string;

  create: string;
  edit: string;
  delete: string;
  publish: string;
  unpublish: string;
  save: string;
  saving: string;
  cancel: string;
  confirmDelete: string;

  title: string;
  slug: string;
  slugHelp: string;
  date: string;
  category: string;
  noCategory: string;
  content: string;
  imageUrl: string;
  status: string;
  draft: string;
  published: string;

  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  publishSuccess: string;
  unpublishSuccess: string;
  operationError: string;
  tokenMissing: string;

  categoriesTitle: string;
  categoryName: string;
  categoryCreate: string;
  categoryDelete: string;
  categoryCreateSuccess: string;
  categoryDeleteSuccess: string;
  categoryDeleteConfirm: string;
  categoriesEmpty: string;
}

export const adminNewsApiMessages: Record<
  Locale,
  AdminNewsApiMessages
> = {
  ru: {
    loading: "Загрузка новостей...",
    loadError: "Не удалось загрузить новости",
    retry: "Повторить",
    noNews: "Новостей пока нет",

    create: "Создать публикацию",
    edit: "Редактировать",
    delete: "Удалить",
    publish: "Опубликовать",
    unpublish: "Снять с публикации",
    save: "Сохранить",
    saving: "Сохранение...",
    cancel: "Отмена",
    confirmDelete: "Удалить эту публикацию?",

    title: "Заголовок",
    slug: "URL-адрес (slug)",
    slugHelp: "Если оставить поле пустым, адрес будет сформирован из заголовка.",
    date: "Дата публикации",
    category: "Категория",
    noCategory: "Без категории",
    content: "Текст публикации",
    imageUrl: "URL изображения",
    status: "Статус публикации",
    draft: "Черновик",
    published: "Опубликована",

    createSuccess: "Публикация создана",
    updateSuccess: "Публикация обновлена",
    deleteSuccess: "Публикация удалена",
    publishSuccess: "Публикация опубликована",
    unpublishSuccess: "Публикация снята с публикации",
    operationError: "Не удалось выполнить операцию",
    tokenMissing: "Не найден токен авторизации",

    categoriesTitle: "Категории новостей",
    categoryName: "Название категории",
    categoryCreate: "Создать категорию",
    categoryDelete: "Удалить категорию",
    categoryCreateSuccess: "Категория создана",
    categoryDeleteSuccess: "Категория удалена",
    categoryDeleteConfirm: "Удалить эту категорию?",
    categoriesEmpty: "Категорий пока нет",
  },

  be: {
    loading: "Загрузка навін...",
    loadError: "Не ўдалося загрузіць навіны",
    retry: "Паўтарыць",
    noNews: "Пакуль няма навін",

    create: "Стварыць публікацыю",
    edit: "Рэдагаваць",
    delete: "Выдаліць",
    publish: "Апублікаваць",
    unpublish: "Зняць з публікацыі",
    save: "Захаваць",
    saving: "Захаванне...",
    cancel: "Адмена",
    confirmDelete: "Выдаліць гэтую публікацыю?",

    title: "Загаловак",
    slug: "URL-адрас (slug)",
    slugHelp: "Калі пакінуць поле пустым, адрас будзе створаны з загалоўка.",
    date: "Дата публікацыі",
    category: "Катэгорыя",
    noCategory: "Без катэгорыі",
    content: "Тэкст публікацыі",
    imageUrl: "URL выявы",
    status: "Статус публікацыі",
    draft: "Чарнавік",
    published: "Апублікавана",

    createSuccess: "Публікацыя створана",
    updateSuccess: "Публікацыя абноўлена",
    deleteSuccess: "Публікацыя выдалена",
    publishSuccess: "Публікацыя апублікавана",
    unpublishSuccess: "Публікацыя знята з публікацыі",
    operationError: "Не ўдалося выканаць аперацыю",
    tokenMissing: "Не знойдзены токен аўтарызацыі",

    categoriesTitle: "Катэгорыі навін",
    categoryName: "Назва катэгорыі",
    categoryCreate: "Стварыць катэгорыю",
    categoryDelete: "Выдаліць катэгорыю",
    categoryCreateSuccess: "Катэгорыя створана",
    categoryDeleteSuccess: "Катэгорыя выдалена",
    categoryDeleteConfirm: "Выдаліць гэтую катэгорыю?",
    categoriesEmpty: "Катэгорый пакуль няма",
  },

  en: {
    loading: "Loading news...",
    loadError: "Failed to load news",
    retry: "Retry",
    noNews: "No news yet",

    create: "Create publication",
    edit: "Edit",
    delete: "Delete",
    publish: "Publish",
    unpublish: "Unpublish",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    confirmDelete: "Delete this publication?",

    title: "Headline",
    slug: "URL slug",
    slugHelp: "Leave this field empty to generate the URL from the headline.",
    date: "Publication date",
    category: "Category",
    noCategory: "No category",
    content: "Article content",
    imageUrl: "Image URL",
    status: "Publication status",
    draft: "Draft",
    published: "Published",

    createSuccess: "Publication created",
    updateSuccess: "Publication updated",
    deleteSuccess: "Publication deleted",
    publishSuccess: "Publication published",
    unpublishSuccess: "Publication unpublished",
    operationError: "The operation could not be completed",
    tokenMissing: "Authorization token is missing",

    categoriesTitle: "News categories",
    categoryName: "Category name",
    categoryCreate: "Create category",
    categoryDelete: "Delete category",
    categoryCreateSuccess: "Category created",
    categoryDeleteSuccess: "Category deleted",
    categoryDeleteConfirm: "Delete this category?",
    categoriesEmpty: "No categories yet",
  },

  zh: {
    loading: "正在加载新闻...",
    loadError: "无法加载新闻",
    retry: "重试",
    noNews: "暂无新闻",

    create: "创建新闻",
    edit: "编辑",
    delete: "删除",
    publish: "发布",
    unpublish: "取消发布",
    save: "保存",
    saving: "正在保存...",
    cancel: "取消",
    confirmDelete: "确定删除这条新闻吗？",

    title: "标题",
    slug: "URL 地址",
    slugHelp: "留空时将根据标题生成 URL。",
    date: "发布日期",
    category: "分类",
    noCategory: "无分类",
    content: "新闻内容",
    imageUrl: "图片 URL",
    status: "发布状态",
    draft: "草稿",
    published: "已发布",

    createSuccess: "新闻已创建",
    updateSuccess: "新闻已更新",
    deleteSuccess: "新闻已删除",
    publishSuccess: "新闻已发布",
    unpublishSuccess: "新闻已取消发布",
    operationError: "操作失败",
    tokenMissing: "缺少授权令牌",

    categoriesTitle: "新闻分类",
    categoryName: "分类名称",
    categoryCreate: "创建分类",
    categoryDelete: "删除分类",
    categoryCreateSuccess: "分类已创建",
    categoryDeleteSuccess: "分类已删除",
    categoryDeleteConfirm: "确定删除此分类吗？",
    categoriesEmpty: "暂无分类",
  },
};
