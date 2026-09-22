// Service worker for Supplever.
// Handles: offline app-shell caching, and showing system notifications.
// Bump CACHE_NAME whenever app files change, so users get the fresh version.
const CACHE_NAME = 'supplever-v61';

/* תוכנית ההתראות שהדף כותב (ראו writeAlertPlan ב-app.js). מכוון שהיא לא
   נושאת מספר גרסה — היא נתוני משתמש ולא קובץ אפליקציה, ואסור שתימחק
   בכל עדכון גרסה. ראו את סינון המחיקה ב-activate למטה. */
const PLAN_CACHE = 'supplever-alert-plan';
const PLAN_URL = './alert-plan.json';

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './medications-db.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE_NAME && k !== PLAN_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const isSameOrigin = new URL(event.request.url).origin === self.location.origin;
          if (response.ok && isSameOrigin) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
    })
  );
});

/* ---------- בדיקת מלאי ברקע ----------

   Chrome מעיר אותנו מדי פעם (אם הוא מחליט לעשות זאת — ראו ההערה ב-app.js).
   כאן לא מחשבים מלאי: הדף כבר חישב לכל תרופה את תאריך ההתראה שלה, ואנחנו
   רק משווים תאריכים. כך אין עותק שני של חשבון המלאי שעלול להיפרד מהמקור. */

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

async function checkStockInBackground() {
  const cache = await caches.open(PLAN_CACHE);
  const res = await cache.match(PLAN_URL);
  if (!res) return;

  const plan = await res.json();
  const today = todayISO();

  // לכל היותר התראה אחת ביום, גם אם Chrome מעיר אותנו כמה פעמים
  if (plan.lastNotified === today) return;

  const due = (plan.meds || []).filter((m) => m.alertDate && m.alertDate <= today);
  if (due.length === 0) return;

  const title = due.length === 1
    ? `${due[0].name} — מומלץ להזמין`
    : `${due.length} תרופות דורשות הזמנה`;
  const body = due.length === 1
    ? 'פתחו את Supplever כדי להוסיף לרשימת ההזמנות'
    : due.map((m) => m.name).join(', ');

  await self.registration.showNotification(title, { body, tag: 'supplever-stock' });

  plan.lastNotified = today;
  await cache.put(PLAN_URL, new Response(JSON.stringify(plan), {
    headers: { 'Content-Type': 'application/json' },
  }));
}

self.addEventListener('periodicsync', (event) => {
  if (event.tag !== 'supplever-stock-check') return;
  event.waitUntil(checkStockInBackground());
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow('./');
    })
  );
});
