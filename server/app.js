import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createTransport } from 'nodemailer';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const publicDir = path.join(rootDir, 'public');

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'https://lkds-room.duckdns.org';
const SUGGESTION_EMAIL = 'ymerchii@yandex.ru';

const ADMIN_PINS = new Set(
  (process.env.ADMIN_PINS || '').split(',').map((s) => s.trim()).filter(Boolean)
);

const FILES = {
  rooms: path.join(dataDir, 'rooms.json'),
  links: path.join(dataDir, 'links.json'),
  bookings: path.join(dataDir, 'bookings.json'),
  users: path.join(dataDir, 'users.json'),
  tickets: path.join(dataDir, 'tickets.json'),
  suggestions: path.join(dataDir, 'suggestions.json')
};

/* ── Telegram notifications ── */

const TG_TOKEN = process.env.TG_BOT_TOKEN || '';
const TG_ADMIN_IDS = (process.env.TG_ADMIN_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);

async function tgSend(chatId, text) {
  if (!TG_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (err) {
    console.error('TG send failed:', err.message);
  }
}

function tgNotifyAdmins(text) {
  for (const id of TG_ADMIN_IDS) {
    tgSend(id, text);
  }
}

/* ── Email ── */

let mailer = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  mailer = createTransport({
    host: process.env.SMTP_HOST || 'smtp.yandex.ru',
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendEmail(to, subject, text) {
  if (!mailer) return;
  try {
    await mailer.sendMail({ from: process.env.SMTP_USER, to, subject, text });
  } catch (err) {
    console.error('Email send failed:', err.message);
  }
}

/* ── CRM config ── */

const CRM_MODULES = [
  'Модуль экономической эффективности и аналитики',
  'Модуль развития цепей поставок и складской логистики',
  'Модуль развития бизнеса 1',
  'Модуль развития бизнеса 2',
  'Модуль технологии и эффективности'
];

const ERROR_CATEGORIES = [
  'Воронка продаж',
  'Проблема с карточкой клиента',
  'Проблема с карточкой интереса',
  'Другое'
];

/* ── Helpers ── */

app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf-8'));
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  await fs.writeFile(filePath, JSON.stringify(value, null, 2) + '\n', 'utf-8');
}

function isValidDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }

function toHour(v) {
  const n = Number(v);
  return Number.isInteger(n) ? n : NaN;
}

function hasOverlap(a, b) {
  return a.startHour < b.endHour && b.startHour < a.endHour;
}

function generatePin(existing) {
  let pin;
  do { pin = String(Math.floor(1000 + Math.random() * 9000)); }
  while (existing.has(pin));
  return pin;
}

function isAdmin(pin) { return ADMIN_PINS.has(pin); }

/* ── Auth ── */

app.post('/api/auth/register', async (req, res) => {
  const fullName = String(req.body.fullName || '').trim();
  const contact = String(req.body.contact || '').trim();
  const pin = String(req.body.pin || '').trim();

  if (!fullName || fullName.length < 3)
    return res.status(400).json({ message: 'Укажите ФИО (минимум 3 символа).' });
  if (!contact || contact.length < 3)
    return res.status(400).json({ message: 'Укажите контакт для связи.' });
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const users = await readJson(FILES.users, {});
  if (users[pin])
    return res.status(409).json({ message: 'Этот пин-код уже занят. Придумайте другой.' });

  users[pin] = { id: randomUUID(), fullName, contact, createdAt: new Date().toISOString() };
  await writeJson(FILES.users, users);
  return res.status(201).json({ pin, fullName, contact });
});

app.post('/api/auth/login', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

  return res.json({ pin, fullName: user.fullName, contact: user.contact, admin: isAdmin(pin) });
});

/* ── Settings ── */

app.get('/api/settings', (_req, res) => {
  res.json({ publicBaseUrl, startHour: 8, endHour: 21, appName: 'ЛКДС — Портал сотрудника' });
});

app.get('/api/crm-config', (_req, res) => {
  res.json({ modules: CRM_MODULES, errorCategories: ERROR_CATEGORIES });
});

/* ── Rooms & Links ── */

app.get('/api/rooms', async (_req, res) => {
  res.json(await readJson(FILES.rooms, []));
});

app.get('/api/links', async (_req, res) => {
  res.json(await readJson(FILES.links, []));
});

/* ── Bookings ── */

app.get('/api/bookings', async (req, res) => {
  const roomId = String(req.query.roomId || '').trim();
  const date = String(req.query.date || '').trim();

  if (!roomId || !isValidDate(date))
    return res.status(400).json({ message: 'Передайте roomId и date (YYYY-MM-DD).' });

  const bookings = await readJson(FILES.bookings, []);
  return res.json(
    bookings.filter((b) => b.roomId === roomId && b.date === date)
      .sort((a, b) => a.startHour - b.startHour)
  );
});

