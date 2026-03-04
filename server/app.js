import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID, scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { createTransport } from 'nodemailer';
import ExcelJS from 'exceljs';
import { computeTzFlags as _computeTzFlags, TZ_STATUS_ORD as _TZ_STATUS_ORD, TZ_STATUS_LABELS as _TZ_STATUS_LABELS } from './utils.js';

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
  crmConfig: path.join(dataDir, 'crm-config.json'),
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
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
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

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateId(req, res, next) {
  if (req.params.id && !UUID_RE.test(req.params.id)) {
    return res.status(400).json({ message: 'Некорректный ID.' });
  }
  next();
}

app.param('id', validateId);

/* ── Telegram notifications ── */

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

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
// Optional: set CRM_BOT_TICKETS_FILE in .env only if crm-support-bot is deployed alongside
const CRM_BOT_TICKETS_FILE = process.env.CRM_BOT_TICKETS_FILE
  ? path.resolve(process.env.CRM_BOT_TICKETS_FILE)
  : path.resolve(rootDir, '../crm-support-bot/data/tickets.json');
const CRM_BOT_EXCEL_FILE = process.env.CRM_BOT_EXCEL_FILE
  ? path.resolve(process.env.CRM_BOT_EXCEL_FILE)
  : path.resolve(rootDir, '../crm-support-bot/data/crm_support_log.xlsx');

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

async function appendToBotExcelSafe(row) {
  try {
    await appendToBotExcel(row);
  } catch (err) {
    console.warn('[crm-bot-excel] skipped:', err.message);
  }
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
  try {
    const store = await readJson(CRM_BOT_TICKETS_FILE, { next_id: 1, items: {} });
    const tid = store.next_id;
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    store.items[String(tid)] = {
      type, fio, module, category, description,
      status: 'new', taken_by: null, admin_messages: {},
      group_message_id: null, created_at: createdAt, source: 'portal'
    };
    store.next_id = tid + 1;
    await writeJson(CRM_BOT_TICKETS_FILE, store);
    return tid;
  } catch (err) {
    console.warn('[crm-bot-sync] createBotTicket skipped:', err.message);
    return null;
  }
}

/* ── CRM config ── */

const _DEFAULT_CRM_CONFIG = {
  modules: [
    'Модуль экономической эффективности и аналитики',
    'Модуль развития цепей поставок и складской логистики',
    'Модуль развития бизнеса 1',
    'Модуль развития бизнеса 2',
    'Модуль технологии и эффективности'
  ],
  errorCategories: [
    'Воронка продаж',
    'Проблема с карточкой клиента',
    'Проблема с карточкой интереса',
    'Нет доступа',
    'Другое'
  ]
};

async function getCrmConfig() {
  const cfg = await readJson(FILES.crmConfig, null);
  if (cfg && Array.isArray(cfg.modules) && Array.isArray(cfg.errorCategories)) return cfg;
  return { ..._DEFAULT_CRM_CONFIG };
}

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
app.use(express.static(publicDir, { etag: false, maxAge: 0 }));

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

/* ── PIN crypto helpers ── */

const scryptAsync = promisify(scrypt);

async function hashPin(pin) {
  const salt = randomBytes(16).toString('hex');
  const hash = (await scryptAsync(pin, salt, 64)).toString('hex');
  return { hash, salt };
}

async function verifyPin(pin, hash, salt) {
  try {
    const derived = await scryptAsync(pin, salt, 64);
    return timingSafeEqual(Buffer.from(hash, 'hex'), derived);
  } catch { return false; }
}

// Simple in-memory cache: pin → {userId, expires}
const _pinCache = new Map();
const PIN_CACHE_TTL = 5 * 60 * 1000;

async function getUserByPin(pin) {
  const cached = _pinCache.get(pin);
  if (cached && cached.expires > Date.now()) {
    const users = await readJson(FILES.users, []);
    const u = users.find((x) => x.id === cached.userId);
    if (u) return u;
  }
  const users = await readJson(FILES.users, []);
  for (const u of users) {
    if (u.pinHash && await verifyPin(pin, u.pinHash, u.pinSalt)) {
      _pinCache.set(pin, { userId: u.id, expires: Date.now() + PIN_CACHE_TTL });
      return u;
    }
  }
  return null;
}

function invalidatePinCache(pin) { _pinCache.delete(pin); }

