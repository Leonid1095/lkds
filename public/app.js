/* ── SVG icons ── */
const ICONS = {
  headset: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>',
  chat: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  globe: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
};

const DEFAULT_AVATAR = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" fill="none"><rect width="80" height="80" rx="40" fill="%23e2e8f0"/><circle cx="40" cy="30" r="14" fill="%23a0aec0"/><path d="M12 72c0-15.46 12.54-28 28-28s28 12.54 28 28" fill="%23a0aec0"/></svg>');

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
const topbarUser = $('topbarUser');
const topbarAvatar = $('topbarAvatar');
const logoutBtn = $('logoutBtn');
const adminBtn = $('adminBtn');

const roomSelect = $('roomSelect');
const dateInput = $('dateInput');
const refreshBtn = $('refreshBtn');
const scheduleGrid = $('scheduleGrid');
const bookingMessage = $('bookingMessage');

const ticketForm = $('ticketForm');
const ticketModule = $('ticketModule');
const ticketCategory = $('ticketCategory');
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

const cancelPopup = $('cancelPopup');
const cancelPopupInfo = $('cancelPopupInfo');
const cancelEntireBtn = $('cancelEntireBtn');
const cancelSlotBtn = $('cancelSlotBtn');
const cancelDismissBtn = $('cancelDismissBtn');
const cancelPopupMessage = $('cancelPopupMessage');

const editUserPopup = $('editUserPopup');
const editUserForm = $('editUserForm');
const editUserOriginalPin = $('editUserOriginalPin');
const editUserName = $('editUserName');
const editUserContact = $('editUserContact');
const editUserPin = $('editUserPin');
const editUserCancel = $('editUserCancel');
const editUserMessage = $('editUserMessage');

const profilePopup = $('profilePopup');
const profileTitle = $('profileTitle');
const profileAvatar = $('profileAvatar');
const profileAvatarUploadZone = $('profileAvatarUploadZone');
const profileAvatarInput = $('profileAvatarInput');
const avatarUploadContent = $('avatarUploadContent');
const avatarUploadProgress = $('avatarUploadProgress');
const avatarProgressFill = $('avatarProgressFill');
const avatarProgressText = $('avatarProgressText');
const avatarUploadMessage = $('avatarUploadMessage');
const profileName = $('profileName');
const profilePosition = $('profilePosition');
const profilePositionField = $('profilePositionField');
const profileContact = $('profileContact');
const profileContactField = $('profileContactField');
const profileDate = $('profileDate');
const profileSaveBtn = $('profileSaveBtn');
const profileWorkLocation = $('profileWorkLocation');
const profileWorkLocationField = $('profileWorkLocationField');
const profileWorkDesk = $('profileWorkDesk');
const profileWorkDeskField = $('profileWorkDeskField');
const profileCloseBtn = $('profileCloseBtn');
const profileMessage = $('profileMessage');
const profileActions = $('profileActions');

const linksGrid = $('linksGrid');
const itWizard = $('itWizard');
const itTicketMessage = $('itTicketMessage');
const myItTicketsList = $('myItTicketsList');
const adminContent = $('adminContent');

/* ── TZ DOM ── */
const tabTz = $('tabTz');
const tzStatsBar = $('tzStatsBar');
const tzFilters = $('tzFilters');
const tzListContainer = $('tzListContainer');
const tzMessage = $('tzMessage');
const tzPopup = $('tzPopup');
const tzForm = $('tzForm');
const tzPopupTitle = $('tzPopupTitle');
const tzSubmitBtn = $('tzSubmitBtn');
const tzCancelBtn = $('tzCancelBtn');
const tzPopupMessage = $('tzPopupMessage');
const tzStatusRow = $('tzStatusRow');
const tzMeta = $('tzMeta');
const tzHistorySection = $('tzHistorySection');
const tzHistoryList = $('tzHistoryList');

/* ── IT config (loaded from API, fallback hardcoded) ── */

let IT_CATEGORIES = [
  { id: 'software', label: 'ПО/установка',
    subcategories: ['Установить/обновить программу', 'Лицензия/активация', 'Ошибка/вылетает', 'Печать/принтер'] },
  { id: 'hardware', label: 'Компьютер/ноутбук',
    subcategories: ['Тормозит/зависает', 'Не включается', 'Клавиатура/мышь/монитор'] },
  { id: 'network', label: 'Интернет/сеть',
    subcategories: ['Wi-Fi не работает', 'Нет интернета', 'Низкая скорость'] },
  { id: 'vks', label: 'ВКС/Презентация', disabled: true, subcategories: [] },
  { id: 'other', label: 'Другое', subcategories: [] }
];
let IT_LOCATIONS = [
  'Модуль ЖД', 'Модуль КП', 'Офис 2 этаж',
  'Диспетчерская', 'Диспетчеры и операторы КП', 'Приемосдатчик'
];

/* ── State ── */
const state = {
  pin: null,
  user: null,
  userId: null,
  isAdmin: false,
  adminRole: null, // 'superadmin' | 'it_admin' | null
  settings: { startHour: 8, endHour: 21, slotStep: 0.5 },
  rooms: [],
  bookings: [],
  crmConfig: { modules: [], errorCategories: [] },
  itTicket: { step: 1, category: null, subcategory: null, location: null, seat: '', description: '' },
  tzConfig: null,
  tzFilters: { system: '', status: '', type: '', priority: '', search: '', overdue: false, no_dates: false, no_owner: false, deadline_soon: false },
  tzList: [],
  tzEditId: null
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
function fmtTime(t) { const h = Math.floor(t); const m = (t % 1) ? '30' : '00'; return `${pad(h)}:${m}`; }

function avatarUrl(avatar) {
  if (!avatar) return DEFAULT_AVATAR;
  return `/api/avatars/${avatar}?t=${Date.now()}`;
}

/* ── Tabs ── */

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    tab.classList.add('active');
    const panelName = tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1);
    $('panel' + panelName).classList.add('active');
    if (tab.dataset.tab === 'tz') loadTzData();
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
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '',
      workLocation: data.workLocation || '', workDesk: data.workDesk || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.adminRole = data.adminRole || null;
    state.avatar = data.avatar || '';
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
  topbarAvatar.src = avatarUrl(state.avatar);
  topbarAvatar.alt = state.user.fullName;
  if (state.isAdmin) {
    show(adminBtn);
    if (state.adminRole === 'superadmin') updatePinBadge();
  } else {
    hide(adminBtn);
  }
  tabTz.style.display = state.adminRole === 'superadmin' ? '' : 'none';
}

