# Портал сотрудника ЛКДС — Описание проекта

## Назначение
Внутренний веб-портал для сотрудников компании ЛКДС:
- Просмотр и запись в переговорные комнаты.
- Подача заявок по проблемам и предложениям 1С CRM.
- Предложения по улучшению портала.
- Быстрый доступ к корпоративным ссылкам.

## Стек
- **Backend:** Node.js + Express, JSON-файлы для хранения данных.
- **Frontend:** HTML5 + Vanilla JS + CSS3 (без фреймворков).
- **Уведомления:** Telegram Bot API (админам), nodemailer (опционально).
- **Деплой:** systemd + nginx + Let's Encrypt SSL.

## Авторизация
- Сотрудник регистрируется один раз: ФИО + контакт + свой пин-код (4 цифры).
- Вход по пин-коду, профиль хранится на сервере.
- Пин дополнительно кешируется в localStorage для удобства.
- Админ-доступ определяется через `ADMIN_PINS` в `.env`.

## Структура
```
server/app.js       — Express-сервер (API)
public/index.html   — HTML-шаблон (SPA)
public/app.js       — Клиентская логика
public/styles.css   — Стили (палитра dxlc.ru)
data/rooms.json     — Конфигурация переговорок
data/links.json     — Полезные ссылки (с иконками)
data/bookings.json  — Записи в переговорки
data/users.json     — Профили сотрудников
data/tickets.json   — CRM-заявки (ошибки/предложения)
data/suggestions.json — Идеи по улучшению портала
.env                — Конфигурация (порт, домен, TG-бот, SMTP, админы)
```

## API
| Метод | URL | Описание |
|-------|-----|----------|
| POST | /api/auth/register | Регистрация (ФИО, контакт, пин) |
| POST | /api/auth/login | Вход по пин-коду |
| GET | /api/settings | Настройки приложения |
| GET | /api/crm-config | Модули и категории CRM |
| GET | /api/rooms | Список переговорок |
| GET | /api/links | Полезные ссылки |
| GET | /api/bookings?roomId=X&date=Y | Записи на дату |
| POST | /api/bookings | Создать запись |
| POST | /api/tickets | Создать CRM-заявку |
| POST | /api/suggestions | Отправить идею |
| GET | /api/admin/bookings | [Админ] Все записи |
| GET | /api/admin/tickets | [Админ] Все CRM-заявки |
| GET | /api/admin/suggestions | [Админ] Все идеи |
| GET | /api/admin/users | [Админ] Все пользователи |

## Запуск
```bash
npm install
cp .env.example .env  # настроить
npm start
```

## Домен
https://lkds-room.duckdns.org
