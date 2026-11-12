
import type { Locale } from "./messages";

export interface AdminMessages {
  panelName: string;
  panelDescription: string;

  navigation: {
    dashboard: string;
    categories: string;
    products: string;
    news: string;
    translations: string;
    seo: string;
    backToSite: string;
  };

  common: {
    language: string;
    required: string;
    close: string;
    cancel: string;
    noRecords: string;
    noRecordsDescription: string;
    frontendMode: string;
    frontendModeDescription: string;
    checkForm: string;
    add: string;
    remove: string;
    addAttribute: string;
    addPackaging: string;
    selectOption: string;
    notAvailable: string;
  };

  dashboard: {
    title: string;
    description: string;
    statusTitle: string;
    statusDescription: string;
    categoriesTitle: string;
    productsTitle: string;
    newsTitle: string;
    translationsTitle: string;
    quickActions: string;
    quickActionsDescription: string;
  };

  categories: {
    title: string;
    description: string;
    addTitle: string;
    formTitle: string;
    name: string;
    slug: string;
    descriptionField: string;
    parent: string;
    rootCategory: string;
    noParentOptions: string;
    noCategoriesTitle: string;
    noCategoriesDescription: string;
  };

  products: {
    title: string;
    description: string;
    addTitle: string;
    formTitle: string;
    name: string;
    slug: string;
    category: string;
    categoryRequired: string;
    noCategories: string;
    descriptionField: string;
    images: string;
    imagesHelp: string;
    characteristics: string;
    attributeName: string;
    attributeValue: string;
    packagings: string;
    packagingName: string;
    weight: string;
    volume: string;
    unit: string;
    shelfLife: string;
    status: string;
    draft: string;
    published: string;
    hidden: string;
    seoTitle: string;
    seoDescription: string;
  };

  news: {
    title: string;
    description: string;
    addTitle: string;
    formTitle: string;
    headline: string;
    slug: string;
    date: string;
    category: string;
    noCategories: string;
    summary: string;
    image: string;
    imageHelp: string;
    content: string;
    status: string;
    draft: string;
    published: string;
    seoTitle: string;
    seoDescription: string;
  };

  translations: {
    title: string;
    description: string;
    sourceLanguage: string;
    targetLanguage: string;
    contentType: string;
    categories: string;
    products: string;
    news: string;
    pages: string;
    tableItem: string;
    tableRussian: string;
    tableBelarusian: string;
    tableEnglish: string;
    tableChinese: string;
    tableStatus: string;
    emptyTitle: string;
    emptyDescription: string;
  };

  seo: {
    title: string;
    description: string;
    page: string;
    pageTitle: string;
    pageDescription: string;
    h1: string;
    canonical: string;
    help: string;
  };

  feedback: {
    formChecked: string;
    notSaved: string;
    closeNotice: string;
  };
}

