/* ── SVG icons ── */
const ICONS = {
  headset: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  chat: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  globe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
};

/* ── DOM ── */
const $ = (id) => document.getElementById(id);

const authScreen = $('authScreen');
const mainScreen = $('mainScreen');
const loginForm = $('loginForm');
const pinInput = $('pinInput');
const loginMessage = $('loginMessage');
const registerForm = $('registerForm');
const registerMessage = $('registerMessage');
const userGreeting = $('userGreeting');
const logoutBtn = $('logoutBtn');
const adminBtn = $('adminBtn');

const roomSelect = $('roomSelect');
const dateInput = $('dateInput');
const refreshBtn = $('refreshBtn');
const scheduleGrid = $('scheduleGrid');
const bookingMessage = $('bookingMessage');

const ticketForm = $('ticketForm');
const ticketType = $('ticketType');
const ticketModule = $('ticketModule');
const ticketCategory = $('ticketCategory');
const categoryLabel = $('categoryLabel');
const ticketMessage = $('ticketMessage');

const bookingPopup = $('bookingPopup');
const popupBookingForm = $('popupBookingForm');
const popupStartHour = $('popupStartHour');
const popupEndHour = $('popupEndHour');
const popupCancel = $('popupCancel');
const popupMessage = $('popupMessage');

const suggestBtn = $('suggestBtn');
const suggestPopup = $('suggestPopup');
const suggestForm = $('suggestForm');
const suggestCancel = $('suggestCancel');
const suggestMessage = $('suggestMessage');

const linksGrid = $('linksGrid');
const adminContent = $('adminContent');

/* ── State ── */
const state = {
  pin: null,
  user: null,
  isAdmin: false,
  settings: { startHour: 8, endHour: 21 },
  rooms: [],
  bookings: [],
  crmConfig: { modules: [], errorCategories: [] }
};

/* ── Helpers ── */

function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function msg(el, text, type = '') {
  el.textContent = text;
  el.className = `message ${type}`.trim();
}

function esc(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

async function api(url, opts = {}) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Ошибка запроса');
  return data;
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
function pad(n) { return String(n).padStart(2, '0'); }

/* ── Tabs ── */

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    $('panel' + tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)).classList.add('active');
  });
});

/* ── Auth ── */

async function tryAutoLogin() {
  const saved = localStorage.getItem('lkds_pin');
  if (!saved) return false;
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: saved })
    });
    state.pin = data.pin;
    state.user = { fullName: data.fullName, contact: data.contact };
    state.isAdmin = !!data.admin;
    return true;
  } catch {
    localStorage.removeItem('lkds_pin');
    return false;
  }
}

function showMain() {
  hide(authScreen);
  show(mainScreen);
  userGreeting.textContent = state.user.fullName;
  if (state.isAdmin) show(adminBtn);
  else hide(adminBtn);
}

function showAuth() {
  show(authScreen);
  hide(mainScreen);
  state.pin = null;
  state.user = null;
  state.isAdmin = false;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(loginMessage, '');
  try {
    const data = await api('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pinInput.value.trim() })
    });
    state.pin = data.pin;
    state.user = { fullName: data.fullName, contact: data.contact };
    state.isAdmin = !!data.admin;
    localStorage.setItem('lkds_pin', data.pin);
    showMain();
    await loadApp();
  } catch (err) {
    msg(loginMessage, err.message, 'error');
  }
});

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(registerMessage, '');
  const fd = new FormData(registerForm);
  try {
    const data = await api('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(fd.entries()))
    });
    state.pin = data.pin;
    state.user = { fullName: data.fullName, contact: data.contact };
    state.isAdmin = false;
    localStorage.setItem('lkds_pin', data.pin);
    msg(registerMessage, 'Регистрация прошла успешно!', 'success');
    registerForm.reset();
    setTimeout(() => { showMain(); loadApp(); }, 1500);
  } catch (err) {
    msg(registerMessage, err.message, 'error');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('lkds_pin');
  showAuth();
  pinInput.value = '';
  msg(loginMessage, '');
});

/* ── Load app ── */

async function loadApp() {
  const [settings, rooms, links, crmConfig] = await Promise.all([
    api('/api/settings'), api('/api/rooms'), api('/api/links'), api('/api/crm-config')
  ]);
  state.settings = settings;
  state.rooms = rooms;
  state.crmConfig = crmConfig;

  renderRooms();
  renderLinks(links);
  renderCrmConfig();

  dateInput.value = getToday();
  await loadBookings();
}

/* ── Rooms ── */

function renderRooms() {
  roomSelect.innerHTML = state.rooms
    .map((r) => `<option value="${esc(r.id)}">${esc(r.name)}</option>`).join('');
}

