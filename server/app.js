import dotenv from 'dotenv';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, 'data');
const publicDir = path.join(rootDir, 'public');

const app = express();
const port = Number(process.env.PORT) || 3000;
const publicBaseUrl = process.env.PUBLIC_BASE_URL || 'https://temp-booking.example.com';

const FILES = {
  rooms: path.join(dataDir, 'rooms.json'),
  links: path.join(dataDir, 'links.json'),
  bookings: path.join(dataDir, 'bookings.json'),
  crmRequests: path.join(dataDir, 'crm-requests.json')
};

const TELEGRAM_REGEX = /^@[A-Za-z0-9_]{3,64}$/;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(publicDir));

async function readJson(filePath, fallback = []) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function writeJson(filePath, value) {
  const json = JSON.stringify(value, null, 2);
  await fs.writeFile(filePath, json + '\n', 'utf-8');
}

function isValidDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date);
}

function toHour(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : NaN;
}

function hasOverlap(existing, candidate) {
  return existing.startHour < candidate.endHour && candidate.startHour < existing.endHour;
}

function validateBookingInput(payload) {
  const fullName = String(payload.fullName || '').trim();
  const telegram = String(payload.telegram || '').trim();
  const roomId = String(payload.roomId || '').trim();
  const date = String(payload.date || '').trim();
  const startHour = toHour(payload.startHour);
  const endHour = toHour(payload.endHour);
  const topic = String(payload.topic || '').trim();

  if (!fullName || fullName.length < 3) {
    return 'Укажите ФИО (минимум 3 символа).';
  }
  if (!TELEGRAM_REGEX.test(telegram)) {
    return 'Укажите Telegram в формате @username.';
  }
  if (!roomId) {
    return 'Выберите переговорку.';
  }
  if (!isValidDate(date)) {
    return 'Дата должна быть в формате YYYY-MM-DD.';
  }
  if (!Number.isInteger(startHour) || !Number.isInteger(endHour)) {
    return 'Часы бронирования должны быть целыми.';
  }
  if (startHour < 8 || endHour > 21 || startHour >= endHour) {
    return 'Интервал должен быть в пределах 08:00-21:00.';
  }
  if (!topic) {
    return 'Укажите цель встречи.';
  }

  return null;
}

function validateCrmInput(payload) {
  const fullName = String(payload.fullName || '').trim();
  const telegram = String(payload.telegram || '').trim();
  const title = String(payload.title || '').trim();
  const description = String(payload.description || '').trim();
  const priority = String(payload.priority || '').trim() || 'normal';

  if (!fullName || fullName.length < 3) {
    return 'Укажите ФИО (минимум 3 символа).';
  }
  if (!TELEGRAM_REGEX.test(telegram)) {
    return 'Укажите Telegram в формате @username.';
  }
  if (!title || title.length < 5) {
    return 'Кратко опишите проблему (минимум 5 символов).';
  }
  if (!description || description.length < 10) {
    return 'Добавьте подробности (минимум 10 символов).';
  }
  if (!['low', 'normal', 'high', 'critical'].includes(priority)) {
    return 'Некорректный приоритет.';
  }

  return null;
}

app.get('/api/settings', (_req, res) => {
  res.json({
    publicBaseUrl,
    startHour: 8,
    endHour: 21,
    appName: 'Бронирование переговорок'
  });
});

app.get('/api/rooms', async (_req, res) => {
  const rooms = await readJson(FILES.rooms, []);
  res.json(rooms);
});

app.get('/api/links', async (_req, res) => {
  const links = await readJson(FILES.links, []);
  res.json(links);
});

app.get('/api/bookings', async (req, res) => {
  const roomId = String(req.query.roomId || '').trim();
  const date = String(req.query.date || '').trim();

  if (!roomId || !isValidDate(date)) {
    return res.status(400).json({ message: 'Передайте roomId и date (YYYY-MM-DD).' });
  }

  const bookings = await readJson(FILES.bookings, []);
  const result = bookings
    .filter((item) => item.roomId === roomId && item.date === date)
    .sort((a, b) => a.startHour - b.startHour);

  return res.json(result);
});

app.post('/api/bookings', async (req, res) => {
  const error = validateBookingInput(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const rooms = await readJson(FILES.rooms, []);
  const roomExists = rooms.some((room) => room.id === req.body.roomId);
  if (!roomExists) {
    return res.status(404).json({ message: 'Переговорка не найдена.' });
  }

  const bookings = await readJson(FILES.bookings, []);
  const candidate = {
    id: randomUUID(),
    roomId: req.body.roomId,
    date: req.body.date,
    startHour: Number(req.body.startHour),
    endHour: Number(req.body.endHour),
    fullName: String(req.body.fullName).trim(),
    telegram: String(req.body.telegram).trim(),
    topic: String(req.body.topic).trim(),
    createdAt: new Date().toISOString()
  };

  const overlap = bookings.find(
    (item) => item.roomId === candidate.roomId && item.date === candidate.date && hasOverlap(item, candidate)
  );

  if (overlap) {
    return res.status(409).json({ message: 'Выбранный интервал уже занят. Выберите другое время.' });
  }

  bookings.push(candidate);
  await writeJson(FILES.bookings, bookings);
  return res.status(201).json(candidate);
});

app.post('/api/crm-requests', async (req, res) => {
  const error = validateCrmInput(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const requests = await readJson(FILES.crmRequests, []);
  const requestItem = {
    id: randomUUID(),
    fullName: String(req.body.fullName).trim(),
    telegram: String(req.body.telegram).trim(),
    title: String(req.body.title).trim(),
    description: String(req.body.description).trim(),
    priority: String(req.body.priority || 'normal').trim(),
    createdAt: new Date().toISOString(),
    source: 'website'
  };

  requests.push(requestItem);
  await writeJson(FILES.crmRequests, requests);

  return res.status(201).json({ message: 'Заявка принята. Спасибо!', id: requestItem.id });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Booking app started on http://localhost:${port}`);
});
