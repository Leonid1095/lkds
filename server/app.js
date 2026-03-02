import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createTransport } from 'nodemailer';
import ExcelJS from 'exceljs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const publicDir = path.join(rootDir, 'public');
const avatarsDir = path.join(dataDir, 'avatars');

const app = express();
app.set('trust proxy', 1);
const port = Number(process.env.PORT) || 3000;
const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'https://lkds-room.duckdns.org';
const IT_API_URL = process.env.IT_API_URL || '';
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
  itTickets: path.join(dataDir, 'it-tickets.json'),
  suggestions: path.join(dataDir, 'suggestions.json'),
  pinRequests: path.join(dataDir, 'pin-requests.json'),
  tz: path.join(dataDir, 'tz.json'),
  tzHistory: path.join(dataDir, 'tz-history.json'),
  aiTasks: path.join(dataDir, 'ai-tasks.json')
};

/* ── Security middleware ── */

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Слишком много попыток. Подождите минуту.' },
  standardHeaders: true,
  legacyHeaders: false
});

const registerLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Слишком много попыток регистрации. Подождите минуту.' },
  standardHeaders: true,
  legacyHeaders: false
});

/* ── Telegram notifications ── */

const TG_TOKEN = process.env.TG_BOT_TOKEN || '';
const TG_ADMIN_IDS = (process.env.TG_ADMIN_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
const TG_IT_ADMIN_IDS = (process.env.TG_IT_ADMIN_IDS || '')
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
  for (const id of TG_ADMIN_IDS) tgSend(id, text);
}

function tgNotifyItAdmins(text) {
  for (const id of TG_IT_ADMIN_IDS) tgSend(id, text);
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

/* ── CRM Bot sync config ── */

const CRM_BOT_ADMIN_IDS = (process.env.CRM_BOT_ADMIN_IDS || process.env.TG_ADMIN_IDS || '')
  .split(',').map((s) => s.trim()).filter(Boolean);
const CRM_BOT_TICKETS_FILE = path.resolve(rootDir, '../crm-support-bot/data/tickets.json');
const CRM_BOT_EXCEL_FILE = path.resolve(rootDir, '../crm-support-bot/data/crm_support_log.xlsx');

const EXCEL_HEADERS = ['Дата и время', 'Telegram ID', 'ФИО', 'Модуль', 'Тип обращения', 'Категория ошибки', 'Описание'];
const EXCEL_COL_WIDTHS = [20, 14, 25, 22, 20, 30, 60];
const EXCEL_SHEET_NAME = 'Обращения';

async function appendToBotExcel(row) {
  let wb;
  try {
    wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(CRM_BOT_EXCEL_FILE);
  } catch {
    wb = new ExcelJS.Workbook();
  }

  let ws = wb.getWorksheet(EXCEL_SHEET_NAME);
  if (!ws) {
    ws = wb.addWorksheet(EXCEL_SHEET_NAME);
    const headerRow = ws.addRow(EXCEL_HEADERS);
    headerRow.font = { bold: true };
    EXCEL_COL_WIDTHS.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
  }

  ws.addRow(row);
  await wb.xlsx.writeFile(CRM_BOT_EXCEL_FILE);
}

async function tgSendWithButton(botToken, chatId, text, callbackData) {
  if (!botToken) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [[{ text: '🙋 Взять в работу', callback_data: callbackData }]]
        }
      })
    });
    const data = await res.json();
    return data.ok ? data.result.message_id : null;
  } catch (err) {
    console.error('TG sendWithButton failed:', err.message);
    return null;
  }
}

async function createBotTicket(type, fio, module, category, description) {
  const store = await readJson(CRM_BOT_TICKETS_FILE, { next_id: 1, items: {} });
  const tid = store.next_id;
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  store.items[String(tid)] = {
    type,
    fio,
    module,
    category,
    description,
    status: 'new',
    taken_by: null,
    admin_messages: {},
    group_message_id: null,
    created_at: createdAt,
    source: 'portal'
  };
  store.next_id = tid + 1;
  await writeJson(CRM_BOT_TICKETS_FILE, store);
  return tid;
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

/* ── IT Tickets config ── */

const IT_CONFIG = {
  categories: [
    {
      id: 'software', emoji: '\uD83E\uDDE9', label: 'ПО/установка',
      subcategories: [
        'Установить/обновить программу',
        'Лицензия/активация',
        'Ошибка/вылетает',
        'Печать/принтер'
      ]
    },
    {
      id: 'hardware', emoji: '\uD83D\uDCBB', label: 'Компьютер/ноутбук',
      subcategories: [
        'Тормозит/зависает',
        'Не включается',
        'Клавиатура/мышь/монитор'
      ]
    },
    {
      id: 'network', emoji: '\uD83C\uDF10', label: 'Интернет/сеть',
      subcategories: [
        'Wi-Fi не работает',
        'Нет интернета',
        'Низкая скорость'
      ]
    },
    {
      id: 'vks', emoji: '\uD83D\uDCF9', label: 'ВКС/Презентация',
      disabled: true, subcategories: []
    },
    {
      id: 'other', emoji: '\uD83D\uDD27', label: 'Другое',
      subcategories: []
    }
  ],
  locations: [
    'Модуль ЖД',
    'Модуль КП',
    'Офис 2 этаж',
    'Диспетчерская',
    'Диспетчеры и операторы КП',
    'Приемосдатчик'
  ]
};

/* ── Multer for avatars ── */

const avatarStorage = multer.diskStorage({
  destination: avatarsDir,
  filename: (_req, _file, cb) => cb(null, `${randomUUID()}.tmp`)
});

const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  }
}).single('avatar');

/* ── CSRF: Origin check ── */

app.use((req, res, next) => {
  if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method)) {
    const origin = req.get('origin');
    if (origin) {
      const allowed = [publicBaseUrl, `http://localhost:${port}`];
      if (!allowed.some((a) => origin.startsWith(a))) {
        return res.status(403).json({ message: 'Запрос заблокирован (origin).' });
      }
    }
  }
  next();
});

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

/* ── File lock (in-memory mutex for read-modify-write) ── */

const _locks = new Map();

async function withLock(key, fn) {
  while (_locks.has(key)) await _locks.get(key);
  let resolve;
  _locks.set(key, new Promise((r) => { resolve = r; }));
  try { return await fn(); }
  finally { _locks.delete(key); resolve(); }
}

function isValidDate(d) { return /^\d{4}-\d{2}-\d{2}$/.test(d); }

