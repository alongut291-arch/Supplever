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
const cartListEl = document.getElementById('cartList');
const cartEmptyStateEl = document.getElementById('cartEmptyState');
const cartHintEl = document.getElementById('cartHint');
const cartBadgeEl = document.getElementById('cartBadge');
const cartActionsEl = document.getElementById('cartActions');
const sendEmailInfoEl = document.getElementById('sendEmailInfo');

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
            <p class="med-name" dir="auto">${escapeHtml(med.name)}</p>
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

function boxesLabel(neededBoxes) {
  return neededBoxes === 1 ? 'קופסה אחת' : `${neededBoxes} קופסאות`;
}

function orderPlanningHTML(med) {
  const months = orderMonthsByMedId[med.id] || 1;
  const { neededPills, neededBoxes } = calcOrderSuggestion(med, months);

  const optionsHTML = [1, 2, 3].map(m =>
    `<option value="${m}" ${m === months ? 'selected' : ''}>${ORDER_MONTHS_LABELS[m]}</option>`
  ).join('');

  const resultText = neededBoxes !== null
    ? `כמות להזמנה: ${boxesLabel(neededBoxes)} (כ-${neededPills} כדורים)`
    : `כמות להזמנה: כ-${neededPills} כדורים`;

  const toggleLabel = med.inOrder ? '✓ ברשימת ההזמנה — הסר' : '+ הוסף להזמנה';
  const toggleClass = med.inOrder ? 'toggle-order-btn in-order' : 'toggle-order-btn';

  return `
    <div class="order-planning">
      <label class="order-planning-label">
        להזמין מלאי ל-
        <select class="order-months-select" data-id="${med.id}">${optionsHTML}</select>
        קדימה
      </label>
      <p class="order-planning-result">${resultText}</p>
      <button class="${toggleClass}" data-action="toggle-order" data-id="${med.id}">${toggleLabel}</button>
    </div>
  `;
}

function cartItemLine(med) {
  const qtyText = med.orderSnapshotBoxes
    ? `${boxesLabel(med.orderSnapshotBoxes)} (כ-${med.orderSnapshotPills} כדורים)`
    : `כ-${med.orderSnapshotPills || 0} כדורים`;
  return `• ${med.name}${med.dose ? ' · ' + med.dose : ''} — ${qtyText}`;
}

