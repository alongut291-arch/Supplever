const STORAGE_KEY = 'supplever_meds';

/* ---------- data layer ---------- */

function loadMeds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read meds from storage', err);
    return [];
  }
}

function saveMeds(meds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meds));
}

function addMed(med) {
  const meds = loadMeds();
  meds.push({ ...med, id: crypto.randomUUID() });
  saveMeds(meds);
}

function updateMed(id, changes) {
  const meds = loadMeds();
  const idx = meds.findIndex(m => m.id === id);
  if (idx === -1) return;
  meds[idx] = { ...meds[idx], ...changes };
  saveMeds(meds);
}

function deleteMed(id) {
  const meds = loadMeds().filter(m => m.id !== id);
  saveMeds(meds);
}

/* ---------- domain logic ---------- */

function daysRemaining(med) {
  if (!med.dailyRate || med.dailyRate <= 0) return Infinity;
  return med.currentStock / med.dailyRate;
}

function medStatus(med) {
  const days = daysRemaining(med);
  const urgentThreshold = Math.max(2, med.alertDays * 0.35);
  if (days <= 0) return 'danger';
  if (days <= urgentThreshold) return 'danger';
  if (days <= med.alertDays) return 'warn';
  return 'good';
}

function stockFillPercent(med) {
  const days = daysRemaining(med);
  if (days === Infinity) return 100;
  const reference = Math.max(med.alertDays * 4, 30);
  return Math.max(0, Math.min(100, (days / reference) * 100));
}

function formatDays(days) {
  if (days === Infinity) return '—';
  const rounded = Math.round(days);
  if (rounded <= 0) return 'אזל המלאי';
  if (rounded === 1) return 'יום אחד נותר';
  return `${rounded} ימים נותרו`;
}

const ALERT_DAYS_LABELS = { 7: 'שבוע', 14: 'שבועיים', 21: 'שלושה שבועות', 30: 'חודש' };

function formatAlertDays(alertDays) {
  return ALERT_DAYS_LABELS[alertDays] || `${alertDays} ימים`;
}

/* ---------- rendering ---------- */

const listEl = document.getElementById('medList');
const emptyStateEl = document.getElementById('emptyState');
const orderListEl = document.getElementById('orderList');
const ordersEmptyStateEl = document.getElementById('ordersEmptyState');
const ordersHintEl = document.getElementById('ordersHint');
const orderBadgeEl = document.getElementById('orderBadge');

function medCardHTML(med, extraHTML = '') {
  const status = medStatus(med);
  const days = daysRemaining(med);
  const fill = stockFillPercent(med);
  return `
    <div class="med-card" data-id="${med.id}">
      <div class="med-card-top">
        <div class="med-card-top-left">
          <span class="status-dot status-${status}"></span>
          <div>
            <p class="med-name">${escapeHtml(med.name)}</p>
            <p class="med-dose">${escapeHtml(med.dose || '')}${med.dose ? ' · ' : ''}${med.dailyRate} ליום</p>
          </div>
        </div>
        <p class="med-days ${status}">${formatDays(days)}</p>
      </div>
      <div class="stock-bar">
        <div class="stock-bar-fill ${status}" style="width:${fill}%"></div>
      </div>
      <p class="med-hint">מלאי נוכחי: ${med.currentStock} כדורים${med.pillsPerBox ? ` (כ-${Math.round((med.currentStock / med.pillsPerBox) * 10) / 10} קופסאות)` : ''} · התראה מ-${formatAlertDays(med.alertDays)} לפני הסוף</p>
      ${extraHTML}
      <button class="received-btn" data-action="receive" data-id="${med.id}">קיבלתי הזמנה — עדכן מלאי</button>
    </div>
  `;
}

/* ---------- order quantity planning ---------- */

const ORDER_MONTHS_LABELS = { 1: 'חודש', 2: 'חודשיים', 3: '3 חודשים' };
const orderMonthsByMedId = {};

function calcOrderSuggestion(med, months) {
  const targetDays = months * 30;
  const neededPills = Math.ceil(med.dailyRate * targetDays);
  const neededBoxes = med.pillsPerBox ? Math.ceil(neededPills / med.pillsPerBox) : null;
  return { neededPills, neededBoxes };
}

function orderPlanningHTML(med) {
  const months = orderMonthsByMedId[med.id] || 1;
  const { neededPills, neededBoxes } = calcOrderSuggestion(med, months);

  const optionsHTML = [1, 2, 3].map(m =>
    `<option value="${m}" ${m === months ? 'selected' : ''}>${ORDER_MONTHS_LABELS[m]}</option>`
  ).join('');

  let resultText;
  if (neededBoxes !== null) {
    const boxesText = neededBoxes === 1 ? 'קופסה אחת' : `${neededBoxes} קופסאות`;
    resultText = `כמות להזמנה: ${boxesText} (כ-${neededPills} כדורים)`;
  } else {
    resultText = `כמות להזמנה: כ-${neededPills} כדורים`;
  }

  return `
    <div class="order-planning">
      <label class="order-planning-label">
        להזמין מלאי ל-
        <select class="order-months-select" data-id="${med.id}">${optionsHTML}</select>
        קדימה
      </label>
      <p class="order-planning-result">${resultText}</p>
    </div>
  `;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const meds = loadMeds();
  const sorted = [...meds].sort((a, b) => daysRemaining(a) - daysRemaining(b));

  if (meds.length === 0) {
    listEl.innerHTML = '';
    emptyStateEl.style.display = 'block';
  } else {
    emptyStateEl.style.display = 'none';
    listEl.innerHTML = sorted.map(medCardHTML).join('');
  }

  renderOrders(sorted);
}

