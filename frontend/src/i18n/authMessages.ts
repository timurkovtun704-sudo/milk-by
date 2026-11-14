
import type { Locale } from "./messages";

export interface AuthMessages {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  submit: string;
  submitting: string;
  accessDenied: string;
  logout: string;
  backToSite: string;
}

export const authMessages: Record<Locale, AuthMessages> = {
  ru: {
    title: "Вход в административную панель",
    description: "Авторизуйтесь для управления сайтом.",
    emailLabel: "Электронная почта",
    emailPlaceholder: "Введите email",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Введите пароль",
    submit: "Войти",
    submitting: "Выполняется вход...",
    accessDenied: "У вашей учётной записи нет доступа к административной панели.",
    logout: "Выйти",
    backToSite: "Вернуться на сайт",
  },

  be: {
    title: "Уваход у панэль адміністратара",
    description: "Аўтарызуйцеся для кіравання сайтам.",
    emailLabel: "Электронная пошта",
    emailPlaceholder: "Увядзіце email",
    passwordLabel: "Пароль",
    passwordPlaceholder: "Увядзіце пароль",
    submit: "Увайсці",
    submitting: "Выконваецца ўваход...",
    accessDenied: "Ваш уліковы запіс не мае доступу да панэлі адміністратара.",
    logout: "Выйсці",
    backToSite: "Вярнуцца на сайт",
  },

  en: {
    title: "Admin panel sign in",
    description: "Sign in to manage the website.",
    emailLabel: "Email address",
    emailPlaceholder: "Enter your email",
    passwordLabel: "Password",
    passwordPlaceholder: "Enter your password",
    submit: "Sign in",
    submitting: "Signing in...",
    accessDenied: "Your account does not have access to the admin panel.",
    logout: "Sign out",
    backToSite: "Back to website",
  },

  zh: {
    title: "管理员登录",
    description: "登录以管理网站。",
    emailLabel: "电子邮箱",
    emailPlaceholder: "请输入电子邮箱",
    passwordLabel: "密码",
    passwordPlaceholder: "请输入密码",
    submit: "登录",
    submitting: "正在登录...",
    accessDenied: "您的账户没有管理后台访问权限。",
    logout: "退出登录",
    backToSite: "返回网站",
  },
};
