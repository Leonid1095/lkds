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
import mammoth from 'mammoth';
import XLSX from 'xlsx';
import { computeTzFlags as _computeTzFlags, TZ_STATUS_ORD as _TZ_STATUS_ORD, TZ_STATUS_LABELS as _TZ_STATUS_LABELS, TZ_STATUSES as _TZ_STATUSES, TZ_TYPES as _TZ_TYPES, TZ_USER_TYPES as _TZ_USER_TYPES, buildStatusOrd as _buildStatusOrd } from './utils.js';

import { createWriteStream } from 'node:fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');

/* ── Structured logger (JSON lines to file + console) ── */
const LOG_FILE = process.env.LOG_FILE || path.join(rootDir, 'logs', 'server.log');
let _logStream = null;
try {
  await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
  _logStream = createWriteStream(LOG_FILE, { flags: 'a' });
} catch { /* fallback to console only */ }

function log(level, msg, meta = {}) {
  const entry = { ts: new Date().toISOString(), level, msg, ...meta };
  const line = JSON.stringify(entry);
  if (_logStream) _logStream.write(line + '\n');
  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else if (process.env.NODE_ENV !== 'production') console.log(line);
}
const publicDir = path.join(rootDir, 'public');
const avatarsDir = path.join(dataDir, 'avatars');

const app = express();
app.set('trust proxy', 1);
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
  crmConfig: path.join(dataDir, 'crm-config.json'),
  suggestions: path.join(dataDir, 'suggestions.json'),
  pinRequests: path.join(dataDir, 'pin-requests.json'),
  tz: path.join(dataDir, 'tz.json'),
  tzHistory: path.join(dataDir, 'tz-history.json'),
  boards: path.join(dataDir, 'boards.json'),
  aiTasks: path.join(dataDir, 'ai-tasks.json'),
  tzComments: path.join(dataDir, 'tz-comments.json'),
  tzTemplates: path.join(dataDir, 'tz-templates.json'),
  auditLog: path.join(dataDir, 'audit-log.json'),
  roles: path.join(dataDir, 'roles.json'),
  permissions: path.join(dataDir, 'permissions.json'),
  kbGroups: path.join(dataDir, 'kb-groups.json'),
  notifications: path.join(dataDir, 'notifications.json'),
  kbHistory: path.join(dataDir, 'kb-history.json'),
  tasks: path.join(dataDir, 'tasks.json'),
  kbTemplates: path.join(dataDir, 'kb-templates.json')
};

/* ── Security middleware ── */

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://cdn.jsdelivr.net"],
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

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: { message: 'Слишком много запросов. Подождите минуту.' },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/admin', adminLimiter);

const userActionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: { message: 'Слишком много запросов. Подождите минуту.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/tz', userActionLimiter);
app.use('/api/bookings', userActionLimiter);
app.use('/api/tickets', userActionLimiter);
app.use('/api/suggestions', userActionLimiter);
app.use('/api/profile', userActionLimiter);
app.use('/api/search', userActionLimiter);
app.use('/api/kb', userActionLimiter);
app.use('/api/team', userActionLimiter);
app.use('/api/tasks', userActionLimiter);

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

async function tgSend(chatId, text) {
  if (!TG_TOKEN) return;
  try {
    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (err) {
    log('error', 'TG send failed', { error: err.message });
  }
}

function tgNotifyAdmins(text) {
  for (const id of TG_ADMIN_IDS) tgSend(id, text);
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
    log('error', 'Email send failed', { error: err.message });
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
    log('warn', 'crm-bot-excel skipped', { error: err.message });
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
    const origin = req.get('origin') || req.get('referer');
    if (!origin) {
      return res.status(403).json({ message: 'Запрос заблокирован (отсутствует origin).' });
    }
    const allowed = [publicBaseUrl, 'https://lkds-room.duckdns.org', `http://localhost:${port}`, `https://localhost:${port}`];
    const originHost = origin.replace(/\/+$/, '').split('/').slice(0, 3).join('/');
    if (!allowed.includes(originHost)) {
      return res.status(403).json({ message: 'Запрос заблокирован (origin).' });
    }
  }
  next();
});

/* ── Helpers ── */

app.use(express.json({ limit: '20mb' }));
app.use(express.static(publicDir, { etag: false, maxAge: 0 }));

/* ── Auth middleware (pre-populates req.authPin for convenience) ── */
app.use(async (req, res, next) => {
  const pin = getPin(req);
  if (pin && /^\d{4}$/.test(pin)) {
    req.authPin = pin;
    // Lazy: req.authUser populated on demand to avoid unnecessary lookups
    let _user;
    Object.defineProperty(req, 'authUser', {
      get: () => _user,
      set: (v) => { _user = v; }
    });
  }
  next();
});

/* ── JSON file cache (TTL-based, invalidated on write) ── */
const _fileCache = new Map();
const FILE_CACHE_TTL = 3000; // 3 seconds

async function readJson(filePath, fallback) {
  const cached = _fileCache.get(filePath);
  if (cached && cached.expires > Date.now()) return cached.data;
  try {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    _fileCache.set(filePath, { data, expires: Date.now() + FILE_CACHE_TTL });
    return data;
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  const tmp = filePath + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n', 'utf-8');
  await fs.rename(tmp, filePath);
  _fileCache.delete(filePath); // invalidate cache on write
}

async function auditLog(action, actor, details) {
  try {
    const log = await readJson(FILES.auditLog, []);
    log.push({ action, actor, details, ts: new Date().toISOString() });
    if (log.length > 5000) log.splice(0, log.length - 5000);
    await writeJson(FILES.auditLog, log);
  } catch (e) { console.warn('audit log write failed:', e.message); }
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

// Simple in-memory cache: pin → {user, expires}
/** Extract PIN from request: header > body > query (migrating away from query) */
function getPin(req) {
  return String(req.get('x-auth-pin') || req.body?.pin || req.query?.pin || '').trim();
}

const _pinCache = new Map();
const PIN_CACHE_TTL = 5 * 60 * 1000;

async function getUserByPin(pin) {
  const cached = _pinCache.get(pin);
  if (cached && cached.expires > Date.now()) return cached.user;
  const users = await readJson(FILES.users, []);
  for (const u of users) {
    if (u.pinHash && await verifyPin(pin, u.pinHash, u.pinSalt)) {
      _pinCache.set(pin, { user: u, expires: Date.now() + PIN_CACHE_TTL });
      return u;
    }
  }
  return null;
}

function invalidatePinCache(pin) { _pinCache.delete(pin); }
function invalidatePinCacheByUserId(userId) {
  for (const [p, v] of _pinCache) { if (v.user && v.user.id === userId) { _pinCache.delete(p); break; } }
}

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

async function migrateBoards() {
  let boards = await readJson(FILES.boards, null);
  if (!boards) {
    const defaultId = randomUUID();
    const now = new Date().toISOString();
    boards = [{
      id: defaultId,
      name: 'Техзадания',
      slug: 'tz',
      code_prefix: 'TZ',
      description: '',
      columns: [
        { id: 'draft', name: 'Черновик', color: '#edf2f7', order: 0, hidden: false },
        { id: 'review', name: 'На рассмотрении', color: '#fefcbf', order: 1, hidden: false },
        { id: 'waiting_analysis', name: 'Ждёт анализа', color: '#fef3c7', order: 2, hidden: false },
        { id: 'analysis', name: 'Анализ', color: '#bee3f8', order: 3, hidden: false },
        { id: 'development', name: 'Разработка', color: '#c3dafe', order: 4, hidden: false },
        { id: 'testing', name: 'Тестирование', color: '#e9d8fd', order: 5, hidden: false },
        { id: 'release', name: 'Релиз', color: '#feebc8', order: 6, hidden: false },
        { id: 'production', name: 'В продакшене', color: '#c6f6d5', order: 7, hidden: false },
        { id: 'partial', name: 'В продакшене (частично)', color: '#fde68a', order: 8, hidden: false },
        { id: 'cancelled', name: 'Отменено', color: '#fed7d7', order: 9, hidden: false }
      ],
      default_column: 'draft',
      systems: ['ALIS', 'TOS', 'WMS', '1C_CRM', 'OTHER'],
      types: ['ТЗ', 'Дефект', 'Заявка', 'Задача', 'Недоработка', 'Предложение'],
      is_default: true,
      created_at: now,
      updated_at: now
    }];
    await writeJson(FILES.boards, boards);
    console.log(`[migrate] boards.json created with default board ${defaultId}`);
  }

  // Migrate: add card_fields and access to existing boards
  let boardsMigrated = false;
  for (const b of boards) {
    if (!b.card_fields) {
      b.card_fields = b.is_default
        ? { system: true, link_confluence: true, link_jira: true, phase_deadlines: true, completion_notes: true, approval: true }
        : { system: false, link_confluence: false, link_jira: false, phase_deadlines: false, completion_notes: false, approval: false };
      boardsMigrated = true;
    }
    if (!b.access) {
      b.access = b.is_default ? 'superadmin' : 'all';
      boardsMigrated = true;
    }
  }
  if (boardsMigrated) {
    await writeJson(FILES.boards, boards);
    console.log('[migrate] added card_fields/access to boards');
  }

  // Assign board_id to all TZ records without one
  const defaultBoard = boards.find(b => b.is_default);
  if (defaultBoard) {
    const allTz = await readJson(FILES.tz, []);
    let changed = false;
    for (const tz of allTz) {
      if (!tz.board_id) {
        tz.board_id = defaultBoard.id;
        changed = true;
      }
    }
    if (changed) {
      await writeJson(FILES.tz, allTz);
      console.log(`[migrate] assigned board_id to TZ records`);
    }
  }
}

const DEFAULT_ROLES = [
  { id: 'superadmin', name: 'Суперадмин', description: 'Полный доступ ко всем разделам', system: true },
  { id: 'employee', name: 'Сотрудник', description: 'Базовый доступ', system: true },
  { id: 'viewer', name: 'Наблюдатель', description: 'Только просмотр', system: true }
];

async function migrateRoles() {
  let roles = await readJson(FILES.roles, null);
  if (!roles) {
    roles = DEFAULT_ROLES;
    await writeJson(FILES.roles, roles);
    console.log('[migrate] roles.json created with default roles');
  }
  // Remove deprecated it_admin role if present
  if (roles.some(r => r.id === 'it_admin')) {
    const updated = roles.filter(r => r.id !== 'it_admin');
    await writeJson(FILES.roles, updated);
    console.log('[migrate] removed deprecated it_admin role');
  }
  // Ensure permissions.json exists with default structure
  let perms = await readJson(FILES.permissions, null);
  if (!perms) {
    perms = {
      roles: [
        { id: 'superadmin', name: 'Суперадмин', description: 'Полный доступ ко всем разделам', system: true, permissions: { admin_sections: '*', boards: '*', kb_categories: '*', features: '*' } },
        { id: 'employee', name: 'Сотрудник', description: 'Базовый доступ', system: true, permissions: { admin_sections: [], boards: [], kb_categories: [], features: [] } }
      ],
      groups: []
    };
    await writeJson(FILES.permissions, perms);
    console.log('[migrate] permissions.json created with defaults');
  }
  // Ensure viewer role exists in permissions
  if (!perms.roles.some(r => r.id === 'viewer')) {
    perms.roles.push({ id: 'viewer', name: 'Наблюдатель', description: 'Только просмотр', system: true, permissions: { admin_sections: [], boards: [], kb_categories: [], features: [] } });
    await writeJson(FILES.permissions, perms);
    console.log('[migrate] added viewer role to permissions');
  }

  // Sync roles.json with permissions.json — keep roles.json as a simple list mirror
  const rolesFile = await readJson(FILES.roles, []);
  const permsRoleIds = new Set(perms.roles.map(r => r.id));
  let rolesChanged = false;
  for (const pr of perms.roles) {
    if (!rolesFile.some(r => r.id === pr.id)) {
      rolesFile.push({ id: pr.id, name: pr.name, description: pr.description || '', system: !!pr.system });
      rolesChanged = true;
    }
  }
  if (rolesChanged) {
    await writeJson(FILES.roles, rolesFile);
    console.log('[migrate] synced roles.json with permissions.json');
  }
}

/** Ensure bidirectional linked_tz_ids integrity */
async function migrateTzLinks() {
  const allTz = await readJson(FILES.tz, []);
  let changed = false;
  for (const tz of allTz) {
    const links = tz.linked_tz_ids;
    if (!links || !links.length) continue;
    for (const lid of links) {
      const other = allTz.find(t => t.id === lid);
      if (!other) continue;
      if (!other.linked_tz_ids) other.linked_tz_ids = [];
      if (!other.linked_tz_ids.includes(tz.id)) {
        other.linked_tz_ids.push(tz.id);
        changed = true;
      }
    }
  }
  if (changed) {
    await writeJson(FILES.tz, allTz);
    console.log('[migrate] fixed bidirectional linked_tz_ids');
  }
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
const TZ_TYPES = _TZ_TYPES;
const TZ_USER_TYPES = _TZ_USER_TYPES;
const TZ_STATUSES = _TZ_STATUSES;
const TZ_PRIORITIES = ['low', 'medium', 'high', 'critical'];

// Free-form transitions (Jira-style): any status → any other status
const TZ_TRANSITIONS = Object.fromEntries(
  TZ_STATUSES.map(s => [s, TZ_STATUSES.filter(t => t !== s)])
);

const TZ_STATUS_ORD = _TZ_STATUS_ORD;
const TZ_STATUS_LABELS = _TZ_STATUS_LABELS;
const computeTzFlags = _computeTzFlags;
const buildStatusOrd = _buildStatusOrd;

/** Cache statusOrd per board to avoid rebuilding on every TZ */
function makeBoardOrdCache(boards) {
  const cache = new Map();
  return (boardId) => {
    if (!boardId) return TZ_STATUS_ORD;
    if (cache.has(boardId)) return cache.get(boardId);
    const board = boards.find(b => b.id === boardId);
    const ord = board ? buildStatusOrd(board.columns) : TZ_STATUS_ORD;
    cache.set(boardId, ord);
    return ord;
  };
}

/** Get status labels map for a board (or fallback to global) */
function getBoardStatusLabels(boards, boardId) {
  if (!boardId) return TZ_STATUS_LABELS;
  const board = boards.find(b => b.id === boardId);
  return board ? Object.fromEntries(board.columns.map(c => [c.id, c.name])) : TZ_STATUS_LABELS;
}

function generateTzCode(allTz, system, codePrefix = 'TZ') {
  const prefix = `${codePrefix}-${system}-`;
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
  if (user.role && user.role !== 'employee') return user.role;
  if (user.isAdmin) return 'superadmin'; // backward compat
  return null;
}

function isAdmin(pin, user) {
  const role = getUserRole(pin, user);
  if (!role || role === 'viewer') return false;
  return true;
}
function isSuperAdmin(pin, user) { return getUserRole(pin, user) === 'superadmin'; }

/* ── Unified permission resolution ── */

async function getUserPermissions(pin) {
  const user = await getUserByPin(pin);
  if (!user) return null;

  // Superadmin override via env
  if (ADMIN_PINS.has(pin)) {
    return { user, role: 'superadmin', isSuperAdmin: true, permissions: { admin_sections: '*', boards: '*', kb_categories: '*', features: '*' }, groups: [] };
  }

  const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
  const userRole = user.role || 'employee';
  const roleDef = permsData.roles.find(r => r.id === userRole);
  const userGroups = permsData.groups.filter(g => (g.members || []).includes(user.id));

  // Start with role permissions
  const rp = roleDef?.permissions || {};
  const effective = {
    admin_sections: rp.admin_sections === '*' ? '*' : new Set(rp.admin_sections || []),
    boards: rp.boards === '*' ? '*' : new Set(rp.boards || []),
    kb_categories: rp.kb_categories === '*' ? '*' : new Set(rp.kb_categories || []),
    features: rp.features === '*' ? '*' : new Set(rp.features || [])
  };

  // Merge group permissions
  for (const g of userGroups) {
    const gp = g.permissions || {};
    if (effective.admin_sections !== '*') (gp.admin_sections || []).forEach(s => effective.admin_sections.add(s));
    if (effective.boards !== '*') (gp.boards || []).forEach(b => effective.boards.add(b));
    if (effective.kb_categories !== '*') (gp.kb_categories || []).forEach(c => effective.kb_categories.add(c));
    if (effective.features !== '*') (gp.features || []).forEach(f => effective.features.add(f));
  }

  return {
    user,
    role: userRole,
    isSuperAdmin: userRole === 'superadmin' || (user.isAdmin === true),
    permissions: {
      admin_sections: effective.admin_sections === '*' ? '*' : [...effective.admin_sections],
      boards: effective.boards === '*' ? '*' : [...effective.boards],
      kb_categories: effective.kb_categories === '*' ? '*' : [...effective.kb_categories],
      features: effective.features === '*' ? '*' : [...effective.features]
    },
    groups: userGroups.map(g => ({ id: g.id, name: g.name }))
  };
}

// Helper to check specific permission
function hasPermission(perms, category, id) {
  if (!perms) return false;
  const val = perms[category];
  if (val === '*') return true;
  if (Array.isArray(val)) return val.includes(id);
  return false;
}

/* ── In-app Notifications ── */

async function createNotification(userId, type, title, body, link) {
  if (!userId) return;
  const notifs = await readJson(FILES.notifications, []);
  notifs.push({
    id: randomUUID(),
    user_id: userId,
    type,
    title: clip(String(title), 200),
    body: clip(String(body), 500),
    link: link || '',
    read: false,
    created_at: new Date().toISOString()
  });
  // Keep max 500 notifications per user, trim oldest
  const userNotifs = notifs.filter(n => n.user_id === userId);
  if (userNotifs.length > 500) {
    const oldest = userNotifs.sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
    const idx = notifs.findIndex(n => n.id === oldest.id);
    if (idx !== -1) notifs.splice(idx, 1);
  }
  await writeJson(FILES.notifications, notifs);
}

async function notifyUsers(userIds, type, title, body, link) {
  for (const uid of userIds) {
    await createNotification(uid, type, title, body, link);
  }
}

/* ── Auth ── */

app.post('/api/auth/register', registerLimiter, async (req, res) => {
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const pin = getPin(req);

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
  const pin = getPin(req);
  if (!/^\d{4}$/.test(pin))
    return res.status(400).json({ message: 'Пин-код должен быть из 4 цифр.' });

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

  const adminRole = getUserRole(pin, user);
  const perms = await getUserPermissions(pin);
  return res.json({
    fullName: user.fullName, contact: user.contact,
    position: user.position || '', userId: user.id,
    avatar: user.avatar || '', admin: !!adminRole, adminRole: adminRole || null,
    workLocation: user.workLocation || '', workDesk: user.workDesk || '',
    tgChatId: user.tgChatId || '',
    permissions: perms?.permissions || null
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

/* ── Rooms & Links ── */

app.get('/api/rooms', async (_req, res) => {
  res.json(await readJson(FILES.rooms, []));
});

app.get('/api/links', async (_req, res) => {
  res.json(await readJson(FILES.links, []));
});

/* ── Profile ── */

app.get('/api/profile/:pin', async (req, res) => {
  const reqPin = String(req.get('x-auth-pin') || req.query.requester || '').trim();
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
  const pin = getPin(req);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const position = clip(String(req.body.position || '').trim(), 100);
  const workLocation = req.body.workLocation !== undefined ? clip(String(req.body.workLocation || '').trim(), 100) : undefined;
  const workDesk = req.body.workDesk !== undefined ? clip(String(req.body.workDesk || '').trim(), 10) : undefined;
  const tgChatId = req.body.tgChatId !== undefined ? clip(String(req.body.tgChatId || '').trim(), 20) : undefined;

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
    if (tgChatId !== undefined) u.tgChatId = tgChatId;

    await writeJson(FILES.users, users);
    invalidatePinCache(pin);
    return res.json({
      message: 'Профиль обновлён.', contact: u.contact,
      position: u.position || '',
      workLocation: u.workLocation || '', workDesk: u.workDesk || '',
      tgChatId: u.tgChatId || ''
    });
  });
});

app.post('/api/profile/avatar', async (req, res) => {
  // Auth before file upload to prevent temp file accumulation
  const pin = getPin(req);
  const userObj = pin ? await getUserByPin(pin) : null;
  if (!userObj) return res.status(401).json({ message: 'Неверный пин-код.' });

  avatarUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE')
        return res.status(400).json({ message: 'Файл слишком большой (макс. 2 МБ).' });
      return res.status(400).json({ message: 'Ошибка загрузки файла.' });
    }
    if (!req.file) return res.status(400).json({ message: 'Выберите изображение (JPG, PNG, WebP).' });

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

/* ── Notifications API ── */

app.get('/api/notifications', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const notifs = await readJson(FILES.notifications, []);
  const mine = notifs
    .filter(n => n.user_id === user.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 50);
  return res.json(mine);
});

app.get('/api/notifications/unread-count', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const notifs = await readJson(FILES.notifications, []);
  const count = notifs.filter(n => n.user_id === user.id && !n.read).length;
  return res.json({ count });
});

app.post('/api/notifications/read', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const { ids } = req.body;  // array of notification IDs, or 'all'
  return withLock(FILES.notifications, async () => {
    const notifs = await readJson(FILES.notifications, []);
    if (ids === 'all') {
      notifs.filter(n => n.user_id === user.id).forEach(n => { n.read = true; });
    } else if (Array.isArray(ids)) {
      for (const id of ids) {
        const n = notifs.find(n => n.id === id && n.user_id === user.id);
        if (n) n.read = true;
      }
    }
    await writeJson(FILES.notifications, notifs);
    return res.json({ message: 'OK' });
  });
});

/* ── Bookings ── */

app.get('/api/bookings/my-today', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });

  const today = new Date().toISOString().slice(0, 10);
  const bookings = await readJson(FILES.bookings, []);
  const rooms = await readJson(FILES.rooms, []);
  const roomMap = Object.fromEntries(rooms.map(r => [r.id, r.name]));

  const my = bookings
    .filter(b => b.date === today && (b.userId === user.id || b.fullName === user.fullName))
    .map(b => ({ ...b, roomName: roomMap[b.roomId] || b.roomId }))
    .sort((a, b) => a.startHour - b.startHour);

  return res.json(my);
});

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
  const pin = getPin(req);
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
      userId: user.id, fullName: user.fullName, contact: user.contact, topic,
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
  const pin = getPin(req);
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