function renderOrders(sortedMeds) {
  const needsOrder = sortedMeds.filter(med => medStatus(med) !== 'good');

  orderBadgeEl.textContent = needsOrder.length;
  orderBadgeEl.hidden = needsOrder.length === 0;

  if (needsOrder.length === 0) {
    orderListEl.innerHTML = '';
    ordersEmptyStateEl.style.display = 'block';
    ordersHintEl.style.display = 'none';
    return;
  }
  ordersEmptyStateEl.style.display = 'none';
  ordersHintEl.style.display = 'block';
  const countText = needsOrder.length === 1 ? 'תרופה אחת דורשת הזמנה' : `${needsOrder.length} תרופות דורשות הזמנה`;
  ordersHintEl.textContent = `${countText} — מוכן לקחת לבית המרקחת`;
  orderListEl.innerHTML = needsOrder.map(med => medCardHTML(med, orderPlanningHTML(med))).join('');
}

/* ---------- modal ---------- */

const overlay = document.getElementById('modalOverlay');
const form = document.getElementById('medForm');
const modalTitle = document.getElementById('modalTitle');
const deleteBtn = document.getElementById('deleteBtn');
let editingId = null;

const DEFAULT_ALERT_DAYS_KEY = 'supplever_default_alert_days';

function getDefaultAlertDays() {
  return localStorage.getItem(DEFAULT_ALERT_DAYS_KEY) || '7';
}

function recalcStockFromBoxes() {
  const pillsPerBox = parseFloat(form.pillsPerBox.value);
  const boxes = parseFloat(form.currentBoxes.value);
  if (!isNaN(pillsPerBox) && pillsPerBox > 0 && !isNaN(boxes) && boxes >= 0) {
    form.currentStock.value = pillsPerBox * boxes;
  }
}

form.pillsPerBox.addEventListener('input', recalcStockFromBoxes);
form.currentBoxes.addEventListener('input', recalcStockFromBoxes);

function openModal(med = null) {
  editingId = med ? med.id : null;
  modalTitle.textContent = med ? 'עריכת תרופה' : 'הוספת תרופה';
  deleteBtn.style.display = med ? 'block' : 'none';
  form.name.value = med ? med.name : '';
  form.dose.value = med ? med.dose : '';
  form.pillsPerBox.value = med ? (med.pillsPerBox ?? '') : '';
  form.dailyRate.value = med ? med.dailyRate : '';
  form.currentBoxes.value = med ? (med.currentBoxes ?? '') : '';
  form.currentStock.value = med ? med.currentStock : '';
  form.alertDays.value = med ? med.alertDays : getDefaultAlertDays();
  overlay.classList.add('open');
  form.name.focus();
}

function closeModal() {
  overlay.classList.remove('open');
  editingId = null;
  form.reset();
}

document.getElementById('addFab').addEventListener('click', () => openModal());
document.getElementById('cancelBtn').addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) closeModal();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const med = {
    name: form.name.value.trim(),
    dose: form.dose.value.trim(),
    pillsPerBox: parseFloat(form.pillsPerBox.value),
    dailyRate: parseFloat(form.dailyRate.value),
    currentBoxes: parseFloat(form.currentBoxes.value),
    currentStock: parseFloat(form.currentStock.value),
    alertDays: parseInt(form.alertDays.value, 10),
  };
  if (!med.name || !med.pillsPerBox || med.pillsPerBox <= 0 || !med.dailyRate || med.dailyRate <= 0
    || isNaN(med.currentBoxes) || med.currentBoxes < 0 || isNaN(med.currentStock) || med.currentStock < 0) {
    return;
  }
  localStorage.setItem(DEFAULT_ALERT_DAYS_KEY, String(med.alertDays));
  if (editingId) {
    updateMed(editingId, med);
    showToast('התרופה עודכנה');
  } else {
    addMed(med);
    showToast('התרופה נוספה בהצלחה');
  }
  closeModal();
  render();
});

deleteBtn.addEventListener('click', () => {
  if (!editingId) return;
  if (confirm('למחוק את התרופה הזו?')) {
    deleteMed(editingId);
    closeModal();
    render();
    showToast('התרופה נמחקה');
  }
});