function showAuth() {
  show(authScreen);
  hide(mainScreen);
  state.pin = null;
  state.user = null;
  state.userId = null;
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
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '',
      workLocation: data.workLocation || '', workDesk: data.workDesk || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.adminRole = data.adminRole || null;
    state.avatar = data.avatar || '';
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
    state.user = { fullName: data.fullName, contact: data.contact, position: '' };
    state.isAdmin = false;
    state.avatar = '';
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

/* ── Forgot PIN ── */

const forgotPinBtn = $('forgotPinBtn');
const forgotPinForm = $('forgotPinForm');
const forgotPinName = $('forgotPinName');
const forgotPinContact = $('forgotPinContact');
const forgotPinSend = $('forgotPinSend');
const forgotPinMessage = $('forgotPinMessage');

forgotPinBtn.addEventListener('click', () => {
  forgotPinForm.classList.toggle('hidden');
  msg(forgotPinMessage, '');
});

forgotPinSend.addEventListener('click', async () => {
  const name = forgotPinName.value.trim();
  const contact = forgotPinContact.value.trim();
  if (!name || name.length < 3) { msg(forgotPinMessage, 'Укажите ФИО (минимум 3 символа).', 'error'); return; }
  if (!contact || contact.length < 3) { msg(forgotPinMessage, 'Укажите контакт для связи.', 'error'); return; }
  msg(forgotPinMessage, '');
  forgotPinSend.disabled = true;
  try {
    const result = await api('/api/auth/forgot-pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName: name, contact })
    });
    msg(forgotPinMessage, result.message, 'success');
    forgotPinName.value = '';
    forgotPinContact.value = '';
  } catch (err) {
    msg(forgotPinMessage, err.message, 'error');
  } finally {
    forgotPinSend.disabled = false;
  }
});

/* ── Load app ── */

async function loadApp() {
  const [settings, rooms, links, crmConfig] = await Promise.all([
    api('/api/settings'), api('/api/rooms'), api('/api/links'), api('/api/crm-config')
  ]);
  state.settings = settings;
  state.rooms = rooms;
  state.crmConfig = crmConfig;

  try {
    const itConfig = await api('/api/it-config');
    if (itConfig.categories) IT_CATEGORIES = itConfig.categories;
    if (itConfig.locations) IT_LOCATIONS = itConfig.locations;
  } catch { /* fallback: сервер ещё без /api/it-config */ }

  try {
    state.tzConfig = await api('/api/tz-config');
  } catch { /* no tz-config */ }

  renderRooms();
  renderLinks(links);
  renderCrmConfig();
  resetItWizard();
  loadMyItTickets();

  if (state.adminRole === 'superadmin' && state.tzConfig) {
    renderTzFilters();
  }

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
  const { startHour, endHour, slotStep } = state.settings;
  const step = slotStep || 0.5;
  let html = '';
  for (let t = startHour; t < endHour; t += step) {
    const label = `${fmtTime(t)} – ${fmtTime(t + step)}`;
    const bk = state.bookings.find((b) => b.startHour <= t && b.endHour > t);
    if (bk) {
      const isFirst = bk.startHour === t;
      const span = isFirst ? `${fmtTime(bk.startHour)}–${fmtTime(bk.endHour)}` : '';
      const isOwn = bk.fullName === state.user.fullName;
      const cancelBtn = (isOwn || state.isAdmin)
        ? ` <button class="btn-cancel-slot" data-bid="${bk.id}" data-hour="${t}" title="Отменить">✕</button>` : '';
      html += `<div class="slot-row">
        <div class="slot-time">${label}</div>
        <div class="slot-status busy">
          ${esc(bk.topic)}${cancelBtn}
          <span class="slot-info">
            <a href="#" class="slot-profile-link" data-pin="${esc(bk.pin)}">${esc(bk.fullName)}</a>
            · ${esc(bk.contact)}${span ? ' · ' + span : ''}
          </span>
        </div>
      </div>`;
    } else {
      html += `<div class="slot-row">
        <div class="slot-time">${label}</div>
        <div class="slot-status free clickable" data-hour="${t}">Свободно</div>
      </div>`;
    }
  }
  scheduleGrid.innerHTML = html;
  scheduleGrid.querySelectorAll('.clickable').forEach((el) => {
    el.addEventListener('click', () => openBookingPopup(Number(el.dataset.hour)));
  });
  scheduleGrid.querySelectorAll('.btn-cancel-slot').forEach((el) => {
    el.addEventListener('click', (e) => { e.stopPropagation(); cancelBooking(el.dataset.bid, Number(el.dataset.hour)); });
  });
  scheduleGrid.querySelectorAll('.slot-profile-link').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); openProfile(el.dataset.pin); });
  });
}

/* ── Booking popup ── */

function getMaxEnd(from) {
  const { endHour, slotStep } = state.settings;
  const step = slotStep || 0.5;
  for (let t = from + step; t <= endHour; t += step) {
    if (state.bookings.some((b) => b.startHour < t && b.endHour > t - step && b.startHour !== from)) {
      return t > from + step ? t : from + step;
    }
  }
  return endHour;
}

function openBookingPopup(from) {
  const step = state.settings.slotStep || 0.5;
  const maxEnd = getMaxEnd(from);
  popupStartHour.innerHTML = `<option value="${from}">${fmtTime(from)}</option>`;
  let opts = '';
  for (let t = from + step; t <= maxEnd; t += step) {
    const isBusy = state.bookings.some((b) => b.startHour < t && b.endHour > t - step);
    if (isBusy) break;
    opts += `<option value="${t}">${fmtTime(t)}</option>`;
  }
  if (!opts) opts = `<option value="${from + step}">${fmtTime(from + step)}</option>`;
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

/* ── Cancel booking ── */

function cancelBooking(bookingId, slotHour) {
  const booking = state.bookings.find((b) => b.id === bookingId);
  if (!booking) return;

  const step = state.settings.slotStep || 0.5;
  const slotCount = (booking.endHour - booking.startHour) / step;

  if (slotCount <= 1 || isNaN(slotHour)) {
    if (!confirm('Отменить бронирование?')) return;
    doFullCancel(bookingId);
    return;
  }

  const bookingRange = `${fmtTime(booking.startHour)}–${fmtTime(booking.endHour)}`;
  const slotRange = `${fmtTime(slotHour)}–${fmtTime(slotHour + step)}`;

  cancelPopupInfo.innerHTML =
    `Бронирование: <strong>${esc(booking.topic)}</strong> (${bookingRange})<br>` +
    `Выбранный слот: <strong>${slotRange}</strong>`;

  cancelPopup._bookingId = bookingId;
  cancelPopup._slotHour = slotHour;
  msg(cancelPopupMessage, '');

  cancelEntireBtn.textContent = `Отменить всё (${bookingRange})`;
  cancelSlotBtn.textContent = `Отменить только ${slotRange}`;

  show(cancelPopup);
}

async function doFullCancel(bookingId) {
  try {
    await api(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    msg(bookingMessage, 'Бронирование отменено.', 'success');
    hide(cancelPopup);
    await loadBookings();
  } catch (err) {
    msg(cancelPopupMessage, err.message, 'error');
  }
}

async function doSlotCancel(bookingId, slotHour) {
  try {
    await api(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, cancelHour: slotHour })
    });
    msg(bookingMessage, 'Слот отменён.', 'success');
    hide(cancelPopup);
    await loadBookings();
  } catch (err) {
    msg(cancelPopupMessage, err.message, 'error');
  }
}

cancelEntireBtn.addEventListener('click', () => doFullCancel(cancelPopup._bookingId));
cancelSlotBtn.addEventListener('click', () => doSlotCancel(cancelPopup._bookingId, cancelPopup._slotHour));
cancelDismissBtn.addEventListener('click', () => hide(cancelPopup));
cancelPopup.addEventListener('click', (e) => { if (e.target === cancelPopup) hide(cancelPopup); });

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

