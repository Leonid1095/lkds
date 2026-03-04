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
const tzCommentsSection = $('tzCommentsSection');
const tzCommentsList = $('tzCommentsList');
const tzCommentsCount = $('tzCommentsCount');
const tzCommentInput = $('tzCommentInput');
const tzCommentSendBtn = $('tzCommentSendBtn');

/* ── KB (Wiki) DOM ── */
const tabKb = $('tabKb');
const kbBreadcrumbs = $('kbBreadcrumbs');
const kbToolbar = $('kbToolbar');
const kbContent = $('kbContent');
const kbMessage = $('kbMessage');
const kbEditorPopup = $('kbEditorPopup');
const kbEditorForm = $('kbEditorForm');
const kbEditorTitle = $('kbEditorTitle');
const kbEditorTitleInput = $('kbEditorTitleInput');
const kbEditorCategory = $('kbEditorCategory');
const kbEditorPinned = $('kbEditorPinned');
const kbEditorSubmitBtn = $('kbEditorSubmitBtn');
const kbEditorCancelBtn = $('kbEditorCancelBtn');
const kbEditorMessage = $('kbEditorMessage');
const kbCategoriesPopup = $('kbCategoriesPopup');
const kbCategoriesList = $('kbCategoriesList');
const kbCatNameInput = $('kbCatNameInput');
const kbCatAddBtn = $('kbCatAddBtn');
const kbCategoriesCloseBtn = $('kbCategoriesCloseBtn');
const kbCategoriesMessage = $('kbCategoriesMessage');

/* ── Metrics DOM ── */
const tabMetrics = $('tabMetrics');
const metricsContent = $('metricsContent');
const metricsMessage = $('metricsMessage');

/* ── Global Search DOM ── */
const globalSearchInput = $('globalSearchInput');
const globalSearchResults = $('globalSearchResults');

/* ── AI DOM ── */
const tabAi = $('tabAi');
const aiChat = $('aiChat');
const aiPromptInput = $('aiPromptInput');
const aiSendBtn = $('aiSendBtn');
const aiMessage = $('aiMessage');
let aiRefreshInterval = null;

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
  tzFilters: { system: '', status: '', type: '', priority: '', search: '', overdue: false, no_dates: false, no_owner: false, deadline_soon: false, missing_deadline: false },
  tzList: [],
  tzEditId: null,
  tzViewMode: 'list', // 'list' | 'kanban'
  tzSwimlane: '', // '' | 'priority' | 'assignee'
  tzBoardId: null, // current board id
  tzBoards: [], // board objects from config
  kbView: 'categories', // 'categories' | 'articles' | 'article'
  kbCategories: [],
  kbCategoryId: null,
  kbArticleId: null,
  kbEditId: null,
  kbQuill: null,
  tzTemplates: [],
  metricsCharts: [],
  adminPage: {} // { [type]: currentPage }
};

/* ── Module-scope timers (prevent leaks on re-render) ── */
let _tzSearchTimer = null;
let _kbSearchTimer = null;
let _globalSearchTimer = null;

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

// Hash routing: #tab, #w/категория, #w/категория/статья
function toSlug(text) {
  return (text || '').trim().toLowerCase()
    .replace(/\s+/g, '-').replace(/[^\wа-яё\-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60);
}

function parseHash() {
  const h = decodeURIComponent(location.hash.replace('#', ''));
  if (!h) return {};
  const parts = h.split('/');
  const result = { tab: parts[0] };
  // #w or #w/cat-slug or #w/cat-slug/article-slug (legacy: #wiki/...)
  if (parts[0] === 'w' || parts[0] === 'wiki') {
    result.tab = 'kb';
    if (parts[1]) result.kbCatSlug = parts[1];
    if (parts[2]) result.kbArticleSlug = parts[2];
  }
  // Legacy: #kb/cat/UUID or #kb/article/UUID
  if (parts[0] === 'kb' && parts[1] === 'cat' && parts[2]) {
    result.tab = 'kb';
    result.kbCategoryId = parts[2];
  } else if (parts[0] === 'kb' && parts[1] === 'article' && parts[2]) {
    result.tab = 'kb';
    result.kbArticleId = parts[2];
  }
  if (parts[0] === 'tz' && parts[1] === 'kanban') result.tzKanban = true;
  // #tz/board/{slug} or #tz/board/{slug}/kanban
  if (parts[0] === 'tz' && parts[1] === 'board' && parts[2]) {
    result.tzBoardSlug = parts[2];
    if (parts[3] === 'kanban') result.tzKanban = true;
  }
  return result;
}

function switchToTab(tabName, updateHash) {
  const tab = document.querySelector(`.tab[data-tab="${tabName}"]`);
  if (!tab || tab.style.display === 'none') return false;
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  tab.classList.add('active');
  const panelName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
  $('panel' + panelName).classList.add('active');
  if (tabName === 'tz') loadTzData();
  if (tabName === 'kb') loadKbView();
  if (tabName === 'metrics') loadMetrics();
  if (tabName === 'ai') { loadAiTasks(); startAiRefresh(); } else { stopAiRefresh(); }
  if (updateHash !== false) location.hash = tabName === 'kb' ? 'w' : tabName;
  return true;
}

function updateHash(hash) {
  history.replaceState(null, '', '#' + hash);
}

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => switchToTab(tab.dataset.tab));
});

async function restoreFromHash() {
  const h = parseHash();
  if (!h.tab) return;
  if (h.tab === 'kb' && h.kbArticleId) {
    // Legacy UUID link: #kb/article/UUID
    switchToTab('kb', false);
    state.kbView = 'article';
    state.kbArticleId = h.kbArticleId;
    await loadKbView();
  } else if (h.tab === 'kb' && h.kbCategoryId) {
    // Legacy UUID link: #kb/cat/UUID
    switchToTab('kb', false);
    state.kbView = 'articles';
    state.kbCategoryId = h.kbCategoryId;
    await loadKbView();
  } else if (h.tab === 'kb' && (h.kbCatSlug || h.kbArticleSlug)) {
    switchToTab('kb', false);
    // Load categories to resolve slug → id
    try {
      const cats = await api(`/api/kb/categories?pin=${encodeURIComponent(state.pin)}`);
      state.kbCategories = cats;
      const cat = cats.find((c) => toSlug(c.name) === h.kbCatSlug);
      if (cat && h.kbArticleSlug) {
        const articles = await api(`/api/kb/articles?pin=${encodeURIComponent(state.pin)}&category_id=${encodeURIComponent(cat.id)}`);
        const art = articles.find((a) => toSlug(a.title) === h.kbArticleSlug);
        if (art) {
          state.kbView = 'article';
          state.kbArticleId = art.id;
          state.kbCategoryId = cat.id;
        } else {
          state.kbView = 'articles';
          state.kbCategoryId = cat.id;
        }
      } else if (cat) {
        state.kbView = 'articles';
        state.kbCategoryId = cat.id;
      }
    } catch { /* fallback to categories */ }
    await loadKbView();
  } else if (h.tab === 'tz') {
    if (h.tzBoardSlug && state.tzBoards.length) {
      const b = state.tzBoards.find(b => b.slug === h.tzBoardSlug);
      if (b) state.tzBoardId = b.id;
    }
    if (h.tzKanban) state.tzViewMode = 'kanban';
    switchToTab('tz', false);
  } else {
    switchToTab(h.tab, false);
  }
}

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
    state.pin = saved;
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
  tabAi.style.display = state.adminRole === 'superadmin' ? '' : 'none';
  tabKb.style.display = state.pin ? '' : 'none';
  tabMetrics.style.display = state.adminRole === 'superadmin' ? '' : 'none';
  updateTzBadge();
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
    const enteredPin = pinInput.value.trim();
    state.pin = enteredPin;
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '',
      workLocation: data.workLocation || '', workDesk: data.workDesk || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.adminRole = data.adminRole || null;
    state.avatar = data.avatar || '';
    localStorage.setItem('lkds_pin', enteredPin);
    showMain();
    await loadApp();
    showTzNotifications();
    await restoreFromHash();
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
    const regPin = fd.get('pin');
    state.pin = regPin;
    state.user = { fullName: data.fullName, contact: data.contact, position: '' };
    state.isAdmin = false;
    state.avatar = '';
    localStorage.setItem('lkds_pin', regPin);
    msg(registerMessage, 'Регистрация прошла успешно!', 'success');
    registerForm.reset();
    setTimeout(async () => { showMain(); await loadApp(); await restoreFromHash(); }, 1500);
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
    state.tzBoards = state.tzConfig.boards || [];
    if (!state.tzBoardId && state.tzBoards.length) {
      const defBoard = state.tzBoards.find(b => b.is_default) || state.tzBoards[0];
      state.tzBoardId = defBoard.id;
    }
  } catch { /* no tz-config */ }

  renderRooms();
  renderLinks(links);
  renderCrmConfig();
  resetItWizard();
  loadMyItTickets();

  if (state.adminRole === 'superadmin' && state.tzConfig) {
    renderTzFilters();
    await loadTzTemplates();
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
bookingPopup.addEventListener('click', (e) => { if (e.target === bookingPopup && confirm('Закрыть окно?')) hide(bookingPopup); });

popupBookingForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(popupMessage, '');
  const btn = popupBookingForm.querySelector('button[type="submit"]');
  btn.disabled = true;
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
  } finally {
    btn.disabled = false;
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
cancelPopup.addEventListener('click', (e) => { if (e.target === cancelPopup && confirm('Закрыть окно?')) hide(cancelPopup); });

/* ── Suggest popup ── */

suggestBtn.addEventListener('click', () => { suggestForm.reset(); msg(suggestMessage, ''); show(suggestPopup); });
suggestCancel.addEventListener('click', () => hide(suggestPopup));
suggestPopup.addEventListener('click', (e) => { if (e.target === suggestPopup && confirm('Закрыть окно?')) hide(suggestPopup); });

suggestForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(suggestMessage, '');
  const btn = suggestForm.querySelector('button[type="submit"]');
  btn.disabled = true;
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
  } finally {
    btn.disabled = false;
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
profilePopup.addEventListener('click', (e) => { if (e.target === profilePopup && confirm('Закрыть окно?')) hide(profilePopup); });

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
  const btn = ticketForm.querySelector('button[type="submit"]');
  btn.disabled = true;
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
  } finally {
    btn.disabled = false;
  }
});

/* ── IT Wizard ── */