function toTime(v) {
  const n = Number(v);
  if (isNaN(n)) return NaN;
  if (n % 0.5 !== 0) return NaN;
  return n;
}

function hasOverlap(a, b) {
  return a.startHour < b.endHour && b.startHour < a.endHour;
}

function clip(str, max) { return str.length > max ? str.slice(0, max) : str; }

/* ── TZ constants ── */

const TZ_SYSTEMS = ['ALIS', 'TOS', 'WMS', '1C_CRM', 'OTHER'];
const TZ_TYPES = ['ТЗ', 'Дефект', 'Заявка'];
const TZ_STATUSES = ['draft', 'review', 'analysis', 'development', 'testing', 'release', 'production', 'cancelled'];
const TZ_PRIORITIES = ['low', 'medium', 'high', 'critical'];

const TZ_STATUS_LABELS = {
  draft: 'Черновик',
  review: 'На рассмотрении',
  analysis: 'Анализ',
  development: 'Разработка',
  testing: 'Тестирование',
  release: 'Релиз',
  production: 'В продакшене',
  cancelled: 'Отменено'
};

const TZ_TRANSITIONS = {
  draft: ['review', 'cancelled'],
  review: ['analysis', 'cancelled'],
  analysis: ['development', 'cancelled'],
  development: ['testing', 'cancelled'],
  testing: ['release', 'development', 'cancelled'],
  release: ['production', 'cancelled'],
  production: [],
  cancelled: ['draft']
};

const TZ_STATUS_ORD = { draft: 0, review: 1, analysis: 2, development: 3, testing: 4, release: 5, production: 6, cancelled: 99 };

function computeTzFlags(tz) {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const flags = {};
  const ord = TZ_STATUS_ORD[tz.status] ?? 0;

  // Дедлайн означает «фаза должна быть ЗАВЕРШЕНА к дате» → ТЗ должно продвинуться дальше
  // date_analysis_deadline → ТЗ должно быть ≥ development (ord ≥ 3)
  // date_dev_deadline      → ТЗ должно быть ≥ testing     (ord ≥ 4)
  // date_release_deadline  → ТЗ должно быть ≥ production   (ord ≥ 6)
  flags.analysis_overdue = !!tz.date_analysis_deadline && today > tz.date_analysis_deadline && ord < 3;
  flags.dev_overdue = !!tz.date_dev_deadline && today > tz.date_dev_deadline && ord < 4;
  flags.release_overdue = !!tz.date_release_deadline && today > tz.date_release_deadline && ord < 6;
  flags.overdue = flags.analysis_overdue || flags.dev_overdue || flags.release_overdue;

  // Скоро дедлайн (в пределах 7 дней) — ближайший непройденный дедлайн
  const soon7 = new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const activeDeadline =
    (ord < 3 && tz.date_analysis_deadline) ||
    (ord < 4 && tz.date_dev_deadline) ||
    (ord < 6 && tz.date_release_deadline) ||
    null;
  flags.deadline_soon = !flags.overdue && !!activeDeadline && activeDeadline <= soon7 && activeDeadline >= today;

  // Нет дат вообще
  flags.no_dates = !tz.date_analysis_deadline && !tz.date_dev_deadline && !tz.date_release_deadline;
  // Нет ответственного
  flags.no_owner = !tz.owner || tz.owner.trim() === '';

  // Неполные дедлайны: ТЗ продвинулось, а дедлайн текущей фазы не задан
  // (при условии что предыдущая фаза имела дедлайн — т.е. дедлайны ведутся)
  // В разработке (ord=3): анализ прошёл, дедлайн анализа был → а дедлайн разработки не задали
  // В тестировании/релизе (ord 4-5): были ранние дедлайны → а дедлайн релиза не задали
  flags.missing_deadline =
    (ord === 3 && !!tz.date_analysis_deadline && !tz.date_dev_deadline) ||
    (ord >= 4 && ord <= 5 && (!!tz.date_analysis_deadline || !!tz.date_dev_deadline) && !tz.date_release_deadline);

  return flags;
}

function generateTzCode(allTz, system) {
  const prefix = `TZ-${system}-`;
  const existing = allTz.filter((t) => t.tz_code && t.tz_code.startsWith(prefix));
  let maxNum = 0;
  for (const t of existing) {
    const num = parseInt(t.tz_code.slice(prefix.length), 10);
    if (!isNaN(num) && num > maxNum) maxNum = num;
  }
  return `${prefix}${String(maxNum + 1).padStart(4, '0')}`;
}

async function recordTzHistory(tzId, field, oldValue, newValue, changedBy) {
  const history = await readJson(FILES.tzHistory, []);
  history.push({
    id: randomUUID(),
    tz_id: tzId,
    field,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
    changed_by: changedBy,
    changed_at: new Date().toISOString()
  });
  await writeJson(FILES.tzHistory, history);
}

async function getUserRole(pin, user) {
  if (ADMIN_PINS.has(pin)) return 'superadmin';
  if (!user) return null;
  if (user.role === 'superadmin' || user.role === 'it_admin') return user.role;
  if (user.isAdmin) return 'superadmin'; // backward compat
  return null;
}

async function isAdmin(pin) {
  const users = await readJson(FILES.users, {});
  const role = await getUserRole(pin, users[pin]);
  return !!role;
}

async function isSuperAdmin(pin) {
  const users = await readJson(FILES.users, {});
  const role = await getUserRole(pin, users[pin]);
  return role === 'superadmin';
}

/* ── Auth ── */

app.post('/api/auth/register', registerLimiter, async (req, res) => {
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const pin = String(req.body.pin || '').trim();

  if (!fullName || fullName.length < 3)
    return res.status(400).json({ message: 'Укажите ФИО (минимум 3 символа).' });
  if (!contact || contact.length < 3)
    return res.status(400).json({ message: 'Укажите контакт для связи.' });
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  return withLock(FILES.users, async () => {
    const users = await readJson(FILES.users, {});
    if (users[pin])
      return res.status(400).json({ message: 'Этот пин-код уже занят. Попробуйте другой.' });

    users[pin] = { id: randomUUID(), fullName, contact, createdAt: new Date().toISOString() };
    await writeJson(FILES.users, users);
    return res.status(201).json({ pin, fullName, contact });
  });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

  const adminRole = await getUserRole(pin, users[pin]);
  return res.json({
    pin, fullName: user.fullName, contact: user.contact,
    position: user.position || '', userId: user.id,
    avatar: user.avatar || '', admin: !!adminRole, adminRole: adminRole || null,
    workLocation: user.workLocation || '', workDesk: user.workDesk || ''
  });
});