/* ── Profile popup ── */

let profileViewPin = null;

topbarUser.addEventListener('click', () => openProfile(state.pin));

async function openProfile(pin) {
  profileViewPin = pin;
  const isOwn = pin === state.pin;
  msg(profileMessage, '');

  try {
    const data = await api(`/api/profile/${pin}?requester=${encodeURIComponent(state.pin)}`);

    profileTitle.textContent = isOwn ? 'Мой профиль' : 'Профиль';
    profileName.textContent = data.fullName;
    profileAvatar.src = avatarUrl(data.avatar);
    profilePosition.value = data.position || '';
    profileContact.value = data.contact || '';
    profileDate.textContent = fmtDate(data.createdAt);

    // Workplace fields
    profileWorkLocation.innerHTML = '<option value="">Не указано</option>' +
      IT_LOCATIONS.map((l) => `<option value="${esc(l)}"${l === data.workLocation ? ' selected' : ''}>${esc(l)}</option>`).join('');
    profileWorkDesk.value = data.workDesk || '';

    // Show/hide desk field based on location
    const showDesk = data.workLocation === 'Офис 2 этаж';
    if (showDesk) show(profileWorkDeskField); else hide(profileWorkDeskField);

    msg(avatarUploadMessage, '');
    hide(avatarUploadProgress);
    show(avatarUploadContent);
    avatarProgressFill.style.width = '0%';

    if (isOwn) {
      show(profileAvatarUploadZone);
      show(profileSaveBtn);
      show(profileWorkLocationField);
      profilePosition.removeAttribute('readonly');
      profileContact.removeAttribute('readonly');
      profileWorkLocation.removeAttribute('disabled');
      profileWorkDesk.removeAttribute('readonly');
    } else {
      hide(profileAvatarUploadZone);
      hide(profileSaveBtn);
      if (data.workLocation) show(profileWorkLocationField); else hide(profileWorkLocationField);
      profilePosition.setAttribute('readonly', '');
      profileContact.setAttribute('readonly', '');
      profileWorkLocation.setAttribute('disabled', '');
      profileWorkDesk.setAttribute('readonly', '');
    }

    show(profilePopup);
  } catch (err) {
    msg(bookingMessage, err.message, 'error');
  }
}

profileCloseBtn.addEventListener('click', () => hide(profilePopup));
profilePopup.addEventListener('click', (e) => { if (e.target === profilePopup) hide(profilePopup); });

profileWorkLocation.addEventListener('change', () => {
  if (profileWorkLocation.value === 'Офис 2 этаж') show(profileWorkDeskField);
  else { hide(profileWorkDeskField); profileWorkDesk.value = ''; }
});

profileSaveBtn.addEventListener('click', async () => {
  msg(profileMessage, '');
  try {
    const result = await api('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: state.pin,
        contact: profileContact.value.trim(),
        position: profilePosition.value.trim(),
        workLocation: profileWorkLocation.value,
        workDesk: profileWorkDesk.value.trim()
      })
    });
    state.user.contact = result.contact;
    state.user.position = result.position;
    state.user.workLocation = result.workLocation || '';
    state.user.workDesk = result.workDesk || '';
    msg(profileMessage, result.message, 'success');
  } catch (err) {
    msg(profileMessage, err.message, 'error');
  }
});

/* ── Avatar upload with drag&drop and progress ── */

function uploadAvatar(file) {
  if (!file) return;

  // Validate on client side
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) {
    msg(avatarUploadMessage, 'Формат не поддерживается. Используйте JPG, PNG или WebP.', 'error');
    return;
  }
  if (file.size > 2 * 1024 * 1024) {
    msg(avatarUploadMessage, `Файл слишком большой (${(file.size / 1024 / 1024).toFixed(1)} МБ). Максимум 2 МБ.`, 'error');
    return;
  }

  msg(avatarUploadMessage, '');
  hide(avatarUploadContent);
  show(avatarUploadProgress);
  avatarProgressFill.style.width = '0%';
  avatarProgressText.textContent = 'Загрузка...';

  const fd = new FormData();
  fd.append('avatar', file);
  fd.append('pin', state.pin);

  const xhr = new XMLHttpRequest();

  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      avatarProgressFill.style.width = pct + '%';
      avatarProgressText.textContent = `Загрузка... ${pct}%`;
    }
  });

  xhr.addEventListener('load', () => {
    hide(avatarUploadProgress);
    show(avatarUploadContent);
    avatarProgressFill.style.width = '0%';

    try {
      const result = JSON.parse(xhr.responseText);
      if (xhr.status >= 200 && xhr.status < 300) {
        state.avatar = result.avatar;
        const newUrl = `/api/avatars/${result.avatar}?t=${Date.now()}`;
        profileAvatar.src = newUrl;
        topbarAvatar.src = newUrl;
        msg(avatarUploadMessage, 'Фото загружено!', 'success');
      } else {
        msg(avatarUploadMessage, result.message || 'Ошибка загрузки.', 'error');
      }
    } catch {
      msg(avatarUploadMessage, 'Ошибка загрузки файла.', 'error');
    }
  });

  xhr.addEventListener('error', () => {
    hide(avatarUploadProgress);
    show(avatarUploadContent);
    msg(avatarUploadMessage, 'Сетевая ошибка. Проверьте подключение.', 'error');
  });

  xhr.open('POST', '/api/profile/avatar');
  xhr.send(fd);
}

profileAvatarInput.addEventListener('change', () => {
  uploadAvatar(profileAvatarInput.files[0]);
  profileAvatarInput.value = '';
});

// Drag & drop
profileAvatarUploadZone.addEventListener('dragenter', (e) => { e.preventDefault(); profileAvatarUploadZone.classList.add('dragover'); });
profileAvatarUploadZone.addEventListener('dragover', (e) => { e.preventDefault(); profileAvatarUploadZone.classList.add('dragover'); });
profileAvatarUploadZone.addEventListener('dragleave', () => { profileAvatarUploadZone.classList.remove('dragover'); });
profileAvatarUploadZone.addEventListener('drop', (e) => {
  e.preventDefault();
  profileAvatarUploadZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) uploadAvatar(file);
});

/* ── CRM Tickets ── */

function renderCrmConfig() {
  ticketModule.innerHTML = state.crmConfig.modules.map((m) => `<option value="${esc(m)}">${esc(m)}</option>`).join('');
  ticketCategory.innerHTML = state.crmConfig.errorCategories.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
}

ticketForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(ticketMessage, '');
  const fd = Object.fromEntries(new FormData(ticketForm).entries());
  fd.pin = state.pin;
  try {
    const result = await api('/api/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fd)
    });
    ticketForm.reset();
    msg(ticketMessage, result.message, 'success');
  } catch (err) {
    msg(ticketMessage, err.message, 'error');
  }
});

/* ── IT Wizard ── */

function resetItWizard() {
  state.itTicket = { step: 1, category: null, subcategory: null, location: null, seat: '', description: '', _showAllLocations: false };
  msg(itTicketMessage, '');
  renderItStep();
}