function resetItWizard() {
  if (!itWizard) return;
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
  const superOnly = ['bookings', 'tickets', 'suggestions', 'users', 'pin-requests', 'crm-config'];
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

const ADMIN_PAGE_SIZE = 50;

async function loadAdminData(type, page) {
  if (type === 'crm-config') { await loadCrmConfigAdmin(); return; }
  if (page !== undefined) state.adminPage[type] = page;
  const currentPage = state.adminPage[type] || 1;
  try {
    const data = await api(`/api/admin/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, page: currentPage, pageSize: ADMIN_PAGE_SIZE })
    });
    renderAdminTable(type, data);
  } catch (err) {
    adminContent.innerHTML = `<p class="message error">${esc(err.message)}</p>`;
  }
}

async function loadCrmConfigAdmin() {
  try {
    const cfg = await api('/api/admin/crm-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    renderCrmConfigAdmin(cfg);
  } catch (err) {
    adminContent.innerHTML = `<p class="message error">${esc(err.message)}</p>`;
  }
}

function renderCrmConfigAdmin(cfg) {
  const renderList = (field, label, items) => `
    <div class="crm-cfg-section">
      <h4 class="crm-cfg-title">${label}</h4>
      <ul class="crm-cfg-list">
        ${items.map((v) => `
          <li class="crm-cfg-item">
            <span>${esc(v)}</span>
            <button class="btn-cancel-sm" data-crm-field="${field}" data-crm-value="${esc(v)}" data-action="crm-delete">Удалить</button>
          </li>`).join('')}
      </ul>
      <form class="crm-cfg-add-form" data-crm-field="${field}">
        <input type="text" class="crm-cfg-input" placeholder="Новый пункт..." maxlength="200" required />
        <button type="submit" class="btn-primary btn-sm">Добавить</button>
      </form>
    </div>`;

  adminContent.innerHTML = `
    <div class="crm-cfg-wrap">
      ${renderList('modules', 'Модули', cfg.modules)}
      ${renderList('errorCategories', 'Категории ошибок', cfg.errorCategories)}
    </div>`;

  adminContent.querySelectorAll('[data-action="crm-delete"]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      if (!confirm(`Удалить «${btn.dataset.crmValue}»?`)) return;
      try {
        await api('/api/admin/crm-config-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, field: btn.dataset.crmField, value: btn.dataset.crmValue })
        });
        await loadCrmConfigAdmin();
      } catch (err) { adminMsg(err.message); }
    });
  });

  adminContent.querySelectorAll('.crm-cfg-add-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const value = input.value.trim();
      if (!value) return;
      try {
        await api('/api/admin/crm-config-add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, field: form.dataset.crmField, value })
        });
        input.value = '';
        await loadCrmConfigAdmin();
      } catch (err) { adminMsg(err.message); }
    });
  });
}

function renderPagination(type, page, pageSize, total) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return '';
  const p = page;
  let html = '<div class="admin-pagination">';
  html += `<button class="pg-btn" data-pg-type="${type}" data-pg="${p - 1}"${p <= 1 ? ' disabled' : ''}>«</button>`;
  const start = Math.max(1, p - 2);
  const end = Math.min(totalPages, p + 2);
  if (start > 1) html += `<button class="pg-btn" data-pg-type="${type}" data-pg="1">1</button>`;
  if (start > 2) html += '<span class="pg-ellipsis">…</span>';
  for (let i = start; i <= end; i++) {
    html += `<button class="pg-btn${i === p ? ' active' : ''}" data-pg-type="${type}" data-pg="${i}">${i}</button>`;
  }
  if (end < totalPages - 1) html += '<span class="pg-ellipsis">…</span>';
  if (end < totalPages) html += `<button class="pg-btn" data-pg-type="${type}" data-pg="${totalPages}">${totalPages}</button>`;
  html += `<button class="pg-btn" data-pg-type="${type}" data-pg="${p + 1}"${p >= totalPages ? ' disabled' : ''}>»</button>`;
  html += `<span class="pg-info">${(p - 1) * pageSize + 1}–${Math.min(p * pageSize, total)} из ${total}</span>`;
  html += '</div>';
  return html;
}

function fmtDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

let adminUsersCache = [];

function renderAdminTable(type, response) {
  // Support both paginated {items, total, page, pageSize} and legacy array responses
  const isPaginated = response && typeof response === 'object' && !Array.isArray(response) && Array.isArray(response.items);
  const data = isPaginated ? response.items : (Array.isArray(response) ? response : []);
  const { total = data.length, page = 1, pageSize = ADMIN_PAGE_SIZE } = isPaginated ? response : {};

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
    html += '<tr><th>ФИО</th><th>Контакт</th><th>Роль</th><th>Дата</th><th></th></tr>';
    const roleLabels = { superadmin: 'Суперадмин', it_admin: 'ИТ-админ', employee: 'Сотрудник' };
    for (const u of data) {
      const role = u.role || 'employee';
      html += `<tr>
        <td>${esc(u.fullName)}</td>
        <td>${esc(u.contact)}</td>
        <td>
          <select class="role-select" data-action="set-role" data-id="${esc(u.id)}">
            <option value="employee"${role === 'employee' ? ' selected' : ''}>Сотрудник</option>
            <option value="it_admin"${role === 'it_admin' ? ' selected' : ''}>ИТ-админ</option>
            <option value="superadmin"${role === 'superadmin' ? ' selected' : ''}>Суперадмин</option>
          </select>
        </td>
        <td style="white-space:nowrap">${fmtDate(u.createdAt)}</td>
        <td><button class="btn-edit-user" data-action="edit-user" data-id="${esc(u.id)}">Ред.</button></td>
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
  html += renderPagination(type, page, pageSize, total);
  adminContent.innerHTML = html;

  // Pagination button handlers
  adminContent.querySelectorAll('.pg-btn:not([disabled])').forEach((btn) => {
    btn.addEventListener('click', () => {
      const pg = Number(btn.dataset.pg);
      if (pg >= 1) loadAdminData(btn.dataset.pgType, pg);
    });
  });

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
        body: JSON.stringify({ pin: state.pin, targetId: btn.dataset.id, role })
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
    const u = adminUsersCache.find((x) => x.id === btn.dataset.id);
    if (!u) return;
    editUserOriginalPin.value = u.id; // repurposed: stores user id
    editUserName.value = u.fullName;
    editUserContact.value = u.contact;
    editUserPin.value = ''; // blank — admin fills new pin only if changing
    msg(editUserMessage, '');
    show(editUserPopup);
  }
}

/* ── Edit user popup (admin) ── */

editUserCancel.addEventListener('click', () => hide(editUserPopup));
editUserPopup.addEventListener('click', (e) => { if (e.target === editUserPopup && confirm('Закрыть окно?')) hide(editUserPopup); });

editUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(editUserMessage, '');
  try {
    const result = await api('/api/admin/update-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pin: state.pin,
        targetId: editUserOriginalPin.value,
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
  if (!state.pin || !myItTicketsList) return;
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

/* ── Toast notifications ── */

const toastContainer = $('toastContainer');

function showToast(text, type = 'danger', duration = 7000) {
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = text;
  el.addEventListener('click', () => dismissToast(el));
  toastContainer.appendChild(el);
  setTimeout(() => dismissToast(el), duration);
}

function dismissToast(el) {
  if (!el.parentNode) return;
  el.style.animation = 'toastFadeOut .3s ease-in forwards';
  el.addEventListener('animationend', () => el.remove());
}

/* ── TZ Badge & Notifications ── */

async function updateTzBadge() {
  if (state.adminRole !== 'superadmin') return;
  try {
    const stats = await api('/api/admin/tz-stats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    const problems = (stats.overdue || 0) + (stats.deadline_soon || 0);
    const badge = tabTz.querySelector('.tab-count-badge');
    if (problems > 0) {
      if (badge) {
        badge.textContent = problems;
      } else {
        tabTz.insertAdjacentHTML('beforeend', `<span class="tab-count-badge">${problems}</span>`);
      }
    } else if (badge) {
      badge.remove();
    }
    return stats;
  } catch { return null; }
}

async function showTzNotifications() {
  if (state.adminRole !== 'superadmin') return;
  const stats = await updateTzBadge();
  if (!stats) return;
  const parts = [];
  if (stats.overdue > 0) parts.push(`${stats.overdue} ТЗ просрочено`);
  if (stats.deadline_soon > 0) parts.push(`${stats.deadline_soon} скоро дедлайн`);
  if (parts.length > 0) {
    showToast(`\u26A0 Внимание: ${parts.join(', ')}`, stats.overdue > 0 ? 'danger' : 'warn');
  }
}

/* ── TZ (Технические задания) ── */

const TZ_PRIO_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' };

function getCurrentBoard() {
  return state.tzBoards.find(b => b.id === state.tzBoardId) || state.tzBoards.find(b => b.is_default) || null;
}

function getBoardStatusLabel(status) {
  const board = getCurrentBoard();
  if (board) {
    const col = board.columns.find(c => c.id === status);
    if (col) return col.name;
  }
  return state.tzConfig?.statusLabels?.[status] || status;
}

function getBoardStatusColor(status) {
  const board = getCurrentBoard();
  if (board) {
    const col = board.columns.find(c => c.id === status);
    if (col) return col.color;
  }
  return null;
}

function tzStatusBadge(status) {
  const label = getBoardStatusLabel(status);
  const color = getBoardStatusColor(status);
  const cls = `tz-st-${status}`;
  if (color) {
    return `<span class="tz-status-badge" style="background:${esc(color)}">${esc(label)}</span>`;
  }
  return `<span class="tz-status-badge ${cls}">${esc(label)}</span>`;
}

function getTzHashBase() {
  const board = getCurrentBoard();
  if (board && !board.is_default) return `tz/board/${board.slug}`;
  return 'tz';
}

function tzPrioBadge(priority) {
  const label = TZ_PRIO_LABELS[priority] || priority;
  return `<span class="tz-prio-badge tz-prio-${priority}">${esc(label)}</span>`;
}

function renderTzFilters() {
  if (!tzFilters || !state.tzConfig) return;
  const cfg = state.tzConfig;
  const f = state.tzFilters;
  const board = getCurrentBoard();
  const isSA = state.adminRole === 'superadmin';

  // Board-specific statuses for filter dropdown
  const boardCols = board ? board.columns.slice().sort((a, b) => a.order - b.order) : null;
  const statusList = boardCols ? boardCols.map(c => ({ id: c.id, label: c.name })) : cfg.statuses.map(s => ({ id: s, label: cfg.statusLabels[s] || s }));

  const systemOpts = ['<option value="">Все системы</option>']
    .concat(cfg.systems.map((s) => `<option value="${esc(s)}"${f.system === s ? ' selected' : ''}>${esc(s)}</option>`)).join('');
  const statusOpts = ['<option value="">Все статусы</option>']
    .concat(statusList.map((s) => `<option value="${esc(s.id)}"${f.status === s.id ? ' selected' : ''}>${esc(s.label)}</option>`)).join('');
  const typeOpts = ['<option value="">Все типы</option>']
    .concat(cfg.types.map((t) => `<option value="${esc(t)}"${f.type === t ? ' selected' : ''}>${esc(t)}</option>`)).join('');
  const prioOpts = ['<option value="">Все приоритеты</option>']
    .concat(cfg.priorities.map((p) => `<option value="${esc(p)}"${f.priority === p ? ' selected' : ''}>${esc(TZ_PRIO_LABELS[p] || p)}</option>`)).join('');

  // Board tabs
  let boardTabsHtml = '';
  if (state.tzBoards.length > 0) {
    boardTabsHtml = '<div class="tz-board-tabs">';
    for (const b of state.tzBoards) {
      const active = b.id === state.tzBoardId ? ' active' : '';
      boardTabsHtml += `<button type="button" class="tz-board-tab${active}" data-board-id="${esc(b.id)}" aria-label="Доска: ${esc(b.name)}">${esc(b.name)}</button>`;
    }
    if (isSA) {
      boardTabsHtml += `<button type="button" class="tz-board-tab tz-board-tab-add" id="tzAddBoardBtn" title="Создать доску">+</button>`;
      boardTabsHtml += `<button type="button" class="tz-board-tab tz-board-tab-settings" id="tzBoardSettingsBtn" title="Настройки доски"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>`;
    }
    boardTabsHtml += '</div>';
  }

  tzFilters.innerHTML = `${boardTabsHtml}
    <div class="tz-filters-row">
      <select class="tz-filter-select" id="tzFilterSystem">${systemOpts}</select>
      <select class="tz-filter-select" id="tzFilterStatus">${statusOpts}</select>
      <select class="tz-filter-select" id="tzFilterType">${typeOpts}</select>
      <select class="tz-filter-select" id="tzFilterPriority">${prioOpts}</select>
      <input class="tz-filter-search" id="tzFilterSearch" placeholder="Поиск..." value="${esc(f.search)}" />
      <div class="tz-filter-actions">
        <button class="tz-export-btn" id="tzExportBtn" type="button">&#x1F4E5; Excel</button>
        <button class="tz-export-btn" id="tzImportBtn" type="button">&#x1F4E4; Импорт</button>
        <input type="file" id="tzImportFile" accept=".xlsx" style="display:none" />
        <button class="tz-create-btn" id="tzCreateBtn" type="button">+ Создать</button>
        <div class="tz-view-toggle">
        <button type="button" class="tz-view-btn${state.tzViewMode === 'list' ? ' active' : ''}" data-view="list" title="Список">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
        </button>
        <button type="button" class="tz-view-btn${state.tzViewMode === 'kanban' ? ' active' : ''}" data-view="kanban" title="Канбан">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="12" rx="1"/><rect x="17" y="3" width="5" height="15" rx="1"/></svg>
        </button>
      </div>
      ${state.tzViewMode === 'kanban' ? `<select class="tz-filter-select tz-swimlane-select" id="tzSwimlaneSelect">
        <option value="">Без группировки</option>
        <option value="priority"${state.tzSwimlane === 'priority' ? ' selected' : ''}>По приоритету</option>
        <option value="assignee"${state.tzSwimlane === 'assignee' ? ' selected' : ''}>По исполнителю</option>
      </select>` : ''}
      </div>
    </div>
    <div class="tz-filters-row">
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterOverdue"${f.overdue ? ' checked' : ''} /> Просрочено</label>
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterDeadlineSoon"${f.deadline_soon ? ' checked' : ''} /> Скоро дедлайн</label>
      <label class="tz-checkbox-label"><input type="checkbox" id="tzFilterMissingDeadline"${f.missing_deadline ? ' checked' : ''} /> Неполные дедлайны</label>
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
  bindChange('tzFilterMissingDeadline', 'missing_deadline');
  bindChange('tzFilterNoDates', 'no_dates');
  bindChange('tzFilterNoOwner', 'no_owner');

  const searchEl = document.getElementById('tzFilterSearch');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      clearTimeout(_tzSearchTimer);
      _tzSearchTimer = setTimeout(() => { state.tzFilters.search = searchEl.value; loadTzData(); }, 300);
    });
  }

  const swimlaneEl = document.getElementById('tzSwimlaneSelect');
  if (swimlaneEl) swimlaneEl.addEventListener('change', () => { state.tzSwimlane = swimlaneEl.value; loadTzData(); });

  const createBtn = document.getElementById('tzCreateBtn');
  if (createBtn) createBtn.addEventListener('click', openTzCreateForm);

  const exportBtn = document.getElementById('tzExportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportTzExcel);

  const importBtn = document.getElementById('tzImportBtn');
  const importFile = document.getElementById('tzImportFile');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', () => { if (importFile.files.length) importTzExcel(importFile); });
  }

  // Board tab click
  document.querySelectorAll('.tz-board-tab[data-board-id]').forEach((tab) => {
    tab.addEventListener('click', () => {
      state.tzBoardId = tab.dataset.boardId;
      state.tzFilters = { system: '', status: '', type: '', priority: '', search: '', overdue: false, no_dates: false, no_owner: false, deadline_soon: false, missing_deadline: false };
      const base = getTzHashBase();
      updateHash(state.tzViewMode === 'kanban' ? base + '/kanban' : base);
      renderTzFilters();
      loadTzData();
    });
  });

  // Add board button
  const addBoardBtn = document.getElementById('tzAddBoardBtn');
  if (addBoardBtn) addBoardBtn.addEventListener('click', openCreateBoardModal);

  // Board settings button
  const settingsBtn = document.getElementById('tzBoardSettingsBtn');
  if (settingsBtn) settingsBtn.addEventListener('click', openBoardSettingsModal);

  // View toggle
  document.querySelectorAll('.tz-view-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.tzViewMode = btn.dataset.view;
      document.querySelectorAll('.tz-view-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('panelTz');
      if (btn.dataset.view === 'kanban') panel.classList.add('kanban-active');
      else panel.classList.remove('kanban-active');
      const base = getTzHashBase();
      updateHash(btn.dataset.view === 'kanban' ? base + '/kanban' : base);
      loadTzData();
    });
  });
}

async function exportTzExcel() {
  const btn = document.getElementById('tzExportBtn');
  if (btn) btn.disabled = true;
  try {
    const res = await fetch('/api/admin/tz-export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, ...state.tzFilters, ...(state.tzBoardId ? { board_id: state.tzBoardId } : {}) })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Ошибка экспорта');
    }
    const blob = await res.blob();
    const dateStr = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tz_export_${dateStr}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    msg(tzMessage, err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

async function importTzExcel(input) {
  const btn = document.getElementById('tzImportBtn');
  if (btn) btn.disabled = true;
  try {
    const fd = new FormData();
    fd.append('file', input.files[0]);
    fd.append('pin', state.pin);
    const res = await fetch('/api/admin/tz-import', { method: 'POST', body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Ошибка импорта');
    msg(tzMessage, data.message + ' Результат появится во вкладке AI.', 'success');
    // Switch to AI tab to show progress
    const aiTab = document.querySelector('[data-tab="ai"]');
    if (aiTab) aiTab.click();
    loadAiTasks();
  } catch (err) {
    msg(tzMessage, err.message, 'error');
  } finally {
    if (btn) btn.disabled = false;
    input.value = '';
  }
}

function renderTzStats(stats) {
  if (!tzStatsBar) return;
  const overduePulse = stats.overdue > 0 ? ' tz-stat-pulse' : '';
  const soonPulse = stats.deadline_soon > 0 ? ' tz-stat-pulse' : '';
  const missingPulse = stats.missing_deadline > 0 ? ' tz-stat-pulse' : '';
  tzStatsBar.innerHTML = `
    <div class="tz-stats-row">
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.total}</div><div class="tz-stat-label">Всего</div></div>
      <div class="tz-stat-card tz-stat-danger${overduePulse}"><div class="tz-stat-num">${stats.overdue}</div><div class="tz-stat-label">Просрочено</div></div>
      <div class="tz-stat-card tz-stat-warn${soonPulse}"><div class="tz-stat-num">${stats.deadline_soon}</div><div class="tz-stat-label">Скоро</div></div>
      <div class="tz-stat-card tz-stat-info${missingPulse}"><div class="tz-stat-num">${stats.missing_deadline}</div><div class="tz-stat-label">Неполн. дедл.</div></div>
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
  const isSA = state.adminRole === 'superadmin';
  let html = '';

  // Bulk toolbar (hidden initially)
  if (isSA) {
    const board = getCurrentBoard();
    const statusOpts = board
      ? board.columns.slice().sort((a,b) => a.order - b.order).map(c => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join('')
      : cfg.statuses.map(s => `<option value="${esc(s)}">${esc(cfg.statusLabels[s] || s)}</option>`).join('');
    const prioOpts = cfg.priorities.map(p => `<option value="${esc(p)}">${esc(TZ_PRIO_LABELS[p] || p)}</option>`).join('');
    html += `<div class="tz-bulk-bar hidden" id="tzBulkBar">
      <span id="tzBulkCount">0 выбрано</span>
      <select id="tzBulkStatus"><option value="">Статус →</option>${statusOpts}</select>
      <select id="tzBulkPriority"><option value="">Приоритет →</option>${prioOpts}</select>
      <button type="button" class="btn-sm btn-primary" id="tzBulkApply">Применить</button>
      <button type="button" class="btn-sm btn-outline-dark" id="tzBulkCancel">Отмена</button>
    </div>`;
  }

  html += `<table class="tz-table"><tr>${isSA ? '<th class="tz-cb-th"><input type="checkbox" id="tzSelectAll" /></th>' : ''}<th>Код</th><th>Название</th><th>Система</th><th>Тип</th><th>Приоритет</th><th>Статус</th><th>Ответственный</th><th>Ссылки</th></tr>`;
  for (const tz of items) {
    const f = tz.flags || {};
    let rowCls = '';
    if (f.overdue) rowCls = ' tz-row-overdue';
    else if (f.deadline_soon) rowCls = ' tz-row-soon';
    else if (f.missing_deadline) rowCls = ' tz-row-missing-dl';

    const links = [];
    if (tz.link_confluence) links.push(`<a href="${esc(tz.link_confluence)}" target="_blank" rel="noreferrer" class="tz-link-icon" title="Confluence" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></a>`);
    if (tz.link_jira) links.push(`<a href="${esc(tz.link_jira)}" target="_blank" rel="noreferrer" class="tz-link-icon" title="Jira" onclick="event.stopPropagation()"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></a>`);

    html += `<tr class="${rowCls}" data-tz-id="${esc(tz.id)}">
      ${isSA ? `<td class="tz-cb-td" onclick="event.stopPropagation()"><input type="checkbox" class="tz-bulk-cb" value="${esc(tz.id)}" /></td>` : ''}
      <td class="tz-code-cell">${esc(tz.tz_code)}</td>
      <td class="tz-title-cell">${esc(tz.title)}</td>
      <td>${esc(tz.system)}</td>
      <td>${esc(tz.type)}</td>
      <td>${tzPrioBadge(tz.priority)}</td>
      <td>${tzStatusBadge(tz.status)}</td>
      <td>${tz.assignee_name ? esc(tz.assignee_name) : (tz.owner ? esc(tz.owner) : '<span style="color:var(--disabled)">—</span>')}</td>
      <td>${links.join(' ') || '—'}</td>
    </tr>`;
  }
  html += '</table>';
  tzListContainer.innerHTML = html;

  // Bind row click to open detail
  tzListContainer.querySelectorAll('[data-tz-id]').forEach((row) => {
    row.addEventListener('click', () => openTzDetail(row.dataset.tzId));
  });

  // Bulk selection logic
  if (isSA) initTzBulk();
}

function initTzBulk() {
  const bar = document.getElementById('tzBulkBar');
  const countEl = document.getElementById('tzBulkCount');
  const selectAll = document.getElementById('tzSelectAll');
  if (!bar || !selectAll) return;

  function updateBulkBar() {
    const checked = tzListContainer.querySelectorAll('.tz-bulk-cb:checked');
    if (checked.length) { show(bar); countEl.textContent = `${checked.length} выбрано`; }
    else hide(bar);
  }

  selectAll.addEventListener('change', () => {
    tzListContainer.querySelectorAll('.tz-bulk-cb').forEach(cb => { cb.checked = selectAll.checked; });
    updateBulkBar();
  });
  tzListContainer.querySelectorAll('.tz-bulk-cb').forEach(cb => {
    cb.addEventListener('change', updateBulkBar);
  });

  document.getElementById('tzBulkCancel')?.addEventListener('click', () => {
    selectAll.checked = false;
    tzListContainer.querySelectorAll('.tz-bulk-cb').forEach(cb => { cb.checked = false; });
    hide(bar);
  });

  document.getElementById('tzBulkApply')?.addEventListener('click', async () => {
    const ids = [...tzListContainer.querySelectorAll('.tz-bulk-cb:checked')].map(cb => cb.value);
    if (!ids.length) return;
    const statusVal = document.getElementById('tzBulkStatus')?.value;
    const prioVal = document.getElementById('tzBulkPriority')?.value;
    let action, value;
    if (statusVal) { action = 'status'; value = statusVal; }
    else if (prioVal) { action = 'priority'; value = prioVal; }
    else { showToast('Выберите статус или приоритет', 'danger'); return; }

    if (!confirm(`Применить ${action === 'status' ? 'статус' : 'приоритет'} к ${ids.length} задачам?`)) return;
    try {
      const result = await api('/api/admin/tz-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, ids, action, value })
      });
      showToast(result.message, 'ok');
      loadTzData();
    } catch (err) { showToast(err.message, 'danger'); }
  });
}

async function loadTzData() {
  if (!state.pin || state.adminRole !== 'superadmin') return;
  msg(tzMessage, '');
  const boardPayload = state.tzBoardId ? { board_id: state.tzBoardId } : {};
  try {
    if (state.tzViewMode === 'kanban') {
      const kanbanBody = { pin: state.pin, ...state.tzFilters, ...boardPayload };
      if (state.tzSwimlane) kanbanBody.swimlane = state.tzSwimlane;
      const [kanban, stats] = await Promise.all([
        api('/api/admin/tz-kanban', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(kanbanBody)
        }),
        api('/api/admin/tz-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, ...boardPayload })
        })
      ]);
      renderTzStats(stats);
      if (state.tzSwimlane && kanban.swimlanes) renderKanbanSwimlanes(kanban, state.tzSwimlane);
      else renderKanban(kanban);
      updateTzBadge();
    } else {
      const [resp, stats] = await Promise.all([
        api('/api/admin/tz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, ...state.tzFilters, ...boardPayload, pageSize: 999 })
        }),
        api('/api/admin/tz-stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, ...boardPayload })
        })
      ]);
      const items = Array.isArray(resp) ? resp : (resp.items || []);
      state.tzList = items;
      renderTzStats(stats);
      renderTzList(items);
      updateTzBadge();
    }
  } catch (err) {
    msg(tzMessage, err.message, 'error');
  }
}