/* ── Suggestions ── */

app.post('/api/suggestions', async (req, res) => {
  const pin = getPin(req);
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

/** Check access to admin section by unified permissions */
async function requireAdminSection(pin, sectionId) {
  const user = await getUserByPin(pin);
  if (!user) return null;
  if (isSuperAdmin(pin, user)) return user;
  const perms = await getUserPermissions(pin);
  if (perms && hasPermission(perms.permissions, 'admin_sections', sectionId)) return user;
  return null;
}

/** Check if user has a specific feature permission */
async function requireFeature(pin, featureId) {
  const user = await getUserByPin(pin);
  if (!user) return null;
  if (isSuperAdmin(pin, user)) return user;
  const perms = await getUserPermissions(pin);
  if (perms && hasPermission(perms.permissions, 'features', featureId)) return user;
  return null;
}

/** Check board access: 'all' = any authed user, 'admins' = admin+, 'superadmin' = superadmin only, or specific role id */
async function requireBoardAccess(pin, board) {
  const user = await getUserByPin(pin);
  if (!user) return null;
  if (isSuperAdmin(pin, user)) return user;

  // New: check unified permissions
  const perms = await getUserPermissions(pin);
  if (perms && hasPermission(perms.permissions, 'boards', board?.id)) return user;

  // Legacy fallback
  const access = board?.access || 'superadmin';
  if (access === 'all') return user;
  if (access === 'admins' && isAdmin(pin, user)) return user;
  if (access === 'superadmin') return null;
  const userRole = getUserRole(pin, user);
  if (access === userRole) return user;

  return null;
}

function paginate(items, page, pageSize) {
  const total = items.length;
  const p = Math.max(1, Number(page) || 1);
  const ps = Math.min(200, Math.max(1, Number(pageSize) || 50));
  const start = (p - 1) * ps;
  return { items: items.slice(start, start + ps), total, page: p, pageSize: ps };
}

// admin endpoints — access controlled via unified permissions
app.post('/api/admin/bookings', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'bookings'))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.bookings, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/tickets', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'tickets'))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.tickets, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/suggestions', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'suggestions'))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.suggestions, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/pin-requests', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'pin-requests'))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const all = (await readJson(FILES.pinRequests, [])).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(all, page, pageSize));
});

app.post('/api/admin/pin-request-resolve', async (req, res) => {
  const pin = getPin(req);
  const requestId = String(req.body.requestId || '').trim();
  if (!(await requireAdminSection(pin, 'pin-requests'))) return res.status(403).json({ message: 'Нет доступа.' });

  const requests = await readJson(FILES.pinRequests, []);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx === -1) return res.status(404).json({ message: 'Запрос не найден.' });

  requests.splice(idx, 1);
  await writeJson(FILES.pinRequests, requests);
  return res.json({ message: 'Запрос закрыт.' });
});

app.post('/api/admin/users', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'users'))) return res.status(403).json({ message: 'Нет доступа.' });
  const { page, pageSize } = req.body;
  const users = await readJson(FILES.users, []);
  const list = users.map((u) => {
    const role = getUserRole('', u); // no plain pin available, rely on user object fields
    return {
      id: u.id, fullName: u.fullName, contact: u.contact,
      position: u.position || '', avatar: !!u.avatar,
      isAdmin: isAdmin('', u), role: role || 'employee', createdAt: u.createdAt
    };
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json(paginate(list, page, pageSize));
});

app.post('/api/admin/update-user', async (req, res) => {
  const pin = getPin(req);
  const targetId = String(req.body.targetId || '').trim();
  const fullName = clip(String(req.body.fullName || '').trim(), 100);
  const contact = clip(String(req.body.contact || '').trim(), 200);
  const newPin = String(req.body.newPin || '').trim();

  const authUser = await requireAdminSection(pin, 'users');
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });
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
      invalidatePinCacheByUserId(targetId);
    }

    await writeJson(FILES.users, users);
    auditLog('update-user', authUser.fullName, { targetId, fields: Object.keys(req.body).filter(k => k !== 'pin') });
    return res.json({ message: 'Данные обновлены.' });
  });
});

app.post('/api/admin/set-role', async (req, res) => {
  const pin = getPin(req);
  const targetId = String(req.body.targetId || '').trim();
  const role = String(req.body.role || '').trim();

  if (!(await requireAdminSection(pin, 'users'))) return res.status(403).json({ message: 'Нет доступа.' });
  if (!targetId) return res.status(400).json({ message: 'Укажите id пользователя.' });

  // Validate role against permissions.json (single source of truth)
  const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
  const roleEntry = permsData.roles.find(r => r.id === role);
  if (!roleEntry) {
    // Fallback check in roles.json for backward compat
    const rolesFile = await readJson(FILES.roles, DEFAULT_ROLES);
    if (!rolesFile.some(r => r.id === role))
      return res.status(400).json({ message: `Неизвестная роль: ${role}.` });
  }

  const users = await readJson(FILES.users, []);
  const target = users.find((u) => u.id === targetId);
  if (!target) return res.status(404).json({ message: 'Пользователь не найден.' });

  if (role === 'employee' || role === 'viewer') {
    delete target.role;
    if (role === 'viewer') target.role = 'viewer';
    target.isAdmin = false;
  } else if (role === 'superadmin') {
    target.role = 'superadmin';
    target.isAdmin = true;
  } else {
    // Custom roles — determine isAdmin from role permissions
    target.role = role;
    const hasAdminSections = roleEntry && roleEntry.permissions &&
      (roleEntry.permissions.admin_sections === '*' ||
       (Array.isArray(roleEntry.permissions.admin_sections) && roleEntry.permissions.admin_sections.length > 0));
    target.isAdmin = !!hasAdminSections;
  }

  await writeJson(FILES.users, users);
  invalidatePinCacheByUserId(targetId);
  auditLog('set-role', 'admin', { targetId, targetName: target.fullName, role });
  return res.json({ id: targetId, role });
});

/* ── Roles management ── */

app.get('/api/roles', async (_req, res) => {
  // Read from permissions.json as the single source of truth for roles
  const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
  const roles = permsData.roles.map(r => ({ id: r.id, name: r.name, description: r.description, system: !!r.system }));
  // Fallback to roles.json if permissions has no roles
  if (!roles.length) {
    const fallback = await readJson(FILES.roles, DEFAULT_ROLES);
    return res.json(fallback);
  }
  res.json(roles);
});

app.post('/api/admin/roles', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const name = clip(String(req.body.name || '').trim(), 50);
  if (!name || name.length < 2) return res.status(400).json({ message: 'Название роли минимум 2 символа.' });
  const description = clip(String(req.body.description || '').trim(), 200);

  return withLock(FILES.roles, async () => {
    const roles = await readJson(FILES.roles, DEFAULT_ROLES);
    const id = name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '_').replace(/^_|_$/g, '') || 'role_' + Date.now().toString(36);
    if (roles.some(r => r.id === id)) return res.status(400).json({ message: 'Роль с таким ID уже существует.' });
    roles.push({ id, name, description, system: false });
    await writeJson(FILES.roles, roles);
    auditLog('create-role', 'admin', { id, name });
    return res.status(201).json({ message: 'Роль создана.', role: roles[roles.length - 1] });
  });
});

app.delete('/api/admin/roles/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  return withLock(FILES.roles, async () => {
    const roles = await readJson(FILES.roles, DEFAULT_ROLES);
    const idx = roles.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Роль не найдена.' });
    if (roles[idx].system) return res.status(400).json({ message: 'Системную роль нельзя удалить.' });

    // Check if any user has this role
    const users = await readJson(FILES.users, []);
    if (users.some(u => u.role === req.params.id)) return res.status(400).json({ message: 'Роль используется. Сначала измените роль у пользователей.' });

    const removed = roles.splice(idx, 1)[0];
    await writeJson(FILES.roles, roles);
    auditLog('delete-role', 'admin', { id: removed.id, name: removed.name });
    return res.json({ message: 'Роль удалена.' });
  });
});

/* ── Admin: CRM config management ── */

app.post('/api/admin/crm-config', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireAdminSection(pin, 'crm-config'))) return res.status(403).json({ message: 'Нет доступа.' });
  res.json(await getCrmConfig());
});

app.post('/api/admin/crm-config-add', async (req, res) => {
  const pin = getPin(req);
  const field = String(req.body.field || '').trim();
  const value = clip(String(req.body.value || '').trim(), 200);

  if (!(await requireAdminSection(pin, 'crm-config'))) return res.status(403).json({ message: 'Нет доступа.' });
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
  const pin = getPin(req);
  const field = String(req.body.field || '').trim();
  const value = String(req.body.value || '').trim();

  if (!(await requireAdminSection(pin, 'crm-config'))) return res.status(403).json({ message: 'Нет доступа.' });
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
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = isAdmin(pin, user);

  return withLock(FILES.bookings, async () => {
    const bookings = await readJson(FILES.bookings, []);
    const idx = bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Бронирование не найдено.' });

    if (!admin && bookings[idx].userId !== user.id && bookings[idx].fullName !== user.fullName)
      return res.status(403).json({ message: 'Можно отменить только свою бронь.' });

    bookings.splice(idx, 1);
    await writeJson(FILES.bookings, bookings);
    return res.json({ message: 'Бронирование отменено.' });
  });
});