function itBreadcrumbs() {
  const t = state.itTicket;
  const parts = [];
  if (t.category) {
    const cat = IT_CATEGORIES.find((c) => c.id === t.category);
    if (cat) parts.push(`${cat.emoji} ${cat.label}`);
  }
  if (t.subcategory) parts.push(t.subcategory);
  if (t.location) parts.push(t.location);
  if (t.seat) parts.push(`Место ${t.seat}`);
  if (!parts.length) return '';
  const html = parts.map((p, i) =>
    i < parts.length - 1
      ? `<span>${esc(p)}</span><span class="it-bc-sep">&rsaquo;</span>`
      : `<span class="it-bc-current">${esc(p)}</span>`
  ).join('');
  return `<div class="it-breadcrumbs">${html}</div>`;
}

function renderItStep() {
  const t = state.itTicket;
  const step = t.step;
  let html = itBreadcrumbs();

  if (step === 1) {
    html += `<p class="it-step-title">Выберите категорию</p><div class="it-options">`;
    for (const cat of IT_CATEGORIES) {
      const dis = cat.disabled ? ' disabled' : '';
      const badge = cat.disabled ? '<span class="badge-dev">В разработке</span>' : '';
      html += `<button class="it-option${dis}" data-cat="${esc(cat.id)}">
        ${esc(cat.label)}${badge}
      </button>`;
    }
    html += '</div>';

  } else if (step === 2) {
    const cat = IT_CATEGORIES.find((c) => c.id === t.category);
    if (t.category === 'other') {
      html += `<p class="it-step-title">Опишите проблему</p>`;
      html += `<div class="it-desc-group">
        <label>Описание проблемы</label>
        <textarea id="itOtherDesc" rows="4" placeholder="Опишите вашу проблему..."></textarea>
      </div>`;
      html += `<button class="it-submit-btn" id="itOtherNext">Далее</button>`;
      html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;
    } else {
      html += `<p class="it-step-title">Выберите тип проблемы</p><div class="it-options">`;
      for (const sub of cat.subcategories) {
        html += `<button class="it-option" data-sub="${esc(sub)}">
          ${esc(sub)}
        </button>`;
      }
      html += '</div>';
      html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;
    }

  } else if (step === 3) {
    const profLoc = state.user?.workLocation;
    const profDesk = state.user?.workDesk;
    if (profLoc && !t._showAllLocations) {
      html += `<p class="it-step-title">Где возникла проблема?</p>`;
      html += `<div class="it-profile-loc">Из профиля: <strong>${esc(profLoc)}${profDesk ? ' (место ' + esc(profDesk) + ')' : ''}</strong></div>`;
      html += `<div class="it-options">`;
      html += `<button class="it-option" data-loc="${esc(profLoc)}" data-desk="${esc(profDesk || '')}">Да, ${esc(profLoc)}</button>`;
      html += `<button class="it-option" id="itChooseOtherLoc">Другое место</button>`;
      html += `</div>`;
      html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;
    } else {
      html += `<p class="it-step-title">Где возникла проблема?</p><div class="it-options">`;
      for (const loc of IT_LOCATIONS) {
        html += `<button class="it-option" data-loc="${esc(loc)}">
          ${esc(loc)}
        </button>`;
      }
      html += '</div>';
      html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;
    }

  } else if (step === 4) {
    html += `<p class="it-step-title">Укажите номер места</p>`;
    html += `<div class="it-seat-group">
      <label>Номер места (1–260)</label>
      <input id="itSeatInput" type="number" min="1" max="260" placeholder="Номер места" />
    </div>`;
    html += `<button class="it-submit-btn" id="itSeatNext">Далее</button>`;
    html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;

  } else if (step === 5) {
    html += `<p class="it-step-title">Опишите детали проблемы</p>`;
    html += `<div class="it-desc-group">
      <label>Описание (можно «-» чтобы пропустить)</label>
      <textarea id="itDescInput" rows="4" placeholder="Подробности проблемы..."></textarea>
    </div>`;
    html += `<button class="it-submit-btn" id="itSubmitBtn">Отправить</button>`;
    html += `<button class="it-back-btn" id="itBackBtn">Назад</button>`;
  }

  itWizard.innerHTML = html;
  bindItEvents();
}

function bindItEvents() {
  const t = state.itTicket;

  // Step 1: category selection
  itWizard.querySelectorAll('[data-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const catId = btn.dataset.cat;
      const cat = IT_CATEGORIES.find((c) => c.id === catId);
      if (cat && cat.disabled) return;
      t.category = catId;
      t.step = 2;
      msg(itTicketMessage, '');
      renderItStep();
    });
  });

  // Step 2: subcategory selection
  itWizard.querySelectorAll('[data-sub]').forEach((btn) => {
    btn.addEventListener('click', () => {
      t.subcategory = btn.dataset.sub;
      t.step = 3;
      msg(itTicketMessage, '');
      renderItStep();
    });
  });

  // Step 2 "other" next button
  const otherNext = $('itOtherNext');
  if (otherNext) {
    otherNext.addEventListener('click', () => {
      const desc = $('itOtherDesc').value.trim();
      if (!desc || desc.length < 3) {
        msg(itTicketMessage, 'Опишите проблему (минимум 3 символа).', 'error');
        return;
      }
      t.subcategory = desc;
      t.description = desc;
      t.step = 3;
      msg(itTicketMessage, '');
      renderItStep();
    });
  }

  // Step 3: location selection
  itWizard.querySelectorAll('[data-loc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      t.location = btn.dataset.loc;
      // If desk pre-filled from profile
      if (btn.dataset.desk) {
        t.seat = btn.dataset.desk;
        t.step = 5;
      } else if (t.location === 'Офис 2 этаж') {
        t.step = 4;
      } else {
        t.seat = '';
        t.step = 5;
      }
      msg(itTicketMessage, '');
      renderItStep();
    });
  });

  // "Choose other location" button (when profile location suggested)
  const otherLocBtn = document.getElementById('itChooseOtherLoc');
  if (otherLocBtn) {
    otherLocBtn.addEventListener('click', () => {
      t._showAllLocations = true;
      msg(itTicketMessage, '');
      renderItStep();
    });
  }

  // Step 4: seat number
  const seatNext = $('itSeatNext');
  if (seatNext) {
    seatNext.addEventListener('click', () => {
      const val = Number($('itSeatInput').value);
      if (!val || val < 1 || val > 260) {
        msg(itTicketMessage, 'Укажите номер места от 1 до 260.', 'error');
        return;
      }
      t.seat = String(val);
      t.step = 5;
      msg(itTicketMessage, '');
      renderItStep();
    });
  }

  // Step 5: submit
  const submitBtn = $('itSubmitBtn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const desc = $('itDescInput').value.trim() || '-';
      if (t.category !== 'other') t.description = desc;
      msg(itTicketMessage, '');
      submitBtn.disabled = true;
      try {
        const result = await api('/api/it-tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pin: state.pin,
            category: t.category,
            subcategory: t.subcategory || '',
            location: t.location,
            seat: t.seat,
            description: t.description
          })
        });
        msg(itTicketMessage, result.message, 'success');
        loadMyItTickets();
        setTimeout(() => resetItWizard(), 2000);
      } catch (err) {
        msg(itTicketMessage, err.message, 'error');
        submitBtn.disabled = false;
      }
    });
  }

  // Back button
  const backBtn = $('itBackBtn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      msg(itTicketMessage, '');
      if (t.step === 5) {
        if (t.location === 'Офис 2 этаж') { t.seat = ''; t.step = 4; }
        else { t.step = 3; }
      } else if (t.step === 4) {
        t.location = null;
        t.step = 3;
      } else if (t.step === 3) {
        if (t._showAllLocations) { t._showAllLocations = false; renderItStep(); return; }
        t.subcategory = null;
        t.location = null;
        if (t.category === 'other') { t.description = ''; }
        t.step = 2;
      } else if (t.step === 2) {
        t.category = null;
        t.subcategory = null;
        t.description = '';
        t.step = 1;
      }
      renderItStep();
    });
  }
}

