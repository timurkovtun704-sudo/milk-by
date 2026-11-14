import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminPageHeading from "../../components/admin/AdminPageHeading";
import { useAdminContext } from "../../hooks/useAdminContext";
import { checkSystemApi } from "../../services/systemService";

import "../../styles/admin-system-status.css";

type SystemStatus = "checking" | "online" | "offline";

const statusMessages = {
  ru: {
    checking: "Проверяем доступность Backend API...",
    online: "Backend API успешно отвечает на запросы.",
    offline: "Не удалось получить успешный ответ от Backend API.",
    checkingBadge: "Проверка",
    onlineBadge: "Доступен",
    offlineBadge: "Недоступен",
    retry: "Проверить снова",
    scope: "Проверяется доступность API. Состояние подключения к базе данных отдельно не подтверждается.",
  },
  be: {
    checking: "Правяраем даступнасць Backend API...",
    online: "Backend API паспяхова адказвае на запыты.",
    offline: "Не атрымалася атрымаць паспяховы адказ ад Backend API.",
    checkingBadge: "Праверка",
    onlineBadge: "Даступны",
    offlineBadge: "Недаступны",
    retry: "Праверыць зноў",
    scope: "Правяраецца даступнасць API. Стан падключэння да базы даных асобна не пацвярджаецца.",
  },
  en: {
    checking: "Checking Backend API availability...",
    online: "Backend API is responding successfully.",
    offline: "Backend API did not return a successful response.",
    checkingBadge: "Checking",
    onlineBadge: "Available",
    offlineBadge: "Unavailable",
    retry: "Check again",
    scope: "This checks API availability only. Database connectivity is not verified separately.",
  },
  zh: {
    checking: "正在检查 Backend API...",
    online: "Backend API 响应正常。",
    offline: "Backend API 未能返回成功响应。",
    checkingBadge: "检查中",
    onlineBadge: "可用",
    offlineBadge: "不可用",
    retry: "重新检查",
    scope: "此检查仅确认 API 是否可访问，不单独验证数据库连接状态。",
  },
};

export default function AdminDashboardPage() {
  const { locale, messages } = useAdminContext();

  const currentStatusMessages =
    statusMessages[locale as keyof typeof statusMessages] ??
    statusMessages.ru;

  const [status, setStatus] = useState<SystemStatus>("checking");

  const checkStatus = useCallback(async (signal?: AbortSignal) => {
    setStatus("checking");

    try {
      await checkSystemApi(signal);
      setStatus("online");
    } catch {
      if (signal?.aborted) {
        return;
      }

      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void checkStatus(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkStatus]);

  const statusText = {
    checking: currentStatusMessages.checkingBadge,
    online: currentStatusMessages.onlineBadge,
    offline: currentStatusMessages.offlineBadge,
  }[status];

  const sections = [
    {
      title: messages.navigation.categories,
      description: messages.categories.description,
      path: `/${locale}/admin/categories`,
      symbol: "CT",
    },
    {
      title: messages.navigation.products,
      description: messages.products.description,
      path: `/${locale}/admin/products`,
      symbol: "PR",
    },
    {
      title: messages.navigation.news,
      description: messages.news.description,
      path: `/${locale}/admin/news`,
      symbol: "NW",
    },
    {
      title: messages.navigation.translations,
      description: messages.translations.description,
      path: `/${locale}/admin/translations`,
      symbol: "LN",
    },
    {
      title: messages.navigation.seo,
      description: messages.seo.description,
      path: `/${locale}/admin/seo`,
      symbol: "SE",
    },
  ];

  return (
    <div className="admin-dashboard">
      <AdminPageHeading
        title={messages.dashboard.title}
        description={messages.dashboard.description}
      />

      <section className="admin-status">
        <div
          className={`admin-status__indicator admin-status__indicator--${status}`}
        />

        <div className="admin-system-status__content">
          <h2>{messages.dashboard.statusTitle}</h2>
          <p>{currentStatusMessages[status]}</p>
          <small>{currentStatusMessages.scope}</small>
        </div>

        <span
          className={`admin-status__badge admin-status__badge--${status}`}
        >
          {statusText}
        </span>

        <button
          type="button"
          className="admin-system-status__retry"
          onClick={() => void checkStatus()}
          disabled={status === "checking"}
        >
          {currentStatusMessages.retry}
        </button>
      </section>

      <section className="admin-dashboard__sections">
        <div className="admin-section-heading">
          <div>
            <h2>{messages.dashboard.quickActions}</h2>
            <p>{messages.dashboard.quickActionsDescription}</p>
          </div>
        </div>

        <div className="admin-shortcuts">
          {sections.map((section) => (
            <Link
              to={section.path}
              className="admin-shortcut"
              key={section.path}
            >
              <span className="admin-shortcut__symbol">
                {section.symbol}
              </span>

              <div className="admin-shortcut__content">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
              </div>

              <span
                className="admin-shortcut__arrow"
                aria-hidden="true"
              >
                ↗
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="admin-development-note">
        <strong>{messages.common.frontendMode}</strong>
        <p>{messages.common.frontendModeDescription}</p>
      </div>
    </div>
  );
}