app.patch('/api/bookings/:id', async (req, res) => {
  const pin = getPin(req);
  const cancelHour = toTime(req.body.cancelHour);

  const user = await getUserByPin(pin);
  if (!user) return res.status(401).json({ message: 'Неверный пин-код.' });
  const admin = isAdmin(pin, user);

  return withLock(FILES.bookings, async () => {
    const bookings = await readJson(FILES.bookings, []);
    const idx = bookings.findIndex((b) => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Бронирование не найдено.' });

    const booking = bookings[idx];

    if (!admin && booking.userId !== user.id && booking.fullName !== user.fullName)
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
        userId: booking.userId,
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

/* ── Boards (настраиваемые доски) ── */

function isValidHexColor(c) { return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(c); }

function slugify(str) {
  return str.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'board';
}

function getColumnSlug(name) {
  return name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '_').replace(/^_|_$/g, '').slice(0, 30) || 'col';
}

app.get('/api/boards', async (_req, res) => {
  const boards = await readJson(FILES.boards, []);
  res.json(boards);
});

app.post('/api/boards', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const name = clip(String(req.body.name || '').trim(), 100);
  if (!name || name.length < 2) return res.status(400).json({ message: 'Название доски минимум 2 символа.' });

  const code_prefix = clip(String(req.body.code_prefix || '').trim(), 10).toUpperCase() || 'BD';
  const description = clip(String(req.body.description || '').trim(), 500);

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    let slug = slugify(name);
    if (boards.some(b => b.slug === slug)) slug += '-' + Date.now().toString(36);

    const now = new Date().toISOString();
    const board = {
      id: randomUUID(),
      name,
      slug,
      code_prefix,
      description,
      columns: [
        { id: 'todo', name: 'К выполнению', color: '#edf2f7', order: 0, hidden: false },
        { id: 'in_progress', name: 'В работе', color: '#bee3f8', order: 1, hidden: false },
        { id: 'done', name: 'Готово', color: '#c6f6d5', order: 2, hidden: false }
      ],
      default_column: 'todo',
      systems: [],
      types: ['Задача'],
      card_fields: (() => {
        const def = { system: false, link_confluence: false, link_jira: false, phase_deadlines: false, completion_notes: false, approval: false };
        if (req.body.card_fields && typeof req.body.card_fields === 'object') {
          for (const k of Object.keys(def)) { if (req.body.card_fields[k] !== undefined) def[k] = !!req.body.card_fields[k]; }
        }
        return def;
      })(),
      access: ['all', 'admins', 'superadmin'].includes(req.body.access) ? req.body.access : 'superadmin',
      is_default: false,
      created_at: now,
      updated_at: now
    };
    boards.push(board);
    await writeJson(FILES.boards, boards);
    return res.status(201).json({ message: 'Доска создана.', board });
  });
});

app.put('/api/boards/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    if (req.body.name !== undefined) board.name = clip(String(req.body.name).trim(), 100);
    if (req.body.description !== undefined) board.description = clip(String(req.body.description).trim(), 500);
    if (req.body.code_prefix !== undefined) board.code_prefix = clip(String(req.body.code_prefix).trim(), 10).toUpperCase();
    if (req.body.default_column !== undefined) {
      const colExists = board.columns.some(c => c.id === req.body.default_column);
      if (colExists) board.default_column = req.body.default_column;
    }
    if (Array.isArray(req.body.systems)) board.systems = req.body.systems.map(s => String(s).trim()).filter(Boolean);
    if (Array.isArray(req.body.types)) board.types = req.body.types.map(s => String(s).trim()).filter(Boolean);
    if (req.body.card_fields && typeof req.body.card_fields === 'object') {
      const validKeys = ['system', 'link_confluence', 'link_jira', 'phase_deadlines', 'completion_notes', 'approval'];
      const cf = board.card_fields || {};
      for (const k of validKeys) {
        if (req.body.card_fields[k] !== undefined) cf[k] = !!req.body.card_fields[k];
      }
      board.card_fields = cf;
    }
    if (req.body.access !== undefined) {
      const validAccess = ['all', 'admins', 'superadmin'];
      if (validAccess.includes(req.body.access)) board.access = req.body.access;
    }
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.json({ message: 'Доска обновлена.', board });
  });
});

app.delete('/api/boards/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  return withLock(FILES.tz, async () => withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const idx = boards.findIndex(b => b.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Доска не найдена.' });
    if (boards[idx].is_default) return res.status(400).json({ message: 'Нельзя удалить доску по умолчанию.' });

    const allTz = await readJson(FILES.tz, []);
    const hasCards = allTz.some(t => t.board_id === req.params.id);
    if (hasCards) return res.status(400).json({ message: 'Нельзя удалить доску с карточками. Сначала переместите или удалите карточки.' });

    const boardName = boards[idx].name;
    boards.splice(idx, 1);
    await writeJson(FILES.boards, boards);
    auditLog('delete-board', 'admin', { boardId: req.params.id, boardName });
    return res.json({ message: 'Доска удалена.' });
  }));
});

/* ── Board columns ── */

app.post('/api/boards/:id/columns', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const name = clip(String(req.body.name || '').trim(), 60);
  if (!name) return res.status(400).json({ message: 'Укажите название колонки.' });
  const color = String(req.body.color || '#edf2f7').trim();
  if (!isValidHexColor(color)) return res.status(400).json({ message: 'Цвет должен быть в формате #RGB или #RRGGBB.' });

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    let colId = getColumnSlug(name);
    if (board.columns.some(c => c.id === colId)) colId += '_' + Date.now().toString(36);

    const wipLimit = parseInt(req.body.wip_limit, 10);
    const maxOrder = board.columns.reduce((m, c) => Math.max(m, c.order), -1);
    const col = { id: colId, name, color, order: maxOrder + 1, hidden: false, wip_limit: wipLimit > 0 ? wipLimit : 0 };
    board.columns.push(col);
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.status(201).json({ message: 'Колонка добавлена.', column: col, board });
  });
});

app.put('/api/boards/:id/columns/:colId', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    const col = board.columns.find(c => c.id === req.params.colId);
    if (!col) return res.status(404).json({ message: 'Колонка не найдена.' });

    if (req.body.name !== undefined) col.name = clip(String(req.body.name).trim(), 60);
    if (req.body.color !== undefined) {
      const c = String(req.body.color).trim();
      if (!isValidHexColor(c)) return res.status(400).json({ message: 'Цвет должен быть в формате #RGB или #RRGGBB.' });
      col.color = c;
    }
    if (req.body.wip_limit !== undefined) {
      const wl = parseInt(req.body.wip_limit, 10);
      col.wip_limit = wl > 0 ? wl : 0;
    }
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.json({ message: 'Колонка обновлена.', column: col, board });
  });
});

app.patch('/api/boards/:id/columns/reorder', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const order = req.body.order; // [{id, order}]
  if (!Array.isArray(order)) return res.status(400).json({ message: 'Ожидается массив order.' });

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    for (const item of order) {
      const col = board.columns.find(c => c.id === item.id);
      if (col) col.order = Number(item.order) || 0;
    }
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.json({ message: 'Порядок колонок обновлён.', board });
  });
});

app.patch('/api/boards/:id/columns/:colId/hide', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  return withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    const col = board.columns.find(c => c.id === req.params.colId);
    if (!col) return res.status(404).json({ message: 'Колонка не найдена.' });

    col.hidden = !col.hidden;
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.json({ message: col.hidden ? 'Колонка скрыта.' : 'Колонка показана.', column: col, board });
  });
});

app.delete('/api/boards/:id/columns/:colId', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const targetColId = String(req.body.target_column || '').trim();

  return withLock(FILES.tz, async () => withLock(FILES.boards, async () => {
    const boards = await readJson(FILES.boards, []);
    const board = boards.find(b => b.id === req.params.id);
    if (!board) return res.status(404).json({ message: 'Доска не найдена.' });

    const colIdx = board.columns.findIndex(c => c.id === req.params.colId);
    if (colIdx === -1) return res.status(404).json({ message: 'Колонка не найдена.' });

    if (board.columns.length <= 1) return res.status(400).json({ message: 'Нельзя удалить последнюю колонку.' });

    const allTz = await readJson(FILES.tz, []);
    const cardsInCol = allTz.filter(t => t.board_id === board.id && t.status === req.params.colId);

    if (cardsInCol.length > 0) {
      if (!targetColId) {
        return res.status(400).json({ message: `В колонке ${cardsInCol.length} карточек. Укажите target_column для переноса.` });
      }
      const targetExists = board.columns.some(c => c.id === targetColId && c.id !== req.params.colId);
      if (!targetExists) {
        return res.status(400).json({ message: 'target_column не найдена или это удаляемая колонка.' });
      }
      for (const tz of cardsInCol) tz.status = targetColId;
      await writeJson(FILES.tz, allTz);
    }

    board.columns.splice(colIdx, 1);
    if (board.default_column === req.params.colId) {
      board.default_column = board.columns[0].id;
    }
    board.updated_at = new Date().toISOString();

    await writeJson(FILES.boards, boards);
    return res.json({ message: 'Колонка удалена.', board });
  }));
});

/* ── Access / Permission Management (superadmin) ── */

app.get('/api/admin/access', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
  const boards = await readJson(FILES.boards, []);
  const kbCategories = await readJson(KB_FILES?.categories || path.join(dataDir, 'kb-categories.json'), []);
  const users = await readJson(FILES.users, []);

  // Enrich groups with member names
  const enrichedGroups = (permsData.groups || []).map(g => ({
    ...g,
    memberNames: (g.members || []).map(mid => {
      const u = users.find(u => u.id === mid);
      return u ? { id: u.id, fullName: u.fullName } : { id: mid, fullName: '?' };
    })
  }));

  // Available admin sections and features for permission checkboxes
  const adminSections = [
    { id: 'bookings', label: 'Бронирования' },
    { id: 'tickets', label: 'CRM-заявки' },
    { id: 'suggestions', label: 'Идеи' },
    { id: 'users', label: 'Пользователи' },
    { id: 'pin-requests', label: 'Пин-коды' },
    { id: 'crm-config', label: 'CRM-конфиг' },
    { id: 'roles-access', label: 'Роли и доступ' }
  ];
  const features = [
    { id: 'tz_create_all', label: 'Создание всех типов ТЗ' },
    { id: 'tz_edit_all', label: 'Редактирование любых ТЗ' },
    { id: 'tz_bulk', label: 'Массовые операции с ТЗ' },
    { id: 'tz_export', label: 'Экспорт ТЗ в Excel' },
    { id: 'tz_import', label: 'Импорт ТЗ из Excel' },
    { id: 'kb_manage_categories', label: 'Управление категориями базы знаний' },
    { id: 'kb_create_articles', label: 'Создание статей в базе знаний' }
  ];

  return res.json({
    roles: permsData.roles || [],
    groups: enrichedGroups,
    boards: boards.map(b => ({ id: b.id, name: b.name })),
    kb_categories: kbCategories.map(c => ({ id: c.id, name: c.name })),
    users: users.map(u => ({ id: u.id, fullName: u.fullName, role: u.role || 'employee' })),
    adminSections,
    features
  });
});

app.post('/api/admin/access/roles', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const { name, description, permissions } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ message: 'Название роли обязательно.' });
  }

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    const id = name.trim().toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '_').replace(/^_|_$/g, '') || randomUUID();

    if (permsData.roles.some(r => r.id === id)) {
      return res.status(400).json({ message: 'Роль с таким ID уже существует.' });
    }

    const newRole = {
      id,
      name: name.trim(),
      description: (description || '').trim(),
      system: false,
      permissions: permissions || { admin_sections: [], boards: [], kb_categories: [], features: [] }
    };
    permsData.roles.push(newRole);
    await writeJson(FILES.permissions, permsData);

    // Sync to roles.json
    const rolesFile = await readJson(FILES.roles, DEFAULT_ROLES);
    if (!rolesFile.some(r => r.id === id)) {
      rolesFile.push({ id, name: name.trim(), description: (description || '').trim(), system: false });
      await writeJson(FILES.roles, rolesFile);
    }

    return res.status(201).json(newRole);
  });
});

app.put('/api/admin/access/roles/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const roleId = req.params.id;
  const { name, description, permissions } = req.body;

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    const role = permsData.roles.find(r => r.id === roleId);
    if (!role) return res.status(404).json({ message: 'Роль не найдена.' });

    if (name !== undefined) role.name = String(name).trim();
    if (description !== undefined) role.description = String(description).trim();
    if (permissions !== undefined) role.permissions = permissions;

    await writeJson(FILES.permissions, permsData);

    // Sync to roles.json
    const rolesFile = await readJson(FILES.roles, DEFAULT_ROLES);
    const rf = rolesFile.find(r => r.id === roleId);
    if (rf) {
      if (name !== undefined) rf.name = String(name).trim();
      if (description !== undefined) rf.description = String(description).trim();
      await writeJson(FILES.roles, rolesFile);
    }

    return res.json(role);
  });
});

app.delete('/api/admin/access/roles/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const roleId = req.params.id;

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    const role = permsData.roles.find(r => r.id === roleId);
    if (!role) return res.status(404).json({ message: 'Роль не найдена.' });
    if (role.system) return res.status(400).json({ message: 'Нельзя удалить системную роль.' });

    permsData.roles = permsData.roles.filter(r => r.id !== roleId);
    await writeJson(FILES.permissions, permsData);

    // Sync to roles.json
    const rolesFile = await readJson(FILES.roles, DEFAULT_ROLES);
    const ridx = rolesFile.findIndex(r => r.id === roleId);
    if (ridx !== -1) {
      rolesFile.splice(ridx, 1);
      await writeJson(FILES.roles, rolesFile);
    }

    return res.json({ message: 'Роль удалена.' });
  });
});

app.post('/api/admin/access/groups', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const { name, description, members, permissions } = req.body;
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return res.status(400).json({ message: 'Название группы обязательно.' });
  }

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    const newGroup = {
      id: randomUUID(),
      name: name.trim(),
      description: (description || '').trim(),
      members: Array.isArray(members) ? members : [],
      permissions: permissions || { admin_sections: [], boards: [], kb_categories: [], features: [] }
    };
    if (!permsData.groups) permsData.groups = [];
    permsData.groups.push(newGroup);
    await writeJson(FILES.permissions, permsData);
    return res.status(201).json(newGroup);
  });
});

app.put('/api/admin/access/groups/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const groupId = req.params.id;
  const { name, description, members, permissions } = req.body;

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    if (!permsData.groups) permsData.groups = [];
    const group = permsData.groups.find(g => g.id === groupId);
    if (!group) return res.status(404).json({ message: 'Группа не найдена.' });

    if (name !== undefined) group.name = String(name).trim();
    if (description !== undefined) group.description = String(description).trim();
    if (members !== undefined) group.members = Array.isArray(members) ? members : group.members;
    if (permissions !== undefined) group.permissions = permissions;

    await writeJson(FILES.permissions, permsData);
    return res.json(group);
  });
});

app.delete('/api/admin/access/groups/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const groupId = req.params.id;

  return await withLock(FILES.permissions, async () => {
    const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
    if (!permsData.groups) permsData.groups = [];
    permsData.groups = permsData.groups.filter(g => g.id !== groupId);
    await writeJson(FILES.permissions, permsData);
    return res.json({ message: 'Группа удалена.' });
  });
});

