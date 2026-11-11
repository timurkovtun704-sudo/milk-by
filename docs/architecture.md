# Архитектура проекта

Проект разделён на Frontend и Backend.

Frontend отвечает за отображение страниц и пользовательские действия.
Backend предоставляет REST API, выполняет бизнес-логику и обращается к PostgreSQL.
Обмен данными между частями приложения выполняется по HTTP в формате JSON.

## Локальные адреса

- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Health check: http://localhost:8080/api/health
- PostgreSQL: localhost:5432
