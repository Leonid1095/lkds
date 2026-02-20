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
const profileCloseBtn = $('profileCloseBtn');
const profileMessage = $('profileMessage');
const profileActions = $('profileActions');

const linksGrid = $('linksGrid');
const adminContent = $('adminContent');

/* ── State ── */
const state = {
  pin: null,
  user: null,
  userId: null,
  isAdmin: false,
  settings: { startHour: 8, endHour: 21, slotStep: 0.5 },
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
function fmtTime(t) { const h = Math.floor(t); const m = (t % 1) ? '30' : '00'; return `${pad(h)}:${m}`; }

function avatarUrl(userId, hasAvatar) {
  if (!hasAvatar || !userId) return DEFAULT_AVATAR;
  return `/api/avatars/${userId}.jpg?t=${Date.now()}`;
}

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
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.hasAvatar = !!data.avatar;
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
  topbarAvatar.src = avatarUrl(state.userId, state.hasAvatar);
  topbarAvatar.alt = state.user.fullName;
  if (state.isAdmin) show(adminBtn);
  else hide(adminBtn);
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
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.hasAvatar = !!data.avatar;
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
    state.hasAvatar = false;
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
    await api(`/api/bookings/${bookingId}?pin=${encodeURIComponent(state.pin)}`, { method: 'DELETE' });
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
    profileAvatar.src = avatarUrl(data.userId, data.avatar);
    profilePosition.value = data.position || '';
    profileContact.value = data.contact || '';
    profileDate.textContent = fmtDate(data.createdAt);

    msg(avatarUploadMessage, '');
    hide(avatarUploadProgress);
    show(avatarUploadContent);
    avatarProgressFill.style.width = '0%';

    if (isOwn) {
      show(profileAvatarUploadZone);
      show(profileSaveBtn);
      profilePosition.removeAttribute('readonly');
      profileContact.removeAttribute('readonly');
    } else {
      hide(profileAvatarUploadZone);
      hide(profileSaveBtn);
      profilePosition.setAttribute('readonly', '');
      profileContact.setAttribute('readonly', '');
    }

    show(profilePopup);
  } catch (err) {
    alert(err.message);
  }
}

profileCloseBtn.addEventListener('click', () => hide(profilePopup));
profilePopup.addEventListener('click', (e) => { if (e.target === profilePopup) hide(profilePopup); });

profileSaveBtn.addEventListener('click', async () => {
  msg(profileMessage, '');
  try {
    const result = await api('/api/profile/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: state.pin,
        contact: profileContact.value.trim(),
        position: profilePosition.value.trim()
      })
    });
    state.user.contact = result.contact;
    state.user.position = result.position;
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
        state.hasAvatar = true;
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

/* ── Admin panel ── */

adminBtn.addEventListener('click', () => {
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
    html += '<tr><th>Пин</th><th>ФИО</th><th>Контакт</th><th>Админ</th><th>Дата</th><th></th></tr>';
    for (const u of data.sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
      const adminLabel = u.isAdmin ? 'Да' : 'Нет';
      const adminClass = u.isAdmin ? 'btn-toggle-admin active' : 'btn-toggle-admin';
      html += `<tr>
        <td>${esc(u.pin)}</td>
        <td>${esc(u.fullName)}</td>
        <td>${esc(u.contact)}</td>
        <td><button class="${adminClass}" data-action="toggle-admin" data-pin="${esc(u.pin)}">${adminLabel}</button></td>
        <td style="white-space:nowrap">${fmtDate(u.createdAt)}</td>
        <td><button class="btn-edit-user" data-action="edit-user" data-pin="${esc(u.pin)}">Ред.</button></td>
      </tr>`;
    }
  }

  html += '</table>';
  adminContent.innerHTML = html;

  // Event delegation for admin actions
  adminContent.querySelectorAll('[data-action]').forEach((btn) => {
    btn.addEventListener('click', handleAdminAction);
  });
}

async function handleAdminAction(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;

  if (action === 'cancel-booking') {
    if (!confirm('Отменить бронирование?')) return;
    try {
      await api(`/api/bookings/${btn.dataset.id}?pin=${encodeURIComponent(state.pin)}`, { method: 'DELETE' });
      loadAdminData('bookings');
    } catch (err) { alert(err.message); }

  } else if (action === 'toggle-admin') {
    try {
      await api('/api/admin/toggle-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, targetPin: btn.dataset.pin })
      });
      loadAdminData('users');
    } catch (err) { alert(err.message); }

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

/* ── Init ── */

(async () => {
  const loggedIn = await tryAutoLogin();
  if (loggedIn) { showMain(); await loadApp(); }
  else { showAuth(); }
})();