app.put('/api/admin/access/user-role', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const { userId, roleId } = req.body;
  if (!userId || !roleId) {
    return res.status(400).json({ message: 'userId и roleId обязательны.' });
  }

  // Validate role exists
  const permsData = await readJson(FILES.permissions, { roles: [], groups: [] });
  if (!permsData.roles.some(r => r.id === roleId)) {
    return res.status(400).json({ message: 'Указанная роль не существует.' });
  }

  return await withLock(FILES.users, async () => {
    const users = await readJson(FILES.users, []);
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден.' });

    user.role = roleId;
    // Determine isAdmin from role permissions
    if (roleId === 'superadmin') {
      user.isAdmin = true;
    } else if (roleId === 'employee' || roleId === 'viewer') {
      user.isAdmin = false;
      if (roleId === 'employee') delete user.role;
    } else {
      // Custom roles — isAdmin based on whether role has admin_sections
      const roleEntry = permsData.roles.find(r => r.id === roleId);
      const hasAdminSections = roleEntry && roleEntry.permissions &&
        (roleEntry.permissions.admin_sections === '*' ||
         (Array.isArray(roleEntry.permissions.admin_sections) && roleEntry.permissions.admin_sections.length > 0));
      user.isAdmin = !!hasAdminSections;
    }

    await writeJson(FILES.users, users);
    // Invalidate pin cache for this user
    for (const [k, v] of _pinCache.entries()) {
      if (v.user && v.user.id === userId) _pinCache.delete(k);
    }
    return res.json({ message: 'Роль обновлена.', userId, roleId });
  });
});

/* ── My Tasks (Мои задачи) ── */

const TASK_STATUSES = ['todo', 'in_progress', 'done', 'cancelled'];
const TASK_TYPES = ['task', 'bug', 'proposal'];

// proposals endpoint must be registered BEFORE :id routes
app.get('/api/tasks/proposals', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user || !isSuperAdmin(pin, user)) return res.status(403).json({ message: 'Нет доступа.' });

  const tasks = await readJson(FILES.tasks, []);
  const users = await readJson(FILES.users, []);
  const proposals = tasks
    .filter(t => t.type === 'proposal')
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(t => ({
      ...t,
      creator_name: users.find(u => u.id === t.creator_id)?.fullName || '?'
    }));
  return res.json(proposals);
});

app.get('/api/tasks', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const tasks = await readJson(FILES.tasks, []);
  const users = await readJson(FILES.users, []);

  // User sees: tasks they created OR tasks assigned to them
  const mine = tasks
    .filter(t => t.creator_id === user.id || t.assignee_id === user.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Resolve names
  const resolved = mine.map(t => ({
    ...t,
    creator_name: users.find(u => u.id === t.creator_id)?.fullName || '?',
    assignee_name: users.find(u => u.id === t.assignee_id)?.fullName || '?'
  }));

  return res.json(resolved);
});

app.post('/api/tasks', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const title = clip(String(req.body.title || '').trim(), 200);
  if (title.length < 3) return res.status(400).json({ message: 'Название минимум 3 символа.' });

  const type = TASK_TYPES.includes(req.body.type) ? req.body.type : 'task';
  const priority = ['low', 'medium', 'high'].includes(req.body.priority) ? req.body.priority : 'medium';
  const assigneeId = String(req.body.assignee_id || '').trim() || user.id;

  // Validate assignee exists
  const users = await readJson(FILES.users, []);
  if (!users.some(u => u.id === assigneeId)) {
    return res.status(400).json({ message: 'Исполнитель не найден.' });
  }

  return withLock(FILES.tasks, async () => {
    const tasks = await readJson(FILES.tasks, []);
    const task = {
      id: randomUUID(),
      title,
      description: clip(String(req.body.description || '').trim(), 5000),
      status: 'todo',
      priority,
      creator_id: user.id,
      assignee_id: assigneeId,
      due_date: req.body.due_date || '',
      tags: Array.isArray(req.body.tags) ? req.body.tags.map(t => clip(String(t).trim(), 50)).filter(Boolean).slice(0, 10) : [],
      type,
      proposal_status: type === 'proposal' ? 'pending' : null,
      proposal_reviewed_by: null,
      proposal_reviewed_at: null,
      tz_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    tasks.push(task);
    await writeJson(FILES.tasks, tasks);

    // Notify assignee if different from creator
    if (assigneeId !== user.id) {
      await createNotification(assigneeId, 'task_assigned', 'Вам назначена задача', task.title, `#tasks/${task.id}`);
    }

    return res.status(201).json({ message: 'Задача создана.', task });
  });
});

app.put('/api/tasks/:id', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);

  return withLock(FILES.tasks, async () => {
    const tasks = await readJson(FILES.tasks, []);
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ message: 'Задача не найдена.' });

    // Only creator, assignee, or superadmin can edit
    if (task.creator_id !== user.id && task.assignee_id !== user.id && !sa) {
      return res.status(403).json({ message: 'Нет прав на редактирование.' });
    }

    if (req.body.title !== undefined) task.title = clip(String(req.body.title).trim(), 200);
    if (req.body.description !== undefined) task.description = clip(String(req.body.description).trim(), 5000);
    if (req.body.status !== undefined && TASK_STATUSES.includes(req.body.status)) {
      const oldStatus = task.status;
      task.status = req.body.status;
      // Notify assignee about status change
      if (oldStatus !== task.status && task.assignee_id !== user.id) {
        await createNotification(task.assignee_id, 'task_assigned', 'Статус задачи изменён', `${task.title}: ${oldStatus} → ${task.status}`, `#tasks/${task.id}`);
      }
    }
    if (req.body.priority !== undefined && ['low', 'medium', 'high'].includes(req.body.priority)) task.priority = req.body.priority;
    if (req.body.due_date !== undefined) task.due_date = String(req.body.due_date || '');
    if (req.body.tags !== undefined) task.tags = Array.isArray(req.body.tags) ? req.body.tags.map(t => clip(String(t).trim(), 50)).filter(Boolean).slice(0, 10) : task.tags;
    if (req.body.assignee_id !== undefined) {
      const oldAssignee = task.assignee_id;
      task.assignee_id = String(req.body.assignee_id).trim();
      if (task.assignee_id !== oldAssignee && task.assignee_id !== user.id) {
        await createNotification(task.assignee_id, 'task_assigned', 'Вам назначена задача', task.title, `#tasks/${task.id}`);
      }
    }

    task.updated_at = new Date().toISOString();
    await writeJson(FILES.tasks, tasks);
    return res.json({ message: 'Задача обновлена.', task });
  });
});

app.delete('/api/tasks/:id', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);

  return withLock(FILES.tasks, async () => {
    const tasks = await readJson(FILES.tasks, []);
    const idx = tasks.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Задача не найдена.' });

    const task = tasks[idx];
    if (task.creator_id !== user.id && !sa) {
      return res.status(403).json({ message: 'Удалить может только автор или суперадмин.' });
    }

    tasks.splice(idx, 1);
    await writeJson(FILES.tasks, tasks);
    return res.json({ message: 'Задача удалена.' });
  });
});

// Proposal review (superadmin only)
app.patch('/api/tasks/:id/review', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user || !isSuperAdmin(pin, user)) return res.status(403).json({ message: 'Нет доступа.' });

  const { decision } = req.body; // 'approved' | 'rejected'
  if (!['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({ message: 'Укажите decision: approved или rejected.' });
  }

  return withLock(FILES.tasks, async () => {
    const tasks = await readJson(FILES.tasks, []);
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ message: 'Задача не найдена.' });
    if (task.type !== 'proposal') return res.status(400).json({ message: 'Это не предложение.' });

    task.proposal_status = decision;
    task.proposal_reviewed_by = user.id;
    task.proposal_reviewed_at = new Date().toISOString();
    task.updated_at = new Date().toISOString();

    await writeJson(FILES.tasks, tasks);

    // Notify creator
    const statusText = decision === 'approved' ? 'одобрено' : 'отклонено';
    await createNotification(task.creator_id, 'system', `Предложение ${statusText}`, task.title, `#tasks/${task.id}`);

    return res.json({ message: `Предложение ${statusText}.`, task });
  });
});

/* ── TZ (Технические задания) ── */

app.get('/api/tz-config', async (_req, res) => {
  const users = await readJson(FILES.users, []);
  const boards = await readJson(FILES.boards, []);
  const usersList = users.map(u => ({ id: u.id, fullName: u.fullName }));
  res.json({
    systems: TZ_SYSTEMS,
    types: TZ_TYPES,
    userTypes: TZ_USER_TYPES,
    statuses: TZ_STATUSES,
    priorities: TZ_PRIORITIES,
    statusLabels: TZ_STATUS_LABELS,
    transitions: TZ_TRANSITIONS,
    users: usersList,
    boards
  });
});

app.get('/api/tz-tags', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const allTz = await readJson(FILES.tz, []);
  const tags = [...new Set(allTz.flatMap(t => t.tags || []))].sort();
  return res.json(tags);
});

app.post('/api/tz', async (req, res) => {
  const pin = getPin(req);
  const type = String(req.body.type || '').trim();
  const isUserType = TZ_USER_TYPES.includes(type);

  // User types can be created by any authenticated user; classic types require superadmin
  let authUser;
  if (isUserType) {
    authUser = await getUserByPin(pin);
    if (!authUser) return res.status(403).json({ message: 'Требуется авторизация.' });
  } else {
    authUser = await requireSuperAdmin(pin);
    if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });
  }

  const title = clip(String(req.body.title || '').trim(), 300);
  const system = String(req.body.system || '').trim();
  const priority = String(req.body.priority || '').trim();
  const description = clip(String(req.body.description || '').trim(), 5000);
  const owner = clip(String(req.body.owner || '').trim(), 100);
  let link_confluence = clip(String(req.body.link_confluence || '').trim(), 500);
  let link_jira = clip(String(req.body.link_jira || '').trim(), 500);
  if (link_confluence && !/^https?:\/\//i.test(link_confluence)) link_confluence = '';
  if (link_jira && !/^https?:\/\//i.test(link_jira)) link_jira = '';
  const completion_notes = clip(String(req.body.completion_notes || '').trim(), 5000);
  const date_analysis_deadline = String(req.body.date_analysis_deadline || '').trim();
  const date_dev_deadline = String(req.body.date_dev_deadline || '').trim();
  const date_release_deadline = String(req.body.date_release_deadline || '').trim();
  const reqStatus = String(req.body.status || '').trim();
  const assignee_id = String(req.body.assignee_id || '').trim() || null;
  const deadline = String(req.body.deadline || '').trim() || null;
  const boardId = String(req.body.board_id || '').trim();

  // Resolve board
  const boards = await readJson(FILES.boards, []);
  let board;
  if (boardId) {
    board = boards.find(b => b.id === boardId);
    if (!board) return res.status(400).json({ message: 'Указанная доска не найдена.' });
  } else {
    board = boards.find(b => b.is_default);
    if (!board) return res.status(400).json({ message: 'Доска по умолчанию не найдена.' });
  }

  if (!title || title.length < 3) return res.status(400).json({ message: 'Название ТЗ минимум 3 символа.' });
  if (!isUserType && !TZ_SYSTEMS.includes(system)) return res.status(400).json({ message: 'Выберите систему.' });
  if (!TZ_TYPES.includes(type)) return res.status(400).json({ message: 'Выберите тип.' });
  if (!TZ_PRIORITIES.includes(priority)) return res.status(400).json({ message: 'Выберите приоритет.' });
  if (date_analysis_deadline && !isValidDate(date_analysis_deadline)) return res.status(400).json({ message: 'Дата анализа: YYYY-MM-DD.' });
  if (date_dev_deadline && !isValidDate(date_dev_deadline)) return res.status(400).json({ message: 'Дата разработки: YYYY-MM-DD.' });
  if (date_release_deadline && !isValidDate(date_release_deadline)) return res.status(400).json({ message: 'Дата релиза: YYYY-MM-DD.' });
  if (deadline && !isValidDate(deadline)) return res.status(400).json({ message: 'Дедлайн: YYYY-MM-DD.' });
  if (assignee_id && !UUID_RE.test(assignee_id)) return res.status(400).json({ message: 'Некорректный ID исполнителя.' });

  // Валидация статуса при создании: validate against board columns
  const boardColIds = board.columns.map(c => c.id);
  let initialStatus = board.default_column || boardColIds[0] || 'draft';
  if (reqStatus && reqStatus !== initialStatus) {
    if (!boardColIds.includes(reqStatus)) {
      return res.status(400).json({ message: `Статус «${reqStatus}» не существует на этой доске.` });
    }
    initialStatus = reqStatus;
  }

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);

    // Проверка на дубль названия
    const duplicate = allTz.find((t) => t.title.toLowerCase() === title.toLowerCase());
    if (duplicate) return res.status(400).json({ message: `ТЗ с таким названием уже существует: ${duplicate.tz_code}.` });

    const tzCode = generateTzCode(allTz, system || 'OTHER', board.code_prefix || 'TZ');
    const creatorName = authUser.fullName || pin;

    const tz = {
      id: randomUUID(),
      board_id: board.id,
      tz_code: tzCode,
      title,
      system: system || (isUserType ? 'OTHER' : system),
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
      assignee_id: assignee_id || null,
      assigned_by_id: assignee_id ? authUser.id : null,
      deadline: deadline || null,
      linked_tz_ids: [],
      tags: Array.isArray(req.body.tags) ? req.body.tags.map(t => clip(String(t).trim(), 50)).filter(Boolean).slice(0, 20) : [],
      estimate: ['XS','S','M','L','XL'].includes(req.body.estimate) ? req.body.estimate : '',
      created_by: creatorName,
      created_by_id: authUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // For Предложение, start as draft (awaiting approval)
    if (type === 'Предложение') {
      tz.approved = false;
      tz.approved_by = null;
      tz.approved_at = null;
    }

    allTz.push(tz);
    await writeJson(FILES.tz, allTz);

    return res.status(201).json({ message: `${type} ${tzCode} создано.`, tz });
  });
});