/* ── Links ── */

function renderLinks(links) {
  linksGrid.innerHTML = links.map((l) => {
    const icon = ICONS[l.icon] || ICONS.globe;
    const cls = l.disabled ? 'link-btn disabled' : 'link-btn';
    const href = l.disabled ? '#' : esc(l.url);
    const target = l.disabled ? '' : 'target="_blank" rel="noreferrer"';
    const badge = l.disabled ? '<span class="badge-dev">В разработке</span>' : '';
    return `<a class="${cls}" href="${href}" ${target}>
      <div class="link-icon icon-${esc(l.icon)}">${icon}</div>
      <div class="link-text">
        <span class="link-title">${esc(l.title)}${badge}</span>
        <span class="link-desc">${esc(l.desc)}</span>
      </div>
      <span class="link-arrow">${ICONS.arrow}</span>
    </a>`;
  }).join('');
}

/* ── Schedule ── */

async function loadBookings() {
  const roomId = roomSelect.value;
  const date = dateInput.value;
  if (!roomId || !date) return;
  state.bookings = await api(`/api/bookings?roomId=${encodeURIComponent(roomId)}&date=${encodeURIComponent(date)}`);
  renderSchedule();
}

function renderSchedule() {
  const { startHour, endHour } = state.settings;
  let html = '';
  for (let h = startHour; h < endHour; h++) {
    const label = `${pad(h)}:00 – ${pad(h+1)}:00`;
    const bk = state.bookings.find((b) => b.startHour <= h && b.endHour > h);
    if (bk) {
      const isFirst = bk.startHour === h;
      const span = isFirst ? `${pad(bk.startHour)}:00–${pad(bk.endHour)}:00` : '';
      html += `<div class="slot-row">
        <div class="slot-time">${label}</div>
        <div class="slot-status busy">
          ${esc(bk.topic)}
          <span class="slot-info">${esc(bk.fullName)} · ${esc(bk.contact)}${span ? ' · ' + span : ''}</span>
        </div>
      </div>`;
    } else {
      html += `<div class="slot-row">
        <div class="slot-time">${label}</div>
        <div class="slot-status free clickable" data-hour="${h}">Свободно</div>
      </div>`;
    }
  }
  scheduleGrid.innerHTML = html;
  scheduleGrid.querySelectorAll('.clickable').forEach((el) => {
    el.addEventListener('click', () => openBookingPopup(Number(el.dataset.hour)));
  });
}

/* ── Booking popup ── */

function getMaxEndHour(from) {
  const { endHour } = state.settings;
  for (let h = from + 1; h <= endHour; h++) {
    if (state.bookings.some((b) => b.startHour < h && b.endHour > h - 1 && b.startHour !== from)) {
      return h > from + 1 ? h : from + 1;
    }
  }
  return endHour;
}

function openBookingPopup(hour) {
  const maxEnd = getMaxEndHour(hour);
  popupStartHour.innerHTML = `<option value="${hour}">${pad(hour)}:00</option>`;
  let opts = '';
  for (let h = hour + 1; h <= maxEnd; h++) {
    const isBusy = state.bookings.some((b) => b.startHour < h && b.endHour > h - 1);
    if (isBusy) break;
    opts += `<option value="${h}">${pad(h)}:00</option>`;
  }
  if (!opts) opts = `<option value="${hour+1}">${pad(hour+1)}:00</option>`;
  popupEndHour.innerHTML = opts;
  popupBookingForm.reset();
  popupBookingForm.topic.value = '';
  msg(popupMessage, '');
  show(bookingPopup);
}

popupCancel.addEventListener('click', () => hide(bookingPopup));
bookingPopup.addEventListener('click', (e) => { if (e.target === bookingPopup) hide(bookingPopup); });

popupBookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(popupMessage, '');
  try {
    await api('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: state.pin,
        roomId: roomSelect.value,
        date: dateInput.value,
        startHour: Number(popupStartHour.value),
        endHour: Number(popupEndHour.value),
        topic: popupBookingForm.topic.value.trim()
      })
    });
    hide(bookingPopup);
    msg(bookingMessage, 'Записано!', 'success');
    await loadBookings();
  } catch (err) {
    msg(popupMessage, err.message, 'error');
  }
});

refreshBtn.addEventListener('click', () => loadBookings().catch((e) => msg(bookingMessage, e.message, 'error')));
roomSelect.addEventListener('change', () => loadBookings().catch((e) => msg(bookingMessage, e.message, 'error')));
dateInput.addEventListener('change', () => loadBookings().catch((e) => msg(bookingMessage, e.message, 'error')));

/* ── Suggest popup ── */

