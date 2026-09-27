/*
  בונה מחדש את החלק האוטומטי של medications-db.js מתוך מאגר התרופות של משרד
  הבריאות (israeldrugs.health.gov.il).

    node .claude/build-medications-db.js            כותב את הקובץ
    node .claude/build-medications-db.js --dry-run  מדפיס סטטיסטיקה בלבד

  ⚠️  הקובץ מחליף רק את מה שמופיע אחרי שורת הסימון GENERATED_MARKER. כל מה
      שמעליה נכתב ואומת ביד ואינו נגזר מהמאגר — אין לגעת בו מכאן.

  ⚠️  הסקריפט מוריד 531 עמודים מהמאגר (כ-6MB). המאגר לפעמים במצב תחזוקה: אז
      דף הבית מחזיר קובץ זעיר וה-API מחזיר 502, ואין ברירה אלא לחזור מאוחר יותר.
      זו גם הסיבה שהרשימה מוטמעת בקובץ ולא נשלפת בזמן ריצה — ראו CLAUDE.md.

  למה הנתונים נלקחים מהשם הרשום ולא מרכיבי התרופה: ראו ההערות אצל strength()
  ואצל componentUnits() למטה. שתיהן מתעדות באג אמיתי שנתפס בבנייה הזו.
*/

'use strict';

const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'medications-db.js');
const GENERATED_MARKER = '  /* ===== מכאן ולמטה: נוצר אוטומטית — אין לערוך ביד ===== */';
const TARGET_TOTAL = 500;

/* מותגים שהדירוג לפי הנתונים מפספס, כי במאגר אין שום שדה שאומר כמה מטופלים
   מכירים שם. קונקור מדורג 49 בתחום הלב מפני שהרישומים שלו אינם מסומנים בסל
   הבריאות ויש לו רק ארבעה רישומים — ובכל זאת זה שם שמקלידים. מי שמגלה עוד שם
   חסר מוסיף אותו כאן; הבדיקה היא לפי השם האנגלי הרשום במאגר.
   ⚠️  שם שאינו קיים במאגר פשוט יתעלם — הרשימה הזאת אינה יוצרת תרופות. */
const ALWAYS_INCLUDE = ['CONCOR'];
const API = 'https://israeldrugs.health.gov.il/GovServiceList/IDRServer/SearchByName';

/* ------------------------------------------------------------------ הורדה */

async function fetchPage(pageIndex, attempt = 0) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ val: '', prescription: false, healthServices: false, pageIndex, orderBy: 0 }),
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (!data || !Array.isArray(data.results)) throw new Error('unexpected response shape');
    return data.results;
  } catch (err) {
    if (attempt < 4) {
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
      return fetchPage(pageIndex, attempt + 1);
    }
    throw new Error('page ' + pageIndex + ' failed: ' + err.message);
  }
}

/* val ריק מחזיר את כל המאגר, 10 רשומות לעמוד, וכל רשומה נושאת את מספר העמודים
   הכולל בשדה pages. */
async function fetchRegistry() {
  const first = await fetchPage(1);
  if (!first.length) throw new Error('registry returned nothing — probably under maintenance');
  const pages = first[0].pages;
  const all = [...first];
  const queue = [];
  for (let i = 2; i <= pages; i++) queue.push(i);

  const CONCURRENCY = 5;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) all.push(...await fetchPage(queue.shift()));
  }));
  process.stderr.write('הורדו ' + all.length + ' רשומות מ-' + pages + ' עמודים\n');
  return all;
}

/* ------------------------------------------------------- סינון לפי אופן מתן */

const HOME = new Set(['פומי', 'תת-עורי', 'תת-עורי עמוק', 'שאיפה', 'שאיפה באמצעות נבולייזר (מערפל)', 'עיני', 'אוזני', 'אפי', 'תוך-אפי', 'עורי', 'חיצוני', 'בין-עורי', 'רקטלי', 'וגינלי', 'תוך-וגינלי', 'מתחת ללשון', 'פנים הלחי', 'פומי בחלל הפה', 'בחלל הפה', 'פומי מקומי', 'ציפורן', 'קרקפת - חיצוני', 'אנאלי חיצוני', 'מתחת לחך', 'למעי', 'רירי']);
const ORAL = new Set(['פומי', 'מתחת ללשון', 'פנים הלחי', 'פומי בחלל הפה', 'בחלל הפה', 'למעי']);
/* אחוזים הם מינון אמיתי במשחה ובטיפות, אבל על טבליה או על עט הם משהו אחר
   באותו סימון: "HUMALOG MIX 25" הוא יחס תערובת ו-"TEGRETOL SYRUP 2%" ריכוז. */
const TOPICAL = new Set(['חיצוני', 'עורי', 'קרקפת - חיצוני', 'ציפורן', 'וגינלי', 'תוך-וגינלי', 'אנאלי חיצוני', 'רירי', 'עיני', 'אוזני', 'אפי', 'תוך-אפי', 'פומי מקומי', 'רקטלי']);