function openTzCreateForm(presetType) {
  if (presetType instanceof Event || typeof presetType !== 'string') presetType = undefined;
  state.tzEditId = null;
  const cfg = state.tzConfig;
  const isSA = state.adminRole === 'superadmin';
  const type = presetType || (isSA ? 'ТЗ' : 'Задача');
  const isUserType = (cfg.userTypes || []).includes(type);
  const typeLabel = { 'ТЗ': 'ТЗ', 'Дефект': 'Дефект', 'Заявка': 'Заявку', 'Задача': 'Задачу', 'Недоработка': 'Недоработку', 'Предложение': 'Предложение' };

  tzPopupTitle.querySelector('span').textContent = 'Создать: ' + (typeLabel[type] || type);
  tzSubmitBtn.textContent = 'Создать';
  tzForm.reset();
  hide(tzMeta);
  hide(tzHistorySection);
  hide(tzCommentsSection);
  msg(tzPopupMessage, '');
  hide($('tzApproveRow'));

  // Populate selects
  $('tzSystem').innerHTML = cfg.systems.map((s) => `<option value="${esc(s)}">${esc(s)}</option>`).join('');

  // Types: superadmin sees all, regular user sees only userTypes
  const availableTypes = isSA ? cfg.types : (cfg.userTypes || []);
  $('tzType').innerHTML = availableTypes.map((t) => `<option value="${esc(t)}"${t === type ? ' selected' : ''}>${esc(t)}</option>`).join('');
  $('tzPriority').innerHTML = cfg.priorities.map((p) => `<option value="${esc(p)}">${esc(TZ_PRIO_LABELS[p] || p)}</option>`).join('');

  // Assignee select
  populateAssigneeSelect('');

  // Show/hide fields based on type
  const systemRow = $('tzSystem').closest('label');
  if (isUserType) { systemRow.style.display = 'none'; $('tzSystem').value = 'OTHER'; }
  else systemRow.style.display = '';

  // Show assignee for user types, owner for classic
  $('tzAssigneeRow').style.display = isUserType ? '' : 'none';
  $('tzOwnerRow').style.display = isUserType ? 'none' : '';

  // Status select — use board columns
  const board = getCurrentBoard();
  const boardCols = board ? board.columns.slice().sort((a, b) => a.order - b.order) : null;
  const defaultCol = board ? (board.default_column || boardCols[0]?.id) : 'draft';
  if (boardCols) {
    $('tzStatus').innerHTML = boardCols.map((c) =>
      `<option value="${esc(c.id)}"${c.id === defaultCol ? ' selected' : ''}>${esc(c.name)}</option>`
    ).join('');
  } else {
    const transitions = cfg.transitions['draft'] || [];
    const statusOptions = ['draft', ...transitions];
    $('tzStatus').innerHTML = statusOptions.map((s) =>
      `<option value="${esc(s)}"${s === 'draft' ? ' selected' : ''}>${esc(cfg.statusLabels[s] || s)}</option>`
    ).join('');
  }
  show(tzStatusRow);
  hide($('tzCompletionNotesRow'));

  // Bind type change to toggle fields
  $('tzType').onchange = () => {
    const t = $('tzType').value;
    const ut = (cfg.userTypes || []).includes(t);
    systemRow.style.display = ut ? 'none' : '';
    $('tzAssigneeRow').style.display = ut ? '' : 'none';
    $('tzOwnerRow').style.display = ut ? 'none' : '';
    if (ut) $('tzSystem').value = 'OTHER';
  };

  // Template dropdown (superadmin)
  let existingTplRow = document.getElementById('tzTemplateRow');
  if (existingTplRow) existingTplRow.remove();
  if (isSA && state.tzTemplates && state.tzTemplates.length) {
    const tplOpts = state.tzTemplates.map((t) => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
    const tplRow = document.createElement('div');
    tplRow.id = 'tzTemplateRow';
    tplRow.className = 'tz-template-row';
    tplRow.innerHTML = `<label>Из шаблона <select id="tzTemplateSelect"><option value="">— выберите —</option>${tplOpts}</select></label>
      <button type="button" class="btn-sm btn-outline-dark" id="tzSaveTemplateBtn" title="Сохранить текущую форму как шаблон">+ Шаблон</button>`;
    tzForm.insertBefore(tplRow, tzForm.firstChild);
    document.getElementById('tzTemplateSelect').addEventListener('change', (e) => {
      const tpl = state.tzTemplates.find((t) => t.id === e.target.value);
      if (!tpl) return;
      const f = tpl.fields;
      if (f.system) $('tzSystem').value = f.system;
      if (f.type) $('tzType').value = f.type;
      if (f.priority) $('tzPriority').value = f.priority;
      if (f.description) $('tzDescription').value = f.description;
      if (f.owner) $('tzOwner').value = f.owner;
    });
    document.getElementById('tzSaveTemplateBtn').addEventListener('click', async () => {
      const name = prompt('Название шаблона:');
      if (!name || name.length < 2) return;
      try {
        await api('/api/tz-templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pin: state.pin, name,
            fields: { system: $('tzSystem').value, type: $('tzType').value, priority: $('tzPriority').value, description: $('tzDescription').value, owner: $('tzOwner').value }
          })
        });
        showToast('Шаблон сохранён', 'ok');
        await loadTzTemplates();
      } catch (err) { showToast(err.message, 'danger'); }
    });
  }

  show(tzPopup);
}

