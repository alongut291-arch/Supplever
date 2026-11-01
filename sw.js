// Service worker for Supplever.
// Handles: offline app-shell caching, and showing system notifications.
// Bump CACHE_NAME whenever app files change, so users get the fresh version.
const CACHE_NAME = 'supplever-v80';

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
  './i18n.js',
  './medications-db.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

/* ⚠️ `cache: 'reload'` — ובלעדיו העדכון יכול להיכשל בשקט.

   `cache.addAll(APP_SHELL)` רגיל עובר דרך **מטמון ה-HTTP של הדפדפן**, ו-GitHub
   Pages מגיש את הקבצים עם `max-age=600`. כלומר ה-Service Worker החדש עלול למלא
   את המטמון החדש שלו ב**קבצים הישנים** שיושבים שם — וזה קרה בפועל בנובמבר 2026:
   `supplever-v79` נבנה והכיל `index.html` ו-`i18n.js` מלפני השינוי. המשתמש ראה
   בורר שפות חדש עם ערבית, אבל המילון שנטען היה הישן, ולכן לחיצה על ערבית נפלה
   חזרה לעברית **בלי שום שגיאה** — וערבית היא RTL כמו עברית, אז גם הכיוון לא
   השתנה, ונראה כאילו הכפתור שבור.

   `cache: 'reload'` מכריח כל קובץ בקליפה להגיע מהרשת. **העלאת CACHE_NAME לבדה
   אינה מספיקה**, וזו המסקנה החשובה כאן.

   ⚠️ **וכל קובץ חדש של האפליקציה חייב להיכנס ל-APP_SHELL.** `i18n.js` לא היה שם,
   ולכן נשמר רק דרך ה-fetch האופורטוניסטי למטה — שהוא cache-first, כלומר העותק
   הישן שלו היה מוגש לנצח. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(
        APP_SHELL.map((url) => new Request(url, { cache: 'reload' }))
      ))
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

  /* עמוד ההורדה (get/) הוא היעד של קוד ה-QR, ובעתיד הוא יעביר לחנות.
     אם נשמור אותו במטמון, מי שכבר ביקר בו ימשיך לראות את הגרסה הישנה.
     לכן הוא תמיד מגיע מהרשת. */
  if (new URL(event.request.url).pathname.includes('/get/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          const url = new URL(event.request.url);
          const isSameOrigin = url.origin === self.location.origin;
          /* כתובת עם סימן שאלה היא כמעט תמיד עקיפת מטמון חד-פעמית
             (`index.html?cb=...`). שמירתה מצמיחה במטמון עותקים כפולים של אותו
             קובץ, שאיש לא יגיש אבל גם לא ינקה. */
          if (response.ok && isSameOrigin && !url.search) {
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

/* ⚠️ טקסט ההתראה משוכפל כאן בכוונה, ואין לאחד אותו עם i18n.js.

   ה-Service Worker **לא יכול לקרוא localStorage**, ולכן אין לו דרך לדעת
   באיזו שפה המשתמש בחר. הוא מקבל אותה דרך `plan.lang` — אותה תוכנית
   שה-writeAlertPlan ב-app.js כותב ל-Cache Storage, בדיוק כמו התאריכים.

   ו-`importScripts('i18n.js')` לא יעבוד: הקובץ ההוא ניגש ל-document, שלא
   קיים כאן. שני ביטויים, מחיר סביר — אבל **שפה שמתווספת ל-i18n.js חייבת
   להתווסף גם כאן**, אחרת ההתראות ברקע יישארו בעברית בלי שום שגיאה. */
const NOTIFY_STRINGS = {
  he: {
    titleOne: (name) => `${name} — מומלץ להזמין`,
    titleMany: (n) => `${n} תרופות דורשות הזמנה`,
    bodyOne: 'פתחו את Supplever כדי להוסיף לרשימת ההזמנות',
  },
  en: {
    titleOne: (name) => `${name} — time to reorder`,
    titleMany: (n) => `${n} medicines need reordering`,
    bodyOne: 'Open Supplever to add it to your order list',
  },
  /* ⚠️ `titleMany` מסתעף כאן לפי אותם כללי ריבוי שב-i18n.js, ובערבית
     וברוסית הם אינם "יחיד מול רבים". אם משנים שם את הנוסח — לשנות גם כאן;
     אין שום מנגנון שיתפוס פער בין השניים. */
  ar: {
    titleOne: (name) => `${name} — يُنصح بطلبه`,
    // יחיד · זוגי · 3-10 · 11+
    titleMany: (n) => n === 2 ? 'دواءان بحاجة إلى طلب'
      : (Number.isInteger(n) && n >= 3 && n <= 10)
        ? `${n} أدوية بحاجة إلى طلب`
        : `${n} دواءً بحاجة إلى طلب`,
    bodyOne: 'افتحوا Supplever لإضافته إلى قائمة الطلبات',
  },
  ru: {
    titleOne: (name) => `${name} — пора заказать`,
    // 1 · 2-4 · 5+, כולל החריג 11-14
    titleMany: (n) => {
      const d10 = n % 10, d100 = n % 100;
      const word = (d10 === 1 && d100 !== 11) ? 'лекарство'
        : (d10 >= 2 && d10 <= 4 && (d100 < 12 || d100 > 14)) ? 'лекарства'
        : 'лекарств';
      return `Нужно заказать ${n} ${word}`;
    },
    bodyOne: 'Откройте Supplever, чтобы добавить в список заказов',
  },
};

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

  const s = NOTIFY_STRINGS[plan.lang] || NOTIFY_STRINGS.he;
  const title = due.length === 1 ? s.titleOne(due[0].name) : s.titleMany(due.length);
  const body = due.length === 1 ? s.bodyOne : due.map((m) => m.name).join(', ');

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
