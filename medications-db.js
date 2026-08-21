// Starter database of medication names for the "add medication" autocomplete.
// Not exhaustive — extend this list over time as needed.
// Each entry: he = Hebrew commercial name in Israel, en = English/generic name.
// Sources verified via web search (Israeli pharmacy/health sites, manufacturer sites) — Aug 2026.
//
// Entries with type: 'insulin-pen' auto-open the "box → pens → units" pack
// helper in the add/edit form, pre-filled with defaultSubUnits (pens per box)
// and defaultUnitsPerSub (dose units per pen). The defaults assume the most
// common U-100 packaging (5 pens/box, 3 mL = 300 units/pen) — some brands are
// also sold in U-200/U-300 concentrations with different numbers, which the
// user can edit in the pack helper.
const MEDICATIONS_DB = [
  // סוכרת — תרופות
  { he: 'גלוקופאז', en: 'Glucophage' },
  { he: 'גלוקומין', en: 'Metformin' },
  { he: 'ג׳רדיאנס', en: 'Jardiance' },
  { he: 'ג׳רדיאנס דואו', en: 'Jardiance Duo' },
  { he: 'פורקסיגה', en: 'Forxiga' },
  { he: 'קסיגדואו', en: 'Xigduo' },
  { he: 'טרג׳נטה דואו', en: 'Trajenta Duo' },
  { he: 'יוקריאס', en: 'Eucreas' },
  { he: 'קומביגלייז', en: 'Komboglyze' },
  { he: 'גליקסמבי', en: 'Glyxambi' },
  { he: 'לנטוס', en: 'Lantus', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'נובורפיד', en: 'NovoRapid', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'טרסיבה', en: 'Tresiba', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'הומלוג', en: 'Humalog', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },

  // סוכרת — ציוד תומך
  { he: 'רצועות בדיקת סוכר', en: 'Test Strips' },
  { he: 'מחטים לעט אינסולין', en: 'Pen Needles' },
  { he: 'לנצטים', en: 'Lancets' },
  { he: 'חיישן פריסטייל ליברה', en: 'FreeStyle Libre Sensor' },
  { he: 'חיישן דקסקום', en: 'Dexcom Sensor' },
  { he: 'מד סוכר', en: 'Glucometer' },

  // אנטיביוטיקה — כדורים ותמיסות
  { he: 'אוגמנטין', en: 'Augmentin' },
  { he: 'אמוקסיקלאב', en: 'Amoxiclav' },
  { he: 'פלאג׳יל', en: 'Flagyl' },
  { he: 'מטרוג׳יל', en: 'Metrogyl' },
  { he: 'זינט', en: 'Zinnat' },
  { he: 'רספרים', en: 'Resprim' },
  { he: 'אזניל', en: 'Azenil' },
  { he: 'ציפרודקס', en: 'Ciprodex' },
  { he: 'ציפרוקסין', en: 'Ciproxin' },

  // CF — מודולטורים ואנזימים
  { he: 'טריקפטה', en: 'Trikafta' },
  { he: 'קלידקו', en: 'Kalydeco' },
  { he: 'אורקמבי', en: 'Orkambi' },
  { he: 'סימדקו', en: 'Symdeko' },
  { he: 'קריאון', en: 'Creon' },
  { he: 'פולמוזיים', en: 'Pulmozyme' },

  // CF — ויטמינים ותמיכה תזונתית
  { he: 'דקאס פלוס', en: 'DEKAs Plus' },
  { he: 'ויטמין D', en: 'Vitamin D' },
  { he: 'ויטמין E', en: 'Vitamin E' },
  { he: 'ויטמין K', en: 'Vitamin K' },

  // מושתלי ריאה — אימונוסופרסיה
  { he: 'פרוגרף', en: 'Prograf' },
  { he: 'סלספט', en: 'CellCept' },
  { he: 'פרדניזון', en: 'Prednisone' },
  { he: 'סנדימיון', en: 'Sandimmune' },
  { he: 'ניאורל', en: 'Neoral' },
  { he: 'ולציט', en: 'Valcyte' },

  // מערכת עיכול
  { he: 'נקסיום', en: 'Nexium' },
  { he: 'אומפרדקס', en: 'Omepradex' },
  { he: 'לוסק', en: 'Losec' },
  { he: 'אומפריקס', en: 'Omeprix' },
  { he: 'לנטון', en: 'Lanton' },
  { he: 'דקסילנט', en: 'Dexilant' },
  { he: 'מוטיליום', en: 'Motilium' },
];