function populateAssigneeSelect(selectedId) {
  const cfg = state.tzConfig;
  if (!cfg || !cfg.users) return;
  $('tzAssignee').innerHTML = '<option value="">— не назначен —</option>' +
    cfg.users.map(u => `<option value="${esc(u.id)}"${u.id === selectedId ? ' selected' : ''}>${esc(u.fullName)}</option>`).join('');
}

async function openTzDetail(id) {
  msg(tzPopupMessage, '');
  try {
    const data = await api(`/api/tz/${id}?pin=${encodeURIComponent(state.pin)}`);
    state.tzEditId = id;
    const cfg = state.tzConfig;
    const isSA = state.adminRole === 'superadmin';
    const isUserType = (cfg.userTypes || []).includes(data.type);

    tzPopupTitle.querySelector('span').textContent = `${data.tz_code} — ${data.type}`;
    tzSubmitBtn.textContent = 'Сохранить';

    // Populate selects
    $('tzSystem').innerHTML = cfg.systems.map((s) => `<option value="${esc(s)}"${s === data.system ? ' selected' : ''}>${esc(s)}</option>`).join('');
    const availableTypes = isSA ? cfg.types : (cfg.userTypes || []);
    $('tzType').innerHTML = availableTypes.map((t) => `<option value="${esc(t)}"${t === data.type ? ' selected' : ''}>${esc(t)}</option>`).join('');
    $('tzPriority').innerHTML = cfg.priorities.map((p) => `<option value="${esc(p)}"${p === data.priority ? ' selected' : ''}>${esc(TZ_PRIO_LABELS[p] || p)}</option>`).join('');

    // Show/hide fields based on type
    const systemRow = $('tzSystem').closest('label');
    systemRow.style.display = isUserType ? 'none' : '';
    $('tzAssigneeRow').style.display = isUserType ? '' : 'none';
    $('tzOwnerRow').style.display = isUserType ? 'none' : '';

    // Assignee
    populateAssigneeSelect(data.assignee_id || '');
    $('tzDeadline').value = data.deadline || '';

    // Fill form
    $('tzTitle').value = data.title || '';
    $('tzOwner').value = data.owner || '';
    $('tzDescription').value = data.description || '';
    $('tzLinkConfluence').value = data.link_confluence || '';
    $('tzLinkJira').value = data.link_jira || '';
    $('tzDateAnalysis').value = data.date_analysis_deadline || '';
    $('tzDateDev').value = data.date_dev_deadline || '';
    $('tzDateRelease').value = data.date_release_deadline || '';
    $('tzCompletionNotes').value = data.completion_notes || '';

    // Status select — use board columns if available
    const detailBoard = data.board_id ? state.tzBoards.find(b => b.id === data.board_id) : getCurrentBoard();
    if (detailBoard) {
      const cols = detailBoard.columns.slice().sort((a, b) => a.order - b.order);
      $('tzStatus').innerHTML = cols.map((c) =>
        `<option value="${esc(c.id)}"${c.id === data.status ? ' selected' : ''}>${esc(c.name)}</option>`
      ).join('');
    } else {
      const transitions = cfg.transitions[data.status] || [];
      const statusOptions = [data.status, ...transitions];
      $('tzStatus').innerHTML = statusOptions.map((s) =>
        `<option value="${esc(s)}"${s === data.status ? ' selected' : ''}>${esc(cfg.statusLabels[s] || s)}</option>`
      ).join('');
    }
    show(tzStatusRow);
    show($('tzCompletionNotesRow'));

    // Approval info for Предложение
    const approveRow = $('tzApproveRow');
    if (data.type === 'Предложение') {
      if (!approveRow) {
        // Create approve row dynamically
        const row = document.createElement('div');
        row.id = 'tzApproveRow';
        row.className = 'tz-approve-row';
        tzMeta.parentNode.insertBefore(row, tzMeta);
      }
      const ar = $('tzApproveRow');
      if (data.approved) {
        ar.innerHTML = `<span class="tz-approved-badge">Утверждено</span> <small>${esc(data.approved_by_name || '')} ${data.approved_at ? fmtDate(data.approved_at) : ''}</small>`;
      } else if (isSA) {
        ar.innerHTML = `<span class="tz-pending-badge">Ожидает утверждения</span> <button type="button" class="btn-primary btn-sm" id="tzApproveBtn">Утвердить</button>`;
        const btn = $('tzApproveBtn');
        if (btn) btn.addEventListener('click', async () => {
          btn.disabled = true;
          try {
            const result = await api(`/api/tz/${id}/approve`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin: state.pin })
            });
            msg(tzPopupMessage, result.message, 'success');
            setTimeout(() => openTzDetail(id), 600);
          } catch (err) { msg(tzPopupMessage, err.message, 'error'); btn.disabled = false; }
        });
      } else {
        ar.innerHTML = '<span class="tz-pending-badge">Ожидает утверждения руководителем</span>';
      }
      show(ar);
    } else if (approveRow) {
      hide(approveRow);
    }

    // Bind type change
    $('tzType').onchange = () => {
      const t = $('tzType').value;
      const ut = (cfg.userTypes || []).includes(t);
      systemRow.style.display = ut ? 'none' : '';
      $('tzAssigneeRow').style.display = ut ? '' : 'none';
      $('tzOwnerRow').style.display = ut ? 'none' : '';
      if (ut) $('tzSystem').value = 'OTHER';
    };

    // Meta info
    const isWatching = (data.watchers || []).includes(state.userId);
    const watcherCount = (data.watchers || []).length;
    let metaHtml = `
      <span>Создано: ${fmtDate(data.created_at)}</span>
      <span>Автор: ${esc(data.created_by || '—')}</span>
      <span>Обновлено: ${fmtDate(data.updated_at)}</span>`;
    if (data.assignee_name) metaHtml += `<span>Исполнитель: ${esc(data.assignee_name)}</span>`;
    if (data.assigned_by_name) metaHtml += `<span>Назначил: ${esc(data.assigned_by_name)}</span>`;
    if (isSA) {
      metaHtml += `<button type="button" class="tz-watch-btn${isWatching ? ' watching' : ''}" id="tzWatchBtn" title="${isWatching ? 'Отписаться' : 'Следить за изменениями'}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="${isWatching ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        ${isWatching ? 'Слежу' : 'Следить'}${watcherCount > 0 ? ` (${watcherCount})` : ''}
      </button>`;
    }
    tzMeta.innerHTML = metaHtml;
    show(tzMeta);

    // Watch button handler
    $('tzWatchBtn')?.addEventListener('click', async () => {
      try {
        const result = await api(`/api/tz/${id}/watch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin })
        });
        showToast(result.watching ? 'Вы подписались на обновления' : 'Вы отписались', 'ok');
        openTzDetail(id); // refresh
      } catch (err) { showToast(err.message, 'danger'); }
    });

    // History
    if (data.history && data.history.length) {
      renderTzHistory(data.history);
      show(tzHistorySection);
    } else {
      hide(tzHistorySection);
    }

    // Comments
    await renderTzComments(id);

    // Linked tasks
    renderTzLinkedTasks(id, data);

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
    date_release_deadline: 'Дедлайн релиза', completion_notes: 'Примечания к выполнению',
    assignee_id: 'Исполнитель', deadline: 'Дедлайн', approved: 'Утверждение'
  };

  tzHistoryList.innerHTML = history.map((h) => {
    const field = fieldLabels[h.field] || h.field;
    let oldV = h.old_value ?? '—';
    let newV = h.new_value ?? '—';
    if (h.field === 'status') {
      oldV = getBoardStatusLabel(oldV) || cfg?.statusLabels?.[oldV] || oldV;
      newV = getBoardStatusLabel(newV) || cfg?.statusLabels?.[newV] || newV;
    }
    if (h.field === 'description' || h.field === 'completion_notes') {
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

// TZ Comments
async function renderTzComments(tzId) {
  if (!tzCommentsSection) return;
  try {
    const comments = await api(`/api/tz/${tzId}/comments?pin=${encodeURIComponent(state.pin)}`);
    tzCommentsCount.textContent = comments.length ? `(${comments.length})` : '';
    const isSA = state.adminRole === 'superadmin';

    tzCommentsList.innerHTML = comments.length
      ? comments.map((c) => `<div class="tz-comment" data-comment-id="${esc(c.id)}">
          <div class="tz-comment-header">
            <strong>${esc(c.author)}</strong>
            <span class="tz-comment-date">${fmtDate(c.created_at)}</span>
            ${isSA ? `<button type="button" class="tz-comment-delete" title="Удалить">&times;</button>` : ''}
          </div>
          <div class="tz-comment-text">${esc(c.text)}</div>
        </div>`).join('')
      : '<p class="tz-comments-empty">Нет комментариев</p>';

    // Delete handlers
    if (isSA) {
      tzCommentsList.querySelectorAll('.tz-comment-delete').forEach((btn) => {
        btn.addEventListener('click', async () => {
          if (!confirm('Удалить комментарий?')) return;
          const commentId = btn.closest('.tz-comment').dataset.commentId;
          try {
            await api(`/api/tz/${tzId}/comments/${commentId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pin: state.pin })
            });
            await renderTzComments(tzId);
          } catch (err) { showToast(err.message, 'danger'); }
        });
      });
    }

    // Send handler (re-bind each time to capture current tzId)
    tzCommentSendBtn.onclick = async () => {
      const text = tzCommentInput.value.trim();
      if (!text) return;
      tzCommentSendBtn.disabled = true;
      try {
        await api(`/api/tz/${tzId}/comments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, text })
        });
        tzCommentInput.value = '';
        await renderTzComments(tzId);
      } catch (err) { showToast(err.message, 'danger'); }
      finally { tzCommentSendBtn.disabled = false; }
    };

    show(tzCommentsSection);
  } catch {
    hide(tzCommentsSection);
  }
}

// TZ Linked tasks
function renderTzLinkedTasks(tzId, data) {
  let section = document.getElementById('tzLinksSection');
  if (!section) {
    section = document.createElement('div');
    section.id = 'tzLinksSection';
    section.className = 'tz-links-section';
    tzCommentsSection.parentNode.insertBefore(section, tzCommentsSection);
  }
  const links = data.linked_tz_ids || [];
  const isSA = state.adminRole === 'superadmin';
  let html = '<h4>Связанные задачи</h4>';
  if (links.length) {
    html += '<div class="tz-links-list">';
    for (const lid of links) {
      const linked = state.tzList.find((t) => t.id === lid);
      const label = linked ? `${linked.tz_code} — ${linked.title.slice(0, 40)}` : lid.slice(0, 8) + '...';
      html += `<span class="tz-link-chip"><span class="tz-link-chip-text" data-tz-id="${esc(lid)}">${esc(label)}</span>${isSA ? `<button class="tz-link-remove" data-lid="${esc(lid)}">&times;</button>` : ''}</span>`;
    }
    html += '</div>';
  } else {
    html += '<p class="tz-links-empty">Нет связей</p>';
  }
  if (isSA) {
    const tzOpts = state.tzList.filter((t) => t.id !== tzId && !links.includes(t.id)).slice(0, 50);
    html += `<select id="tzLinkAddSelect" class="tz-link-add-select"><option value="">+ Добавить связь...</option>${tzOpts.map((t) => `<option value="${esc(t.id)}">${esc(t.tz_code)} — ${esc(t.title.slice(0, 40))}</option>`).join('')}</select>`;
  }
  section.innerHTML = html;
  show(section);

  // Bind add
  const addSel = document.getElementById('tzLinkAddSelect');
  if (addSel) addSel.addEventListener('change', async () => {
    if (!addSel.value) return;
    const newLinks = [...links, addSel.value];
    try {
      await api(`/api/tz/${tzId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: state.pin, linked_tz_ids: newLinks }) });
      openTzDetail(tzId);
    } catch (err) { showToast(err.message, 'danger'); }
  });
  // Bind remove
  section.querySelectorAll('.tz-link-remove').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const newLinks = links.filter((l) => l !== btn.dataset.lid);
      try {
        await api(`/api/tz/${tzId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin: state.pin, linked_tz_ids: newLinks }) });
        openTzDetail(tzId);
      } catch (err) { showToast(err.message, 'danger'); }
    });
  });
  // Bind chip click to navigate
  section.querySelectorAll('.tz-link-chip-text').forEach((el) => {
    el.addEventListener('click', () => openTzDetail(el.dataset.tzId));
  });
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
    date_release_deadline: $('tzDateRelease').value || '',
    completion_notes: $('tzCompletionNotes').value.trim(),
    assignee_id: $('tzAssignee').value || '',
    deadline: $('tzDeadline').value || ''
  };

  try {
    body.status = $('tzStatus').value;
    if (!state.tzEditId && state.tzBoardId) body.board_id = state.tzBoardId;
    if (state.tzEditId) {
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
tzPopup.addEventListener('click', (e) => { if (e.target === tzPopup && confirm('Закрыть окно?')) hide(tzPopup); });

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

/* ── Kanban view ── */

// Fallback colors for legacy statuses
const KANBAN_STATUS_COLORS_FALLBACK = {
  draft: '#edf2f7', review: '#fefcbf', analysis: '#bee3f8', development: '#c3dafe',
  testing: '#e9d8fd', release: '#feebc8', production: '#c6f6d5', partial: '#fde68a', cancelled: '#fed7d7'
};

function renderKanban(data) {
  if (!tzListContainer) return;
  const { columns, transitions, statusLabels, boardColumns } = data;

  // Use board column order if available, else fallback to keys of columns
  const displayOrder = boardColumns
    ? boardColumns.filter(c => !c.hidden).sort((a, b) => a.order - b.order).map(c => c.id)
    : Object.keys(columns);
  const colorMap = boardColumns
    ? Object.fromEntries(boardColumns.map(c => [c.id, c.color]))
    : KANBAN_STATUS_COLORS_FALLBACK;

  let html = '<div class="kanban-board">';
  for (const status of displayOrder) {
    const cards = columns[status] || [];
    const color = colorMap[status] || '#edf2f7';
    const allowed = transitions[status] || [];

    html += `<div class="kanban-column" data-status="${esc(status)}" data-allowed="${esc(JSON.stringify(allowed))}">
      <div class="kanban-column-header" style="background:${color}">
        <span class="kanban-col-title">${esc(statusLabels[status] || status)}</span>
        <span class="kanban-col-count">${cards.length}</span>
      </div>
      <div class="kanban-cards">`;

    for (const tz of cards) {
      const f = tz.flags || {};
      let flagsHtml = '';
      if (f.overdue) flagsHtml += '<span class="kanban-flag kanban-flag-overdue">Просрочено</span>';
      else if (f.deadline_soon) flagsHtml += '<span class="kanban-flag kanban-flag-soon">Скоро дедлайн</span>';

      html += `<div class="kanban-card" draggable="true" data-tz-id="${esc(tz.id)}" data-status="${esc(tz.status)}">
        <div class="kanban-card-prio kanban-prio-${esc(tz.priority)}"></div>
        <div class="kanban-card-body">
          <div class="kanban-card-code">${esc(tz.tz_code)}</div>
          <div class="kanban-card-title">${esc(tz.title)}</div>
          ${tz.assignee_name ? `<div class="kanban-card-owner">${esc(tz.assignee_name)}</div>` : (tz.owner ? `<div class="kanban-card-owner">${esc(tz.owner)}</div>` : '')}
          ${tz.completion_notes ? '<span class="kanban-flag kanban-flag-notes" title="Есть примечания к выполнению">📝 Примечания</span>' : ''}
          ${flagsHtml}
        </div>
      </div>`;
    }

    html += '</div></div>';
  }
  html += '</div>';
  tzListContainer.innerHTML = html;

  // Bind drag-and-drop
  initKanbanDnD();

  // Bind card click
  tzListContainer.querySelectorAll('.kanban-card').forEach((card) => {
    card.addEventListener('click', () => openTzDetail(card.dataset.tzId));
  });
}

function initKanbanDnD() {
  let dragTzId = null;
  let dragFromStatus = null;

  // Use event delegation on the board container for reliable DnD
  const board = tzListContainer.querySelector('.kanban-board');
  if (!board) return;

  function getColumn(el) {
    return el.closest('.kanban-column');
  }

  board.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.kanban-card');
    if (!card) return;
    dragTzId = card.dataset.tzId;
    dragFromStatus = card.dataset.status;
    card.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', dragTzId);
  });

  board.addEventListener('dragend', (e) => {
    const card = e.target.closest('.kanban-card');
    if (card) card.classList.remove('dragging');
    board.querySelectorAll('.kanban-column').forEach((c) => {
      c.classList.remove('drag-over');
      c.classList.remove('drag-forbidden');
    });
    dragTzId = null;
    dragFromStatus = null;
  });

  board.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dragFromStatus) return;
    const col = getColumn(e.target);
    if (!col) return;
    const targetStatus = col.dataset.status;
    if (targetStatus === dragFromStatus) { e.dataTransfer.dropEffect = 'none'; return; }

    const fromCol = board.querySelector(`.kanban-column[data-status="${dragFromStatus}"]`);
    const fromAllowed = JSON.parse(fromCol?.dataset.allowed || '[]');
    if (fromAllowed.includes(targetStatus)) {
      col.classList.add('drag-over');
      col.classList.remove('drag-forbidden');
      e.dataTransfer.dropEffect = 'move';
    } else {
      col.classList.add('drag-forbidden');
      col.classList.remove('drag-over');
      e.dataTransfer.dropEffect = 'none';
    }
  });

  board.addEventListener('dragleave', (e) => {
    const col = getColumn(e.target);
    if (!col) return;
    // Only clear if actually leaving the column (not entering a child)
    if (!col.contains(e.relatedTarget)) {
      col.classList.remove('drag-over');
      col.classList.remove('drag-forbidden');
    }
  });

  board.addEventListener('drop', async (e) => {
    e.preventDefault();
    const col = getColumn(e.target);
    if (!col) return;
    col.classList.remove('drag-over');
    col.classList.remove('drag-forbidden');
    if (!dragTzId || !dragFromStatus) return;
    const targetStatus = col.dataset.status;
    if (targetStatus === dragFromStatus) return;

    const fromCol = board.querySelector(`.kanban-column[data-status="${dragFromStatus}"]`);
    const fromAllowed = JSON.parse(fromCol?.dataset.allowed || '[]');
    if (!fromAllowed.includes(targetStatus)) return;

    try {
      await api(`/api/tz/${dragTzId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: state.pin, status: targetStatus })
      });
      showToast('Статус изменён', 'ok');
      loadTzData();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  });
}