async function migrateUsers() {
  const data = await readJson(FILES.users, {});
  if (Array.isArray(data)) return;
  console.log('[migrate] users.json → array + scrypt hashing...');
  const result = [];
  for (const [pin, user] of Object.entries(data)) {
    const { hash, salt } = await hashPin(pin);
    result.push({ ...user, id: user.id || randomUUID(), pinHash: hash, pinSalt: salt });
  }
  await writeJson(FILES.users, result);
  console.log(`[migrate] done: ${result.length} users`);
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

// Free-form transitions (Jira-style): any status → any other status
const TZ_TRANSITIONS = Object.fromEntries(
  TZ_STATUSES.map(s => [s, TZ_STATUSES.filter(t => t !== s)])
);

const TZ_STATUS_ORD = _TZ_STATUS_ORD;
const TZ_STATUS_LABELS = _TZ_STATUS_LABELS;
const computeTzFlags = _computeTzFlags;

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

function getUserRole(pin, user) {
  if (ADMIN_PINS.has(pin)) return 'superadmin';
  if (!user) return null;
  if (user.role === 'superadmin' || user.role === 'it_admin') return user.role;
  if (user.isAdmin) return 'superadmin'; // backward compat
  return null;
}

function isAdmin(pin, user) { return !!getUserRole(pin, user); }
function isSuperAdmin(pin, user) { return getUserRole(pin, user) === 'superadmin'; }

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
    // Check for duplicate PIN by verifying against all existing users
    const existing = await getUserByPin(pin);
    if (existing)
      return res.status(400).json({ message: 'Этот пин-код уже занят. Попробуйте другой.' });

    const { hash, salt } = await hashPin(pin);
    const users = await readJson(FILES.users, []);
    users.push({ id: randomUUID(), pinHash: hash, pinSalt: salt, fullName, contact, createdAt: new Date().toISOString() });
    await writeJson(FILES.users, users);
    return res.status(201).json({ fullName, contact });
  });
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

  const adminRole = getUserRole(pin, user);
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
    `🔑 <b>Забыл пин-код</b>\n\nФИО: ${escHtml(fullName)}\nКонтакт: ${escHtml(contact)}`
  );

  return res.json({ message: 'Запрос отправлен администратору. Ожидайте — с вами свяжутся.' });
});

/* ── Settings ── */

app.get('/api/settings', (_req, res) => {
  res.json({ publicBaseUrl, startHour: 8, endHour: 21, slotStep: 0.5, appName: 'ЛКДС — Портал сотрудника' });
});

