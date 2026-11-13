# Milk World

Цифровая витрина ОАО «Молочный Мир».

## Структура

- `frontend/` — пользовательский интерфейс (React + TypeScript + Vite).
- `backend-node/` — серверное приложение (Node.js + Express + TypeScript).
- `docs/` — документация проекта, API и базы данных.
- `docker-compose.yml` — локальный запуск PostgreSQL.

## Требования

- Node.js 20 или новее и npm.
- JDK 21.
- Maven 3.9+ (либо используйте Maven Wrapper, если он будет добавлен командой).
- Docker Desktop — для запуска PostgreSQL через Docker Compose.

## Запуск Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite обычно открывает приложение по адресу `http://localhost:5173`.

## Запуск Backend-node

```bash
cd backend-node
npm install
npm run dev
```

Backend запускается на `http://localhost:3000`.
Проверка: `http://localhost:3000/api/health`.

## Правила Git

- `main` — стабильная версия.
- `develop\dev` — общая ветка разработки.
- Новые задачи выполняются в отдельных ветках `feature/...`.
- Изменения попадают в `develop` через Pull Request.
- В `main` изменения попадают после проверки и готовности релиза.
- Не коммитить пароли, токены и реальные `.env`-файлы.

## Перед началом разработки

1. Согласовать API и формат ответов между Frontend и Backend.
2. Согласовать модель данных и миграции БД.
3. Сверить интерфейс с макетами Figma.
4. Обновлять README соответствующей части при изменении запуска или конфигурации.