const routes = (r) => (r.route || '').split(',').map((s) => s.trim());
/* אופן המתן העיקרי הוא הראשון ברשימה. תרופה שהראשון שלה הוא עירוי או הזרקה
   לשריר ניתנת במרפאה ולא נספרת בארון במטבח — ונקומיצין רשום "תוך-ורידי, פומי"
   ובליאומיצין מונה שישה אופני מתן קליניים לפני "תת-עורי". */
const isHomePrimary = (r) => HOME.has(routes(r)[0] || '');
const isOral = (r) => routes(r).some((t) => ORAL.has(t));
const allowsPercent = (r) => TOPICAL.has(routes(r)[0] || '');
const isVet = (r) => /ווטרינר|וטרינר/.test(r.dragHebName);

/* ----------------------------------------------- חילוץ שם הבסיס מהשם הרשום */

/* רק תיאורי צורת מתן. סיומות שמזהות את המוצר עצמו — FORTE, XR, CR, SR, DUO,
   PLUS, COMP, RETARD, EMULGEL — נשמרות בכוונה: וולטרן אמולג׳ל ווולטרן טבליות
   הם שני מוצרים שמחזיקים במלאי בנפרד, ו-"אפקסור XR" הוא מה שכתוב על הקופסה. */
const EN_FORM = [
  'POWDER FOR ORAL SUSPENSION', 'POWDER FOR ORAL SOLUTION', 'POWDER FOR SUSPENSION',
  'POWDER FOR SOLUTION', 'POWDER FOR ORAL DROPS', 'POWDER AND SOLVENT',
  'DISPERSIBLE/CHEWABLE', 'CHEWABLE/DISPERSIBLE',
  'AQUEOUS NASAL SPRAY', 'NASAL SPRAY', 'NASAL DROPS',
  'SLOW RELEASE', 'PROLONGED RELEASE', 'EXTENDED RELEASE', 'MODIFIED RELEASE',
  'CONTROLLED RELEASE', 'SUSTAINED RELEASE', 'DELAYED RELEASE',
  'FILM COATED TABLETS', 'FILM-COATED TABLETS', 'COATED TABLETS', 'SUGAR COATED TABLETS',
  'CHEWABLE TABLETS', 'DISPERSIBLE TABLETS', 'ORODISPERSIBLE TABLETS',
  'EFFERVESCENT TABLETS', 'SUBLINGUAL TABLETS', 'VAGINAL TABLETS',
  'TABLETS', 'TABLET', 'HARD CAPSULES', 'SOFT CAPSULES', 'GELATIN CAPSULES',
  'LIQUID GEL CAPS', 'GEL CAPS', 'CAPSULES', 'CAPSULE', 'CAPLETS', 'CAPLET',
  'ORAL SOLUTION', 'ORAL SUSPENSION', 'ORAL DROPS', 'SOLUTION FOR INHALATION',
  'SOLUTION', 'SUSPENSION', 'SYRUP', 'ELIXIR', 'EMULSION',
  'EYE DROPS', 'EAR DROPS', 'DROPS', 'EYE OINTMENT', 'OINTMENT', 'CREAM',
  'LOTION', 'FOAM', 'SHAMPOO', 'POWDER', 'GRANULES', 'SACHETS', 'SACHET',
  'PATCHES', 'PATCH', 'TRANSDERMAL SYSTEM', 'METERED DOSE INHALER', 'INHALER',
  'INHALATION', 'SPRAY', 'SUPPOSITORIES', 'SUPPOSITORY', 'ENEMA',
  'PESSARIES', 'PESSARY', 'FOR INJECTION', 'INJECTIONS', 'INJECTION',
  'PREFILLED SYRINGE', 'PREFILLED PEN', 'VIALS', 'VIAL', 'AMPOULES', 'AMPOULE',
];