app.get('/api/crm-config', async (_req, res) => {
  res.json(await getCrmConfig());
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

  const requester = await getUserByPin(reqPin);
  if (!requester) return res.status(401).json({ message: 'Неверный пин-код.' });

  const targetPin = req.params.pin;
  const user = await getUserByPin(targetPin);
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

  const userObj = await getUserByPin(pin);
  if (!userObj) return res.status(401).json({ message: 'Неверный пин-код.' });

  return withLock(FILES.users, async () => {
    const users = await readJson(FILES.users, []);
    const u = users.find((x) => x.id === userObj.id);
    if (!u) return res.status(401).json({ message: 'Неверный пин-код.' });

    if (contact && contact.length >= 3) u.contact = contact;
    if (position !== undefined) u.position = position;
    if (workLocation !== undefined) u.workLocation = workLocation;
    if (workDesk !== undefined) u.workDesk = workDesk;

    await writeJson(FILES.users, users);
    return res.json({
      message: 'Профиль обновлён.', contact: u.contact,
      position: u.position || '',
      workLocation: u.workLocation || '', workDesk: u.workDesk || ''
    });
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
    const userObj = await getUserByPin(pin);
    if (!userObj) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(401).json({ message: 'Неверный пин-код.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const safeName = `${userObj.id}${ext}`;
    const finalPath = path.join(avatarsDir, safeName);

    // Remove old avatar if exists
    if (userObj.avatar) {
      await fs.unlink(path.join(avatarsDir, userObj.avatar)).catch(() => {});
    }

    await fs.rename(req.file.path, finalPath);

    const users = await readJson(FILES.users, []);
    const u = users.find((x) => x.id === userObj.id);
    if (u) u.avatar = safeName;
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

  const user = await getUserByPin(pin);
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

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код. Войдите заново.' });

  const crmCfg = await getCrmConfig();
  if (!['error', 'suggestion'].includes(type))
    return res.status(400).json({ message: 'Тип заявки: error или suggestion.' });
  if (!module || !crmCfg.modules.includes(module))
    return res.status(400).json({ message: 'Выберите модуль из списка.' });
  if (type === 'error' && (!category || !crmCfg.errorCategories.includes(category)))
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

    if (tid !== null) {
      // Format matching bot.py _ticket_text()
      const tgLines = [
        `${botEmoji} <b>Новая заявка #${tid}: ${escHtml(botType)}</b>\n`,
        `👤 ${escHtml(user.fullName)}`,
        `📦 ${escHtml(module)}`
      ];
      if (botCategory && botCategory !== '—') tgLines.push(`📂 ${escHtml(botCategory)}`);
      tgLines.push(`💬 ${escHtml(description)}`);
      const tgText = tgLines.join('\n');

      const adminMessages = {};
      for (const adminId of CRM_BOT_ADMIN_IDS) {
        const msgId = await tgSendWithButton(TG_TOKEN, adminId, tgText, `take:${tid}`);
        if (msgId) adminMessages[String(adminId)] = msgId;
      }

      // Save message_ids back to bot ticket
      try {
        const store = await readJson(CRM_BOT_TICKETS_FILE, { next_id: 1, items: {} });
        if (store.items[String(tid)]) {
          store.items[String(tid)].admin_messages = adminMessages;
          await writeJson(CRM_BOT_TICKETS_FILE, store);
        }
      } catch (err) {
        console.warn('[crm-bot-sync] admin_messages save skipped:', err.message);
      }
    }

    // Append to bot Excel log
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    await appendToBotExcelSafe([ts, 'portal', user.fullName, module, botType, botCategory, description]);
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

  const user = await getUserByPin(pin);
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
    `Категория: ${cat.emoji} ${escHtml(cat.label)}\n` +
    (category !== 'other' && subcategory ? `Тип: ${escHtml(subcategory)}\n` : '') +
    `Локация: ${escHtml(location)}${location === 'Офис 2 этаж' && seat ? ` (место ${escHtml(seat)})` : ''}\n` +
    `Описание: ${escHtml(ticket.description)}\n` +
    `От: ${escHtml(user.fullName)} (${escHtml(user.contact)})\n\n` +
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

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

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

  const rater = await getUserByPin(pin);
  if (!rater) return res.status(401).json({ message: 'Неверный пин-код.' });

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

  const user = await getUserByPin(pin);
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

/* ── Admin helpers ── */
async function requireSuperAdmin(pin) {
  const user = await getUserByPin(pin);
  if (!isSuperAdmin(pin, user)) return null;
  return user;
}
async function requireAdmin(pin) {
  const user = await getUserByPin(pin);
  if (!isAdmin(pin, user)) return null;
  return user;
}

function paginate(items, page, pageSize) {
  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(200, Math.max(1, Number(pageSize) || 50));
  const start = (p - 1) * ps;
  return { items: items.slice(start, start + ps), total, page: p, pageSize: ps };
}

// superadmin-only endpoints
app.post('/api/admin/bookings', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.bookings, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.tickets, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

// IT tickets — accessible by both superadmin and it_admin
app.post('/api/admin/it-tickets', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.itTickets, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/suggestions', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.suggestions, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/pin-requests', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.pinRequests, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/pin-request-resolve', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const requestId = String(req.body.requestId || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const requests = await readJson(FILES.pinRequests, []);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return res.status(404).json({ message: 'Запрос не найден.' });

  requests.splice(idx, 1);
  await writeJson(FILES.pinRequests, requests);
  return res.json({ message: 'Запрос закрыт.' });
});

app.post('/api/admin/users', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const users = await readJson(FILES.users, []);
  const list = users.map((u) => {
    const role = getUserRole('', u); // no plain pin available, rely on user object fields
    return {
      id: u.id, fullName: u.fullName, contact: u.contact,
      position: u.position || '', avatar: !!u.avatar,
      isAdmin: !!role, role: role || 'employee', createdAt: u.createdAt
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(list, page, pageSize));
});

app.post('/api/admin/update-user', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetId = String(req.body.targetId || '').trim();
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const newPin = String(req.body.newPin || '').trim();

  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetId) return res.status(400).json({ message: 'Укажите id пользователя.' });

  return withLock(FILES.users, async () => {
    const users = await readJson(FILES.users, []);
    const target = users.find((u) => u.id === targetId);
    if (!target) return res.status(404).json({ message: 'Пользователь не найден.' });

    if (fullName && fullName.length >= 3) target.fullName = fullName;
    else if (fullName) return res.status(400).json({ message: 'ФИО минимум 3 символа.' });

    if (contact && contact.length >= 3) target.contact = contact;
    else if (contact) return res.status(400).json({ message: 'Контакт минимум 3 символа.' });

    if (newPin) {
      if (!/^\d{4}$/.test(newPin))
        return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });
      // Check duplicate
      const dup = await getUserByPin(newPin);
      if (dup && dup.id !== targetId)
        return res.status(400).json({ message: 'Этот пин-код уже занят.' });
      const { hash, salt } = await hashPin(newPin);
      target.pinHash = hash;
      target.pinSalt = salt;
      // Invalidate any cached entry for old pin
      for (const [cachedPin, cv] of _pinCache) {
        if (cv.userId === targetId) { _pinCache.delete(cachedPin); break; }
      }
      // Update bookings by fullName (since we no longer store old pin)
      const bookings = await readJson(FILES.bookings, []);
      let changed = false;
      for (const b of bookings) {
        if (b.fullName === target.fullName) { b.pin = newPin; changed = true; }
      }
      if (changed) await writeJson(FILES.bookings, bookings);
    }

    await writeJson(FILES.users, users);
    return res.json({ message: 'Данные обновлены.' });
  });
});

app.post('/api/admin/toggle-admin', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetId = String(req.body.targetId || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetId) return res.status(400).json({ message: 'Укажите id пользователя.' });

  const users = await readJson(FILES.users, []);
  const target = users.find((u) => u.id === targetId);
  if (!target) return res.status(404).json({ message: 'Пользователь не найден.' });

  target.isAdmin = !target.isAdmin;
  await writeJson(FILES.users, users);
  return res.json({ id: targetId, isAdmin: !!target.isAdmin });
});

app.post('/api/admin/set-role', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const targetId = String(req.body.targetId || '').trim();
  const role = String(req.body.role || '').trim();

  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetId) return res.status(400).json({ message: 'Укажите id пользователя.' });
  if (!['superadmin', 'it_admin', 'employee'].includes(role))
    return res.status(400).json({ message: 'Роль: superadmin, it_admin или employee.' });

  const users = await readJson(FILES.users, []);
  const target = users.find((u) => u.id === targetId);
  if (!target) return res.status(404).json({ message: 'Пользователь не найден.' });

  if (role === 'employee') {
    delete target.role;
    target.isAdmin = false;
  } else {
    target.role = role;
    target.isAdmin = true;
  }

  await writeJson(FILES.users, users);
  return res.json({ id: targetId, role });
});