/* ── Admin panel ── */

const pinRequestsBadge = $('pinRequestsBadge');

async function updatePinBadge() {
  try {
    const data = await api('/api/admin/pin-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    if (data.length > 0) {
      pinRequestsBadge.textContent = data.length;
      show(pinRequestsBadge);
    } else {
      hide(pinRequestsBadge);
    }
  } catch { hide(pinRequestsBadge); }
}

adminBtn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  $('panelAdmin').classList.add('active');

  // Filter admin tabs by role
  const allAdminTabs = document.querySelectorAll('.admin-tab');
  const superOnly = ['bookings', 'tickets', 'suggestions', 'users', 'pin-requests'];
  allAdminTabs.forEach((tab) => {
    if (state.adminRole === 'it_admin' && superOnly.includes(tab.dataset.atab)) {
      hide(tab);
    } else {
      show(tab);
    }
  });

  if (state.adminRole === 'it_admin') {
    allAdminTabs.forEach((t) => t.classList.remove('active'));
    const itTab = [...allAdminTabs].find((t) => t.dataset.atab === 'it-tickets');
    if (itTab) itTab.classList.add('active');
    loadAdminData('it-tickets');
  } else {
    loadAdminData('bookings');
    updatePinBadge();
  }
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
    const data = await api(`/api/admin/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
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

let adminUsersCache = [];

function renderAdminTable(type, data) {
  if (!data.length) {
    adminContent.innerHTML = '<p class="admin-empty">Пока пусто</p>';
    return;
  }

  if (type === 'users') adminUsersCache = data;

  let html = '<table class="admin-table">';

  if (type === 'bookings') {
    html += '<tr><th>Дата</th><th>Время</th><th>Тема</th><th>Кто</th><th>Контакт</th><th></th></tr>';
    for (const b of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      html += `<tr>
        <td>${esc(b.date)}</td>
        <td style="white-space:nowrap">${fmtTime(b.startHour)}–${fmtTime(b.endHour)}</td>
        <td>${esc(b.topic)}</td>
        <td>${esc(b.fullName)}</td>
        <td>${esc(b.contact)}</td>
        <td><button class="btn-cancel-sm" data-action="cancel-booking" data-id="${esc(b.id)}">Отменить</button></td>
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
  } else if (type === 'it-tickets') {
    html += '<tr><th>Дата</th><th>Категория</th><th>Тип проблемы</th><th>Локация</th><th>Место</th><th>Описание</th><th>Кто</th><th>Статус</th><th>Оценка</th></tr>';
    for (const t of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      const statusBadge = itStatusBadge(t.status);
      const ratingStr = t.rating ? '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating) : '—';
      html += `<tr>
        <td style="white-space:nowrap">${fmtDate(t.createdAt)}</td>
        <td>${esc(t.category)}</td>
        <td>${esc(t.subcategory)}</td>
        <td>${esc(t.location)}</td>
        <td>${esc(t.seat || '—')}</td>
        <td class="desc-cell">${esc(t.description)}</td>
        <td>${esc(t.fullName)}</td>
        <td>${statusBadge}</td>
        <td style="white-space:nowrap">${ratingStr}</td>
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
    html += '<tr><th>Пин</th><th>ФИО</th><th>Контакт</th><th>Роль</th><th>Дата</th><th></th></tr>';
    const roleLabels = { superadmin: 'Суперадмин', it_admin: 'ИТ-админ', employee: 'Сотрудник' };
    for (const u of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      const role = u.role || 'employee';
      const roleLabel = roleLabels[role] || 'Сотрудник';
      html += `<tr>
        <td>${esc(u.pin)}</td>
        <td>${esc(u.fullName)}</td>
        <td>${esc(u.contact)}</td>
        <td>
          <select class="role-select" data-action="set-role" data-pin="${esc(u.pin)}">
            <option value="employee"${role === 'employee' ? ' selected' : ''}>Сотрудник</option>
            <option value="it_admin"${role === 'it_admin' ? ' selected' : ''}>ИТ-админ</option>
            <option value="superadmin"${role === 'superadmin' ? ' selected' : ''}>Суперадмин</option>
          </select>
        </td>
        <td style="white-space:nowrap">${fmtDate(u.createdAt)}</td>
        <td><button class="btn-edit-user" data-action="edit-user" data-pin="${esc(u.pin)}">Ред.</button></td>
      </tr>`;
    }
  } else if (type === 'pin-requests') {
    html += '<tr><th>Дата</th><th>ФИО</th><th>Контакт</th><th></th></tr>';
    for (const r of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      html += `<tr>
        <td style="white-space:nowrap">${fmtDate(r.createdAt)}</td>
        <td>${esc(r.fullName)}</td>
        <td>${esc(r.contact)}</td>
        <td><button class="btn-cancel-sm" data-action="resolve-pin" data-id="${esc(r.id)}">Готово</button></td>
      </tr>`;
    }
  }

  html += '</table>';
  adminContent.innerHTML = html;

  // Event delegation for admin actions
  adminContent.querySelectorAll('[data-action]').forEach((el) => {
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', handleAdminAction);
    } else {
      el.addEventListener('click', handleAdminAction);
    }
  });
}

function adminMsg(text) {
  const el = adminContent.querySelector('.admin-msg');
  if (el) { el.textContent = text; el.className = 'admin-msg message error'; return; }
  adminContent.insertAdjacentHTML('afterbegin', `<p class="admin-msg message error">${esc(text)}</p>`);
}

async function handleAdminAction(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;

  if (action === 'cancel-booking') {
    if (!confirm('Отменить бронирование?')) return;
    try {
      await api(`/api/bookings/${btn.dataset.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin })
      });
      loadAdminData('bookings');
    } catch (err) { adminMsg(err.message); }

  } else if (action === 'set-role') {
    const role = btn.value;
    try {
      await api('/api/admin/set-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, targetPin: btn.dataset.pin, role })
      });
      loadAdminData('users');
    } catch (err) { adminMsg(err.message); }

  } else if (action === 'resolve-pin') {
    try {
      await api('/api/admin/pin-request-resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, requestId: btn.dataset.id })
      });
      loadAdminData('pin-requests');
      updatePinBadge();
    } catch (err) { adminMsg(err.message); }

  } else if (action === 'edit-user') {
    const u = adminUsersCache.find((x) => x.pin === btn.dataset.pin);
    if (!u) return;
    editUserOriginalPin.value = u.pin;
    editUserName.value = u.fullName;
    editUserContact.value = u.contact;
    editUserPin.value = u.pin;
    msg(editUserMessage, '');
    show(editUserPopup);
  }
}

