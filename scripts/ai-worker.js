import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeTzFlags, TZ_STATUS_LABELS, buildStatusOrd } from '../server/utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const TASKS_FILE = path.join(rootDir, 'data', 'ai-tasks.json');
const TZ_FILE = path.join(rootDir, 'data', 'tz.json');
const BOARDS_FILE = path.join(rootDir, 'data', 'boards.json');
const BOOKINGS_FILE = path.join(rootDir, 'data', 'bookings.json');
const ROOMS_FILE = path.join(rootDir, 'data', 'rooms.json');
const USERS_FILE = path.join(rootDir, 'data', 'users.json');
const CLAUDE_BIN = process.env.CLAUDE_BIN || '/home/plg/.nvm/versions/node/v20.19.4/bin/claude';
const POLL_INTERVAL = Number(process.env.WORKER_POLL_MS) || 30000;
const TASK_TIMEOUT = 300000;

/* ── Telegram helpers ── */

function escHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function sendTelegram(chatId, text) {
  const token = process.env.TG_BOT_TOKEN;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
  } catch (err) {
    log(`[tg] send failed: ${err.message}`);
  }
}

/* ── Morning TZ digest ── */

let lastDigestDate = null;

function shouldRunDigest() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const hours = now.getHours();
  return hours >= 9 && lastDigestDate !== today;
}

async function sendTzDigest() {
  const today = new Date().toISOString().slice(0, 10);
  lastDigestDate = today;

  const adminIds = (process.env.TG_ADMIN_IDS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!adminIds.length) return;

  let allTz, boards;
  try {
    allTz = JSON.parse(await fs.readFile(TZ_FILE, 'utf8'));
    boards = JSON.parse(await fs.readFile(BOARDS_FILE, 'utf8'));
  } catch {
    return;
  }

  // Build board ord cache for dynamic flags
  const ordCache = new Map();
  const getOrd = (boardId) => {
    if (!boardId) return undefined;
    if (ordCache.has(boardId)) return ordCache.get(boardId);
    const board = boards.find(b => b.id === boardId);
    const ord = board ? buildStatusOrd(board.columns) : undefined;
    ordCache.set(boardId, ord);
    return ord;
  };

  const withFlags = allTz.map((tz) => ({ ...tz, flags: computeTzFlags(tz, getOrd(tz.board_id)) }));
  const active = withFlags.filter((t) => !['cancelled', 'production', 'partial'].includes(t.status));

  const overdue = active.filter((t) => t.flags.overdue);
  const soon = active.filter((t) => t.flags.deadline_soon);
  const missing = active.filter((t) => t.flags.missing_deadline);

  const statusCounts = {};
  for (const tz of allTz) statusCounts[tz.status] = (statusCounts[tz.status] || 0) + 1;
  const inWork = allTz.filter((t) => !['draft', 'cancelled', 'production', 'partial'].includes(t.status)).length;

  const [d, m, y] = today.split('-').reverse();
  const dateStr = `${d}.${m}.${y}`;

  let text = `📋 <b>Дайджест ТЗ — ${dateStr}</b>\n`;

  if (overdue.length) {
    text += `\n🔴 <b>Просрочено: ${overdue.length}</b>\n`;
    for (const t of overdue.slice(0, 5)) {
      const deadline = t.flags.analysis_overdue ? `анализ до ${t.date_analysis_deadline}`
        : t.flags.dev_overdue ? `разработка до ${t.date_dev_deadline}`
        : `релиз до ${t.date_release_deadline}`;
      text += `  • <code>${escHtml(t.tz_code)}</code> «${escHtml(t.title)}» — ${deadline} | owner: ${escHtml(t.owner || '—')}\n`;
    }
  }

  if (soon.length) {
    text += `\n⚠️ <b>Скоро дедлайн (≤7 дней): ${soon.length}</b>\n`;
    for (const t of soon.slice(0, 5)) {
      const deadline = (t.flags.analysis_overdue === false && t.date_analysis_deadline) ? t.date_analysis_deadline
        : t.date_dev_deadline || t.date_release_deadline || '';
      text += `  • <code>${escHtml(t.tz_code)}</code> «${escHtml(t.title)}» — до ${deadline}\n`;
    }
  }

  if (missing.length) {
    text += `\n🟣 <b>Неполный дедлайн: ${missing.length}</b>\n`;
    for (const t of missing.slice(0, 3)) {
      const board = boards.find(b => b.id === t.board_id);
      const boardLabels = board ? Object.fromEntries(board.columns.map(c => [c.id, c.name])) : TZ_STATUS_LABELS;
      const phase = boardLabels[t.status] || t.status;
      text += `  • <code>${escHtml(t.tz_code)}</code> «${escHtml(t.title)}» — в ${phase.toLowerCase()}, нет дедлайна\n`;
    }
  }

  if (!overdue.length && !soon.length && !missing.length) {
    text += '\n✅ Все дедлайны в порядке\n';
  }

  text += `\n📊 Всего ТЗ: ${allTz.length} | В работе: ${inWork} | Завершено: ${statusCounts.production || 0} | Прод (частично): ${statusCounts.partial || 0} | Черновик: ${statusCounts.draft || 0}`;

  for (const id of adminIds) {
    await sendTelegram(id, text);
  }
  log(`[digest] sent to ${adminIds.length} admin(s)`);
}