/* ── Admin: CRM config management ── */

app.post('/api/admin/crm-config', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const user = await getUserByPin(pin);
  if (!user || user.role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });
  res.json(await getCrmConfig());
});

app.post('/api/admin/crm-config-add', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const field = String(req.body.field || '').trim();
  const value = clip(String(req.body.value || '').trim(), 200);

  const user = await getUserByPin(pin);
  if (!user || user.role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });
  if (!['modules', 'errorCategories'].includes(field))
    return res.status(400).json({ message: 'Неверное поле.' });
  if (!value) return res.status(400).json({ message: 'Введите название.' });

  try {
    await withLock('crmConfig', async () => {
      const cfg = await getCrmConfig();
      if (cfg[field].includes(value)) throw Object.assign(new Error('Такой пункт уже есть.'), { status: 409 });
      cfg[field].push(value);
      await writeJson(FILES.crmConfig, cfg);
    });
    res.json({ message: 'Добавлено.' });
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

app.post('/api/admin/crm-config-delete', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const field = String(req.body.field || '').trim();
  const value = String(req.body.value || '').trim();

  const user = await getUserByPin(pin);
  if (!user || user.role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });
  if (!['modules', 'errorCategories'].includes(field))
    return res.status(400).json({ message: 'Неверное поле.' });
  if (!value) return res.status(400).json({ message: 'Укажите пункт.' });

  await withLock('crmConfig', async () => {
    const cfg = await getCrmConfig();
    cfg[field] = cfg[field].filter((v) => v !== value);
    await writeJson(FILES.crmConfig, cfg);
  });
  res.json({ message: 'Удалено.' });
});

