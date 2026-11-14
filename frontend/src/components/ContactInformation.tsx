import type { Locale } from "../i18n/messages";

import "../styles/contacts.css";

interface ContactLabels {
  company: string;
  mainOffice: string;
  address: string;
  reception: string;
  workingHours: string;
  sales: string;
  export: string;
  phone: string;
  email: string;
  identifier: string;
  weekdays: string;
}

const labels: Record<Locale, ContactLabels> = {
  ru: {
    company: "ОАО «Молочный Мир»",
    mainOffice: "Головной офис",
    address: "Адрес",
    reception: "Приёмная",
    workingHours: "Время работы",
    sales: "Отдел логистики и продаж",
    export: "Отдел внешнеэкономической деятельности",
    phone: "Телефон",
    email: "Электронная почта",
    identifier: "УНП",
    weekdays: "Понедельник – пятница: 8:00–17:00. Обед: 13:00–14:00.",
  },
  be: {
    company: "ААТ «Малочны Свет»",
    mainOffice: "Галоўны офіс",
    address: "Адрас",
    reception: "Прыёмная",
    workingHours: "Час працы",
    sales: "Аддзел лагістыкі і продажаў",
    export: "Аддзел знешнеэканамічнай дзейнасці",
    phone: "Тэлефон",
    email: "Электронная пошта",
    identifier: "УНП",
    weekdays: "Панядзелак – пятніца: 8:00–17:00. Абед: 13:00–14:00.",
  },
  en: {
    company: "JSC Milk World",
    mainOffice: "Head office",
    address: "Address",
    reception: "Reception",
    workingHours: "Working hours",
    sales: "Sales and logistics department",
    export: "Foreign economic activity department",
    phone: "Phone",
    email: "Email",
    identifier: "Tax ID",
    weekdays: "Monday – Friday: 8:00–17:00. Lunch: 13:00–14:00.",
  },
  zh: {
    company: "莫洛奇尼·米尔股份公司",
    mainOffice: "总部",
    address: "地址",
    reception: "接待处",
    workingHours: "工作时间",
    sales: "物流与销售部门",
    export: "外贸部门",
    phone: "电话",
    email: "电子邮箱",
    identifier: "税务识别号",
    weekdays: "星期一至星期五：8:00–17:00。午休：13:00–14:00。",
  },
};

export default function ContactInformation({
  locale,
}: {
  locale: Locale;
}) {
  const text = labels[locale];

  return (
    <section className="contact-info">
      <article className="contact-info__card contact-info__card--main">
        <h2>{text.mainOffice}</h2>
        <h3>{text.company}</h3>

        <div className="contact-info__item">
          <span>{text.address}</span>
          <p>
            230005, Республика Беларусь, г. Гродно,
            ул. Гаспадарчая, 28
          </p>
        </div>

        <div className="contact-info__item">
          <span>{text.reception}</span>

          <a href="tel:+375152430172">
            +375 (152) 43-01-72
          </a>

          <a href="tel:+375152453925">
            +375 (152) 45-39-25
          </a>

          <a href="tel:+375152453969">
            +375 (152) 45-39-69
          </a>
        </div>

        <div className="contact-info__item">
          <span>{text.email}</span>
          <a href="mailto:info@milk.by">info@milk.by</a>
        </div>

        <div className="contact-info__item">
          <span>{text.workingHours}</span>
          <p>{text.weekdays}</p>
        </div>

        <div className="contact-info__item">
          <span>{text.identifier}</span>
          <p>500040357</p>
        </div>
      </article>

      <article className="contact-info__card">
        <h2>{text.sales}</h2>

        <div className="contact-info__item">
          <span>{text.phone}</span>
          <a href="tel:+375152453942">
            +375 (152) 45-39-42
          </a>
        </div>

        <div className="contact-info__item">
          <span>{text.email}</span>
          <a href="mailto:sales@milk.by">
            sales@milk.by
          </a>
        </div>
      </article>

      <article className="contact-info__card">
        <h2>{text.export}</h2>

        <div className="contact-info__item">
          <span>{text.phone}</span>
          <a href="tel:+375152600752">
            +375 (152) 60-07-52
          </a>

          <a href="tel:+375152453965">
            +375 (152) 45-39-65
          </a>
        </div>

        <div className="contact-info__item">
          <span>{text.email}</span>
          <a href="mailto:ved@milk.by">
            ved@milk.by
          </a>
        </div>
      </article>
    </section>
  );
}