function log(msg) {
  console.log(`[${new Date().toISOString()}] ${msg}`);
}

async function readTasks() {
  try {
    const raw = await fs.readFile(TASKS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeTasks(tasks) {
  await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');
}

function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    delete env.CLAUDECODE;
    let stdout = '';
    let stderr = '';
    const proc = spawn(
      CLAUDE_BIN,
      ['-p', prompt, '--max-turns', '5', '--dangerously-skip-permissions'],
      { cwd: rootDir, env, stdio: ['pipe', 'pipe', 'pipe'] }
    );
    proc.stdin.end();
    proc.stdout.on('data', (d) => { stdout += d; });
    proc.stderr.on('data', (d) => { stderr += d; log(`stderr: ${d.toString().trim()}`); });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      setTimeout(() => proc.kill('SIGKILL'), 5000);
      reject(new Error('Таймаут: задача выполнялась дольше 5 минут'));
    }, TASK_TIMEOUT);

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve(stdout);
      } else {
        reject(new Error(stderr || `Процесс завершился с кодом ${code}`));
      }
    });
    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function poll() {
  try {
    const tasks = await readTasks();
    const pending = tasks.find((t) => t.status === 'pending');
    if (!pending) return;

    log(`Starting task ${pending.id}: ${pending.prompt.slice(0, 80)}...`);

    pending.status = 'running';
    pending.started_at = new Date().toISOString();
    await writeTasks(tasks);

    try {
      const result = await runClaude(pending.prompt);
      // Re-read to avoid overwriting concurrent changes
      const fresh = await readTasks();
      const task = fresh.find((t) => t.id === pending.id);
      if (task) {
        task.status = 'done';
        task.result = result.trim();
        task.finished_at = new Date().toISOString();
        await writeTasks(fresh);
      }
      log(`Task ${pending.id} done (${task ? task.result.length : 0} chars)`);
    } catch (err) {
      const fresh = await readTasks();
      const task = fresh.find((t) => t.id === pending.id);
      if (task) {
        task.status = 'error';
        task.result = err.message;
        task.finished_at = new Date().toISOString();
        await writeTasks(fresh);
      }
      log(`Task ${pending.id} error: ${err.message}`);
    }
  } catch (err) {
    log(`Poll error: ${err.message}`);
  }
}

/* ── Booking reminders (15 min before) ── */

const _sentReminders = new Set();

async function checkBookingReminders() {
  let bookings, rooms, users;
  try {
    bookings = JSON.parse(await fs.readFile(BOOKINGS_FILE, 'utf8'));
    rooms = JSON.parse(await fs.readFile(ROOMS_FILE, 'utf8'));
    users = JSON.parse(await fs.readFile(USERS_FILE, 'utf8'));
  } catch { return; }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const nowHour = now.getHours() + now.getMinutes() / 60;
  const fmtH = (v) => { const h = Math.floor(v); const m = v % 1 ? '30' : '00'; return `${String(h).padStart(2,'0')}:${m}`; };

  for (const bk of bookings) {
    if (bk.date !== today) continue;
    const key = `${bk.id}_${bk.date}`;
    if (_sentReminders.has(key)) continue;

    const minsUntil = (bk.startHour - nowHour) * 60;
    if (minsUntil > 0 && minsUntil <= 15) {
      _sentReminders.add(key);
      const roomName = rooms.find(r => r.id === bk.roomId)?.name || bk.roomId;
      const msg =
        `⏰ <b>Напоминание: встреча через ${Math.round(minsUntil)} мин</b>\n` +
        `Комната: ${escHtml(roomName)}\n` +
        `Время: ${fmtH(bk.startHour)}–${fmtH(bk.endHour)}\n` +
        `Тема: ${escHtml(bk.topic)}\n` +
        `Участник: ${escHtml(bk.fullName)}`;

      // Send to booking creator if they have tgChatId
      const user = users.find(u => u.id === bk.userId);
      if (user?.tgChatId) {
        await sendTelegram(user.tgChatId, msg);
        log(`[reminder] sent to user for booking ${bk.id} (${roomName}, ${fmtH(bk.startHour)})`);
      } else {
        log(`[reminder] user ${bk.fullName} has no tgChatId, skipping booking ${bk.id}`);
      }
    }
  }

  // Cleanup old reminder keys daily
  if (_sentReminders.size > 200) _sentReminders.clear();
}

async function tick() {
  await poll();
  if (shouldRunDigest()) {
    try { await sendTzDigest(); } catch (err) { log(`[digest] error: ${err.message}`); }
  }
  try { await checkBookingReminders(); } catch (err) { log(`[reminder] error: ${err.message}`); }
}

log('AI Worker started');
setInterval(tick, POLL_INTERVAL);
tick();