/* ── Forgot PIN ── */

app.post('/api/auth/forgot-pin', loginLimiter, async (req, res) => {
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);

  if (!fullName || fullName.length < 3)
    return res.status(400).json({ message: 'Укажите ФИО (минимум 3 символа).' });
  if (!contact || contact.length < 3)
    return res.status(400).json({ message: 'Укажите контакт для связи.' });

  const requests = await readJson(FILES.pinRequests, []);
  requests.push({
    id: randomUUID(), fullName, contact,
    createdAt: new Date().toISOString()
  });
  await writeJson(FILES.pinRequests, requests);

  tgNotifyAdmins(
    `🔑 <b>Забыл пин-код</b>\n\nФИО: ${fullName}\nКонтакт: ${contact}`
  );

  return res.json({ message: 'Запрос отправлен администратору. Ожидайте — с вами свяжутся.' });
});

/* ── Settings ── */

app.get('/api/settings', (_req, res) => {
  res.json({ publicBaseUrl, startHour: 8, endHour: 21, slotStep: 0.5, appName: 'ЛКДС — Портал сотрудника' });
});

app.get('/api/crm-config', (_req, res) => {
  res.json({ modules: CRM_MODULES, errorCategories: ERROR_CATEGORIES });
});

app.get('/api/it-config', (_req, res) => {
  res.json(IT_CONFIG);
});

/* ── Rooms & Links ── */

app.get('/api/rooms', async (_req, res) => {
  res.json(await readJson(FILES.rooms, []));
});

app.get('/api/links', async (_req, res) => {
  res.json(await readJson(FILES.links, []));
});

/* ── Profile ── */

app.get('/api/profile/:pin', async (req, res) => {
  const reqPin = String(req.query.requester || '').trim();
  if (!/^\d{4}$/.test(reqPin))
    return res.status(401).json({ message: 'Нужна авторизация.' });

  const users = await readJson(FILES.users, {});
  if (!users[reqPin]) return res.status(401).json({ message: 'Неверный пин-код.' });

  const targetPin = req.params.pin;
  const user = users[targetPin];
  if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });

  return res.json({
    pin: targetPin, fullName: user.fullName, contact: user.contact,
    position: user.position || '', avatar: user.avatar || '',
    userId: user.id, createdAt: user.createdAt,
    workLocation: user.workLocation || '', workDesk: user.workDesk || ''
  });
});

app.post('/api/profile/update', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const position = clip(String(req.body.position || '').trim(), 100);
  const workLocation = req.body.workLocation !== undefined ? clip(String(req.body.workLocation || '').trim(), 100) : undefined;
  const workDesk = req.body.workDesk !== undefined ? clip(String(req.body.workDesk || '').trim(), 10) : undefined;

  const users = await readJson(FILES.users, {});
  if (!users[pin]) return res.status(401).json({ message: 'Неверный пин-код.' });

  if (contact && contact.length >= 3) users[pin].contact = contact;
  if (position !== undefined) users[pin].position = position;
  if (workLocation !== undefined) users[pin].workLocation = workLocation;
  if (workDesk !== undefined) users[pin].workDesk = workDesk;

  await writeJson(FILES.users, users);
  return res.json({
    message: 'Профиль обновлён.', contact: users[pin].contact,
    position: users[pin].position || '',
    workLocation: users[pin].workLocation || '', workDesk: users[pin].workDesk || ''
  });
});

app.post('/api/profile/avatar', (req, res) => {
  avatarUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'Файл слишком большой (макс. 2 МБ).' });
      return res.status(400).json({ message: 'Ошибка загрузки файла.' });
    }
    if (!req.file) return res.status(400).json({ message: 'Выберите изображение (JPG, PNG, WebP).' });

    const pin = String(req.body.pin || '').trim();
    const users = await readJson(FILES.users, {});
    if (!users[pin]) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(401).json({ message: 'Неверный пин-код.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const safeName = `${users[pin].id}${ext}`;
    const finalPath = path.join(avatarsDir, safeName);

    // Remove old avatar if exists
    if (users[pin].avatar) {
      await fs.unlink(path.join(avatarsDir, users[pin].avatar)).catch(() => {});
    }

    await fs.rename(req.file.path, finalPath);
    users[pin].avatar = safeName;
    await writeJson(FILES.users, users);

    return res.json({ message: 'Фото загружено.', avatar: safeName });
  });
});

app.get('/api/avatars/:filename', async (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(avatarsDir, filename);
  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch {
    res.status(404).json({ message: 'Фото не найдено.' });
  }
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
  const startHour = toTime(req.body.startHour);
  const endHour = toTime(req.body.endHour);
  const topic = clip(String(req.body.topic || '').trim(), 300);

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });

  if (!roomId) return res.status(400).json({ message: 'Выберите переговорку.' });
  if (!isValidDate(date)) return res.status(400).json({ message: 'Дата в формате YYYY-MM-DD.' });
  if (isNaN(startHour) || isNaN(endHour))
    return res.status(400).json({ message: 'Время должно быть кратно 30 минутам.' });
  if (startHour < 8 || endHour > 21 || startHour >= endHour)
    return res.status(400).json({ message: 'Интервал в пределах 08:00–21:00.' });
  if (!topic) return res.status(400).json({ message: 'Укажите цель встречи.' });

  const rooms = await readJson(FILES.rooms, []);
  if (!rooms.some((r) => r.id === roomId))
    return res.status(404).json({ message: 'Переговорка не найдена.' });

  return withLock(FILES.bookings, async () => {
    const bookings = await readJson(FILES.bookings, []);
    const candidate = {
      id: randomUUID(), roomId, date, startHour, endHour,
      pin, fullName: user.fullName, contact: user.contact, topic,
      createdAt: new Date().toISOString()
    };

    const overlap = bookings.find(
      (b) => b.roomId === candidate.roomId && b.date === candidate.date && hasOverlap(b, candidate)
    );
    if (overlap)
      return res.status(409).json({ message: 'Выбранный интервал пересекается с другой записью.' });

    bookings.push(candidate);
    await writeJson(FILES.bookings, bookings);

    return res.status(201).json(candidate);
  });
});

/* ── CRM Tickets ── */

