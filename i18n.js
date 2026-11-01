/* ============================================================
   i18n — מחרוזות האפליקציה לפי שפה

   ⚠️ עברית היא שפת המקור ו**ברירת המחדל**. מפתח שחסר בשפה אחרת נופל
   חזרה לעברית ולא נעלם — כך ששפה שתורגמה חלקית עדיין עובדת, במקום
   להציג מפתחות גולמיים למשתמש.

   שלוש צורות לערך:
     מחרוזת פשוטה      'המלאי שלי'
     מחרוזת עם משתנה   'נשלחה לפני {days} ימים'   →  t('key', { days: 3 })
     פונקציה           (v) => v.n === 1 ? ... : ...   לריבוי/יחיד

   ⚠️ **ריבוי חייב להיות פונקציה, לא תבנית.** בעברית "יום אחד נותר" מול
   "3 ימים נותרו" מחליף גם את המילה וגם את סדר המילים, ובאנגלית הכלל שונה
   לגמרי. כל ניסיון לפתור את זה בהצמדת ס' סופית נשבר בשפה הבאה.
   ============================================================ */

/* עוזר הריבוי של רוסית: שלוש צורות לפי הספרות האחרונות (1 · 2-4 · 5+),
   כולל החריג 11-14 ששובר את הכלל, ושבר עשרוני שלוקח את צורת ה-"few".
   ⚠️ מוגדר כאן, מחוץ ל-STRINGS, כי הערכים ב-ru קוראים לו. */
const ruPlural = (n, one, few, many) => {
  const abs = Math.abs(n);
  if (!Number.isInteger(abs)) return few;
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
};