/* ── Edit user popup (admin) ── */

editUserCancel.addEventListener('click', () => hide(editUserPopup));
editUserPopup.addEventListener('click', (e) => { if (e.target === editUserPopup) hide(editUserPopup); });

editUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(editUserMessage, '');
  try {
    const result = await api('/api/admin/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: state.pin,
        targetPin: editUserOriginalPin.value,
        fullName: editUserName.value.trim(),
        contact: editUserContact.value.trim(),
        newPin: editUserPin.value.trim()
      })
    });
    msg(editUserMessage, result.message, 'success');
    setTimeout(() => { hide(editUserPopup); loadAdminData('users'); }, 800);
  } catch (err) {
    msg(editUserMessage, err.message, 'error');
  }
});

/* ── IT Status helpers ── */

function itStatusBadge(status) {
  const map = {
    new: ['Новая', 'status-new'],
    in_progress: ['В работе', 'status-progress'],
    done: ['Выполнено', 'status-done']
  };
  const [label, cls] = map[status] || ['Новая', 'status-new'];
  return `<span class="it-status-badge ${cls}">${label}</span>`;
}

/* ── My IT Tickets ── */

async function loadMyItTickets() {
  if (!state.pin) return;
  try {
    const tickets = await api('/api/my-it-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    renderMyItTickets(tickets);
  } catch {
    if (myItTicketsList) myItTicketsList.innerHTML = '';
  }
}

function renderMyItTickets(tickets) {
  if (!myItTicketsList) return;
  if (!tickets.length) {
    myItTicketsList.innerHTML = '<p class="my-it-empty">Вы пока не подавали ИТ-заявок</p>';
    return;
  }
  myItTicketsList.innerHTML = tickets.map((t) => {
    const badge = itStatusBadge(t.status);
    const date = fmtDate(t.createdAt);
    const desc = t.description.length > 80 ? t.description.slice(0, 80) + '...' : t.description;
    let ratingHtml = '';
    if (t.status === 'done' && t.rating) {
      ratingHtml = `<span class="it-rating-done">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</span>`;
    } else if (t.status === 'done' && !t.rating) {
      ratingHtml = `<span class="it-stars" data-ticket-id="${esc(t.id)}">${[1,2,3,4,5].map((n) =>
        `<span class="it-star" data-star="${n}">★</span>`
      ).join('')}</span>`;
    }
    const takenBy = t.takenBy ? ` · ${esc(t.takenBy)}` : '';
    return `<div class="my-it-ticket">
      <div class="my-it-ticket-header">
        <span class="my-it-ticket-cat">${esc(t.category)}${t.subcategory && t.subcategory !== '—' ? ' — ' + esc(t.subcategory) : ''}</span>
        <span class="my-it-ticket-date">${date}</span>
      </div>
      <div class="my-it-ticket-body">${esc(desc)}</div>
      <div class="my-it-ticket-footer">
        ${badge}${takenBy}
        ${ratingHtml}
      </div>
    </div>`;
  }).join('');

  // Bind star rating events
  myItTicketsList.querySelectorAll('.it-stars').forEach((starsEl) => {
    const ticketId = starsEl.dataset.ticketId;
    const stars = starsEl.querySelectorAll('.it-star');
    stars.forEach((star) => {
      star.addEventListener('mouseenter', () => {
        const val = Number(star.dataset.star);
        stars.forEach((s) => s.classList.toggle('hovered', Number(s.dataset.star) <= val));
      });
      star.addEventListener('mouseleave', () => {
        stars.forEach((s) => s.classList.remove('hovered'));
      });
      star.addEventListener('click', () => rateItTicket(ticketId, Number(star.dataset.star)));
    });
  });
}

async function rateItTicket(ticketId, rating) {
  try {
    const result = await api('/api/it-ticket-rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, ticketId, rating })
    });
    msg(itTicketMessage, result.message, 'success');
    loadMyItTickets();
  } catch (err) {
    msg(itTicketMessage, err.message, 'error');
  }
}

/* ── TZ (Технические задания) ── */

const TZ_PRIO_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' };

function tzStatusBadge(status) {
  const cfg = state.tzConfig;
  const label = cfg?.statusLabels?.[status] || status;
  const cls = `tz-st-${status}`;
  return `<span class="tz-status-badge ${cls}">${esc(label)}</span>`;
}

function tzPrioBadge(priority) {
  const label = TZ_PRIO_LABELS[priority] || priority;
  return `<span class="tz-prio-badge tz-prio-${priority}">${esc(label)}</span>`;
}

function renderTzFilters() {
  if (!tzFilters || !state.tzConfig) return;
  const cfg = state.tzConfig;
  const f = state.tzFilters;

  const systemOpts = ['<option value="">Все системы</option>']
    .concat(cfg.systems.map((s) => `<option value="${esc(s)}"${f.system === s ? ' selected' : ''}>${esc(s)}</option>`)).join('');
  const statusOpts = ['<option value="">Все статусы</option>']
    .concat(cfg.statuses.map((s) => `<option value="${esc(s)}"${f.status === s ? ' selected' : ''}>${esc(cfg.statusLabels[s] || s)}</option>`)).join('');
  const typeOpts = ['<option value="">Все типы</option>']
    .concat(cfg.types.map((t) => `<option value="${esc(t)}"${f.type === t ? ' selected' : ''}>${esc(t)}</option>`)).join('');
  const prioOpts = ['<option value="">Все приоритеты</option>']
    .concat(cfg.priorities.map((p) => `<option value="${esc(p)}"${f.priority === p ? ' selected' : ''}>${esc(TZ_PRIO_LABELS[p] || p)}</option>`)).join('');

  tzFilters.innerHTML = `
    <div class="tz-filters-row">
      <select class="tz-filter-select" id="tzFilterSystem">${systemOpts}</select>
      <select class="tz-filter-select" id="tzFilterStatus">${statusOpts}</select>
      <select class="tz-filter-select" id="tzFilterType">${typeOpts}</select>
      <select class="tz-filter-select" id="tzFilterPriority">${prioOpts}</select>
      <input class="tz-filter-search" id="tzFilterSearch" placeholder="Поиск..." value="${esc(f.search)}" />
      <button class="tz-create-btn" id="tzCreateBtn" type="button">+ Создать ТЗ</button>
    </div>
    <div class="tz-filters-row">
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterOverdue"${f.overdue ? ' checked' : ''} /> Просрочено</label>
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterDeadlineSoon"${f.deadline_soon ? ' checked' : ''} /> Скоро дедлайн</label>
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterNoDates"${f.no_dates ? ' checked' : ''} /> Без дат</label>
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterNoOwner"${f.no_owner ? ' checked' : ''} /> Без ответственного</label>
    </div>`;

  // Bind filter events
  const bindChange = (id, key) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('change', () => { state.tzFilters[key] = el.type === 'checkbox' ? el.checked : el.value; loadTzData(); });
  };
  bindChange('tzFilterSystem', 'system');
  bindChange('tzFilterStatus', 'status');
  bindChange('tzFilterType', 'type');
  bindChange('tzFilterPriority', 'priority');
  bindChange('tzFilterOverdue', 'overdue');
  bindChange('tzFilterDeadlineSoon', 'deadline_soon');
  bindChange('tzFilterNoDates', 'no_dates');
  bindChange('tzFilterNoOwner', 'no_owner');

  const searchEl = document.getElementById('tzFilterSearch');
  if (searchEl) {
    let searchTimer;
    searchEl.addEventListener('input', () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => { state.tzFilters.search = searchEl.value; loadTzData(); }, 300);
    });
  }

  const createBtn = document.getElementById('tzCreateBtn');
  if (createBtn) createBtn.addEventListener('click', openTzCreateForm);
}