app.put('/api/tz/:id', async (req, res) => {
  const pin = getPin(req);
  const id = req.params.id;

  // Read TZ first to check type
  const allTzPre = await readJson(FILES.tz, []);
  const tzPre = allTzPre.find((t) => t.id === id);
  if (!tzPre) return res.status(404).json({ message: 'ТЗ не найдено.' });

  const isUserType = TZ_USER_TYPES.includes(tzPre.type);
  let authUser;
  if (isUserType) {
    authUser = await getUserByPin(pin);
    if (!authUser) return res.status(403).json({ message: 'Требуется авторизация.' });
    // Non-superadmin can only edit their own items or items assigned to them
    const isSA = isSuperAdmin(pin, authUser);
    if (!isSA && tzPre.created_by_id !== authUser.id && tzPre.assignee_id !== authUser.id) {
      return res.status(403).json({ message: 'Вы можете редактировать только свои записи.' });
    }
  } else {
    authUser = await requireSuperAdmin(pin);
    if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });
  }

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    const changedBy = authUser.fullName || pin;

    const editableFields = [
      'title', 'system', 'type', 'priority', 'status',
      'description', 'owner', 'link_confluence', 'link_jira', 'completion_notes',
      'date_analysis_deadline', 'date_dev_deadline', 'date_release_deadline',
      'assignee_id', 'deadline', 'linked_tz_ids', 'tags', 'estimate'
    ];

    // Status transition check — validate against board columns
    if (req.body.status !== undefined && req.body.status !== tz.status) {
      const newStatus = String(req.body.status).trim();
      const boards = await readJson(FILES.boards, []);
      const tzBoard = tz.board_id ? boards.find(b => b.id === tz.board_id) : null;
      const validStatuses = tzBoard ? tzBoard.columns.map(c => c.id) : TZ_STATUSES;
      if (!validStatuses.includes(newStatus)) return res.status(400).json({ message: 'Неизвестный статус.' });
      const statusLabelsLocal = tzBoard ? Object.fromEntries(tzBoard.columns.map(c => [c.id, c.name])) : TZ_STATUS_LABELS;
      // Free-form transitions within board columns
      if (!validStatuses.includes(tz.status) || !validStatuses.includes(newStatus)) {
        return res.status(400).json({ message: `Переход из «${statusLabelsLocal[tz.status] || tz.status}» в «${statusLabelsLocal[newStatus] || newStatus}» не допускается.` });
      }
    }

    // Validation
    if (req.body.title !== undefined) {
      const t = clip(String(req.body.title).trim(), 300);
      if (t.length < 3) return res.status(400).json({ message: 'Название ТЗ минимум 3 символа.' });
      const duplicate = allTz.find((x) => x.id !== id && x.title.toLowerCase() === t.toLowerCase());
      if (duplicate) return res.status(400).json({ message: `ТЗ с таким названием уже существует: ${duplicate.tz_code}.` });
    }
    if (req.body.system !== undefined && !isUserType && !TZ_SYSTEMS.includes(req.body.system))
      return res.status(400).json({ message: 'Выберите систему.' });
    if (req.body.type !== undefined && !TZ_TYPES.includes(req.body.type))
      return res.status(400).json({ message: 'Выберите тип.' });
    if (req.body.priority !== undefined && !TZ_PRIORITIES.includes(req.body.priority))
      return res.status(400).json({ message: 'Выберите приоритет.' });

    const warnings = [];
    for (const field of editableFields) {
      if (req.body[field] === undefined) continue;
      let newVal = typeof req.body[field] === 'string' ? req.body[field].trim() : req.body[field];
      if (field === 'title') newVal = clip(newVal, 300);
      if (field === 'description') newVal = clip(newVal, 5000);
      if (field === 'owner') newVal = clip(newVal, 100);
      if (field === 'link_confluence') { newVal = clip(newVal, 500); if (newVal && !/^https?:\/\//i.test(newVal)) { warnings.push(`link_confluence: невалидный URL`); continue; } }
      if (field === 'link_jira') { newVal = clip(newVal, 500); if (newVal && !/^https?:\/\//i.test(newVal)) { warnings.push(`link_jira: невалидный URL`); continue; } }
      if (field === 'completion_notes') newVal = clip(newVal, 5000);
      if (['date_analysis_deadline', 'date_dev_deadline', 'date_release_deadline', 'deadline'].includes(field)) {
        if (newVal && !isValidDate(newVal)) { warnings.push(`${field}: невалидная дата`); continue; }
        newVal = newVal || null;
      }
      if (field === 'assignee_id') {
        newVal = newVal || null;
        if (newVal && !UUID_RE.test(newVal)) { warnings.push(`assignee_id: невалидный UUID`); continue; }
        // Track who assigned
        if (newVal && newVal !== (tz.assignee_id || null)) {
          tz.assigned_by_id = authUser.id;
        }
      }
      if (field === 'linked_tz_ids') {
        if (!Array.isArray(newVal)) continue;
        newVal = newVal.filter((lid) => UUID_RE.test(lid) && lid !== id).slice(0, 20);
        const oldLinks = tz.linked_tz_ids || [];
        const added = newVal.filter((l) => !oldLinks.includes(l));
        const removed = oldLinks.filter((l) => !newVal.includes(l));
        tz.linked_tz_ids = newVal;
        // Bidirectional: sync linked_tz_ids on counterpart TZ records
        for (const lid of added) {
          const other = allTz.find((t) => t.id === lid);
          if (other) {
            const otherLinks = other.linked_tz_ids || [];
            if (!otherLinks.includes(id)) {
              other.linked_tz_ids = [...otherLinks, id];
              await recordTzHistory(lid, 'linked_tz_ids', '', tz.tz_code || id, changedBy);
            }
          }
        }
        for (const lid of removed) {
          const other = allTz.find((t) => t.id === lid);
          if (other && other.linked_tz_ids) {
            other.linked_tz_ids = other.linked_tz_ids.filter((l) => l !== id);
            await recordTzHistory(lid, 'linked_tz_ids', tz.tz_code || id, '', changedBy);
          }
        }
        // Record history on this TZ too
        if (added.length || removed.length) {
          const addedCodes = added.map((l) => { const t = allTz.find((x) => x.id === l); return t ? t.tz_code : l.slice(0, 8); });
          const removedCodes = removed.map((l) => { const t = allTz.find((x) => x.id === l); return t ? t.tz_code : l.slice(0, 8); });
          const desc = [
            ...(addedCodes.length ? [`+${addedCodes.join(', ')}`] : []),
            ...(removedCodes.length ? [`-${removedCodes.join(', ')}`] : [])
          ].join('; ');
          await recordTzHistory(tz.id, 'linked_tz_ids', '', desc, changedBy);
        }
        continue;
      }

      if (field === 'tags') {
        const newTags = Array.isArray(req.body.tags) ? req.body.tags.map(t => clip(String(t).trim(), 50)).filter(Boolean).slice(0, 20) : tz.tags;
        const oldTags = tz.tags || [];
        if (JSON.stringify(oldTags) !== JSON.stringify(newTags)) {
          await recordTzHistory(tz.id, 'tags', oldTags.join(', '), newTags.join(', '), changedBy);
          tz.tags = newTags;
        }
        continue;
      }

      if (field === 'estimate') {
        const newEstimate = ['XS','S','M','L','XL'].includes(req.body.estimate) ? req.body.estimate : '';
        const oldEstimate = tz.estimate || '';
        if (oldEstimate !== newEstimate) {
          await recordTzHistory(tz.id, 'estimate', oldEstimate, newEstimate, changedBy);
          tz.estimate = newEstimate;
        }
        continue;
      }

      const oldVal = tz[field] ?? null;
      if (String(oldVal ?? '') !== String(newVal ?? '')) {
        await recordTzHistory(tz.id, field, oldVal, newVal, changedBy);
        tz[field] = newVal;
      }
    }

    tz.updated_at = new Date().toISOString();
    await writeJson(FILES.tz, allTz);

    // Notify assignee about assignment
    if (req.body.assignee_id !== undefined && tz.assignee_id && tz.assignee_id !== authUser?.id) {
      await createNotification(tz.assignee_id, 'tz_assigned', 'Вам назначено ТЗ', `${tz.tz_code}: ${tz.title}`, `#tz/view/${tz.id}`);
    }

    const resp = { message: 'ТЗ обновлено.', tz };
    if (warnings.length) resp.warnings = warnings;
    return res.json(resp);
  });
});

function filterTz(allTz, body, usersMap, boards) {
  const fBoardId = String(body.board_id || '').trim();
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
  const fAssignee = String(body.assignee_id || '').trim();
  const fTag = String(body.tag || '').trim();

  // Phase 1: cheap filters on raw data (before computeTzFlags)
  let items = allTz;
  if (fBoardId) items = items.filter((t) => t.board_id === fBoardId);
  if (fSystem) items = items.filter((t) => t.system === fSystem);
  if (fStatus) items = items.filter((t) => t.status === fStatus);
  if (fType) items = items.filter((t) => t.type === fType);
  if (fPriority) items = items.filter((t) => t.priority === fPriority);
  if (fAssignee) items = items.filter((t) => t.assignee_id === fAssignee);
  if (fTag) items = items.filter((t) => (t.tags || []).includes(fTag));

  // Phase 2: compute flags + assignee names only for remaining items
  const getOrd = makeBoardOrdCache(boards || []);
  items = items.map((tz) => {
    const item = { ...tz, flags: computeTzFlags(tz, getOrd(tz.board_id)) };
    if (usersMap && tz.assignee_id) item.assignee_name = usersMap.get(tz.assignee_id) || null;
    return item;
  });

  // Phase 3: text search (after assignee_name is resolved)
  if (fSearch) items = items.filter((t) =>
    (t.title && t.title.toLowerCase().includes(fSearch)) ||
    (t.tz_code && t.tz_code.toLowerCase().includes(fSearch)) ||
    (t.owner && t.owner.toLowerCase().includes(fSearch)) ||
    (t.description && t.description.toLowerCase().includes(fSearch)) ||
    (t.assignee_name && t.assignee_name.toLowerCase().includes(fSearch))
  );

  // Phase 4: flag-based filters
  if (fOverdue) items = items.filter((t) => t.flags.overdue);
  if (fNoDates) items = items.filter((t) => t.flags.no_dates);
  if (fNoOwner) items = items.filter((t) => t.flags.no_owner);
  if (fDeadlineSoon) items = items.filter((t) => t.flags.deadline_soon);
  if (fMissingDeadline) items = items.filter((t) => t.flags.missing_deadline);

  return items;
}

app.post('/api/admin/tz', async (req, res) => {
  const pin = getPin(req);
  const boards = await readJson(FILES.boards, []);
  const fBoardId = String(req.body.board_id || '').trim();
  const board = fBoardId ? boards.find(b => b.id === fBoardId) : boards.find(b => b.is_default);
  if (!(await requireBoardAccess(pin, board))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const users = await readJson(FILES.users, []);
  const usersMap = new Map(users.map(u => [u.id, u.fullName]));
  const items = filterTz(allTz, req.body, usersMap, boards);
  items.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { page, pageSize } = req.body;
  return res.json(paginate(items, page, pageSize));
});

/* ── Approve Предложение (superadmin only) ── */

app.patch('/api/tz/:id/approve', async (req, res) => {
  const pin = getPin(req);
  const authUser = await requireSuperAdmin(pin);
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const id = req.params.id;
  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find(t => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });
    if (tz.type !== 'Предложение') return res.status(400).json({ message: 'Утверждение доступно только для Предложений.' });
    if (tz.approved) return res.status(400).json({ message: 'Уже утверждено.' });

    const changedBy = authUser.fullName || pin;
    await recordTzHistory(tz.id, 'approved', false, true, changedBy);
    tz.approved = true;
    tz.approved_by = authUser.id;
    tz.approved_at = new Date().toISOString();

    // Move to review if still in draft
    if (tz.status === 'draft') {
      await recordTzHistory(tz.id, 'status', 'draft', 'review', changedBy);
      tz.status = 'review';
    }

    tz.updated_at = new Date().toISOString();
    await writeJson(FILES.tz, allTz);
    const boards = await readJson(FILES.boards, []);
    const statusOrd = makeBoardOrdCache(boards)(tz.board_id);
    return res.json({ message: 'Предложение утверждено.', tz: { ...tz, flags: computeTzFlags(tz, statusOrd) } });
  });
});

app.get('/api/tz/:id', async (req, res) => {
  const reqPin = getPin(req);
  const id = req.params.id;
  const allTz = await readJson(FILES.tz, []);
  const tz = allTz.find((t) => t.id === id);
  if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

  const isUserType = TZ_USER_TYPES.includes(tz.type);
  if (isUserType) {
    const user = await getUserByPin(reqPin);
    if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
    // Non-superadmin can only view their own items or items assigned to them
    if (!isSuperAdmin(reqPin, user) && tz.created_by_id !== user.id && tz.assignee_id !== user.id) {
      return res.status(403).json({ message: 'Нет доступа.' });
    }
  } else {
    if (!(await requireSuperAdmin(reqPin))) return res.status(403).json({ message: 'Нет доступа.' });
  }

  const history = (await readJson(FILES.tzHistory, []))
    .filter((h) => h.tz_id === id)
    .sort((a, b) => b.changed_at.localeCompare(a.changed_at));

  // Resolve assignee name
  const users = await readJson(FILES.users, []);
  const assigneeName = tz.assignee_id ? (users.find(u => u.id === tz.assignee_id)?.fullName || null) : null;
  const assignedByName = tz.assigned_by_id ? (users.find(u => u.id === tz.assigned_by_id)?.fullName || null) : null;
  const approvedByName = tz.approved_by ? (users.find(u => u.id === tz.approved_by)?.fullName || null) : null;

  // Resolve linked TZ names for frontend
  const linkedTzResolved = (tz.linked_tz_ids || []).map((lid) => {
    const linked = allTz.find((t) => t.id === lid);
    return linked ? { id: lid, tz_code: linked.tz_code, title: linked.title } : { id: lid, tz_code: lid.slice(0, 8), title: '(удалено)' };
  });

  const boards = await readJson(FILES.boards, []);
  const statusOrd = makeBoardOrdCache(boards)(tz.board_id);
  return res.json({ ...tz, flags: computeTzFlags(tz, statusOrd), history, assignee_name: assigneeName, assigned_by_name: assignedByName, approved_by_name: approvedByName, linked_tz_resolved: linkedTzResolved });
});

app.post('/api/admin/tz-stats', async (req, res) => {
  const pin = getPin(req);
  const fBoardId = String(req.body.board_id || '').trim();
  const boards = await readJson(FILES.boards, []);
  const board0 = fBoardId ? boards.find(b => b.id === fBoardId) : boards.find(b => b.is_default);
  if (!(await requireBoardAccess(pin, board0))) return res.status(403).json({ message: 'Нет доступа.' });
  let allTz = await readJson(FILES.tz, []);
  if (fBoardId) allTz = allTz.filter(t => t.board_id === fBoardId);
  const getOrd = makeBoardOrdCache(boards);
  const withFlags = allTz.map((tz) => ({ ...tz, flags: computeTzFlags(tz, getOrd(tz.board_id)) }));

  // Use board columns for status breakdown if board filtered
  const board = fBoardId ? boards.find(b => b.id === fBoardId) : null;
  const statusKeys = board ? board.columns.map(c => c.id) : TZ_STATUSES;

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

  for (const s of statusKeys) stats.by_status[s] = 0;
  for (const s of TZ_SYSTEMS) stats.by_system[s] = 0;
  for (const tz of allTz) {
    if (stats.by_status[tz.status] !== undefined) stats.by_status[tz.status]++;
    else stats.by_status[tz.status] = 1;
    if (stats.by_system[tz.system] !== undefined) stats.by_system[tz.system]++;
  }

  return res.json(stats);
});

/* ── TZ Excel export ── */

app.post('/api/admin/tz-export', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireFeature(pin, 'tz_export'))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const users = await readJson(FILES.users, []);
  const boards = await readJson(FILES.boards, []);
  const usersMap = new Map(users.map(u => [u.id, u.fullName]));
  const items = filterTz(allTz, req.body, usersMap, boards);
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
      status: getBoardStatusLabels(boards, tz.board_id)[tz.status] || tz.status || '',
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

/* ── TZ Excel import (AI-powered) ── */

const xlsxImportUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.endsWith('.xlsx')) cb(null, true);
    else cb(new Error('Допустимы только .xlsx файлы'));
  }
}).single('file');