app.post('/api/tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const type = String(req.body.type || '').trim();
  const module = String(req.body.module || '').trim();
  const category = String(req.body.category || '').trim();
  const description = clip(String(req.body.description || '').trim(), 2000);

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

  // Защита от дубликатов: тот же пользователь + тот же текст за 30 секунд
  const now = new Date();
  const dup = tickets.find(t =>
    t.fullName === user.fullName && t.description === description &&
    (now - new Date(t.createdAt)) < 30000
  );
  if (dup) return res.status(409).json({ message: 'Заявка уже отправлена. Подождите перед повторной отправкой.' });

  const ticket = {
    id: randomUUID(), type,
    fullName: user.fullName, contact: user.contact,
    module, category: type === 'error' ? category : '—',
    description, status: 'new',
    createdAt: now.toISOString()
  };
  tickets.push(ticket);
  await writeJson(FILES.tickets, tickets);

  /* ── Sync to crm-support-bot ── */
  const botType = type === 'error' ? 'Ошибка' : 'Предложение';
  const botEmoji = type === 'error' ? '🚨' : '💡';
  const botCategory = type === 'error' ? category : '—';
  try {
    const tid = await createBotTicket(botType, user.fullName, module, botCategory, description);

    // Format matching bot.py _ticket_text()
    const tgLines = [
      `${botEmoji} <b>Новая заявка #${tid}: ${botType}</b>\n`,
      `👤 ${user.fullName}`,
      `📦 ${module}`
    ];
    if (botCategory && botCategory !== '—') tgLines.push(`📂 ${botCategory}`);
    tgLines.push(`💬 ${description}`);
    const tgText = tgLines.join('\n');

    const adminMessages = {};
    for (const adminId of CRM_BOT_ADMIN_IDS) {
      const msgId = await tgSendWithButton(TG_TOKEN, adminId, tgText, `take:${tid}`);
      if (msgId) adminMessages[String(adminId)] = msgId;
    }

    // Save message_ids back to bot ticket
    const store = await readJson(CRM_BOT_TICKETS_FILE, { next_id: 1, items: {} });
    if (store.items[String(tid)]) {
      store.items[String(tid)].admin_messages = adminMessages;
      await writeJson(CRM_BOT_TICKETS_FILE, store);
    }

    // Append to bot Excel log
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    await appendToBotExcel([ts, 'portal', user.fullName, module, botType, botCategory, description]);
  } catch (err) {
    console.error('CRM bot sync failed:', err.message);
  }

  const labelRu = type === 'error' ? 'Ошибка' : 'Предложение';
  return res.status(201).json({ message: `${labelRu} принята. Спасибо!`, id: ticket.id });
});

/* ── IT Tickets ── */

app.post('/api/it-tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const category = String(req.body.category || '').trim();
  const subcategory = String(req.body.subcategory || '').trim();
  const location = String(req.body.location || '').trim();
  const seat = String(req.body.seat || '').trim();
  const description = clip(String(req.body.description || '').trim(), 2000);

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });

  const cat = IT_CONFIG.categories.find((c) => c.id === category);
  if (!cat) return res.status(400).json({ message: 'Выберите категорию.' });
  if (cat.disabled) return res.status(400).json({ message: 'Эта категория пока недоступна.' });
  if (category !== 'other' && cat.subcategories.length && !cat.subcategories.includes(subcategory))
    return res.status(400).json({ message: 'Выберите тип проблемы.' });
  if (!IT_CONFIG.locations.includes(location))
    return res.status(400).json({ message: 'Выберите локацию.' });
  if (location === 'Офис 2 этаж') {
    const seatNum = Number(seat);
    if (!seat || isNaN(seatNum) || seatNum < 1 || seatNum > 260)
      return res.status(400).json({ message: 'Укажите номер места (1–260).' });
  }

  const tickets = await readJson(FILES.itTickets, []);

  // Защита от дубликатов: тот же пользователь + та же категория за 30 секунд
  const now = new Date();
  const dup = tickets.find(t =>
    t.pin === pin && t.category === cat.label && t.description === (description || '—') &&
    (now - new Date(t.createdAt)) < 30000
  );
  if (dup) return res.status(409).json({ message: 'Заявка уже отправлена. Подождите перед повторной отправкой.' });

  const ticket = {
    id: randomUUID(), pin, category: cat.label,
    subcategory: category === 'other' ? (description || '—') : (subcategory || '—'),
    location, seat: location === 'Офис 2 этаж' ? seat : '',
    description: description || '—',
    fullName: user.fullName, contact: user.contact,
    status: 'new', statusUpdatedAt: null, takenBy: null,
    rating: null, ratingComment: null, forwardedToApi: false,
    createdAt: now.toISOString()
  };
  tickets.push(ticket);
  await writeJson(FILES.itTickets, tickets);

  // Fire & forget forward to external IT API
  if (IT_API_URL) {
    fetch(IT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: ticket.id, category: ticket.category, subcategory: ticket.subcategory,
        location: ticket.location, seat: ticket.seat, description: ticket.description,
        fullName: ticket.fullName, contact: ticket.contact, createdAt: ticket.createdAt
      })
    }).then(async (resp) => {
      if (resp.ok) {
        const all = await readJson(FILES.itTickets, []);
        const t = all.find((x) => x.id === ticket.id);
        if (t) { t.forwardedToApi = true; await writeJson(FILES.itTickets, all); }
      }
    }).catch((err) => console.error('IT API forward failed:', err.message));
  }

  tgNotifyItAdmins(
    `🔧 <b>ИТ-заявка</b>\n` +
    `Категория: ${cat.emoji} ${cat.label}\n` +
    (category !== 'other' && subcategory ? `Тип: ${subcategory}\n` : '') +
    `Локация: ${location}${location === 'Офис 2 этаж' && seat ? ` (место ${seat})` : ''}\n` +
    `Описание: ${ticket.description}\n` +
    `От: ${user.fullName} (${user.contact})\n\n` +
    `🔗 <a href="${publicBaseUrl}/it-status/${ticket.id}">Взять / Обновить статус</a>`
  );

  return res.status(201).json({ message: 'ИТ-заявка отправлена. Спасибо!', id: ticket.id });
});

/* ── IT Ticket status & rating ── */