function renderTzStats(stats) {
  if (!tzStatsBar) return;
  tzStatsBar.innerHTML = `
    <div class="tz-stats-row">
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.total}</div><div class="tz-stat-label">Всего</div></div>
      <div class="tz-stat-card tz-stat-danger"><div class="tz-stat-num">${stats.overdue}</div><div class="tz-stat-label">Просрочено</div></div>
      <div class="tz-stat-card tz-stat-warn"><div class="tz-stat-num">${stats.deadline_soon}</div><div class="tz-stat-label">Скоро</div></div>
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.no_dates}</div><div class="tz-stat-label">Без дат</div></div>
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.no_owner}</div><div class="tz-stat-label">Без ответств.</div></div>
    </div>`;
}

function renderTzList(items) {
  if (!tzListContainer) return;
  if (!items.length) {
    tzListContainer.innerHTML = '<p class="tz-empty">Нет ТЗ по выбранным фильтрам</p>';
    return;
  }

  const cfg = state.tzConfig;
  let html = '<table class="tz-table"><tr><th>Код</th><th>Название</th><th>Система</th><th>Тип</th><th>Приоритет</th><th>Статус</th><th>Ответственный</th><th>Ссылки</th></tr>';
  for (const tz of items) {
    const f = tz.flags || {};
    let rowCls = '';
    if (f.overdue) rowCls = ' class="tz-row-overdue"';
    else if (f.deadline_soon) rowCls = ' class="tz-row-soon"';

    const links = [];
    if (tz.link_confluence) links.push(`<a href="${esc(tz.link_confluence)}" target="_blank" rel="noreferrer" class="tz-link-icon" title="Confluence" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>`);
    if (tz.link_jira) links.push(`<a href="${esc(tz.link_jira)}" target="_blank" rel="noreferrer" class="tz-link-icon" title="Jira" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></a>`);

    html += `<tr${rowCls} data-tz-id="${esc(tz.id)}">
      <td class="tz-code-cell">${esc(tz.tz_code)}</td>
      <td class="tz-title-cell">${esc(tz.title)}</td>
      <td>${esc(tz.system)}</td>
      <td>${esc(tz.type)}</td>
      <td>${tzPrioBadge(tz.priority)}</td>
      <td>${tzStatusBadge(tz.status)}</td>
      <td>${tz.owner ? esc(tz.owner) : '<span style="color:var(--disabled)">—</span>'}</td>
      <td>${links.join(' ') || '—'}</td>
    </tr>`;
  }
  html += '</table>';
  tzListContainer.innerHTML = html;

  // Bind row click to open detail
  tzListContainer.querySelectorAll('[data-tz-id]').forEach((row) => {
    row.addEventListener('click', () => openTzDetail(row.dataset.tzId));
  });
}

async function loadTzData() {
  if (!state.pin || state.adminRole !== 'superadmin') return;
  msg(tzMessage, '');
  try {
    const [items, stats] = await Promise.all([
      api('/api/admin/tz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, ...state.tzFilters })
      }),
      api('/api/admin/tz-stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin })
      })
    ]);
    state.tzList = items;
    renderTzStats(stats);
    renderTzList(items);
  } catch (err) {
    msg(tzMessage, err.message, 'error');
  }
}

function openTzCreateForm() {
  state.tzEditId = null;
  const cfg = state.tzConfig;
  tzPopupTitle.querySelector('span').textContent = 'Новое ТЗ';
  tzSubmitBtn.textContent = 'Создать';
  tzForm.reset();
  hide(tzStatusRow);
  hide(tzMeta);
  hide(tzHistorySection);
  msg(tzPopupMessage, '');

  // Populate selects
  $('tzSystem').innerHTML = cfg.systems.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('');
  $('tzType').innerHTML = cfg.types.map((t) => `<option value="${esc(t)}">${esc(t)}</option>`).join('');
  $('tzPriority').innerHTML = cfg.priorities.map((p) => `<option value="${esc(p)}">${esc(TZ_PRIO_LABELS[p] || p)}</option>`).join('');

  show(tzPopup);
}

async function openTzDetail(id) {
  msg(tzPopupMessage, '');
  try {
    const data = await api(`/api/tz/${id}?pin=${encodeURIComponent(state.pin)}`);
    state.tzEditId = id;
    const cfg = state.tzConfig;

    tzPopupTitle.querySelector('span').textContent = `${data.tz_code} — Редактирование`;
    tzSubmitBtn.textContent = 'Сохранить';

    // Populate selects
    $('tzSystem').innerHTML = cfg.systems.map((s) => `<option value="${esc(s)}"${s === data.system ? ' selected' : ''}>${esc(s)}</option>`).join('');
    $('tzType').innerHTML = cfg.types.map((t) => `<option value="${esc(t)}"${t === data.type ? ' selected' : ''}>${esc(t)}</option>`).join('');
    $('tzPriority').innerHTML = cfg.priorities.map((p) => `<option value="${esc(p)}"${p === data.priority ? ' selected' : ''}>${esc(TZ_PRIO_LABELS[p] || p)}</option>`).join('');

    // Fill form
    $('tzTitle').value = data.title || '';
    $('tzOwner').value = data.owner || '';
    $('tzDescription').value = data.description || '';
    $('tzLinkConfluence').value = data.link_confluence || '';
    $('tzLinkJira').value = data.link_jira || '';
    $('tzDateAnalysis').value = data.date_analysis_deadline || '';
    $('tzDateDev').value = data.date_dev_deadline || '';
    $('tzDateRelease').value = data.date_release_deadline || '';

    // Status select — show only allowed transitions + current
    const transitions = cfg.transitions[data.status] || [];
    const statusOptions = [data.status, ...transitions];
    $('tzStatus').innerHTML = statusOptions.map((s) =>
      `<option value="${esc(s)}"${s === data.status ? ' selected' : ''}>${esc(cfg.statusLabels[s] || s)}</option>`
    ).join('');
    show(tzStatusRow);

    // Meta info
    tzMeta.innerHTML = `
      <span>Создано: ${fmtDate(data.created_at)}</span>
      <span>Автор: ${esc(data.created_by || '—')}</span>
      <span>Обновлено: ${fmtDate(data.updated_at)}</span>`;
    show(tzMeta);

    // History
    if (data.history && data.history.length) {
      renderTzHistory(data.history);
      show(tzHistorySection);
    } else {
      hide(tzHistorySection);
    }

    show(tzPopup);
  } catch (err) {
    msg(tzMessage, err.message, 'error');
  }
}