app.post('/api/admin/tz-import', (req, res) => {
  xlsxImportUpload(req, res, async (uploadErr) => {
    if (uploadErr) return res.status(400).json({ message: uploadErr.message });
    try {
      const pin = getPin(req);
      const authUser = await requireFeature(pin, 'tz_import');
      if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

      if (!req.file) return res.status(400).json({ message: 'Файл не загружен.' });

      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(req.file.buffer);
      const ws = wb.getWorksheet('ТЗ');
      if (!ws) return res.status(400).json({ message: 'Лист «ТЗ» не найден в файле.' });

      // Parse Excel rows into text for AI
      const rows = [];
      ws.eachRow((row, rowNum) => {
        if (rowNum === 1) return;
        const tzCode = String(row.getCell(1).value || '').trim();
        if (!tzCode) return;
        const status = String(row.getCell(6).value || '').trim();
        const notes = String(row.getCell(9).value || '').trim().slice(0, 5000);
        if (status || notes) rows.push({ tz_code: tzCode, status, completion_notes: notes });
      });

      if (!rows.length) return res.status(400).json({ message: 'Нет данных для импорта в файле.' });

      // Build AI prompt — collect all status labels from all boards + global
      const boards = await readJson(FILES.boards, []);
      const allLabels = { ...TZ_STATUS_LABELS };
      for (const b of boards) for (const c of b.columns) allLabels[c.id] = c.name;
      const statusMap = Object.entries(allLabels).map(([k, v]) => `${v} → ${k}`).join(', ');
      const prompt = `Ты — автоматический импортёр ТЗ. Тебе дан список строк из Excel-файла (поля: tz_code, status, completion_notes).

Задача: прочитай файл data/tz.json, найди записи по tz_code и обнови поля status и completion_notes.

Правила:
1. Статусы в Excel написаны по-русски, иногда неточно. Маппинг: ${statusMap}. Если статус похож на одну из меток (сокращения, опечатки, синонимы) — используй соответствующий ключ. Если совсем непонятно — пропусти строку и упомяни в отчёте.
2. completion_notes: обнови если не пустое и отличается от текущего.
3. Обязательно проставь updated_at = new Date().toISOString() для изменённых записей.
4. Сохрани обратно в data/tz.json.
5. Выведи краткий отчёт: сколько обновлено, пропущено, какие ошибки были.

Данные из Excel (JSON):
${JSON.stringify(rows, null, 2)}`;

      // Create AI task
      const task = {
        id: randomUUID(),
        prompt: prompt.slice(0, 16000),
        status: 'pending',
        result: null,
        created_by: authUser.fullName || 'superadmin',
        created_at: new Date().toISOString(),
        started_at: null,
        finished_at: null
      };

      await withLock(FILES.aiTasks, async () => {
        const tasks = await readJson(FILES.aiTasks, []);
        tasks.push(task);
        await writeJson(FILES.aiTasks, tasks);
      });

      return res.json({ taskId: task.id, message: `AI-задача создана. ${rows.length} строк отправлено на анализ.` });
    } catch (err) {
      console.error('TZ import error:', err);
      return res.status(500).json({ message: 'Ошибка импорта: ' + err.message });
    }
  });
});

/* ── TZ Bulk operations (superadmin only) ── */

app.post('/api/admin/tz-bulk', async (req, res) => {
  const pin = getPin(req);
  const authUser = await requireFeature(pin, 'tz_bulk');
  if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });

  const ids = req.body.ids;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Выберите хотя бы одно ТЗ.' });
  if (ids.length > 100) return res.status(400).json({ message: 'Максимум 100 элементов за раз.' });
  if (!ids.every((id) => UUID_RE.test(id))) return res.status(400).json({ message: 'Некорректные ID.' });

  const action = String(req.body.action || '').trim();
  const value = String(req.body.value || '').trim();

  if (!['status', 'priority', 'assignee'].includes(action)) return res.status(400).json({ message: 'Неизвестное действие.' });
  if (!value && action !== 'assignee') return res.status(400).json({ message: 'Укажите значение.' });

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    let updated = 0;
    const changedBy = authUser.fullName;
    const now = new Date().toISOString();

    for (const id of ids) {
      const tz = allTz.find((t) => t.id === id);
      if (!tz) continue;

      if (action === 'status' && tz.status !== value) {
        await recordTzHistory(tz.id, 'status', tz.status, value, changedBy);
        tz.status = value;
        tz.updated_at = now;
        updated++;
      } else if (action === 'priority' && tz.priority !== value) {
        await recordTzHistory(tz.id, 'priority', tz.priority, value, changedBy);
        tz.priority = value;
        tz.updated_at = now;
        updated++;
      } else if (action === 'assignee') {
        const newVal = value || null;
        if (tz.assignee_id !== newVal) {
          await recordTzHistory(tz.id, 'assignee_id', tz.assignee_id || '', newVal || '', changedBy);
          tz.assignee_id = newVal;
          tz.assigned_by_id = authUser.id;
          tz.updated_at = now;
          updated++;
        }
      }
    }

    await writeJson(FILES.tz, allTz);
    return res.json({ message: `Обновлено: ${updated} из ${ids.length}.`, updated });
  });
});

/* ── Kanban view ── */

app.post('/api/admin/tz-kanban', async (req, res) => {
  const pin = getPin(req);

  // Resolve board for columns
  const fBoardId = String(req.body.board_id || '').trim();
  const boards = await readJson(FILES.boards, []);
  const board = fBoardId ? boards.find(b => b.id === fBoardId) : boards.find(b => b.is_default);
  if (!(await requireBoardAccess(pin, board))) return res.status(403).json({ message: 'Нет доступа.' });

  const allTz = await readJson(FILES.tz, []);
  const users = await readJson(FILES.users, []);
  const usersMap = new Map(users.map(u => [u.id, u.fullName]));
  const items = filterTz(allTz, req.body, usersMap, boards);

  items.sort((a, b) => {
    const pa = { critical: 0, high: 1, medium: 2, low: 3 };
    return (pa[a.priority] ?? 9) - (pa[b.priority] ?? 9) || a.created_at.localeCompare(b.created_at);
  });

  // Use board columns if available, fallback to global statuses
  const boardColumns = board ? board.columns.slice().sort((a, b) => a.order - b.order) : null;
  const colIds = boardColumns ? boardColumns.map(c => c.id) : TZ_STATUSES;
  const statusLabels = boardColumns
    ? Object.fromEntries(boardColumns.map(c => [c.id, c.name]))
    : TZ_STATUS_LABELS;

  const columns = {};
  for (const s of colIds) columns[s] = [];
  const orphanColId = '__orphan__';
  let hasOrphans = false;
  for (const item of items) {
    if (columns[item.status]) {
      columns[item.status].push(item);
    } else {
      // Card with status not in board columns (e.g. column was deleted)
      if (!columns[orphanColId]) columns[orphanColId] = [];
      columns[orphanColId].push(item);
      hasOrphans = true;
    }
  }
  if (hasOrphans) {
    colIds.push(orphanColId);
    statusLabels[orphanColId] = 'Без колонки';
    if (boardColumns) boardColumns.push({ id: orphanColId, name: 'Без колонки', color: '#fed7d7', order: 9999, hidden: false, wip_limit: 0 });
  }

  // Free-form transitions: any column → any other column
  const transitions = Object.fromEntries(colIds.map(s => [s, colIds.filter(t => t !== s)]));

  // Swimlane grouping
  const swimlane = String(req.body.swimlane || '').trim(); // 'priority' | 'assignee' | ''
  let swimlanes = null;
  if (swimlane === 'priority') {
    const prios = ['critical', 'high', 'medium', 'low'];
    swimlanes = prios.map((p) => ({
      key: p, label: { critical: 'Критический', high: 'Высокий', medium: 'Средний', low: 'Низкий' }[p] || p,
      columns: Object.fromEntries(colIds.map((s) => [s, (columns[s] || []).filter((t) => t.priority === p)]))
    }));
  } else if (swimlane === 'assignee') {
    const assigneeMap = new Map();
    for (const item of items) {
      const key = item.assignee_name || item.owner || 'Не назначен';
      if (!assigneeMap.has(key)) assigneeMap.set(key, Object.fromEntries(colIds.map((s) => [s, []])));
      const group = assigneeMap.get(key);
      if (group[item.status]) group[item.status].push(item);
    }
    swimlanes = [...assigneeMap.entries()].map(([key, cols]) => ({ key, label: key, columns: cols }));
  }

  // Compute WIP limit exceeded flags per column
  const wipExceeded = {};
  if (boardColumns) {
    for (const col of boardColumns) {
      if (col.wip_limit > 0) {
        wipExceeded[col.id] = (columns[col.id] || []).length > col.wip_limit;
      } else {
        wipExceeded[col.id] = false;
      }
    }
  }

  return res.json({
    columns,
    transitions,
    statusLabels,
    boardColumns: boardColumns || null,
    swimlanes,
    wipExceeded
  });
});

app.patch('/api/tz/:id/status', async (req, res) => {
  const pin = getPin(req);
  const id = req.params.id;

  // Read TZ to check type
  const allTzPre = await readJson(FILES.tz, []);
  const tzPre = allTzPre.find(t => t.id === id);
  const isUserType = tzPre && TZ_USER_TYPES.includes(tzPre.type);

  let authUser;
  if (isUserType) {
    authUser = await getUserByPin(pin);
    if (!authUser) return res.status(403).json({ message: 'Требуется авторизация.' });
    if (!isSuperAdmin(pin, authUser) && tzPre.created_by_id !== authUser.id && tzPre.assignee_id !== authUser.id) {
      return res.status(403).json({ message: 'Нет доступа.' });
    }
  } else {
    authUser = await requireSuperAdmin(pin);
    if (!authUser) return res.status(403).json({ message: 'Нет доступа.' });
  }

  const newStatus = String(req.body.status || '').trim();

  // Validate against board columns if card has a board
  const boards = await readJson(FILES.boards, []);
  const board = tzPre?.board_id ? boards.find(b => b.id === tzPre.board_id) : null;
  const validStatuses = board ? board.columns.map(c => c.id) : TZ_STATUSES;
  const statusLabelsLocal = board ? Object.fromEntries(board.columns.map(c => [c.id, c.name])) : TZ_STATUS_LABELS;

  if (!validStatuses.includes(newStatus)) return res.status(400).json({ message: 'Неизвестный статус.' });

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === id);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    if (tz.status === newStatus) return res.json({ message: 'Статус не изменился.', tz });

    const changedBy = authUser.fullName || pin;
    await recordTzHistory(tz.id, 'status', tz.status, newStatus, changedBy);
    const oldStatus = tz.status;
    tz.status = newStatus;
    tz.updated_at = new Date().toISOString();
    await writeJson(FILES.tz, allTz);

    // Notify watchers (Telegram)
    const oldLabel = statusLabelsLocal[oldStatus] || oldStatus;
    const newLabel = statusLabelsLocal[newStatus] || newStatus;
    notifyTzWatchers(tz, `Статус: ${oldLabel} → <b>${escHtml(newLabel)}</b>\nИзменил: ${escHtml(changedBy)}`, authUser.id);

    // In-app notifications for watchers, assignee, creator
    const statusNotifyIds = new Set([...(tz.watchers || [])]);
    if (tz.assignee_id) statusNotifyIds.add(tz.assignee_id);
    if (tz.created_by_id) statusNotifyIds.add(tz.created_by_id);
    statusNotifyIds.delete(authUser?.id);
    if (statusNotifyIds.size) {
      await notifyUsers([...statusNotifyIds], 'tz_status', 'Статус ТЗ изменён', `${tz.tz_code}: ${oldLabel} → ${newLabel}`, `#tz/view/${tz.id}`);
    }

    const statusOrd = board ? buildStatusOrd(board.columns) : TZ_STATUS_ORD;
    const responseObj = { message: `Статус изменён на «${statusLabelsLocal[newStatus] || newStatus}».`, tz: { ...tz, flags: computeTzFlags(tz, statusOrd) } };

    // WIP limit warning
    if (board) {
      const targetCol = board.columns.find(c => c.id === newStatus);
      if (targetCol && targetCol.wip_limit > 0) {
        const countInCol = allTz.filter(t => t.board_id === board.id && t.status === newStatus).length;
        if (countInCol > targetCol.wip_limit) {
          responseObj.warnings = ['WIP-лимит колонки превышен'];
        }
      }
    }

    return res.json(responseObj);
  });
});

/* ── TZ Watchers ── */

app.post('/api/tz/:id/watch', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const role = getUserRole(pin, user);
  if (role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });

  const tzId = req.params.id;

  return withLock(FILES.tz, async () => {
    const allTz = await readJson(FILES.tz, []);
    const tz = allTz.find((t) => t.id === tzId);
    if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

    if (!tz.watchers) tz.watchers = [];
    const idx = tz.watchers.indexOf(user.id);
    if (idx >= 0) {
      tz.watchers.splice(idx, 1);
      await writeJson(FILES.tz, allTz);
      return res.json({ watching: false, watchers: tz.watchers });
    } else {
      tz.watchers.push(user.id);
      await writeJson(FILES.tz, allTz);
      return res.json({ watching: true, watchers: tz.watchers });
    }
  });
});

// Notify watchers helper
async function notifyTzWatchers(tz, changeText, excludeUserId) {
  if (!tz.watchers || !tz.watchers.length || !TG_TOKEN) return;
  const users = await readJson(FILES.users, []);
  for (const watcherId of tz.watchers) {
    if (watcherId === excludeUserId) continue;
    const watcher = users.find((u) => u.id === watcherId);
    if (!watcher || !watcher.tgChatId) continue;
    const msg = `📌 <b>${escHtml(tz.tz_code)}</b> «${escHtml(tz.title)}»\n${changeText}`;
    tgSend(watcher.tgChatId, msg);
  }
}

/* ── TZ Comments ── */

app.get('/api/tz/:id/comments', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const role = getUserRole(pin, user);
  if (role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });

  const tzId = req.params.id;
  const all = await readJson(FILES.tzComments, []);
  const comments = all.filter((c) => c.tz_id === tzId).sort((a, b) => a.created_at.localeCompare(b.created_at));
  return res.json(comments);
});

app.post('/api/tz/:id/comments', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const role = getUserRole(pin, user);
  if (role !== 'superadmin') return res.status(403).json({ message: 'Нет доступа.' });

  const tzId = req.params.id;
  const text = clip(String(req.body.text || '').trim(), 2000);
  if (!text || text.length < 1) return res.status(400).json({ message: 'Комментарий не может быть пустым.' });

  // Verify TZ exists
  const allTz = await readJson(FILES.tz, []);
  const tz = allTz.find((t) => t.id === tzId);
  if (!tz) return res.status(404).json({ message: 'ТЗ не найдено.' });

  return withLock(FILES.tzComments, async () => {
    const all = await readJson(FILES.tzComments, []);
    const comment = {
      id: randomUUID(),
      tz_id: tzId,
      text,
      author: user.fullName,
      author_id: user.id,
      created_at: new Date().toISOString()
    };
    all.push(comment);
    await writeJson(FILES.tzComments, all);

    // Notify watchers about new comment (Telegram)
    notifyTzWatchers(tz, `💬 ${escHtml(user.fullName)}: ${escHtml(text.length > 100 ? text.slice(0, 100) + '...' : text)}`, user.id);

    // In-app notifications for watchers, assignee, creator
    const commentNotifyIds = new Set([...(tz.watchers || [])]);
    if (tz.assignee_id) commentNotifyIds.add(tz.assignee_id);
    if (tz.created_by_id) commentNotifyIds.add(tz.created_by_id);
    commentNotifyIds.delete(user.id);
    if (commentNotifyIds.size) {
      await notifyUsers([...commentNotifyIds], 'tz_comment', 'Новый комментарий', `${tz.tz_code}: ${clip(text, 100)}`, `#tz/view/${tz.id}`);
    }

    // Parse @mentions
    const mentionRegex = /@([А-Яа-яЁёA-Za-z]+ [А-Яа-яЁёA-Za-z.]+)/g;
    const mentions = [...text.matchAll(mentionRegex)].map(m => m[1]);
    if (mentions.length) {
      const allUsers = await readJson(FILES.users, []);
      for (const name of mentions) {
        const mentioned = allUsers.find(u => u.fullName.toLowerCase().includes(name.toLowerCase()));
        if (mentioned && mentioned.id !== user.id) {
          await createNotification(mentioned.id, 'tz_mention', 'Вас упомянули в комментарии', `${tz.tz_code}: ${clip(text, 100)}`, `#tz/view/${tz.id}`);
        }
      }
    }

    return res.status(201).json(comment);
  });
});

