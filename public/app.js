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
const notifBell = $('notifBell');
const notifBadge = $('notifBadge');
const notifPanel = $('notifPanel');
const notifList = $('notifList');

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
const adminContent = $('adminContent');

/* ── TZ DOM ── */
const tabTz = $('tabTz');
const tzStatsBar = $('tzStatsBar');
const tzFilters = $('tzFilters');
const tzListContainer = $('tzListContainer');
// Event delegation for TZ list row clicks
if (tzListContainer) tzListContainer.addEventListener('click', (e) => {
  const row = e.target.closest('tr[data-tz-id]');
  if (!row || e.target.closest('.tz-cb-td') || e.target.closest('.tz-link-icon')) return;
  openTzDetail(row.dataset.tzId);
});
const tzMessage = $('tzMessage');
const tzPopup = $('tzPopup');
const tzForm = $('tzForm');
const tzPopupTitle = $('tzPopupTitle');
const tzSubmitBtn = $('tzSubmitBtn');
const tzDeleteBtn = $('tzDeleteBtn');
const tzCancelBtn = $('tzCancelBtn');
const tzPopupMessage = $('tzPopupMessage');
const tzStatusRow = $('tzStatusRow');
const tzMeta = $('tzMeta');
const tzHistorySection = $('tzHistorySection');
const tzHistoryList = $('tzHistoryList');
const tzCommentsSection = $('tzCommentsSection');
const tzCommentsList = $('tzCommentsList');
// Event delegation for comment delete buttons
if (tzCommentsList) tzCommentsList.addEventListener('click', async (e) => {
  const btn = e.target.closest('.tz-comment-delete');
  if (!btn) return;
  if (!confirm('Удалить комментарий?')) return;
  const comment = btn.closest('.tz-comment');
  const commentId = comment?.dataset.commentId;
  const tzId = tzCommentSendBtn?.dataset.tzId;
  if (!commentId || !tzId) return;
  try {
    await api(`/api/tz/${tzId}/comments/${commentId}`, {
      method: 'DELETE',
      body: JSON.stringify({})
    });
    await renderTzComments(tzId);
  } catch (err) { showToast(err.message, 'danger'); }
});
const tzCommentsCount = $('tzCommentsCount');
const tzCommentInput = $('tzCommentInput');
const tzCommentSendBtn = $('tzCommentSendBtn');
if (tzCommentSendBtn) tzCommentSendBtn.addEventListener('click', async () => {
  const tzId = tzCommentSendBtn.dataset.tzId;
  if (!tzId) return;
  const text = tzCommentInput.value.trim();
  if (!text) return;
  tzCommentSendBtn.disabled = true;
  try {
    await api(`/api/tz/${tzId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    tzCommentInput.value = '';
    await renderTzComments(tzId);
  } catch (err) { showToast(err.message, 'danger'); }
  finally { tzCommentSendBtn.disabled = false; }
});

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
const kbDocUploadBtn = $('kbDocUploadBtn');
const kbDocFileInput = $('kbDocFileInput');
const kbDocUploadStatus = $('kbDocUploadStatus');
const kbCategoriesPopup = $('kbCategoriesPopup');
const kbCategoriesList = $('kbCategoriesList');
const kbCatNameInput = $('kbCatNameInput');
const kbCatAddBtn = $('kbCatAddBtn');
const kbCategoriesCloseBtn = $('kbCategoriesCloseBtn');
const kbCategoriesMessage = $('kbCategoriesMessage');

/* ── Metrics DOM ── */
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

/* ── Tasks DOM ── */
const tasksToolbar = $('tasksToolbar');
const tasksContent = $('tasksContent');

/* ── Work locations (used in profile) ── */

const WORK_LOCATIONS = [
  'Модуль ЖД', 'Модуль КП', 'Офис 2 этаж',
  'Диспетчерская', 'Диспетчеры и операторы КП', 'Приемосдатчик'
];

/* ── State ── */
const state = {
  pin: null,
  user: null,
  userId: null,
  isAdmin: false,
  adminRole: null, // 'superadmin' | null
  permissions: null, // { admin_sections, boards, kb_categories, features }
  settings: { startHour: 8, endHour: 21, slotStep: 0.5 },
  rooms: [],
  bookings: [],
  crmConfig: { modules: [], errorCategories: [] },
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
  adminPage: {}, // { [type]: currentPage }
  tasks: [],
  taskFilter: { status: '', type: '', search: '' }
};

/* ── Module-scope timers (prevent leaks on re-render) ── */
let _tzSearchTimer = null;
let _kbSearchTimer = null;
let _globalSearchTimer = null;
let _linkSearchTimer = null;

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
  if (state.pin) {
    opts.headers = { ...opts.headers, 'X-Auth-Pin': state.pin };
  }
  // Auto-set Content-Type for string bodies (JSON)
  if (opts.body && typeof opts.body === 'string') {
    opts.headers = { 'Content-Type': 'application/json', ...opts.headers };
  }
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Ошибка запроса');
  return data;
}

/** Shorthand: POST JSON via api() */
function postJson(url, body = {}) {
  return api(url, { method: 'POST', body: JSON.stringify(body) });
}
/** Shorthand: PUT JSON via api() */
function putJson(url, body = {}) {
  return api(url, { method: 'PUT', body: JSON.stringify(body) });
}

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }
function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
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
  document.querySelectorAll('.tab').forEach((t) => { t.classList.remove('active'); t.removeAttribute('aria-selected'); });
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  const panelName = tabName.charAt(0).toUpperCase() + tabName.slice(1);
  $('panel' + panelName).classList.add('active');
  if (tabName === 'tz') loadTzData();
  if (tabName === 'kb') loadKbView();
  if (tabName === 'metrics') loadMetrics();
  if (tabName === 'tasks') loadTasks();
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

/* ── UI Customization (per-user tabs & widgets) ── */

const ALL_TABS = [
  { id: 'schedule', label: 'Переговорки', alwaysAvailable: true },
  { id: 'crm', label: 'Заявка 1С CRM', alwaysAvailable: true },
  { id: 'tz', label: 'ТЗ' },
  { id: 'tasks', label: 'Мои задачи' },
  { id: 'ai', label: 'AI' },
  { id: 'kb', label: 'База знаний' },
  { id: 'metrics', label: 'Метрики' },
  { id: 'links', label: 'Ссылки', alwaysAvailable: true }
];

const ALL_WIDGETS = [
  { id: 'tz-stats', label: 'Статистика ТЗ', section: 'ТЗ' },
  { id: 'tz-filters', label: 'Фильтры ТЗ', section: 'ТЗ' },
  { id: 'schedule-controls', label: 'Контроль переговорок', section: 'Переговорки' },
  { id: 'tasks-filters', label: 'Фильтры задач', section: 'Мои задачи' },
  { id: 'kb-search', label: 'Поиск KB', section: 'База знаний' }
];

let _userPrefs = { tabs: null, hiddenWidgets: [] };

async function loadUserPrefs() {
  try {
    const prefs = await api('/api/user-prefs');
    _userPrefs = { tabs: prefs.tabs || null, hiddenWidgets: prefs.hiddenWidgets || [] };
  } catch { /* defaults */ }
}

async function saveUserPrefs() {
  try {
    await api('/api/user-prefs', { method: 'PUT', body: JSON.stringify(_userPrefs) });
  } catch { /* silent */ }
}

function applyTabOrder() {
  const nav = $('mainTabs');
  const settingsBtn = $('tabSettingsBtn');
  if (!nav) return;

  const tabOrder = _userPrefs.tabs ? _userPrefs.tabs.order : ALL_TABS.map(t => t.id);
  const hiddenTabs = _userPrefs.tabs ? (_userPrefs.tabs.hidden || []) : [];

  // Reorder DOM
  const tabEls = {};
  nav.querySelectorAll('.tab[data-tab]').forEach(el => { tabEls[el.dataset.tab] = el; });

  for (const tabId of tabOrder) {
    if (tabEls[tabId]) nav.insertBefore(tabEls[tabId], settingsBtn);
  }
  // Append any tabs not in order (new ones)
  for (const t of ALL_TABS) {
    if (!tabOrder.includes(t.id) && tabEls[t.id]) nav.insertBefore(tabEls[t.id], settingsBtn);
  }

  // Apply hidden (user-hidden tabs get display:none even if they'd otherwise show)
  for (const tabId of hiddenTabs) {
    const el = tabEls[tabId];
    if (el) el.dataset.userHidden = '1';
  }
}

function applyWidgetVisibility() {
  const hidden = _userPrefs.hiddenWidgets || [];
  for (const wid of ALL_WIDGETS) {
    const el = document.querySelector(`[data-widget="${wid.id}"]`);
    if (el) {
      el.style.display = hidden.includes(wid.id) ? 'none' : '';
    }
  }
}

function isTabUserHidden(tabId) {
  return _userPrefs.tabs && (_userPrefs.tabs.hidden || []).includes(tabId);
}

function renderUiSettings() {
  const tabsList = $('uiTabsList');
  const widgetsList = $('uiWidgetsList');
  if (!tabsList || !widgetsList) return;

  const order = _userPrefs.tabs ? _userPrefs.tabs.order : ALL_TABS.map(t => t.id);
  const hiddenTabs = _userPrefs.tabs ? (_userPrefs.tabs.hidden || []) : [];

  // Tabs
  let html = '';
  const orderedTabs = order.map(id => ALL_TABS.find(t => t.id === id)).filter(Boolean);
  // Add any missing tabs
  for (const t of ALL_TABS) {
    if (!orderedTabs.find(ot => ot.id === t.id)) orderedTabs.push(t);
  }

  for (const t of orderedTabs) {
    const visible = !hiddenTabs.includes(t.id);
    html += `<div class="ui-tab-row" draggable="true" data-tab-id="${t.id}">
      <span class="ui-tab-drag"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="8" y2="6.01"/><line x1="16" y1="6" x2="16" y2="6.01"/><line x1="8" y1="12" x2="8" y2="12.01"/><line x1="16" y1="12" x2="16" y2="12.01"/><line x1="8" y1="18" x2="8" y2="18.01"/><line x1="16" y1="18" x2="16" y2="18.01"/></svg></span>
      <span class="ui-tab-name">${t.label}</span>
      <label class="ui-tab-toggle"><input type="checkbox" data-tab-toggle="${t.id}" ${visible ? 'checked' : ''} /><span class="toggle-slider"></span></label>
    </div>`;
  }
  tabsList.innerHTML = html;

  // Widgets
  let wHtml = '';
  const hiddenWidgets = _userPrefs.hiddenWidgets || [];
  for (const w of ALL_WIDGETS) {
    const visible = !hiddenWidgets.includes(w.id);
    wHtml += `<div class="ui-widget-row">
      <span class="ui-widget-section">${w.section}</span>
      <span class="ui-widget-name">${w.label}</span>
      <label class="ui-tab-toggle"><input type="checkbox" data-widget-toggle="${w.id}" ${visible ? 'checked' : ''} /><span class="toggle-slider"></span></label>
    </div>`;
  }
  widgetsList.innerHTML = wHtml;

  // Drag-and-drop for tabs
  let dragSrc = null;
  tabsList.querySelectorAll('.ui-tab-row').forEach(row => {
    row.addEventListener('dragstart', (e) => {
      dragSrc = row;
      row.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      tabsList.querySelectorAll('.ui-tab-row').forEach(r => r.classList.remove('drag-over'));
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (row !== dragSrc) row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', () => row.classList.remove('drag-over'));
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      row.classList.remove('drag-over');
      if (dragSrc && dragSrc !== row) {
        const allRows = [...tabsList.querySelectorAll('.ui-tab-row')];
        const srcIdx = allRows.indexOf(dragSrc);
        const tgtIdx = allRows.indexOf(row);
        if (srcIdx < tgtIdx) row.after(dragSrc);
        else row.before(dragSrc);
      }
    });
  });
}

function collectUiSettings() {
  const tabsList = $('uiTabsList');
  const order = [];
  const hidden = [];
  tabsList.querySelectorAll('.ui-tab-row').forEach(row => {
    const id = row.dataset.tabId;
    order.push(id);
    const cb = row.querySelector('input[data-tab-toggle]');
    if (cb && !cb.checked) hidden.push(id);
  });
  _userPrefs.tabs = { order, hidden };

  const hiddenWidgets = [];
  document.querySelectorAll('input[data-widget-toggle]').forEach(cb => {
    if (!cb.checked) hiddenWidgets.push(cb.dataset.widgetToggle);
  });
  _userPrefs.hiddenWidgets = hiddenWidgets;
}

// Event handlers
$('tabSettingsBtn')?.addEventListener('click', () => {
  renderUiSettings();
  show($('uiSettingsPopup'));
});
$('uiSettingsCancel')?.addEventListener('click', () => hide($('uiSettingsPopup')));
$('uiSettingsSave')?.addEventListener('click', async () => {
  collectUiSettings();
  await saveUserPrefs();
  applyTabOrder();
  applyWidgetVisibility();
  showMain();
  hide($('uiSettingsPopup'));
  showToast('Настройки сохранены', 'ok');
});
$('uiSettingsReset')?.addEventListener('click', async () => {
  _userPrefs = { tabs: null, hiddenWidgets: [] };
  await saveUserPrefs();
  // Remove user-hidden flags
  document.querySelectorAll('.tab[data-user-hidden]').forEach(el => delete el.dataset.userHidden);
  applyTabOrder();
  applyWidgetVisibility();
  showMain();
  hide($('uiSettingsPopup'));
  showToast('Настройки сброшены', 'ok');
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
      const cats = await api(`/api/kb/categories`);
      state.kbCategories = cats;
      const cat = cats.find((c) => toSlug(c.name) === h.kbCatSlug);
      if (cat && h.kbArticleSlug) {
        const articles = await api(`/api/kb/articles?category_id=${encodeURIComponent(cat.id)}`);
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
      body: JSON.stringify({ pin: saved })
    });
    state.pin = saved;
    state.user = { fullName: data.fullName, contact: data.contact, position: data.position || '',
      workLocation: data.workLocation || '', workDesk: data.workDesk || '' };
    state.userId = data.userId;
    state.isAdmin = !!data.admin;
    state.adminRole = data.adminRole || null;
    state.avatar = data.avatar || '';
    state.permissions = data.permissions || null;
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
  const hasAdminAccess = state.adminRole === 'superadmin' ||
    (state.permissions?.admin_sections && (state.permissions.admin_sections === '*' || state.permissions.admin_sections.length > 0));
  if (hasAdminAccess) {
    show(adminBtn);
    updatePinBadge();
  } else {
    hide(adminBtn);
  }
  const hasTzAccess = state.adminRole === 'superadmin' ||
    (state.permissions?.boards === '*') ||
    (state.tzBoards || []).some(b => {
      if (b.access === 'all') return true;
      if (b.access === 'admins' && state.isAdmin) return true;
      if (b.access === state.adminRole) return true;
      if (state.permissions?.boards && Array.isArray(state.permissions.boards) && state.permissions.boards.includes(b.id)) return true;
      return false;
    });
  // System visibility rules
  const tabVisibility = {
    tz: state.pin && hasTzAccess,
    ai: state.adminRole === 'superadmin',
    kb: !!state.pin,
    tasks: !!state.pin,
    metrics: false, // скрыты до востребования
    schedule: true,
    crm: true,
    links: true
  };

  // Apply: system rule AND user preference
  document.querySelectorAll('.tab[data-tab]').forEach(tab => {
    const id = tab.dataset.tab;
    const systemVisible = tabVisibility[id] !== undefined ? tabVisibility[id] : true;
    const userHidden = isTabUserHidden(id);
    tab.style.display = (systemVisible && !userHidden) ? '' : 'none';
  });

  // Show settings gear
  const settingsBtn = $('tabSettingsBtn');
  if (settingsBtn) show(settingsBtn);

  show(notifBell);
  startNotifPolling();
  updateTzBadge();
}

function showAuth() {
  show(authScreen);
  hide(mainScreen);
  hide(notifBell);
  stopNotifPolling();
  notifPanel?.classList.add('hidden');
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
    state.permissions = data.permissions || null;
    localStorage.setItem('lkds_pin', enteredPin);
    showMain();
    await loadApp();
    showTzNotifications();
    startBookingReminders();
    showOnboarding();
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
    setTimeout(async () => { showMain(); await loadApp(); showOnboarding(); await restoreFromHash(); }, 1500);
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
    state.tzConfig = await api('/api/tz-config');
    state.tzBoards = state.tzConfig.boards || [];
    if (!state.tzBoardId && state.tzBoards.length) {
      const defBoard = state.tzBoards.find(b => b.is_default) || state.tzBoards[0];
      state.tzBoardId = defBoard.id;
    }
  } catch { /* no tz-config */ }

  try { state.roles = await api('/api/roles'); } catch { state.roles = []; }

  // Load user UI preferences
  await loadUserPrefs();
  applyTabOrder();
  applyWidgetVisibility();

  renderRooms();
  renderLinks(links);
  renderCrmConfig();

  if (state.adminRole === 'superadmin' && state.tzConfig) {
    renderTzFilters();
    await loadTzTemplates();
  }
  dateInput.value = getToday();
  await loadBookings();
  try { state.tasks = await api('/api/tasks'); updateTasksBadge(); } catch { /* ignore */ }
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

  // Determine if viewing today for "now" indicator
  const today = new Date().toISOString().slice(0, 10);
  const isToday = dateInput.value === today;
  const now = new Date();
  const nowHour = now.getHours() + now.getMinutes() / 60;

  let html = '';
  let slotIdx = 0;
  for (let t = startHour; t < endHour; t += step) {
    const label = `${fmtTime(t)} – ${fmtTime(t + step)}`;
    const bk = state.bookings.find((b) => b.startHour <= t && b.endHour > t);
    const isCurrent = isToday && nowHour >= t && nowHour < t + step;
    const isPast = isToday && nowHour >= t + step;
    const progressPct = isCurrent ? Math.round(((nowHour - t) / step) * 100) : 0;
    const rowClass = `slot-row${isCurrent ? ' slot-now' : ''}${isPast ? ' slot-past' : ''}`;
    const progressBar = isCurrent ? `<div class="slot-progress" style="width:${progressPct}%"></div>` : '';
    if (isCurrent) html += `<div class="slot-now-label">● сейчас</div>`;
    if (bk) {
      const isFirst = bk.startHour === t;
      const span = isFirst ? `${fmtTime(bk.startHour)}–${fmtTime(bk.endHour)}` : '';
      const isOwn = bk.fullName === state.user.fullName;
      const cancelBtn = (isOwn || state.isAdmin)
        ? ` <button class="btn-cancel-slot" data-bid="${bk.id}" data-hour="${t}" title="Отменить">✕</button>` : '';
      html += `<div class="${rowClass}" style="--i:${slotIdx}">
        <div class="slot-time">${label}</div>
        <div class="slot-status busy">
          ${progressBar}
          ${esc(bk.topic)}${cancelBtn}
          <span class="slot-info">
            <a href="#" class="slot-profile-link" data-pin="${esc(bk.pin)}">${esc(bk.fullName)}</a>
            · ${esc(bk.contact)}${span ? ' · ' + span : ''}
          </span>
        </div>
      </div>`;
    } else {
      html += `<div class="${rowClass}" style="--i:${slotIdx}">
        <div class="slot-time">${label}</div>
        <div class="slot-status free${isPast ? '' : ' clickable'}" ${isPast ? '' : `data-hour="${t}"`}>${isPast ? '—' : 'Свободно'}</div>
      </div>`;
    }
    slotIdx++;
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

  // Auto-scroll to current time slot
  const nowLabel = scheduleGrid.querySelector('.slot-now-label');
  if (nowLabel) nowLabel.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Auto-refresh every 60s to keep "now" indicator current
  clearTimeout(renderSchedule._timer);
  if (isToday) renderSchedule._timer = setTimeout(() => renderSchedule(), 60000);
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
      body: JSON.stringify({

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
      body: JSON.stringify({})
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
      body: JSON.stringify({ cancelHour: slotHour })
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
      body: JSON.stringify({ text: suggestForm.text.value.trim() })
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
    const data = await api(`/api/profile/${pin}`);

    profileTitle.textContent = isOwn ? 'Мой профиль' : 'Профиль';
    profileName.textContent = data.fullName;
    profileAvatar.src = avatarUrl(data.avatar);
    profilePosition.value = data.position || '';
    profileContact.value = data.contact || '';
    profileDate.textContent = fmtDate(data.createdAt);

    // Workplace fields
    profileWorkLocation.innerHTML = '<option value="">Не указано</option>' +
      WORK_LOCATIONS.map((l) => `<option value="${esc(l)}"${l === data.workLocation ? ' selected' : ''}>${esc(l)}</option>`).join('');
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
      body: JSON.stringify({

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
  xhr.setRequestHeader('X-Auth-Pin', state.pin);
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

/* ── Admin panel ── */

const pinRequestsBadge = $('pinRequestsBadge');

async function updatePinBadge() {
  try {
    const data = await api('/api/admin/pin-requests', {
      method: 'POST',
      body: JSON.stringify({})
    });
    if (data.length > 0) {
      pinRequestsBadge.textContent = data.length;
      show(pinRequestsBadge);
    } else {
      hide(pinRequestsBadge);
    }
  } catch { hide(pinRequestsBadge); }
}

function canAccessAdminTab(tabId) {
  if (state.adminRole === 'superadmin') return true;
  const p = state.permissions;
  if (!p || !p.admin_sections) return false;
  if (p.admin_sections === '*') return true;
  return p.admin_sections.includes(tabId);
}

/* ── Notification bell events ── */
notifBell?.addEventListener('click', (e) => {
  e.stopPropagation();
  notifPanel.classList.toggle('hidden');
  if (!notifPanel.classList.contains('hidden')) loadNotifications();
});

$('notifReadAll')?.addEventListener('click', async () => {
  try {
    await api('/api/notifications/read', {
      method: 'POST',
      body: JSON.stringify({ ids: 'all' })
    });
    notifBadge.textContent = '';
    notifList.querySelectorAll('.unread').forEach(el => el.classList.remove('unread'));
  } catch { /* ignore */ }
});

notifList?.addEventListener('click', async (e) => {
  const item = e.target.closest('.notif-item');
  if (!item) return;
  const nid = item.dataset.nid;
  const link = item.dataset.link;
  if (item.classList.contains('unread')) {
    item.classList.remove('unread');
    try {
      await api('/api/notifications/read', {
        method: 'POST',
        body: JSON.stringify({ ids: [nid] })
      });
      loadNotifCount();
    } catch { /* ignore */ }
  }
  if (link) {
    notifPanel.classList.add('hidden');
    location.hash = link;
  }
});

document.addEventListener('click', (e) => {
  if (notifPanel && !notifPanel.classList.contains('hidden') && !notifPanel.contains(e.target) && e.target !== notifBell && !notifBell.contains(e.target)) {
    notifPanel.classList.add('hidden');
  }
});

adminBtn.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
  $('panelAdmin').classList.add('active');

  // Show/hide admin tabs based on permissions
  let firstVisible = null;
  document.querySelectorAll('.admin-tab').forEach((tab) => {
    const tabId = tab.dataset.atab;
    const allowed = canAccessAdminTab(tabId);
    tab.style.display = allowed ? '' : 'none';
    if (allowed && !firstVisible) firstVisible = tabId;
  });
  if (firstVisible) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    const firstTab = document.querySelector(`.admin-tab[data-atab="${firstVisible}"]`);
    if (firstTab) firstTab.classList.add('active');
    loadAdminData(firstVisible);
  }
  updatePinBadge();
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
  if (type === 'roles-access') { await renderRolesAccess(); return; }
  if (type === 'roles') { await renderRolesAccess(); return; }
  if (page !== undefined) state.adminPage[type] = page;
  const currentPage = state.adminPage[type] || 1;
  try {
    const data = await api(`/api/admin/${type}`, {
      method: 'POST',
      body: JSON.stringify({ page: currentPage, pageSize: ADMIN_PAGE_SIZE })
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
      body: JSON.stringify({})
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

          body: JSON.stringify({ field: btn.dataset.crmField, value: btn.dataset.crmValue })
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

          body: JSON.stringify({ field: form.dataset.crmField, value })
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

/* ── Roles & Access admin tab ── */

async function renderRolesAccess() {
  adminContent.innerHTML = '<p class="admin-empty">Загрузка...</p>';
  try {
    const data = await api('/api/admin/access');
    const { roles = [], groups = [], boards = [], kb_categories: kbCats = [], users = [], adminSections = [], features = [] } = data;

    let html = '';

    /* ── Section A: Roles ── */
    html += '<div class="roles-access-section">';
    html += '<h3>Роли</h3>';
    html += '<button class="btn-primary btn-sm" id="raCreateRoleBtn">+ Создать роль</button>';
    html += '<div id="raRoleForm" class="hidden" style="margin:12px 0"></div>';
    html += '<table class="admin-table" id="raRolesTable"><tr><th>Название</th><th>Описание</th><th></th><th></th></tr>';
    for (const r of roles) {
      html += '<tr><td>' + esc(r.name) + '</td><td>' + esc(r.description || '') + '</td>';
      html += '<td>' + (r.system ? '<span class="role-badge-system">системная</span>' : '') + '</td>';
      html += '<td>';
      html += '<button class="btn-edit-user ra-role-edit" data-rid="' + esc(r.id) + '">Ред.</button> ';
      if (!r.system) html += '<button class="btn-cancel-sm ra-role-del" data-rid="' + esc(r.id) + '">Удалить</button>';
      html += '</td></tr>';
      html += '<tr class="hidden" id="raRoleDetail_' + esc(r.id) + '"><td colspan="4"><div class="ra-role-detail"></div></td></tr>';
    }
    html += '</table>';
    html += '</div>';

    /* ── Section B: Groups ── */
    html += '<div class="roles-access-section">';
    html += '<h3>Группы</h3>';
    html += '<button class="btn-primary btn-sm" id="raCreateGroupBtn">+ Создать группу</button>';
    html += '<div id="raGroupForm" class="hidden" style="margin:12px 0"></div>';
    html += '<div class="ra-groups-grid" id="raGroupsGrid">';
    for (const g of groups) {
      html += '<div class="group-card" data-gid="' + esc(g.id) + '">';
      html += '<div class="group-card-header"><strong>' + esc(g.name) + '</strong><span style="color:var(--text-sec);font-size:12px">' + (g.members || []).length + ' уч.</span></div>';
      if (g.description) html += '<p style="font-size:12px;color:var(--text-sec);margin:4px 0">' + esc(g.description) + '</p>';
      html += '<button class="btn-sm btn-secondary ra-group-edit" data-gid="' + esc(g.id) + '">Настроить</button>';
      html += '</div>';
    }
    if (!groups.length) html += '<p class="admin-empty">Групп нет</p>';
    html += '</div></div>';

    /* ── Section C: User Roles ── */
    html += '<div class="roles-access-section">';
    html += '<h3>Роли пользователей</h3>';
    html += '<table class="admin-table" id="raUsersTable"><tr><th>ФИО</th><th>Роль</th><th>Группы</th></tr>';
    for (const u of users) {
      const userGroups = groups.filter(g => (g.members || []).includes(u.id)).map(g => esc(g.name)).join(', ') || '—';
      const roleOpts = roles.map(r => '<option value="' + esc(r.id) + '"' + (r.id === (u.role || 'employee') ? ' selected' : '') + '>' + esc(r.name) + '</option>').join('');
      html += '<tr><td>' + esc(u.fullName) + '</td>';
      html += '<td><select class="ra-user-role" data-uid="' + esc(u.id) + '">' + roleOpts + '</select></td>';
      html += '<td style="font-size:12px;color:var(--text-sec)">' + userGroups + '</td></tr>';
    }
    html += '</table></div>';

    adminContent.innerHTML = html;

    /* ── Build permission checkboxes helper ── */
    function permCheckboxes(prefix, perms, readonly) {
      const dis = readonly ? ' disabled checked' : '';
      let h = '<div class="perm-grid">';
      if (adminSections.length) {
        h += '<div class="perm-group"><h4>Разделы админки</h4>';
        for (const s of adminSections) {
          const ck = readonly || (perms.admin_sections || []).includes(s.id) ? ' checked' : '';
          h += '<label class="perm-label"><input type="checkbox" data-pcat="admin_sections" value="' + esc(s.id) + '"' + ck + dis + ' /> ' + esc(s.label) + '</label>';
        }
        h += '</div>';
      }
      if (boards.length) {
        h += '<div class="perm-group"><h4>Доски ТЗ</h4>';
        for (const b of boards) {
          const ck = readonly || (perms.boards || []).includes(b.id) ? ' checked' : '';
          h += '<label class="perm-label"><input type="checkbox" data-pcat="boards" value="' + esc(b.id) + '"' + ck + dis + ' /> ' + esc(b.name) + '</label>';
        }
        h += '</div>';
      }
      if (kbCats.length) {
        h += '<div class="perm-group"><h4>Категории базы знаний</h4>';
        for (const c of kbCats) {
          const ck = readonly || (perms.kb_categories || []).includes(c.id) ? ' checked' : '';
          h += '<label class="perm-label"><input type="checkbox" data-pcat="kb_categories" value="' + esc(c.id) + '"' + ck + dis + ' /> ' + esc(c.name) + '</label>';
        }
        h += '</div>';
      }
      if (features.length) {
        h += '<div class="perm-group"><h4>Функции</h4>';
        for (const f of features) {
          const ck = readonly || (perms.features || []).includes(f.id) ? ' checked' : '';
          h += '<label class="perm-label"><input type="checkbox" data-pcat="features" value="' + esc(f.id) + '"' + ck + dis + ' /> ' + esc(f.label) + '</label>';
        }
        h += '</div>';
      }
      h += '</div>';
      return h;
    }

    function gatherPerms(container) {
      const perms = { admin_sections: [], boards: [], kb_categories: [], features: [] };
      container.querySelectorAll('input[data-pcat]:checked:not(:disabled)').forEach(cb => {
        const cat = cb.dataset.pcat;
        if (perms[cat]) perms[cat].push(cb.value);
      });
      return perms;
    }

    /* ── Role inline form (create) ── */
    function showRoleCreateForm() {
      const formEl = $('raRoleForm');
      formEl.classList.remove('hidden');
      formEl.innerHTML = '<div style="border:1px solid var(--border);border-radius:10px;padding:16px;background:var(--bg-soft)">' +
        '<label>Название <input id="raNewRoleName" placeholder="Менеджер проекта" /></label>' +
        '<label style="margin-top:8px">Описание <input id="raNewRoleDesc" placeholder="Описание роли" /></label>' +
        '<h4 style="margin:12px 0 8px">Разрешения</h4>' +
        permCheckboxes('new', {}, false) +
        '<div style="margin-top:12px;display:flex;gap:8px">' +
        '<button class="btn-primary btn-sm" id="raNewRoleSave">Сохранить</button>' +
        '<button class="btn-outline-dark btn-sm" id="raNewRoleCancel">Отмена</button></div>' +
        '<p id="raNewRoleMsg" class="message"></p></div>';
      $('raNewRoleCancel').addEventListener('click', () => { formEl.classList.add('hidden'); formEl.innerHTML = ''; });
      $('raNewRoleSave').addEventListener('click', async () => {
        const name = $('raNewRoleName').value.trim();
        if (!name) { msg($('raNewRoleMsg'), 'Укажите название', 'error'); return; }
        const permissions = gatherPerms(formEl);
        try {
          await api('/api/admin/access/roles', {
            method: 'POST',
                        body: JSON.stringify({ name, description: $('raNewRoleDesc').value.trim(), permissions })
          });
          showToast('Роль создана', 'ok');
          await renderRolesAccess();
        } catch (err) { msg($('raNewRoleMsg'), err.message, 'error'); }
      });
    }

    $('raCreateRoleBtn').addEventListener('click', showRoleCreateForm);

    /* ── Role edit (inline expand) ── */
    adminContent.querySelectorAll('.ra-role-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const rid = btn.dataset.rid;
        const detailRow = $('raRoleDetail_' + rid);
        if (!detailRow) return;
        if (!detailRow.classList.contains('hidden')) { detailRow.classList.add('hidden'); return; }
        const role = roles.find(r => r.id === rid);
        if (!role) return;
        const isSuperadmin = role.id === 'superadmin';
        const perms = role.permissions || {};
        const det = detailRow.querySelector('.ra-role-detail');
        det.innerHTML = '<div style="border:1px solid var(--border);border-radius:10px;padding:16px;background:var(--bg-soft)">' +
          '<label>Название <input class="raEditName" value="' + esc(role.name) + '"' + (isSuperadmin ? ' disabled' : '') + ' /></label>' +
          '<label style="margin-top:8px">Описание <input class="raEditDesc" value="' + esc(role.description || '') + '"' + (isSuperadmin ? ' disabled' : '') + ' /></label>' +
          '<h4 style="margin:12px 0 8px">Разрешения' + (isSuperadmin ? ' <span style="font-weight:400;font-size:12px;color:var(--text-sec)">(суперадмин — полный доступ)</span>' : '') + '</h4>' +
          permCheckboxes('edit', perms, isSuperadmin) +
          (!isSuperadmin ? '<div style="margin-top:12px;display:flex;gap:8px">' +
            '<button class="btn-primary btn-sm raEditSave">Сохранить</button>' +
            '<button class="btn-outline-dark btn-sm raEditCancel">Отмена</button></div>' : '') +
          '<p class="raEditMsg message"></p></div>';
        detailRow.classList.remove('hidden');

        det.querySelector('.raEditCancel')?.addEventListener('click', () => detailRow.classList.add('hidden'));
        det.querySelector('.raEditSave')?.addEventListener('click', async () => {
          const name = det.querySelector('.raEditName').value.trim();
          if (!name) { msg(det.querySelector('.raEditMsg'), 'Укажите название', 'error'); return; }
          const permissions = gatherPerms(det);
          try {
            await api('/api/admin/access/roles/' + encodeURIComponent(rid), {
              method: 'PUT',
                            body: JSON.stringify({ name, description: det.querySelector('.raEditDesc').value.trim(), permissions })
            });
            showToast('Роль обновлена', 'ok');
            await renderRolesAccess();
          } catch (err) { msg(det.querySelector('.raEditMsg'), err.message, 'error'); }
        });
      });
    });

    /* ── Role delete ── */
    adminContent.querySelectorAll('.ra-role-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Удалить роль?')) return;
        try {
          await api('/api/admin/access/roles/' + encodeURIComponent(btn.dataset.rid), {
            method: 'DELETE',
                        body: JSON.stringify({})
          });
          showToast('Роль удалена', 'ok');
          await renderRolesAccess();
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    /* ── Group create form ── */
    function showGroupForm(group) {
      const isEdit = !!group;
      const formEl = $('raGroupForm');
      formEl.classList.remove('hidden');
      const perms = (isEdit && group.permissions) ? group.permissions : {};
      const members = isEdit ? (group.members || []) : [];
      formEl.innerHTML = '<div style="border:1px solid var(--border);border-radius:10px;padding:16px;background:var(--bg-soft)">' +
        '<label>Название <input id="raGrpName" value="' + (isEdit ? esc(group.name) : '') + '" placeholder="Название группы" /></label>' +
        '<label style="margin-top:8px">Описание <input id="raGrpDesc" value="' + (isEdit ? esc(group.description || '') : '') + '" placeholder="Описание" /></label>' +
        '<h4 style="margin:12px 0 8px">Участники</h4>' +
        '<input id="raGrpMemberSearch" placeholder="Поиск по ФИО..." style="margin-bottom:8px;width:100%" />' +
        '<div class="member-list" id="raGrpMembers">' +
        users.map(u => '<label class="perm-label ra-member-item"><input type="checkbox" class="ra-member-cb" value="' + esc(u.id) + '"' + (members.includes(u.id) ? ' checked' : '') + ' /> ' + esc(u.fullName) + '</label>').join('') +
        '</div>' +
        '<h4 style="margin:12px 0 8px">Разрешения</h4>' +
        permCheckboxes('grp', perms, false) +
        '<div style="margin-top:12px;display:flex;gap:8px">' +
        '<button class="btn-primary btn-sm" id="raGrpSave">' + (isEdit ? 'Сохранить' : 'Создать') + '</button>' +
        (isEdit ? '<button class="btn-cancel-sm" id="raGrpDelete">Удалить группу</button>' : '') +
        '<button class="btn-outline-dark btn-sm" id="raGrpCancel">Отмена</button></div>' +
        '<p id="raGrpMsg" class="message"></p></div>';

      $('raGrpMemberSearch').addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        formEl.querySelectorAll('.ra-member-item').forEach(item => {
          item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
        });
      });
      $('raGrpCancel').addEventListener('click', () => { formEl.classList.add('hidden'); formEl.innerHTML = ''; });
      $('raGrpSave').addEventListener('click', async () => {
        const name = $('raGrpName').value.trim();
        if (!name) { msg($('raGrpMsg'), 'Укажите название', 'error'); return; }
        const selMembers = Array.from(formEl.querySelectorAll('.ra-member-cb:checked')).map(cb => cb.value);
        const permissions = gatherPerms(formEl);
        const body = { name, description: $('raGrpDesc').value.trim(), members: selMembers, permissions };
        try {
          if (isEdit) {
            await api('/api/admin/access/groups/' + encodeURIComponent(group.id), {
              method: 'PUT',
                            body: JSON.stringify(body)
            });
            showToast('Группа обновлена', 'ok');
          } else {
            await api('/api/admin/access/groups', {
              method: 'POST',
                            body: JSON.stringify(body)
            });
            showToast('Группа создана', 'ok');
          }
          await renderRolesAccess();
        } catch (err) { msg($('raGrpMsg'), err.message, 'error'); }
      });
      $('raGrpDelete')?.addEventListener('click', async () => {
        if (!confirm('Удалить группу?')) return;
        try {
          await api('/api/admin/access/groups/' + encodeURIComponent(group.id), {
            method: 'DELETE',
                        body: JSON.stringify({})
          });
          showToast('Группа удалена', 'ok');
          await renderRolesAccess();
        } catch (err) { showToast(err.message, 'danger'); }
      });
    }

    $('raCreateGroupBtn').addEventListener('click', () => showGroupForm(null));

    adminContent.querySelectorAll('.ra-group-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = groups.find(x => x.id === btn.dataset.gid);
        if (g) showGroupForm(g);
      });
    });

    /* ── User role dropdown ── */
    adminContent.querySelectorAll('.ra-user-role').forEach(sel => {
      sel.addEventListener('change', async () => {
        try {
          await api('/api/admin/access/user-role', {
            method: 'PUT',
                        body: JSON.stringify({ userId: sel.dataset.uid, roleId: sel.value })
          });
          showToast('Роль обновлена', 'ok');
        } catch (err) { showToast(err.message, 'danger'); sel.value = sel.querySelector('option[selected]')?.value || 'employee'; }
      });
    });

  } catch (err) {
    adminContent.innerHTML = '<p class="message error">' + esc(err.message) + '</p>';
  }
}


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
    const roles = state.roles || [{ id: 'employee', name: 'Сотрудник' }, { id: 'superadmin', name: 'Суперадмин' }];
    for (const u of data) {
      const role = u.role || 'employee';
      const roleOpts = roles.map(r => `<option value="${esc(r.id)}"${r.id === role ? ' selected' : ''}>${esc(r.name)}</option>`).join('');
      html += `<tr>
        <td>${esc(u.fullName)}</td>
        <td>${esc(u.contact)}</td>
        <td>
          <select class="role-select" data-action="set-role" data-id="${esc(u.id)}">${roleOpts}</select>
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
        body: JSON.stringify({})
      });
      loadAdminData('bookings');
    } catch (err) { adminMsg(err.message); }

  } else if (action === 'set-role') {
    const role = btn.value;
    try {
      await api('/api/admin/set-role', {
        method: 'POST',
        body: JSON.stringify({ targetId: btn.dataset.id, role })
      });
      loadAdminData('users');
    } catch (err) { adminMsg(err.message); }

  } else if (action === 'resolve-pin') {
    try {
      await api('/api/admin/pin-request-resolve', {
        method: 'POST',
        body: JSON.stringify({ requestId: btn.dataset.id })
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
      body: JSON.stringify({

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

/* ── Notifications ── */
let _notifInterval = null;

async function loadNotifCount() {
  if (!state.pin) return;
  try {
    const { count } = await api('/api/notifications/unread-count');
    notifBadge.textContent = count > 0 ? (count > 99 ? '99+' : count) : '';
  } catch { /* ignore */ }
}

async function loadNotifications() {
  if (!state.pin) return;
  try {
    const notifs = await api('/api/notifications');
    if (!notifs.length) {
      notifList.innerHTML = '<p class="notif-empty">Нет уведомлений</p>';
      return;
    }
    notifList.innerHTML = notifs.map(n => {
      const ago = timeAgo(n.created_at);
      return `<div class="notif-item${n.read ? '' : ' unread'}" data-nid="${esc(n.id)}" data-link="${esc(n.link || '')}">
        <div class="notif-item-title">${esc(n.title)}</div>
        <div class="notif-item-body">${esc(n.body)}</div>
        <div class="notif-item-time">${ago}</div>
      </div>`;
    }).join('');
  } catch { notifList.innerHTML = '<p class="notif-empty">Ошибка загрузки</p>'; }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return mins + ' мин назад';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + ' ч назад';
  const days = Math.floor(hrs / 24);
  if (days < 7) return days + ' д назад';
  return new Date(dateStr).toLocaleDateString('ru-RU');
}

function startNotifPolling() {
  loadNotifCount();
  if (_notifInterval) clearInterval(_notifInterval);
  _notifInterval = setInterval(loadNotifCount, 60000);
}

function stopNotifPolling() {
  if (_notifInterval) { clearInterval(_notifInterval); _notifInterval = null; }
}

/* ── TZ Badge & Notifications ── */

async function updateTzBadge() {
  if (state.adminRole !== 'superadmin') return;
  try {
    const stats = await api('/api/admin/tz-stats', {
      method: 'POST',
      body: JSON.stringify({})
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

/* ── Booking reminders (browser notifications + banner) ── */

const _reminderSent = new Set();
let _reminderTimer = null;

async function checkBookingReminders() {
  if (!state.pin) return;
  try {
    const myBookings = await api(`/api/bookings/my-today`);
    const now = new Date();
    const nowHour = now.getHours() + now.getMinutes() / 60;
    const banner = document.getElementById('bookingReminder');
    let bannerHtml = '';

    for (const bk of myBookings) {
      const minsUntil = Math.round((bk.startHour - nowHour) * 60);
      if (minsUntil > 0 && minsUntil <= 15) {
        const key = bk.id;
        const timeStr = `${fmtTime(bk.startHour)}–${fmtTime(bk.endHour)}`;
        bannerHtml += `<span class="reminder-icon">⏰</span> Встреча через ${minsUntil} мин — <b>${esc(bk.roomName)}</b>, ${timeStr}: ${esc(bk.topic)} ` +
          `<button class="reminder-dismiss" onclick="this.closest('.booking-reminder').classList.add('hidden')" title="Скрыть">✕</button>`;

        // Browser notification (once per booking)
        if (!_reminderSent.has(key)) {
          _reminderSent.add(key);
          if (Notification.permission === 'granted') {
            new Notification('Встреча скоро', {
              body: `Через ${minsUntil} мин — ${bk.roomName}, ${timeStr}\n${bk.topic}`,
              icon: '/favicon.ico',
              tag: `booking-${bk.id}`
            });
          }
        }
      }
    }

    if (banner) {
      if (bannerHtml) {
        banner.innerHTML = bannerHtml;
        banner.classList.remove('hidden');
      } else {
        banner.classList.add('hidden');
      }
    }
  } catch { /* ignore */ }
}

function startBookingReminders() {
  // Request notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
  checkBookingReminders();
  clearInterval(_reminderTimer);
  _reminderTimer = setInterval(checkBookingReminders, 60000);
}

/* ── TZ (Технические задания) ── */

const TZ_PRIO_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий', critical: 'Критический' };

function getCurrentBoard() {
  return state.tzBoards.find(b => b.id === state.tzBoardId) || state.tzBoards.find(b => b.is_default) || null;
}

/** Get card_fields config for given board (defaults: all true for legacy) */
function getBoardCardFields(board) {
  const def = { system: true, link_confluence: true, link_jira: true, phase_deadlines: true, completion_notes: true, approval: true };
  return board?.card_fields ? { ...def, ...board.card_fields } : def;
}

/** Generate access options HTML for board settings */
function accessOptionsHtml(selected) {
  const roles = state.roles || [];
  let html = `<option value="superadmin"${selected === 'superadmin' ? ' selected' : ''}>Только суперадмин</option>`;
  html += `<option value="admins"${selected === 'admins' ? ' selected' : ''}>Все админы</option>`;
  // Add custom roles (not employee, superadmin)
  for (const r of roles) {
    if (r.id === 'superadmin' || r.id === 'employee') continue;
    html += `<option value="${esc(r.id)}"${selected === r.id ? ' selected' : ''}>Роль: ${esc(r.name)}</option>`;
  }
  html += `<option value="all"${selected === 'all' ? ' selected' : ''}>Все сотрудники</option>`;
  return html;
}

/** Show/hide form fields based on board card_fields config */
function applyBoardCardFields(board) {
  const cf = getBoardCardFields(board);
  const systemRow = $('tzSystem').closest('label');
  const confRow = $('tzLinkConfluence').closest('label');
  const jiraRow = $('tzLinkJira').closest('label');
  const analysisRow = $('tzDateAnalysis').closest('label');
  const devRow = $('tzDateDev').closest('label');
  const releaseRow = $('tzDateRelease').closest('label');
  const notesRow = $('tzCompletionNotesRow');

  if (!cf.system) { systemRow.style.display = 'none'; $('tzSystem').value = 'OTHER'; }
  if (!cf.link_confluence && confRow) confRow.style.display = 'none';
  if (!cf.link_jira && jiraRow) jiraRow.style.display = 'none';
  if (!cf.phase_deadlines) {
    if (analysisRow) analysisRow.style.display = 'none';
    if (devRow) devRow.style.display = 'none';
    if (releaseRow) releaseRow.style.display = 'none';
  }
  if (!cf.completion_notes && notesRow) notesRow.style.display = 'none';
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

  // Board tabs (filter by access)
  const visibleBoards = state.tzBoards.filter(b => {
    if (isSA) return true;
    if (b.access === 'all') return true;
    if (b.access === 'admins' && state.isAdmin) return true;
    if (b.access === state.adminRole) return true;
    return false;
  });
  let boardTabsHtml = '';
  if (visibleBoards.length > 0) {
    boardTabsHtml = '<div class="tz-board-tabs">';
    for (const b of visibleBoards) {
      const active = b.id === state.tzBoardId ? ' active' : '';
      boardTabsHtml += `<button type="button" class="tz-board-tab${active}" data-board-id="${esc(b.id)}" aria-label="Доска: ${esc(b.name)}">${esc(b.name)}</button>`;
    }
    if (isSA) {
      boardTabsHtml += `<button type="button" class="tz-board-tab tz-board-tab-add" id="tzAddBoardBtn" title="Создать доску">+</button>`;
      boardTabsHtml += `<button type="button" class="tz-board-tab tz-board-tab-settings" id="tzBoardSettingsBtn" title="Настройки доски"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg></button>`;
    }
    boardTabsHtml += '</div>';
  }

  const curBoardCf = getBoardCardFields(getCurrentBoard());
  tzFilters.innerHTML = `${boardTabsHtml}
    <div class="tz-filters-row" data-widget="tz-filters">
      ${curBoardCf.system ? `<select class="tz-filter-select" id="tzFilterSystem">${systemOpts}</select>` : ''}
      <select class="tz-filter-select" id="tzFilterStatus">${statusOpts}</select>
      <select class="tz-filter-select" id="tzFilterType">${typeOpts}</select>
      <select class="tz-filter-select" id="tzFilterPriority">${prioOpts}</select>
      <input class="tz-filter-search tz-filter-tag-input" id="tzFilterTag" placeholder="Метка..." value="${esc(f.tag || '')}" />
      <input class="tz-filter-search" id="tzFilterSearch" placeholder="Поиск..." value="${esc(f.search)}" />
      <div class="tz-filter-actions">
        ${isSA ? `<button class="tz-export-btn" id="tzExportBtn" type="button">&#x1F4E5; Excel</button>
        <button class="tz-export-btn" id="tzImportBtn" type="button">&#x1F4E4; Импорт</button>
        <input type="file" id="tzImportFile" accept=".xlsx" style="display:none" />` : ''}
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
    <div class="tz-filters-row" data-widget="tz-filters">
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

  const tagEl = document.getElementById('tzFilterTag');
  if (tagEl) {
    tagEl.addEventListener('input', () => {
      clearTimeout(_tzSearchTimer);
      _tzSearchTimer = setTimeout(() => { state.tzFilters.tag = tagEl.value; loadTzData(); }, 300);
    });
  }

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
  applyWidgetVisibility();
}

async function exportTzExcel() {
  const btn = document.getElementById('tzExportBtn');
  if (btn) btn.disabled = true;
  try {
    const res = await fetch('/api/admin/tz-export', {
      method: 'POST',
      body: JSON.stringify({ ...state.tzFilters, ...(state.tzBoardId ? { board_id: state.tzBoardId } : {}) })
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
    <div class="tz-stats-row" data-widget="tz-stats">
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.total}</div><div class="tz-stat-label">Всего</div></div>
      <div class="tz-stat-card tz-stat-danger${overduePulse}"><div class="tz-stat-num">${stats.overdue}</div><div class="tz-stat-label">Просрочено</div></div>
      <div class="tz-stat-card tz-stat-warn${soonPulse}"><div class="tz-stat-num">${stats.deadline_soon}</div><div class="tz-stat-label">Скоро</div></div>
      <div class="tz-stat-card tz-stat-info${missingPulse}"><div class="tz-stat-num">${stats.missing_deadline}</div><div class="tz-stat-label">Неполн. дедл.</div></div>
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.no_dates}</div><div class="tz-stat-label">Без дат</div></div>
      <div class="tz-stat-card"><div class="tz-stat-num">${stats.no_owner}</div><div class="tz-stat-label">Без ответств.</div></div>
    </div>`;
  applyWidgetVisibility();
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
      <td class="tz-title-cell">${esc(tz.title)}${(tz.tags||[]).map(t=>`<span class="tz-tag">${esc(t)}</span>`).join('')}${tz.estimate ? `<span class="tz-estimate">${esc(tz.estimate)}</span>` : ''}</td>
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
        body: JSON.stringify({ ids, action, value })
      });
      showToast(result.message, 'ok');
      loadTzData();
    } catch (err) { showToast(err.message, 'danger'); }
  });
}

async function loadTzData() {
  if (!state.pin) return;
  const curBoard = getCurrentBoard();
  const boardAccess = curBoard?.access || 'superadmin';
  const canAccess = state.adminRole === 'superadmin'
    || boardAccess === 'all'
    || (boardAccess === 'admins' && state.isAdmin)
    || boardAccess === state.adminRole;
  if (!canAccess) return;
  msg(tzMessage, '');
  const boardPayload = state.tzBoardId ? { board_id: state.tzBoardId } : {};
  try {
    if (state.tzViewMode === 'kanban') {
      const kanbanBody = { ...state.tzFilters, ...boardPayload };
      if (state.tzSwimlane) kanbanBody.swimlane = state.tzSwimlane;
      const [kanban, stats] = await Promise.all([
        api('/api/admin/tz-kanban', {
          method: 'POST',

          body: JSON.stringify(kanbanBody)
        }),
        api('/api/admin/tz-stats', {
          method: 'POST',

          body: JSON.stringify({ ...boardPayload })
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

          body: JSON.stringify({ ...state.tzFilters, ...boardPayload, pageSize: 999 })
        }),
        api('/api/admin/tz-stats', {
          method: 'POST',

          body: JSON.stringify({ ...boardPayload })
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
  hide(tzDeleteBtn);
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

  // Apply board card_fields visibility
  applyBoardCardFields(board);

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

          body: JSON.stringify({
            name,
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
    const data = await api(`/api/tz/${id}`);
    state.tzEditId = id;
    const cfg = state.tzConfig;
    const isSA = state.adminRole === 'superadmin';
    const isUserType = (cfg.userTypes || []).includes(data.type);

    tzPopupTitle.querySelector('span').textContent = `${data.tz_code} — ${data.type}`;
    tzSubmitBtn.textContent = 'Сохранить';

    // Delete button — superadmin only
    if (isSA) { show(tzDeleteBtn); } else { hide(tzDeleteBtn); }

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
    $('tzTags').value = (data.tags || []).join(', ');
    $('tzEstimate').value = data.estimate || '';

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

    // Apply board card_fields visibility
    applyBoardCardFields(detailBoard);

    // Approval info for Предложение
    const approveRow = $('tzApproveRow');
    const cfDetail = getBoardCardFields(detailBoard);
    if (data.type === 'Предложение' && cfDetail.approval) {
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
    
              body: JSON.stringify({})
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

          body: JSON.stringify({})
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
    const comments = await api(`/api/tz/${tzId}/comments`);
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

    // Delete handled via delegation below

    // Store tzId in data attr; handler bound once below
    tzCommentSendBtn.dataset.tzId = tzId;

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
  const resolved = data.linked_tz_resolved || [];
  const isSA = state.adminRole === 'superadmin';
  let html = '<h4>Связанные задачи</h4>';
  if (resolved.length) {
    html += '<div class="tz-links-list">';
    for (const r of resolved) {
      const label = `${r.tz_code} — ${r.title.slice(0, 40)}`;
      html += `<span class="tz-link-chip"><span class="tz-link-chip-text" data-tz-id="${esc(r.id)}">${esc(label)}</span>${isSA ? `<button class="tz-link-remove" data-lid="${esc(r.id)}">&times;</button>` : ''}</span>`;
    }
    html += '</div>';
  } else {
    html += '<p class="tz-links-empty">Нет связей</p>';
  }
  if (isSA) {
    html += `<div class="tz-link-add-row">
      <input type="text" id="tzLinkSearchInput" class="tz-link-add-select" placeholder="Поиск задачи для связи..." autocomplete="off" />
      <div id="tzLinkSearchResults" class="tz-link-search-results" style="display:none"></div>
    </div>`;
  }
  section.innerHTML = html;
  show(section);

  // Bind search-as-you-type for adding links
  const searchInput = document.getElementById('tzLinkSearchInput');
  const searchResults = document.getElementById('tzLinkSearchResults');
  // uses module-scope _linkSearchTimer
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(_linkSearchTimer);
      const q = searchInput.value.trim();
      if (q.length < 2) { searchResults.style.display = 'none'; return; }
      _linkSearchTimer = setTimeout(async () => {
        try {
          const res = await api(`/api/search?q=${encodeURIComponent(q)}`);
          const tzResults = (res.tz || []).filter((t) => t.id !== tzId && !links.includes(t.id)).slice(0, 10);
          if (!tzResults.length) { searchResults.innerHTML = '<div class="tz-link-search-empty">Ничего не найдено</div>'; searchResults.style.display = 'block'; return; }
          searchResults.innerHTML = tzResults.map((t) =>
            `<div class="tz-link-search-item" data-id="${esc(t.id)}">${esc(t.tz_code)} — ${esc((t.title || '').slice(0, 50))}</div>`
          ).join('');
          searchResults.style.display = 'block';
          searchResults.querySelectorAll('.tz-link-search-item').forEach((el) => {
            el.addEventListener('click', async () => {
              const newLinks = [...links, el.dataset.id];
              try {
                await api(`/api/tz/${tzId}`, { method: 'PUT', body: JSON.stringify({ linked_tz_ids: newLinks }) });
                openTzDetail(tzId);
              } catch (err) { showToast(err.message, 'danger'); }
            });
          });
        } catch { searchResults.style.display = 'none'; }
      }, 300);
    });
    searchInput.addEventListener('blur', () => { setTimeout(() => { searchResults.style.display = 'none'; }, 200); });
  }

  // Bind remove
  section.querySelectorAll('.tz-link-remove').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const newLinks = links.filter((l) => l !== btn.dataset.lid);
      try {
        await api(`/api/tz/${tzId}`, { method: 'PUT', body: JSON.stringify({ linked_tz_ids: newLinks }) });
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
    deadline: $('tzDeadline').value || '',
    tags: $('tzTags').value.split(',').map(t => t.trim()).filter(Boolean),
    estimate: $('tzEstimate').value
  };

  try {
    body.status = $('tzStatus').value;
    if (!state.tzEditId && state.tzBoardId) body.board_id = state.tzBoardId;
    if (state.tzEditId) {
      const result = await api(`/api/tz/${state.tzEditId}`, {
        method: 'PUT',

        body: JSON.stringify(body)
      });
      msg(tzPopupMessage, result.message, 'success');
    } else {
      const result = await api('/api/tz', {
        method: 'POST',

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

// TZ delete (superadmin only)
tzDeleteBtn.addEventListener('click', async () => {
  if (!state.tzEditId) return;
  if (!confirm('Удалить ТЗ? Это действие необратимо.')) return;
  try {
    await api(`/api/tz/${state.tzEditId}`, { method: 'DELETE', body: JSON.stringify({}) });
    showToast('ТЗ удалено', 'ok');
    hide(tzPopup);
    loadTzData();
  } catch (err) { showToast(err.message, 'danger'); }
});

/* ── Kanban view ── */

// Fallback colors for legacy statuses
const KANBAN_STATUS_COLORS_FALLBACK = {
  draft: '#edf2f7', review: '#fefcbf', waiting_analysis: '#fef3c7', analysis: '#bee3f8',
  development: '#c3dafe', testing: '#e9d8fd', release: '#feebc8', production: '#c6f6d5',
  partial: '#fde68a', cancelled: '#fed7d7'
};

function kanbanCardHtml(tz, mini) {
  const f = tz.flags || {};
  let flagsHtml = '';
  if (f.overdue) flagsHtml += '<span class="kanban-flag kanban-flag-overdue">Просрочено</span>';
  else if (f.deadline_soon) flagsHtml += '<span class="kanban-flag kanban-flag-soon">Скоро дедлайн</span>';

  // Nearest active deadline based on current phase
  let deadlineHtml = '';
  const status = tz.status || '';
  const doneStatuses = ['production', 'partial', 'cancelled'];
  const devStatuses = ['development', 'testing'];
  const releaseStatuses = ['release'];
  let dl = null;
  if (!doneStatuses.includes(status)) {
    if (!devStatuses.includes(status) && !releaseStatuses.includes(status)) {
      dl = tz.date_analysis_deadline || tz.date_dev_deadline || tz.date_release_deadline || tz.deadline;
    } else if (devStatuses.includes(status)) {
      dl = tz.date_dev_deadline || tz.date_release_deadline || tz.deadline;
    } else {
      dl = tz.date_release_deadline || tz.deadline;
    }
  }
  if (dl && !mini) {
    const days = Math.ceil((new Date(dl) - new Date()) / 86400000);
    const dlLabel = days < 0 ? `${Math.abs(days)}д назад` : days === 0 ? 'сегодня' : `${days}д`;
    const dlClass = days < 0 ? 'kanban-dl-overdue' : days <= 7 ? 'kanban-dl-soon' : 'kanban-dl-ok';
    deadlineHtml = `<span class="kanban-deadline ${dlClass}">${esc(dlLabel)}</span>`;
  }

  const ownerHtml = tz.assignee_name ? `<div class="kanban-card-owner">${esc(tz.assignee_name)}</div>` : (tz.owner ? `<div class="kanban-card-owner">${esc(tz.owner)}</div>` : '');
  const notesHtml = tz.completion_notes && !mini ? '<span class="kanban-flag kanban-flag-notes" title="Есть примечания">📝</span>' : '';

  return `<div class="kanban-card${mini ? ' kanban-card-mini' : ''}" draggable="true" data-tz-id="${esc(tz.id)}" data-status="${esc(tz.status)}">
    <div class="kanban-card-prio kanban-prio-${esc(tz.priority)}"></div>
    <div class="kanban-card-body">
      <div class="kanban-card-code">${esc(tz.tz_code)}${deadlineHtml}${tz.estimate ? `<span class="kanban-estimate">${esc(tz.estimate)}</span>` : ''}</div>
      <div class="kanban-card-title">${esc(tz.title)}</div>
      ${!mini && (tz.tags||[]).length ? `<div class="kanban-tags-row">${(tz.tags||[]).map(t=>`<span class="kanban-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      ${mini ? '' : ownerHtml}
      ${notesHtml}${flagsHtml}
    </div>
  </div>`;
}

function kanbanResolveDisplay(data) {
  const { boardColumns, columns } = data;
  const displayOrder = boardColumns
    ? boardColumns.filter(c => !c.hidden).sort((a, b) => a.order - b.order).map(c => c.id)
    : Object.keys(columns);
  const colorMap = boardColumns
    ? Object.fromEntries(boardColumns.map(c => [c.id, c.color]))
    : KANBAN_STATUS_COLORS_FALLBACK;
  return { displayOrder, colorMap };
}

function renderKanban(data) {
  if (!tzListContainer) return;
  const { columns, transitions, statusLabels } = data;
  state.kanbanTransitions = transitions || {};
  const { displayOrder, colorMap } = kanbanResolveDisplay(data);

  let html = '<div class="kanban-board">';
  for (const status of displayOrder) {
    const cards = columns[status] || [];
    const color = colorMap[status] || '#edf2f7';

    const bcol = (data.boardColumns || []).find(c => c.id === status);
    const wipLimit = bcol ? bcol.wip_limit || 0 : 0;
    const wipOver = wipLimit > 0 && cards.length > wipLimit;

    html += `<div class="kanban-column${wipOver ? ' kanban-wip-over' : ''}" data-status="${esc(status)}">
      <div class="kanban-column-header" style="background:${color}">
        <span class="kanban-col-title">${esc(statusLabels[status] || status)}</span>
        <span class="kanban-col-count">${cards.length}${wipLimit ? `/${wipLimit}` : ''}</span>${wipOver ? '<span class="wip-warning">WIP!</span>' : ''}
      </div>
      <div class="kanban-cards">`;

    for (const tz of cards) html += kanbanCardHtml(tz, false);

    html += '</div></div>';
  }
  html += '</div>';
  tzListContainer.innerHTML = html;

  initKanbanDnD();
  tzListContainer.querySelectorAll('.kanban-card').forEach((card) => {
    card.addEventListener('click', () => openTzDetail(card.dataset.tzId));
  });
}

let _kanbanDnDAbort = null;
function initKanbanDnD() {
  // Cleanup previous listeners
  if (_kanbanDnDAbort) _kanbanDnDAbort.abort();
  _kanbanDnDAbort = new AbortController();
  const sig = { signal: _kanbanDnDAbort.signal };

  let dragTzId = null;
  let dragFromStatus = null;

  // Use event delegation on the board container for reliable DnD
  const board = tzListContainer.querySelector('.kanban-board') || tzListContainer.querySelector('.kanban-swimlane-board');
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
  }, sig);

  board.addEventListener('dragend', (e) => {
    const card = e.target.closest('.kanban-card');
    if (card) card.classList.remove('dragging');
    board.querySelectorAll('.kanban-column').forEach((c) => {
      c.classList.remove('drag-over');
      c.classList.remove('drag-forbidden');
    });
    dragTzId = null;
    dragFromStatus = null;
  }, sig);

  board.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dragFromStatus) return;
    const col = getColumn(e.target);
    if (!col) return;
    const targetStatus = col.dataset.status;
    if (targetStatus === dragFromStatus) { e.dataTransfer.dropEffect = 'none'; return; }

    const fromAllowed = (state.kanbanTransitions || {})[dragFromStatus] || [];
    if (fromAllowed.includes(targetStatus)) {
      col.classList.add('drag-over');
      col.classList.remove('drag-forbidden');
      e.dataTransfer.dropEffect = 'move';
    } else {
      col.classList.add('drag-forbidden');
      col.classList.remove('drag-over');
      e.dataTransfer.dropEffect = 'none';
    }
  }, sig);

  board.addEventListener('dragleave', (e) => {
    const col = getColumn(e.target);
    if (!col) return;
    // Only clear if actually leaving the column (not entering a child)
    if (!col.contains(e.relatedTarget)) {
      col.classList.remove('drag-over');
      col.classList.remove('drag-forbidden');
    }
  }, sig);

  board.addEventListener('drop', async (e) => {
    e.preventDefault();
    const col = getColumn(e.target);
    if (!col) return;
    col.classList.remove('drag-over');
    col.classList.remove('drag-forbidden');
    if (!dragTzId || !dragFromStatus) return;
    const targetStatus = col.dataset.status;
    if (targetStatus === dragFromStatus) return;

    const fromAllowed = (state.kanbanTransitions || {})[dragFromStatus] || [];
    if (!fromAllowed.includes(targetStatus)) return;

    try {
      await api(`/api/tz/${dragTzId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: targetStatus })
      });
      showToast('Статус изменён', 'ok');
      loadTzData();
    } catch (err) {
      showToast(err.message, 'danger');
    }
  }, sig);
}

/* ── Board settings modal ── */

function openCreateBoardModal() {
  const overlay = document.createElement('div');
  overlay.className = 'popup-overlay';
  overlay.id = 'boardCreateOverlay';
  overlay.innerHTML = `<div class="popup-card fade-in" style="max-width:460px">
    <h3>Создать доску</h3>
    <form id="boardCreateForm" class="popup-form">
      <label>Название *<input id="bcName" required placeholder="Название доски" /></label>
      <label>Префикс кода<input id="bcPrefix" placeholder="BD" maxlength="10" style="text-transform:uppercase" /></label>
      <label>Описание<textarea id="bcDesc" rows="2" placeholder="Описание..."></textarea></label>
      <label>Доступ<select id="bcAccess" class="tz-filter-select" style="width:100%">${accessOptionsHtml('superadmin')}</select></label>
      <div style="margin:8px 0">
        <strong style="font-size:13px">Поля карточки:</strong>
        <div style="display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:6px;font-size:13px">
          <label><input type="checkbox" class="bc-cf" data-cf-key="system" /> Система</label>
          <label><input type="checkbox" class="bc-cf" data-cf-key="link_confluence" /> Confluence</label>
          <label><input type="checkbox" class="bc-cf" data-cf-key="link_jira" /> Jira</label>
          <label><input type="checkbox" class="bc-cf" data-cf-key="phase_deadlines" /> Фазовые дедлайны</label>
          <label><input type="checkbox" class="bc-cf" data-cf-key="completion_notes" /> Примечания</label>
          <label><input type="checkbox" class="bc-cf" data-cf-key="approval" /> Утверждение</label>
        </div>
      </div>
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
        body: JSON.stringify({
  
          name: document.getElementById('bcName').value.trim(),
          code_prefix: document.getElementById('bcPrefix').value.trim() || 'BD',
          description: document.getElementById('bcDesc').value.trim(),
          access: document.getElementById('bcAccess').value,
          card_fields: Object.fromEntries(
            [...document.querySelectorAll('.bc-cf')].map(cb => [cb.dataset.cfKey, cb.checked])
          )
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
          <input type="number" class="board-col-wip" value="${c.wip_limit || 0}" data-col-id="${esc(c.id)}" min="0" title="WIP-лимит (0 = без ограничения)" style="width:50px" />
          <button type="button" class="board-col-hide-btn" data-col-id="${esc(c.id)}" title="${c.hidden ? 'Показать' : 'Скрыть'}">${c.hidden ? '👁' : '👁‍🗨'}</button>
          <button type="button" class="board-col-del-btn" data-col-id="${esc(c.id)}" title="Удалить">✕</button>
        </div>`).join('')}
      </div>
      <div class="board-add-col-row" style="margin-top:8px;display:flex;gap:6px">
        <input id="bsNewColName" placeholder="Новая колонка..." style="flex:1" />
        <input id="bsNewColColor" type="color" value="#edf2f7" />
        <button type="button" class="btn-primary btn-sm" id="bsAddCol">+</button>
      </div>
      <h4 style="margin:16px 0 8px">Доступ</h4>
      <label><select id="bsAccess" class="tz-filter-select" style="width:100%">${accessOptionsHtml(board.access || 'superadmin')}</select></label>
      <h4 style="margin:16px 0 8px">Поля карточки</h4>
      <div class="board-card-fields" style="display:flex;flex-wrap:wrap;gap:8px 16px;font-size:13px">
        ${[
          ['system', 'Система'],
          ['link_confluence', 'Ссылка Confluence'],
          ['link_jira', 'Ссылка Jira'],
          ['phase_deadlines', 'Фазовые дедлайны'],
          ['completion_notes', 'Примечания к выполнению'],
          ['approval', 'Утверждение предложений']
        ].map(([k, label]) => {
          const checked = (board.card_fields || {})[k] ? ' checked' : '';
          return '<label style="cursor:pointer"><input type="checkbox" class="bs-cf-toggle" data-cf-key="' + k + '"' + checked + ' /> ' + esc(label) + '</label>';
        }).join('')}
      </div>
    </div>`;
  }

  overlay.innerHTML = renderSettingsContent();
  document.body.appendChild(overlay);

  // Bind overlay close once (not inside bindSettingsEvents to avoid listener stacking)
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

  function updateBoardInState(board, newData) {
    Object.assign(board, newData);
    const idx = state.tzBoards.findIndex(b => b.id === board.id);
    if (idx >= 0) state.tzBoards[idx] = newData;
  }

  function bindSettingsEvents() {
    document.getElementById('bsClose')?.addEventListener('click', () => overlay.remove());

    // Save board info
    document.getElementById('bsForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        const result = await api(`/api/boards/${board.id}`, {
          method: 'PUT',

          body: JSON.stringify({
    
            name: document.getElementById('bsName').value.trim(),
            code_prefix: document.getElementById('bsPrefix').value.trim(),
            description: document.getElementById('bsDesc').value.trim(),
            access: document.getElementById('bsAccess').value,
            card_fields: Object.fromEntries(
              [...document.querySelectorAll('.bs-cf-toggle')].map(cb => [cb.dataset.cfKey, cb.checked])
            )
          })
        });
        updateBoardInState(board, result.board);
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

          body: JSON.stringify({})
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
  
            body: JSON.stringify({ name: newName })
          });
          updateBoardInState(board, result.board);
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
  
            body: JSON.stringify({ color: inp.value })
          });
          updateBoardInState(board, result.board);
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });

    // Column WIP limit edit
    document.querySelectorAll('.board-col-wip').forEach((inp) => {
      inp.addEventListener('change', async () => {
        const colId = inp.dataset.colId;
        try {
          const result = await api(`/api/boards/${board.id}/columns/${colId}`, {
            method: 'PUT',
  
            body: JSON.stringify({ wip_limit: parseInt(inp.value, 10) || 0 })
          });
          updateBoardInState(board, result.board);
          showToast('WIP-лимит обновлён', 'ok');
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
            body: JSON.stringify({})
          });
          updateBoardInState(board, result.board);
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
  
            body: JSON.stringify({ target_column: targetCol })
          });
          updateBoardInState(board, result.board);
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

          body: JSON.stringify({ name, color })
        });
        updateBoardInState(board, result.board);
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
  
            body: JSON.stringify({ order })
          });
          updateBoardInState(board, result.board);
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
  toolbarHtml += '</div><div class="kb-search-row" data-widget="kb-search"><input class="kb-search-input" id="kbSearchInput" placeholder="Поиск по статьям..." /></div>';
  kbToolbar.innerHTML = toolbarHtml;

  if (isSuperadmin) {
    document.getElementById('kbManageCatsBtn')?.addEventListener('click', openKbCategoriesManager);
  }

  document.getElementById('kbSearchInput')?.addEventListener('input', (e) => {
    clearTimeout(_kbSearchTimer);
    _kbSearchTimer = setTimeout(() => kbSearch(e.target.value), 300);
  });

  try {
    const cats = await api(`/api/kb/categories`);
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
        ${c.group_id ? '<div class="kb-cat-group-badge">Ограниченный доступ</div>' : ''}
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
    applyWidgetVisibility();
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
    const articles = await api(`/api/kb/articles?search=${encodeURIComponent(query)}`);
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

  const canEdit = cat && cat.canEdit;
  let toolbarHtml = '<div class="kb-toolbar-row"><h2 class="kb-section-title">' + esc(catName) + '</h2>';
  if (canEdit) {
    toolbarHtml += '<button class="btn-sm btn-primary" id="kbCreateArticleBtn">+ Новая статья</button>';
  }
  toolbarHtml += '</div>';
  kbToolbar.innerHTML = toolbarHtml;

  if (canEdit) {
    document.getElementById('kbCreateArticleBtn')?.addEventListener('click', () => openKbEditor(null));
  }

  try {
    const articles = await api(`/api/kb/articles?category_id=${encodeURIComponent(state.kbCategoryId || '')}`);
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
    const article = await api(`/api/kb/articles/${state.kbArticleId}`);
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

    const articleCanEdit = article.canEdit;
    let toolbarHtml = '<div class="kb-toolbar-row">';
    if (articleCanEdit) {
      toolbarHtml += `<button class="btn-sm btn-kb-manage" id="kbEditArticleBtn">Редактировать</button>`;
      toolbarHtml += `<button class="btn-sm btn-outline-dark" id="kbHistoryArticleBtn">История</button>`;
      toolbarHtml += `<button class="btn-sm btn-outline-dark" id="kbShareArticleBtn">Поделиться</button>`;
      toolbarHtml += `<button class="btn-sm btn-danger-outline-sm" id="kbDeleteArticleBtn">Удалить</button>`;
    }
    toolbarHtml += '</div>';
    kbToolbar.innerHTML = toolbarHtml;

    const sharedCount = (article.shared_with || []).length;
    kbContent.innerHTML = `<article class="kb-article-reader">
      <h1 class="kb-article-title">${esc(article.title)}</h1>
      <div class="kb-article-meta">${esc(article.created_by)} &middot; ${fmtDate(article.updated_at)}${sharedCount ? ` &middot; Доступ: ${sharedCount} чел.` : ''}</div>
      <div class="kb-article-body">${typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(article.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['target', 'allowfullscreen', 'class'] }) : esc(article.content)}</div>
    </article>`;

    if (articleCanEdit) {
      document.getElementById('kbEditArticleBtn')?.addEventListener('click', () => openKbEditor(article));
      document.getElementById('kbHistoryArticleBtn')?.addEventListener('click', () => showKbHistory(article.id));
      document.getElementById('kbShareArticleBtn')?.addEventListener('click', () => openKbSharePopup(article));
      document.getElementById('kbDeleteArticleBtn')?.addEventListener('click', async () => {
        if (!confirm('Удалить статью?')) return;
        try {
          await api(`/api/kb/articles/${article.id}`, {
            method: 'DELETE',
  
            body: JSON.stringify({})
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
  const cats = await api(`/api/kb/categories`);
  kbEditorCategory.innerHTML = cats.map((c) =>
    `<option value="${esc(c.id)}"${article && article.category_id === c.id ? ' selected' : ''}>${esc(c.name)}</option>`
  ).join('');

  if (!cats.length) {
    kbEditorCategory.innerHTML = '<option value="">Сначала создайте категорию</option>';
  }

  kbEditorTitleInput.value = article ? article.title : '';
  kbEditorPinned.checked = article ? !!article.pinned : false;

  // Remove old template selectors / save-as-template buttons if any
  document.getElementById('kbTplLabel')?.remove();
  document.getElementById('kbSaveAsTemplateBtn')?.remove();

  // Templates (only for new articles)
  if (!article) {
    try {
      const templates = await api('/api/kb/templates');
      if (templates.length) {
        const tplSelect = document.createElement('select');
        tplSelect.id = 'kbTplSelect';
        tplSelect.innerHTML = '<option value="">Без шаблона</option>' + templates.map(t => `<option value="${esc(t.id)}">${esc(t.name)}</option>`).join('');
        tplSelect.style.marginBottom = '8px';
        const label = document.createElement('label');
        label.id = 'kbTplLabel';
        label.textContent = 'Шаблон ';
        label.appendChild(tplSelect);
        kbEditorForm.insertBefore(label, kbEditorPinned.parentNode || kbEditorForm.querySelector('.kb-editor-area'));
        tplSelect.addEventListener('change', async () => {
          if (!tplSelect.value) return;
          const tpl = await api(`/api/kb/templates/${tplSelect.value}`);
          if (tpl.content && state.kbQuill) {
            state.kbQuill.root.innerHTML = tpl.content;
          }
        });
      }
    } catch { /* ignore */ }
  }

  // "Save as template" button for superadmins (when editing existing article)
  if (article && state.adminRole === 'superadmin') {
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.id = 'kbSaveAsTemplateBtn';
    saveBtn.className = 'btn-sm btn-outline-dark';
    saveBtn.textContent = 'Сохранить как шаблон';
    saveBtn.style.marginLeft = '8px';
    kbEditorSubmitBtn.parentNode.insertBefore(saveBtn, kbEditorSubmitBtn.nextSibling);
    saveBtn.addEventListener('click', async () => {
      const name = prompt('Название шаблона:', article.title);
      if (!name || !name.trim()) return;
      const content = state.kbQuill ? state.kbQuill.root.innerHTML : '';
      try {
        await api('/api/kb/templates', {
          method: 'POST',

          body: JSON.stringify({ name: name.trim(), description: '', content })
        });
        showToast('Шаблон сохранён', 'ok');
      } catch (err) { showToast(err.message, 'danger'); }
    });
  }

  show(kbEditorPopup);

  // Init Quill after popup is visible
  setTimeout(() => {
    const q = initQuill();
    if (q) {
      if (article && article.content) {
        q.root.innerHTML = typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(article.content, { ADD_TAGS: ['iframe'], ADD_ATTR: ['target', 'allowfullscreen', 'class'] }) : esc(article.content);
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

    title: kbEditorTitleInput.value.trim(),
    category_id: kbEditorCategory.value,
    pinned: kbEditorPinned.checked,
    content
  };

  try {
    if (state.kbEditId) {
      await api(`/api/kb/articles/${state.kbEditId}`, {
        method: 'PUT',

        body: JSON.stringify(body)
      });
      msg(kbEditorMessage, 'Статья обновлена.', 'success');
    } else {
      await api('/api/kb/articles', {
        method: 'POST',

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

// KB History viewer
async function showKbHistory(articleId) {
  try {
    const versions = await api(`/api/kb/articles/${articleId}/history`);
    if (!versions.length) { showToast('Нет предыдущих версий', 'warn'); return; }

    let html = '<div class="kb-history-panel"><h3>История версий</h3><div class="kb-history-list">';
    for (const v of versions) {
      html += `<div class="kb-history-item" data-vid="${esc(v.id)}" data-aid="${esc(articleId)}">
        <div class="kb-history-date">${new Date(v.created_at).toLocaleString('ru-RU')}</div>
        <div class="kb-history-author">${esc(v.edited_by)}</div>
        <div class="kb-history-actions">
          <button class="btn-sm btn-outline-dark kb-history-view" data-vid="${esc(v.id)}" data-aid="${esc(articleId)}">Просмотр</button>
          <button class="btn-sm btn-primary kb-history-restore" data-vid="${esc(v.id)}" data-aid="${esc(articleId)}">Восстановить</button>
        </div>
      </div>`;
    }
    html += '</div><button class="btn-sm btn-outline-dark kb-history-close" style="margin-top:12px">Закрыть</button></div>';

    const overlay = document.createElement('div');
    overlay.className = 'kb-history-overlay';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    overlay.querySelector('.kb-history-close').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });

    overlay.querySelectorAll('.kb-history-view').forEach(btn => {
      btn.addEventListener('click', async () => {
        const version = await api(`/api/kb/articles/${btn.dataset.aid}/history/${btn.dataset.vid}`);
        const modal = document.createElement('div');
        modal.className = 'kb-history-overlay';
        modal.innerHTML = `<div class="kb-history-panel" style="max-width:800px;max-height:80vh;overflow:auto">
          <h3>${esc(version.title)}</h3>
          <p style="font-size:12px;color:var(--text-sec)">${esc(version.edited_by)} · ${new Date(version.created_at).toLocaleString('ru-RU')}</p>
          <div class="kb-article-content">${version.content}</div>
          <button class="btn-sm btn-outline-dark kb-history-close" style="margin-top:12px">Закрыть</button>
        </div>`;
        document.body.appendChild(modal);
        modal.querySelector('.kb-history-close').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
      });
    });

    overlay.querySelectorAll('.kb-history-restore').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Восстановить эту версию? Текущее содержимое будет сохранено в историю.')) return;
        try {
          await api(`/api/kb/articles/${btn.dataset.aid}/restore/${btn.dataset.vid}`, {
            method: 'POST',
  
            body: JSON.stringify({})
          });
          showToast('Версия восстановлена', 'ok');
          overlay.remove();
          loadKbView();
        } catch (err) { showToast(err.message, 'danger'); }
      });
    });
  } catch (err) { showToast(err.message, 'danger'); }
}

// @mention autocomplete for TZ comments
let _mentionUsers = null;

async function loadMentionUsers() {
  if (_mentionUsers) return _mentionUsers;
  try {
    _mentionUsers = await api('/api/users/names');
    return _mentionUsers;
  } catch { return []; }
}

function setupMentionAutocomplete(input) {
  if (!input) return;
  let dropdown = null;

  input.addEventListener('input', async () => {
    const val = input.value;
    const cursorPos = input.selectionStart;
    const textBefore = val.slice(0, cursorPos);
    const mentionMatch = textBefore.match(/@([А-Яа-яЁёA-Za-z]*)$/);

    if (!mentionMatch) {
      if (dropdown) { dropdown.remove(); dropdown = null; }
      return;
    }

    const query = mentionMatch[1].toLowerCase();
    const users = await loadMentionUsers();
    const filtered = users.filter(u => u.fullName.toLowerCase().includes(query)).slice(0, 5);

    if (!filtered.length) {
      if (dropdown) { dropdown.remove(); dropdown = null; }
      return;
    }

    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.className = 'mention-dropdown';
      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(dropdown);
    }

    dropdown.innerHTML = filtered.map(u =>
      `<div class="mention-option" data-name="${esc(u.fullName)}">${esc(u.fullName)}</div>`
    ).join('');

    dropdown.querySelectorAll('.mention-option').forEach(opt => {
      opt.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const name = opt.dataset.name;
        const before = val.slice(0, cursorPos - mentionMatch[0].length);
        const after = val.slice(cursorPos);
        input.value = before + '@' + name + ' ' + after;
        input.focus();
        const newPos = before.length + name.length + 2;
        input.setSelectionRange(newPos, newPos);
        dropdown.remove();
        dropdown = null;
      });
    });
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { if (dropdown) { dropdown.remove(); dropdown = null; } }, 200);
  });
}

// Initialize mention autocomplete on TZ comment input
setupMentionAutocomplete(tzCommentInput);

// KB document upload (.docx / .xlsx → HTML)
kbDocUploadBtn.addEventListener('click', () => kbDocFileInput.click());
kbDocFileInput.addEventListener('change', async () => {
  const file = kbDocFileInput.files[0];
  if (!file) return;
  kbDocFileInput.value = '';

  const ext = file.name.split('.').pop().toLowerCase();
  if (!['docx', 'xlsx', 'xls'].includes(ext)) {
    msg(kbEditorMessage, 'Поддерживаются только .docx и .xlsx файлы', 'error');
    return;
  }

  kbDocUploadBtn.disabled = true;
  kbDocUploadStatus.textContent = 'Конвертация...';

  const fd = new FormData();
  fd.append('document', file);

  try {
    const resp = await fetch('/api/kb/upload-document', {
      method: 'POST',
      headers: { 'X-Auth-Pin': state.pin },
      body: fd
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.message || 'Ошибка загрузки');

    const q = state.kbQuill;
    if (q) {
      const current = q.root.innerHTML.trim();
      if (current && current !== '<p><br></p>') {
        if (!confirm('Заменить текущее содержимое документом?')) {
          kbDocUploadStatus.textContent = '';
          return;
        }
      }
      q.root.innerHTML = data.html;
    }

    // Auto-fill title if empty
    if (!kbEditorTitleInput.value.trim() && data.title) {
      kbEditorTitleInput.value = data.title;
    }

    kbDocUploadStatus.textContent = 'Загружено';
    setTimeout(() => { kbDocUploadStatus.textContent = ''; }, 3000);
  } catch (err) {
    msg(kbEditorMessage, err.message, 'error');
    kbDocUploadStatus.textContent = '';
  } finally {
    kbDocUploadBtn.disabled = false;
  }
});

// KB Categories manager

async function openKbCategoriesManager() {
  msg(kbCategoriesMessage, '');
  show(kbCategoriesPopup);
  await renderKbCategoriesList();
}

async function saveKbCatOrder() {
  const ids = [...kbCategoriesList.querySelectorAll('.kb-cat-manage-item')].map(el => el.dataset.catId);
  try {
    await api('/api/kb/categories/reorder', {
      method: 'PUT',
      body: JSON.stringify({ ids })
    });
  } catch (err) {
    msg(kbCategoriesMessage, err.message, 'error');
  }
}

async function renderKbCategoriesList() {
  try {
    const cats = await api(`/api/kb/categories`);
    const groups = await api(`/api/kb/groups`);
    state._kbGroups = groups;
    if (!cats.length) {
      kbCategoriesList.innerHTML = '<p class="kb-empty">Нет категорий</p>';
      return;
    }
    const groupOpts = (catGroupId) => `<option value=""${!catGroupId ? ' selected' : ''}>Все</option>` +
      groups.map(g => `<option value="${esc(g.id)}"${catGroupId === g.id ? ' selected' : ''}>${esc(g.name)}</option>`).join('');

    kbCategoriesList.innerHTML = cats.map((c, i) => `
      <div class="kb-cat-manage-item" data-cat-id="${esc(c.id)}" draggable="true">
        <span class="kb-cat-drag-handle" title="Перетащите для перемещения">⠿</span>
        <span class="kb-cat-manage-icon">${kbIcon(c.icon)}</span>
        <span class="kb-cat-manage-name">${esc(c.name)}</span>
        <select class="kb-cat-group-select" data-cat-id="${esc(c.id)}" title="Группа доступа">${groupOpts(c.group_id)}</select>
        <span class="kb-cat-manage-count">${c.articleCount}</span>
        <button class="btn-sm kb-cat-move-btn" data-dir="up" data-cat-id="${esc(c.id)}" title="Вверх" ${i === 0 ? 'disabled' : ''}>↑</button>
        <button class="btn-sm kb-cat-move-btn" data-dir="down" data-cat-id="${esc(c.id)}" title="Вниз" ${i === cats.length - 1 ? 'disabled' : ''}>↓</button>
        <button class="btn-sm btn-danger-outline-sm kb-cat-delete-btn" data-cat-id="${esc(c.id)}" title="Удалить">&times;</button>
      </div>
    `).join('');

    // Group change handlers
    kbCategoriesList.querySelectorAll('.kb-cat-group-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        try {
          await api(`/api/kb/categories/${sel.dataset.catId}`, {
            method: 'PUT',
  
            body: JSON.stringify({ group_id: sel.value || null })
          });
          showToast('Группа обновлена', 'ok');
        } catch (err) { msg(kbCategoriesMessage, err.message, 'error'); }
      });
    });

    // Drag-and-drop reorder
    let _kbDragItem = null;
    kbCategoriesList.querySelectorAll('.kb-cat-manage-item').forEach((item) => {
      item.addEventListener('dragstart', (e) => {
        _kbDragItem = item;
        item.classList.add('kb-cat-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.classList.remove('kb-cat-dragging');
        _kbDragItem = null;
        kbCategoriesList.querySelectorAll('.kb-cat-manage-item').forEach(el => el.classList.remove('kb-cat-drag-over'));
        saveKbCatOrder();
      });
      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        if (_kbDragItem && _kbDragItem !== item) {
          item.classList.add('kb-cat-drag-over');
          const rect = item.getBoundingClientRect();
          const mid = rect.top + rect.height / 2;
          if (e.clientY < mid) {
            kbCategoriesList.insertBefore(_kbDragItem, item);
          } else {
            kbCategoriesList.insertBefore(_kbDragItem, item.nextSibling);
          }
        }
      });
      item.addEventListener('dragleave', () => item.classList.remove('kb-cat-drag-over'));
    });

    // Up/down buttons
    kbCategoriesList.addEventListener('click', async (e) => {
      const moveBtn = e.target.closest('.kb-cat-move-btn');
      if (moveBtn) {
        const dir = moveBtn.dataset.dir;
        const row = moveBtn.closest('.kb-cat-manage-item');
        if (dir === 'up' && row.previousElementSibling) {
          kbCategoriesList.insertBefore(row, row.previousElementSibling);
        } else if (dir === 'down' && row.nextElementSibling) {
          kbCategoriesList.insertBefore(row.nextElementSibling, row);
        }
        await saveKbCatOrder();
        await renderKbCategoriesList();
        return;
      }
      const delBtn = e.target.closest('.kb-cat-delete-btn');
      if (delBtn) {
        if (!confirm('Удалить категорию?')) return;
        try {
          await api(`/api/kb/categories/${delBtn.dataset.catId}`, {
            method: 'DELETE',
  
            body: JSON.stringify({})
          });
          await renderKbCategoriesList();
        } catch (err) {
          msg(kbCategoriesMessage, err.message, 'error');
        }
      }
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
      body: JSON.stringify({ name })
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

/* ── KB Groups Manager (superadmin) ── */

async function openKbGroupsManager() {
  // Create popup dynamically if not exists
  let popup = document.getElementById('kbGroupsPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'kbGroupsPopup';
    popup.className = 'popup-overlay hidden';
    popup.setAttribute('role', 'dialog');
    popup.innerHTML = `<div class="popup-card fade-in" style="max-width:600px;max-height:90vh;overflow-y:auto">
      <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Группы доступа</h3>
      <div id="kbGroupsList"></div>
      <div style="display:flex;gap:8px;margin:12px 0">
        <input id="kbGroupNameInput" placeholder="Название новой группы" style="flex:1" />
        <button type="button" id="kbGroupAddBtn" class="btn-primary btn-sm">Создать</button>
      </div>
      <div class="popup-actions"><button type="button" id="kbGroupsCloseBtn" class="btn-outline-dark">Закрыть</button></div>
      <p id="kbGroupsMessage" class="message"></p>
    </div>`;
    document.body.appendChild(popup);

    popup.addEventListener('click', (e) => { if (e.target === popup) { hide(popup); loadKbView(); } });
    document.getElementById('kbGroupsCloseBtn').addEventListener('click', () => { hide(popup); loadKbView(); });
    document.getElementById('kbGroupAddBtn').addEventListener('click', async () => {
      const name = document.getElementById('kbGroupNameInput').value.trim();
      if (!name) return;
      try {
        await api('/api/kb/groups', { method: 'POST', body: JSON.stringify({ name }) });
        document.getElementById('kbGroupNameInput').value = '';
        renderKbGroupsList();
      } catch (err) { msg(document.getElementById('kbGroupsMessage'), err.message, 'error'); }
    });
  }

  show(popup);
  renderKbGroupsList();
}

async function renderKbGroupsList() {
  const list = document.getElementById('kbGroupsList');
  const msgEl = document.getElementById('kbGroupsMessage');
  try {
    const groups = await api('/api/kb/groups');
    const allUsers = await api('/api/admin/users');
    const users = allUsers.items || allUsers;
    if (!groups.length) {
      list.innerHTML = '<p class="kb-empty">Групп нет</p>';
      return;
    }
    list.innerHTML = groups.map(g => `
      <div class="kb-group-card" data-group-id="${esc(g.id)}">
        <div class="kb-group-header">
          <strong>${esc(g.name)}</strong>
          <button class="btn-sm btn-danger-outline-sm kb-group-del" data-gid="${esc(g.id)}">&times;</button>
        </div>
        <div class="kb-group-members">
          ${(g.memberNames || []).map(m => `<span class="kb-group-member-chip">${esc(m.fullName)} <button class="kb-group-member-rm" data-gid="${esc(g.id)}" data-uid="${esc(m.id)}">&times;</button></span>`).join('')}
        </div>
        <div class="kb-group-add-member">
          <select class="kb-group-user-select" data-gid="${esc(g.id)}">
            <option value="">+ Добавить участника...</option>
            ${users.filter(u => !(g.members || []).includes(u.id)).map(u => `<option value="${esc(u.id)}">${esc(u.fullName)}</option>`).join('')}
          </select>
        </div>
      </div>
    `).join('');

    // Delete group
    list.querySelectorAll('.kb-group-del').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Удалить группу? Категории станут публичными.')) return;
        try {
          await api(`/api/kb/groups/${btn.dataset.gid}`, { method: 'DELETE', body: JSON.stringify({}) });
          renderKbGroupsList();
        } catch (err) { msg(msgEl, err.message, 'error'); }
      });
    });

    // Remove member
    list.querySelectorAll('.kb-group-member-rm').forEach(btn => {
      btn.addEventListener('click', async () => {
        const gid = btn.dataset.gid;
        const uid = btn.dataset.uid;
        const g = groups.find(x => x.id === gid);
        if (!g) return;
        const newMembers = (g.members || []).filter(m => m !== uid);
        try {
          await api(`/api/kb/groups/${gid}`, { method: 'PUT', body: JSON.stringify({ members: newMembers }) });
          renderKbGroupsList();
        } catch (err) { msg(msgEl, err.message, 'error'); }
      });
    });

    // Add member
    list.querySelectorAll('.kb-group-user-select').forEach(sel => {
      sel.addEventListener('change', async () => {
        if (!sel.value) return;
        const gid = sel.dataset.gid;
        const g = groups.find(x => x.id === gid);
        if (!g) return;
        const newMembers = [...(g.members || []), sel.value];
        try {
          await api(`/api/kb/groups/${gid}`, { method: 'PUT', body: JSON.stringify({ members: newMembers }) });
          renderKbGroupsList();
        } catch (err) { msg(msgEl, err.message, 'error'); }
      });
    });
  } catch (err) { msg(msgEl, err.message, 'error'); }
}

/* ── KB Share popup ── */

async function openKbSharePopup(article) {
  let popup = document.getElementById('kbSharePopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'kbSharePopup';
    popup.className = 'popup-overlay hidden';
    popup.setAttribute('role', 'dialog');
    popup.innerHTML = `<div class="popup-card fade-in" style="max-width:480px;max-height:80vh;overflow-y:auto">
      <h3>Поделиться статьёй</h3>
      <p style="font-size:13px;color:var(--text-sec)">Выберите пользователей, которые получат доступ к этой статье вне группы</p>
      <div id="kbShareUserList" style="max-height:300px;overflow-y:auto;margin:12px 0"></div>
      <div class="popup-actions">
        <button type="button" id="kbShareSaveBtn" class="btn-primary btn-sm">Сохранить</button>
        <button type="button" id="kbShareCloseBtn" class="btn-outline-dark btn-sm">Закрыть</button>
      </div>
      <p id="kbShareMessage" class="message"></p>
    </div>`;
    document.body.appendChild(popup);
    popup.addEventListener('click', (e) => { if (e.target === popup) hide(popup); });
    document.getElementById('kbShareCloseBtn').addEventListener('click', () => hide(popup));
  }

  show(popup);
  const listEl = document.getElementById('kbShareUserList');
  const msgEl = document.getElementById('kbShareMessage');
  msg(msgEl, '');

  try {
    const users = await api('/api/kb/users');
    const shared = new Set(article.shared_with || []);

    listEl.innerHTML = users.map(u => `
      <label style="display:flex;align-items:center;gap:8px;padding:6px 8px;cursor:pointer;border-bottom:1px solid var(--border)">
        <input type="checkbox" value="${esc(u.id)}" ${shared.has(u.id) ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent)" />
        <span>${esc(u.fullName)}</span>
      </label>
    `).join('');

    const saveBtn = document.getElementById('kbShareSaveBtn');
    saveBtn.onclick = async () => {
      const selected = [...listEl.querySelectorAll('input[type="checkbox"]:checked')].map(cb => cb.value);
      try {
        await api(`/api/kb/articles/${article.id}/share`, {
          method: 'PUT',

          body: JSON.stringify({ shared_with: selected })
        });
        showToast('Доступ обновлён', 'ok');
        hide(popup);
        loadKbView();
      } catch (err) { msg(msgEl, err.message, 'error'); }
    };
  } catch (err) {
    msg(msgEl, err.message, 'error');
  }
}

/* ── TZ Templates ── */

async function loadTzTemplates() {
  if (state.adminRole !== 'superadmin') return;
  try {
    state.tzTemplates = await api(`/api/tz-templates`);
  } catch { state.tzTemplates = []; }
}

/* ── Global Search ── */

function closeGlobalSearch() {
  globalSearchInput.classList.remove('expanded');
  globalSearchInput.value = '';
  hide(globalSearchResults);
}

function initGlobalSearch() {
  if (!globalSearchInput) return;
  const toggleBtn = $('globalSearchToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = globalSearchInput.classList.contains('expanded');
      if (isOpen) {
        closeGlobalSearch();
      } else {
        globalSearchInput.classList.add('expanded');
        globalSearchInput.focus();
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
    if (e.key === 'Escape') closeGlobalSearch();
  });
  globalSearchInput.addEventListener('blur', () => {
    setTimeout(() => {
      if (!globalSearchInput.matches(':focus') && !globalSearchResults.matches(':hover')) closeGlobalSearch();
    }, 200);
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#globalSearchWrap')) closeGlobalSearch();
  });
}

async function performGlobalSearch(q) {
  try {
    const results = await api(`/api/search?q=${encodeURIComponent(q)}`);
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


/* ── Metrics Dashboard ── */

let _metricsChartInstances = [];

async function loadMetrics() {
  if (!metricsContent) return;
  metricsContent.innerHTML = '<p class="admin-empty">Загрузка...</p>';
  try {
    const data = await api('/api/metrics');
    renderMetrics(data);
  } catch (err) {
    metricsContent.innerHTML = '';
    msg(metricsMessage, err.message, 'error');
  }
}

function renderMetrics(data) {
  if (!metricsContent) return;
  // Destroy old chart instances
  _metricsChartInstances.forEach((c) => c.destroy());
  _metricsChartInstances = [];

  const donePercent = data.totalTz ? Math.round((data.totalDone / data.totalTz) * 100) : 0;

  let html = '';

  // Summary cards
  html += `<div class="metrics-summary">
    <div class="metrics-card">
      <div class="metrics-num">${data.totalTz}</div>
      <div class="metrics-label">Всего ТЗ</div>
    </div>
    <div class="metrics-card metrics-card-accent">
      <div class="metrics-num">${data.activeTz}</div>
      <div class="metrics-label">В работе</div>
    </div>
    <div class="metrics-card metrics-card-success">
      <div class="metrics-num">${data.totalDone}</div>
      <div class="metrics-label">Завершено</div>
    </div>
    <div class="metrics-card ${data.overdue > 0 ? 'metrics-card-danger' : ''}">
      <div class="metrics-num">${data.overdue}</div>
      <div class="metrics-label">Просрочено</div>
    </div>
    <div class="metrics-card ${data.deadlineSoon > 0 ? 'metrics-card-warn' : ''}">
      <div class="metrics-num">${data.deadlineSoon}</div>
      <div class="metrics-label">Скоро дедлайн</div>
    </div>
    <div class="metrics-card">
      <div class="metrics-num">${data.avgCycleTime}<small>д</small></div>
      <div class="metrics-label">Ср. цикл выполнения</div>
    </div>
    <div class="metrics-card">
      <div class="metrics-num">${data.totalUsers}</div>
      <div class="metrics-label">Пользователей</div>
    </div>
  </div>`;

  // Progress bar
  html += `<div class="metrics-progress-wrap">
    <div class="metrics-progress-header">
      <span>Прогресс завершения</span>
      <span class="metrics-progress-pct">${donePercent}%</span>
    </div>
    <div class="metrics-progress-bar">
      <div class="metrics-progress-fill" style="width:${donePercent}%"></div>
    </div>
  </div>`;

  // Charts
  html += `<div class="metrics-charts">
    <div class="metrics-chart-wrap metrics-chart-wide"><h4>Динамика создания задач</h4><canvas id="chartCreatedPerWeek"></canvas></div>
    <div class="metrics-chart-wrap"><h4>Распределение по статусам</h4><canvas id="chartStatus"></canvas></div>
    <div class="metrics-chart-wrap"><h4>Распределение по приоритетам</h4><canvas id="chartPriority"></canvas></div>
    <div class="metrics-chart-wrap"><h4>Распределение по типам</h4><canvas id="chartType"></canvas></div>
  </div>`;

  // Top assignees (horizontal bars)
  if (data.topAssignees && data.topAssignees.length) {
    const maxA = Math.max(...data.topAssignees.map(a => a[1]), 1);
    html += '<div class="metrics-assignees"><h4>Нагрузка по исполнителям</h4><div class="metrics-bars">';
    for (const [name, count] of data.topAssignees) {
      const pct = Math.round(count / maxA * 100);
      html += `<div class="metrics-bar-row">
        <span class="metrics-bar-label">${esc(name)}</span>
        <div class="metrics-bar-track"><div class="metrics-bar-fill" style="width:${pct}%"></div></div>
        <span class="metrics-bar-value">${count}</span>
      </div>`;
    }
    html += '</div></div>';
  }

  metricsContent.innerHTML = html;

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
  const { transitions, statusLabels, swimlanes } = data;
  state.kanbanTransitions = transitions || {};
  const { displayOrder, colorMap } = kanbanResolveDisplay(data);

  // Count totals per column across all swimlanes
  const colTotals = {};
  for (const status of displayOrder) {
    colTotals[status] = swimlanes.reduce((sum, sl) => sum + (sl.columns[status] || []).length, 0);
  }

  let html = '<div class="kanban-swimlane-board">';
  html += '<div class="kanban-swimlane-header"><div class="kanban-sl-label"></div>';
  for (const status of displayOrder) {
    const color = colorMap[status] || '#edf2f7';
    const bcol = (data.boardColumns || []).find(c => c.id === status);
    const wipLimit = bcol ? bcol.wip_limit || 0 : 0;
    const total = colTotals[status] || 0;
    const wipOver = wipLimit > 0 && total > wipLimit;
    html += `<div class="kanban-sl-col-header${wipOver ? ' kanban-sl-wip-over' : ''}" style="background:${color}">
      ${esc(statusLabels[status] || status)}
      <span class="kanban-sl-col-count">${total}${wipLimit ? `/${wipLimit}` : ''}</span>
    </div>`;
  }
  html += '</div>';

  for (const sl of swimlanes) {
    html += `<div class="kanban-swimlane-row"><div class="kanban-sl-label">${esc(sl.label)}</div>`;
    for (const status of displayOrder) {
      const cards = sl.columns[status] || [];
      html += `<div class="kanban-sl-cell kanban-column" data-status="${esc(status)}">`;
      for (const tz of cards) html += kanbanCardHtml(tz, true);
      html += '</div>';
    }
    html += '</div>';
  }
  html += '</div>';
  tzListContainer.innerHTML = html;

  initKanbanDnD();
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
window.addEventListener('beforeunload', stopAiRefresh);

async function loadAiTasks() {
  if (!state.pin || state.adminRole !== 'superadmin') return;
  try {
    const tasks = await api('/api/admin/ai-tasks', {
      method: 'POST',
      body: JSON.stringify({})
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
      body: JSON.stringify({ prompt })
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
      body: JSON.stringify({ taskId })
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

/* ── Onboarding (first-time user guide) ── */

function showOnboarding() {
  const key = `lkds_onboarding_${state.userId}`;
  if (localStorage.getItem(key)) return;

  const items = [
    { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>', title: 'Переговорки', desc: 'Бронирование переговорных комнат на нужное время' },
    { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>', title: 'Заявка 1С CRM', desc: 'Подача заявок на ошибки и улучшения в 1С CRM' },
    { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>', title: 'База знаний', desc: 'Документация, инструкции и полезные материалы' },
    { icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>', title: 'Ссылки', desc: 'Быстрый доступ к рабочим системам и ресурсам' }
  ];

  const overlay = document.createElement('div');
  overlay.className = 'onboarding-overlay';
  overlay.innerHTML = `
    <div class="onboarding-card">
      <button class="onboarding-close" title="Закрыть">&times;</button>
      <h2 class="onboarding-title">Добро пожаловать в LKDS!</h2>
      <p class="onboarding-subtitle">Вот что вам доступно на портале:</p>
      <div class="onboarding-items">
        ${items.map(i => `
          <div class="onboarding-item">
            <div class="onboarding-item-icon">${i.icon}</div>
            <div>
              <div class="onboarding-item-title">${i.title}</div>
              <div class="onboarding-item-desc">${i.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <button class="onboarding-ok">Понятно, начать работу</button>
    </div>
  `;

  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('onboarding-visible'));

  const dismiss = () => {
    localStorage.setItem(key, '1');
    overlay.classList.remove('onboarding-visible');
    overlay.addEventListener('transitionend', () => overlay.remove());
  };

  overlay.querySelector('.onboarding-close').addEventListener('click', dismiss);
  overlay.querySelector('.onboarding-ok').addEventListener('click', dismiss);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
}

/* ── My Tasks ── */

const TASK_STATUS_LABELS = { todo: 'К выполнению', in_progress: 'В работе', done: 'Выполнено', cancelled: 'Отменено' };
const TASK_PRIO_LABELS = { low: 'Низкий', medium: 'Средний', high: 'Высокий' };
const TASK_TYPE_LABELS = { task: 'Задача', bug: 'Баг', proposal: 'Предложение' };

async function loadTasks() {
  if (!tasksContent) return;
  tasksContent.innerHTML = '<p class="admin-empty">Загрузка...</p>';
  try {
    state.tasks = await api('/api/tasks');
    renderTasks();
    updateTasksBadge();
  } catch (err) {
    tasksContent.innerHTML = '<p class="message error">' + esc(err.message) + '</p>';
  }
}

function renderTasks() {
  const f = state.taskFilter;
  let tasks = state.tasks;
  if (f.status) tasks = tasks.filter(t => t.status === f.status);
  if (f.type) tasks = tasks.filter(t => t.type === f.type);
  if (f.search) {
    const q = f.search.toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
  }

  // Toolbar
  tasksToolbar.innerHTML = `
    <div class="tasks-filters" data-widget="tasks-filters">
      <select id="taskFilterStatus">
        <option value="">Все статусы</option>
        ${Object.entries(TASK_STATUS_LABELS).map(([k, v]) => `<option value="${k}"${f.status === k ? ' selected' : ''}>${v}</option>`).join('')}
      </select>
      <select id="taskFilterType">
        <option value="">Все типы</option>
        ${Object.entries(TASK_TYPE_LABELS).map(([k, v]) => `<option value="${k}"${f.type === k ? ' selected' : ''}>${v}</option>`).join('')}
      </select>
      <input id="taskSearch" placeholder="Поиск..." value="${esc(f.search || '')}" style="min-width:150px" />
    </div>
    <button class="btn-primary btn-sm" id="taskCreateBtn">+ Новая задача</button>
  `;

  $('taskFilterStatus').addEventListener('change', (e) => { state.taskFilter.status = e.target.value; renderTasks(); });
  $('taskFilterType').addEventListener('change', (e) => { state.taskFilter.type = e.target.value; renderTasks(); });
  let _taskSearchTimer;
  $('taskSearch').addEventListener('input', (e) => {
    clearTimeout(_taskSearchTimer);
    _taskSearchTimer = setTimeout(() => { state.taskFilter.search = e.target.value; renderTasks(); }, 300);
  });
  $('taskCreateBtn').addEventListener('click', () => openTaskForm(null));

  // Kanban board
  const statuses = ['todo', 'in_progress', 'done', 'cancelled'];
  let boardHtml = '<div class="task-board">';
  for (const s of statuses) {
    const colTasks = tasks.filter(t => t.status === s);
    boardHtml += `<div class="task-column" data-status="${s}">
      <div class="task-column-header">${TASK_STATUS_LABELS[s]} <span class="task-column-count">${colTasks.length}</span></div>`;
    for (const t of colTasks) {
      const isOverdue = t.due_date && new Date(t.due_date) < new Date() && s !== 'done' && s !== 'cancelled';
      const dueLbl = t.due_date ? new Date(t.due_date).toLocaleDateString('ru-RU') : '';
      const typeCls = 'task-type-' + t.type;
      boardHtml += `<div class="task-card task-prio-${t.priority}" data-task-id="${esc(t.id)}">
        <div class="task-card-prio"></div>
        <div class="task-card-title">${esc(t.title)}</div>
        <div class="task-card-meta">
          <span class="task-type-badge ${typeCls}">${TASK_TYPE_LABELS[t.type] || t.type}</span>
          ${t.type === 'proposal' && t.proposal_status ? `<span class="task-proposal-badge task-proposal-${t.proposal_status}">${t.proposal_status === 'pending' ? 'На рассмотрении' : t.proposal_status === 'approved' ? 'Одобрено' : 'Отклонено'}</span>` : ''}
          ${dueLbl ? `<span class="${isOverdue ? 'task-due-overdue' : ''}">${dueLbl}</span>` : ''}
          <span>${esc(t.assignee_name || '')}</span>
        </div>
      </div>`;
    }
    boardHtml += '</div>';
  }
  boardHtml += '</div>';
  tasksContent.innerHTML = boardHtml;

  // Card click -> open detail
  tasksContent.querySelectorAll('.task-card').forEach(card => {
    card.addEventListener('click', () => {
      const task = state.tasks.find(t => t.id === card.dataset.taskId);
      if (task) openTaskForm(task);
    });
  });
  applyWidgetVisibility();
}

async function openTaskForm(task) {
  const isEdit = !!task;
  const users = await api('/api/users/names');

  const overlay = document.createElement('div');
  overlay.className = 'task-popup-overlay';
  overlay.innerHTML = `<div class="task-popup">
    <h3>${isEdit ? 'Редактировать задачу' : 'Новая задача'}</h3>
    <label>Название<input id="taskTitle" value="${isEdit ? esc(task.title) : ''}" maxlength="200" /></label>
    <label>Описание<textarea id="taskDesc" rows="3">${isEdit ? esc(task.description || '') : ''}</textarea></label>
    <label>Тип
      <select id="taskType">
        ${Object.entries(TASK_TYPE_LABELS).map(([k, v]) => `<option value="${k}"${isEdit && task.type === k ? ' selected' : ''}>${v}</option>`).join('')}
      </select>
    </label>
    <label>Приоритет
      <select id="taskPrio">
        ${Object.entries(TASK_PRIO_LABELS).map(([k, v]) => `<option value="${k}"${isEdit && task.priority === k ? ' selected' : ''}>${v}</option>`).join('')}
      </select>
    </label>
    <label>Исполнитель
      <select id="taskAssignee">
        ${users.map(u => `<option value="${esc(u.id)}"${isEdit && task.assignee_id === u.id ? ' selected' : ''}${!isEdit && u.id === state.userId ? ' selected' : ''}>${esc(u.fullName)}</option>`).join('')}
      </select>
    </label>
    <label>Срок<input id="taskDue" type="date" value="${isEdit ? (task.due_date || '') : ''}" /></label>
    <label>Метки<input id="taskTags" placeholder="Через запятую" value="${isEdit ? (task.tags || []).join(', ') : ''}" /></label>
    ${isEdit ? `<label>Статус
      <select id="taskStatus">
        ${Object.entries(TASK_STATUS_LABELS).map(([k, v]) => `<option value="${k}"${task.status === k ? ' selected' : ''}>${v}</option>`).join('')}
      </select>
    </label>` : ''}
    ${isEdit && task.type === 'proposal' && state.adminRole === 'superadmin' && task.proposal_status === 'pending' ? `
      <div style="margin-top:12px;padding:12px;background:var(--bg-soft);border-radius:8px">
        <strong>Рассмотрение предложения</strong>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn-primary btn-sm" id="taskApproveBtn">Одобрить</button>
          <button class="btn-cancel-sm" id="taskRejectBtn">Отклонить</button>
        </div>
      </div>
    ` : ''}
    <div class="task-popup-actions">
      ${isEdit ? `<button class="btn-cancel-sm" id="taskDeleteBtn" style="margin-right:auto">Удалить</button>` : ''}
      <button class="btn-outline-dark btn-sm" id="taskCancelBtn">Отмена</button>
      <button class="btn-primary btn-sm" id="taskSaveBtn">${isEdit ? 'Сохранить' : 'Создать'}</button>
    </div>
    <p id="taskFormMsg" class="message" style="margin-top:8px"></p>
  </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  overlay.querySelector('#taskCancelBtn').addEventListener('click', () => overlay.remove());

  overlay.querySelector('#taskSaveBtn').addEventListener('click', async () => {
    const title = overlay.querySelector('#taskTitle').value.trim();
    if (!title || title.length < 3) { msg(overlay.querySelector('#taskFormMsg'), 'Название минимум 3 символа', 'error'); return; }
    const body = {
      title,
      description: overlay.querySelector('#taskDesc').value.trim(),
      type: overlay.querySelector('#taskType').value,
      priority: overlay.querySelector('#taskPrio').value,
      assignee_id: overlay.querySelector('#taskAssignee').value,
      due_date: overlay.querySelector('#taskDue').value || '',
      tags: overlay.querySelector('#taskTags').value.split(',').map(t => t.trim()).filter(Boolean)
    };
    if (isEdit) body.status = overlay.querySelector('#taskStatus')?.value || task.status;
    try {
      if (isEdit) {
        await api(`/api/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify(body) });
        showToast('Задача обновлена', 'ok');
      } else {
        await api('/api/tasks', { method: 'POST', body: JSON.stringify(body) });
        showToast('Задача создана', 'ok');
      }
      overlay.remove();
      loadTasks();
    } catch (err) { msg(overlay.querySelector('#taskFormMsg'), err.message, 'error'); }
  });

  overlay.querySelector('#taskDeleteBtn')?.addEventListener('click', async () => {
    if (!confirm('Удалить задачу?')) return;
    try {
      await api(`/api/tasks/${task.id}`, { method: 'DELETE', body: JSON.stringify({}) });
      showToast('Задача удалена', 'ok');
      overlay.remove();
      loadTasks();
    } catch (err) { showToast(err.message, 'danger'); }
  });

  // Proposal review buttons
  overlay.querySelector('#taskApproveBtn')?.addEventListener('click', async () => {
    try {
      await api(`/api/tasks/${task.id}/review`, { method: 'PATCH', body: JSON.stringify({ decision: 'approved' }) });
      showToast('Предложение одобрено', 'ok');
      overlay.remove();
      loadTasks();
    } catch (err) { showToast(err.message, 'danger'); }
  });

  overlay.querySelector('#taskRejectBtn')?.addEventListener('click', async () => {
    try {
      await api(`/api/tasks/${task.id}/review`, { method: 'PATCH', body: JSON.stringify({ decision: 'rejected' }) });
      showToast('Предложение отклонено', 'ok');
      overlay.remove();
      loadTasks();
    } catch (err) { showToast(err.message, 'danger'); }
  });
}

function updateTasksBadge() {
  const badge = $('tasksBadge');
  if (!badge) return;
  const active = (state.tasks || []).filter(t => t.status === 'todo' || t.status === 'in_progress').length;
  if (active > 0) { badge.textContent = active; badge.style.display = ''; }
  else { badge.style.display = 'none'; }
}

/* ── Init ── */

(async () => {
    const loggedIn = await tryAutoLogin();
    if (loggedIn) {
      showMain(); await loadApp(); showTzNotifications(); startBookingReminders();
      initGlobalSearch();
      await restoreFromHash();
    }
    else { showAuth(); }
  })();
