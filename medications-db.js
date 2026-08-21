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
//
// Entries with a doses: [...] array turn the "מינון" field into a dropdown of
// that medication's known strengths (e.g. ['0.5 מ״ג', '1 מ״ג', '5 מ״ג']) —
// the free-text field still works normally for anything not listed. Only
// added where a strength was confirmed by an actual source (see comments per
// item below) — medications without a doses array simply keep the free-text
// field, rather than guessing a plausible-looking list.
const MEDICATIONS_DB = [
  // סוכרת — תרופות
  // גלוקופאז' (Glucophage) — לפי בדיקה, הופסק משיווק בישראל (Clalit: "הופסק
  // השיווק") והוחלף בפועל ע"י גלוקומין ומטפורמין-טבע — לכן בכוונה בלי doses,
  // כדי לא להציג מינונים כאילו המוצר עדיין נמכר
  { he: 'גלוקופאז', en: 'Glucophage' },
  { he: 'גלוקומין', en: 'Metformin', doses: ['500 מ״ג', '850 מ״ג', '1000 מ״ג'] },
  { he: 'ג׳רדיאנס', en: 'Jardiance', doses: ['10 מ״ג', '25 מ״ג'] },
  { he: 'ג׳רדיאנס דואו', en: 'Jardiance Duo', doses: ['5/850 מ״ג', '5/1000 מ״ג', '12.5/850 מ״ג', '12.5/1000 מ״ג'] },
  { he: 'פורקסיגה', en: 'Forxiga', doses: ['5 מ״ג', '10 מ״ג'] },
  { he: 'קסיגדואו', en: 'Xigduo', doses: ['5/500 מ״ג', '5/1000 מ״ג', '10/500 מ״ג', '10/1000 מ״ג'] },
  { he: 'טרג׳נטה דואו', en: 'Trajenta Duo', doses: ['2.5/500 מ״ג', '2.5/850 מ״ג', '2.5/1000 מ״ג'] },
  { he: 'יוקריאס', en: 'Eucreas', doses: ['50/850 מ״ג', '50/1000 מ״ג'] },
  // קומביגלייז — לא נמצא מקור ישראלי שמאשר שהמוצר בכלל משווק בארץ, לכן בלי doses
  { he: 'קומביגלייז', en: 'Komboglyze' },
  { he: 'גליקסמבי', en: 'Glyxambi', doses: ['10/5 מ״ג', '25/5 מ״ג'] },
  { he: 'לנטוס', en: 'Lantus', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'נובורפיד', en: 'NovoRapid', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'טרסיבה', en: 'Tresiba', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'הומלוג', en: 'Humalog', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'ליומג׳ב', en: 'Lyumjev', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'לבמיר', en: 'Levemir', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'פיאספ', en: 'Fiasp', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'אפידרה', en: 'Apidra', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  // טוג׳או הוא ריכוז U-300 (300 יח' למ"ל) — אריזה שונה: 3 עטים בקופסה, 450 יח' לעט
  { he: 'טוג׳או', en: 'Toujeo', type: 'insulin-pen', defaultSubUnits: 3, defaultUnitsPerSub: 450 },
  { he: 'נובומיקס 30', en: 'Novomix 30', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'נובומיקס 50', en: 'Novomix 50', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'נובומיקס 70', en: 'Novomix 70', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'הומלוג מיקס 25', en: 'Humalog Mix 25', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'הומלוג מיקס 50', en: 'Humalog Mix 50', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  // האינסולינים הבאים נפוצים גם בבקבוקון (עם מזרק) ולא רק בעט, ותרכובות
  // האינסולין+GLP-1 מוגדרות ב"צעדי מינון" שאינם זהים ליחידות אינסולין רגילות —
  // לכן לא סימנתי אותן כ-type: 'insulin-pen' כדי לא להציע חישוב שגוי
  { he: 'אקטרפיד', en: 'Actrapid' },
  { he: 'הומולין אר', en: 'Humulin R' },
  { he: 'הומולין אן', en: 'Humulin N' },
  { he: 'אינסולטרד', en: 'Insulatard' },
  { he: 'זולטופיי', en: 'Xultophy' },
  { he: 'סוליקווה', en: 'Suliqua' },
  // GLP-1 — זריקות/כדורים שבועיים או יומיים, לא "יחידות אינסולין" ולכן ללא ברירת מחדל אוטומטית
  // אוזמפיק: במקורות ישראליים מופיעות רק 0.25/0.5/1 מ"ג (לא 2 מ"ג כמו בחו"ל)
  { he: 'אוזמפיק', en: 'Ozempic', doses: ['0.25 מ״ג', '0.5 מ״ג', '1 מ״ג'] },
  { he: 'ריבלסוס', en: 'Rybelsus', doses: ['3 מ״ג', '7 מ״ג', '14 מ״ג'] },
  { he: 'ויקטוזה', en: 'Victoza', doses: ['0.6 מ״ג', '1.2 מ״ג', '1.8 מ״ג'] },
  { he: 'טרוליסיטי', en: 'Trulicity', doses: ['0.75 מ״ג', '1.5 מ״ג', '3 מ״ג', '4.5 מ״ג'] },
  { he: 'מונג׳רו', en: 'Mounjaro', doses: ['2.5 מ״ג', '5 מ״ג', '7.5 מ״ג', '10 מ״ג', '12.5 מ״ג', '15 מ״ג'] },

  // סוכרת — ציוד תומך
  { he: 'רצועות בדיקת סוכר', en: 'Test Strips' },
  { he: 'מחטים לעט אינסולין', en: 'Pen Needles' },
  { he: 'לנצטים', en: 'Lancets' },
  { he: 'חיישן פריסטייל ליברה', en: 'FreeStyle Libre Sensor' },
  { he: 'חיישן דקסקום', en: 'Dexcom Sensor' },
  { he: 'מד סוכר', en: 'Glucometer' },

  // אנטיביוטיקה — כדורים ותמיסות
  // אוגמנטין קיים גם כתמיסה לילדים (250 מ"ג/5 מ"ל, 400 מ"ג/5 מ"ל) — כאן מוצגות רק עוצמות הטבליות
  { he: 'אוגמנטין', en: 'Augmentin', doses: ['250 מ״ג', '500 מ״ג', '875 מ״ג'] },
  { he: 'אמוקסיקלאב', en: 'Amoxiclav', doses: ['250 מ״ג', '875 מ״ג'] },
  // פלאג'יל: 250 מ"ג הוא הריכוז המאושר בטבליות דרך הפה (יש גם תמיסה/נרות בריכוזים אחרים)
  { he: 'פלאג׳יל', en: 'Flagyl', doses: ['250 מ״ג'] },
  // מטרוג'יל — לא אותר כמותג נפרד ורשום בישראל (מטרונידזול נמכר כאן בעיקר כפלאג'יל), בלי doses
  { he: 'מטרוג׳יל', en: 'Metrogyl' },
  { he: 'זינט', en: 'Zinnat', doses: ['125 מ״ג', '250 מ״ג', '500 מ״ג'] },
  { he: 'רספרים', en: 'Resprim', doses: ['400/80 מ״ג', '800/160 מ״ג (Forte)'] },
  // אזניל: נמצאה הודעת השהיית שיווק זמנית (פברואר 2024) — כדאי לוודא זמינות בפועל מול בית מרקחת
  { he: 'אזניל', en: 'Azenil', doses: ['250 מ״ג'] },
  // ציפרודקס בישראל הוא כדורי ציפרופלוקסצין דרך הפה — לא טיפות אוזניים כמו בארה"ב
  { he: 'ציפרודקס', en: 'Ciprodex', doses: ['250 מ״ג', '500 מ״ג', '750 מ״ג'] },
  // ציפרוקסין — לא אותר כמותג נפרד עם עוצמות משלו בישראל, בלי doses
  { he: 'ציפרוקסין', en: 'Ciproxin' },
  { he: 'דוקסילין', en: 'Doxylin', doses: ['100 מ״ג'] },

  // CF — מודולטורים, אנזימים ואנטיביוטיקה בשאיפה
  // הערה: אורקמבי וסימדקו הוחלפו בישראל בדגמים חדשים יותר (טריקפטה/אליפטראק)
  // לפי איגוד סיסטיק פיברוזיס בישראל — נשארו ברשימה למי שעדיין רשום עליהם
  // טריקפטה/אליפטראק/סימדקו: מינון קבוע רב-טבליתי (למשל בוקר+ערב, טבליות שונות
  // זו מזו) ולא בחירה פשוטה של "עוצמה אחת" — בכוונה בלי doses כדי לא לפשט יתר על המידה
  { he: 'טריקפטה', en: 'Trikafta' },
  { he: 'אליפטראק', en: 'Alyftrek' },
  // קלידקו: 150 מ"ג היא עוצמת הטבליה למבוגרים; לתינוקות/ילדים יש גם אבקת שקיקים
  // בעוצמות שלא הצלחתי לאמת בוודאות עבור ישראל ספציפית, אז לא נכללו
  { he: 'קלידקו', en: 'Kalydeco', doses: ['150 מ״ג'] },
  { he: 'אורקמבי', en: 'Orkambi', doses: ['100/125 מ״ג', '200/125 מ״ג'] },
  { he: 'סימדקו', en: 'Symdeko' },
  { he: 'קריאון', en: 'Creon', doses: ['10,000 יח׳ ליפאז', '25,000 יח׳ ליפאז'] },
  { he: 'פולמוזיים', en: 'Pulmozyme', doses: ['2.5 מ״ג (אמפולה יחידה)'] },
  // טובי קיימת בשתי צורות שונות: תמיסה לאינהלציה (אמפולות) וקפסולות אבקה
  // ("פודהלר") — שני מוצרים נפרדים עם אריזה שונה, מאומתים גם דרך עלון
  // ישראלי (pharmaline.co.il) וגם דרך איגוד סיסטיק פיברוזיס בישראל
  { he: 'טובי (תמיסה לאינהלציה)', en: 'TOBI Solution', doses: ['300 מ״ג (אמפולה יחידה)'] },
  { he: 'טובי פודהלר', en: 'TOBI Podhaler', doses: ['28 מ״ג (כמוסה יחידה, 4 כמוסות למנה)'] },
  // קולירצין (קוליסטין) — אנטיביוטיקה בשאיפה/הזרקה לזיהומי פסאודומונס עמידים,
  // מאומתת דרך call.gov.il ו-rafa.co.il; המינון בפועל נקבע לפי משקל ולא בבחירת
  // עוצמה מרשימה, ולא הצלחתי לאמת בוודאות אם קיימת יותר מעוצמת בקבוקון אחת — בלי doses
  { he: 'קולירצין', en: 'Coliracin' },

  // CF — ויטמינים ותמיכה תזונתית
  { he: 'דקאס פלוס', en: 'DEKAs Plus' },
  { he: 'ויטמין D', en: 'Vitamin D' },
  { he: 'ויטמין E', en: 'Vitamin E' },
  { he: 'ויטמין K', en: 'Vitamin K' },

  // מושתלי ריאה — אימונוסופרסיה
  // פרוגרף (פעמיים ביום) ואקרולימוס פי.אר/Advagraf (פעם ביום, שחרור מושהה)
  // הם שני תכשירים שונים עם עוצמות שונות — מאומת דרך עלונים רשמיים
  { he: 'פרוגרף', en: 'Prograf', doses: ['0.5 מ״ג', '1 מ״ג', '5 מ״ג'] },
  { he: 'אקרולימוס פי.אר', en: 'Advagraf', doses: ['0.5 מ״ג', '1 מ״ג', '3 מ״ג', '5 מ״ג'] },
  // סלספט קיים כשתי צורות שונות עם עוצמות שונות: כמוסות 250 מ"ג וטבליות 500 מ"ג
  { he: 'סלספט', en: 'CellCept', doses: ['250 מ״ג (כמוסה)', '500 מ״ג (טבליה)'] },
  { he: 'פרדניזון', en: 'Prednisone', doses: ['1 מ״ג', '5 מ״ג', '20 מ״ג'] },
  { he: 'סנדימיון', en: 'Sandimmune', doses: ['25 מ״ג', '50 מ״ג', '100 מ״ג'] },
  // ניאורל: אותן עוצמות נומינליות כמו סנדימיון, אבל אלו תכשירים שונים
  // (לא ניתנים להחלפה חופשית ביניהם לפי העלון, גם אם המ"ג זהה)
  { he: 'ניאורל', en: 'Neoral', doses: ['25 מ״ג', '50 מ״ג', '100 מ״ג'] },
  { he: 'ולציט', en: 'Valcyte', doses: ['450 מ״ג'] },
  { he: 'ספורנוקס', en: 'Sporanox', doses: ['100 מ״ג'] },
  { he: 'ווריקונאזול', en: 'Voriconazole', doses: ['200 מ״ג'] },
  { he: 'פלוקונאזול', en: 'Fluconazole', doses: ['50 מ״ג', '100 מ״ג', '150 מ״ג', '200 מ״ג'] },

  // מערכת עיכול
  { he: 'נקסיום', en: 'Nexium', doses: ['20 מ״ג', '40 מ״ג'] },
  { he: 'אומפרדקס', en: 'Omepradex', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג'] },
  { he: 'לוסק', en: 'Losec', doses: ['20 מ״ג'] },
  // אומפריקס — לא הצלחתי לאמת עוצמה ספציפית ממקור זמין, בלי doses
  { he: 'אומפריקס', en: 'Omeprix' },
  { he: 'לנטון', en: 'Lanton', doses: ['15 מ״ג', '30 מ״ג'] },
  { he: 'דקסילנט', en: 'Dexilant', doses: ['30 מ״ג', '60 מ״ג'] },
  { he: 'מוטיליום', en: 'Motilium', doses: ['10 מ״ג'] },
  // נורמלקס: בבדיקה התברר שהחומר הפעיל הוא פוליאתילן גליקול (PEG 3350) באבקה
  // בשקיקים של 17 גרם — לא דוקוזאט כמו שהנחתי בהתחלה, ולא "מ"ג בטבליה"
  { he: 'נורמלקס', en: 'Normalax', doses: ['17 גרם (שקית אבקה)'] },
  // פנטסה: טבליות שחרור מושהה (500 מ"ג / 1 גרם) ובנפרד שקיקי גרנולות (1/2/4 גרם)
  { he: 'פנטסה', en: 'Pentasa', doses: ['500 מ״ג (טבליה)', '1 גרם (טבליה)', '1 גרם (שקית)', '2 גרם (שקית)', '4 גרם (שקית)'] },
  { he: 'VSL#3', en: 'VSL#3' },
];
