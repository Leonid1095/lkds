const roomSelect = document.getElementById('roomSelect');
const dateInput = document.getElementById('dateInput');
const refreshBtn = document.getElementById('refreshBtn');
const scheduleGrid = document.getElementById('scheduleGrid');
const dayBookings = document.getElementById('dayBookings');
const linksList = document.getElementById('linksList');
const domainBadge = document.getElementById('domainBadge');

const bookingForm = document.getElementById('bookingForm');
const bookingRoomSelect = document.getElementById('bookingRoomSelect');
const bookingDate = document.getElementById('bookingDate');
const bookingMessage = document.getElementById('bookingMessage');

const crmForm = document.getElementById('crmForm');
const crmMessage = document.getElementById('crmMessage');

const state = {
  settings: { startHour: 8, endHour: 21 },
  rooms: [],
  bookings: []
};

function getToday() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function setMessage(target, text, type = '') {
  target.textContent = text;
  target.className = `message ${type}`.trim();
}

async function readJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Ошибка запроса');
  }
  return data;
}

function renderRooms() {
  const options = state.rooms
    .map((room) => `<option value="${room.id}">${room.name}</option>`)
    .join('');
  roomSelect.innerHTML = options;
  bookingRoomSelect.innerHTML = options;
}

function renderLinks(links) {
  linksList.innerHTML = links
    .map((item) => `<li><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a></li>`)
    .join('');
}

function renderSchedule() {
  const start = state.settings.startHour;
  const end = state.settings.endHour;

  let html = '';
  for (let hour = start; hour < end; hour += 1) {
    const rowBooking = state.bookings.find((item) => item.startHour <= hour && item.endHour > hour);
    const label = `${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:00`;

    if (rowBooking) {
      html += `
        <div class="slot-row">
          <div>${label}</div>
          <div class="slot-status busy">Занято: ${rowBooking.topic} (${rowBooking.fullName}, ${rowBooking.telegram})</div>
        </div>
      `;
    } else {
      html += `
        <div class="slot-row">
          <div>${label}</div>
          <div class="slot-status free">Свободно</div>
        </div>
      `;
    }
  }

  scheduleGrid.innerHTML = html;

  if (!state.bookings.length) {
    dayBookings.textContent = 'На выбранную дату броней пока нет.';
    return;
  }

  dayBookings.innerHTML = state.bookings
    .map(
      (item) =>
        `${String(item.startHour).padStart(2, '0')}:00-${String(item.endHour).padStart(2, '0')}:00 · ${item.topic} · ${item.fullName} (${item.telegram})`
    )
    .join('<br/>');
}

async function loadBookings() {
  const roomId = roomSelect.value;
  const date = dateInput.value;
  if (!roomId || !date) {
    return;
  }

  state.bookings = await readJson(`/api/bookings?roomId=${encodeURIComponent(roomId)}&date=${encodeURIComponent(date)}`);
  renderSchedule();
}

async function init() {
  const [settings, rooms, links] = await Promise.all([
    readJson('/api/settings'),
    readJson('/api/rooms'),
    readJson('/api/links')
  ]);

  state.settings = settings;
  state.rooms = rooms;

  domainBadge.textContent = `Домен: ${settings.publicBaseUrl}`;
  renderRooms();
  renderLinks(links);

  const today = getToday();
  dateInput.value = today;
  bookingDate.value = today;

  await loadBookings();
}

refreshBtn.addEventListener('click', () => {
  loadBookings().catch((error) => setMessage(bookingMessage, error.message, 'error'));
});

roomSelect.addEventListener('change', () => {
  bookingRoomSelect.value = roomSelect.value;
  loadBookings().catch((error) => setMessage(bookingMessage, error.message, 'error'));
});

dateInput.addEventListener('change', () => {
  bookingDate.value = dateInput.value;
  loadBookings().catch((error) => setMessage(bookingMessage, error.message, 'error'));
});

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const payload = Object.fromEntries(formData.entries());
  payload.startHour = Number(payload.startHour);
  payload.endHour = Number(payload.endHour);

  try {
    await readJson('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    setMessage(bookingMessage, 'Бронирование создано.', 'success');
    roomSelect.value = payload.roomId;
    dateInput.value = payload.date;
    await loadBookings();
  } catch (error) {
    setMessage(bookingMessage, error.message, 'error');
  }
});

crmForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = Object.fromEntries(new FormData(crmForm).entries());

  try {
    await readJson('/api/crm-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    crmForm.reset();
    setMessage(crmMessage, 'Заявка отправлена.', 'success');
  } catch (error) {
    setMessage(crmMessage, error.message, 'error');
  }
});

init().catch((error) => {
  setMessage(bookingMessage, `Ошибка инициализации: ${error.message}`, 'error');
});