/* ── Board settings modal ── */

function openCreateBoardModal() {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.id = 'boardCreateOverlay';
  overlay.innerHTML = `<div class="popup-card fade-in" style="max-width:420px">
    <h3>Создать доску</h3>
    <form id="boardCreateForm" class="popup-form">
      <label>Название *<input id="bcName" required placeholder="Название доски" /></label>
      <label>Префикс кода<input id="bcPrefix" placeholder="BD" maxlength="10" style="text-transform:uppercase" /></label>
      <label>Описание<textarea id="bcDesc" rows="2" placeholder="Описание..."></textarea></label>
      <div class="popup-actions">
        <button type="submit" class="btn-primary">Создать</button>
        <button type="button" class="btn-outline-dark" id="bcCancel">Отмена</button>
      </div>
      <p id="bcMsg" class="message"></p>
    </form>
  </div>`;
  document.body.appendChild(overlay);

  document.getElementById('bcCancel').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  document.getElementById('boardCreateForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    try {
      const result = await api('/api/boards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: state.pin,
          name: document.getElementById('bcName').value.trim(),
          code_prefix: document.getElementById('bcPrefix').value.trim() || 'BD',
          description: document.getElementById('bcDesc').value.trim()
        })
      });
      state.tzBoards.push(result.board);
      if (state.tzConfig) state.tzConfig.boards = state.tzBoards;
      state.tzBoardId = result.board.id;
      overlay.remove();
      renderTzFilters();
      loadTzData();
      showToast('Доска создана', 'ok');
    } catch (err) {
      msg(document.getElementById('bcMsg'), err.message, 'error');
      submitBtn.disabled = false;
    }
  });
}