/* ── Booking cancel ── */

app.post('/api/bookings/:id/cancel', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = isAdmin(pin, user);

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

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = isAdmin(pin, user);

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
  const authUser = await requireSuperAdmin(pin);
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const title = clip(String(req.body.title || '').trim(), 300);
  const system = String(req.body.system || '').trim();
  const type = String(req.body.type || '').trim();
  const priority = String(req.body.priority || '').trim();
  const description = clip(String(req.body.description || '').trim(), 5000);
  const owner = clip(String(req.body.owner || '').trim(), 100);
  const link_confluence = clip(String(req.body.link_confluence || '').trim(), 500);
  const link_jira = clip(String(req.body.link_jira || '').trim(), 500);
  const completion_notes = clip(String(req.body.completion_notes || '').trim(), 5000);
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
    const creatorName = authUser.fullName || pin;

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
      completion_notes,
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
  const authUser = await requireSuperAdmin(pin);
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    const changedBy = authUser.fullName || pin;

    const editableFields = [
      'title', 'system', 'type', 'priority', 'status',
      'description', 'owner', 'link_confluence', 'link_jira', 'completion_notes',
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
      if (field === 'completion_notes') newVal = clip(newVal, 5000);
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

function filterTz(allTz, body) {
  const fSystem = String(body.system || '').trim();
  const fStatus = String(body.status || '').trim();
  const fType = String(body.type || '').trim();
  const fPriority = String(body.priority || '').trim();
  const fSearch = String(body.search || '').trim().toLowerCase();
  const fOverdue = !!body.overdue;
  const fNoDates = !!body.no_dates;
  const fNoOwner = !!body.no_owner;
  const fDeadlineSoon = !!body.deadline_soon;
  const fMissingDeadline = !!body.missing_deadline;

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

  return items;
}

app.post('/api/admin/tz', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const items = filterTz(allTz, req.body);
  items.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { page, pageSize } = req.body;
  return res.json(paginate(items, page, pageSize));
});

app.get('/api/tz/:id', async (req, res) => {
  const reqPin = String(req.query.pin || '').trim();
  if (!(await requireSuperAdmin(reqPin))) return res.status(403).json({ message: 'Нет доступа.' });

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
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

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
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const items = filterTz(allTz, req.body);
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
    { header: 'Примечания к выполнению', key: 'completion_notes', width: 40 },
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
      completion_notes: tz.completion_notes || '',
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

/* ── Kanban view (superadmin only) ── */

app.post('/api/admin/tz-kanban', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const items = filterTz(allTz, req.body);

  items.sort((a, b) => {
    const pa = { critical: 0, high: 1, medium: 2, low: 3 };
    return (pa[a.priority] ?? 9) - (pa[b.priority] ?? 9) || a.created_at.localeCompare(b.created_at);
  });

  const columns = {};
  for (const s of TZ_STATUSES) columns[s] = [];
  for (const item of items) {
    const col = columns[item.status];
    if (col) col.push(item);
  }

  return res.json({ columns, transitions: TZ_TRANSITIONS, statusLabels: TZ_STATUS_LABELS });
});

app.patch('/api/tz/:id/status', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const authUser = await requireSuperAdmin(pin);
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const newStatus = String(req.body.status || '').trim();
  if (!TZ_STATUSES.includes(newStatus)) return res.status(400).json({ message: 'Неизвестный статус.' });

  const id = req.params.id;

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    if (tz.status === newStatus) return res.json({ message: 'Статус не изменился.', tz });

    const allowed = TZ_TRANSITIONS[tz.status] || [];
    if (!allowed.includes(newStatus)) {
      return res.status(400).json({
        message: `Переход из «${TZ_STATUS_LABELS[tz.status]}» в «${TZ_STATUS_LABELS[newStatus]}» не допускается.`
      });
    }

    const changedBy = authUser.fullName || pin;
    await recordTzHistory(tz.id, 'status', tz.status, newStatus, changedBy);
    tz.status = newStatus;
    tz.updated_at = new Date().toISOString();
    await writeJson(FILES.tz, allTz);

    return res.json({ message: `Статус изменён на «${TZ_STATUS_LABELS[newStatus]}».`, tz: { ...tz, flags: computeTzFlags(tz) } });
  });
});