function handleListClick(e) {
  const receiveBtn = e.target.closest('[data-action="receive"]');
  if (receiveBtn) {
    e.stopPropagation();
    openReceiveModal(receiveBtn.dataset.id);
    return;
  }

  if (e.target.closest('.order-planning')) {
    e.stopPropagation();
    return;
  }

  const card = e.target.closest('.med-card');
  if (card) {
    const meds = loadMeds();
    const med = meds.find(m => m.id === card.dataset.id);
    if (med) openModal(med);
  }
}

listEl.addEventListener('click', handleListClick);
orderListEl.addEventListener('click', handleListClick);

orderListEl.addEventListener('change', (e) => {
  const select = e.target.closest('.order-months-select');
  if (!select) return;
  orderMonthsByMedId[select.dataset.id] = parseInt(select.value, 10);
  render();
});

/* ---------- tabs ---------- */

const tabDashboard = document.getElementById('tabDashboard');
const tabOrders = document.getElementById('tabOrders');
const dashboardView = document.getElementById('dashboardView');
const ordersView = document.getElementById('ordersView');

function switchTab(view) {
  const showOrders = view === 'orders';
  dashboardView.hidden = showOrders;
  ordersView.hidden = !showOrders;
  tabDashboard.classList.toggle('active', !showOrders);
  tabOrders.classList.toggle('active', showOrders);
}

tabDashboard.addEventListener('click', () => switchTab('dashboard'));
tabOrders.addEventListener('click', () => switchTab('orders'));

/* ---------- receive-stock modal ---------- */

const receiveOverlay = document.getElementById('receiveModalOverlay');
const receiveForm = document.getElementById('receiveForm');
const receiveMedNameEl = document.getElementById('receiveMedName');
let receivingId = null;

function openReceiveModal(id) {
  const med = loadMeds().find(m => m.id === id);
  if (!med) return;
  receivingId = id;
  const perBoxHint = med.pillsPerBox ? ` · כל קופסה = ${med.pillsPerBox} כדורים` : '';
  receiveMedNameEl.textContent = `${med.name} · מלאי נוכחי: ${med.currentStock} כדורים${perBoxHint}`;
  receiveForm.reset();
  receiveOverlay.classList.add('open');
  receiveForm.receiveBoxes.focus();
}

function closeReceiveModal() {
  receiveOverlay.classList.remove('open');
  receivingId = null;
}

document.getElementById('receiveCancelBtn').addEventListener('click', closeReceiveModal);
receiveOverlay.addEventListener('click', (e) => {
  if (e.target === receiveOverlay) closeReceiveModal();
});

receiveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const boxesReceived = parseFloat(receiveForm.receiveBoxes.value);
  if (!receivingId || isNaN(boxesReceived) || boxesReceived <= 0) return;
  const med = loadMeds().find(m => m.id === receivingId);
  if (!med) return;
  const pillsPerBox = med.pillsPerBox || 1;
  updateMed(receivingId, {
    currentStock: med.currentStock + boxesReceived * pillsPerBox,
    currentBoxes: (med.currentBoxes || 0) + boxesReceived,
  });
  closeReceiveModal();
  render();
  showToast('המלאי עודכן');
});

/* ---------- toast ---------- */

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ---------- notifications ---------- */

const NOTIFY_DISMISSED_KEY = 'supplever_notify_dismissed';
const notifyBanner = document.getElementById('notifyBanner');

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function updateNotifyBanner() {
  if (!('Notification' in window)) {
    notifyBanner.hidden = true;
    return;
  }
  const dismissed = localStorage.getItem(NOTIFY_DISMISSED_KEY) === 'true';
  notifyBanner.hidden = Notification.permission !== 'default' || dismissed;
}

async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('sw.js');
  } catch (err) {
    console.error('Service worker registration failed', err);
    return null;
  }
}

async function showSystemNotification(title, body) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      reg.showNotification(title, { body });
    } else {
      new Notification(title, { body });
    }
  } catch (err) {
    console.error('Failed to show notification', err);
  }
}

async function checkAndNotify() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const meds = loadMeds();
  const today = todayStr();
  const due = meds.filter(med => medStatus(med) !== 'good' && med.lastNotifiedDate !== today);
  if (due.length === 0) return;

  if (due.length === 1) {
    const med = due[0];
    await showSystemNotification(
      `${med.name} — ${formatDays(daysRemaining(med))}`,
      'מומלץ להזמין בהקדם דרך Supplever'
    );
  } else {
    await showSystemNotification(
      `${due.length} תרופות דורשות הזמנה`,
      due.map(m => m.name).join(', ')
    );
  }

  due.forEach(med => updateMed(med.id, { lastNotifiedDate: today }));
}

document.getElementById('enableNotifyBtn').addEventListener('click', async () => {
  const permission = await Notification.requestPermission();
  updateNotifyBanner();
  if (permission === 'granted') {
    showToast('התראות הופעלו');
    checkAndNotify();
  }
});

document.getElementById('dismissNotifyBtn').addEventListener('click', () => {
  localStorage.setItem(NOTIFY_DISMISSED_KEY, 'true');
  updateNotifyBanner();
});

/* ---------- init ---------- */

render();
updateNotifyBanner();
registerServiceWorker().then(() => checkAndNotify());