function openBoardSettingsModal() {
  const board = getCurrentBoard();
  if (!board) return;

  const existing = document.getElementById('boardSettingsOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.id = 'boardSettingsOverlay';

  function renderSettingsContent() {
    const cols = board.columns.slice().sort((a, b) => a.order - b.order);
    return `<div class="popup-card fade-in board-settings-card">
      <h3>Настройки доски: ${esc(board.name)}</h3>
      <form id="bsForm" class="popup-form">
        <div class="tz-form-grid">
          <label>Название<input id="bsName" value="${esc(board.name)}" /></label>
          <label>Префикс кода<input id="bsPrefix" value="${esc(board.code_prefix || '')}" maxlength="10" style="text-transform:uppercase" /></label>
        </div>
        <label>Описание<textarea id="bsDesc" rows="2">${esc(board.description || '')}</textarea></label>
        <div class="popup-actions" style="margin-bottom:12px">
          <button type="submit" class="btn-primary">Сохранить</button>
          ${!board.is_default ? '<button type="button" class="btn-outline-dark" id="bsDeleteBoard" style="color:var(--danger)">Удалить доску</button>' : ''}
          <button type="button" class="btn-outline-dark" id="bsClose">Закрыть</button>
        </div>
        <p id="bsMsg" class="message"></p>
      </form>
      <h4 style="margin:12px 0 8px">Колонки</h4>
      <div class="board-columns-list" id="bsColList">
        ${cols.map((c, i) => `<div class="board-col-row" data-col-id="${esc(c.id)}">
          <span class="board-col-drag" title="Перетащить">&#x2630;</span>
          <input type="color" class="board-col-color" value="${esc(c.color)}" data-col-id="${esc(c.id)}" title="Цвет" />
          <input class="board-col-name" value="${esc(c.name)}" data-col-id="${esc(c.id)}" />
          <button type="button" class="board-col-hide-btn" data-col-id="${esc(c.id)}" title="${c.hidden ? 'Показать' : 'Скрыть'}">${c.hidden ? '👁' : '👁‍🗨'}</button>
          <button type="button" class="board-col-del-btn" data-col-id="${esc(c.id)}" title="Удалить">✕</button>
        </div>`).join('')}
      </div>
      <div class="board-add-col-row" style="margin-top:8px;display:flex;gap:6px">
        <input id="bsNewColName" placeholder="Новая колонка..." style="flex:1" />
        <input id="bsNewColColor" type="color" value="#edf2f7" />
        <button type="button" class="btn-primary btn-sm" id="bsAddCol">+</button>
      </div>
    </div>`;
  }

  overlay.innerHTML = renderSettingsContent();
  document.body.appendChild(overlay);

  // Bind overlay close once (not inside bindSettingsEvents to avoid listener stacking)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  function bindSettingsEvents() {
    document.getElementById('bsClose')?.addEventListener('click', () => overlay.remove());

    // Save board info
    document.getElementById('bsForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await api(`/api/boards/${board.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pin: state.pin,
            name: document.getElementById('bsName').value.trim(),
            code_prefix: document.getElementById('bsPrefix').value.trim(),
            description: document.getElementById('bsDesc').value.trim()
          })
        });
        Object.assign(board, result.board);
        const idx = state.tzBoards.findIndex(b => b.id === board.id);
        if (idx >= 0) state.tzBoards[idx] = result.board;
        msg(document.getElementById('bsMsg'), 'Сохранено', 'success');
        renderTzFilters();
      } catch (err) {
        msg(document.getElementById('bsMsg'), err.message, 'error');
      }
    });

    // Delete board
    document.getElementById('bsDeleteBoard')?.addEventListener('click', async () => {
      if (!confirm('Удалить доску? Это действие необратимо.')) return;
      try {
        await api(`/api/boards/${board.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin })
        });
        state.tzBoards = state.tzBoards.filter(b => b.id !== board.id);
        if (state.tzConfig) state.tzConfig.boards = state.tzBoards;
        const def = state.tzBoards.find(b => b.is_default) || state.tzBoards[0];
        state.tzBoardId = def?.id || null;
        overlay.remove();
        renderTzFilters();
        loadTzData();
        showToast('Доска удалена', 'ok');
      } catch (err) {
        msg(document.getElementById('bsMsg'), err.message, 'error');
      }
    });

    // Column name edit (blur)
    document.querySelectorAll('.board-col-name').forEach((inp) => {
      inp.addEventListener('blur', async () => {
        const colId = inp.dataset.colId;
        const newName = inp.value.trim();
        if (!newName) return;
        try {
          const result = await api(`/api/boards/${board.id}/columns/${colId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin, name: newName })
          });
          Object.assign(board, result.board);
          const idx = state.tzBoards.findIndex(b => b.id === board.id);
          if (idx >= 0) state.tzBoards[idx] = result.board;
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    // Column color edit
    document.querySelectorAll('.board-col-color').forEach((inp) => {
      inp.addEventListener('change', async () => {
        const colId = inp.dataset.colId;
        try {
          const result = await api(`/api/boards/${board.id}/columns/${colId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin, color: inp.value })
          });
          Object.assign(board, result.board);
          const idx = state.tzBoards.findIndex(b => b.id === board.id);
          if (idx >= 0) state.tzBoards[idx] = result.board;
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    // Hide/show column
    document.querySelectorAll('.board-col-hide-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const colId = btn.dataset.colId;
        try {
          const result = await api(`/api/boards/${board.id}/columns/${colId}/hide`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin })
          });
          Object.assign(board, result.board);
          const idx = state.tzBoards.findIndex(b => b.id === board.id);
          if (idx >= 0) state.tzBoards[idx] = result.board;
          refreshSettings();
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    // Delete column
    document.querySelectorAll('.board-col-del-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const colId = btn.dataset.colId;
        const cols = board.columns.filter(c => c.id !== colId);
        if (cols.length === 0) { showToast('Нельзя удалить последнюю колонку', 'danger'); return; }
        const targetCol = cols[0].id;
        if (!confirm(`Удалить колонку? Карточки будут перенесены в «${cols[0].name}».`)) return;
        try {
          const result = await api(`/api/boards/${board.id}/columns/${colId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin, target_column: targetCol })
          });
          Object.assign(board, result.board);
          const idx = state.tzBoards.findIndex(b => b.id === board.id);
          if (idx >= 0) state.tzBoards[idx] = result.board;
          refreshSettings();
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    // Add column
    document.getElementById('bsAddCol')?.addEventListener('click', async () => {
      const name = document.getElementById('bsNewColName').value.trim();
      const color = document.getElementById('bsNewColColor').value;
      if (!name) return;
      try {
        const result = await api(`/api/boards/${board.id}/columns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin: state.pin, name, color })
        });
        Object.assign(board, result.board);
        const idx = state.tzBoards.findIndex(b => b.id === board.id);
        if (idx >= 0) state.tzBoards[idx] = result.board;
        refreshSettings();
      } catch (err) { showToast(err.message, 'danger'); }
    });

    // Drag to reorder columns
    initColumnDnD();
  }

  function initColumnDnD() {
    const list = document.getElementById('bsColList');
    if (!list) return;
    let dragEl = null;

    list.querySelectorAll('.board-col-row').forEach((row) => {
      row.draggable = true;
      row.addEventListener('dragstart', (e) => {
        dragEl = row;
        row.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', () => {
        row.classList.remove('dragging');
        dragEl = null;
        list.querySelectorAll('.board-col-row').forEach(r => r.classList.remove('drag-over'));
      });
      row.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (dragEl && dragEl !== row) {
          row.classList.add('drag-over');
          e.dataTransfer.dropEffect = 'move';
        }
      });
      row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
      row.addEventListener('drop', async (e) => {
        e.preventDefault();
        row.classList.remove('drag-over');
        if (!dragEl || dragEl === row) return;
        // Determine new order
        const rows = [...list.querySelectorAll('.board-col-row')];
        const fromIdx = rows.indexOf(dragEl);
        const toIdx = rows.indexOf(row);
        if (fromIdx < toIdx) row.after(dragEl);
        else row.before(dragEl);
        // Send new order to server
        const newRows = [...list.querySelectorAll('.board-col-row')];
        const order = newRows.map((r, i) => ({ id: r.dataset.colId, order: i }));
        try {
          const result = await api(`/api/boards/${board.id}/columns/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin, order })
          });
          Object.assign(board, result.board);
          const idx = state.tzBoards.findIndex(b => b.id === board.id);
          if (idx >= 0) state.tzBoards[idx] = result.board;
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });
  }

  function refreshSettings() {
    overlay.innerHTML = renderSettingsContent();
    bindSettingsEvents();
  }

  bindSettingsEvents();
}

/* ── Knowledge Base (Wiki) ── */

const KB_ICONS = {
  folder: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
  monitor: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  users: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  key: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
  book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  settings: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
};

function kbIcon(name) {
  return KB_ICONS[name] || KB_ICONS.folder;
}

async function loadKbView() {
  if (!state.pin) return;
  if (state.kbView === 'categories') await renderKbCategories();
  else if (state.kbView === 'articles') await renderKbArticles();
  else if (state.kbView === 'article') await renderKbArticle();
}

async function renderKbCategories() {
  msg(kbMessage, '');
  kbBreadcrumbs.innerHTML = '';
  const isSuperadmin = state.adminRole === 'superadmin';

  let toolbarHtml = '<div class="kb-toolbar-row"><h2 class="kb-section-title">База знаний</h2>';
  if (isSuperadmin) {
    toolbarHtml += '<button class="kb-gear-btn" id="kbManageCatsBtn" type="button" title="Управление категориями"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9"/></svg></button>';
  }
  toolbarHtml += '</div><div class="kb-search-row"><input class="kb-search-input" id="kbSearchInput" placeholder="Поиск по статьям..." /></div>';
  kbToolbar.innerHTML = toolbarHtml;

  if (isSuperadmin) {
    document.getElementById('kbManageCatsBtn')?.addEventListener('click', openKbCategoriesManager);
  }

  document.getElementById('kbSearchInput')?.addEventListener('input', (e) => {
    clearTimeout(_kbSearchTimer);
    _kbSearchTimer = setTimeout(() => kbSearch(e.target.value), 300);
  });

  try {
    const cats = await api(`/api/kb/categories?pin=${encodeURIComponent(state.pin)}`);
    state.kbCategories = cats;
    if (!cats.length) {
      kbContent.innerHTML = isSuperadmin
        ? `<div class="kb-empty-state">
            <p class="kb-empty">Категории ещё не созданы</p>
            <button type="button" class="btn-primary" id="kbFirstCatBtn">+ Создать первую категорию</button>
          </div>`
        : '<p class="kb-empty">База знаний пока пуста</p>';
      document.getElementById('kbFirstCatBtn')?.addEventListener('click', openKbCategoriesManager);
      return;
    }

    kbContent.innerHTML = '<div class="kb-categories-grid">' + cats.map((c) => `
      <div class="kb-category-card" data-cat-id="${esc(c.id)}" data-cat-slug="${esc(toSlug(c.name))}">
        <div class="kb-cat-icon">${kbIcon(c.icon)}</div>
        <div class="kb-cat-name">${esc(c.name)}</div>
        <div class="kb-cat-count">${c.articleCount} ${kbPlural(c.articleCount, 'статья', 'статьи', 'статей')}</div>
      </div>
    `).join('') + '</div>';

    kbContent.querySelectorAll('.kb-category-card').forEach((card) => {
      card.addEventListener('click', () => {
        state.kbView = 'articles';
        state.kbCategoryId = card.dataset.catId;
        updateHash(`w/${card.dataset.catSlug}`);
        loadKbView();
      });
    });
  } catch (err) {
    msg(kbMessage, err.message, 'error');
  }
}

function kbPlural(n, one, few, many) {
  const abs = Math.abs(n) % 100;
  const n1 = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (n1 > 1 && n1 < 5) return few;
  if (n1 === 1) return one;
  return many;
}

async function kbSearch(query) {
  if (!query.trim()) { renderKbCategories(); return; }
  try {
    const articles = await api(`/api/kb/articles?pin=${encodeURIComponent(state.pin)}&search=${encodeURIComponent(query)}`);
    renderKbArticleList(articles, `Результаты поиска: "${esc(query)}"`, true);
  } catch (err) {
    msg(kbMessage, err.message, 'error');
  }
}

async function renderKbArticles() {
  msg(kbMessage, '');
  const cat = state.kbCategories.find((c) => c.id === state.kbCategoryId);
  const catName = cat ? cat.name : 'Статьи';
  const isSuperadmin = state.adminRole === 'superadmin';

  if (cat) updateHash(`w/${toSlug(catName)}`);

  kbBreadcrumbs.innerHTML = `<a href="#" class="kb-crumb" id="kbCrumbHome">База знаний</a> <span class="kb-crumb-sep">/</span> <span class="kb-crumb-current">${esc(catName)}</span>`;
  document.getElementById('kbCrumbHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    state.kbView = 'categories';
    updateHash('w');
    loadKbView();
  });

  let toolbarHtml = '<div class="kb-toolbar-row"><h2 class="kb-section-title">' + esc(catName) + '</h2>';
  if (isSuperadmin) {
    toolbarHtml += '<button class="btn-sm btn-primary" id="kbCreateArticleBtn">+ Новая статья</button>';
  }
  toolbarHtml += '</div>';
  kbToolbar.innerHTML = toolbarHtml;

  if (isSuperadmin) {
    document.getElementById('kbCreateArticleBtn')?.addEventListener('click', () => openKbEditor(null));
  }

  try {
    const articles = await api(`/api/kb/articles?pin=${encodeURIComponent(state.pin)}&category_id=${encodeURIComponent(state.kbCategoryId || '')}`);
    renderKbArticleList(articles, null, false);
  } catch (err) {
    msg(kbMessage, err.message, 'error');
  }
}

function renderKbArticleList(articles, title, isSearch) {
  if (title) {
    kbBreadcrumbs.innerHTML = `<a href="#" class="kb-crumb" id="kbCrumbHome">База знаний</a> <span class="kb-crumb-sep">/</span> <span class="kb-crumb-current">${title}</span>`;
    document.getElementById('kbCrumbHome')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.kbView = 'categories';
      updateHash('w');
      loadKbView();
    });
  }

  if (!articles.length) {
    kbContent.innerHTML = '<p class="kb-empty">Статей пока нет</p>';
    return;
  }

  const curCat = state.kbCategories.find((c) => c.id === state.kbCategoryId);
  const catSlug = curCat ? toSlug(curCat.name) : '';

  kbContent.innerHTML = '<div class="kb-article-list">' + articles.map((a) => {
    const artCat = a.category_id ? state.kbCategories.find((c) => c.id === a.category_id) : curCat;
    const artCatSlug = artCat ? toSlug(artCat.name) : catSlug;
    return `
    <div class="kb-article-card" data-article-id="${esc(a.id)}" data-cat-slug="${esc(artCatSlug)}" data-art-slug="${esc(toSlug(a.title))}">
      ${a.pinned ? '<span class="kb-pinned-badge">&#x1F4CC;</span>' : ''}
      <div class="kb-article-card-title">${esc(a.title)}</div>
      <div class="kb-article-card-meta">${esc(a.created_by)} &middot; ${fmtDate(a.updated_at)}</div>
    </div>`;
  }).join('') + '</div>';

  kbContent.querySelectorAll('.kb-article-card').forEach((card) => {
    card.addEventListener('click', () => {
      state.kbView = 'article';
      state.kbArticleId = card.dataset.articleId;
      const slug = card.dataset.catSlug ? `w/${card.dataset.catSlug}/${card.dataset.artSlug}` : `w/${card.dataset.artSlug}`;
      updateHash(slug);
      loadKbView();
    });
  });
}