const HE_FORM = [
  'אבקה להכנת תרחיף לשתיה', 'אבקה להכנת תמיסה לשתייה', 'אבקה להכנת תמיסה לשתיה',
  'אבקה להכנת תרחיף', 'אבקה להכנת תמיסה', 'אבקה וממס',
  'תמיסה לשאיפה', 'תמיסה לאינהלציה', 'תמיסה לשתייה', 'תמיסה לשתיה',
  'תרחיף לשתייה', 'תרחיף לשתיה', 'תרסיס מימי לאף', 'תרסיס לאף', 'תרסיס אף',
  'כמוסות ליקוויד ג׳ל', 'טבליות מסיסות/לעיסה', 'טבליות לעיסה/מסיסות',
  'גרנולות בשיחרור איטי', 'בשיחרור ממושך', 'בשיחרור איטי', 'בשיחרור נרחב',
  'טבליות מצופות פילם', 'טבליות מצופות סוכר', 'טבליות מצופות',
  'טבליות בשחרור ממושך', 'טבליות עם שחרור נרחב', 'טבליות בשחרור נרחב',
  'טבליות בשחרור מושהה', 'טבליות בשחרור מבוקר', 'טבליות בשחרור איטי',
  'טבליות לעיסות', 'טבליות נימוחות', 'טבליות מסיסות', 'טבליות תת-לשוניות',
  'טבליות נרתיקיות', 'בשחרור ממושך', 'בשחרור איטי', 'בשחרור נרחב',
  'בשחרור מושהה', 'בשחרור מבוקר',
  'טבליות', 'טבליה', 'קפסולות קשיחות', 'קפסולות רכות', 'קפסולות ג׳לטין',
  'קפסולות', 'קפסולה קשיחה', 'קפסולה', 'קפליות', 'קפלית', 'כמוסות', 'כמוסה',
  'תמיסה', 'תרחיף', 'סירופ', 'טיפות עיניים', 'טיפות אוזניים', 'טיפות אף',
  'טיפות', 'משחת עיניים', 'משחה', 'קרם', 'תחליב', 'קצף', 'שמפו', 'ג׳ל',
  'אבקה', 'גרנולות', 'שקיקים', 'שקיק', 'מדבקה', 'מדבקות', 'אינהלר', 'משאף',
  'ספריי', 'תרסיס', 'תרכיז', 'פתילות', 'פתילה', 'חוקן', 'זריקות', 'זריקה',
  'להזרקה', 'מזרק', 'מזרקים', 'אמפולות', 'אמפולה', 'בקבוקון',
  'מ״ג', 'מ"ג', 'מק״ג', 'מק"ג', 'מ״ל', 'מ"ל', 'גרם', 'יח׳', "יח'", 'אחוז', '%',
];