app.get('/api/it-ticket-status/:id', async (req, res) => {
  const id = req.params.id;
  if (!/^[0-9a-f-]{36}$/.test(id))
    return res.status(400).json({ message: 'Неверный ID заявки.' });

  const tickets = await readJson(FILES.itTickets, []);
  const ticket = tickets.find((t) => t.id === id);
  if (!ticket) return res.status(404).json({ message: 'Заявка не найдена.' });

  return res.json({
    id: ticket.id, category: ticket.category, subcategory: ticket.subcategory,
    location: ticket.location, seat: ticket.seat, description: ticket.description,
    fullName: ticket.fullName, contact: ticket.contact,
    status: ticket.status, statusUpdatedAt: ticket.statusUpdatedAt,
    takenBy: ticket.takenBy, rating: ticket.rating, ratingComment: ticket.ratingComment,
    createdAt: ticket.createdAt
  });
});

app.post('/api/it-ticket-status/:id', async (req, res) => {
  const id = req.params.id;
  if (!/^[0-9a-f-]{36}$/.test(id))
    return res.status(400).json({ message: 'Неверный ID заявки.' });

  const action = String(req.body.action || '').trim();
  const takenBy = clip(String(req.body.takenBy || '').trim(), 100);

  return withLock(FILES.itTickets, async () => {
    const tickets = await readJson(FILES.itTickets, []);
    const ticket = tickets.find((t) => t.id === id);
    if (!ticket) return res.status(404).json({ message: 'Заявка не найдена.' });

    if (action === 'take') {
      if (ticket.status !== 'new')
        return res.status(400).json({ message: 'Заявку уже взяли в работу.' });
      ticket.status = 'in_progress';
      ticket.takenBy = takenBy || 'Сисадмин';
      ticket.statusUpdatedAt = new Date().toISOString();
    } else if (action === 'done') {
      if (ticket.status !== 'in_progress')
        return res.status(400).json({ message: 'Заявка не в работе.' });
      ticket.status = 'done';
      ticket.statusUpdatedAt = new Date().toISOString();
    } else {
      return res.status(400).json({ message: 'Действие: take или done.' });
    }

    await writeJson(FILES.itTickets, tickets);
    return res.json({ message: 'Статус обновлён.', status: ticket.status });
  });
});

app.post('/api/my-it-tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const users = await readJson(FILES.users, {});
  if (!users[pin]) return res.status(401).json({ message: 'Неверный пин-код.' });

  const tickets = await readJson(FILES.itTickets, []);
  const my = tickets.filter((t) => t.pin === pin).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return res.json(my.map((t) => ({
    id: t.id, category: t.category, subcategory: t.subcategory,
    location: t.location, description: t.description,
    status: t.status, statusUpdatedAt: t.statusUpdatedAt,
    takenBy: t.takenBy, rating: t.rating, ratingComment: t.ratingComment,
    createdAt: t.createdAt
  })));
});

app.post('/api/it-ticket-rate', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const ticketId = String(req.body.ticketId || '').trim();
  const rating = Number(req.body.rating);
  const ratingComment = clip(String(req.body.ratingComment || '').trim(), 500);

  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });
  if (!ticketId) return res.status(400).json({ message: 'Укажите ID заявки.' });
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    return res.status(400).json({ message: 'Оценка от 1 до 5.' });

  const users = await readJson(FILES.users, {});
  if (!users[pin]) return res.status(401).json({ message: 'Неверный пин-код.' });

  return withLock(FILES.itTickets, async () => {
    const tickets = await readJson(FILES.itTickets, []);
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return res.status(404).json({ message: 'Заявка не найдена.' });
    if (ticket.pin !== pin)
      return res.status(403).json({ message: 'Можно оценить только свою заявку.' });
    if (ticket.status !== 'done')
      return res.status(400).json({ message: 'Оценить можно только выполненную заявку.' });
    if (ticket.rating !== null)
      return res.status(400).json({ message: 'Вы уже оценили эту заявку.' });

    ticket.rating = rating;
    ticket.ratingComment = ratingComment || null;
    await writeJson(FILES.itTickets, tickets);
    return res.json({ message: 'Спасибо за оценку!' });
  });
});

/* ── Suggestions ── */

app.post('/api/suggestions', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const text = clip(String(req.body.text || '').trim(), 2000);

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

  return res.status(201).json({ message: 'Спасибо за предложение!' });
});

/* ── Admin API (POST for security — pins not in URL) ── */

// superadmin-only endpoints
app.post('/api/admin/bookings', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.bookings, []));
});

app.post('/api/admin/tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.tickets, []));
});

// IT tickets — accessible by both superadmin and it_admin
app.post('/api/admin/it-tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.itTickets, []));
});

app.post('/api/admin/suggestions', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.suggestions, []));
});

app.post('/api/admin/pin-requests', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return res.json(await readJson(FILES.pinRequests, []));
});

app.post('/api/admin/pin-request-resolve', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const requestId = String(req.body.requestId || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const requests = await readJson(FILES.pinRequests, []);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return res.status(404).json({ message: 'Запрос не найден.' });

  requests.splice(idx, 1);
  await writeJson(FILES.pinRequests, requests);
  return res.json({ message: 'Запрос закрыт.' });
});

app.post('/api/admin/users', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const users = await readJson(FILES.users, {});
  const list = [];
  for (const [p, u] of Object.entries(users)) {
    const role = await getUserRole(p, u);
    list.push({
      pin: p, fullName: u.fullName, contact: u.contact,
      position: u.position || '', avatar: !!u.avatar,
      isAdmin: !!role, role: role || 'employee', createdAt: u.createdAt
    });
  }
  return res.json(list);
});

app.post('/api/admin/update-user', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetPin = String(req.body.targetPin || '').trim();
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const newPin = String(req.body.newPin || '').trim();

  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetPin) return res.status(400).json({ message: 'Укажите пин пользователя.' });

  const users = await readJson(FILES.users, {});
  if (!users[targetPin]) return res.status(404).json({ message: 'Пользователь не найден.' });

  if (fullName && fullName.length >= 3) users[targetPin].fullName = fullName;
  else if (fullName) return res.status(400).json({ message: 'ФИО минимум 3 символа.' });

  if (contact && contact.length >= 3) users[targetPin].contact = contact;
  else if (contact) return res.status(400).json({ message: 'Контакт минимум 3 символа.' });

  if (newPin && newPin !== targetPin) {
    if (!/^\d{4}$/.test(newPin))
      return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });
    if (users[newPin])
      return res.status(400).json({ message: 'Этот пин-код уже занят.' });
    users[newPin] = users[targetPin];
    delete users[targetPin];
    const bookings = await readJson(FILES.bookings, []);
    let changed = false;
    for (const b of bookings) {
      if (b.pin === targetPin) { b.pin = newPin; changed = true; }
    }
    if (changed) await writeJson(FILES.bookings, bookings);
  }

  await writeJson(FILES.users, users);
  return res.json({ message: 'Данные обновлены.' });
});

