
const productCategories = [
  {
    id: "category-wholemilk",
    number: "01",
    title: "Цельномолочная продукция",
    description: "Молоко, кефир, сметана, творог и другие молочные продукты.",
  },
  {
    id: "category-cheese",
    number: "02",
    title: "Сыры",
    description: "Твёрдые, мягкие и плавленые сыры различных видов.",
  },
  {
    id: "category-butter",
    number: "03",
    title: "Масло",
    description: "Сливочное масло для повседневного использования и кулинарии.",
  },
  {
    id: "category-desserts",
    number: "04",
    title: "Десертная группа",
    description: "Молочные десерты и продукция для любителей сладкого.",
  },
  {
    id: "category-icecream",
    number: "05",
    title: "Мороженое",
    description: "Пломбир, сливочное мороженое и другие варианты.",
  },
  {
    id: "category-dry",
    number: "06",
    title: "Сухие продукты",
    description: "Сухие молочные продукты для различных сфер применения.",
  },
  {
    id: "category-water",
    number: "07",
    title: "Вода и напитки",
    description: "Вода и напитки в ассортименте предприятия.",
  },
];

const companyFacts = [
  {
    id: "fact-history",
    value: "1938",
    label: "Начало истории предприятия",
  },
  {
    id: "fact-capacity",
    value: "600 тыс. тонн",
    label: "Переработка сырья в год",
  },
  {
    id: "fact-products",
    value: "200+",
    label: "Видов продукции",
  },
  {
    id: "fact-export",
    value: "73%",
    label: "Доля экспорта в производстве в 2024 году",
  },
];

const latestNews = [
  {
    id: "news-women",
    date: "Ноябрь 2026",
    title: "Женщинам «Молочного Мира» — особое признание!",
    description:
      "Фотовыставка, посвящённая женщинам предприятия, прошла в преддверии профессионального праздника.",
  },
  {
    id: "news-honor",
    date: "Ноябрь 2026",
    title: "Доска почёта предприятия 2026–2027",
    description:
      "Предприятие отметило сотрудников за профессионализм и вклад в развитие компании.",
  },
  {
    id: "news-awards",
    date: "Ноябрь 2026",
    title: "Награды нашли всех своих героев",
    description:
      "О достижениях сотрудников и развитии одного из предприятий молочной отрасли Беларуси.",
  },
];

