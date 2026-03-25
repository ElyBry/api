# Library API (NestJS)

API для библиотеки на NestJS с сырыми SQL-запросами к PostgreSQL.

## Требования

- Node.js 18+
- PostgreSQL

## Установка

```bash
npm install
```

## Конфигурация

Скопируйте `.env.example` в `.env` и задайте переменные:

- `PORT` — порт приложения (по умолчанию 3000)
- `DATABASE_URL` — строка подключения к PostgreSQL (например `postgresql://postgres:123@localhost:5432/library`)

## Миграции

`DATABASE_URL` берётся из `.env`.

**Применить все миграции** (файлы из `migrations/` по порядку имени):

```bash
npm run migrate
```

**Применить одну миграцию:**

```bash
node scripts/migrate.js 001_initial.sql
node scripts/migrate.js 002_books_isbn_required.sql
```

или через npm:

```bash
npm run migrate -- 002_books_isbn_required.sql
```

Требуется: запущенный PostgreSQL и существующая база (например, `createdb testapi`). Клиент `psql` не нужен — миграции выполняются через драйвер `pg`.

## Запуск

```bash
# разработка
npm run start:dev

# продакшен
npm run build && npm run start:prod
```

После запуска в консоли выводятся ссылки для тестирования.

## Как тестировать

| Что | URL | Описание |
|-----|-----|----------|
| **REST + Swagger** | http://localhost:3000/api | Документация и «Try it out» для всех REST-эндпоинтов (POST/GET/PUT/DELETE). |
| **GraphQL** | http://localhost:3000/graphql | GraphiQL / Apollo Sandbox: автодополнение, схема, выполнение запросов и мутаций. |

- **REST** тестируйте через Swagger: откройте `/api`, выберите метод, нажмите «Try it out», введите параметры и «Execute».
- **GraphQL** тестируйте в браузере по адресу `/graphql`: пишите запросы (например `query { cabinets { id number } }`) и мутации (например `mutation { createCabinet(input: { number: "A-1" }) { id number } }`).

Swagger предназначен только для REST; для GraphQL используется встроенная среда на `/graphql`.

## Эндпоинты

### Cabinets

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /cabinets | Создать шкаф (body: `{ "number": "1" }`) |
| GET  | /cabinets | Список шкафов (без удалённых) |

### Books

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /books | Создать книгу (body: `{ "title", "author", "isbn?", "publication_year?" }`) |
| GET  | /books | Список книг (без удалённых) |

### Users

| Метод | Путь | Описание |
|-------|------|----------|
| POST   | /users       | Создать пользователя (body: `{ "full_name", "email", "phone?" }`) |
| GET    | /users       | Список пользователей (без удалённых) |
| GET    | /users/deleted | Список удалённых пользователей |
| DELETE | /users/:user_id | Мягкое удаление пользователя |