app.post('/api/admin/toggle-admin', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetPin = String(req.body.targetPin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetPin) return res.status(400).json({ message: 'Укажите пин пользователя.' });

  const users = await readJson(FILES.users, {});
  if (!users[targetPin]) return res.status(404).json({ message: 'Пользователь не найден.' });

  users[targetPin].isAdmin = !users[targetPin].isAdmin;
  await writeJson(FILES.users, users);
  return res.json({ pin: targetPin, isAdmin: !!users[targetPin].isAdmin });
});

app.post('/api/admin/set-role', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetPin = String(req.body.targetPin || '').trim();
  const role = String(req.body.role || '').trim();

  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetPin) return res.status(400).json({ message: 'Укажите пин пользователя.' });
  if (!['superadmin', 'it_admin', 'employee'].includes(role))
    return res.status(400).json({ message: 'Роль: superadmin, it_admin или employee.' });

  const users = await readJson(FILES.users, {});
  if (!users[targetPin]) return res.status(404).json({ message: 'Пользователь не найден.' });

  if (role === 'employee') {
    delete users[targetPin].role;
    users[targetPin].isAdmin = false;
  } else {
    users[targetPin].role = role;
    users[targetPin].isAdmin = true;
  }

  await writeJson(FILES.users, users);
  return res.json({ pin: targetPin, role });
});

/* ── Booking cancel ── */

app.post('/api/bookings/:id/cancel', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = await isAdmin(pin);

  return withLock(FILES.bookings, async () => {
    const bookings = await readJson(FILES.bookings, []);
    const idx = bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Бронирование не найдено.' });

    if (!admin && bookings[idx].pin !== pin && bookings[idx].fullName !== user.fullName)
      return res.status(403).json({ message: 'Можно отменить только свою бронь.' });

    bookings.splice(idx, 1);
    await writeJson(FILES.bookings, bookings);
    return res.json({ message: 'Бронирование отменено.' });
  });
});

app.patch('/api/bookings/:id', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const cancelHour = toTime(req.body.cancelHour);

  const users = await readJson(FILES.users, {});
  const user = users[pin];
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = await isAdmin(pin);

  return withLock(FILES.bookings, async () => {
    const bookings = await readJson(FILES.bookings, []);
    const idx = bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Бронирование не найдено.' });

    const booking = bookings[idx];

    if (!admin && booking.pin !== pin && booking.fullName !== user.fullName)
      return res.status(403).json({ message: 'Можно отменить только свою бронь.' });

    if (isNaN(cancelHour) || cancelHour < booking.startHour || cancelHour >= booking.endHour)
      return res.status(400).json({ message: 'Указанный слот не входит в это бронирование.' });

    const step = 0.5;

    if (booking.endHour - booking.startHour <= step) {
      bookings.splice(idx, 1);
    } else if (cancelHour === booking.startHour) {
      booking.startHour = booking.startHour + step;
    } else if (cancelHour === booking.endHour - step) {
      booking.endHour = booking.endHour - step;
    } else {
      const secondBooking = {
        id: randomUUID(),
        roomId: booking.roomId,
        date: booking.date,
        startHour: cancelHour + step,
        endHour: booking.endHour,
        pin: booking.pin,
        fullName: booking.fullName,
        contact: booking.contact,
        topic: booking.topic,
        createdAt: booking.createdAt
      };
      booking.endHour = cancelHour;
      bookings.push(secondBooking);
    }

    await writeJson(FILES.bookings, bookings);
    return res.json({ message: 'Слот отменён.' });
  });
});

/* ── TZ (Технические задания) ── */

app.get('/api/tz-config', (_req, res) => {
  res.json({
    systems: TZ_SYSTEMS,
    types: TZ_TYPES,
    statuses: TZ_STATUSES,
    priorities: TZ_PRIORITIES,
    statusLabels: TZ_STATUS_LABELS,
    transitions: TZ_TRANSITIONS
  });
});

app.post('/api/tz', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const title = clip(String(req.body.title || '').trim(), 300);
  const system = String(req.body.system || '').trim();
  const type = String(req.body.type || '').trim();
  const priority = String(req.body.priority || '').trim();
  const description = clip(String(req.body.description || '').trim(), 5000);
  const owner = clip(String(req.body.owner || '').trim(), 100);
  const link_confluence = clip(String(req.body.link_confluence || '').trim(), 500);
  const link_jira = clip(String(req.body.link_jira || '').trim(), 500);
  const date_analysis_deadline = String(req.body.date_analysis_deadline || '').trim();
  const date_dev_deadline = String(req.body.date_dev_deadline || '').trim();
  const date_release_deadline = String(req.body.date_release_deadline || '').trim();
  const reqStatus = String(req.body.status || '').trim();

  if (!title || title.length < 3) return res.status(400).json({ message: 'Название ТЗ минимум 3 символа.' });
  if (!TZ_SYSTEMS.includes(system)) return res.status(400).json({ message: 'Выберите систему.' });
  if (!TZ_TYPES.includes(type)) return res.status(400).json({ message: 'Выберите тип.' });
  if (!TZ_PRIORITIES.includes(priority)) return res.status(400).json({ message: 'Выберите приоритет.' });
  if (date_analysis_deadline && !isValidDate(date_analysis_deadline)) return res.status(400).json({ message: 'Дата анализа: YYYY-MM-DD.' });
  if (date_dev_deadline && !isValidDate(date_dev_deadline)) return res.status(400).json({ message: 'Дата разработки: YYYY-MM-DD.' });
  if (date_release_deadline && !isValidDate(date_release_deadline)) return res.status(400).json({ message: 'Дата релиза: YYYY-MM-DD.' });

  // Валидация статуса при создании: пустой → draft, иначе должен быть допустимым переходом из draft
  let initialStatus = 'draft';
  if (reqStatus && reqStatus !== 'draft') {
    const allowed = TZ_TRANSITIONS.draft || [];
    if (!allowed.includes(reqStatus)) {
      return res.status(400).json({ message: `Переход из «${TZ_STATUS_LABELS.draft}» в «${TZ_STATUS_LABELS[reqStatus] || reqStatus}» не допускается.` });
    }
    initialStatus = reqStatus;
  }

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);

    // Проверка на дубль названия
    const duplicate = allTz.find((t) => t.title.toLowerCase() === title.toLowerCase());
    if (duplicate) return res.status(400).json({ message: `ТЗ с таким названием уже существует: ${duplicate.tz_code}.` });

    const tzCode = generateTzCode(allTz, system);
    const users = await readJson(FILES.users, {});
    const creatorName = users[pin]?.fullName || pin;

    const tz = {
      id: randomUUID(),
      tz_code: tzCode,
      title,
      system,
      type,
      priority,
      status: initialStatus,
      description,
      owner,
      link_confluence,
      link_jira,
      date_analysis_deadline: date_analysis_deadline || null,
      date_dev_deadline: date_dev_deadline || null,
      date_release_deadline: date_release_deadline || null,
      created_by: creatorName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    allTz.push(tz);
    await writeJson(FILES.tz, allTz);

    return res.status(201).json({ message: `ТЗ ${tzCode} создано.`, tz });
  });
});