const STRINGS = {

  he: {
    /* כותרת */
    'app.tagline':        'תמיד צעד אחד לפני גמר המלאי',
    'a11y.settings':      'הגדרות',
    'a11y.language':      'שפת האפליקציה',

    /* טאבים */
    'tabs.stock':         'המלאי שלי',
    'tabs.orders':        'דורש הזמנה',
    'tabs.cart':          'רשימת ההזמנות',

    /* באנר ההתראות */
    'notify.banner':      'הפעילו התראות כדי לדעת מיד עם פתיחת האפליקציה אם יש תרופה שדורשת הזמנה',
    'notify.enable':      'הפעלת התראות',
    'notify.later':       'לא עכשיו',

    /* מסכי ריק */
    'empty.stock.title':  'עדיין לא הוספתם תרופות',
    'empty.stock.text':   'לחצו על "הוספת תרופה" כדי להתחיל לעקוב אחרי המלאי',
    'empty.orders.title': 'הכל מעודכן',
    'empty.orders.text':  'אין כרגע תרופות שדורשות הזמנה',
    'empty.cart.title':   'עדיין לא הוספתם תרופות להזמנה',
    'empty.cart.text':    'לחצו על "הוסף להזמנה" מתוך "דורש הזמנה" כדי להתחיל לרכז רשימה',

    /* הזמנות בדרך — מסך הריק של "דורש הזמנה" כשהכל כבר הוזמן */
    'orders.onTheWay.title': 'ההזמנות בדרך',
    'orders.onTheWay.text': (v) => v.n === 1
      ? 'תרופה אחת הוזמנה וממתינה ב"רשימת ההזמנות" — לעדכון המלאי כשתגיע'
      : `${v.n} תרופות הוזמנו וממתינות ב"רשימת ההזמנות" — לעדכון המלאי כשיגיעו`,

    /* ימים שנותרו */
    'days.none':          'אזל המלאי',
    'days.left': (v) => v.n === 1 ? 'יום אחד נותר' : `${v.n} ימים נותרו`,

    /* כפתורים ראשיים */
    'fab.add':            '+ הוספת תרופה',
    'footer.privacy':     'מדיניות פרטיות',

    /* ===== index.html ===== */
  /* document title */
  'app.title':                   'Supplever — המלאי שלי',

  /* section labels */
  'orders.label.pending':        'טרם נוספו לרשימת ההזמנות',
  'orders.label.added':          'כבר ברשימת ההזמנות',
  'cart.label.pending':          'טרם נשלחה הזמנה',
  'cart.label.sent':             'כבר נשלחה הזמנה',
  'cart.send':                   'שליחת רשימת ההזמנות',

  /* add / edit medicine form */
  'form.name':                   'שם התרופה',
  'form.name.placeholder':       'לדוגמה: Omeprazole',
  'form.dose':                   'מינון (אופציונלי)',
  'form.dose.placeholder':       'לדוגמה: 20 מ״ג',
  'form.pillsPerBox':            'כמות יחידות בקופסה',

  /* insulin pen helper */
  'form.pen.title':              'זוהה עט אינסולין — נחשב עבורכם את סך היחידות בקופסה',
  'form.pen.pensPerBox':         'כמות עטים בקופסה',
  'form.pen.unitsPerPen':        'כמות יחידות בכל עט',
  'form.pen.hint':               'ימלא אוטומטית את "כמות יחידות בקופסה" למטה — אפשר לתקן את המספרים אם הריכוז שונה',

  /* frequency */
  'form.freq':                   'תדירות נטילה',
  'form.freq.daily':             'כל יום',
  'form.freq.weekly':            'כמה פעמים בשבוע',
  'form.freq.cycle':             'מחזורי — תקופת נטילה והפסקה',
  'form.dailyRate':              'יחידות ביום',
  'form.weeklyRate':             'יחידות בכל נטילה',
  'form.timesPerWeek':           'פעמים בשבוע',
  'form.timesPerWeek.1':         'פעם אחת',
  'form.timesPerWeek.2':         'פעמיים',
  'form.timesPerWeek.3':         '3 פעמים',
  'form.timesPerWeek.4':         '4 פעמים',
  'form.timesPerWeek.5':         '5 פעמים',
  'form.timesPerWeek.6':         '6 פעמים',
  'form.cycle.presetMonth':      'חודש כן / חודש לא',
  'form.cycle.presetWeek':       'שבוע / שבוע',
  'form.cycleRate':              'יחידות ביום (בימי הנטילה)',
  'form.cycleOnDays':            'ימים נוטלים',
  'form.cycleOffDays':           'ימי הפסקה',
  'form.cycleStart':             'מתי התחילה תקופת הנטילה הנוכחית',
  'form.cycleStart.hint':        'בזכות התאריך הזה האפליקציה יודעת אם אתם כרגע בנטילה או בהפסקה, וסופרת ימים מדויקים',

  /* stock + alert threshold */
  'form.currentBoxes':           'מלאי קופסאות נוכחי',
  'form.currentStock':           'מלאי יחידות נוכחי',
  'form.currentStock.hint':      'מחושב אוטומטית לפי מספר הקופסאות — אפשר לתקן ידנית אם המלאי הנוכחי שונה',
  'form.alertDays':              'להתריע כמה זמן לפני שהמלאי נגמר',
  'form.alertDays.7':            'שבוע',
  'form.alertDays.14':           'שבועיים',
  'form.alertDays.21':           'שלושה שבועות',
  'form.alertDays.30':           'חודש',
  'form.alertDays.60':           'חודשיים',
  'form.alertDays.90':           'שלושה חודשים',
  'form.alertDays.hint':         'הבחירה תישמר כברירת מחדל לתרופות הבאות שתוסיפו',
  'form.delete':                 'מחיקת תרופה',

  /* stock update modal */
  'receive.title':               'עדכון מלאי',
  'receive.boxes':               'כמה קופסאות חדשות התקבלו?',
  'receive.boxes.placeholder':   'לדוגמה: 2',

  /* settings */
  'settings.title':              'הגדרות',
  'settings.email':              'כתובת המייל להזמנות',
  'settings.email.change':       'שינוי כתובת',
    'settings.email.add':          'הזנת כתובת',
  'settings.notify':             'התראות',
  'settings.notify.background':  'גם ברקע, כשאפשר',
  'settings.notify.onOpen':      'בפתיחת האפליקציה',
  'settings.notify.off':         'כבויות',
  'settings.backup':             'גיבוי ושחזור',
  'settings.backup.text':        'הנתונים נשמרים על המכשיר הזה בלבד. גיבוי מאפשר להעביר אותם למכשיר אחר, או לשחזר אחרי החלפת טלפון.',
  'settings.backup.export':      'גיבוי הנתונים לקובץ',
  'settings.backup.import':      'שחזור מקובץ גיבוי',

  /* email modal */
  'email.address':               'כתובת מייל',
  'email.hint':                  'הכתובת תישמר במכשיר הזה כדי שלא תצטרכו להזין אותה שוב',

  /* shared */
  'common.cancel':               'ביטול',
  'common.save':                 'שמירה',
  'common.close':                'סגירה',

    /* ===== app.js ===== */
  /* תדירות נטילה */
  'freq.units':                '{n} יחידות',
  'freq.onceWeekly':           'פעם בשבוע',
  'freq.timesWeekly':          '{n} פעמים בשבוע',
  'freq.cycle':                'מחזורי · {on} יום נוטלים, {off} יום הפסקה',
  'freq.daily':                '{n} ליום',
  'freq.chipTaking':           '▶ בנטילה · הפסקה מ-{date}',
  'freq.chipPause':            '⏸ בהפסקה · חוזרים לנטילה ב-{date}',

  /* סף ההתראה */
  'alert.days.7':              'שבוע',
  'alert.days.14':             'שבועיים',
  'alert.days.21':             'שלושה שבועות',
  'alert.days.30':             'חודש',
  'alert.days.60':             'חודשיים',
  'alert.days.90':             'שלושה חודשים',
  'alert.days.other': (v) => `${v.n} ימים`,
  'alert.before':              'התראה {period} לפני הסוף',

  /* כרטיס התרופה */
  'card.stockNow': (v) => `מלאי נוכחי: ${v.n} יחידות`,
  'card.approxBoxes': (v) => `(כ-${v.n} קופסאות)`,
  'card.receive':              'קיבלתי הזמנה — עדכן מלאי',
  'card.perBoxHint':           'כל קופסה = {n} יחידות',

  /* דורש הזמנה — תכנון הכמות */
  'order.months.1':            'חודש',
  'order.months.2':            'חודשיים',
  'order.months.3':            '3 חודשים',
  'order.planPrefix':          'להזמין מלאי ל-',
  'order.planSuffix':          'קדימה',
  'order.qtyWithBoxes':        'כמות להזמנה: {boxes} (כ-{pills} יחידות)',
  'order.qtyUnitsOnly':        'כמות להזמנה: כ-{pills} יחידות',
  'order.inListRemove':        '✓ ברשימת ההזמנות — הסר',
  'order.add':                 '+ הוסף להזמנה',
  'order.sentToday':           'נשלחה היום',
  'order.sentYesterday':       'נשלחה אתמול',
  'order.sentAgo':             'נשלחה לפני {days} ימים',

  /* רשימת ההזמנות */
  'cart.qtyWithBoxes':         '{boxes} להזמנה (כ-{pills} יחידות)',
  'cart.qtyUnitsOnly':         'כ-{pills} יחידות להזמנה',
  'cart.receive':              'ההזמנה הגיעה — עדכון מלאי',
  'cart.removeAria':           'הסר מרשימת ההזמנה',

  /* משותף */
  'common.ok':                 'אישור',
  'common.change':             'שינוי',
  'common.addMed':             'הוספת תרופה',
  'common.editMed':            'עריכת תרופה',
  'common.chooseDose':         'בחרו מינון...',
  'common.doseOther':          'אחר (הזנה ידנית)',
  'common.boxes': (v) => v.n === 1 ? 'קופסה אחת' : `${v.n} קופסאות`,
  'common.approxUnits': (v) => `כ-${v.n} יחידות`,

  /* בדיקת הטופס */
  'validation.name':           'יש להזין שם',
  'validation.positive':       'יש להזין מספר גדול מאפס',
  'validation.number':         'יש להזין מספר',

  /* הודעות קצרות */
  'toast.medAdded':            'התרופה נוספה בהצלחה',
  'toast.medUpdated':          'התרופה עודכנה',
  'toast.medDeleted':          'התרופה נמחקה',
  'toast.addedToOrder':        'נוספה לרשימת ההזמנה',
  'toast.removedFromOrder':    'הוסרה מרשימת ההזמנה',
  'toast.stockUpdated':        'המלאי עודכן',
  'toast.mailOpened':          'נפתח מייל אל {email}',
  'toast.emailUpdated':        'כתובת המייל עודכנה',
  'toast.notifyOn':            'התראות הופעלו',
  'toast.notifyOff':           'ההתראות כובו',
  'toast.notifyBlocked':       'ההתראות חסומות בהגדרות המכשיר',
  'toast.settingSaved':        'ההגדרה נשמרה',
  'toast.backupSaved':         'הגיבוי נשמר',
  'toast.backupFailed':        'הגיבוי נכשל',
  'toast.backupInvalid':       'הקובץ אינו קובץ גיבוי תקין',
  'toast.backupNotOurs':       'הקובץ אינו קובץ גיבוי של Supplever',
  'toast.restored': (v) => v.n === 1 ? 'שוחזרה תרופה אחת' : `שוחזרו ${v.n} תרופות`,

  /* חלונות אישור */
  'confirm.deleteMed.title':   'מחיקת תרופה',
  'confirm.deleteMed.text':    'האם למחוק תרופה זו?',
  'confirm.deleteMed.ok':      'מחיקה',
  'confirm.restore.title':     'שחזור מגיבוי',
  'confirm.restore.replace':   'הגיבוי מכיל {inBackup}. השחזור יחליף את {inApp} כעת באפליקציה, ואי אפשר לבטל אותו.',
  'confirm.restore.empty':     'לשחזר {inBackup} מהגיבוי?',
  'confirm.restore.ok':        'שחזור',

  /* גיבוי ושחזור */
  'backup.medCount': (v) => v.n === 1 ? 'תרופה אחת' : `${v.n} תרופות`,
  'backup.inApp': (v) => v.n === 1 ? 'התרופה שנמצאת' : `${v.n} התרופות שנמצאות`,

  /* התראות מערכת */
  'notification.reorderTitle': '{name} — מומלץ להזמין',
  'notification.reorderBody':  'פתחו את Supplever כדי להוסיף לרשימת ההזמנות',
  'notification.singleBody':   'מומלץ להזמין בהקדם דרך Supplever',
  'notification.multiTitle': (v) => v.n === 1 ? 'תרופה אחת דורשת הזמנה' : `${v.n} תרופות דורשות הזמנה`,
  'notification.bgNativeTitle': 'גם כשהאפליקציה סגורה',

  /* מייל ההזמנה */
  'email.subject':             'רשימת הזמנת תרופות - Supplever',
  'email.greeting':            'שלום רב,',
  'email.intro':               'רשימת ההזמנות הנוכחית שלי היא:',
  'email.signature':           'נשלח מתוך Supplever',
  'email.doseLabel':           'מינון:',
  'email.qtyLabel':            'כמות:',
  'email.willSendTo':          'הרשימה תישלח אל {email}',
  'email.sendTitle':           'לאן לשלוח את הרשימה?',
  'email.sendBtn':             'שמירה ושליחה',
  'email.editTitle':           'עדכון כתובת מייל',
  'email.editBtn':             'שמירה',
  },

  en: {
    // ⚠️ Title Case בבקשת בעל האפליקציה — לא לתקן ל-sentence case
    'app.tagline':        'Always One Step Ahead of Running Out',
    'a11y.settings':      'Settings',
    'a11y.language':      'App language',

    'tabs.stock':         'My stock',
    'tabs.orders':        'Needs reorder',
    'tabs.cart':          'Order list',

    'notify.banner':      'Turn on alerts so you know, the moment you open the app, if anything needs reordering',
    'notify.enable':      'Turn on alerts',
    'notify.later':       'Not now',

    'empty.stock.title':  'No medicines yet',
    'empty.stock.text':   'Tap "Add medicine" to start tracking your stock',
    'empty.orders.title': 'All up to date',
    'empty.orders.text':  'Nothing needs reordering right now',
    'empty.cart.title':   'Your order list is empty',
    'empty.cart.text':    'Tap "Add to order" under "Needs reorder" to start building a list',

    'orders.onTheWay.title': 'Orders on the way',
    'orders.onTheWay.text': (v) => v.n === 1
      ? 'One medicine is ordered and waiting in "Order list" — update the stock when it arrives'
      : `${v.n} medicines are ordered and waiting in "Order list" — update the stock when they arrive`,

    'days.none':          'Out of stock',
    'days.left': (v) => v.n === 1 ? '1 day left' : `${v.n} days left`,

    'fab.add':            '+ Add medicine',
    'footer.privacy':     'Privacy policy',

    /* ===== index.html ===== */
  /* document title */
  'app.title':                   'Supplever — My stock',

  /* section labels */
  'orders.label.pending':        'Not yet on the order list',
  'orders.label.added':          'Already on the order list',
  'cart.label.pending':          'Not yet ordered',
  'cart.label.sent':             'Already ordered',
  'cart.send':                   'Send order list',

  /* add / edit medicine form */
  'form.name':                   'Medicine name',
  'form.name.placeholder':       'e.g. Omeprazole',
  'form.dose':                   'Dose (optional)',
  'form.dose.placeholder':       'e.g. 20 mg',
  'form.pillsPerBox':            'Units per box',

  /* insulin pen helper */
  'form.pen.title':              "Insulin pen detected — we'll work out the total units per box",
  'form.pen.pensPerBox':         'Pens per box',
  'form.pen.unitsPerPen':        'Units per pen',
  'form.pen.hint':               'Fills in "Units per box" below automatically — edit the numbers if the strength is different',

  /* frequency */
  'form.freq':                   "How often it's taken",
  'form.freq.daily':             'Every day',
  'form.freq.weekly':            'A few times a week',
  'form.freq.cycle':             'In cycles — time on, then a break',
  'form.dailyRate':              'Units per day',
  'form.weeklyRate':             'Units each time',
  'form.timesPerWeek':           'Times a week',
  'form.timesPerWeek.1':         'Once',
  'form.timesPerWeek.2':         'Twice',
  'form.timesPerWeek.3':         '3 times',
  'form.timesPerWeek.4':         '4 times',
  'form.timesPerWeek.5':         '5 times',
  'form.timesPerWeek.6':         '6 times',
  'form.cycle.presetMonth':      'Month on / month off',
  'form.cycle.presetWeek':       'Week on / week off',
  'form.cycleRate':              'Units per day (on days taken)',
  'form.cycleOnDays':            'Days on',
  'form.cycleOffDays':           'Days off',
  'form.cycleStart':             'When the current on period started',
  'form.cycleStart.hint':        'This date is how the app knows whether you are on or off right now, so the day count stays accurate',

  /* stock + alert threshold */
  'form.currentBoxes':           'Boxes in stock',
  'form.currentStock':           'Units in stock',
  'form.currentStock.hint':      'Worked out automatically from the number of boxes — edit it if your actual stock is different',
  'form.alertDays':              'How early to alert you',
  'form.alertDays.7':            'A week',
  'form.alertDays.14':           'Two weeks',
  'form.alertDays.21':           'Three weeks',
  'form.alertDays.30':           'A month',
  'form.alertDays.60':           'Two months',
  'form.alertDays.90':           'Three months',
  'form.alertDays.hint':         'Your choice becomes the default for the next medicines you add',
  'form.delete':                 'Delete medicine',

  /* stock update modal */
  'receive.title':               'Update stock',
  'receive.boxes':               'How many new boxes arrived?',
  'receive.boxes.placeholder':   'e.g. 2',

  /* settings */
  'settings.title':              'Settings',
  'settings.email':              'Email address for orders',
  'settings.email.change':       'Change address',
    'settings.email.add':          'Add address',
  'settings.notify':             'Alerts',
  'settings.notify.background':  'In the background too, when possible',
  'settings.notify.onOpen':      'When the app opens',
  'settings.notify.off':         'Off',
  'settings.backup':             'Backup and restore',
  'settings.backup.text':        'Your data is kept on this device only. A backup lets you move it to another device, or restore it after changing phones.',
  'settings.backup.export':      'Back up data to a file',
  'settings.backup.import':      'Restore from a backup file',

  /* email modal */
  'email.address':               'Email address',
  'email.hint':                  "The address is saved on this device so you don't have to enter it again",

  /* shared */
  'common.cancel':               'Cancel',
  'common.save':                 'Save',
  'common.close':                'Close',

    /* ===== app.js ===== */
  'freq.units':                '{n} units',
  'freq.onceWeekly':           'once a week',
  'freq.timesWeekly':          '{n} times a week',
  'freq.cycle':                'cyclic · {on} days on, {off} days off',
  'freq.daily':                '{n} per day',
  'freq.chipTaking':           '▶ Taking · break from {date}',
  'freq.chipPause':            '⏸ On a break · back on {date}',

  'alert.days.7':              'a week',
  'alert.days.14':             'two weeks',
  'alert.days.21':             'three weeks',
  'alert.days.30':             'a month',
  'alert.days.60':             'two months',
  'alert.days.90':             'three months',
  'alert.days.other': (v) => v.n === 1 ? '1 day' : `${v.n} days`,
  'alert.before':              'alert {period} before it runs out',

  'card.stockNow': (v) => v.n === 1 ? 'Stock now: 1 unit' : `Stock now: ${v.n} units`,
  'card.approxBoxes': (v) => v.n === 1 ? '(about 1 box)' : `(about ${v.n} boxes)`,
  'card.receive':              'Order received — update stock',
  'card.perBoxHint':           'each box = {n} units',

  'order.months.1':            '1 month',
  'order.months.2':            '2 months',
  'order.months.3':            '3 months',
  'order.planPrefix':          'Order enough for',
  'order.planSuffix':          'ahead',
  'order.qtyWithBoxes':        'To order: {boxes} (about {pills} units)',
  'order.qtyUnitsOnly':        'To order: about {pills} units',
  'order.inListRemove':        '✓ In order list — remove',
  'order.add':                 '+ Add to order',
  'order.sentToday':           'Sent today',
  'order.sentYesterday':       'Sent yesterday',
  'order.sentAgo':             'Sent {days} days ago',

  'cart.qtyWithBoxes':         '{boxes} to order (about {pills} units)',
  'cart.qtyUnitsOnly':         'about {pills} units to order',
  'cart.receive':              'Order arrived — update stock',
  'cart.removeAria':           'Remove from order list',

  'common.ok':                 'OK',
  'common.change':             'Change',
  'common.addMed':             'Add medicine',
  'common.editMed':            'Edit medicine',
  'common.chooseDose':         'Choose a dose...',
  'common.doseOther':          'Other (type it in)',
  'common.boxes': (v) => v.n === 1 ? '1 box' : `${v.n} boxes`,
  'common.approxUnits': (v) => v.n === 1 ? 'about 1 unit' : `about ${v.n} units`,

  'validation.name':           'Enter a name',
  'validation.positive':       'Enter a number greater than zero',
  'validation.number':         'Enter a number',

  'toast.medAdded':            'Medicine added',
  'toast.medUpdated':          'Medicine updated',
  'toast.medDeleted':          'Medicine deleted',
  'toast.addedToOrder':        'Added to the order list',
  'toast.removedFromOrder':    'Removed from the order list',
  'toast.stockUpdated':        'Stock updated',
  'toast.mailOpened':          'Opened an email to {email}',
  'toast.emailUpdated':        'Email address updated',
  'toast.notifyOn':            'Alerts are on',
  'toast.notifyOff':           'Alerts are off',
  'toast.notifyBlocked':       'Alerts are blocked in your device settings',
  'toast.settingSaved':        'Setting saved',
  'toast.backupSaved':         'Backup saved',
  'toast.backupFailed':        'Backup failed',
  'toast.backupInvalid':       'That file is not a valid backup',
  'toast.backupNotOurs':       'That file is not a Supplever backup',
  'toast.restored': (v) => v.n === 1 ? '1 medicine restored' : `${v.n} medicines restored`,

  'confirm.deleteMed.title':   'Delete medicine',
  'confirm.deleteMed.text':    'Delete this medicine?',
  'confirm.deleteMed.ok':      'Delete',
  'confirm.restore.title':     'Restore from backup',
  'confirm.restore.replace':   'The backup holds {inBackup}. Restoring replaces {inApp} currently in the app, and it cannot be undone.',
  'confirm.restore.empty':     'Restore {inBackup} from the backup?',
  'confirm.restore.ok':        'Restore',

  'backup.medCount': (v) => v.n === 1 ? '1 medicine' : `${v.n} medicines`,
  'backup.inApp': (v) => v.n === 1 ? 'the medicine' : `the ${v.n} medicines`,

  'notification.reorderTitle': '{name} — time to reorder',
  'notification.reorderBody':  'Open Supplever to add it to your order list',
  'notification.singleBody':   'Reorder soon — open Supplever',
  'notification.multiTitle': (v) => v.n === 1 ? '1 medicine needs reordering' : `${v.n} medicines need reordering`,
  'notification.bgNativeTitle': 'Even when the app is closed',

  'email.subject':             'Medication order list - Supplever',
  'email.greeting':            'Hello,',
  'email.intro':               'Here is my current order list:',
  'email.signature':           'Sent from Supplever',
  'email.doseLabel':           'Dose:',
  'email.qtyLabel':            'Quantity:',
  'email.willSendTo':          'The list will be sent to {email}',
  'email.sendTitle':           'Where should the list go?',
  'email.sendBtn':             'Save and send',
  'email.editTitle':           'Update email address',
  'email.editBtn':             'Save',
  },

  /* ⚠️ ערבית — טרם עברה ביקורת של דובר שפת אם. מוסתרת מהבורר
     ב-index.html עד שתאושר. ar מחזיקה 4 פונקציות נוספות מעבר ל-11
     של he/en: בערבית צורת השם משתנה לפי המספר (יחיד · זוגי · 3-10 · 11+),
     ולכן מפתח שהוא מחרוזת עם {placeholder} בשפות האחרות חייב כאן
     הסתעפות. t() בודקת את טיפוס הערך לכל שפה בנפרד, ולכן זה תקין. */
  ar: {
  /* כותרת */
  'app.tagline':        'دائمًا خطوة قبل نفاد المخزون',
  'a11y.settings':      'الإعدادات',
  'a11y.language':      'لغة التطبيق',

  /* טאבים */
  'tabs.stock':         'مخزوني',
  'tabs.orders':        'بحاجة إلى طلب',
  'tabs.cart':          'قائمة الطلبات',

  /* באנר ההתראות */
  'notify.banner':      'شغِّلوا التنبيهات لتعرفوا فورًا عند فتح التطبيق إن كان هناك دواء بحاجة إلى طلب',
  'notify.enable':      'تشغيل التنبيهات',
  'notify.later':       'ليس الآن',

  /* מסכי ריק */
  'empty.stock.title':  'لا توجد أدوية بعد',
  'empty.stock.text':   'اضغطوا على "إضافة دواء" لتبدأوا متابعة المخزون',
  'empty.orders.title': 'كل شيء محدَّث',
  'empty.orders.text':  'لا يوجد حاليًا أي دواء بحاجة إلى طلب',
  'empty.cart.title':   'قائمة الطلبات فارغة',
  'empty.cart.text':    'اضغطوا على "إضافة إلى الطلب" في "بحاجة إلى طلب" لتبدأوا بتجميع قائمة',

  /* הזמנות בדרך
     ערבית: יחיד / מצב זוגי (دواء واحد · دواءان) / רבים 3–10 (أدوية) / 11+
     (דואר יחיד במושא: دواءً). גם הכינוי החוזר והפועל נגררים אחרי המספר:
     وصوله · وصولهما · وصولها. */
  'orders.onTheWay.title': 'الطلبات في الطريق',
  'orders.onTheWay.text': (v) => v.n === 1
    ? 'تم طلب دواء واحد وهو في انتظار الوصول في "قائمة الطلبات" — حدِّثوا المخزون عند وصوله'
    : v.n === 2
      ? 'تم طلب دواءين وهما في انتظار الوصول في "قائمة الطلبات" — حدِّثوا المخزون عند وصولهما'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `تم طلب ${v.n} أدوية وهي في انتظار الوصول في "قائمة الطلبات" — حدِّثوا المخزون عند وصولها`
        : `تم طلب ${v.n} دواءً وهي في انتظار الوصول في "قائمة الطلبات" — حدِّثوا المخزون عند وصولها`,

  /* ימים שנותרו
     הפועל بقي מתאים ליחיד ולמצב הזוגי, بقيت לרבים שאינם אנושיים (3–10),
     וחוזר ל-بقي מ-11 ומעלה כי המנוי שם חוזר ליחיד (15 يومًا). */
  'days.none':          'نفد المخزون',
  'days.left': (v) => v.n === 1
    ? 'بقي يوم واحد'
    : v.n === 2
      ? 'بقي يومان'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `بقيت ${v.n} أيام`
        : `بقي ${v.n} يومًا`,

  /* כפתורים ראשיים */
  'fab.add':            '+ إضافة دواء',
  'footer.privacy':     'سياسة الخصوصية',

  /* ===== index.html ===== */
  'app.title':                   'Supplever — مخزوني',

  /* section labels */
  'orders.label.pending':        'لم تُضف إلى قائمة الطلبات بعد',
  'orders.label.added':          'مُضافة إلى قائمة الطلبات',
  'cart.label.pending':          'لم تُطلب بعد',
  'cart.label.sent':             'تم طلبها',
  'cart.send':                   'إرسال قائمة الطلبات',

  /* add / edit medicine form
     'الدواء' للاسم. 'التركيز' ולא 'الجرعة' למינון — זה גם מדויק יותר
     (המספר שמודפס על הקופסה הוא ריכוז) וגם נקי ממשמעות של הוראת מתן. */
  'form.name':                   'اسم الدواء',
  'form.name.placeholder':       'مثال: Omeprazole',
  'form.dose':                   'التركيز (اختياري)',
  'form.dose.placeholder':       'مثال: 20 mg',
  'form.pillsPerBox':            'عدد الوحدات في العلبة',

  /* insulin pen helper */
  'form.pen.title':              'تم التعرف على قلم أنسولين — سنحسب لكم مجموع الوحدات في العلبة',
  'form.pen.pensPerBox':         'عدد الأقلام في العلبة',
  'form.pen.unitsPerPen':        'عدد الوحدات في كل قلم',
  'form.pen.hint':               'سيُملأ حقل "عدد الوحدات في العلبة" أدناه تلقائيًا — يمكنكم تعديل الأرقام إذا كان التركيز مختلفًا',

  /* frequency
     'وتيرة الاستهلاك' = קצב הצריכה. תיאור של מה שהמשתמש כבר עושה, לא הוראה. */
  'form.freq':                   'وتيرة الاستهلاك',
  'form.freq.daily':             'كل يوم',
  'form.freq.weekly':            'بضع مرات في الأسبوع',
  'form.freq.cycle':             'على شكل دورات — فترة استخدام ثم انقطاع',
  'form.dailyRate':              'وحدات في اليوم',
  'form.weeklyRate':             'وحدات في كل مرة',
  'form.timesPerWeek':           'عدد المرات في الأسبوع',
  /* אפשרויות בורר עומדות בפני עצמן, ולכן מצב זוגי בנומינטיב: مرتان */
  'form.timesPerWeek.1':         'مرة واحدة',
  'form.timesPerWeek.2':         'مرتان',
  'form.timesPerWeek.3':         '3 مرات',
  'form.timesPerWeek.4':         '4 مرات',
  'form.timesPerWeek.5':         '5 مرات',
  'form.timesPerWeek.6':         '6 مرات',
  'form.cycle.presetMonth':      'شهر استخدام / شهر انقطاع',
  'form.cycle.presetWeek':       'أسبوع / أسبوع',
  'form.cycleRate':              'وحدات في اليوم (في أيام الاستخدام)',
  'form.cycleOnDays':            'أيام الاستخدام',
  'form.cycleOffDays':           'أيام الانقطاع',
  'form.cycleStart':             'متى بدأت فترة الاستخدام الحالية',
  'form.cycleStart.hint':        'بهذا التاريخ يعرف التطبيق إن كنتم حاليًا في فترة استخدام أو انقطاع، فيبقى عدد الأيام دقيقًا',

  /* stock + alert threshold */
  'form.currentBoxes':           'عدد العلب في المخزون',
  'form.currentStock':           'عدد الوحدات في المخزون',
  'form.currentStock.hint':      'يُحسب تلقائيًا من عدد العلب — عدِّلوه إذا كان مخزونكم الفعلي مختلفًا',
  'form.alertDays':              'التنبيه المسبق قبل نفاد المخزون',
  /* אפשרויות בורר עומדות בפני עצמן → מצב זוגי בנומינטיב (أسبوعان، شهران).
     השוו ל-alert.days.* למטה, שנצרכות אחרי 'بمدة' ולכן בגניטיב. */
  'form.alertDays.7':            'أسبوع',
  'form.alertDays.14':           'أسبوعان',
  'form.alertDays.21':           'ثلاثة أسابيع',
  'form.alertDays.30':           'شهر',
  'form.alertDays.60':           'شهران',
  'form.alertDays.90':           'ثلاثة أشهر',
  'form.alertDays.hint':         'سيصبح اختياركم الإعداد الافتراضي للأدوية التي تضيفونها لاحقًا',
  'form.delete':                 'حذف الدواء',

  /* stock update modal */
  'receive.title':               'تحديث المخزون',
  'receive.boxes':               'كم علبة جديدة وصلت؟',
  'receive.boxes.placeholder':   'مثال: 2',

  /* settings */
  'settings.title':              'الإعدادات',
  'settings.email':              'عنوان البريد الإلكتروني للطلبات',
  'settings.email.change':       'تغيير العنوان',
  'settings.email.add':          'إضافة عنوان',
  'settings.notify':             'التنبيهات',
  'settings.notify.background':  'في الخلفية أيضًا، عند الإمكان',
  'settings.notify.onOpen':      'عند فتح التطبيق',
  'settings.notify.off':         'معطَّلة',
  'settings.backup':             'النسخ الاحتياطي والاستعادة',
  'settings.backup.text':        'تُحفظ بياناتكم على هذا الجهاز فقط. النسخة الاحتياطية تتيح نقلها إلى جهاز آخر، أو استعادتها بعد تغيير الهاتف.',
  'settings.backup.export':      'حفظ نسخة احتياطية في ملف',
  'settings.backup.import':      'استعادة من ملف نسخة احتياطية',

  /* email modal */
  'email.address':               'عنوان البريد الإلكتروني',
  'email.hint':                  'يُحفظ العنوان على هذا الجهاز حتى لا تضطروا إلى إدخاله مرة أخرى',

  /* shared */
  'common.cancel':               'إلغاء',
  'common.save':                 'حفظ',
  'common.close':                'إغلاق',

  /* ===== app.js ===== */
  /* ותירת הצריכה.
     ⚠️ ארבעת המפתחות שבעברית/אנגלית הם תבנית עם {placeholder} הם כאן
     פונקציות (freq.units, freq.timesWeekly, freq.cycle, order.sentAgo).
     t() בודק את הטיפוס של הערך שנשלף בפועל, לכל שפה בנפרד, ולכן שפה אחת
     יכולה להסתעף גם כשהאחרות לא. בערבית אין ברירה: '7 يوم' פשוט שגוי.

     'في كل مرة' כי המפתח הזה מוצג רק במצב השבועי, שבו המספר הוא יחידות
     לכל נטילה ולא ליום. צורה חופשית בתחילת השורה → נומינטיב (وحدتان). */
  'freq.units': (v) => v.n === 1
    ? 'وحدة واحدة في كل مرة'
    : v.n === 2
      ? 'وحدتان في كل مرة'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} وحدات في كل مرة`
        : `${v.n} وحدة في كل مرة`,
  'freq.onceWeekly':           'مرة في الأسبوع',
  /* 'מרתין' ולא 'מרתאן': זה תואר פועל (אקוזטיב), לא נושא. */
  'freq.timesWeekly': (v) => v.n === 1
    ? 'مرة واحدة في الأسبوع'
    : v.n === 2
      ? 'مرتين في الأسبوع'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} مرات في الأسبوع`
        : `${v.n} مرة في الأسبوع`,
  /* שני המספרים מסתעפים, ולכן ספירת הימים יושבת בעוזר מקומי אחד בתוך
     הפונקציה — אין דרך להגדיר עוזר מחוץ לאובייקט בקובץ הזה.
     סדר המילים התהפך מול המקור: 'استخدام 7 أيام' ולא '7 أيام استخدام',
     אחרת היחיד יוצא 'يوم واحد استخدام' — סמיכות עקומה. אחרי שם הפעולה
     المدة באקוזטיב, וזו בדיוק הצורה שהעוזר מחזיר. */
  'freq.cycle': (v) => {
    const days = (n) => n === 1
      ? 'يوم واحد'
      : n === 2
        ? 'يومين'
        : (Number.isInteger(n) && n >= 3 && n <= 10)
          ? `${n} أيام`
          : `${n} يومًا`;
    return `دورات · استخدام ${days(v.on)}، انقطاع ${days(v.off)}`;
  },
  'freq.daily':                '{n} في اليوم',
  'freq.chipTaking':           '▶ في فترة استخدام · انقطاع من {date}',
  'freq.chipPause':            '⏸ في فترة انقطاع · عودة إلى الاستخدام في {date}',

  /* סף ההתראה
     הערכים האלה נכנסים תמיד לתוך 'alert.before' אחרי 'بمدة', שדורש
     גניטיב — ולכן أسبوعين/شهرين ולא أسبوعان/شهران. */
  'alert.days.7':              'أسبوع',
  'alert.days.14':             'أسبوعين',
  'alert.days.21':             'ثلاثة أسابيع',
  'alert.days.30':             'شهر',
  'alert.days.60':             'شهرين',
  'alert.days.90':             'ثلاثة أشهر',
  'alert.days.other': (v) => v.n === 1
    ? 'يوم واحد'
    : v.n === 2
      ? 'يومين'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} أيام`
        : `${v.n} يومًا`,
  /* סדר המילים שונה מהמקור: בערבית מילת היחס נצמדת לתקופה ולכן התקופה
     עוברת לסוף המשפט. */
  'alert.before':              'تنبيه قبل النفاد بمدة {period}',

  /* כרטיס התרופה
     v.n כאן יכול להיות שבר (المخزون מעוגל לשתי ספרות, והקופסאות לאחת),
     ולכן ענף 3–10 מותנה ב-Number.isInteger: '2.5 وحدة' נכון, '2.5 وحدات' לא.
     גם 0 נופל בכוונה לענף האחרון — '0 وحدة' ולא '0 وحدات'. */
  'card.stockNow': (v) => v.n === 1
    ? 'المخزون الحالي: وحدة واحدة'
    : v.n === 2
      ? 'المخزون الحالي: وحدتان'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `المخزون الحالي: ${v.n} وحدات`
        : `المخزون الحالي: ${v.n} وحدة`,
  /* 'نحو' גורר גניטיב, ולכן המצב הזוגי הוא علبتين ולא علبتان. */
  'card.approxBoxes': (v) => v.n === 1
    ? '(نحو علبة واحدة)'
    : v.n === 2
      ? '(نحو علبتين)'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `(نحو ${v.n} علب)`
        : `(نحو ${v.n} علبة)`,
  'card.receive':              'وصل الطلب — تحديث المخزون',
  'card.perBoxHint':           'كل علبة = {n} وحدة',

  /* דורש הזמנה — תכנון הכמות
     התחילית מסתיימת ב-'لمدة' שגורר גניטיב, ולכן order.months.2 הוא شهرين.
     הסיומת 'مقدمًا' נבחרה כי היא תואר פועל שאינו נוטה — כל נטייה (قادم /
     قادمين / قادمة) הייתה משתנה לפי הבחירה בבורר ואי אפשר להתאים אותה. */
  'order.months.1':            'شهر',
  'order.months.2':            'شهرين',
  'order.months.3':            '3 أشهر',
  'order.planPrefix':          'اطلبوا مخزونًا يكفي لمدة',
  'order.planSuffix':          'مقدمًا',
  'order.qtyWithBoxes':        'الكمية المطلوبة: {boxes} (نحو {pills} وحدة)',
  'order.qtyUnitsOnly':        'الكمية المطلوبة: نحو {pills} وحدة',
  'order.inListRemove':        '✓ في قائمة الطلبات — إزالة',
  'order.add':                 '+ إضافة إلى الطلب',
  'order.sentToday':           'أُرسل اليوم',
  'order.sentYesterday':       'أُرسل أمس',
  /* 'قبل' גורר גניטיב, ולכן המצב הזוגי הוא يومين. מ-11 ומעלה המנוי חוזר
     ליחיד באקוזטיב (قبل 30 يومًا) — כך זה בכל מקרה, בלי קשר ליחסת המספר. */
  'order.sentAgo': (v) => v.days === 1
    ? 'أُرسل قبل يوم واحد'
    : v.days === 2
      ? 'أُرسل قبل يومين'
      : (Number.isInteger(v.days) && v.days >= 3 && v.days <= 10)
        ? `أُرسل قبل ${v.days} أيام`
        : `أُرسل قبل ${v.days} يومًا`,

  /* רשימת ההזמנות */
  'cart.qtyWithBoxes':         '{boxes} للطلب (نحو {pills} وحدة)',
  'cart.qtyUnitsOnly':         'نحو {pills} وحدة للطلب',
  'cart.receive':              'وصل الطلب — تحديث المخزون',
  'cart.removeAria':           'إزالة من قائمة الطلبات',

  /* משותף */
  'common.ok':                 'موافق',
  'common.change':             'تغيير',
  'common.addMed':             'إضافة دواء',
  'common.editMed':            'تعديل الدواء',
  'common.chooseDose':         'اختاروا التركيز...',
  'common.doseOther':          'آخر (إدخال يدوي)',
  /* מופיע גם לבדו (גוף המייל) וגם אחרי נקודתיים, ולכן נומינטיב: علبتان. */
  'common.boxes': (v) => v.n === 1
    ? 'علبة واحدة'
    : v.n === 2
      ? 'علبتان'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} علب`
        : `${v.n} علبة`,
  /* 'نحو' גורר גניטיב → وحدتين. */
  'common.approxUnits': (v) => v.n === 1
    ? 'نحو وحدة واحدة'
    : v.n === 2
      ? 'نحو وحدتين'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `نحو ${v.n} وحدات`
        : `نحو ${v.n} وحدة`,

  /* בדיקת הטופס */
  'validation.name':           'أدخلوا اسمًا',
  'validation.positive':       'أدخلوا رقمًا أكبر من صفر',
  'validation.number':         'أدخلوا رقمًا',

  /* הודעות קצרות */
  'toast.medAdded':            'تمت إضافة الدواء',
  'toast.medUpdated':          'تم تحديث الدواء',
  'toast.medDeleted':          'تم حذف الدواء',
  'toast.addedToOrder':        'أُضيف إلى قائمة الطلبات',
  'toast.removedFromOrder':    'أُزيل من قائمة الطلبات',
  'toast.stockUpdated':        'تم تحديث المخزون',
  'toast.mailOpened':          'تم فتح رسالة إلى {email}',
  'toast.emailUpdated':        'تم تحديث عنوان البريد الإلكتروني',
  'toast.notifyOn':            'التنبيهات مشغَّلة',
  'toast.notifyOff':           'التنبيهات معطَّلة',
  'toast.notifyBlocked':       'التنبيهات محجوبة في إعدادات الجهاز',
  'toast.settingSaved':        'تم حفظ الإعداد',
  'toast.backupSaved':         'تم حفظ النسخة الاحتياطية',
  'toast.backupFailed':        'فشل حفظ النسخة الاحتياطية',
  'toast.backupInvalid':       'هذا الملف ليس نسخة احتياطية صالحة',
  'toast.backupNotOurs':       'هذا الملف ليس نسخة احتياطية من Supplever',
  /* 'استعادة' גורר גניטיב → دواءين. */
  'toast.restored': (v) => v.n === 1
    ? 'تمت استعادة دواء واحد'
    : v.n === 2
      ? 'تمت استعادة دواءين'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `تمت استعادة ${v.n} أدوية`
        : `تمت استعادة ${v.n} دواءً`,

  /* חלונות אישור */
  'confirm.deleteMed.title':   'حذف الدواء',
  'confirm.deleteMed.text':    'هل تريدون حذف هذا الدواء؟',
  'confirm.deleteMed.ok':      'حذف',
  'confirm.restore.title':     'الاستعادة من نسخة احتياطية',
  'confirm.restore.replace':   'النسخة الاحتياطية تحتوي على {inBackup}. الاستعادة ستستبدل {inApp} حاليًا في التطبيق، ولا يمكن التراجع عنها.',
  'confirm.restore.empty':     'هل تريدون استعادة {inBackup} من النسخة الاحتياطية؟',
  'confirm.restore.ok':        'استعادة',

  /* גיבוי ושחזור
     backup.medCount נצרך תמיד אחרי 'على' או 'استعادة' (גניטיב) → دواءين.
     backup.inApp נושא את התואר בתוכו, כמו בעברית, כי התאמת 'الموجود'
     תלויה במספר; הוא מושא של 'ستستبدل' ולכן אקוזטיב (الدواءين الموجودين). */
  'backup.medCount': (v) => v.n === 1
    ? 'دواء واحد'
    : v.n === 2
      ? 'دواءين'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} أدوية`
        : `${v.n} دواءً`,
  'backup.inApp': (v) => v.n === 1
    ? 'الدواء الموجود'
    : v.n === 2
      ? 'الدواءين الموجودين'
      : `الأدوية الـ${v.n} الموجودة`,

  /* התראות מערכת */
  'notification.reorderTitle': '{name} — يُنصح بطلبه',
  'notification.reorderBody':  'افتحوا Supplever لإضافته إلى قائمة الطلبات',
  'notification.singleBody':   'يُنصح بالطلب قريبًا — افتحوا Supplever',
  /* 'بحاجة إلى طلب' הוא צירוף יחס שאינו נוטה, ולכן ההתאמה היחידה שנדרשת
     היא בשם העצם: دواء واحد / دواءان (זוגי בנומינטיב, נושא) / أدوية / دواءً. */
  'notification.multiTitle': (v) => v.n === 1
    ? 'دواء واحد بحاجة إلى طلب'
    : v.n === 2
      ? 'دواءان بحاجة إلى طلب'
      : (Number.isInteger(v.n) && v.n >= 3 && v.n <= 10)
        ? `${v.n} أدوية بحاجة إلى طلب`
        : `${v.n} دواءً بحاجة إلى طلب`,
  'notification.bgNativeTitle': 'حتى عندما يكون التطبيق مغلقًا',

  /* מייל ההזמנה */
  'email.subject':             'قائمة طلب الأدوية - Supplever',
  'email.greeting':            'تحية طيبة،',
  'email.intro':               'قائمة الطلبات الحالية لديّ هي:',
  'email.signature':           'أُرسلت من Supplever',
  'email.doseLabel':           'التركيز:',
  'email.qtyLabel':            'الكمية:',
  'email.willSendTo':          'ستُرسل القائمة إلى {email}',
  'email.sendTitle':           'إلى أين نرسل القائمة؟',
  'email.sendBtn':             'حفظ وإرسال',
  'email.editTitle':           'تحديث عنوان البريد الإلكتروني',
  'email.editBtn':             'حفظ',
  },

  /* ⚠️ רוסית — טרם עברה ביקורת של דובר שפת אם. מוסתרת מהבורר
     ב-index.html עד שתאושר. ראו ruPlural למעלה. */
  ru: {
  /* заголовок */
  'app.tagline':        'Всегда на шаг впереди — запас не кончится внезапно',
  'a11y.settings':      'Настройки',
  'a11y.language':      'Язык приложения',

  /* вкладки */
  'tabs.stock':         'Мой запас',
  'tabs.orders':        'Нужно заказать',
  'tabs.cart':          'Список заказа',

  /* баннер оповещений */
  'notify.banner':      'Включите оповещения, чтобы сразу при открытии приложения видеть, что пора заказать',
  'notify.enable':      'Включить оповещения',
  'notify.later':       'Не сейчас',

  /* пустые экраны */
  'empty.stock.title':  'Лекарств пока нет',
  'empty.stock.text':   'Нажмите «Добавить лекарство», чтобы начать следить за запасом',
  'empty.orders.title': 'Всё в порядке',
  'empty.orders.text':  'Сейчас заказывать ничего не нужно',
  'empty.cart.title':   'Список заказа пуст',
  'empty.cart.text':    'Нажмите «Добавить в заказ» в разделе «Нужно заказать», чтобы собрать список',

  /* заказы в пути */
  'orders.onTheWay.title': 'Заказы в пути',
  'orders.onTheWay.text': (v) => {
    const head = v.n === 1
      ? 'Одно лекарство'
      : `${v.n} ${ruPlural(v.n, 'лекарство', 'лекарства', 'лекарств')}`;
    const verb = ruPlural(v.n, 'заказано и ждёт', 'заказаны и ждут', 'заказаны и ждут');
    const tail = ruPlural(v.n, 'оно придёт', 'они придут', 'они придут');
    return `${head} ${verb} в «Списке заказа» — обновите запас, когда ${tail}`;
  },

  /* сколько дней осталось */
  'days.none':          'Запас закончился',
  'days.left': (v) => `${ruPlural(v.n, 'Остался', 'Осталось', 'Осталось')} ${v.n} ${ruPlural(v.n, 'день', 'дня', 'дней')}`,

  /* главные кнопки */
  'fab.add':            '+ Добавить лекарство',
  'footer.privacy':     'Политика конфиденциальности',

  /* ===== index.html ===== */
  /* document title */
  'app.title':                   'Supplever — мой запас',

  /* section labels */
  'orders.label.pending':        'Ещё не в списке заказа',
  'orders.label.added':          'Уже в списке заказа',
  'cart.label.pending':          'Заказ ещё не отправлен',
  'cart.label.sent':             'Заказ уже отправлен',
  'cart.send':                   'Отправить список заказа',

  /* add / edit medicine form */
  'form.name':                   'Название лекарства',
  'form.name.placeholder':       'например, Omeprazole',
  'form.dose':                   'Дозировка (необязательно)',
  'form.dose.placeholder':       'например, 20 mg',
  'form.pillsPerBox':            'Единиц в упаковке',

  /* insulin pen helper */
  'form.pen.title':              'Обнаружена инсулиновая ручка — посчитаем общее число единиц в упаковке',
  'form.pen.pensPerBox':         'Ручек в упаковке',
  'form.pen.unitsPerPen':        'Единиц в одной ручке',
  'form.pen.hint':               'Поле «Единиц в упаковке» ниже заполнится автоматически — измените числа, если концентрация другая',

  /* frequency */
  'form.freq':                   'Как часто принимается',
  'form.freq.daily':             'Каждый день',
  'form.freq.weekly':            'Несколько раз в неделю',
  'form.freq.cycle':             'Циклами — период приёма, затем перерыв',
  'form.dailyRate':              'Единиц в день',
  'form.weeklyRate':             'Единиц за один раз',
  'form.timesPerWeek':           'Раз в неделю',
  'form.timesPerWeek.1':         'Один раз',
  'form.timesPerWeek.2':         'Два раза',
  'form.timesPerWeek.3':         '3 раза',
  'form.timesPerWeek.4':         '4 раза',
  'form.timesPerWeek.5':         '5 раз',
  'form.timesPerWeek.6':         '6 раз',
  'form.cycle.presetMonth':      'Месяц приёма / месяц перерыва',
  'form.cycle.presetWeek':       'Неделя приёма / неделя перерыва',
  'form.cycleRate':              'Единиц в день (в дни приёма)',
  'form.cycleOnDays':            'Дней приёма',
  'form.cycleOffDays':           'Дней перерыва',
  'form.cycleStart':             'Когда начался текущий период приёма',
  'form.cycleStart.hint':        'По этой дате приложение понимает, идёт сейчас период приёма или перерыв, и считает дни точно',

  /* stock + alert threshold */
  'form.currentBoxes':           'Упаковок в запасе',
  'form.currentStock':           'Единиц в запасе',
  'form.currentStock.hint':      'Считается автоматически по числу упаковок — измените, если фактический запас другой',
  'form.alertDays':              'За сколько времени предупредить',
  'form.alertDays.7':            'Неделя',
  'form.alertDays.14':           'Две недели',
  'form.alertDays.21':           'Три недели',
  'form.alertDays.30':           'Месяц',
  'form.alertDays.60':           'Два месяца',
  'form.alertDays.90':           'Три месяца',
  'form.alertDays.hint':         'Этот выбор станет значением по умолчанию для следующих лекарств',
  'form.delete':                 'Удалить лекарство',

  /* stock update modal */
  'receive.title':               'Обновление запаса',
  'receive.boxes':               'Сколько новых упаковок получено?',
  'receive.boxes.placeholder':   'например, 2',

  /* settings */
  'settings.title':              'Настройки',
  'settings.email':              'Адрес email для заказов',
  'settings.email.change':       'Изменить адрес',
  'settings.email.add':          'Добавить адрес',
  'settings.notify':             'Оповещения',
  'settings.notify.background':  'Также в фоне, когда возможно',
  'settings.notify.onOpen':      'При открытии приложения',
  'settings.notify.off':         'Выключены',
  'settings.backup':             'Резервная копия и восстановление',
  'settings.backup.text':        'Данные хранятся только на этом устройстве. Резервная копия позволяет перенести их на другое устройство или восстановить после смены телефона.',
  'settings.backup.export':      'Сохранить копию в файл',
  'settings.backup.import':      'Восстановить из файла копии',

  /* email modal */
  'email.address':               'Адрес email',
  'email.hint':                  'Адрес сохранится на этом устройстве, чтобы не вводить его снова',

  /* shared */
  'common.cancel':               'Отмена',
  'common.save':                 'Сохранить',
  'common.close':                'Закрыть',

  /* ===== app.js ===== */
  /* как часто принимается */
  'freq.units':                '{n} ед.',
  'freq.onceWeekly':           'раз в неделю',
  'freq.timesWeekly': (v) => `${v.n} ${ruPlural(v.n, 'раз', 'раза', 'раз')} в неделю`,
  'freq.cycle':                'циклами · приём {on} дн., перерыв {off} дн.',
  'freq.daily':                '{n} ед. в день',
  'freq.chipTaking':           '▶ Приём · перерыв с {date}',
  'freq.chipPause':            '⏸ Перерыв · приём с {date}',

  /* порог оповещения — формы винительного падежа, подставляются в alert.before */
  'alert.days.7':              'неделю',
  'alert.days.14':             'две недели',
  'alert.days.21':             'три недели',
  'alert.days.30':             'месяц',
  'alert.days.60':             'два месяца',
  'alert.days.90':             'три месяца',
  'alert.days.other': (v) => `${v.n} ${ruPlural(v.n, 'день', 'дня', 'дней')}`,
  'alert.before':              'оповещение за {period} до конца запаса',

  /* карточка лекарства */
  'card.stockNow': (v) => `Запас сейчас: ${v.n} ${ruPlural(v.n, 'единица', 'единицы', 'единиц')}`,
  'card.approxBoxes': (v) => `(примерно ${v.n} ${ruPlural(v.n, 'упаковка', 'упаковки', 'упаковок')})`,
  'card.receive':              'Заказ получен — обновить запас',
  'card.perBoxHint':           'упаковка = {n} ед.',

  /* нужно заказать — планирование количества */
  'order.months.1':            '1 месяц',
  'order.months.2':            '2 месяца',
  'order.months.3':            '3 месяца',
  'order.planPrefix':          'Заказать запас на',
  'order.planSuffix':          'вперёд',
  'order.qtyWithBoxes':        'К заказу: {boxes} (примерно {pills} ед.)',
  'order.qtyUnitsOnly':        'К заказу: примерно {pills} ед.',
  'order.inListRemove':        '✓ В списке заказа — убрать',
  'order.add':                 '+ Добавить в заказ',
  'order.sentToday':           'Отправлено сегодня',
  'order.sentYesterday':       'Отправлено вчера',
  'order.sentAgo':             'Отправлено {days} дн. назад',

  /* список заказа */
  'cart.qtyWithBoxes':         '{boxes} к заказу (примерно {pills} ед.)',
  'cart.qtyUnitsOnly':         'примерно {pills} ед. к заказу',
  'cart.receive':              'Заказ пришёл — обновить запас',
  'cart.removeAria':           'Убрать из списка заказа',

  /* общее */
  'common.ok':                 'ОК',
  'common.change':             'Изменить',
  'common.addMed':             'Добавить лекарство',
  'common.editMed':            'Изменить лекарство',
  'common.chooseDose':         'Выберите дозировку...',
  'common.doseOther':          'Другая (ввести вручную)',
  'common.boxes': (v) => `${v.n} ${ruPlural(v.n, 'упаковка', 'упаковки', 'упаковок')}`,
  'common.approxUnits': (v) => `примерно ${v.n} ${ruPlural(v.n, 'единица', 'единицы', 'единиц')}`,

  /* проверка формы */
  'validation.name':           'Введите название',
  'validation.positive':       'Введите число больше нуля',
  'validation.number':         'Введите число',

  /* короткие сообщения */
  'toast.medAdded':            'Лекарство добавлено',
  'toast.medUpdated':          'Лекарство обновлено',
  'toast.medDeleted':          'Лекарство удалено',
  'toast.addedToOrder':        'Добавлено в список заказа',
  'toast.removedFromOrder':    'Убрано из списка заказа',
  'toast.stockUpdated':        'Запас обновлён',
  'toast.mailOpened':          'Открыто письмо на {email}',
  'toast.emailUpdated':        'Адрес email обновлён',
  'toast.notifyOn':            'Оповещения включены',
  'toast.notifyOff':           'Оповещения выключены',
  'toast.notifyBlocked':       'Оповещения заблокированы в настройках устройства',
  'toast.settingSaved':        'Настройка сохранена',
  'toast.backupSaved':         'Резервная копия сохранена',
  'toast.backupFailed':        'Не удалось сохранить копию',
  'toast.backupInvalid':       'Это не корректный файл резервной копии',
  'toast.backupNotOurs':       'Это не файл резервной копии Supplever',
  'toast.restored': (v) => `Восстановлено ${v.n} ${ruPlural(v.n, 'лекарство', 'лекарства', 'лекарств')}`,

  /* окна подтверждения */
  'confirm.deleteMed.title':   'Удаление лекарства',
  'confirm.deleteMed.text':    'Удалить это лекарство?',
  'confirm.deleteMed.ok':      'Удалить',
  'confirm.restore.title':     'Восстановление из копии',
  'confirm.restore.replace':   'В резервной копии {inBackup}. Восстановление заменит {inApp} в приложении, и отменить это нельзя.',
  'confirm.restore.empty':     'Восстановить {inBackup} из резервной копии?',
  'confirm.restore.ok':        'Восстановить',

  /* резервная копия и восстановление */
  'backup.medCount': (v) => `${v.n} ${ruPlural(v.n, 'лекарство', 'лекарства', 'лекарств')}`,
  'backup.inApp': (v) => v.n === 1
    ? 'лекарство'
    : `${v.n} ${ruPlural(v.n, 'лекарство', 'лекарства', 'лекарств')}`,

  /* системные оповещения */
  'notification.reorderTitle': '{name} — пора заказать',
  'notification.reorderBody':  'Откройте Supplever, чтобы добавить в список заказа',
  'notification.singleBody':   'Стоит заказать в ближайшее время — откройте Supplever',
  'notification.multiTitle': (v) => `Нужно заказать ${v.n} ${ruPlural(v.n, 'лекарство', 'лекарства', 'лекарств')}`,
  'notification.bgNativeTitle': 'Даже когда приложение закрыто',

  /* письмо с заказом */
  'email.subject':             'Список заказа лекарств - Supplever',
  'email.greeting':            'Здравствуйте,',
  'email.intro':               'Вот мой текущий список заказа:',
  'email.signature':           'Отправлено из Supplever',
  'email.doseLabel':           'Дозировка:',
  'email.qtyLabel':            'Количество:',
  'email.willSendTo':          'Список будет отправлен на {email}',
  'email.sendTitle':           'Куда отправить список?',
  'email.sendBtn':             'Сохранить и отправить',
  'email.editTitle':           'Изменение адреса email',
  'email.editBtn':             'Сохранить',
  },
};

/* ---------- השליפה ---------- */

function activeLang() {
  const lang = document.documentElement.lang;
  return STRINGS[lang] ? lang : 'he';
}

function t(key, vars) {
  const table = STRINGS[activeLang()];
  // נפילה חזרה לעברית: מפתח שטרם תורגם מוצג בעברית ולא כמפתח גולמי
  const value = (key in table) ? table[key] : STRINGS.he[key];
  if (value === undefined) return key;
  if (typeof value === 'function') return value(vars || {});
  if (!vars) return value;
  return Object.keys(vars).reduce(
    (s, k) => s.split('{' + k + '}').join(vars[k]), value);
}

/* ---------- טקסט סטטי ב-HTML ----------

   כל אלמנט עם data-i18n מקבל את הטקסט שלו מכאן. ⚠️ `textContent` מוחק
   ילדים, ולכן אלמנט שמכיל גם טקסט וגם תגית (כמו כפתור טאב עם באדג')
   חייב לשאת את הסימון על <span> פנימי ולא על הכפתור עצמו. */

function applyStaticStrings(root) {
  const scope = root || document;
  scope.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  scope.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  scope.querySelectorAll('[data-i18n-aria]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
}

/* ---------- יחידות מינון ----------

   במאגר התרופות 443 רשומות מחזיקות מינון בעברית ('500 מ״ג'), ואין לשכפל
   אותן לשפה שנייה — הקובץ באחריות סוכן ה-pharmacist, ושכפול הוא תחזוקה
   כפולה לנצח. לכן ההמרה נעשית **בזמן תצוגה בלבד**, והמאגר לא משתנה. */

const DOSE_UNITS_FROM_HE = [
  [/מק״ג/g, 'mcg'], [/מ״ג/g, 'mg'], [/מ״ל/g, 'ml'],
  [/יב״ל/g, 'IU'],  [/יח׳/g, 'units'], [/גרם/g, 'g'],
];

function localizeDose(text) {
  if (!text || activeLang() === 'he') return text;
  return DOSE_UNITS_FROM_HE.reduce((s, [re, to]) => s.replace(re, to), text);
}
