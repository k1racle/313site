# Studio 313

Сайт студии подкастов / видеосъёмки Studio 313.

## Локальный запуск

```bash
node server.js
```

Сайт откроется на `http://localhost:3000`.

## Запуск через Docker / Portainer

### Переменные окружения

Скопируй `.env.example` в `.env` и задай нужные значения:

```bash
cp .env.example .env
```

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `PORT` | Порт на хосте, который будет проброшен в контейнер | `2187` |
| `ADMIN_PASSWORD` | Пароль для входа в админку | `313` |

### Локально через Docker Compose

```bash
docker compose up --build -d
```

Сайт будет доступен на `http://localhost:2187`.

### Деплой через Portainer

1. Залей репозиторий на GitHub / GitLab / Gitea.
2. В Portainer перейди в **Stacks** → **Add stack**.
3. Выбери **Git repository**.
4. Укажи URL репозитория и ветку.
5. В разделе **Environment variables** добавь:
   - `PORT=2187`
   - `ADMIN_PASSWORD=надежный_пароль`
6. Нажми **Deploy the stack**.
7. Настрой reverse proxy (nginx / traefik / Caddy) на порт `2187` хоста.

Данные (`content.json`, `bookings.json`, загруженные файлы) хранятся в named volume `studio313_data`, поэтому сохраняются при пересоздании контейнера.