app.put('/api/tz/:id', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    const users = await readJson(FILES.users, {});
    const changedBy = users[pin]?.fullName || pin;

    const editableFields = [
      'title', 'system', 'type', 'priority', 'status',
      'description', 'owner', 'link_confluence', 'link_jira',
      'date_analysis_deadline', 'date_dev_deadline', 'date_release_deadline'
    ];

    // Status transition check
    if (req.body.status !== undefined && req.body.status !== tz.status) {
      const newStatus = String(req.body.status).trim();
      if (!TZ_STATUSES.includes(newStatus)) return res.status(400).json({ message: 'Неизвестный статус.' });
      const allowed = TZ_TRANSITIONS[tz.status] || [];
      if (!allowed.includes(newStatus)) {
        return res.status(400).json({ message: `Переход из «${TZ_STATUS_LABELS[tz.status]}» в «${TZ_STATUS_LABELS[newStatus]}» не допускается.` });
      }
    }

    // Validation
    if (req.body.title !== undefined) {
      const t = clip(String(req.body.title).trim(), 300);
      if (t.length < 3) return res.status(400).json({ message: 'Название ТЗ минимум 3 символа.' });
      const duplicate = allTz.find((x) => x.id !== id && x.title.toLowerCase() === t.toLowerCase());
      if (duplicate) return res.status(400).json({ message: `ТЗ с таким названием уже существует: ${duplicate.tz_code}.` });
    }
    if (req.body.system !== undefined && !TZ_SYSTEMS.includes(req.body.system))
      return res.status(400).json({ message: 'Выберите систему.' });
    if (req.body.type !== undefined && !TZ_TYPES.includes(req.body.type))
      return res.status(400).json({ message: 'Выберите тип.' });
    if (req.body.priority !== undefined && !TZ_PRIORITIES.includes(req.body.priority))
      return res.status(400).json({ message: 'Выберите приоритет.' });

    for (const field of editableFields) {
      if (req.body[field] === undefined) continue;
      let newVal = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
      if (field === 'title') newVal = clip(newVal, 300);
      if (field === 'description') newVal = clip(newVal, 5000);
      if (field === 'owner') newVal = clip(newVal, 100);
      if (field === 'link_confluence') newVal = clip(newVal, 500);
      if (field === 'link_jira') newVal = clip(newVal, 500);
      if (['date_analysis_deadline', 'date_dev_deadline', 'date_release_deadline'].includes(field)) {
        if (newVal && !isValidDate(newVal)) continue;
        newVal = newVal || null;
      }

      const oldVal = tz[field] ?? null;
      if (String(oldVal ?? '') !== String(newVal ?? '')) {
        await recordTzHistory(tz.id, field, oldVal, newVal, changedBy);
        tz[field] = newVal;
      }
    }

    tz.updated_at = new Date().toISOString();
    await writeJson(FILES.tz, allTz);

    return res.json({ message: 'ТЗ обновлено.', tz });
  });
});

app.post('/api/admin/tz', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);

  // Filters
  const fSystem = String(req.body.system || '').trim();
  const fStatus = String(req.body.status || '').trim();
  const fType = String(req.body.type || '').trim();
  const fPriority = String(req.body.priority || '').trim();
  const fSearch = String(req.body.search || '').trim().toLowerCase();
  const fOverdue = !!req.body.overdue;
  const fNoDates = !!req.body.no_dates;
  const fNoOwner = !!req.body.no_owner;
  const fDeadlineSoon = !!req.body.deadline_soon;
  const fMissingDeadline = !!req.body.missing_deadline;

  let items = allTz.map((tz) => ({ ...tz, flags: computeTzFlags(tz) }));

  if (fSystem) items = items.filter((t) => t.system === fSystem);
  if (fStatus) items = items.filter((t) => t.status === fStatus);
  if (fType) items = items.filter((t) => t.type === fType);
  if (fPriority) items = items.filter((t) => t.priority === fPriority);
  if (fSearch) items = items.filter((t) =>
    (t.title && t.title.toLowerCase().includes(fSearch)) ||
    (t.tz_code && t.tz_code.toLowerCase().includes(fSearch)) ||
    (t.owner && t.owner.toLowerCase().includes(fSearch)) ||
    (t.description && t.description.toLowerCase().includes(fSearch))
  );
  if (fOverdue) items = items.filter((t) => t.flags.overdue);
  if (fNoDates) items = items.filter((t) => t.flags.no_dates);
  if (fNoOwner) items = items.filter((t) => t.flags.no_owner);
  if (fDeadlineSoon) items = items.filter((t) => t.flags.deadline_soon);
  if (fMissingDeadline) items = items.filter((t) => t.flags.missing_deadline);

  items.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return res.json(items);
});