async function renderKbArticle() {
  msg(kbMessage, '');
  const isSuperadmin = state.adminRole === 'superadmin';

  try {
    const article = await api(`/api/kb/articles/${state.kbArticleId}?pin=${encodeURIComponent(state.pin)}`);
    const cat = state.kbCategories.find((c) => c.id === article.category_id);
    const catName = cat ? cat.name : '';

    // Update hash to canonical slug URL
    if (catName) {
      updateHash(`w/${toSlug(catName)}/${toSlug(article.title)}`);
    }

    let crumbs = `<a href="#" class="kb-crumb" id="kbCrumbHome">База знаний</a>`;
    if (catName) {
      crumbs += ` <span class="kb-crumb-sep">/</span> <a href="#" class="kb-crumb" id="kbCrumbCat">${esc(catName)}</a>`;
    }
    crumbs += ` <span class="kb-crumb-sep">/</span> <span class="kb-crumb-current">${esc(article.title)}</span>`;
    kbBreadcrumbs.innerHTML = crumbs;

    document.getElementById('kbCrumbHome')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.kbView = 'categories';
      updateHash('w');
      loadKbView();
    });
    document.getElementById('kbCrumbCat')?.addEventListener('click', (e) => {
      e.preventDefault();
      state.kbView = 'articles';
      state.kbCategoryId = article.category_id;
      updateHash(`w/${toSlug(catName)}`);
      loadKbView();
    });

    let toolbarHtml = '<div class="kb-toolbar-row">';
    if (isSuperadmin) {
      toolbarHtml += `<button class="btn-sm btn-kb-manage" id="kbEditArticleBtn">Редактировать</button>`;
      toolbarHtml += `<button class="btn-sm btn-danger-outline" id="kbDeleteArticleBtn">Удалить</button>`;
    }
    toolbarHtml += '</div>';
    kbToolbar.innerHTML = toolbarHtml;

    kbContent.innerHTML = `<article class="kb-article-reader">
      <h1 class="kb-article-title">${esc(article.title)}</h1>
      <div class="kb-article-meta">${esc(article.created_by)} &middot; ${fmtDate(article.updated_at)}</div>
      <div class="kb-article-body">${typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(article.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['target', 'allowfullscreen', 'class'] }) : esc(article.content)}</div>
    </article>`;

    if (isSuperadmin) {
      document.getElementById('kbEditArticleBtn')?.addEventListener('click', () => openKbEditor(article));
      document.getElementById('kbDeleteArticleBtn')?.addEventListener('click', async () => {
        if (!confirm('Удалить статью?')) return;
        try {
          await api(`/api/kb/articles/${article.id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin })
          });
          showToast('Статья удалена', 'ok');
          state.kbView = article.category_id ? 'articles' : 'categories';
          state.kbCategoryId = article.category_id;
          loadKbView();
        } catch (err) {
          msg(kbMessage, err.message, 'error');
        }
      });
    }
  } catch (err) {
    msg(kbMessage, err.message, 'error');
  }
}

// KB Editor (Quill)

function initQuill() {
  if (state.kbQuill) { state.kbQuill.off('text-change'); state.kbQuill = null; }
  if (typeof Quill === 'undefined') {
    msg(kbEditorMessage, 'Редактор не загружен. Проверьте подключение к интернету.', 'error');
    return null;
  }
  const q = new Quill('#kbQuillEditor', {
    theme: 'snow',
    placeholder: 'Начните писать статью...',
    modules: {
      toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ align: [] }, { align: 'center' }, { align: 'right' }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        ['clean']
      ]
    }
  });

  // Custom image handler - upload to server
  q.getModule('toolbar').addHandler('image', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.click();
    input.addEventListener('change', async () => {
      const file = input.files[0];
      if (!file) return;
      const fd = new FormData();
      fd.append('image', file);
      fd.append('pin', state.pin);
      try {
        const res = await fetch('/api/kb/upload-image', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Ошибка загрузки');
        const range = q.getSelection(true);
        q.insertEmbed(range.index, 'image', data.url);
        q.setSelection(range.index + 1);
      } catch (err) {
        msg(kbEditorMessage, err.message, 'error');
      }
    });
  });

  // Track pending uploads so submit can wait
  state.kbPendingUploads = 0;

  // Watch for base64 images inserted via paste/drop and replace with server URLs
  q.on('text-change', () => {
    const imgs = q.root.querySelectorAll('img[src^="data:"]:not([data-uploading])');
    for (const img of imgs) {
      const src = img.getAttribute('src');
      img.setAttribute('data-uploading', '1');
      img.style.opacity = '0.4';
      img.style.outline = '2px dashed #1172b6';
      state.kbPendingUploads++;
      fetch(src).then(r => r.blob()).then(blob => {
        const ext = blob.type.split('/')[1] || 'png';
        const file = new File([blob], `pasted.${ext}`, { type: blob.type });
        const fd = new FormData();
        fd.append('image', file);
        fd.append('pin', state.pin);
        return fetch('/api/kb/upload-image', { method: 'POST', body: fd });
      }).then(r => r.json()).then(data => {
        if (data.url && img.parentNode) {
          img.setAttribute('src', data.url);
          img.removeAttribute('data-uploading');
          img.style.opacity = '';
          img.style.outline = '';
        }
      }).catch(() => {
        img.removeAttribute('data-uploading');
        img.style.opacity = '';
        img.style.outline = '';
      }).finally(() => {
        state.kbPendingUploads = Math.max(0, state.kbPendingUploads - 1);
      });
    }
  });

  state.kbQuill = q;
  return q;
}

async function openKbEditor(article) {
  state.kbEditId = article ? article.id : null;
  kbEditorTitle.querySelector('span').textContent = article ? 'Редактировать статью' : 'Новая статья';
  kbEditorSubmitBtn.textContent = article ? 'Сохранить' : 'Создать';
  msg(kbEditorMessage, '');

  // Populate categories select
  const cats = await api(`/api/kb/categories?pin=${encodeURIComponent(state.pin)}`);
  kbEditorCategory.innerHTML = cats.map((c) =>
    `<option value="${esc(c.id)}"${article && article.category_id === c.id ? ' selected' : ''}>${esc(c.name)}</option>`
  ).join('');

  if (!cats.length) {
    kbEditorCategory.innerHTML = '<option value="">Сначала создайте категорию</option>';
  }

  kbEditorTitleInput.value = article ? article.title : '';
  kbEditorPinned.checked = article ? !!article.pinned : false;

  show(kbEditorPopup);

  // Init Quill after popup is visible
  setTimeout(() => {
    const q = initQuill();
    if (q) {
      if (article && article.content) {
        q.root.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(article.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['target', 'allowfullscreen', 'class'] }) : article.content;
      } else {
        q.root.innerHTML = '';
      }
    }
  }, 100);
}

kbEditorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  msg(kbEditorMessage, '');
  kbEditorSubmitBtn.disabled = true;
  const origText = kbEditorSubmitBtn.textContent;
  kbEditorSubmitBtn.textContent = '⏳ Сохранение...';

  const q = state.kbQuill;

  // Extract HTML and replace base64 images with server-uploaded URLs
  let content = q ? q.root.innerHTML : '';

  // Find all base64 images in HTML string and upload each
  const base64Regex = /<img([^>]*?)src="(data:image\/[^"]+)"([^>]*?)>/g;
  const matches = [...content.matchAll(base64Regex)];
  if (matches.length) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const dataUrl = match[2];
      kbEditorSubmitBtn.textContent = `⏳ Загрузка фото ${i + 1}/${matches.length}...`;
      try {
        const resp = await fetch(dataUrl);
        const blob = await resp.blob();
        const ext = blob.type.split('/')[1] || 'png';
        const file = new File([blob], `pasted.${ext}`, { type: blob.type });
        const fd = new FormData();
        fd.append('image', file);
        fd.append('pin', state.pin);
        const upRes = await fetch('/api/kb/upload-image', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (upRes.ok && upData.url) {
          content = content.replace(dataUrl, upData.url);
        }
      } catch (_) { /* keep base64 if upload fails */ }
    }
  }
  kbEditorSubmitBtn.textContent = '⏳ Сохранение...';

  const body = {
    pin: state.pin,
    title: kbEditorTitleInput.value.trim(),
    category_id: kbEditorCategory.value,
    pinned: kbEditorPinned.checked,
    content
  };

  try {
    if (state.kbEditId) {
      await api(`/api/kb/articles/${state.kbEditId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      msg(kbEditorMessage, 'Статья обновлена.', 'success');
    } else {
      await api('/api/kb/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      msg(kbEditorMessage, 'Статья создана.', 'success');
    }
    setTimeout(() => { closeKbEditor(); loadKbView(); }, 600);
  } catch (err) {
    msg(kbEditorMessage, err.message, 'error');
  } finally {
    kbEditorSubmitBtn.disabled = false;
    kbEditorSubmitBtn.textContent = origText;
  }
});

function closeKbEditor() {
  if (state.kbQuill) {
    state.kbQuill.off('text-change');
    state.kbQuill = null;
    const container = document.getElementById('kbQuillEditor');
    if (container) container.innerHTML = '';
  }
  hide(kbEditorPopup);
}
kbEditorCancelBtn.addEventListener('click', closeKbEditor);
kbEditorPopup.addEventListener('click', (e) => { if (e.target === kbEditorPopup && confirm('Закрыть редактор?')) closeKbEditor(); });

// KB Categories manager

async function openKbCategoriesManager() {
  msg(kbCategoriesMessage, '');
  show(kbCategoriesPopup);
  await renderKbCategoriesList();
}

async function renderKbCategoriesList() {
  try {
    const cats = await api(`/api/kb/categories?pin=${encodeURIComponent(state.pin)}`);
    if (!cats.length) {
      kbCategoriesList.innerHTML = '<p class="kb-empty">Нет категорий</p>';
      return;
    }
    kbCategoriesList.innerHTML = cats.map((c) => `
      <div class="kb-cat-manage-item" data-cat-id="${esc(c.id)}">
        <span class="kb-cat-manage-icon">${kbIcon(c.icon)}</span>
        <span class="kb-cat-manage-name">${esc(c.name)}</span>
        <span class="kb-cat-manage-count">${c.articleCount}</span>
        <button class="btn-sm btn-danger-outline kb-cat-delete-btn" data-cat-id="${esc(c.id)}" title="Удалить">&times;</button>
      </div>
    `).join('');

    kbCategoriesList.querySelectorAll('.kb-cat-delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('Удалить категорию?')) return;
        try {
          await api(`/api/kb/categories/${btn.dataset.catId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pin: state.pin })
          });
          await renderKbCategoriesList();
        } catch (err) {
          msg(kbCategoriesMessage, err.message, 'error');
        }
      });
    });
  } catch (err) {
    msg(kbCategoriesMessage, err.message, 'error');
  }
}

kbCatAddBtn.addEventListener('click', async () => {
  const name = kbCatNameInput.value.trim();
  if (!name) return;
  msg(kbCategoriesMessage, '');
  try {
    await api('/api/kb/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, name })
    });
    kbCatNameInput.value = '';
    await renderKbCategoriesList();
  } catch (err) {
    msg(kbCategoriesMessage, err.message, 'error');
  }
});

kbCategoriesCloseBtn.addEventListener('click', () => {
  hide(kbCategoriesPopup);
  if (state.kbView === 'categories') loadKbView();
});
kbCategoriesPopup.addEventListener('click', (e) => { if (e.target === kbCategoriesPopup) { hide(kbCategoriesPopup); if (state.kbView === 'categories') loadKbView(); } });

/* ── TZ Templates ── */

async function loadTzTemplates() {
  if (state.adminRole !== 'superadmin') return;
  try {
    state.tzTemplates = await api(`/api/tz-templates?pin=${encodeURIComponent(state.pin)}`);
  } catch { state.tzTemplates = []; }
}

/* ── Global Search ── */

function initGlobalSearch() {
  if (!globalSearchInput) return;
  const toggleBtn = $('globalSearchToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      globalSearchInput.classList.toggle('hidden');
      if (!globalSearchInput.classList.contains('hidden')) {
        globalSearchInput.focus();
      } else {
        globalSearchInput.value = '';
        hide(globalSearchResults);
      }
    });
  }
  globalSearchInput.addEventListener('input', () => {
    clearTimeout(_globalSearchTimer);
    const q = globalSearchInput.value.trim();
    if (q.length < 2) { hide(globalSearchResults); return; }
    _globalSearchTimer = setTimeout(() => performGlobalSearch(q), 300);
  });
  globalSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { globalSearchInput.value = ''; hide(globalSearchResults); globalSearchInput.classList.add('hidden'); }
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#globalSearchWrap')) { hide(globalSearchResults); globalSearchInput.classList.add('hidden'); globalSearchInput.value = ''; }
  });
}

async function performGlobalSearch(q) {
  try {
    const results = await api(`/api/search?pin=${encodeURIComponent(state.pin)}&q=${encodeURIComponent(q)}`);
    let html = '';
    if (results.tz.length) {
      html += '<div class="gs-section"><div class="gs-section-title">ТЗ</div>';
      for (const t of results.tz) {
        html += `<div class="gs-item gs-item-tz" data-tz-id="${esc(t.id)}"><span class="gs-code">${esc(t.tz_code)}</span> ${esc(t.title)}</div>`;
      }
      html += '</div>';
    }
    if (results.kb.length) {
      html += '<div class="gs-section"><div class="gs-section-title">База знаний</div>';
      for (const a of results.kb) {
        html += `<div class="gs-item gs-item-kb" data-kb-id="${esc(a.id)}" data-cat-id="${esc(a.category_id)}">${esc(a.title)}</div>`;
      }
      html += '</div>';
    }
    if (results.tickets.length) {
      html += '<div class="gs-section"><div class="gs-section-title">ИТ-заявки</div>';
      for (const t of results.tickets) {
        html += `<div class="gs-item gs-item-ticket">${esc(t.category)} — ${esc(t.description)}</div>`;
      }
      html += '</div>';
    }
    if (!html) html = '<div class="gs-empty">Ничего не найдено</div>';
    globalSearchResults.innerHTML = html;
    show(globalSearchResults);

    // Bind clicks
    globalSearchResults.querySelectorAll('.gs-item-tz').forEach((el) => {
      el.addEventListener('click', () => { hide(globalSearchResults); globalSearchInput.value = ''; switchToTab('tz'); setTimeout(() => openTzDetail(el.dataset.tzId), 300); });
    });
    globalSearchResults.querySelectorAll('.gs-item-kb').forEach((el) => {
      el.addEventListener('click', () => { hide(globalSearchResults); globalSearchInput.value = ''; state.kbView = 'article'; state.kbArticleId = el.dataset.kbId; state.kbCategoryId = el.dataset.catId; switchToTab('kb'); });
    });
  } catch { hide(globalSearchResults); }
}

/* ── TZ Task Links ── */

function renderTzLinks(tz, allTzList) {
  const links = tz.linked_tz_ids || [];
  let html = '<div class="tz-links-section"><h4>Связанные задачи</h4>';
  if (links.length) {
    html += '<div class="tz-links-list">';
    for (const lid of links) {
      const linked = allTzList ? allTzList.find((t) => t.id === lid) : null;
      if (linked) {
        html += `<span class="tz-link-chip" data-tz-id="${esc(lid)}">${esc(linked.tz_code)} — ${esc(linked.title.slice(0, 40))}<button class="tz-link-remove" data-lid="${esc(lid)}" title="Убрать">&times;</button></span>`;
      }
    }
    html += '</div>';
  }
  if (state.adminRole === 'superadmin') {
    html += `<div class="tz-link-add-row"><select id="tzLinkAddSelect"><option value="">+ Добавить связь...</option></select></div>`;
  }
  html += '</div>';
  return html;
}

/* ── Metrics Dashboard ── */

let _metricsChartInstances = [];

async function loadMetrics() {
  if (state.adminRole !== 'superadmin') return;
  const boardPayload = state.tzBoardId ? { board_id: state.tzBoardId } : {};
  try {
    const data = await api('/api/admin/tz-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, ...boardPayload })
    });
    renderMetrics(data);
  } catch (err) {
    msg(metricsMessage, err.message, 'error');
  }
}

function renderMetrics(data) {
  if (!metricsContent) return;
  // Destroy old chart instances
  _metricsChartInstances.forEach((c) => c.destroy());
  _metricsChartInstances = [];

  const donePercent = data.total ? Math.round((data.totalDone / data.total) * 100) : 0;
  const inWork = data.total - data.totalDone;

  metricsContent.innerHTML = `
    <div class="metrics-summary">
      <div class="metrics-card">
        <div class="metrics-num">${data.total}</div>
        <div class="metrics-label">Всего задач</div>
      </div>
      <div class="metrics-card metrics-card-accent">
        <div class="metrics-num">${inWork}</div>
        <div class="metrics-label">В работе</div>
      </div>
      <div class="metrics-card metrics-card-success">
        <div class="metrics-num">${data.totalDone}</div>
        <div class="metrics-label">Завершено</div>
      </div>
      <div class="metrics-card">
        <div class="metrics-num">${data.avgCycleTime}<small>д</small></div>
        <div class="metrics-label">Ср. цикл выполнения</div>
      </div>
    </div>
    <div class="metrics-progress-wrap">
      <div class="metrics-progress-header">
        <span>Прогресс завершения</span>
        <span class="metrics-progress-pct">${donePercent}%</span>
      </div>
      <div class="metrics-progress-bar">
        <div class="metrics-progress-fill" style="width:${donePercent}%"></div>
      </div>
    </div>
    <div class="metrics-charts">
      <div class="metrics-chart-wrap metrics-chart-wide"><h4>Динамика создания задач</h4><canvas id="chartCreatedPerWeek"></canvas></div>
      <div class="metrics-chart-wrap"><h4>Распределение по статусам</h4><canvas id="chartStatus"></canvas></div>
      <div class="metrics-chart-wrap"><h4>Распределение по приоритетам</h4><canvas id="chartPriority"></canvas></div>
      <div class="metrics-chart-wrap"><h4>Распределение по типам</h4><canvas id="chartType"></canvas></div>
    </div>`;

  if (typeof Chart === 'undefined') return;

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

  // Created per week (bar chart)
  const ctxWeek = document.getElementById('chartCreatedPerWeek');
  if (ctxWeek) {
    _metricsChartInstances.push(new Chart(ctxWeek, {
      type: 'bar',
      data: {
        labels: data.createdPerWeek.map((w) => w.label),
        datasets: [{ label: 'Создано', data: data.createdPerWeek.map((w) => w.count), backgroundColor: '#3b82f6' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    }));
  }

  // Status distribution (doughnut)
  const ctxStatus = document.getElementById('chartStatus');
  if (ctxStatus) {
    const labels = Object.keys(data.statusCounts);
    const vals = Object.values(data.statusCounts);
    _metricsChartInstances.push(new Chart(ctxStatus, {
      type: 'doughnut',
      data: { labels: labels.map((s) => getBoardStatusLabel(s)), datasets: [{ data: vals, backgroundColor: colors.slice(0, labels.length) }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
    }));
  }

  // Priority (doughnut)
  const ctxPrio = document.getElementById('chartPriority');
  if (ctxPrio) {
    const prioColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
    const labels = Object.keys(data.prioCounts);
    const vals = Object.values(data.prioCounts);
    _metricsChartInstances.push(new Chart(ctxPrio, {
      type: 'doughnut',
      data: { labels: labels.map((p) => TZ_PRIO_LABELS[p] || p), datasets: [{ data: vals, backgroundColor: labels.map((p) => prioColors[p] || '#94a3b8') }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { boxWidth: 12 } } } }
    }));
  }

  // Type (bar)
  const ctxType = document.getElementById('chartType');
  if (ctxType) {
    const labels = Object.keys(data.typeCounts);
    const vals = Object.values(data.typeCounts);
    _metricsChartInstances.push(new Chart(ctxType, {
      type: 'bar',
      data: { labels, datasets: [{ label: 'Кол-во', data: vals, backgroundColor: colors.slice(0, labels.length) }] },
      options: { responsive: true, indexAxis: 'y', plugins: { legend: { display: false } }, scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    }));
  }
}

/* ── Kanban Swimlanes ── */

function renderKanbanSwimlanes(data, swimlaneType) {
  if (!data.swimlanes || !data.swimlanes.length) {
    renderKanban(data);
    return;
  }
  if (!tzListContainer) return;
  const { transitions, statusLabels, boardColumns, swimlanes } = data;
  const displayOrder = boardColumns
    ? boardColumns.filter((c) => !c.hidden).sort((a, b) => a.order - b.order).map((c) => c.id)
    : Object.keys(data.columns);
  const colorMap = boardColumns
    ? Object.fromEntries(boardColumns.map((c) => [c.id, c.color]))
    : {};

  let html = '<div class="kanban-swimlane-board">';
  // Header row
  html += '<div class="kanban-swimlane-header"><div class="kanban-sl-label"></div>';
  for (const status of displayOrder) {
    const color = colorMap[status] || '#edf2f7';
    html += `<div class="kanban-sl-col-header" style="background:${color}">${esc(statusLabels[status] || status)}</div>`;
  }
  html += '</div>';

  for (const sl of swimlanes) {
    html += `<div class="kanban-swimlane-row"><div class="kanban-sl-label">${esc(sl.label)}</div>`;
    for (const status of displayOrder) {
      const cards = sl.columns[status] || [];
      html += `<div class="kanban-sl-cell" data-status="${esc(status)}">`;
      for (const tz of cards) {
        html += `<div class="kanban-card kanban-card-mini" data-tz-id="${esc(tz.id)}" data-status="${esc(tz.status)}">
          <div class="kanban-card-prio kanban-prio-${esc(tz.priority)}"></div>
          <div class="kanban-card-body"><div class="kanban-card-code">${esc(tz.tz_code)}</div><div class="kanban-card-title">${esc(tz.title)}</div></div>
        </div>`;
      }
      html += '</div>';
    }
    html += '</div>';
  }
  html += '</div>';
  tzListContainer.innerHTML = html;

  tzListContainer.querySelectorAll('.kanban-card').forEach((card) => {
    card.addEventListener('click', () => openTzDetail(card.dataset.tzId));
  });
}

/* ── AI Agent ── */

function startAiRefresh() {
  stopAiRefresh();
  aiRefreshInterval = setInterval(loadAiTasks, 5000);
}

function stopAiRefresh() {
  if (aiRefreshInterval) { clearInterval(aiRefreshInterval); aiRefreshInterval = null; }
}

async function loadAiTasks() {
  if (!state.pin || state.adminRole !== 'superadmin') return;
  try {
    const tasks = await api('/api/admin/ai-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin })
    });
    renderAiChat(tasks);
  } catch (err) {
    msg(aiMessage, err.message, 'error');
  }
}

function renderAiChat(tasks) {
  // Render chronologically (oldest first)
  const sorted = [...tasks].reverse();
  aiChat.innerHTML = sorted.map((t) => {
    const time = new Date(t.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    let html = `<div class="ai-msg ai-msg-user"><div class="ai-msg-bubble">${esc(t.prompt)}</div><div class="ai-msg-meta">${esc(t.created_by)} &middot; ${time}</div></div>`;

    if (t.status === 'pending') {
      html += `<div class="ai-msg ai-msg-bot ai-msg-pending"><div class="ai-msg-bubble">Ожидание...</div><button class="btn-cancel-sm ai-cancel-btn" data-id="${t.id}">Отменить</button></div>`;
    } else if (t.status === 'running') {
      html += `<div class="ai-msg ai-msg-bot ai-msg-pending"><div class="ai-msg-bubble">Выполняется...</div></div>`;
    } else if (t.status === 'done') {
      html += `<div class="ai-msg ai-msg-bot"><div class="ai-msg-bubble">${esc(t.result || '(пустой ответ)')}</div></div>`;
    } else if (t.status === 'error') {
      html += `<div class="ai-msg ai-msg-bot ai-msg-error"><div class="ai-msg-bubble">${esc(t.result || 'Ошибка')}</div></div>`;
    } else if (t.status === 'cancelled') {
      html += `<div class="ai-msg ai-msg-bot ai-msg-cancelled"><div class="ai-msg-bubble">Отменено</div></div>`;
    }
    return html;
  }).join('');

  // Scroll to bottom
  aiChat.scrollTop = aiChat.scrollHeight;

  // Cancel button handlers
  aiChat.querySelectorAll('.ai-cancel-btn').forEach((btn) => {
    btn.addEventListener('click', () => cancelAiTask(btn.dataset.id));
  });
}

async function submitAiTask() {
  const prompt = aiPromptInput.value.trim();
  if (prompt.length < 3) { msg(aiMessage, 'Минимум 3 символа', 'error'); return; }
  msg(aiMessage, '');
  aiSendBtn.disabled = true;
  try {
    await api('/api/admin/ai-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, prompt })
    });
    aiPromptInput.value = '';
    await loadAiTasks();
  } catch (err) {
    msg(aiMessage, err.message, 'error');
  } finally {
    aiSendBtn.disabled = false;
  }
}

async function cancelAiTask(taskId) {
  try {
    await api('/api/admin/ai-task-cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: state.pin, taskId })
    });
    await loadAiTasks();
  } catch (err) {
    msg(aiMessage, err.message, 'error');
  }
}

aiSendBtn.addEventListener('click', submitAiTask);
aiPromptInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitAiTask(); }
});

/* ── Init ── */

// Check if this is the standalone IT status page
const itStatusMatch = location.pathname.match(/^\/it-status\/([0-9a-f-]{36})$/);
if (itStatusMatch) {
  renderItStatusPage(itStatusMatch[1]);
} else {
  resetItWizard();

  (async () => {
    const loggedIn = await tryAutoLogin();
    if (loggedIn) {
      showMain(); await loadApp(); showTzNotifications();
      initGlobalSearch();
      await restoreFromHash();
    }
    else { showAuth(); }
  })();
}