export const adminMessages: Record<Locale, AdminMessages> = {
  ru: {
    panelName: "Панель управления",
    panelDescription: "Управление содержимым сайта",

    navigation: {
      dashboard: "Главная",
      categories: "Категории",
      products: "Продукция",
      news: "Новости",
      translations: "Переводы",
      seo: "SEO",
      backToSite: "Вернуться на сайт",
    },

    common: {
      language: "Язык интерфейса",
      required: "Обязательное поле",
      close: "Закрыть",
      cancel: "Отмена",
      noRecords: "Записей пока нет",
      noRecordsDescription:
        "После подключения серверной части здесь будут отображаться реальные данные.",
      frontendMode: "Режим разработки frontend",
      frontendModeDescription:
        "Серверное API не подключено. Данные форм не сохраняются и не публикуются.",
      checkForm: "Проверить заполнение",
      add: "Добавить",
      remove: "Удалить строку",
      addAttribute: "Добавить характеристику",
      addPackaging: "Добавить фасовку",
      selectOption: "Выберите значение",
      notAvailable: "Недоступно",
    },

    dashboard: {
      title: "Обзор",
      description:
        "Рабочее пространство управления содержимым сайта.",
      statusTitle: "Подключение данных",
      statusDescription:
        "Серверная часть ещё не подключена. Все разделы подготовлены для последующей интеграции с API.",
      categoriesTitle: "Категории продукции",
      productsTitle: "Товары",
      newsTitle: "Новости",
      translationsTitle: "Переводы",
      quickActions: "Разделы управления",
      quickActionsDescription:
        "Выберите раздел для работы с содержимым сайта.",
    },

    categories: {
      title: "Категории продукции",
      description:
        "Создание и управление категориями и подкатегориями каталога.",
      addTitle: "Добавить категорию",
      formTitle: "Новая категория",
      name: "Название",
      slug: "URL-адрес (slug)",
      descriptionField: "Описание",
      parent: "Родительская категория",
      rootCategory: "Корневая категория",
      noParentOptions: "Родительские категории пока отсутствуют.",
      noCategoriesTitle: "Категорий пока нет",
      noCategoriesDescription:
        "Здесь будут отображаться категории, созданные сотрудниками через панель управления.",
    },

    products: {
      title: "Управление продукцией",
      description:
        "Создание и редактирование товаров, характеристик, фотографий и фасовок.",
      addTitle: "Добавить товар",
      formTitle: "Новая карточка товара",
      name: "Название товара",
      slug: "URL-адрес (slug)",
      category: "Категория",
      categoryRequired: "Для создания товара необходимо выбрать категорию.",
      noCategories:
        "Сначала необходимо создать категорию. Сейчас категории отсутствуют.",
      descriptionField: "Описание товара",
      images: "Фотографии товара",
      imagesHelp:
        "Можно выбрать несколько изображений. Файлы пока не отправляются на сервер.",
      characteristics: "Характеристики товара",
      attributeName: "Название характеристики",
      attributeValue: "Значение",
      packagings: "Фасовки",
      packagingName: "Название фасовки",
      weight: "Масса",
      volume: "Объём",
      unit: "Единица измерения",
      shelfLife: "Срок годности",
      status: "Статус",
      draft: "Черновик",
      published: "Опубликован",
      hidden: "Скрыт",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    news: {
      title: "Управление новостями",
      description:
        "Создание, редактирование и подготовка публикаций.",
      addTitle: "Добавить новость",
      formTitle: "Новая публикация",
      headline: "Заголовок",
      slug: "URL-адрес (slug)",
      date: "Дата публикации",
      category: "Категория новости",
      noCategories:
        "Список категорий новостей будет предоставляться серверной частью.",
      summary: "Краткое описание",
      image: "Изображение публикации",
      imageHelp:
        "Выберите файл для проверки интерфейса. Загрузка на сервер пока недоступна.",
      content: "Текст публикации",
      status: "Статус публикации",
      draft: "Черновик",
      published: "Опубликована",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    translations: {
      title: "Управление переводами",
      description:
        "Контроль языковых версий и полноты перевода материалов.",
      sourceLanguage: "Исходный язык",
      targetLanguage: "Язык перевода",
      contentType: "Тип содержимого",
      categories: "Категории",
      products: "Товары",
      news: "Новости",
      pages: "Страницы",
      tableItem: "Материал",
      tableRussian: "Русский",
      tableBelarusian: "Белорусский",
      tableEnglish: "Английский",
      tableChinese: "Китайский",
      tableStatus: "Заполненность",
      emptyTitle: "Материалов для перевода пока нет",
      emptyDescription:
        "После подключения API здесь появятся реальные материалы и состояние их переводов.",
    },

    seo: {
      title: "SEO-настройки",
      description:
        "Настройка поисковых метаданных корпоративных страниц.",
      page: "Страница",
      pageTitle: "Title",
      pageDescription: "Description",
      h1: "H1",
      canonical: "Canonical URL",
      help:
        "Индивидуальные SEO-данные товаров и новостей будут редактироваться непосредственно в соответствующих формах.",
    },

    feedback: {
      formChecked:
        "Проверка заполнения выполнена.",
      notSaved:
        "Данные остались только в текущей форме. Они не отправлены, не сохранены и не появятся в списках.",
      closeNotice: "Закрыть уведомление",
    },
  },

  be: {
    panelName: "Панэль кіравання",
    panelDescription: "Кіраванне змесцівам сайта",

    navigation: {
      dashboard: "Галоўная",
      categories: "Катэгорыі",
      products: "Прадукцыя",
      news: "Навіны",
      translations: "Пераклады",
      seo: "SEO",
      backToSite: "Вярнуцца на сайт",
    },

    common: {
      language: "Мова інтэрфейсу",
      required: "Абавязковае поле",
      close: "Закрыць",
      cancel: "Адмена",
      noRecords: "Пакуль няма запісаў",
      noRecordsDescription:
        "Пасля падключэння сервернай часткі тут будуць адлюстроўвацца рэальныя даныя.",
      frontendMode: "Рэжым распрацоўкі frontend",
      frontendModeDescription:
        "Сервернае API не падключана. Даныя формаў не захоўваюцца і не публікуюцца.",
      checkForm: "Праверыць запаўненне",
      add: "Дадаць",
      remove: "Выдаліць радок",
      addAttribute: "Дадаць характарыстыку",
      addPackaging: "Дадаць фасоўку",
      selectOption: "Выберыце значэнне",
      notAvailable: "Недаступна",
    },

    dashboard: {
      title: "Агляд",
      description: "Працоўная прастора кіравання сайтам.",
      statusTitle: "Падключэнне даных",
      statusDescription:
        "Серверная частка яшчэ не падключана. Раздзелы падрыхтаваны для наступнай інтэграцыі з API.",
      categoriesTitle: "Катэгорыі прадукцыі",
      productsTitle: "Тавары",
      newsTitle: "Навіны",
      translationsTitle: "Пераклады",
      quickActions: "Раздзелы кіравання",
      quickActionsDescription:
        "Выберыце раздзел для працы са змесцівам сайта.",
    },

    categories: {
      title: "Катэгорыі прадукцыі",
      description: "Стварэнне і кіраванне катэгорыямі і падкатэгорыямі.",
      addTitle: "Дадаць катэгорыю",
      formTitle: "Новая катэгорыя",
      name: "Назва",
      slug: "URL-адрас (slug)",
      descriptionField: "Апісанне",
      parent: "Бацькоўская катэгорыя",
      rootCategory: "Каранёвая катэгорыя",
      noParentOptions: "Бацькоўскія катэгорыі пакуль адсутнічаюць.",
      noCategoriesTitle: "Катэгорый пакуль няма",
      noCategoriesDescription:
        "Тут будуць адлюстроўвацца катэгорыі, створаныя супрацоўнікамі.",
    },

    products: {
      title: "Кіраванне прадукцыяй",
      description: "Стварэнне і рэдагаванне тавараў і іх характарыстык.",
      addTitle: "Дадаць тавар",
      formTitle: "Новая картка тавару",
      name: "Назва тавару",
      slug: "URL-адрас (slug)",
      category: "Катэгорыя",
      categoryRequired: "Для стварэння тавару неабходна выбраць катэгорыю.",
      noCategories: "Спачатку неабходна стварыць катэгорыю.",
      descriptionField: "Апісанне тавару",
      images: "Фатаграфіі тавару",
      imagesHelp: "Файлы пакуль не адпраўляюцца на сервер.",
      characteristics: "Характарыстыкі тавару",
      attributeName: "Назва характарыстыкі",
      attributeValue: "Значэнне",
      packagings: "Фасоўкі",
      packagingName: "Назва фасоўкі",
      weight: "Маса",
      volume: "Аб'ём",
      unit: "Адзінка вымярэння",
      shelfLife: "Тэрмін прыдатнасці",
      status: "Статус",
      draft: "Чарнавік",
      published: "Апублікаваны",
      hidden: "Схаваны",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    news: {
      title: "Кіраванне навінамі",
      description: "Стварэнне і падрыхтоўка публікацый.",
      addTitle: "Дадаць навіну",
      formTitle: "Новая публікацыя",
      headline: "Загаловак",
      slug: "URL-адрас (slug)",
      date: "Дата публікацыі",
      category: "Катэгорыя навіны",
      noCategories: "Спіс катэгорый навін будзе прадастаўлены праз API.",
      summary: "Кароткае апісанне",
      image: "Выява публікацыі",
      imageHelp: "Файл пакуль не загружаецца на сервер.",
      content: "Тэкст публікацыі",
      status: "Статус публікацыі",
      draft: "Чарнавік",
      published: "Апублікаваная",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    translations: {
      title: "Кіраванне перакладамі",
      description: "Кантроль моўных версій і паўнаты перакладаў.",
      sourceLanguage: "Зыходная мова",
      targetLanguage: "Мова перакладу",
      contentType: "Тып змесціва",
      categories: "Катэгорыі",
      products: "Тавары",
      news: "Навіны",
      pages: "Старонкі",
      tableItem: "Матэрыял",
      tableRussian: "Руская",
      tableBelarusian: "Беларуская",
      tableEnglish: "Англійская",
      tableChinese: "Кітайская",
      tableStatus: "Запоўненасць",
      emptyTitle: "Матэрыялаў для перакладу пакуль няма",
      emptyDescription:
        "Пасля падключэння API тут з'явяцца рэальныя матэрыялы і стан іх перакладаў.",
    },

    seo: {
      title: "SEO-налады",
      description: "Налады пошукавых метаданых старонак.",
      page: "Старонка",
      pageTitle: "Title",
      pageDescription: "Description",
      h1: "H1",
      canonical: "Canonical URL",
      help:
        "SEO-дадзеныя тавараў і навін будуць рэдагавацца ў адпаведных формах.",
    },

    feedback: {
      formChecked: "Праверка запаўнення выканана.",
      notSaved:
        "Даныя засталіся толькі ў бягучай форме. Яны не захаваны і не будуць адлюстраваны ў спісах.",
      closeNotice: "Закрыць паведамленне",
    },
  },

  en: {
    panelName: "Admin panel",
    panelDescription: "Website content management",

    navigation: {
      dashboard: "Dashboard",
      categories: "Categories",
      products: "Products",
      news: "News",
      translations: "Translations",
      seo: "SEO",
      backToSite: "Back to website",
    },

    common: {
      language: "Interface language",
      required: "Required field",
      close: "Close",
      cancel: "Cancel",
      noRecords: "No records yet",
      noRecordsDescription:
        "Real records will appear here after the backend is connected.",
      frontendMode: "Frontend development mode",
      frontendModeDescription:
        "The server API is not connected. Form data is not saved or published.",
      checkForm: "Validate form",
      add: "Add",
      remove: "Remove row",
      addAttribute: "Add characteristic",
      addPackaging: "Add packaging",
      selectOption: "Select a value",
      notAvailable: "Not available",
    },

    dashboard: {
      title: "Overview",
      description: "Website content management workspace.",
      statusTitle: "Data connection",
      statusDescription:
        "The backend is not connected yet. Sections are prepared for future API integration.",
      categoriesTitle: "Product categories",
      productsTitle: "Products",
      newsTitle: "News",
      translationsTitle: "Translations",
      quickActions: "Management sections",
      quickActionsDescription:
        "Select a section to manage website content.",
    },

    categories: {
      title: "Product categories",
      description: "Create and manage catalogue categories and subcategories.",
      addTitle: "Add category",
      formTitle: "New category",
      name: "Name",
      slug: "URL slug",
      descriptionField: "Description",
      parent: "Parent category",
      rootCategory: "Root category",
      noParentOptions: "No parent categories available yet.",
      noCategoriesTitle: "No categories yet",
      noCategoriesDescription:
        "Categories created by company staff will appear here.",
    },

    products: {
      title: "Product management",
      description: "Create and edit products, specifications, images and packaging.",
      addTitle: "Add product",
      formTitle: "New product card",
      name: "Product name",
      slug: "URL slug",
      category: "Category",
      categoryRequired: "A category must be selected to create a product.",
      noCategories: "Create a category first. No categories are currently available.",
      descriptionField: "Product description",
      images: "Product images",
      imagesHelp: "Multiple images can be selected. Files are not uploaded yet.",
      characteristics: "Product specifications",
      attributeName: "Specification name",
      attributeValue: "Value",
      packagings: "Packaging options",
      packagingName: "Packaging name",
      weight: "Weight",
      volume: "Volume",
      unit: "Unit",
      shelfLife: "Shelf life",
      status: "Status",
      draft: "Draft",
      published: "Published",
      hidden: "Hidden",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    news: {
      title: "News management",
      description: "Create, edit and prepare publications.",
      addTitle: "Add news",
      formTitle: "New publication",
      headline: "Headline",
      slug: "URL slug",
      date: "Publication date",
      category: "News category",
      noCategories: "News categories will be provided by the backend API.",
      summary: "Summary",
      image: "Publication image",
      imageHelp: "The selected file will not be uploaded yet.",
      content: "Article content",
      status: "Publication status",
      draft: "Draft",
      published: "Published",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    translations: {
      title: "Translation management",
      description: "Manage language versions and translation completeness.",
      sourceLanguage: "Source language",
      targetLanguage: "Target language",
      contentType: "Content type",
      categories: "Categories",
      products: "Products",
      news: "News",
      pages: "Pages",
      tableItem: "Content",
      tableRussian: "Russian",
      tableBelarusian: "Belarusian",
      tableEnglish: "English",
      tableChinese: "Chinese",
      tableStatus: "Completeness",
      emptyTitle: "No content to translate yet",
      emptyDescription:
        "Real content and translation status will appear here after the API is connected.",
    },

    seo: {
      title: "SEO settings",
      description: "Configure search metadata for corporate pages.",
      page: "Page",
      pageTitle: "Title",
      pageDescription: "Description",
      h1: "H1",
      canonical: "Canonical URL",
      help:
        "Product and news SEO metadata will be edited in their respective forms.",
    },

    feedback: {
      formChecked: "Form validation completed.",
      notSaved:
        "The data remains only in the current form. It has not been sent, saved or added to any list.",
      closeNotice: "Close notification",
    },
  },

  zh: {
    panelName: "管理面板",
    panelDescription: "网站内容管理",

    navigation: {
      dashboard: "概览",
      categories: "产品类别",
      products: "产品",
      news: "新闻",
      translations: "翻译",
      seo: "SEO",
      backToSite: "返回网站",
    },

    common: {
      language: "界面语言",
      required: "必填项",
      close: "关闭",
      cancel: "取消",
      noRecords: "暂无记录",
      noRecordsDescription: "连接后台后，真实数据将在此显示。",
      frontendMode: "前端开发模式",
      frontendModeDescription: "尚未连接服务器 API。表单数据不会被保存或发布。",
      checkForm: "验证表单",
      add: "添加",
      remove: "删除行",
      addAttribute: "添加参数",
      addPackaging: "添加包装规格",
      selectOption: "选择值",
      notAvailable: "不可用",
    },

    dashboard: {
      title: "概览",
      description: "网站内容管理工作区。",
      statusTitle: "数据连接",
      statusDescription: "后台尚未连接。各模块已为后续 API 集成做好准备。",
      categoriesTitle: "产品类别",
      productsTitle: "产品",
      newsTitle: "新闻",
      translationsTitle: "翻译",
      quickActions: "管理模块",
      quickActionsDescription: "选择需要管理的网站内容模块。",
    },

    categories: {
      title: "产品类别",
      description: "创建和管理产品目录类别及子类别。",
      addTitle: "添加类别",
      formTitle: "新类别",
      name: "名称",
      slug: "URL 标识",
      descriptionField: "描述",
      parent: "父类别",
      rootCategory: "根类别",
      noParentOptions: "暂无父类别。",
      noCategoriesTitle: "暂无类别",
      noCategoriesDescription: "员工创建的类别将在此显示。",
    },

    products: {
      title: "产品管理",
      description: "创建和编辑产品、参数、图片和包装规格。",
      addTitle: "添加产品",
      formTitle: "新产品卡片",
      name: "产品名称",
      slug: "URL 标识",
      category: "类别",
      categoryRequired: "创建产品时必须选择类别。",
      noCategories: "请先创建类别。目前没有可用类别。",
      descriptionField: "产品描述",
      images: "产品图片",
      imagesHelp: "可以选择多张图片。文件暂不会上传到服务器。",
      characteristics: "产品参数",
      attributeName: "参数名称",
      attributeValue: "数值",
      packagings: "包装规格",
      packagingName: "包装名称",
      weight: "重量",
      volume: "容量",
      unit: "计量单位",
      shelfLife: "保质期",
      status: "状态",
      draft: "草稿",
      published: "已发布",
      hidden: "隐藏",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    news: {
      title: "新闻管理",
      description: "创建、编辑和准备新闻发布。",
      addTitle: "添加新闻",
      formTitle: "新文章",
      headline: "标题",
      slug: "URL 标识",
      date: "发布日期",
      category: "新闻类别",
      noCategories: "新闻类别将由后台 API 提供。",
      summary: "摘要",
      image: "文章图片",
      imageHelp: "所选文件暂不会上传到服务器。",
      content: "文章内容",
      status: "发布状态",
      draft: "草稿",
      published: "已发布",
      seoTitle: "SEO Title",
      seoDescription: "SEO Description",
    },

    translations: {
      title: "翻译管理",
      description: "管理语言版本并检查翻译完整性。",
      sourceLanguage: "源语言",
      targetLanguage: "目标语言",
      contentType: "内容类型",
      categories: "类别",
      products: "产品",
      news: "新闻",
      pages: "页面",
      tableItem: "内容",
      tableRussian: "俄语",
      tableBelarusian: "白俄罗斯语",
      tableEnglish: "英语",
      tableChinese: "中文",
      tableStatus: "完整度",
      emptyTitle: "暂无待翻译内容",
      emptyDescription: "连接 API 后，真实内容及翻译状态将在此显示。",
    },

    seo: {
      title: "SEO 设置",
      description: "设置企业页面的搜索元数据。",
      page: "页面",
      pageTitle: "Title",
      pageDescription: "Description",
      h1: "H1",
      canonical: "Canonical URL",
      help:
        "产品和新闻的 SEO 元数据将在各自的编辑表单中管理。",
    },

    feedback: {
      formChecked: "表单验证已完成。",
      notSaved: "数据仅保留在当前表单中，不会发送、保存或添加到列表。",
      closeNotice: "关闭通知",
    },
  },
};
