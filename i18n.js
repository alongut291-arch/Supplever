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