function renderTzHistory(history) {
  if (!tzHistoryList) return;
  const cfg = state.tzConfig;
  const fieldLabels = {
    title: 'Название', system: 'Система', type: 'Тип', priority: 'Приоритет',
    status: 'Статус', description: 'Описание', owner: 'Ответственный',
    link_confluence: 'Confluence', link_jira: 'Jira',
    date_analysis_deadline: 'Дедлайн анализа', date_dev_deadline: 'Дедлайн разработки',
    date_release_deadline: 'Дедлайн релиза'
  };

  tzHistoryList.innerHTML = history.map((h) => {
    const field = fieldLabels[h.field] || h.field;
    let oldV = h.old_value ?? '—';
    let newV = h.new_value ?? '—';
    if (h.field === 'status') {
      oldV = cfg?.statusLabels?.[oldV] || oldV;
      newV = cfg?.statusLabels?.[newV] || newV;
    }
    if (h.field === 'description') {
      oldV = oldV.length > 40 ? oldV.slice(0, 40) + '...' : oldV;
      newV = newV.length > 40 ? newV.slice(0, 40) + '...' : newV;
    }
    return `<div class="tz-history-item">
      <span class="tz-history-date">${fmtDate(h.changed_at)}</span>
      <span class="tz-history-field">${esc(field)}</span>: ${esc(String(oldV))} → ${esc(String(newV))}
      <br><small>${esc(h.changed_by)}</small>
    </div>`;
  }).join('');
}

// TZ form submit
tzForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(tzPopupMessage, '');
  tzSubmitBtn.disabled = true;

  const body = {
    pin: state.pin,
    title: $('tzTitle').value.trim(),
    system: $('tzSystem').value,
    type: $('tzType').value,
    priority: $('tzPriority').value,
    description: $('tzDescription').value.trim(),
    owner: $('tzOwner').value.trim(),
    link_confluence: $('tzLinkConfluence').value.trim(),
    link_jira: $('tzLinkJira').value.trim(),
    date_analysis_deadline: $('tzDateAnalysis').value || '',
    date_dev_deadline: $('tzDateDev').value || '',
    date_release_deadline: $('tzDateRelease').value || ''
  };

  try {
    if (state.tzEditId) {
      body.status = $('tzStatus').value;
      const result = await api(`/api/tz/${state.tzEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      msg(tzPopupMessage, result.message, 'success');
    } else {
      const result = await api('/api/tz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      msg(tzPopupMessage, result.message, 'success');
    }
    setTimeout(() => { hide(tzPopup); loadTzData(); }, 800);
  } catch (err) {
    msg(tzPopupMessage, err.message, 'error');
  } finally {
    tzSubmitBtn.disabled = false;
  }
});

// TZ popup close
tzCancelBtn.addEventListener('click', () => hide(tzPopup));
tzPopup.addEventListener('click', (e) => { if (e.target === tzPopup) hide(tzPopup); });

/* ── IT Status page (standalone, for sysadmin) ── */

function renderItStatusPage(ticketId) {
  document.title = 'ИТ-заявка — Статус';
  document.body.innerHTML = `<div class="it-status-page"><div class="it-status-card" id="itStatusCard">
    <h2>🔧 ИТ-заявка</h2>
    <p style="color:var(--text-sec)">Загрузка...</p>
  </div></div>`;
  loadItStatus(ticketId);
}

async function loadItStatus(ticketId) {
  const card = document.getElementById('itStatusCard');
  try {
    const t = await api(`/api/it-ticket-status/${ticketId}`);
    const badge = itStatusBadge(t.status);
    const date = fmtDate(t.createdAt);
    let actionsHtml = '';
    if (t.status === 'new') {
      actionsHtml = `
        <input id="itTakenByInput" class="it-taken-input" placeholder="Ваше имя (необязательно)" />
        <div class="it-status-actions">
          <button class="btn-primary" id="itTakeBtn">Взять в работу</button>
        </div>`;
    } else if (t.status === 'in_progress') {
      actionsHtml = `<div class="it-status-actions">
        <button class="btn-primary" id="itDoneBtn">Выполнено</button>
      </div>`;
    }

    card.innerHTML = `
      <h2>🔧 ИТ-заявка</h2>
      <div class="it-status-field"><span class="it-status-label">Категория</span><span class="it-status-value">${esc(t.category)}${t.subcategory && t.subcategory !== '—' ? ' — ' + esc(t.subcategory) : ''}</span></div>
      <div class="it-status-field"><span class="it-status-label">Локация</span><span class="it-status-value">${esc(t.location)}${t.seat ? ' (место ' + esc(t.seat) + ')' : ''}</span></div>
      <div class="it-status-field"><span class="it-status-label">Описание</span><span class="it-status-value">${esc(t.description)}</span></div>
      <div class="it-status-field"><span class="it-status-label">От</span><span class="it-status-value">${esc(t.fullName)} (${esc(t.contact)})</span></div>
      <div class="it-status-field"><span class="it-status-label">Создана</span><span class="it-status-value">${date}</span></div>
      <div class="it-status-field"><span class="it-status-label">Статус</span><span class="it-status-value">${badge}${t.takenBy ? ' · ' + esc(t.takenBy) : ''}</span></div>
      ${t.rating ? `<div class="it-status-field"><span class="it-status-label">Оценка</span><span class="it-status-value">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</span></div>` : ''}
      ${actionsHtml}
      <p class="it-status-msg" id="itStatusMsg"></p>`;

    const takeBtn = document.getElementById('itTakeBtn');
    if (takeBtn) {
      takeBtn.addEventListener('click', async () => {
        const takenBy = (document.getElementById('itTakenByInput')?.value || '').trim();
        takeBtn.disabled = true;
        try {
          await api(`/api/it-ticket-status/${ticketId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'take', takenBy })
          });
          loadItStatus(ticketId);
        } catch (err) {
          const m = document.getElementById('itStatusMsg');
          if (m) { m.textContent = err.message; m.className = 'it-status-msg error'; }
          takeBtn.disabled = false;
        }
      });
    }

    const doneBtn = document.getElementById('itDoneBtn');
    if (doneBtn) {
      doneBtn.addEventListener('click', async () => {
        doneBtn.disabled = true;
        try {
          await api(`/api/it-ticket-status/${ticketId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'done' })
          });
          loadItStatus(ticketId);
        } catch (err) {
          const m = document.getElementById('itStatusMsg');
          if (m) { m.textContent = err.message; m.className = 'it-status-msg error'; }
          doneBtn.disabled = false;
        }
      });
    }
  } catch (err) {
    card.innerHTML = `<h2>🔧 ИТ-заявка</h2><p class="it-status-msg error">${esc(err.message)}</p>`;
  }
}

/* ── Init ── */

// Check if this is the standalone IT status page
const itStatusMatch = location.pathname.match(/^\/it-status\/([0-9a-f-]{36})$/);
if (itStatusMatch) {
  renderItStatusPage(itStatusMatch[1]);
} else {
  resetItWizard();

  (async () => {
    const loggedIn = await tryAutoLogin();
    if (loggedIn) { showMain(); await loadApp(); }
    else { showAuth(); }
  })();
}
