import type { Locale } from "./messages";

export interface AdminApiMessages {
  loading: string;
  loadError: string;
  retry: string;
  noProducts: string;

  create: string;
  edit: string;
  delete: string;
  save: string;
  saving: string;
  cancel: string;
  confirmDelete: string;

  name: string;
  description: string;
  imageUrl: string;
  category: string;
  status: string;
  active: string;
  inactive: string;

  createSuccess: string;
  updateSuccess: string;
  deleteSuccess: string;
  operationError: string;

  categoriesLoading: string;
  categoriesError: string;
  noCategories: string;
  categoryCreateSuccess: string;
  categoryUpdateSuccess: string;
  categoryDeleteSuccess: string;
  confirmDeleteCategory: string;
  categoryName: string;
}

export const adminApiMessages: Record<
  Locale,
  AdminApiMessages
> = {
  ru: {
    loading: "Загрузка товаров...",
    loadError: "Не удалось загрузить товары",
    retry: "Повторить",
    noProducts: "Товаров пока нет",

    create: "Создать товар",
    edit: "Редактировать",
    delete: "Удалить",
    save: "Сохранить",
    saving: "Сохранение...",
    cancel: "Отмена",
    confirmDelete: "Удалить этот товар?",

    name: "Название товара",
    description: "Описание",
    imageUrl: "URL изображения",
    category: "Категория",
    status: "Статус",
    active: "Активен",
    inactive: "Неактивен",

    createSuccess: "Товар успешно создан",
    updateSuccess: "Товар успешно обновлён",
    deleteSuccess: "Товар успешно удалён",
    operationError: "Не удалось выполнить операцию",

    categoriesLoading: "Загрузка категорий...",
    categoriesError: "Не удалось загрузить категории",
    noCategories: "Сначала создайте категорию",
    categoryCreateSuccess: "Категория успешно создана",
    categoryUpdateSuccess: "Категория успешно обновлена",
    categoryDeleteSuccess: "Категория успешно удалена",
    confirmDeleteCategory: "Удалить эту категорию?",
    categoryName: "Название категории",
  },

  be: {
    loading: "Загрузка тавараў...",
    loadError: "Не ўдалося загрузіць тавары",
    retry: "Паўтарыць",
    noProducts: "Пакуль няма тавараў",

    create: "Стварыць тавар",
    edit: "Рэдагаваць",
    delete: "Выдаліць",
    save: "Захаваць",
    saving: "Захаванне...",
    cancel: "Адмена",
    confirmDelete: "Выдаліць гэты тавар?",

    name: "Назва тавару",
    description: "Апісанне",
    imageUrl: "URL выявы",
    category: "Катэгорыя",
    status: "Статус",
    active: "Актыўны",
    inactive: "Неактыўны",

    createSuccess: "Тавар паспяхова створаны",
    updateSuccess: "Тавар паспяхова абноўлены",
    deleteSuccess: "Тавар паспяхова выдалены",
    operationError: "Не ўдалося выканаць аперацыю",

    categoriesLoading: "Загрузка катэгорый...",
    categoriesError: "Не ўдалося загрузіць катэгорыі",
    noCategories: "Спачатку стварыце катэгорыю",
    categoryCreateSuccess: "Катэгорыя паспяхова створана",
    categoryUpdateSuccess: "Катэгорыя паспяхова абноўлена",
    categoryDeleteSuccess: "Катэгорыя паспяхова выдалена",
    confirmDeleteCategory: "Выдаліць гэтую катэгорыю?",
    categoryName: "Назва катэгорыі",
  },

  en: {
    loading: "Loading products...",
    loadError: "Could not load products",
    retry: "Retry",
    noProducts: "No products yet",

    create: "Create product",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    confirmDelete: "Delete this product?",

    name: "Product name",
    description: "Description",
    imageUrl: "Image URL",
    category: "Category",
    status: "Status",
    active: "Active",
    inactive: "Inactive",

    createSuccess: "Product created successfully",
    updateSuccess: "Product updated successfully",
    deleteSuccess: "Product deleted successfully",
    operationError: "The operation could not be completed",

    categoriesLoading: "Loading categories...",
    categoriesError: "Could not load categories",
    noCategories: "Create a category first",
    categoryCreateSuccess: "Category created successfully",
    categoryUpdateSuccess: "Category updated successfully",
    categoryDeleteSuccess: "Category deleted successfully",
    confirmDeleteCategory: "Delete this category?",
    categoryName: "Category name",
  },

  zh: {
    loading: "正在加载产品...",
    loadError: "无法加载产品",
    retry: "重试",
    noProducts: "暂无产品",

    create: "创建产品",
    edit: "编辑",
    delete: "删除",
    save: "保存",
    saving: "正在保存...",
    cancel: "取消",
    confirmDelete: "确定删除此产品吗？",

    name: "产品名称",
    description: "产品描述",
    imageUrl: "图片 URL",
    category: "类别",
    status: "状态",
    active: "已启用",
    inactive: "已停用",

    createSuccess: "产品创建成功",
    updateSuccess: "产品更新成功",
    deleteSuccess: "产品删除成功",
    operationError: "无法完成操作",

    categoriesLoading: "正在加载类别...",
    categoriesError: "无法加载类别",
    noCategories: "请先创建类别",
    categoryCreateSuccess: "类别创建成功",
    categoryUpdateSuccess: "类别更新成功",
    categoryDeleteSuccess: "类别删除成功",
    confirmDeleteCategory: "确定删除此类别吗？",
    categoryName: "类别名称",
  },
};