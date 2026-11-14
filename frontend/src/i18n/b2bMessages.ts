import type { Locale } from "./messages";

export interface B2BMessages {
  eyebrow: string;
  title: string;
  description: string;

  nameLabel: string;
  namePlaceholder: string;

  emailLabel: string;
  emailPlaceholder: string;

  subjectLabel: string;
  subjectPlaceholder: string;

  messageLabel: string;
  messagePlaceholder: string;

  submit: string;
  submitting: string;

  successTitle: string;
  successDescription: string;

  errorTitle: string;
  errorDescription: string;

  requiredHint: string;
}

export const b2bMessages: Record<Locale, B2BMessages> = {
  ru: {
    eyebrow: "Сотрудничество",
    title: "Связаться с отделом продаж",
    description:
      "Оставьте свои контактные данные и расскажите, какой формат сотрудничества вас интересует. Наш отдел продаж рассмотрит обращение.",

    nameLabel: "Ваше имя",
    namePlaceholder: "Введите имя",

    emailLabel: "Электронная почта",
    emailPlaceholder: "example@mail.com",

    subjectLabel: "Тема обращения",
    subjectPlaceholder: "Например, оптовые поставки",

    messageLabel: "Сообщение",
    messagePlaceholder:
      "Расскажите о вашей компании, продукции и условиях сотрудничества",

    submit: "Отправить обращение",
    submitting: "Отправка...",

    successTitle: "Обращение отправлено",
    successDescription:
      "Ваше сообщение передано в отдел продаж.",

    errorTitle: "Не удалось отправить обращение",
    errorDescription:
      "Проверьте заполненные данные и попробуйте ещё раз.",

    requiredHint:
      "Все обязательные поля должны быть заполнены.",
  },

  be: {
    eyebrow: "Супрацоўніцтва",
    title: "Звязацца з аддзелам продажаў",
    description:
      "Пакіньце свае кантактныя даныя і раскажыце, які фармат супрацоўніцтва вас цікавіць. Наш аддзел продажаў разгледзіць зварот.",

    nameLabel: "Ваша імя",
    namePlaceholder: "Увядзіце імя",

    emailLabel: "Электронная пошта",
    emailPlaceholder: "example@mail.com",

    subjectLabel: "Тэма звароту",
    subjectPlaceholder: "Напрыклад, аптовыя пастаўкі",

    messageLabel: "Паведамленне",
    messagePlaceholder:
      "Раскажыце пра вашу кампанію, прадукцыю і ўмовы супрацоўніцтва",

    submit: "Адправіць зварот",
    submitting: "Адпраўка...",

    successTitle: "Зварот адпраўлены",
    successDescription:
      "Ваша паведамленне перададзена ў аддзел продажаў.",

    errorTitle: "Не атрымалася адправіць зварот",
    errorDescription:
      "Праверце запоўненыя даныя і паспрабуйце яшчэ раз.",

    requiredHint:
      "Усе абавязковыя палі павінны быць запоўнены.",
  },

  en: {
    eyebrow: "Partnership",
    title: "Contact the sales department",
    description:
      "Leave your contact details and tell us what kind of cooperation you are interested in. Our sales team will review your enquiry.",

    nameLabel: "Your name",
    namePlaceholder: "Enter your name",

    emailLabel: "Email address",
    emailPlaceholder: "example@mail.com",

    subjectLabel: "Subject",
    subjectPlaceholder: "For example, wholesale supply",

    messageLabel: "Message",
    messagePlaceholder:
      "Tell us about your company, products and cooperation requirements",

    submit: "Send enquiry",
    submitting: "Sending...",

    successTitle: "Enquiry sent",
    successDescription:
      "Your message has been sent to the sales department.",

    errorTitle: "Could not send the enquiry",
    errorDescription:
      "Check the information and try again.",

    requiredHint:
      "All required fields must be completed.",
  },

  zh: {
    eyebrow: "商务合作",
    title: "联系销售部门",
    description:
      "请留下您的联系方式，并介绍您感兴趣的合作方式。我们的销售团队将审核您的请求。",

    nameLabel: "您的姓名",
    namePlaceholder: "请输入姓名",

    emailLabel: "电子邮箱",
    emailPlaceholder: "example@mail.com",

    subjectLabel: "咨询主题",
    subjectPlaceholder: "例如：批发供应",

    messageLabel: "留言",
    messagePlaceholder:
      "请介绍您的公司、产品以及合作需求",

    submit: "发送咨询",
    submitting: "正在发送...",

    successTitle: "咨询已发送",
    successDescription:
      "您的消息已发送至销售部门。",

    errorTitle: "无法发送咨询",
    errorDescription:
      "请检查填写的信息，然后重试。",

    requiredHint:
      "请填写所有必填字段。",
  },
};