function cartRowHTML(med) {
  const qtyText = med.orderSnapshotBoxes
    ? `${boxesLabel(med.orderSnapshotBoxes)} להזמנה (כ-${med.orderSnapshotPills} כדורים)`
    : `כ-${med.orderSnapshotPills || 0} כדורים להזמנה`;

  return `
    <div class="cart-row" data-id="${med.id}">
      <div class="cart-row-info">
        <p class="cart-row-name">${escapeHtml(med.name)}${med.dose ? ` · ${escapeHtml(med.dose)}` : ''}</p>
        <p class="cart-row-qty">${qtyText}</p>
      </div>
      <button class="cart-row-remove" data-action="toggle-order" data-id="${med.id}" aria-label="הסר מרשימת ההזמנה">✕</button>
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
    listEl.innerHTML = sorted.map(med => medCardHTML(med)).join('');
  }

  renderOrders(sorted);
  renderCart(sorted);
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

function renderCart(sortedMeds) {
  const inCart = sortedMeds.filter(med => med.inOrder);

  cartBadgeEl.textContent = inCart.length;
  cartBadgeEl.hidden = inCart.length === 0;

  if (inCart.length === 0) {
    cartListEl.innerHTML = '';
    cartEmptyStateEl.style.display = 'block';
    cartHintEl.style.display = 'none';
    cartActionsEl.style.display = 'none';
    return;
  }
  cartEmptyStateEl.style.display = 'none';
  cartHintEl.style.display = 'block';
  cartActionsEl.style.display = 'block';
  const countText = inCart.length === 1 ? 'תרופה אחת ברשימת ההזמנה' : `${inCart.length} תרופות ברשימת ההזמנה`;
  cartHintEl.textContent = `${countText} — מוכן לקחת לבית המרקחת`;
  cartListEl.innerHTML = inCart.map(cartRowHTML).join('');
  updateSendEmailInfo();
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

  const toggleBtn = e.target.closest('[data-action="toggle-order"]');
  if (toggleBtn) {
    e.stopPropagation();
    const meds = loadMeds();
    const med = meds.find(m => m.id === toggleBtn.dataset.id);
    if (med) {
      const newState = !med.inOrder;
      if (newState) {
        const months = orderMonthsByMedId[med.id] || 1;
        const { neededPills, neededBoxes } = calcOrderSuggestion(med, months);
        updateMed(med.id, { inOrder: true, orderSnapshotBoxes: neededBoxes, orderSnapshotPills: neededPills });
      } else {
        updateMed(med.id, { inOrder: false });
      }
      render();
      showToast(newState ? 'נוספה לרשימת ההזמנה' : 'הוסרה מרשימת ההזמנה');
    }
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
cartListEl.addEventListener('click', handleListClick);

function handleMonthsChange(e) {
  const select = e.target.closest('.order-months-select');
  if (!select) return;
  orderMonthsByMedId[select.dataset.id] = parseInt(select.value, 10);
  render();
}

orderListEl.addEventListener('change', handleMonthsChange);
cartListEl.addEventListener('change', handleMonthsChange);

/* ---------- tabs ---------- */

const tabDashboard = document.getElementById('tabDashboard');
const tabOrders = document.getElementById('tabOrders');
const tabCart = document.getElementById('tabCart');
const dashboardView = document.getElementById('dashboardView');
const ordersView = document.getElementById('ordersView');
const cartView = document.getElementById('cartView');

function switchTab(view) {
  dashboardView.hidden = view !== 'dashboard';
  ordersView.hidden = view !== 'orders';
  cartView.hidden = view !== 'cart';
  tabDashboard.classList.toggle('active', view === 'dashboard');
  tabOrders.classList.toggle('active', view === 'orders');
  tabCart.classList.toggle('active', view === 'cart');
}

tabDashboard.addEventListener('click', () => switchTab('dashboard'));
tabOrders.addEventListener('click', () => switchTab('orders'));
tabCart.addEventListener('click', () => switchTab('cart'));

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
    inOrder: false,
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

/* ---------- send order list by email ---------- */

const USER_EMAIL_KEY = 'supplever_user_email';

function getUserEmail() {
  return localStorage.getItem(USER_EMAIL_KEY) || '';
}

function saveUserEmail(email) {
  localStorage.setItem(USER_EMAIL_KEY, email);
}

function updateSendEmailInfo() {
  const email = getUserEmail();
  sendEmailInfoEl.innerHTML = email
    ? `הרשימה תישלח אל ${escapeHtml(email)} · <button type="button" id="changeEmailBtn">שינוי</button>`
    : '';
}

function buildOrderMailto(toEmail, cartMeds) {
  const subject = 'רשימת הזמנות תרופות — Supplever';
  const lines = cartMeds.map(cartItemLine).join('\n');
  const body = `רשימת ההזמנות שלי:\n\n${lines}\n\nנשלח מתוך Supplever`;
  return `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function sendOrderListByEmail(cartMeds) {
  if (cartMeds.length === 0) return;
  const email = getUserEmail();
  window.location.href = buildOrderMailto(email, cartMeds);
  showToast('נפתחה אפליקציית המייל');
}

function handleSendOrderClick() {
  const cartMeds = loadMeds().filter(m => m.inOrder);
  if (cartMeds.length === 0) return;
  if (getUserEmail()) {
    sendOrderListByEmail(cartMeds);
  } else {
    openEmailModal('send');
  }
}

document.getElementById('sendOrderBtn').addEventListener('click', handleSendOrderClick);
cartActionsEl.addEventListener('click', (e) => {
  if (e.target.closest('#changeEmailBtn')) openEmailModal('edit');
});

const emailOverlay = document.getElementById('emailModalOverlay');
const emailForm = document.getElementById('emailForm');
const emailInput = document.getElementById('emailInput');
const emailSubmitBtn = document.getElementById('emailSubmitBtn');
const emailModalTitleEl = document.getElementById('emailModalTitle');
let emailModalMode = 'send';

function openEmailModal(mode) {
  emailModalMode = mode;
  emailInput.value = getUserEmail();
  if (mode === 'send') {
    emailModalTitleEl.textContent = 'לאן לשלוח את הרשימה?';
    emailSubmitBtn.textContent = 'שמירה ושליחה';
  } else {
    emailModalTitleEl.textContent = 'עדכון כתובת מייל';
    emailSubmitBtn.textContent = 'שמירה';
  }
  emailOverlay.classList.add('open');
  emailInput.focus();
}

function closeEmailModal() {
  emailOverlay.classList.remove('open');
  emailForm.reset();
}

document.getElementById('emailCancelBtn').addEventListener('click', closeEmailModal);
emailOverlay.addEventListener('click', (e) => {
  if (e.target === emailOverlay) closeEmailModal();
});

emailForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (!email) return;
  saveUserEmail(email);
  const mode = emailModalMode;
  closeEmailModal();
  updateSendEmailInfo();
  if (mode === 'send') {
    sendOrderListByEmail(loadMeds().filter(m => m.inOrder));
  } else {
    showToast('כתובת המייל עודכנה');
  }
});

/* ---------- notifications ---------- */

const NOTIFY_DISMISSED_KEY = 'supplever_notify_dismissed';
const NOTIFY_REQUESTED_KEY = 'supplever_notify_requested';
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
  const alreadyRequested = localStorage.getItem(NOTIFY_REQUESTED_KEY) === 'true';
  notifyBanner.hidden = Notification.permission !== 'default' || dismissed || alreadyRequested;
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
  localStorage.setItem(NOTIFY_REQUESTED_KEY, 'true');
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
