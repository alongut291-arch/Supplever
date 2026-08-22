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
//
// The general-population batch below (statins, blood pressure, pain, mental
// health, respiratory, allergy, ADHD, thyroid, etc.) was imported from a list
// the app owner compiled (159 medications, Aug 2026) and then individually
// audited row by row against Clalit/Infomed/drug.co.il/MoH registry — not
// taken on faith. ~13 rows turned out to not be real Israeli-marketed
// products (one was actually a veterinary drug) and were dropped; ~30 had
// wrong/incomplete dose lists or spelling and were corrected; the rest were
// confirmed accurate. See individual comments below for anything non-obvious.
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
  { he: 'ג׳נוביה', en: 'Januvia', doses: ['25 מ״ג', '50 מ״ג', '100 מ״ג'] },
  { he: 'גלבוס', en: 'Galvus', doses: ['50 מ״ג'] },
  { he: 'טרג׳נטה', en: 'Trajenta', doses: ['5 מ״ג'] },
  { he: 'אמאריל', en: 'Amaryl', doses: ['1 מ״ג', '2 מ״ג', '3 מ״ג', '4 מ״ג'] },
  { he: 'לנטוס', en: 'Lantus', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  { he: 'נובורפיד', en: 'NovoRapid', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
  // "טרגלודק" הוא השם הרשום בפועל בישראל (Tregludec/Tresiba) — "Tresiba" עצמו
  // לא נמצא תחת אף איות ברישום הישראלי; רק ריכוז 100 יח'/מ"ל אומת (לא 200)
  { he: 'טרגלודק', en: 'Tresiba', type: 'insulin-pen', defaultSubUnits: 5, defaultUnitsPerSub: 300 },
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
  { he: 'וויגובי', en: 'Wegovy', doses: ['0.25 מ״ג', '0.5 מ״ג', '1 מ״ג', '1.7 מ״ג', '2.4 מ״ג'] },
  { he: 'ריבלסוס', en: 'Rybelsus', doses: ['3 מ״ג', '7 מ״ג', '14 מ״ג'] },
  { he: 'ויקטוזה', en: 'Victoza', doses: ['0.6 מ״ג', '1.2 מ״ג', '1.8 מ״ג'] },
  // בישראל רשומים רק 0.75/1.5 מ"ג — 3/4.5 מ"ג הם מינונים חדשים יותר שטרם אושרו כאן
  { he: 'טרוליסיטי', en: 'Trulicity', doses: ['0.75 מ״ג', '1.5 מ״ג'] },
  { he: 'מונג׳רו', en: 'Mounjaro', doses: ['2.5 מ״ג', '5 מ״ג', '7.5 מ״ג', '10 מ״ג', '12.5 מ״ג', '15 מ״ג'] },

  // סוכרת — ציוד תומך
  { he: 'רצועות בדיקת סוכר', en: 'Test Strips' },
  { he: 'מחטים לעט אינסולין', en: 'Pen Needles' },
  { he: 'לנצטים', en: 'Lancets' },
  { he: 'חיישן פריסטייל ליברה', en: 'FreeStyle Libre Sensor' },
  { he: 'חיישן דקסקום', en: 'Dexcom Sensor' },
  { he: 'מד סוכר', en: 'Glucometer' },

  // קרדיווסקולרי — כולסטרול (סטטינים)
  { he: 'ליפיטור', en: 'Lipitor', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג', '80 מ״ג'] },
  { he: 'ליטורבה', en: 'Litorva', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג', '80 מ״ג'] },
  { he: 'אטורבסטטין טבע', en: 'Atorvastatin Teva', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג', '80 מ״ג'] },
  { he: 'קרסטור', en: 'Crestor', doses: ['5 מ״ג', '10 מ״ג', '20 מ״ג', '40 מ״ג'] },
  { he: 'רוזובסטטין טבע', en: 'Rosuvastatin Teva', doses: ['5 מ״ג', '10 מ״ג', '20 מ״ג', '40 מ״ג'] },
  { he: 'סימוביל', en: 'Simovil', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג', '80 מ״ג'] },
  { he: 'סימבקור', en: 'Simvacor', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג'] },
  { he: 'אזטרול', en: 'Ezetrol', doses: ['10 מ״ג'] },

  // קרדיווסקולרי — נוגדי קרישה וטסיות
  { he: 'מיקרופירין', en: 'Micropirin', doses: ['75 מ״ג', '100 מ״ג'] },
  { he: 'קארטיה', en: 'Cartia', doses: ['100 מ״ג'] },
  // השם הרשום בישראל הוא "פלויקס" — לא "פלביקס"
  { he: 'פלויקס', en: 'Plavix', doses: ['75 מ״ג', '300 מ״ג'] },
  { he: 'אליקוויס', en: 'Eliquis', doses: ['2.5 מ״ג', '5 מ״ג'] },
  { he: 'קסרלטו', en: 'Xarelto', doses: ['2.5 מ״ג', '10 מ״ג', '15 מ״ג', '20 מ״ג'] },
  { he: 'קומדין', en: 'Coumadin', doses: ['1 מ״ג', '2.5 מ״ג', '5 מ״ג'] },

  // קרדיווסקולרי — לחץ דם
  { he: 'נורווסק', en: 'Norvasc', doses: ['5 מ״ג', '10 מ״ג'] },
  { he: 'אמלו', en: 'Amlo', doses: ['5 מ״ג', '10 מ״ג'] },
  { he: 'אנלדקס', en: 'Enaldex', doses: ['5 מ״ג', '10 מ״ג', '20 מ״ג'] },
  { he: 'קונברטין', en: 'Convertin', doses: ['5 מ״ג', '10 מ״ג', '20 מ״ג'] },
  // אין מינון 10 מ"ג לטריטייס בישראל — רמיפריל 10 מ"ג נמכר תחת "רמיטנס"
  { he: 'טריטייס', en: 'Tritace', doses: ['1.25 מ״ג', '2.5 מ״ג', '5 מ״ג'] },
  { he: 'רמיפריל טבע', en: 'Ramipril Teva', doses: ['2.5 מ״ג', '5 מ״ג', '10 מ״ג'] },
  { he: 'לוסרדקס', en: 'Losardex', doses: ['12.5 מ״ג', '50 מ״ג', '100 מ״ג'] },
  { he: 'אוקסאר', en: 'Ocsaar', doses: ['50 מ״ג', '100 מ״ג'] },
  { he: 'דיובן', en: 'Diovan', doses: ['40 מ״ג', '80 מ״ג', '160 מ״ג'] },
  { he: 'וקטור', en: 'Vector', doses: ['80 מ״ג', '160 מ״ג'] },
  { he: 'אטאקנד', en: 'Atacand', doses: ['4 מ״ג', '8 מ״ג', '16 מ״ג', '32 מ״ג'] },
  { he: 'קרדילוק', en: 'Cardiloc', doses: ['1.25 מ״ג', '2.5 מ״ג', '5 מ״ג', '10 מ״ג'] },
  { he: 'נורמיטן', en: 'Normiten', doses: ['25 מ״ג', '50 מ״ג', '100 מ״ג'] },
  // התכשיר בפועל הוא Divitabs 200 מ"ג בשחרור מושהה — לא 100 מ"ג רגיל
  { he: 'לופרסור', en: 'Lopresor', doses: ['200 מ״ג (Divitabs)'] },
  { he: 'נאובלוק', en: 'Neobloc', doses: ['100 מ״ג'] },

  // קרדיווסקולרי — משתנים
  { he: 'דיזותיאזיד', en: 'Disothiazide', doses: ['25 מ״ג'] },
  { he: 'פוסיד', en: 'Fusid', doses: ['40 מ״ג'] },
  { he: 'אלדקטון', en: 'Aldactone', doses: ['25 מ״ג', '100 מ״ג'] },

  // שיכוך כאב וחום
  { he: 'אקמול', en: 'Acamol', doses: ['500 מ״ג'] },
  { he: 'דקסמול', en: 'Dexamol', doses: ['500 מ״ג'] },
  { he: 'נובימול', en: 'Novimol', doses: ['100 מ״ג/1 מ״ל (טיפות)'] },
  { he: 'אופטלגין', en: 'Optalgin', doses: ['500 מ״ג'] },
  // וי-דלגין נמכר רק כטיפות/סירופ — לא קיימת צורת טבליות בישראל
  { he: 'וי-דלגין', en: 'V-Dalgin' },

  // כאב ודלקת (NSAID / COX-2)
  { he: 'אדוויל', en: 'Advil', doses: ['200 מ״ג', '400 מ״ג'] },
  { he: 'נורופן', en: 'Nurofen', doses: ['200 מ״ג', '400 מ״ג'] },
  { he: 'אדקס', en: 'Adex', doses: ['200 מ״ג', '400 מ״ג'] },
  { he: 'ארטופן', en: 'Artofen', doses: ['200 מ״ג', '400 מ״ג'] },
  { he: 'נרוסין', en: 'Narocin', doses: ['275 מ״ג'] },
  // המינון בפועל הוא 275 מ"ג (לא 220 מ"ג — זה מינון אמריקאי של Aleve)
  { he: 'פוינט', en: 'Point', doses: ['275 מ״ג'] },
  // 250 מ"ג נראה לא פעיל יותר ברישום — רק 500 מ"ג אושר
  { he: 'נקסין', en: 'Naxyn', doses: ['500 מ״ג'] },
  { he: 'וולטרן', en: 'Voltaren', doses: ['25 מ״ג', '50 מ״ג', '100 מ״ג (Retard)'] },
  // רק גרסת ה-SR 100 מ"ג נמצאה פעילה כרגע — 25/50 מ"ג עשויים להיות מופסקים
  { he: 'בטרן', en: 'Betaren', doses: ['100 מ״ג (Retard)'] },
  { he: 'ארקוקסיה', en: 'Arcoxia', doses: ['30 מ״ג', '60 מ״ג', '90 מ״ג', '120 מ״ג'] },
  { he: 'סלברה', en: 'Celebra', doses: ['100 מ״ג', '200 מ״ג'] },

  // משככי כאב אופיואידיים ומשולבים
  { he: 'טרמדקס', en: 'Tramadex', doses: ['50 מ״ג'] },
  // Retard 150/200 מ"ג לא אומתו לישראל — רק 100 מ"ג Retard
  { he: 'טרמל', en: 'Tramal', doses: ['50 מ״ג', '100 מ״ג (Retard)'] },
  { he: 'זלדיאר', en: 'Zaldiar', doses: ['37.5/325 מ״ג'] },
  { he: 'טרג׳ין', en: 'Targin', doses: ['5/2.5 מ״ג', '10/5 מ״ג', '20/10 מ״ג', '40/20 מ״ג'] },
  { he: 'אוקסיקונטין', en: 'Oxycontin', doses: ['10 מ״ג', '20 מ״ג', '40 מ״ג', '80 מ״ג'] },
  // הכתיב הרשמי בכל המקורות הישראליים הוא "פרקוסט", לא "פרקוקט"
  { he: 'פרקוסט', en: 'Percocet', doses: ['5/325 מ״ג'] },

  // כאב נוירופתי ואפילפסיה
  { he: 'ליריקה', en: 'Lyrica', doses: ['25 מ״ג', '50 מ״ג', '75 מ״ג', '100 מ״ג', '150 מ״ג', '200 מ״ג', '225 מ״ג', '300 מ״ג'] },
  // אין מינון 100 מ"ג בישראל — רק 300/400/600/800 מ"ג
  { he: 'נוירונטין', en: 'Neurontin', doses: ['300 מ״ג', '400 מ״ג', '600 מ״ג', '800 מ״ג'] },

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
  // זיטרומקס — לא הצלחתי לאמת עוצמת טבליה ספציפית ממקור ישראלי, בלי doses
  { he: 'זיטרומקס', en: 'Zithromax' },
  // ציפרודקס בישראל הוא כדורי ציפרופלוקסצין דרך הפה — לא טיפות אוזניים כמו בארה"ב
  { he: 'ציפרודקס', en: 'Ciprodex', doses: ['250 מ״ג', '500 מ״ג', '750 מ״ג'] },
  // ציפרוקסין — מקור נוסף (רשימת התרופות שהמשתמש איגד) מאשר עוצמות זהות לציפרו הרגיל
  { he: 'ציפרוקסין', en: 'Ciproxin', doses: ['250 מ״ג', '500 מ״ג', '750 מ״ג'] },
  { he: 'ציפרוגיס', en: 'Ciprogis', doses: ['250 מ״ג', '500 מ״ג'] },
  { he: 'דוקסילין', en: 'Doxylin', doses: ['100 מ״ג'] },
  // רק "מוקסיפן פורטה" (500 מ"ג כמוסות) אומת כפעיל ברישום — לא הצורות האחרות
  { he: 'מוקסיפן', en: 'Moxypen', doses: ['500 מ״ג (פורטה)'] },
  // Macrodantin: רק 100 מ"ג אומת — לא 50 מ"ג
  { he: 'מקרודנטין', en: 'Macrodantin', doses: ['100 מ״ג'] },

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
  // פרדניזון: מאומת פעמיים — גם דרך מקור עצמאי וגם דרך "פרדניזון טבע" ברשימת המשתמש, אותן עוצמות
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
  { he: 'קונטרולוק', en: 'Controloc', doses: ['20 מ״ג', '40 מ״ג'] },
  { he: 'לנטון', en: 'Lanton', doses: ['15 מ״ג', '30 מ״ג'] },
  { he: 'דקסילנט', en: 'Dexilant', doses: ['30 מ״ג', '60 מ״ג'] },
  { he: 'גסטרו', en: 'Gastro', doses: ['20 מ״ג', '40 מ״ג'] },
  { he: 'פראמין', en: 'Pramin', doses: ['10 מ״ג'] },
  // זופרן — הצמד לחומר הפעיל אושר, אך המינון הספציפי לישראל לא אומת ממקור עצמאי, בלי doses
  { he: 'זופרן', en: 'Zofran' },
  { he: 'מוטיליום', en: 'Motilium', doses: ['10 מ״ג'] },
  // אין כמוסת Retard 200 מ"ג — רק טבליות 135 מ"ג
  { he: 'קולוטל', en: 'Colotal', doses: ['135 מ״ג'] },
  // נורמלקס: בבדיקה התברר שהחומר הפעיל הוא פוליאתילן גליקול (PEG 3350) באבקה
  // בשקיקים של 17 גרם — לא דוקוזאט כמו שהנחתי בהתחלה, ולא "מ"ג בטבליה"
  { he: 'נורמלקס', en: 'Normalax', doses: ['17 גרם (שקית אבקה)'] },
  { he: 'פגלקס', en: 'Peglax', doses: ['10 גרם (שקית אבקה)'] },
  // פנטסה: טבליות שחרור מושהה (500 מ"ג / 1 גרם) ובנפרד שקיקי גרנולות (1/2/4 גרם)
  { he: 'פנטסה', en: 'Pentasa', doses: ['500 מ״ג (טבליה)', '1 גרם (טבליה)', '1 גרם (שקית)', '2 גרם (שקית)', '4 גרם (שקית)'] },
  { he: 'VSL#3', en: 'VSL#3' },

  // בריאות הנפש — SSRI / SNRI
  { he: 'ציפרלקס', en: 'Cipralex', doses: ['10 מ״ג', '20 מ״ג'] },
  { he: 'אסטו', en: 'Esto', doses: ['10 מ״ג', '20 מ״ג'] },
  { he: 'לוסטרל', en: 'Lustral', doses: ['50 מ״ג', '100 מ״ג'] },
  { he: 'סרטרלין טבע', en: 'Sertraline Teva', doses: ['50 מ״ג', '100 מ״ג'] },
  { he: 'פרוזק', en: 'Prozac', doses: ['20 מ״ג'] },
  // התעתיק הרשום הוא "Flutine" (לא Flotin) — העברית "פלוטין" תקינה
  { he: 'פלוטין', en: 'Flutine', doses: ['20 מ״ג'] },
  // צורת המתן היא טבליות (לא כמוסות)
  { he: 'פריזמה', en: 'Prizma', doses: ['20 מ״ג'] },
  { he: 'סרוקסט', en: 'Seroxat', doses: ['20 מ״ג', '30 מ״ג'] },
  { he: 'ציפרמיל', en: 'Cipramil', doses: ['20 מ״ג', '40 מ״ג'] },
  { he: 'רסיטל', en: 'Recital', doses: ['20 מ״ג', '40 מ״ג'] },
  // אין כמוסת XR של 37.5 מ"ג — מינון זה קיים רק בגרסה הרגילה (לא XR)
  { he: 'אפקסור XR', en: 'Efexor XR', doses: ['75 מ״ג', '150 מ״ג'] },
  { he: 'ויאפקס', en: 'Viepax', doses: ['37.5 מ״ג', '75 מ״ג', '150 מ״ג (XR)', '225 מ״ג (XR)'] },
  { he: 'סימבלטה', en: 'Cymbalta', doses: ['30 מ״ג', '60 מ״ג'] },
  { he: 'מירו', en: 'Miro', doses: ['30 מ״ג', '45 מ״ג'] },
  // רמרון — לא הצלחתי לאמת עוצמות ספציפיות לישראל (רגיל מול SolTab), בלי doses
  { he: 'רמרון', en: 'Remeron' },

  // חרדה, הרגעה ושינה
  { he: 'קלונקס', en: 'Clonex', doses: ['0.5 מ״ג', '2 מ״ג'] },
  // המינונים בפועל: 0.5/1/2 מ"ג — לא 2.5 מ"ג
  { he: 'לוריוואן', en: 'Lorivan', doses: ['0.5 מ״ג', '1 מ״ג', '2 מ״ג'] },
  // "ואליום" לא רשום בישראל תחת השם הזה — המותג המקומי לדיאזפאם הוא אסיוול (למטה)
  { he: 'אסיוול', en: 'Assival', doses: ['2 מ״ג', '5 מ״ג', '10 מ״ג'] },
  // "קסנקס" הרגיל (שחרור מיידי) לא משווק בישראל תחת השם הזה — המותג המקומי
  // הוא "אלפרליד"; רק Xanax XR קיים בישראל בשם הזה, ולא אומתו מינונים ספציפיים לו כרגע
  { he: 'קסנאגיס', en: 'Xanagis', doses: ['0.25 מ״ג', '0.5 מ״ג', '1 מ״ג'] },
  { he: 'בונדורמין', en: 'Bondormin', doses: ['0.25 מ״ג'] },
  { he: 'זודורם', en: 'Zodorm', doses: ['10 מ״ג'] },
  { he: 'אמביאן CR', en: 'Ambien CR', doses: ['6.25 מ״ג', '12.5 מ״ג'] },
  { he: 'אימובן', en: 'Imovane', doses: ['7.5 מ״ג'] },
  { he: 'סרוקוול', en: 'Seroquel', doses: ['25 מ״ג', '100 מ״ג', '200 מ״ג', '300 מ״ג', '400 מ״ג'] },

  // מערכת הנשימה, אסתמה ואלרגיה
  { he: 'ונטולין', en: 'Ventolin', doses: ['100 מק״ג/לחיצה'] },
  // רק Turbuhaler משווק בישראל — לא נמצאה עדות ל-Rapihaler (משאף תרסיס) בארץ
  { he: 'סימביקורט טורבוהלר', en: 'Symbicort Turbuhaler', doses: ['80/4.5 מק״ג', '160/4.5 מק״ג', '320/9 מק״ג'] },
  // רק Diskus משווק בישראל — לא נמצאה עדות ל-Evohaler (משאף תרסיס) בארץ
  { he: 'סרטייד דיסקוס', en: 'Seretide Diskus', doses: ['50/100 מק״ג', '50/250 מק״ג', '50/500 מק״ג'] },
  { he: 'סינגולייר', en: 'Singulair', doses: ['4 מ״ג', '5 מ״ג', '10 מ״ג'] },
  { he: 'זילרג׳י', en: 'Zyllergy', doses: ['10 מ״ג'] },
  { he: 'היסטזין', en: 'Histazine', doses: ['10 מ״ג'] },
  { he: 'לורסטין', en: 'Lorastine', doses: ['10 מ״ג'] },
  { he: 'אריוס', en: 'Aerius', doses: ['5 מ״ג'] },
  { he: 'טלפסט', en: 'Telfast', doses: ['120 מ״ג', '180 מ״ג'] },
  { he: 'פליקסונאז', en: 'Flixonase', doses: ['50 מק״ג/לחיצה'] },
  { he: 'אבמיס', en: 'Avamys', doses: ['27.5 מק״ג/לחיצה'] },

  // קשב וריכוז (ADHD)
  { he: 'ריטלין', en: 'Ritalin', doses: ['10 מ״ג'] },
  // אין מינון 60 מ"ג בישראל — רק 10/20/30/40 מ"ג
  { he: 'ריטלין LA', en: 'Ritalin LA', doses: ['10 מ״ג', '20 מ״ג', '30 מ״ג', '40 מ״ג'] },
  { he: 'קונצרטה', en: 'Concerta', doses: ['18 מ״ג', '27 מ״ג', '36 מ״ג', '54 מ״ג'] },
  // רק 30/50/70 מ"ג רשומים בישראל — לא 20/40/60 מ"ג
  { he: 'ויואנס', en: 'Vyvanse', doses: ['30 מ״ג', '50 מ״ג', '70 מ״ג'] },

  // בלוטת התריס
  { he: 'אלטרוקסין', en: 'Eltroxin', doses: ['50 מק״ג', '100 מק״ג'] },
  // הכתיב הרשמי הוא "יוטירוקס"; בישראל רשומים רק 25/50/100 מק"ג — לא כל 11
  // העוצמות מהטבלה הבינלאומית
  { he: 'יוטירוקס', en: 'Euthyrox', doses: ['25 מק״ג', '50 מק״ג', '100 מק״ג'] },
  // בישראל רשומים רק 50/100 מק"ג
  { he: 'סינתרואיד', en: 'Synthroid', doses: ['50 מק״ג', '100 מק״ג'] },

  // מפרקים ומטבוליזם (גאוט), אורולוגיה ודרמטולוגיה
  { he: 'אלוריל', en: 'Alloril', doses: ['100 מ״ג', '300 מ״ג'] },
  { he: 'זילול', en: 'Zylol', doses: ['100 מ״ג', '300 מ״ג'] },
  { he: 'אומניק', en: 'Omnic', doses: ['0.4 מ״ג'] },
  { he: 'אומניק אוקאס', en: 'Omnic Ocas', doses: ['0.4 מ״ג'] },
  { he: 'פרופסיה', en: 'Propecia', doses: ['1 מ״ג'] },

  // ויטמינים, מינרלים וסטרואידים סיסטמיים
  { he: 'טיפת טיפות ויטמין D (כצט)', en: 'Tipat Tipot Vitamin D' },
  // די-קיור — לא הצלחתי לאמת את המינונים ממקור עצמאי, בלי doses
  { he: 'די-קיור', en: 'D-Cure' },
  // המינונים בפועל הם 5 ו-10 מ"ג — לא 0.4 מ"ג (400 מק"ג)
  { he: 'חומצה פולית טבע', en: 'Folic Acid Teva', doses: ['5 מ״ג', '10 מ״ג'] },
  // "פריפול" (השם הישראלי בפועל) אושר, אך המינון הספציפי לא אומת ממקור עצמאי, בלי doses
  { he: 'פריפול', en: 'Maltofer' },
  // ויטמין B12 תת-לשוני — נמצא רק כסירופ בישראל, לא כטבליה תת-לשונית, בלי doses
  { he: 'ויטמין B12 תת-לשוני טבע', en: 'B12 Sublingual Teva' },
  // "רקח" כיצרן לא אותר — המוצר שנמצא בפועל הוא "דקסמתזון קרן פארמה"
  { he: 'דקסמתזון קרן פארמה', en: 'Dexamethasone Keren Pharma', doses: ['0.5 מ״ג', '2 מ״ג', '4 מ״ג'] },
];