app.post('/api/bookings', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const roomId = String(req.body.roomId || '').trim();
  const date = String(req.body.date || '').trim();
  const startHour = toHour(req.body.startHour);
  const endHour = toHour(req.body.endHour);
  const topic = String(req.body.topic || '').trim();

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });

  if (!roomId) return res.status(400).json({ message: 'Выберите переговорку.' });
  if (!isValidDate(date)) return res.status(400).json({ message: 'Дата в формате YYYY-MM-DD.' });
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour))
    return res.status(400).json({ message: 'Часы должны быть целыми.' });
  if (startHour < 8 || endHour > 21 || startHour >= endHour)
    return res.status(400).json({ message: 'Интервал в пределах 08:00–21:00.' });
  if (!topic) return res.status(400).json({ message: 'Укажите цель встречи.' });

  const rooms = await readJson(FILES.rooms, []);
  if (!rooms.some((r) => r.id === roomId))
    return res.status(404).json({ message: 'Переговорка не найдена.' });

  const bookings = await readJson(FILES.bookings, []);
  const candidate = {
    id: randomUUID(), roomId, date, startHour, endHour,
    fullName: user.fullName, contact: user.contact, topic,
    createdAt: new Date().toISOString()
  };

  const overlap = bookings.find(
    (b) => b.roomId === candidate.roomId && b.date === candidate.date && hasOverlap(b, candidate)
  );
  if (overlap)
    return res.status(409).json({ message: 'Выбранный интервал пересекается с другой записью.' });

  bookings.push(candidate);
  await writeJson(FILES.bookings, bookings);

  /* TG notification */
  const room = rooms.find((r) => r.id === roomId);
  tgNotifyAdmins(
    `📅 <b>Новая запись</b>\n` +
    `Комната: ${room ? room.name : roomId}\n` +
    `Дата: ${date}\n` +
    `Время: ${String(startHour).padStart(2,'0')}:00–${String(endHour).padStart(2,'0')}:00\n` +
    `Тема: ${topic}\n` +
    `Кто: ${user.fullName} (${user.contact})`
  );

  return res.status(201).json(candidate);
});

/* ── CRM Tickets ── */

app.post('/api/tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const type = String(req.body.type || '').trim();
  const module = String(req.body.module || '').trim();
  const category = String(req.body.category || '').trim();
  const description = String(req.body.description || '').trim();

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });

  if (!['error', 'suggestion'].includes(type))
    return res.status(400).json({ message: 'Тип заявки: error или suggestion.' });
  if (!module || !CRM_MODULES.includes(module))
    return res.status(400).json({ message: 'Выберите модуль из списка.' });
  if (type === 'error' && (!category || !ERROR_CATEGORIES.includes(category)))
    return res.status(400).json({ message: 'Выберите категорию ошибки.' });
  if (!description || description.length < 10)
    return res.status(400).json({ message: 'Опишите подробнее (минимум 10 символов).' });

  const tickets = await readJson(FILES.tickets, []);
  const ticket = {
    id: randomUUID(), type,
    fullName: user.fullName, contact: user.contact,
    module, category: type === 'error' ? category : '—',
    description, status: 'new',
    createdAt: new Date().toISOString()
  };
  tickets.push(ticket);
  await writeJson(FILES.tickets, tickets);

  /* TG notification */
  const label = type === 'error' ? '🐛 Ошибка' : '💡 Предложение';
  tgNotifyAdmins(
    `${label} <b>1С CRM</b>\n` +
    `Модуль: ${module}\n` +
    (type === 'error' ? `Категория: ${category}\n` : '') +
    `Описание: ${description}\n` +
    `От: ${user.fullName} (${user.contact})`
  );

  const labelRu = type === 'error' ? 'Ошибка' : 'Предложение';
  return res.status(201).json({ message: `${labelRu} принята. Спасибо!`, id: ticket.id });
});

/* ── Suggestions ── */

app.post('/api/suggestions', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const text = String(req.body.text || '').trim();

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });
  if (!text || text.length < 5)
    return res.status(400).json({ message: 'Опишите предложение (минимум 5 символов).' });

  const suggestions = await readJson(FILES.suggestions, []);
  const item = {
    id: randomUUID(), fullName: user.fullName, contact: user.contact,
    text, createdAt: new Date().toISOString()
  };
  suggestions.push(item);
  await writeJson(FILES.suggestions, suggestions);

  const emailBody = `Предложение по улучшению портала ЛКДС\n\nОт: ${user.fullName}\nКонтакт: ${user.contact}\n\n${text}`;
  sendEmail(SUGGESTION_EMAIL, `[ЛКДС] Предложение от ${user.fullName}`, emailBody);

  tgNotifyAdmins(
    `💡 <b>Идея по порталу</b>\n${text}\n\nОт: ${user.fullName} (${user.contact})`
  );

  return res.status(201).json({ message: 'Спасибо за предложение!' });
});

/* ── Admin API ── */

app.get('/api/admin/bookings', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!isAdmin(pin)) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.bookings, []));
});

app.get('/api/admin/tickets', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!isAdmin(pin)) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.tickets, []));
});

app.get('/api/admin/suggestions', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!isAdmin(pin)) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.suggestions, []));
});

app.get('/api/admin/users', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!isAdmin(pin)) return res.status(403).json({ message: 'Нет доступа.' });
  const users = await readJson(FILES.users, {});
  const list = Object.entries(users).map(([p, u]) => ({
    pin: p, fullName: u.fullName, contact: u.contact, createdAt: u.createdAt
  }));
  return res.json(list);
});

/* ── SPA fallback ── */

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`LKDS portal started on http://localhost:${port}`);
});