suggestBtn.addEventListener('click', () => { suggestForm.reset(); msg(suggestMessage, ''); show(suggestPopup); });
suggestCancel.addEventListener('click', () => hide(suggestPopup));
suggestPopup.addEventListener('click', (e) => { if (e.target === suggestPopup) hide(suggestPopup); });

suggestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(suggestMessage, '');
  try {
    const result = await api('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, text: suggestForm.text.value.trim() })
    });
    suggestForm.reset();
    msg(suggestMessage, result.message, 'success');
    setTimeout(() => hide(suggestPopup), 1500);
  } catch (err) {
    msg(suggestMessage, err.message, 'error');
  }
});

/* ── CRM Tickets ── */

function renderCrmConfig() {
  ticketModule.innerHTML = state.crmConfig.modules.map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join('');
  ticketCategory.innerHTML = state.crmConfig.errorCategories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
}

ticketType.addEventListener('change', () => {
  if (ticketType.value === 'suggestion') { hide(categoryLabel); ticketCategory.removeAttribute('required'); }
  else { show(categoryLabel); ticketCategory.setAttribute('required', ''); }
});

ticketForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(ticketMessage, '');
  const fd = Object.fromEntries(new FormData(ticketForm).entries());
  fd.pin = state.pin;
  if (fd.type === 'suggestion') delete fd.category;
  try {
    const result = await api('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fd)
    });
    ticketForm.reset();
    ticketType.dispatchEvent(new Event('change'));
    msg(ticketMessage, result.message, 'success');
  } catch (err) {
    msg(ticketMessage, err.message, 'error');
  }
});

/* ── Admin panel ── */

adminBtn.addEventListener('click', () => {
  /* switch to admin tab */
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  $('panelAdmin').classList.add('active');
  loadAdminData('bookings');
});

document.querySelectorAll('.admin-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab').forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    loadAdminData(tab.dataset.atab);
  });
});

async function loadAdminData(type) {
  try {
    const data = await api(`/api/admin/${type}?pin=${encodeURIComponent(state.pin)}`);
    renderAdminTable(type, data);
  } catch (err) {
    adminContent.innerHTML = `<p class="message error">${esc(err.message)}</p>`;
  }
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function renderAdminTable(type, data) {
  if (!data.length) {
    adminContent.innerHTML = '<p class="admin-empty">Пока пусто</p>';
    return;
  }

  let html = '<table class="admin-table">';

  if (type === 'bookings') {
    html += '<tr><th>Дата</th><th>Время</th><th>Тема</th><th>Кто</th><th>Контакт</th></tr>';
    for (const b of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      html += `<tr>
        <td>${esc(b.date)}</td>
        <td>${pad(b.startHour)}:00–${pad(b.endHour)}:00</td>
        <td>${esc(b.topic)}</td>
        <td>${esc(b.fullName)}</td>
        <td>${esc(b.contact)}</td>
      </tr>`;
    }
  } else if (type === 'tickets') {
    html += '<tr><th>Дата</th><th>Тип</th><th>Модуль</th><th>Категория</th><th>Описание</th><th>Кто</th></tr>';
    for (const t of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      const label = t.type === 'error' ? 'Ошибка' : 'Предложение';
      html += `<tr>
        <td style="white-space:nowrap">${fmtDate(t.createdAt)}</td>
        <td>${label}</td>
        <td>${esc(t.module)}</td>
        <td>${esc(t.category)}</td>
        <td class="desc-cell">${esc(t.description)}</td>
        <td>${esc(t.fullName)}</td>
      </tr>`;
    }
  } else if (type === 'suggestions') {
    html += '<tr><th>Дата</th><th>Идея</th><th>Кто</th><th>Контакт</th></tr>';
    for (const s of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      html += `<tr>
        <td style="white-space:nowrap">${fmtDate(s.createdAt)}</td>
        <td class="desc-cell">${esc(s.text)}</td>
        <td>${esc(s.fullName)}</td>
        <td>${esc(s.contact)}</td>
      </tr>`;
    }
  } else if (type === 'users') {
    html += '<tr><th>Пин</th><th>ФИО</th><th>Контакт</th><th>Дата регистрации</th></tr>';
    for (const u of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      html += `<tr>
        <td>${esc(u.pin)}</td>
        <td>${esc(u.fullName)}</td>
        <td>${esc(u.contact)}</td>
        <td style="white-space:nowrap">${fmtDate(u.createdAt)}</td>
      </tr>`;
    }
  }

  html += '</table>';
  adminContent.innerHTML = html;
}

/* ── Init ── */

(async () => {
  const loggedIn = await tryAutoLogin();
  if (loggedIn) { showMain(); await loadApp(); }
  else { showAuth(); }
})();
