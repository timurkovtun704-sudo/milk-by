
export const localeCodes = ["ru", "be", "en", "zh"] as const;

export type Locale = (typeof localeCodes)[number];

export type InfoPageKey = "about" | "export" | "partners" | "contacts";

export interface EmptyContentMessages {
  title: string;
  description: string;
}

export interface SiteMessages {
  brand: string;
  companyName: string;

  navigation: {
    home: string;
    products: string;
    news: string;
    about: string;
    export: string;
    partners: string;
    contacts: string;
  };

  common: {
    skipToContent: string;
    primaryNavigation: string;
    language: string;
    openMenu: string;
    closeMenu: string;
    notFoundTitle: string;
    notFoundDescription: string;
    backHome: string;
  };

  home: {
    eyebrow: string;
    title: string;
    description: string;
    catalogAction: string;
    partnersAction: string;
    directionsEyebrow: string;
    directionsTitle: string;
    productsDescription: string;
    newsDescription: string;
    aboutDescription: string;
    visualCaption: string;
    contentEyebrow: string;
  };

  catalog: {
    eyebrow: string;
    title: string;
    description: string;
    empty: EmptyContentMessages;
  };

  news: {
    eyebrow: string;
    title: string;
    description: string;
    empty: EmptyContentMessages;
  };

  info: Record<InfoPageKey, {
    title: string;
    description: string;
    empty: EmptyContentMessages;
  }>;

  footer: {
    description: string;
    navigationTitle: string;
    copyright: string;
  };
}

export function isLocale(value: string | undefined): value is Locale {
  return (
    value !== undefined &&
    localeCodes.includes(value as Locale)
  );
}