app.delete('/api/tz/:tzId/comments/:commentId', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const { commentId } = req.params;
  if (!UUID_RE.test(commentId)) return res.status(400).json({ message: 'Некорректный ID.' });

  return withLock(FILES.tzComments, async () => {
    const all = await readJson(FILES.tzComments, []);
    const idx = all.findIndex((c) => c.id === commentId);
    if (idx === -1) return res.status(404).json({ message: 'Комментарий не найден.' });
    all.splice(idx, 1);
    await writeJson(FILES.tzComments, all);
    return res.json({ message: 'Комментарий удалён.' });
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
  categories: path.join(dataDir, 'kb-categories.json'),
  groups: path.join(dataDir, 'kb-groups.json')
};

// ── KB Access helpers ──

async function getKbUserGroups(userId) {
  const groups = await readJson(KB_FILES.groups, []);
  return groups.filter(g => g.members.includes(userId));
}

function canAccessKbCategory(cat, userId, userGroups, isSA, userPerms) {
  if (isSA) return true;
  // New: check unified permissions
  if (userPerms && hasPermission(userPerms, 'kb_categories', cat.id)) return true;
  if (!cat.group_id) return true; // public category
  return userGroups.some(g => g.id === cat.group_id);
}

function canEditKbCategory(cat, userId, userGroups, isSA, userPerms) {
  if (isSA) return true;
  // New: check unified permissions
  if (userPerms && hasPermission(userPerms, 'kb_categories', cat.id)) return true;
  if (!cat.group_id) return false; // public — only superadmin edits
  return userGroups.some(g => g.id === cat.group_id);
}

function canAccessKbArticle(article, cat, userId, userGroups, isSA) {
  if (isSA) return true;
  if (article.shared_with && article.shared_with.includes(userId)) return true;
  return canAccessKbCategory(cat, userId, userGroups, isSA);
}

// ── KB Groups CRUD (superadmin) ──

app.get('/api/kb/groups', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const groups = await readJson(KB_FILES.groups, []);
  const sa = isSuperAdmin(pin, user);
  // superadmin sees all, others see only their groups
  const result = sa ? groups : groups.filter(g => g.members.includes(user.id));
  // enrich with member names
  const users = await readJson(FILES.users, []);
  const enriched = result.map(g => ({
    ...g,
    memberNames: g.members.map(mid => {
      const u = users.find(u => u.id === mid);
      return u ? { id: u.id, fullName: u.fullName } : { id: mid, fullName: '?' };
    })
  }));
  return res.json(enriched);
});

app.post('/api/kb/groups', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название минимум 2 символа.' });
  return withLock(KB_FILES.groups, async () => {
    const groups = await readJson(KB_FILES.groups, []);
    if (groups.some(g => g.name.toLowerCase() === name.toLowerCase()))
      return res.status(400).json({ message: 'Группа с таким названием уже существует.' });
    const group = { id: randomUUID(), name, members: [], created_at: new Date().toISOString() };
    groups.push(group);
    await writeJson(KB_FILES.groups, groups);
    return res.status(201).json({ message: 'Группа создана.', group });
  });
});

app.put('/api/kb/groups/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return withLock(KB_FILES.groups, async () => {
    const groups = await readJson(KB_FILES.groups, []);
    const g = groups.find(g => g.id === req.params.id);
    if (!g) return res.status(404).json({ message: 'Группа не найдена.' });
    if (req.body.name !== undefined) {
      const name = clip(String(req.body.name).trim(), 100);
      if (name.length < 2) return res.status(400).json({ message: 'Название минимум 2 символа.' });
      g.name = name;
    }
    if (Array.isArray(req.body.members)) {
      g.members = req.body.members;
    }
    await writeJson(KB_FILES.groups, groups);
    return res.json({ message: 'Группа обновлена.', group: g });
  });
});

app.delete('/api/kb/groups/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return withLock(KB_FILES.groups, async () => {
    const groups = await readJson(KB_FILES.groups, []);
    const idx = groups.findIndex(g => g.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Группа не найдена.' });
    groups.splice(idx, 1);
    await writeJson(KB_FILES.groups, groups);
    // Clear group_id from categories that reference this group
    const cats = await readJson(KB_FILES.categories, []);
    let changed = false;
    for (const c of cats) {
      if (c.group_id === req.params.id) { c.group_id = null; changed = true; }
    }
    if (changed) await writeJson(KB_FILES.categories, cats);
    return res.json({ message: 'Группа удалена.' });
  });
});

// Categories

app.get('/api/kb/categories', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const userGroups = await getKbUserGroups(user.id);
  const perms = await getUserPermissions(pin);
  const uPerms = perms?.permissions || null;
  const cats = await readJson(KB_FILES.categories, []);
  const articles = await readJson(KB_FILES.articles, []);
  const visible = cats
    .filter(c => canAccessKbCategory(c, user.id, userGroups, sa, uPerms))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((c) => ({
      ...c,
      articleCount: articles.filter((a) => a.category_id === c.id).length,
      canEdit: canEditKbCategory(c, user.id, userGroups, sa, uPerms)
    }));
  return res.json(visible);
});

app.post('/api/kb/categories', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название категории минимум 2 символа.' });
  const icon = clip(String(req.body.icon || 'folder').trim(), 30);

  return withLock(KB_FILES.categories, async () => {
    const cats = await readJson(KB_FILES.categories, []);
    if (cats.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return res.status(400).json({ message: 'Категория с таким названием уже существует.' });
    }
    const groupId = req.body.group_id ? String(req.body.group_id).trim() : null;
    if (groupId) {
      const groups = await readJson(KB_FILES.groups, []);
      if (!groups.some(g => g.id === groupId))
        return res.status(400).json({ message: 'Группа не найдена.' });
    }
    const cat = { id: randomUUID(), name, icon, order: cats.length, group_id: groupId };
    cats.push(cat);
    await writeJson(KB_FILES.categories, cats);
    return res.status(201).json({ message: 'Категория создана.', category: cat });
  });
});

app.put('/api/kb/categories/reorder', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const ids = req.body.ids;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Передайте массив ids.' });

  return withLock(KB_FILES.categories, async () => {
    const cats = await readJson(KB_FILES.categories, []);
    for (let i = 0; i < ids.length; i++) {
      const cat = cats.find((c) => c.id === ids[i]);
      if (cat) cat.order = i;
    }
    await writeJson(KB_FILES.categories, cats);
    return res.json({ message: 'Порядок обновлён.' });
  });
});

app.put('/api/kb/categories/:id', async (req, res) => {
  const pin = getPin(req);
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
    if (req.body.group_id !== undefined) {
      const gid = req.body.group_id ? String(req.body.group_id).trim() : null;
      if (gid) {
        const groups = await readJson(KB_FILES.groups, []);
        if (!groups.some(g => g.id === gid))
          return res.status(400).json({ message: 'Группа не найдена.' });
      }
      cat.group_id = gid;
    }

    await writeJson(KB_FILES.categories, cats);
    return res.json({ message: 'Категория обновлена.', category: cat });
  });
});

app.delete('/api/kb/categories/:id', async (req, res) => {
  const pin = getPin(req);
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
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const userGroups = await getKbUserGroups(user.id);
  const cats = await readJson(KB_FILES.categories, []);
  const articles = await readJson(KB_FILES.articles, []);
  const catId = String(req.query.category_id || '').trim();
  const search = String(req.query.search || '').trim().toLowerCase();

  let items = articles;

  // Filter by access: user sees articles in accessible categories + shared with them
  if (!sa) {
    items = items.filter(a => {
      const cat = cats.find(c => c.id === a.category_id);
      if (!cat) return false;
      return canAccessKbArticle(a, cat, user.id, userGroups, sa);
    });
  }

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
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const articles = await readJson(KB_FILES.articles, []);
  const article = articles.find((a) => a.id === req.params.id);
  if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

  const sa = isSuperAdmin(pin, user);
  const cats = await readJson(KB_FILES.categories, []);
  const cat = cats.find(c => c.id === article.category_id);
  const userGroups = await getKbUserGroups(user.id);
  const perms = await getUserPermissions(pin);
  const uPerms = perms?.permissions || null;
  if (!canAccessKbArticle(article, cat || {}, user.id, userGroups, sa)) {
    // Also check unified permissions as fallback
    if (!uPerms || !hasPermission(uPerms, 'kb_categories', cat?.id)) {
      return res.status(403).json({ message: 'Нет доступа к этой статье.' });
    }
  }

  // Add canEdit flag
  const canEdit = sa || canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms);
  return res.json({ ...article, canEdit });
});

app.post('/api/kb/articles', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const categoryId = String(req.body.category_id || '').trim();

  // Check user can edit this category
  const cats = await readJson(KB_FILES.categories, []);
  const cat = cats.find(c => c.id === categoryId);
  if (categoryId && !cat) return res.status(400).json({ message: 'Категория не найдена.' });

  const userGroups = await getKbUserGroups(user.id);
  const perms = await getUserPermissions(pin);
  const uPerms = perms?.permissions || null;
  if (!canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms)) {
    return res.status(403).json({ message: 'Нет прав на создание статей в этой категории.' });
  }

  const title = clip(String(req.body.title || '').trim(), 300);
  if (title.length < 3) return res.status(400).json({ message: 'Название минимум 3 символа.' });
  const content = String(req.body.content || '').trim();
  if (content.length < 10) return res.status(400).json({ message: 'Содержимое слишком короткое.' });
  const pinned = !!req.body.pinned;

  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const article = {
      id: randomUUID(),
      title,
      content: clip(content, 2000000),
      category_id: categoryId || null,
      pinned,
      created_by: user.fullName || 'unknown',
      created_by_id: user.id,
      shared_with: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    articles.push(article);
    await writeJson(KB_FILES.articles, articles);
    return res.status(201).json({ message: 'Статья создана.', article: { ...article, content: undefined } });
  });
});

app.put('/api/kb/articles/:id', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const id = req.params.id;
  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const article = articles.find((a) => a.id === id);
    if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

    // Check permission: superadmin or group member for this category
    const cats = await readJson(KB_FILES.categories, []);
    const cat = cats.find(c => c.id === article.category_id);
    const userGroups = await getKbUserGroups(user.id);
    const perms = await getUserPermissions(pin);
    const uPerms = perms?.permissions || null;
    if (!canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms)) {
      return res.status(403).json({ message: 'Нет прав на редактирование.' });
    }

    // Save version history before updating
    const history = await readJson(FILES.kbHistory, []);
    history.push({
      id: randomUUID(),
      article_id: article.id,
      title: article.title,
      content: article.content,
      edited_by: user.fullName,
      edited_by_id: user.id,
      created_at: new Date().toISOString()
    });
    // Keep max 50 versions per article
    const articleHistory = history.filter(h => h.article_id === article.id);
    if (articleHistory.length > 50) {
      const oldest = articleHistory.sort((a, b) => a.created_at.localeCompare(b.created_at))[0];
      const idx = history.findIndex(h => h.id === oldest.id);
      if (idx !== -1) history.splice(idx, 1);
    }
    await writeJson(FILES.kbHistory, history);

    if (req.body.title !== undefined) {
      const t = clip(String(req.body.title).trim(), 300);
      if (t.length < 3) return res.status(400).json({ message: 'Название минимум 3 символа.' });
      article.title = t;
    }
    if (req.body.content !== undefined) {
      article.content = clip(String(req.body.content).trim(), 2000000);
    }
    if (req.body.category_id !== undefined) {
      const catId = String(req.body.category_id).trim();
      if (catId) {
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

// Share article with specific users
app.put('/api/kb/articles/:id/share', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const article = articles.find(a => a.id === req.params.id);
    if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

    // Only superadmin or group member can share
    const cats = await readJson(KB_FILES.categories, []);
    const cat = cats.find(c => c.id === article.category_id);
    const userGroups = await getKbUserGroups(user.id);
    const perms = await getUserPermissions(pin);
    const uPerms = perms?.permissions || null;
    if (!canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms)) {
      return res.status(403).json({ message: 'Нет прав.' });
    }

    const shared = Array.isArray(req.body.shared_with) ? req.body.shared_with : [];
    article.shared_with = shared;
    await writeJson(KB_FILES.articles, articles);
    return res.json({ message: 'Доступ обновлён.' });
  });
});

app.delete('/api/kb/articles/:id', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const id = req.params.id;
  return withLock(KB_FILES.articles, async () => {
    const articles = await readJson(KB_FILES.articles, []);
    const idx = articles.findIndex((a) => a.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Статья не найдена.' });

    const article = articles[idx];
    const cats = await readJson(KB_FILES.categories, []);
    const cat = cats.find(c => c.id === article.category_id);
    const userGroups = await getKbUserGroups(user.id);
    const perms = await getUserPermissions(pin);
    const uPerms = perms?.permissions || null;
    if (!canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms)) {
      return res.status(403).json({ message: 'Нет прав на удаление.' });
    }

    articles.splice(idx, 1);
    await writeJson(KB_FILES.articles, articles);
    return res.json({ message: 'Статья удалена.' });
  });
});

// KB Article version history
app.get('/api/kb/articles/:id/history', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const articles = await readJson(KB_FILES.articles, []);
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

  const history = await readJson(FILES.kbHistory, []);
  const versions = history
    .filter(h => h.article_id === req.params.id)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map(h => ({ id: h.id, title: h.title, edited_by: h.edited_by, created_at: h.created_at }));
  return res.json(versions);
});

app.get('/api/kb/articles/:id/history/:versionId', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const history = await readJson(FILES.kbHistory, []);
  const version = history.find(h => h.id === req.params.versionId && h.article_id === req.params.id);
  if (!version) return res.status(404).json({ message: 'Версия не найдена.' });
  return res.json(version);
});

app.post('/api/kb/articles/:id/restore/:versionId', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const sa = isSuperAdmin(pin, user);

  const cats = await readJson(KB_FILES.categories, []);
  const articles = await readJson(KB_FILES.articles, []);
  const article = articles.find(a => a.id === req.params.id);
  if (!article) return res.status(404).json({ message: 'Статья не найдена.' });

  const cat = cats.find(c => c.id === article.category_id);
  const userGroups = await getKbUserGroups(user.id);
  const perms = await getUserPermissions(pin);
  const uPerms = perms?.permissions || null;
  if (!canEditKbCategory(cat || {}, user.id, userGroups, sa, uPerms)) {
    return res.status(403).json({ message: 'Нет прав на редактирование.' });
  }

  const history = await readJson(FILES.kbHistory, []);
  const version = history.find(h => h.id === req.params.versionId && h.article_id === req.params.id);
  if (!version) return res.status(404).json({ message: 'Версия не найдена.' });

  return withLock(KB_FILES.articles, async () => {
    const arts = await readJson(KB_FILES.articles, []);
    const art = arts.find(a => a.id === req.params.id);
    if (!art) return res.status(404).json({ message: 'Статья не найдена.' });

    // Save current as version before restoring
    const hist = await readJson(FILES.kbHistory, []);
    hist.push({
      id: randomUUID(),
      article_id: art.id,
      title: art.title,
      content: art.content,
      edited_by: user.fullName,
      edited_by_id: user.id,
      created_at: new Date().toISOString()
    });
    await writeJson(FILES.kbHistory, hist);

    art.title = version.title;
    art.content = version.content;
    art.updated_at = new Date().toISOString();
    await writeJson(KB_FILES.articles, arts);
    return res.json({ message: 'Версия восстановлена.' });
  });
});

// KB users list for sharing (any authenticated user gets id+name only)
app.get('/api/kb/users', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const users = await readJson(FILES.users, []);
  return res.json(users.map(u => ({ id: u.id, fullName: u.fullName })));
});

// User names for @mention autocomplete
app.get('/api/users/names', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const users = await readJson(FILES.users, []);
  return res.json(users.map(u => ({ id: u.id, fullName: u.fullName })));
});

/* ── KB Templates ── */

app.get('/api/kb/templates', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const templates = await readJson(FILES.kbTemplates, []);
  return res.json(templates.map(t => ({ id: t.id, name: t.name, description: t.description || '' })));
});

app.get('/api/kb/templates/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const templates = await readJson(FILES.kbTemplates, []);
  const tpl = templates.find(t => t.id === req.params.id);
  if (!tpl) return res.status(404).json({ message: 'Шаблон не найден.' });
  return res.json(tpl);
});