function App() {
  return (
    <div className="site-root" id="site-root">
      <div className="topline" id="site-topline">
        <div className="container topline__inner" id="topline-inner">
          <span id="topline-company">
            ОАО «Молочный Мир» · Гродно, Беларусь
          </span>

          <div className="topline__contacts" id="topline-contacts">
            <a id="topline-sales" href="tel:+375152453942">
              Продажи: +375 152 45-39-42
            </a>

            <a id="topline-export" href="tel:+375152600752">
              Экспорт: +375 152 60-07-52
            </a>
          </div>
        </div>
      </div>

      <header className="site-header" id="site-header">
        <div className="container site-header__inner" id="header-inner">
          <a
            className="brand"
            id="brand-home"
            href="/"
            aria-label="Молочный Мир — главная страница"
          >
            <span className="brand__mark" id="brand-mark" aria-hidden="true">
              М
            </span>

            <span className="brand__text" id="brand-text">
              <strong id="brand-name">Молочный Мир</strong>
              <small id="brand-caption">ОАО · ГРОДНО</small>
            </span>
          </a>

          <nav
            className="primary-navigation"
            id="primary-navigation"
            aria-label="Основная навигация"
          >
            <a id="nav-catalog" href="#catalog">
              Продукция
            </a>

            <a id="nav-about" href="#about">
              О компании
            </a>

            <a id="nav-news" href="#news">
              Новости
            </a>

            <a id="nav-export" href="#export">
              Экспорт
            </a>

            <a id="nav-partners" href="#partners">
              Партнёрам
            </a>
          </nav>

          <span
            className="language-indicator"
            id="current-language"
            aria-label="Текущий язык: русский"
          >
            RU
          </span>
        </div>
      </header>

      <main className="site-main" id="main-content">
        <section className="home-hero" id="home-hero">
          <div className="container home-hero__inner" id="home-hero-inner">
            <div className="home-hero__content" id="home-hero-content">
              <p className="eyebrow" id="home-hero-kicker">
                ОАО «Молочный Мир» · Республика Беларусь
              </p>

              <h1 id="home-hero-title">
                Молочная продукция высокого качества от производителя
              </h1>

              <p className="home-hero__description" id="home-hero-description">
                Производим цельномолочную продукцию, сыры, сливочное масло,
                мороженое и другие продукты. Знакомьтесь с ассортиментом
                предприятия и возможностями сотрудничества.
              </p>

              <div className="home-hero__actions" id="home-hero-actions">
                <a
                  className="button button--primary"
                  id="button-home-catalog"
                  href="#catalog"
                >
                  Смотреть продукцию
                </a>

                <a
                  className="button button--secondary"
                  id="button-home-company"
                  href="#about"
                >
                  О предприятии
                </a>
              </div>
            </div>

            <div className="home-hero__side" id="home-hero-side">
              <div className="home-hero__side-top" id="home-hero-side-top">
                <span id="hero-side-caption">Молочный Мир</span>
                <span id="hero-side-location">Гродно · Беларусь</span>
              </div>

              <div className="home-hero__side-bottom" id="home-hero-side-bottom">
                <strong id="hero-side-year">С 1938 года</strong>
                <span id="hero-side-description">
                  История производства молочной продукции
                </span>
              </div>
            </div>
          </div>
        </section>

        <section
          className="catalog-section"
          id="catalog"
          aria-labelledby="catalog-title"
        >
          <div className="container" id="catalog-container">
            <div className="section-heading" id="catalog-heading">
              <div>
                <p className="eyebrow" id="catalog-kicker">
                  Ассортимент предприятия
                </p>

                <h2 id="catalog-title">
                  Наша продукция
                </h2>

                <p className="section-heading__description" id="catalog-description">
                  Выберите интересующую категорию и познакомьтесь
                  с ассортиментом «Молочного Мира».
                </p>
              </div>

              <span className="section-heading__note" id="catalog-note">
                Основные категории
              </span>
            </div>

            <div className="category-grid" id="category-grid">
              {productCategories.map((category) => (
                <article
                  className="category-card"
                  id={category.id}
                  key={category.id}
                >
                  <span
                    className="category-card__number"
                    id={`${category.id}-number`}
                  >
                    {category.number}
                  </span>

                  <h3 id={`${category.id}-title`}>
                    {category.title}
                  </h3>

                  <p id={`${category.id}-description`}>
                    {category.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="goroden-section" id="goroden">
          <div className="container goroden-section__inner" id="goroden-inner">
            <div className="goroden-section__image-wrap" id="goroden-image-wrap">
              <img
                id="goroden-image"
                className="goroden-section__image"
                src="https://milk.by/bitrix/templates/molmir/assets/images/na-nachalnuu-stranic.jpg"
                alt="Продукция линейки «ГороденЪ»"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="goroden-section__content" id="goroden-content">
              <p className="eyebrow" id="goroden-kicker">
                Отдельная линейка продукции
              </p>

              <h2 id="goroden-title">
                «ГороденЪ» — с любовью к родному
              </h2>

              <p id="goroden-description">
                Линейка создана из отборного молока сорта экстра.
                Для её производства тщательно отбирается сырьё
                с повышенным содержанием белка.
              </p>

              <p id="goroden-products">
                В ассортимент входят молоко, кефир, сметана, ряженка,
                творог, мороженое и глазированные сырки.
              </p>

              <a
                className="text-link"
                id="goroden-catalog-link"
                href="#catalog"
              >
                Посмотреть категории продукции
                <span aria-hidden="true"> →</span>
              </a>
            </div>
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="container" id="about-container">
            <div className="section-heading" id="about-heading">
              <p className="eyebrow" id="about-kicker">
                О предприятии
              </p>

              <h2 id="about-title">
                Традиции производства и развитие
              </h2>

              <p className="section-heading__description" id="about-description">
                ОАО «Молочный Мир» — предприятие молочной промышленности
                Республики Беларусь с историей, берущей начало в Гродно.
              </p>
            </div>

            <div className="facts-grid" id="company-facts">
              {companyFacts.map((fact) => (
                <article
                  className="fact-card"
                  id={fact.id}
                  key={fact.id}
                >
                  <strong
                    className="fact-card__value"
                    id={`${fact.id}-value`}
                  >
                    {fact.value}
                  </strong>

                  <span
                    className="fact-card__label"
                    id={`${fact.id}-label`}
                  >
                    {fact.label}
                  </span>
                </article>
              ))}
            </div>

            <p className="about-section__note" id="about-note">
              Показатели предприятия приведены по опубликованной
              корпоративной информации. Доля экспорта относится к 2024 году.
            </p>
          </div>
        </section>

        <section className="partners-section" id="partners">
          <div className="container" id="partners-container">
            <div className="section-heading" id="partners-heading">
              <p className="eyebrow" id="partners-kicker">
                Сотрудничество
              </p>

              <h2 id="partners-title">
                Работаем с партнёрами
              </h2>

              <p className="section-heading__description" id="partners-description">
                Открыты к сотрудничеству с оптовыми компаниями,
                торговыми сетями и зарубежными партнёрами.
              </p>
            </div>

            <div className="partner-grid" id="partner-grid">
              <article className="partner-card" id="partners-belarus">
                <span className="partner-card__label" id="partners-belarus-label">
                  Беларусь
                </span>

                <h3 id="partners-belarus-title">
                  Отдел продаж
                </h3>

                <p id="partners-belarus-description">
                  По вопросам поставок и сотрудничества на территории
                  Республики Беларусь.
                </p>

                <a
                  className="partner-card__contact"
                  id="partners-belarus-phone"
                  href="tel:+375152453942"
                >
                  +375 152 45-39-42
                </a>

                <a
                  className="partner-card__email"
                  id="partners-belarus-email"
                  href="mailto:sales@milk.by"
                >
                  sales@milk.by
                </a>
              </article>

              <article className="partner-card" id="export">
                <span className="partner-card__label" id="export-label">
                  Международное сотрудничество
                </span>

                <h3 id="export-title">
                  Отдел экспорта
                </h3>

                <p id="export-description">
                  По вопросам экспортных поставок и сотрудничества
                  с зарубежными компаниями.
                </p>

                <a
                  className="partner-card__contact"
                  id="export-phone"
                  href="tel:+375152600752"
                >
                  +375 152 60-07-52
                </a>

                <a
                  className="partner-card__email"
                  id="export-email"
                  href="mailto:ved@milk.by"
                >
                  ved@milk.by
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="news-section" id="news">
          <div className="container" id="news-container">
            <div className="section-heading" id="news-heading">
              <p className="eyebrow" id="news-kicker">
                Пресс-центр
              </p>

              <h2 id="news-title">
                Новости предприятия
              </h2>

              <p className="section-heading__description" id="news-description">
                События, достижения и жизнь коллектива «Молочного Мира».
              </p>
            </div>

            <div className="news-grid" id="news-grid">
              {latestNews.map((newsItem) => (
                <article className="news-card" id={newsItem.id} key={newsItem.id}>
                  <time
                    className="news-card__date"
                    id={`${newsItem.id}-date`}
                  >
                    {newsItem.date}
                  </time>

                  <h3 id={`${newsItem.id}-title`}>
                    {newsItem.title}
                  </h3>

                  <p id={`${newsItem.id}-description`}>
                    {newsItem.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="site-footer">
        <div className="container footer-main" id="footer-main">
          <div className="footer-brand" id="footer-brand">
            <a className="footer-brand__name" id="brand-footer" href="/">
              Молочный Мир
            </a>

            <p id="footer-brand-description">
              ОАО «Молочный Мир»
              <br />
              Республика Беларусь, г. Гродно
            </p>
          </div>

          <div className="footer-navigation" id="footer-navigation">
            <h2 id="footer-navigation-title">
              Разделы сайта
            </h2>

            <a id="footer-link-catalog" href="#catalog">
              Продукция
            </a>

            <a id="footer-link-about" href="#about">
              О компании
            </a>

            <a id="footer-link-news" href="#news">
              Новости
            </a>

            <a id="footer-link-partners" href="#partners">
              Партнёрам
            </a>

            <a id="footer-link-export" href="#export">
              Экспорт
            </a>
          </div>

          <div className="footer-contacts" id="contacts">
            <h2 id="contacts-title">
              Контактная информация
            </h2>

            <p id="contacts-address">
              230005, Республика Беларусь,
              <br />
              г. Гродно, ул. Гаспадарчая, 28
            </p>

            <a id="contacts-email" href="mailto:info@milk.by">
              info@milk.by
            </a>

            <a id="contacts-phone" href="tel:+375152430172">
              +375 152 43-01-72
            </a>
          </div>
        </div>

        <div className="footer-bottom" id="footer-bottom">
          <div className="container footer-bottom__inner" id="footer-bottom-inner">
            <span id="footer-copyright">
              © ОАО «Молочный Мир»
            </span>

            <span id="footer-note">
              Официальный сайт предприятия
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