/* ── Knowledge Base (Wiki) ── */

const kbImagesDir = path.join(dataDir, 'kb-images');

const kbImageStorage = multer.diskStorage({
  destination: kbImagesDir,
  filename: (_req, _file, cb) => cb(null, `${randomUUID()}.tmp`)
});

const kbImageUpload = multer({
  storage: kbImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  }
}).single('image');

const KB_FILES = {
  articles: path.join(dataDir, 'kb-articles.json'),
  categories: path.join(dataDir, 'kb-categories.json')
};

// Categories

app.get('/api/kb/categories', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });

  const cats = await readJson(KB_FILES.categories, []);
  const articles = await readJson(KB_FILES.articles, []);
  const result = cats
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({ ...c, articleCount: articles.filter((a) => a.category_id === c.id).length }));
  return res.json(result);
});

app.post('/api/kb/categories', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название категории минимум 2 символа.' });
  const icon = clip(String(req.body.icon || 'folder').trim(), 30);

  return withLock(KB_FILES.categories, async () => {
    const cats = await readJson(KB_FILES.categories, []);
    if (cats.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: 'Категория с таким названием уже существует.' });
    }
    const cat = { id: randomUUID(), name, icon, order: cats.length };
    cats.push(cat);
    await writeJson(KB_FILES.categories, cats);
    return res.status(201).json({ message: 'Категория создана.', category: cat });
  });
});

app.put('/api/kb/categories/:id', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  return withLock(KB_FILES.categories, async () => {
    const cats = await readJson(KB_FILES.categories, []);
    const cat = cats.find((c) => c.id === id);
    if (!cat) return res.status(404).json({ message: 'Категория не найдена.' });

    if (req.body.name !== undefined) {
      const name = clip(String(req.body.name).trim(), 100);
      if (name.length < 2) return res.status(400).json({ message: 'Название минимум 2 символа.' });
      if (cats.some((c) => c.id !== id && c.name.toLowerCase() === name.toLowerCase())) {
        return res.status(400).json({ message: 'Категория с таким названием уже существует.' });
      }
      cat.name = name;
    }
    if (req.body.icon !== undefined) cat.icon = clip(String(req.body.icon).trim(), 30);
    if (req.body.order !== undefined) cat.order = Number(req.body.order) || 0;

    await writeJson(KB_FILES.categories, cats);
    return res.json({ message: 'Категория обновлена.', category: cat });
  });
});

app.delete('/api/kb/categories/:id', async (req, res) => {
  const pin = String(req.body.pin || req.query.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  return withLock(KB_FILES.categories, async () => {
    const cats = await readJson(KB_FILES.categories, []);
    const articles = await readJson(KB_FILES.articles, []);
    if (articles.some((a) => a.category_id === id)) {
      return res.status(400).json({ message: 'Нельзя удалить категорию со статьями. Сначала удалите или перенесите статьи.' });
    }
    const idx = cats.findIndex((c) => c.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Категория не найдена.' });
    cats.splice(idx, 1);
    await writeJson(KB_FILES.categories, cats);
    return res.json({ message: 'Категория удалена.' });
  });
});

// Articles

app.get('/api/kb/articles', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });

  const articles = await readJson(KB_FILES.articles, []);
  const catId = String(req.query.category_id || '').trim();
  const search = String(req.query.search || '').trim().toLowerCase();

  let items = articles;
  if (catId) items = items.filter((a) => a.category_id === catId);
  if (search) items = items.filter((a) =>
    (a.title && a.title.toLowerCase().includes(search)) ||
    (a.content && a.content.replace(/<[^>]+>/g, '').toLowerCase().includes(search))
  );

  items.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updated_at.localeCompare(a.updated_at);
  });

  const list = items.map(({ content, ...rest }) => rest);
  return res.json(list);
});

app.get('/api/kb/articles/:id', async (req, res) => {
  const pin = String(req.query.pin || '').trim();
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });

  const articles = await readJson(KB_FILES.articles, []);
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ message: 'Статья не найдена.' });
  return res.json(article);
});