const EN_UNIT_TAIL = ['MG', 'MCG', 'ML', 'GR', 'GRAM', 'GRAMS', 'IU', 'UNITS', '%'];
const UNIT_WORD = /^(MG|MCG|ML|GR|GRAM|GRAMS|G|IU|I\.U\.?|UNITS?|%|מ״ג|מ"ג|מק״ג|מק"ג|מ״ל|מ"ל|גרם|יח׳|יח'|אחוז)/i;

/* שמות רשומים נושאים ® ו-™ באמצע המחרוזת, ולפעמים מדביקים את המינון לשם
   ("ORILISSA150 MG"). מנקים לפני כל פענוח. */
const clean = (s) => s
  .replace(/[®™©]/g, ' ')
  .replace(/([A-Za-z֐-׿])(\d[\d.\/]*)(?=\s*(MG|MCG|ML|GR|GRAM|IU|I\.U|%|מ״ג|מ"ג|מק״ג|מק"ג|מ״ל|מ"ל|גרם|יח)\b)/gi, '$1 $2')
  .replace(/\s+/g, ' ').trim();

/* המאגר רושם כל מינון כרישום נפרד, עם המינון מודבק לשם ("קונקור 5 מ״ג"). חיתוך
   באסימון הראשון שמתחיל בספרה מאחד אותם חזרה למוצר אחד. */
function splitAtStrength(name) {
  const toks = name.trim().split(/\s+/);
  let cut = toks.length;
  for (let i = 1; i < toks.length; i++) {
    if (!/^\d/.test(toks[i])) continue;
    /* מספר קטן ובודד שאחריו מספר נוסף הוא חלק מהשם ולא המינון: "אלפא די 3
       0.25 מק״ג" הוא Alpha D3 במינון 0.25, וחיתוך ב-3 היה הופך אותו ל"אלפא די". */
    const bare = /^\d{1,2}$/.test(toks[i]);
    const next = toks[i + 1];
    if (bare && next && /^\d/.test(next) && !UNIT_WORD.test(next)) continue;
    cut = i; break;
  }
  return { base: toks.slice(0, cut).join(' '), tail: toks.slice(cut).join(' ') };
}

/* מילת צורה נגרעת רק כשהיא עומדת כמילה שלמה. ב-JavaScript האות העברית אינה
   תו-מילה, ולכן \b לא עוזר כאן והגבול נכתב במפורש כ"אחרי רווח" — בלעדיו
   "אמולג׳ל" מאבד את "ג׳ל" וחוזר כ"אמול". */
function stripForms(name, forms) {
  let s = name.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const f of forms) {
      const re = new RegExp('\\s+' + f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$', 'i');
      if (re.test(s)) {
        const next = s.replace(re, '').trim();
        if (next.length > 1) { s = next; changed = true; }
      }
    }
    const trimmed = s.replace(/[\s,\-–־]+$/, '').trim();
    if (trimmed !== s && trimmed.length > 1) { s = trimmed; changed = true; }
  }
  return s;
}

const baseEn = (r) => stripForms(splitAtStrength(clean(r.dragEnName)).base, EN_FORM.concat(EN_UNIT_TAIL));
const baseHe = (r) => stripForms(splitAtStrength(clean(r.dragHebName)).base, HE_FORM);

/* ------------------------------------------------------------ מינון ויחידה */

/* היחידות נכתבות כמו בשאר האפליקציה — גרשיים עבריים (U+05F4) ולא מרכאות ASCII. */
const UNIT_HE = {
  MG: 'מ״ג', MCG: 'מק״ג', ML: 'מ״ל', G: 'גרם', L: 'ליטר',
  'MG/ML': 'מ״ג/מ״ל', 'MCG/ML': 'מק״ג/מ״ל', 'MG/G': 'מ״ג/גרם', 'MG/VIAL': 'מ״ג',
  'MCG/DOSE': 'מק״ג/מנה', 'MG/DOSE': 'מ״ג/מנה', IU: 'יח׳', 'IU/ML': 'יח׳/מ״ל',
  'IU/VIAL': 'יח׳', '%': '%',
};
const heUnit = (u) => UNIT_HE[u] || null;

/* "I.U" עם נקודות מופיע במאגר לצד "IU" רגיל ("BINOCRIT 2000 I.U/ 1 ML"); בלעדיו
   ה-2000 מאבד את היחידה שלו ויורש בשקט את ה-ML של הנפח שבא אחריו. */
const UNIT_RE = 'MCG\\/DOSE|MG\\/DOSE|MG\\/ML|MCG\\/ML|MG\\/G|I\\.?U\\.?\\/ML|MG\\/VIAL|I\\.?U\\.?\\/VIAL|MCG|MG|ML|GRAMS|GRAM|GR|I\\.U\\.?|IU|G|L|%W\\/W|%W\\/V|%';

const canonUnit = (u) => {
  const t = u.toUpperCase().replace(/\./g, '').replace(/%W\/[WV]/, '%');
  if (t === 'GRAM' || t === 'GRAMS' || t === 'GR') return 'G';
  if (t === 'IUML') return 'IU/ML';
  if (t === 'IUVIAL') return 'IU/VIAL';
  return t;
};

/* "2.00 מ״ג" הוא אותו מינון כמו "2 מ״ג" ונקרא גרוע יותר ברשימה נפתחת. */
const trimNum = (n) => {
  const s = String(n).replace(/\.$/, '');
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s;
};

function parseStrengthText(text) {
  if (!text) return null;
  const re = new RegExp('(\\d[\\d.]*(?:\\s*\\/\\s*\\d[\\d.]*)*)\\s*(' + UNIT_RE + ')?(?![A-Z0-9])', 'gi');
  const pairs = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const nums = m[1].split('/').map((n) => trimNum(n.trim())).filter(Boolean);
    const unit = m[2] ? canonUnit(m[2]) : null;
    nums.forEach((n) => pairs.push({ n, unit }));
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  return pairs.length ? pairs : null;
}

function renderPairs(pairs, fallbackUnit) {
  const named = pairs.filter((p) => p.unit);
  const units = new Set(named.map((p) => p.unit));

  /* יחידה אחת לכל המינון, בין שנכתבה פעם אחת ובין שחזרה: גם "50/500 MG" וגם
     "2.5 MG/12.5 MG" הם שני מספרים שחולקים יחידה. זה תקף רק כשכל המספרים
     מכוסים — כשלחלקם יש יחידה ולחלקם לא, הם מודדים דברים שונים, אחרת
     "2000 I.U / 1 ML" מתכנס לשטות "2000/1 מ״ל". */
  if (units.size <= 1 && (named.length === pairs.length || named.length === 0)) {
    const u = heUnit(units.size === 1 ? [...units][0] : fallbackUnit);
    return u ? pairs.map((p) => p.n).join('/') + ' ' + u : null;
  }
  const out = pairs.map((p) => {
    const u = heUnit(p.unit || fallbackUnit);
    return u ? p.n + ' ' + u : null;
  });
  return out.every(Boolean) ? out.join('/') : null;
}

/* היחידה של מספר עירום בשם היא היחידה של המינון הראשון ברכיב, לא האחרון.
   "ERELZI 25" הוא 25 מ״ג, והרכיב שלו כתוב "ETANERCEPT 25 MG / 0.5 ML" —
   קריאת סוף המחרוזת הפכה אותו ל-25 מ״ל. */
function componentUnits(r) {
  const us = (r.activeComponents || []).map((c) => {
    const m = c.componentName.replace(/\([^)]*\)/g, ' ')
      .match(new RegExp('([\\d.]+)\\s*(' + UNIT_RE + ')(?![A-Z0-9])', 'i'));
    return m ? canonUnit(m[2]) : null;
  });
  return us.length && us.every(Boolean) && new Set(us).size === 1 ? us[0] : null;
}

/* עדיף המינון שמודפס בשם הרשום: זה מה שהמטופל קורא על הקופסה, ובתרופה משולבת
   זה גם המקור היחיד שאפשר לסמוך עליו — activeComponents חוזר בסדר שונה מרישום
   לרישום (ג׳ארדיאנס דואו מונה מטפורמין ראשון ברשומה אחת ואמפגליפלוזין באחרת),
   כך שמינון שנבנה לפי סדר הרכיבים היה מתהפך בשקט. תרופה משולבת שאין מינון בשמה
   נשארת בלי מינון בכלל, ולא עם ניחוש. */
function strength(r) {
  const tail = stripForms(splitAtStrength(clean(r.dragEnName)).tail, EN_FORM);
  const fromName = parseStrengthText(tail);
  if (fromName) return renderPairs(fromName, componentUnits(r));

  const comps = r.activeComponents || [];
  if (comps.length !== 1) return null;
  /* שם החומר עצמו יכול לכלול ספרות בסוגריים — "PTH (1-34) 0.3 MG/ML" הוא מינון
     אחד ולא שלושה. */
  const cleanComp = comps[0].componentName.replace(/\([^)]*\)/g, ' ')
    .replace(/^[A-Z\s,\-\.\/]+/i, '').trim();
  const pairs = parseStrengthText(cleanComp);
  return pairs ? renderPairs(pairs, null) : null;
}

/* ------------------------------------------------------- התאמה לרשימה הידנית */

/* תעתיקים עבריים של מותגים לועזיים חולקים על הגרש ועל אהו״י: המאגר כותב
   "ג'ארדיאנס" ו"אבאמיס" במקום שהרשימה הידנית כותבת "ג׳רדיאנס" ו"אבמיס".
   השמטת האותיות האלה מיישרת את הזוגות. זה עשוי לאחד יותר מדי בתיאוריה;
   התוצאה היחידה כאן היא שרשומה כמעט-כפולה לא תיווסף. */
const stripPunct = (s) => s.replace(/[׳״'"״׳`\-–.,()\[\]]/g, '');
const foldHe = (s) => stripPunct(s).replace(/\s+/g, ' ').trim();
const foldHeLoose = (s) => foldHe(s).replace(/[אהוי]/g, '').replace(/\s+/g, '');
const foldEn = (s) => s.toUpperCase().replace(/[^A-Z0-9]/g, '');

/* ------------------------------------------------------------ תחומי טיפול */

const BUCKETS = [
  ['לב, לחץ דם וקרישה', ['hypertension', 'blood pressure', 'heart failure', 'angina', 'myocardial infarction', 'atrial fibrillation', 'arrhythmi', 'coronary', 'anticoagul', 'thromboembol', 'venous thrombo', 'platelet aggregation', 'stroke', 'cardiovascular']],
  ['כולסטרול ושומני הדם', ['cholesterol', 'hyperlipid', 'dyslipid', 'triglycerid', 'lipoprotein', 'hypercholesterol']],
  ['סוכרת', ['diabetes', 'mellitus', 'glycaemic control', 'glycemic control', 'hypoglyc', 'insulin']],
  ['בלוטת התריס ובלוטת יותרת התריס', ['hypothyroid', 'thyroid', 'thyrotox', 'goitre', 'goiter', 'parathyroid']],
  ['דרכי הנשימה ואלרגיה', ['asthma', 'chronic obstructive', 'copd', 'bronchospasm', 'bronchodil', 'rhinitis', 'emphysema', 'allergic']],
  ['מערכת העצבים', ['epilep', 'seizure', 'parkinson', 'alzheimer', 'dementia', 'migraine', 'neuropathic', 'multiple sclerosis', 'restless legs']],
  ['בריאות הנפש', ['depress', 'anxiety', 'bipolar', 'schizophren', 'psychotic', 'psychosis', 'insomnia', 'attention deficit', 'obsessive']],
  ['מערכת העיכול', ['reflux', 'oesophageal', 'esophageal', 'peptic ulcer', 'duodenal ulcer', 'crohn', 'ulcerative colitis', 'irritable bowel', 'constipation', 'pancreatic insufficiency']],
  ['פרקים, חיסון ודלקת', ['rheumatoid', 'psoriasis', 'psoriatic', 'ankylosing', 'arthritis', 'lupus', 'gout', 'hyperuricaem', 'hyperuricem', 'immunosuppress', 'transplant', 'colitis']],
  ['עצמות', ['osteoporosis', 'bone mineral density', 'paget']],
  ['כליות, שלפוחית וערמונית', ['benign prostatic', 'overactive bladder', 'chronic kidney', 'renal failure', 'hyperphosphat', 'anaemia', 'anemia']],
  ['עיניים', ['glaucoma', 'intraocular pressure', 'macular', 'dry eye']],
  ['הורמונים', ['contracept', 'hormone replacement', 'menopaus', 'testosterone', 'oestrogen', 'estrogen', 'growth hormone', 'acromegal', 'endometriosis']],
  ['זיהומים כרוניים', ['hiv', 'hepatitis b', 'hepatitis c', 'tuberculosis']],
  ['אונקולוגיה והמטולוגיה', ['cancer', 'carcinoma', 'leukaemia', 'leukemia', 'lymphoma', 'myeloma', 'myelofibrosis', 'melanoma', 'sarcoma', 'neoplas', 'metastatic', 'tumour', 'tumor', 'chemotherap', 'neutropenia']],
];

/* נבחר התחום עם מספר ההתאמות הגדול ביותר, ולא הראשון שמתאים. התאמה-ראשונה
   שלחה את טגרטול לסוכרת מפני שההתוויות מזכירות "diabetes insipidus" פעם אחת.
   בתיקו מנצח התחום שמוזכר ראשון: טקסט ההתוויות נפתח בשימוש העיקרי, וטגרטול
   נפתח ב-"Epilepsy, trigeminal neuralgia, diabetes insipidus" — אחת לכל אחד,
   ורק הסדר מלמד למה התרופה נועדה בעיקר. */
function bucketOf(text) {
  const t = (text || '').toLowerCase();
  let best = null, bestHits = 0, bestAt = Infinity;
  for (const [name, words] of BUCKETS) {
    let hits = 0, at = Infinity;
    for (const w of words) {
      const n = t.split(w).length - 1;
      if (!n) continue;
      hits += n;
      at = Math.min(at, t.indexOf(w));
    }
    if (hits > bestHits || (hits === bestHits && hits > 0 && at < bestAt)) {
      best = name; bestHits = hits; bestAt = at;
    }
  }
  return best;
}

/* --------------------------------------------------- קריאת הרשימה הידנית */

function readCuratedEntries(src) {
  const entries = [];
  const re = /\{\s*he:\s*'([^']*)'\s*,\s*en:\s*'([^']*)'([^}]*)\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const rest = m[3];
    const am = rest.match(/aliases:\s*\[([^\]]*)\]/);
    entries.push({
      he: m[1],
      en: m[2],
      aliases: am ? am[1].split(',').map((s) => s.trim().replace(/^'|'$/g, '')).filter(Boolean) : [],
    });
  }
  return entries;
}

/* ------------------------------------------------------------------ פלט */

const KEEP_UPPER = new Set(['XR', 'XL', 'CR', 'SR', 'ER', 'MR', 'LA', 'SL', 'ODT', 'CD', 'MD', 'HP', 'DS', 'EC', 'IV', 'HCT', 'B12', 'D3', 'T3', 'T4', 'HFA', 'MDI', 'IU', 'CFC', 'SPF']);
const titleCase = (s) => s.split(' ').map((w) => w.split('-').map((p) => {
  if (KEEP_UPPER.has(p.toUpperCase())) return p.toUpperCase();
  if (/^\d/.test(p)) return p;
  return p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
}).join('-')).join(' ');

/* הקובץ כתוב במרכאות בודדות. בשמות עבריים הגרש והגרשיים מומרים לתווים
   העבריים (U+05F3/U+05F4) כמו בשאר הקובץ; בשמות לועזיים אין ברירה אלא לברוח
   מהגרש. */
const heLiteral = (s) => s.replace(/'/g, '׳').replace(/"/g, '״');
const enLiteral = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function emit(chosen) {
  const byBucket = new Map();
  chosen.forEach((c) => {
    if (!byBucket.has(c.bucket)) byBucket.set(c.bucket, []);
    byBucket.get(c.bucket).push(c);
  });
  const lines = [];
  for (const [bucket] of BUCKETS) {
    const list = byBucket.get(bucket);
    if (!list || !list.length) continue;
    list.sort((a, b) => a.he.localeCompare(b.he, 'he'));
    lines.push('');
    lines.push('  // ' + bucket);
    list.forEach((c) => {
      const doses = c.doses.map((d) => "'" + heLiteral(d) + "'").join(', ');
      lines.push("  { he: '" + heLiteral(c.he) + "', en: '" + enLiteral(c.en) + "', doses: [" + doses + '] },');
    });
  }
  return lines.join('\n');
}

/* ------------------------------------------------------------------ ראשי */

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const src = fs.readFileSync(DB_FILE, 'utf8');
  const markerAt = src.indexOf(GENERATED_MARKER);
  if (markerAt === -1) throw new Error('שורת הסימון לא נמצאה ב-medications-db.js');
  const curatedPart = src.slice(0, markerAt);
  const curated = readCuratedEntries(curatedPart);
  process.stderr.write('רשומות ידניות: ' + curated.length + '\n');

  const registry = await fetchRegistry();

  /* קיבוץ לפי השם האנגלי — הוא המפתח היציב, כי התעתיק העברי משתנה בין רישומים
     של אותו מוצר. */
  const groups = new Map();
  registry.forEach((r) => {
    if (r.iscanceled || isVet(r) || !isHomePrimary(r)) return;
    const en = baseEn(r), he = baseHe(r);
    if (!en || !he || en.length < 2 || he.length < 2) return;
    const key = foldEn(en);
    if (!key) return;
    if (!groups.has(key)) groups.set(key, { en, heNames: [], records: [] });
    groups.get(key).heNames.push(he);
    groups.get(key).records.push(r);
  });

  /* השם העברי להצגה: התעתיק הקצר ביותר שנראה בקבוצה. לרוב לאחד הרישומים של
     מוצר יש את שם המותג החשוף, והארוכים רק מוסיפים את צורת המתן. */
  const pickHe = (names) => {
    const count = new Map();
    names.forEach((n) => count.set(n, (count.get(n) || 0) + 1));
    return [...count.entries()].sort((a, b) =>
      a[0].length - b[0].length || b[1] - a[1] || a[0].localeCompare(b[0], 'he'))[0][0];
  };

  /* מיון המינונים כמו שרשימה נפתחת צריכה להיקרא: לפי יחידה, ואז לפי גודל.
     מיון לפי המספר בלבד שם "1 מ״ג" בין "1 גרם" ל-"1.5 גרם". */
  const doseValue = (d) => parseFloat(String(d).replace(/[^\d.].*$/, '')) || 0;
  const doseUnit = (d) => String(d).replace(/^[\d.\/\s]+/, '');

  const candidates = [];
  groups.forEach((g) => {
    const doses = [...new Set(g.records
      .map((r) => { const s = strength(r); return (s && s.includes('%') && !allowsPercent(r)) ? null : s; })
      .filter(Boolean))]
      .sort((a, b) => doseUnit(a).localeCompare(doseUnit(b), 'he') || doseValue(a) - doseValue(b));
    const inBasket = g.records.some((r) => r.health);
    const bucket = bucketOf(g.records.map((r) => r.indications || '').join(' '));
    let score = (bucket ? 10 : 0) + (inBasket ? 3 : 0) + (g.records.some(isOral) ? 2 : 0);
    score += Math.min(doses.length, 6) + Math.min(g.records.length, 4) * 0.5;

    /* החומר הפעיל, כדי לא לבזבז את התקציב על אותה מולקולה מכמה יצרנים. */
    const ingredient = [...new Set(g.records
      .map((r) => (r.activeComponentsCompareName || '').toUpperCase().trim())
      .filter(Boolean))].sort().join(' + ');

    /* שם גנרי הוא שם החומר ועוד שם היצרן ("פרגבלין טבע"); שם מותג הוא שם בזכות
       עצמו ("קונקור"). מטופל מקליד את שם המותג לא פחות מאת שם החומר, ולכן
       המותגים קודמים — אחרת "קונקור" נדחק מהמכסה בידי שלושה ריברוקסבנים. */
    const firstWord = g.en.split(/[\s\-]/)[0].toUpperCase();
    const genericStyle = firstWord.length >= 5 &&
      ingredient.replace(/[^A-Z]/g, '').startsWith(firstWord.replace(/[^A-Z]/g, ''));

    candidates.push({
      he: pickHe(g.heNames), en: titleCase(g.en), doses, bucket, inBasket, score,
      n: g.records.length, ingredient, genericStyle,
    });
  });

  const haveEn = new Set(curated.map((e) => foldEn(e.en)));
  const haveHe = new Set();
  curated.forEach((e) => [e.he, ...e.aliases].forEach((n) => haveHe.add(foldHeLoose(n))));

  /* שני רישומים יכולים להצטמצם לאותו שם עברי — טגרטול וטגרטול CR מותירים
     שניהם "טגרטול", כי רישום אחד משמיט את ה-CR בעברית. שתי שורות שנראות זהות
     בהשלמה האוטומטית גרועות מאחת, ולכן המדורגת גבוה מנצחת. */
  const seenHe = new Set();
  const uniq = [];
  candidates
    .filter((c) => !haveEn.has(foldEn(c.en)) && !haveHe.has(foldHeLoose(c.he)))
    .sort((a, b) => b.score - a.score)
    .forEach((c) => {
      const k = foldHeLoose(c.he);
      if (seenHe.has(k)) return;
      seenHe.add(k);
      uniq.push(c);
    });

  /* כל שורה חדשה חייבת לשאת מינון אחד לפחות — זה מה שנדרש, ושם עם רשימה ריקה
     אינו טוב יותר מהקלדה ידנית. */
  const pool = uniq.filter((c) => c.bucket && c.doses.length);
  const need = TARGET_TOTAL - curated.length;

  /* חלוקה לפי ניקוד בלבד מוסרת את כל התקציב לתחום שרושם את מספר המינונים
     הגדול ביותר — אונקולוגיה לקחה 50 מתוך 288 בעוד אסתמה קיבלה 8, וזאת כשמחכים
     112 מוצרי נשימה. לכן לכל תחום מכסה משלו, לפי שורש מספר המועמדים שלו: השורש
     משאיר תחום גדול לפני תחום קטן בלי לדחוק אותו לגמרי. בתוך תחום, הנפוצים
     קודם — מקום בסל הבריאות, ואז מספר הרישומים המתחרים, שזה מה שנראה כמו
     גנרי מבוסס בנתונים האלה. */
  const perBucket = new Map();
  pool.forEach((c) => {
    if (!perBucket.has(c.bucket)) perBucket.set(c.bucket, []);
    perBucket.get(c.bucket).push(c);
  });
  perBucket.forEach((list) => list.sort((a, b) =>
    (a.genericStyle - b.genericStyle) || (b.inBasket - a.inBasket) || (b.n - a.n) ||
    (b.doses.length - a.doses.length) || a.he.localeCompare(b.he, 'he')));

  /* לכל חומר פעיל לכל היותר שתי רשומות חדשות. בלי התקרה הזאת הרשימה בזבזה שלוש
     שורות על פרגבלין משלושה יצרנים, שלוש על קווטיאפין ושלוש על ריברוקסבן — ובאותו
     זמן "קונקור" לא נכנס בכלל. */
  const MAX_PER_INGREDIENT = 2;
  const perIngredient = new Map();
  perBucket.forEach((list, name) => {
    perBucket.set(name, list.filter((c) => {
      if (!c.ingredient) return true;
      const seen = perIngredient.get(c.ingredient) || 0;
      if (seen >= MAX_PER_INGREDIENT) return false;
      perIngredient.set(c.ingredient, seen + 1);
      return true;
    }));
  });

  const weights = new Map([...perBucket].map(([n, l]) => [n, Math.sqrt(l.length)]));
  const weightSum = [...weights.values()].reduce((a, b) => a + b, 0);
  const quota = new Map([...weights].map(([n, w]) => [n, Math.round((need * w) / weightSum)]));

  /* הרשימה המפורשת נכנסת ראשונה ותופסת מקום מהתקציב, לפני שהמכסות מחלקות את
     השאר. מסומנת כנבחרת בתחום שלה כדי שלא תיבחר פעמיים. */
  const chosen = [];
  const forced = new Set();
  ALWAYS_INCLUDE.forEach((name) => {
    const c = pool.find((x) => foldEn(x.en) === foldEn(name));
    if (!c || forced.has(c.en)) return;
    forced.add(c.en);
    chosen.push(c);
  });
  perBucket.forEach((list, name) =>
    perBucket.set(name, list.filter((c) => !forced.has(c.en))));

  const cursor = new Map([...perBucket.keys()].map((k) => [k, 0]));
  let progress = true;
  while (chosen.length < need && progress) {
    progress = false;
    for (const [name, list] of perBucket) {
      if (chosen.length >= need) break;
      const i = cursor.get(name);
      if (i >= list.length) continue;
      const roomLeftElsewhere = [...cursor].some(([n2, i2]) =>
        i2 < Math.min(quota.get(n2), perBucket.get(n2).length));
      if (i >= quota.get(name) && roomLeftElsewhere) continue;
      chosen.push(list[i]);
      cursor.set(name, i + 1);
      progress = true;
    }
  }

  process.stderr.write('מועמדים: ' + candidates.length + ' · חדשים אפשריים: ' + pool.length + '\n');
  process.stderr.write('ידניות ' + curated.length + ' + חדשות ' + chosen.length + ' = ' + (curated.length + chosen.length) + '\n');

  if (dryRun) {
    [...perBucket.keys()].forEach((b) => {
      const n = chosen.filter((c) => c.bucket === b).length;
      if (n) process.stderr.write(String(n).padStart(5) + ' ' + b + '\n');
    });
    /* --trace=שם מסביר למה מוצר מסוים נבחר או לא: איפה הוא בדירוג התחום שלו,
       מה המכסה, והאם תקרת החומר הפעיל הוציאה אותו. */
    const traceArg = process.argv.find((a) => a.startsWith('--trace='));
    if (traceArg) {
      const q = traceArg.slice('--trace='.length).toLowerCase();
      const hit = candidates.filter((c) => c.he.includes(q) || c.en.toLowerCase().includes(q));
      if (!hit.length) process.stderr.write('\n--trace: אין מועמד בשם הזה\n');
      hit.forEach((c) => {
        const list = perBucket.get(c.bucket) || [];
        const rank = list.findIndex((x) => x.en === c.en);
        process.stderr.write('\n--trace ' + c.he + ' / ' + c.en + '\n');
        process.stderr.write('   תחום: ' + c.bucket + ' · מכסה: ' + quota.get(c.bucket) +
          ' · דירוג בתחום: ' + (rank === -1 ? 'הוסר בתקרת החומר הפעיל' : rank + 1) + '\n');
        process.stderr.write('   חומר פעיל: ' + c.ingredient + ' · שם גנרי: ' + c.genericStyle +
          ' · בסל: ' + c.inBasket + ' · רישומים: ' + c.n + '\n');
        process.stderr.write('   נבחר: ' + chosen.some((x) => x.en === c.en) + '\n');
      });
    }
    return;
  }

  const header = [
    GENERATED_MARKER,
    '  /* ' + chosen.length + ' רשומות שנגזרו ממאגר התרופות של משרד הבריאות',
    '     (' + new Date().toISOString().slice(0, 10) + ', גרסת מאגר ' + (registry[0].dbVersiob || '?') + ').',
    '     להרצה מחדש: node .claude/build-medications-db.js',
    '     נכללו רק רישומים פעילים, לא ווטרינריים, שאופן המתן העיקרי שלהם נעשה',
    '     בבית — ולכל אחת יש לפחות מינון אחד. */',
  ].join('\n');

  fs.writeFileSync(DB_FILE, curatedPart + header + '\n' + emit(chosen) + '\n];\n', 'utf8');
  process.stderr.write('נכתב ' + DB_FILE + '\n');
}

main().catch((err) => { process.stderr.write('שגיאה: ' + err.message + '\n'); process.exit(1); });