app.post('/api/kb/templates', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название минимум 2 символа.' });
  return withLock(FILES.kbTemplates, async () => {
    const templates = await readJson(FILES.kbTemplates, []);
    const tpl = {
      id: randomUUID(),
      name,
      description: clip(String(req.body.description || '').trim(), 300),
      content: clip(String(req.body.content || '').trim(), 2000000),
      created_at: new Date().toISOString()
    };
    templates.push(tpl);
    await writeJson(FILES.kbTemplates, templates);
    return res.status(201).json({ message: 'Шаблон создан.', template: { id: tpl.id, name: tpl.name } });
  });
});

app.delete('/api/kb/templates/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  return withLock(FILES.kbTemplates, async () => {
    const templates = await readJson(FILES.kbTemplates, []);
    const idx = templates.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Шаблон не найден.' });
    templates.splice(idx, 1);
    await writeJson(FILES.kbTemplates, templates);
    return res.json({ message: 'Шаблон удалён.' });
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

    const pin = getPin(req);
    const _imgUser = await getUserByPin(pin);
    if (!_imgUser) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(403).json({ message: 'Нет доступа.' });
    }
    const _imgSa = isSuperAdmin(pin, _imgUser);
    const _imgGrps = await getKbUserGroups(_imgUser.id);
    if (!_imgSa && !_imgGrps.length) {
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

// KB document upload (docx / xlsx → HTML)

const kbDocUpload = multer({
  storage: kbImageStorage,  // reuse same temp storage
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',         // .xlsx
      'application/vnd.ms-excel',                                                   // .xls
    ];
    cb(null, allowed.includes(file.mimetype));
  }
}).single('document');

app.post('/api/kb/upload-document', (req, res) => {
  kbDocUpload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ message: 'Файл слишком большой (макс 20 МБ).' });
      return res.status(400).json({ message: 'Ошибка загрузки файла.' });
    }
    if (!req.file) return res.status(400).json({ message: 'Файл не выбран. Поддерживаются .docx и .xlsx' });

    const pin = getPin(req);
    const _docUser = await getUserByPin(pin);
    if (!_docUser) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(403).json({ message: 'Нет доступа.' });
    }
    const _docSa = isSuperAdmin(pin, _docUser);
    const _docGrps = await getKbUserGroups(_docUser.id);
    if (!_docSa && !_docGrps.length) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(403).json({ message: 'Нет доступа.' });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    const originalName = req.file.originalname.replace(/\.[^.]+$/, '');

    try {
      let html = '';

      if (ext === '.docx') {
        // Convert Word → HTML with mammoth
        const result = await mammoth.convertToHtml(
          { path: req.file.path },
          {
            convertImage: mammoth.images.imgElement(async (image) => {
              // Save embedded images to kb-images
              const imgBuf = await image.read();
              const imgExt = image.contentType ? '.' + image.contentType.split('/')[1] : '.png';
              const imgName = `${randomUUID()}${imgExt}`;
              await fs.writeFile(path.join(kbImagesDir, imgName), imgBuf);
              return { src: `/api/kb/images/${imgName}` };
            })
          }
        );
        html = result.value;

      } else if (ext === '.xlsx' || ext === '.xls') {
        // Convert Excel → HTML tables
        const buf = await fs.readFile(req.file.path);
        const wb = XLSX.read(buf, { type: 'buffer', cellStyles: true });
        const parts = [];
        for (const sheetName of wb.SheetNames) {
          const ws = wb.Sheets[sheetName];
          if (!ws['!ref']) continue;
          if (wb.SheetNames.length > 1) {
            parts.push(`<h2>${sheetName}</h2>`);
          }
          const tableHtml = XLSX.utils.sheet_to_html(ws, { id: '', editable: false });
          // sheet_to_html wraps in <html><body><table>, extract just the table
          const tableMatch = tableHtml.match(/<table[\s\S]*<\/table>/i);
          parts.push(tableMatch ? tableMatch[0] : tableHtml);
        }
        html = parts.join('\n');

      } else {
        await fs.unlink(req.file.path).catch(() => {});
        return res.status(400).json({ message: 'Неподдерживаемый формат. Используйте .docx или .xlsx' });
      }

      await fs.unlink(req.file.path).catch(() => {});
      return res.json({ html, title: originalName });

    } catch (convErr) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(500).json({ message: `Ошибка конвертации: ${convErr.message}` });
    }
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
  const pin = getPin(req);
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
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });

  const tasks = await readJson(FILES.aiTasks, []);
  const sorted = tasks.sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 50);
  return res.json(sorted);
});

app.post('/api/admin/ai-task-cancel', async (req, res) => {
  const pin = getPin(req);
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

/* ── TZ Templates (superadmin) ── */

app.get('/api/tz-templates', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const templates = await readJson(FILES.tzTemplates, []);
  return res.json(templates);
});

app.post('/api/tz-templates', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название шаблона минимум 2 символа.' });
  const f = req.body.fields || {};
  return withLock(FILES.tzTemplates, async () => {
    const templates = await readJson(FILES.tzTemplates, []);
    const tpl = {
      id: randomUUID(), name,
      fields: {
        system: String(f.system || '').slice(0, 50),
        type: String(f.type || 'ТЗ').slice(0, 50),
        priority: String(f.priority || 'medium').slice(0, 20),
        description: String(f.description || '').slice(0, 5000),
        owner: String(f.owner || '').slice(0, 100)
      },
      created_at: new Date().toISOString()
    };
    templates.push(tpl);
    await writeJson(FILES.tzTemplates, templates);
    return res.status(201).json({ message: 'Шаблон создан.', template: tpl });
  });
});

app.put('/api/tz-templates/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { id } = req.params;
  const name = clip(String(req.body.name || '').trim(), 100);
  if (name.length < 2) return res.status(400).json({ message: 'Название шаблона минимум 2 символа.' });
  const f = req.body.fields || {};
  return withLock(FILES.tzTemplates, async () => {
    const templates = await readJson(FILES.tzTemplates, []);
    const tpl = templates.find((t) => t.id === id);
    if (!tpl) return res.status(404).json({ message: 'Шаблон не найден.' });
    tpl.name = name;
    tpl.fields = {
      system: String(f.system || '').slice(0, 50),
      type: String(f.type || 'ТЗ').slice(0, 50),
      priority: String(f.priority || 'medium').slice(0, 20),
      description: String(f.description || '').slice(0, 5000),
      owner: String(f.owner || '').slice(0, 100)
    };
    await writeJson(FILES.tzTemplates, templates);
    return res.json({ message: 'Шаблон обновлён.' });
  });
});

app.delete('/api/tz-templates/:id', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const { id } = req.params;
  return withLock(FILES.tzTemplates, async () => {
    const templates = await readJson(FILES.tzTemplates, []);
    const idx = templates.findIndex((t) => t.id === id);
    if (idx === -1) return res.status(404).json({ message: 'Шаблон не найден.' });
    templates.splice(idx, 1);
    await writeJson(FILES.tzTemplates, templates);
    return res.json({ message: 'Шаблон удалён.' });
  });
});

/* ── Global Search ── */

app.get('/api/search', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });
  const q = String(req.query.q || '').trim().toLowerCase();
  if (q.length < 2) return res.json({ tz: [], kb: [], tickets: [] });
  const results = { tz: [], kb: [], tickets: [] };

  const adminRole = getUserRole(pin, user);
  if (adminRole === 'superadmin') {
    const allTz = await readJson(FILES.tz, []);
    results.tz = allTz
      .filter((t) => t.title.toLowerCase().includes(q) || (t.tz_code || '').toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q))
      .slice(0, 15)
      .map((t) => ({ id: t.id, tz_code: t.tz_code, title: t.title, status: t.status, type: t.type }));
  }

  const articles = await readJson(KB_FILES.articles, []);
  results.kb = articles
    .filter((a) => a.title.toLowerCase().includes(q) || (a.content || '').replace(/<[^>]+>/g, '').toLowerCase().includes(q))
    .slice(0, 10)
    .map((a) => ({ id: a.id, title: a.title, category_id: a.category_id }));

  return res.json(results);
});

/* ── Team Directory ── */

app.get('/api/team/members', async (req, res) => {
  const pin = getPin(req);
  if (!(await getUserByPin(pin))) return res.status(403).json({ message: 'Требуется авторизация.' });
  const users = await readJson(FILES.users, []);
  const members = users.map((u) => ({
    id: u.id, fullName: u.fullName, position: u.position || '',
    contact: u.contact || '', avatar: u.avatar || '',
    workLocation: u.workLocation || '', workDesk: u.workDesk || ''
  }));
  return res.json(members);
});

/* ── TZ Metrics (superadmin) ── */

app.post('/api/admin/tz-metrics', async (req, res) => {
  const pin = getPin(req);
  if (!(await requireSuperAdmin(pin))) return res.status(403).json({ message: 'Нет доступа.' });
  const boardId = String(req.body.board_id || '').trim();
  let allTz = await readJson(FILES.tz, []);
  if (boardId) allTz = allTz.filter((t) => t.board_id === boardId);
  const history = await readJson(FILES.tzHistory, []);

  // Status distribution
  const statusCounts = {};
  for (const t of allTz) statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;

  // Priority distribution
  const prioCounts = {};
  for (const t of allTz) prioCounts[t.priority] = (prioCounts[t.priority] || 0) + 1;

  // Type distribution
  const typeCounts = {};
  for (const t of allTz) typeCounts[t.type] = (typeCounts[t.type] || 0) + 1;

  // Created per week (last 12 weeks)
  const now = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const createdPerWeek = [];
  for (let w = 11; w >= 0; w--) {
    const weekStart = now - (w + 1) * weekMs;
    const weekEnd = now - w * weekMs;
    const count = allTz.filter((t) => {
      const ts = new Date(t.created_at).getTime();
      return ts >= weekStart && ts < weekEnd;
    }).length;
    const label = new Date(weekEnd).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    createdPerWeek.push({ label, count });
  }

  // Cycle time (created → production/release) in days for completed TZ
  const doneTz = allTz.filter((t) => ['production', 'release', 'done'].includes(t.status));
  const cycleTimes = [];
  for (const t of doneTz) {
    const created = new Date(t.created_at).getTime();
    const relevantHistory = history.filter((h) => h.tz_id === t.id && ['production', 'release', 'done'].includes(h.new_status));
    if (relevantHistory.length) {
      const doneAt = new Date(relevantHistory[relevantHistory.length - 1].changed_at).getTime();
      cycleTimes.push(Math.round((doneAt - created) / (24 * 60 * 60 * 1000)));
    }
  }
  const avgCycleTime = cycleTimes.length ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) : 0;

  return res.json({ statusCounts, prioCounts, typeCounts, createdPerWeek, avgCycleTime, totalDone: doneTz.length, total: allTz.length });
});

/* ── Dashboard Metrics (all authenticated users) ── */

app.get('/api/metrics', async (req, res) => {
  const pin = getPin(req);
  const user = await getUserByPin(pin);
  if (!user) return res.status(403).json({ message: 'Требуется авторизация.' });

  const sa = isSuperAdmin(pin, user);
  const allTz = await readJson(FILES.tz, []);
  const boards = await readJson(FILES.boards, []);
  const users = await readJson(FILES.users, []);
  const bookings = await readJson(FILES.bookings, []);
  const history = await readJson(FILES.tzHistory, []);

  // Filter TZ based on access
  let visibleTz = allTz;
  if (!sa) {
    const perms = await getUserPermissions(pin);
    const accessibleBoards = perms?.permissions?.boards === '*'
      ? boards.map(b => b.id)
      : (perms?.permissions?.boards instanceof Set
        ? [...perms.permissions.boards]
        : (perms?.permissions?.boards || []));
    visibleTz = allTz.filter(t =>
      accessibleBoards.includes(t.board_id) ||
      t.assignee_id === user.id ||
      t.created_by_id === user.id
    );
  }

  // TZ by status
  const statusCounts = {};
  for (const tz of visibleTz) statusCounts[tz.status] = (statusCounts[tz.status] || 0) + 1;

  // TZ by priority
  const prioCounts = {};
  for (const tz of visibleTz) prioCounts[tz.priority || 'medium'] = (prioCounts[tz.priority || 'medium'] || 0) + 1;

  // TZ by type
  const typeCounts = {};
  for (const tz of visibleTz) typeCounts[tz.type || 'ТЗ'] = (typeCounts[tz.type || 'ТЗ'] || 0) + 1;

  // TZ by assignee (top 10)
  const byAssignee = {};
  for (const tz of visibleTz) {
    if (tz.assignee_id) {
      const u = users.find(u2 => u2.id === tz.assignee_id);
      const name = u ? u.fullName : (tz.owner || '?');
      byAssignee[name] = (byAssignee[name] || 0) + 1;
    }
  }
  const topAssignees = Object.entries(byAssignee).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Overdue / deadline soon / no dates
  const now = new Date();
  const getOrd = makeBoardOrdCache(boards);
  let overdue = 0, deadlineSoon = 0, noDeadline = 0;
  for (const tz of visibleTz) {
    if (['production', 'cancelled', 'done'].includes(tz.status)) continue;
    const flags = computeTzFlags(tz, getOrd(tz.board_id));
    if (flags.overdue) overdue++;
    if (flags.deadline_soon) deadlineSoon++;
    if (flags.no_dates) noDeadline++;
  }

  // Created per week (last 12 weeks)
  const nowMs = Date.now();
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  const createdPerWeek = [];
  for (let w = 11; w >= 0; w--) {
    const weekStart = nowMs - (w + 1) * weekMs;
    const weekEnd = nowMs - w * weekMs;
    const count = visibleTz.filter(t => {
      const ts = new Date(t.created_at).getTime();
      return ts >= weekStart && ts < weekEnd;
    }).length;
    const label = new Date(weekEnd).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    createdPerWeek.push({ label, count });
  }

  // Cycle time (created -> done/production) in days
  const doneTz = visibleTz.filter(t => ['production', 'release', 'done'].includes(t.status));
  const cycleTimes = [];
  for (const t of doneTz) {
    const created = new Date(t.created_at).getTime();
    const relevantHistory = history.filter(h => h.tz_id === t.id && ['production', 'release', 'done'].includes(h.new_status));
    if (relevantHistory.length) {
      const doneAt = new Date(relevantHistory[relevantHistory.length - 1].changed_at).getTime();
      cycleTimes.push(Math.round((doneAt - created) / (24 * 60 * 60 * 1000)));
    }
  }
  const avgCycleTime = cycleTimes.length ? Math.round(cycleTimes.reduce((a, b) => a + b, 0) / cycleTimes.length) : 0;

  // Bookings today
  const today = now.toISOString().slice(0, 10);
  const todayBookings = bookings.filter(b => b.date === today).length;

  // Total stats
  const totalUsers = users.length;
  const totalTz = visibleTz.length;
  const activeTz = visibleTz.filter(t => !['production', 'cancelled', 'done', 'draft'].includes(t.status)).length;

  return res.json({
    totalUsers,
    totalTz,
    activeTz,
    totalDone: doneTz.length,
    overdue,
    deadlineSoon,
    noDeadline,
    todayBookings,
    avgCycleTime,
    statusCounts,
    prioCounts,
    typeCounts,
    topAssignees,
    createdPerWeek
  });
});

/* ── SPA fallback ── */

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

fs.mkdir(kbImagesDir, { recursive: true }).catch(() => {});

migrateUsers()
  .then(() => migrateBoards())
  .then(() => migrateRoles())
  .then(() => migrateTzLinks())
  .then(() => {
    app.listen(port, () => {
      console.log(`LKDS portal started on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Migration failed, aborting:', err);
    process.exit(1);
  });