export const messages: Record<Locale, SiteMessages> = {
  ru: {
    brand: "Молочный Мир",
    companyName: "ОАО «Молочный Мир»",

    navigation: {
      home: "Главная",
      products: "Продукция",
      news: "Новости",
      about: "О компании",
      export: "Экспорт",
      partners: "Партнёрам",
      contacts: "Контакты",
    },

    common: {
      skipToContent: "Перейти к содержимому",
      primaryNavigation: "Основная навигация",
      language: "Выбрать язык",
      openMenu: "Открыть меню",
      closeMenu: "Закрыть меню",
      notFoundTitle: "Страница не найдена",
      notFoundDescription:
        "Возможно, адрес изменился или страница больше не существует.",
      backHome: "На главную",
    },

    home: {
      eyebrow: "Официальный корпоративный сайт",
      title: "Молочный Мир",
      description:
        "Информация о предприятии, каталог продукции и направления сотрудничества.",
      catalogAction: "Перейти в каталог",
      partnersAction: "Для партнёров",
      directionsEyebrow: "Навигация",
      directionsTitle: "Выберите нужный раздел",
      productsDescription:
        "Каталог с поиском, фильтрацией и подробной информацией о продукции.",
      newsDescription:
        "Новости и информационные материалы предприятия.",
      aboutDescription:
        "Информация о предприятии и его деятельности.",
      visualCaption: "Корпоративная цифровая витрина",
      contentEyebrow: "Основные разделы",
    },

    catalog: {
      eyebrow: "Каталог",
      title: "Продукция",
      description:
        "Каталог продукции с поиском, фильтрацией, сортировкой и подробными характеристиками.",
      empty: {
        title: "Каталог пока пуст",
        description:
          "Опубликованная продукция появится здесь после добавления сотрудниками предприятия.",
      },
    },

    news: {
      eyebrow: "Информационный раздел",
      title: "Новости",
      description:
        "Новости и информационные материалы ОАО «Молочный Мир».",
      empty: {
        title: "Публикаций пока нет",
        description:
          "Опубликованные материалы появятся здесь после добавления сотрудниками предприятия.",
      },
    },

    info: {
      about: {
        title: "О компании",
        description: "Информация о предприятии и его деятельности.",
        empty: {
          title: "Информация пока не опубликована",
          description:
            "Содержимое этого раздела будет добавлено сотрудниками предприятия.",
        },
      },
      export: {
        title: "Экспорт",
        description:
          "Информация для зарубежных партнёров и экспортного сотрудничества.",
        empty: {
          title: "Информация пока не опубликована",
          description:
            "Содержимое этого раздела будет добавлено сотрудниками предприятия.",
        },
      },
      partners: {
        title: "Для партнёров",
        description:
          "Информация для оптовых покупателей и деловых партнёров.",
        empty: {
          title: "Информация пока не опубликована",
          description:
            "Содержимое этого раздела будет добавлено сотрудниками предприятия.",
        },
      },
      contacts: {
        title: "Контакты",
        description: "Контактная информация предприятия.",
        empty: {
          title: "Информация пока не опубликована",
          description:
            "Контактная информация будет добавлена сотрудниками предприятия.",
        },
      },
    },

    footer: {
      description: "Официальный корпоративный сайт предприятия.",
      navigationTitle: "Навигация",
      copyright: "Все права защищены.",
    },
  },

  be: {
    brand: "Малочны Свет",
    companyName: "ААТ «Малочны Свет»",

    navigation: {
      home: "Галоўная",
      products: "Прадукцыя",
      news: "Навіны",
      about: "Пра кампанію",
      export: "Экспарт",
      partners: "Партнёрам",
      contacts: "Кантакты",
    },

    common: {
      skipToContent: "Перайсці да змесціва",
      primaryNavigation: "Асноўная навігацыя",
      language: "Выбраць мову",
      openMenu: "Адкрыць меню",
      closeMenu: "Закрыць меню",
      notFoundTitle: "Старонка не знойдзена",
      notFoundDescription:
        "Магчыма, адрас змяніўся або старонка больш не існуе.",
      backHome: "На галоўную",
    },

    home: {
      eyebrow: "Афіцыйны карпаратыўны сайт",
      title: "Малочны Свет",
      description:
        "Інфармацыя пра прадпрыемства, каталог прадукцыі і напрамкі супрацоўніцтва.",
      catalogAction: "Перайсці ў каталог",
      partnersAction: "Для партнёраў",
      directionsEyebrow: "Навігацыя",
      directionsTitle: "Выберыце патрэбны раздзел",
      productsDescription:
        "Каталог з пошукам, фільтрацыяй і падрабязнай інфармацыяй пра прадукцыю.",
      newsDescription:
        "Навіны і інфармацыйныя матэрыялы прадпрыемства.",
      aboutDescription:
        "Інфармацыя пра прадпрыемства і яго дзейнасць.",
      visualCaption: "Карпаратыўная лічбавая вітрына",
      contentEyebrow: "Асноўныя раздзелы",
    },

    catalog: {
      eyebrow: "Каталог",
      title: "Прадукцыя",
      description:
        "Каталог прадукцыі з пошукам, фільтрацыяй, сартаваннем і падрабязнымі характарыстыкамі.",
      empty: {
        title: "Каталог пакуль пусты",
        description:
          "Апублікаваная прадукцыя з'явіцца тут пасля дадання супрацоўнікамі прадпрыемства.",
      },
    },

    news: {
      eyebrow: "Інфармацыйны раздзел",
      title: "Навіны",
      description:
        "Навіны і інфармацыйныя матэрыялы ААТ «Малочны Свет».",
      empty: {
        title: "Публікацый пакуль няма",
        description:
          "Апублікаваныя матэрыялы з'явяцца тут пасля дадання супрацоўнікамі прадпрыемства.",
      },
    },

    info: {
      about: {
        title: "Пра кампанію",
        description: "Інфармацыя пра прадпрыемства і яго дзейнасць.",
        empty: {
          title: "Інфармацыя пакуль не апублікаваная",
          description:
            "Змесціва гэтага раздзела будзе дададзена супрацоўнікамі прадпрыемства.",
        },
      },
      export: {
        title: "Экспарт",
        description:
          "Інфармацыя для замежных партнёраў і экспартнага супрацоўніцтва.",
        empty: {
          title: "Інфармацыя пакуль не апублікаваная",
          description:
            "Змесціва гэтага раздзела будзе дададзена супрацоўнікамі прадпрыемства.",
        },
      },
      partners: {
        title: "Партнёрам",
        description:
          "Інфармацыя для аптовых пакупнікоў і дзелавых партнёраў.",
        empty: {
          title: "Інфармацыя пакуль не апублікаваная",
          description:
            "Змесціва гэтага раздзела будзе дададзена супрацоўнікамі прадпрыемства.",
        },
      },
      contacts: {
        title: "Кантакты",
        description: "Кантактная інфармацыя прадпрыемства.",
        empty: {
          title: "Інфармацыя пакуль не апублікаваная",
          description:
            "Кантактная інфармацыя будзе дададзена супрацоўнікамі прадпрыемства.",
        },
      },
    },

    footer: {
      description: "Афіцыйны карпаратыўны сайт прадпрыемства.",
      navigationTitle: "Навігацыя",
      copyright: "Усе правы абаронены.",
    },
  },

  en: {
    brand: "Milk World",
    companyName: "JSC Milk World",

    navigation: {
      home: "Home",
      products: "Products",
      news: "News",
      about: "About us",
      export: "Export",
      partners: "Partners",
      contacts: "Contacts",
    },

    common: {
      skipToContent: "Skip to content",
      primaryNavigation: "Primary navigation",
      language: "Select language",
      openMenu: "Open menu",
      closeMenu: "Close menu",
      notFoundTitle: "Page not found",
      notFoundDescription:
        "The address may have changed or the page may no longer exist.",
      backHome: "Back to homepage",
    },

    home: {
      eyebrow: "Official corporate website",
      title: "Milk World",
      description:
        "Company information, a product catalogue and cooperation opportunities.",
      catalogAction: "Explore catalogue",
      partnersAction: "For partners",
      directionsEyebrow: "Navigation",
      directionsTitle: "Choose a section",
      productsDescription:
        "A catalogue with search, filtering and detailed product information.",
      newsDescription:
        "Company news and information materials.",
      aboutDescription:
        "Information about the company and its activities.",
      visualCaption: "Corporate digital showcase",
      contentEyebrow: "Main sections",
    },

    catalog: {
      eyebrow: "Catalogue",
      title: "Products",
      description:
        "Product catalogue with search, filtering, sorting and detailed specifications.",
      empty: {
        title: "The catalogue is empty",
        description:
          "Published products will appear here after being added by company staff.",
      },
    },

    news: {
      eyebrow: "Information",
      title: "News",
      description: "News and information materials from JSC Milk World.",
      empty: {
        title: "No publications yet",
        description:
          "Published materials will appear here after being added by company staff.",
      },
    },

    info: {
      about: {
        title: "About us",
        description: "Information about the company and its activities.",
        empty: {
          title: "No information published yet",
          description:
            "This section will be completed by company staff.",
        },
      },
      export: {
        title: "Export",
        description:
          "Information for international partners and export cooperation.",
        empty: {
          title: "No information published yet",
          description:
            "This section will be completed by company staff.",
        },
      },
      partners: {
        title: "For partners",
        description:
          "Information for wholesale buyers and business partners.",
        empty: {
          title: "No information published yet",
          description:
            "This section will be completed by company staff.",
        },
      },
      contacts: {
        title: "Contacts",
        description: "Company contact information.",
        empty: {
          title: "No information published yet",
          description:
            "Contact information will be added by company staff.",
        },
      },
    },

    footer: {
      description: "Official corporate website.",
      navigationTitle: "Navigation",
      copyright: "All rights reserved.",
    },
  },

  zh: {
    brand: "乳品世界",
    companyName: "乳品世界股份公司",

    navigation: {
      home: "首页",
      products: "产品",
      news: "新闻",
      about: "关于我们",
      export: "出口",
      partners: "合作伙伴",
      contacts: "联系方式",
    },

    common: {
      skipToContent: "跳转到主要内容",
      primaryNavigation: "主导航",
      language: "选择语言",
      openMenu: "打开菜单",
      closeMenu: "关闭菜单",
      notFoundTitle: "未找到页面",
      notFoundDescription: "该地址可能已更改，或页面已不存在。",
      backHome: "返回首页",
    },

    home: {
      eyebrow: "官方网站",
      title: "乳品世界",
      description: "企业信息、产品目录和合作机会。",
      catalogAction: "查看产品目录",
      partnersAction: "合作伙伴",
      directionsEyebrow: "导航",
      directionsTitle: "选择所需栏目",
      productsDescription: "提供搜索、筛选和产品详细信息的目录。",
      newsDescription: "企业新闻和信息资料。",
      aboutDescription: "关于企业及其业务的信息。",
      visualCaption: "企业数字展示平台",
      contentEyebrow: "主要栏目",
    },

    catalog: {
      eyebrow: "目录",
      title: "产品",
      description: "提供搜索、筛选、排序和详细参数的产品目录。",
      empty: {
        title: "产品目录目前为空",
        description: "企业工作人员添加并发布产品后，内容将在此显示。",
      },
    },

    news: {
      eyebrow: "信息栏目",
      title: "新闻",
      description: "乳品世界股份公司的新闻和信息资料。",
      empty: {
        title: "暂无新闻",
        description: "企业工作人员添加并发布内容后，新闻将在此显示。",
      },
    },

    info: {
      about: {
        title: "关于我们",
        description: "关于企业及其业务的信息。",
        empty: {
          title: "暂无已发布信息",
          description: "此栏目将由企业工作人员填写。",
        },
      },
      export: {
        title: "出口",
        description: "面向国际合作伙伴和出口业务的信息。",
        empty: {
          title: "暂无已发布信息",
          description: "此栏目将由企业工作人员填写。",
        },
      },
      partners: {
        title: "合作伙伴",
        description: "面向批发采购商和商业合作伙伴的信息。",
        empty: {
          title: "暂无已发布信息",
          description: "此栏目将由企业工作人员填写。",
        },
      },
      contacts: {
        title: "联系方式",
        description: "企业联系信息。",
        empty: {
          title: "暂无已发布信息",
          description: "联系信息将由企业工作人员添加。",
        },
      },
    },

    footer: {
      description: "企业官方网站。",
      navigationTitle: "导航",
      copyright: "版权所有。",
    },
  },
};