app.post('/api/kb/articles', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  const authUser = await requireSuperAdmin(pin);
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const title = clip(String(req.body.title || '').trim(), 300);
  if (title.length < 3) return res.status(400).json({ message: 'Название минимум 3 символа.' });
  const content = String(req.body.content || '').trim();
  if (content.length < 10) return res.status(400).json({ message: 'Содержимое слишком короткое.' });
  const categoryId = String(req.body.category_id || '').trim();
  const pinned = !!req.body.pinned;

  const cats = await readJson(KB_FILES.categories, []);
  if (categoryId && !cats.some((c) => c.id === categoryId)) {
    return res.status(400).json({ message: 'Категория не найдена.' });
  }

  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const article = {
      id: randomUUID(),
      title,
      content: clip(content, 200000),
      category_id: categoryId || null,
      pinned,
      created_by: authUser.fullName || 'superadmin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    articles.push(article);
    await writeJson(KB_FILES.articles, articles);
    return res.status(201).json({ message: 'Статья создана.', article: { ...article, content: undefined } });
  });
});

app.put('/api/kb/articles/:id', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const article = articles.find((a) => a.id === id);
    if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

    if (req.body.title !== undefined) {
      const t = clip(String(req.body.title).trim(), 300);
      if (t.length < 3) return res.status(400).json({ message: 'Название минимум 3 символа.' });
      article.title = t;
    }
    if (req.body.content !== undefined) {
      article.content = clip(String(req.body.content).trim(), 200000);
    }
    if (req.body.category_id !== undefined) {
      const catId = String(req.body.category_id).trim();
      if (catId) {
        const cats = await readJson(KB_FILES.categories, []);
        if (!cats.some((c) => c.id === catId)) return res.status(400).json({ message: 'Категория не найдена.' });
      }
      article.category_id = catId || null;
    }
    if (req.body.pinned !== undefined) article.pinned = !!req.body.pinned;

    article.updated_at = new Date().toISOString();
    await writeJson(KB_FILES.articles, articles);
    return res.json({ message: 'Статья обновлена.' });
  });
});

app.delete('/api/kb/articles/:id', async (req, res) => {
  const pin = String(req.body.pin || req.query.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Статья не найдена.' });
    articles.splice(idx, 1);
    await writeJson(KB_FILES.articles, articles);
    return res.json({ message: 'Статья удалена.' });
  });
});

// KB image upload

app.post('/api/kb/upload-image', (req, res) => {
  kbImageUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Файл слишком большой (макс 5 МБ).' });
      return res.status(400).json({ message: 'Ошибка загрузки файла.' });
    }
    if (!req.file) return res.status(400).json({ message: 'Файл не выбран.' });

    const pin = String(req.body.pin || '').trim();
    if (!(await requireSuperAdmin(pin))) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(403).json({ message: 'Нет доступа.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
    const finalName = `${randomUUID()}${ext}`;
    const finalPath = path.join(kbImagesDir, finalName);
    await fs.rename(req.file.path, finalPath);
    return res.json({ url: `/api/kb/images/${finalName}` });
  });
});

app.get('/api/kb/images/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);
  const filePath = path.join(kbImagesDir, filename);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).json({ message: 'Изображение не найдено.' });
  });
});

/* ── AI Agent endpoints (superadmin only) ── */

app.post('/api/admin/ai-task', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const prompt = String(req.body.prompt || '').trim();
  if (prompt.length < 3) return res.status(400).json({ message: 'Промпт минимум 3 символа.' });

  const aiAuthor = await getUserByPin(pin);

  return withLock(FILES.aiTasks, async () => {
    const tasks = await readJson(FILES.aiTasks, []);
    const task = {
      id: randomUUID(),
      prompt: prompt.slice(0, 4000),
      status: 'pending',
      result: null,
      created_by: aiAuthor ? aiAuthor.fullName : 'superadmin',
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
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const tasks = await readJson(FILES.aiTasks, []);
  const sorted = tasks.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
  return res.json(sorted);
});

app.post('/api/admin/ai-task-cancel', async (req, res) => {
  const pin = String(req.body.pin || '').trim();
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

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

fs.mkdir(kbImagesDir, { recursive: true }).catch(() => {});

migrateUsers()
  .then(() => {
    app.listen(port, () => {
      console.log(`LKDS portal started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed, aborting:', err);
    process.exit(1);
  });