app.get('/api/tz/:id', async (req, res) => {
  const reqPin = String(req.query.pin || '').trim();
  if (!(await isSuperAdmin(reqPin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  const allTz = await readJson(FILES.tz, []);
  const tz = allTz.find((t) => t.id === id);
  if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

  const history = (await readJson(FILES.tzHistory, []))
    .filter((h) => h.tz_id === id)
    .sort((a, b) => b.changed_at.localeCompare(a.changed_at));

  return res.json({ ...tz, flags: computeTzFlags(tz), history });
});

app.post('/api/admin/tz-stats', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const withFlags = allTz.map((tz) => ({ ...tz, flags: computeTzFlags(tz) }));

  const stats = {
    total: allTz.length,
    overdue: withFlags.filter((t) => t.flags.overdue).length,
    deadline_soon: withFlags.filter((t) => t.flags.deadline_soon).length,
    no_dates: withFlags.filter((t) => t.flags.no_dates).length,
    no_owner: withFlags.filter((t) => t.flags.no_owner).length,
    missing_deadline: withFlags.filter((t) => t.flags.missing_deadline).length,
    by_status: {},
    by_system: {}
  };

  for (const s of TZ_STATUSES) stats.by_status[s] = 0;
  for (const s of TZ_SYSTEMS) stats.by_system[s] = 0;
  for (const tz of allTz) {
    if (stats.by_status[tz.status] !== undefined) stats.by_status[tz.status]++;
    if (stats.by_system[tz.system] !== undefined) stats.by_system[tz.system]++;
  }

  return res.json(stats);
});

/* ── TZ Excel export ── */

app.post('/api/admin/tz-export', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);

  // Apply same filters as /api/admin/tz
  const fSystem = String(req.body.system || '').trim();
  const fStatus = String(req.body.status || '').trim();
  const fType = String(req.body.type || '').trim();
  const fPriority = String(req.body.priority || '').trim();
  const fSearch = String(req.body.search || '').trim().toLowerCase();
  const fOverdue = !!req.body.overdue;
  const fNoDates = !!req.body.no_dates;
  const fNoOwner = !!req.body.no_owner;
  const fDeadlineSoon = !!req.body.deadline_soon;
  const fMissingDeadline = !!req.body.missing_deadline;

  let items = allTz.map((tz) => ({ ...tz, flags: computeTzFlags(tz) }));

  if (fSystem) items = items.filter((t) => t.system === fSystem);
  if (fStatus) items = items.filter((t) => t.status === fStatus);
  if (fType) items = items.filter((t) => t.type === fType);
  if (fPriority) items = items.filter((t) => t.priority === fPriority);
  if (fSearch) items = items.filter((t) =>
    (t.title && t.title.toLowerCase().includes(fSearch)) ||
    (t.tz_code && t.tz_code.toLowerCase().includes(fSearch)) ||
    (t.owner && t.owner.toLowerCase().includes(fSearch)) ||
    (t.description && t.description.toLowerCase().includes(fSearch))
  );
  if (fOverdue) items = items.filter((t) => t.flags.overdue);
  if (fNoDates) items = items.filter((t) => t.flags.no_dates);
  if (fNoOwner) items = items.filter((t) => t.flags.no_owner);
  if (fDeadlineSoon) items = items.filter((t) => t.flags.deadline_soon);
  if (fMissingDeadline) items = items.filter((t) => t.flags.missing_deadline);

  items.sort((a, b) => b.created_at.localeCompare(a.created_at));

  const prioLabels = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' };

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('ТЗ');

  ws.columns = [
    { header: 'Код', key: 'tz_code', width: 18 },
    { header: 'Название', key: 'title', width: 40 },
    { header: 'Система', key: 'system', width: 14 },
    { header: 'Тип', key: 'type', width: 12 },
    { header: 'Приоритет', key: 'priority', width: 14 },
    { header: 'Статус', key: 'status', width: 18 },
    { header: 'Ответственный', key: 'owner', width: 22 },
    { header: 'Описание', key: 'description', width: 50 },
    { header: 'Confluence', key: 'link_confluence', width: 30 },
    { header: 'Jira', key: 'link_jira', width: 30 },
    { header: 'Дедлайн анализа', key: 'date_analysis_deadline', width: 16 },
    { header: 'Дедлайн разработки', key: 'date_dev_deadline', width: 18 },
    { header: 'Дедлайн релиза', key: 'date_release_deadline', width: 16 },
    { header: 'Дата создания', key: 'created_at', width: 20 }
  ];

  // Style header row
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0E2156' } };
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  for (const tz of items) {
    ws.addRow({
      tz_code: tz.tz_code || '',
      title: tz.title || '',
      system: tz.system || '',
      type: tz.type || '',
      priority: prioLabels[tz.priority] || tz.priority || '',
      status: TZ_STATUS_LABELS[tz.status] || tz.status || '',
      owner: tz.owner || '',
      description: tz.description || '',
      link_confluence: tz.link_confluence || '',
      link_jira: tz.link_jira || '',
      date_analysis_deadline: tz.date_analysis_deadline || '',
      date_dev_deadline: tz.date_dev_deadline || '',
      date_release_deadline: tz.date_release_deadline || '',
      created_at: tz.created_at ? new Date(tz.created_at).toLocaleString('ru-RU') : ''
    });
  }

  const buffer = await wb.xlsx.writeBuffer();
  const dateStr = new Date().toISOString().slice(0, 10);
  res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.set('Content-Disposition', `attachment; filename="tz_export_${dateStr}.xlsx"`);
  res.send(Buffer.from(buffer));
});

/* ── AI Agent endpoints (superadmin only) ── */

app.post('/api/admin/ai-task', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const prompt = String(req.body.prompt || '').trim();
  if (prompt.length < 3) return res.status(400).json({ message: 'Промпт минимум 3 символа.' });

  const users = await readJson(FILES.users, {});
  const user = users[pin];

  return withLock(FILES.aiTasks, async () => {
    const tasks = await readJson(FILES.aiTasks, []);
    const task = {
      id: randomUUID(),
      prompt: prompt.slice(0, 4000),
      status: 'pending',
      result: null,
      created_by: user ? user.fullName : 'superadmin',
      created_at: new Date().toISOString(),
      started_at: null,
      finished_at: null
    };
    tasks.push(task);
    await writeJson(FILES.aiTasks, tasks);
    return res.json(task);
  });
});

app.post('/api/admin/ai-tasks', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const tasks = await readJson(FILES.aiTasks, []);
  const sorted = tasks.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
  return res.json(sorted);
});

app.post('/api/admin/ai-task-cancel', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await isSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const taskId = String(req.body.taskId || '').trim();
  if (!taskId) return res.status(400).json({ message: 'Укажите taskId.' });

  return withLock(FILES.aiTasks, async () => {
    const tasks = await readJson(FILES.aiTasks, []);
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return res.status(404).json({ message: 'Задача не найдена.' });
    if (task.status !== 'pending') return res.status(400).json({ message: 'Можно отменить только pending-задачу.' });
    task.status = 'cancelled';
    task.finished_at = new Date().toISOString();
    await writeJson(FILES.aiTasks, tasks);
    return res.json({ ok: true });
  });
});

/* ── SPA fallback ── */

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`LKDS portal started on http://localhost:${port}`);
});
