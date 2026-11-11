# Backend

Java 21 + Spring Boot + Maven + PostgreSQL.

## Запуск базы данных

Из корня репозитория:

```bash
docker compose up -d db
```

## Запуск Backend

```bash
mvn spring-boot:run
```

Проверка доступности:

```text
GET http://localhost:8080/api/health
```

Ожидаемый ответ:

```json
{
  "status": "ok",
  "application": "milk-world-backend"
}
```

## Важно

На начальном этапе схема БД ещё не создана. Перед добавлением JPA-сущностей команда должна согласовать модель данных и подготовить миграции. Не переключайте `ddl-auto` на `create`/`update` для общей среды без согласования.
