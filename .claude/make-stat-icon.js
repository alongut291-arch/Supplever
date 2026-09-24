/* מייצר את אייקון שורת הסטטוס (ic_stat_supplever) מהגאומטריה של הלוגו.
 *
 *   node .claude/make-stat-icon.js "C:/Users/along/SuppleverApp/android/app/src/main/res"
 *
 * אנדרואיד מתעלם מהצבעים באייקון שורת הסטטוס וקורא רק את ערוץ השקיפות,
 * ולכן הפלט הוא צללית לבנה על שקוף. הקואורדינטות והזוויות זהות ל-SVG של
 * הלוגו — אם הלוגו משתנה, צריך לעדכן אותן כאן. */
const fs = require('fs'), zlib = require('zlib');

const CAPSULES = [
  [49.57, 36.68, -132.61], [34.43, 19.32, -132.61],
  [34.43, 36.68,  -47.39], [49.57, 19.32,  -47.39],
  [88.50, 28.00,   90    ], [81.04, 42.34,  145   ],
  [63.84, 45.08,  197    ], [81.04, 13.66,   35   ],
  [63.84, 10.92,   -6    ], [-4.50, 28.00,   90   ],
  [ 2.96, 42.34,   35    ], [20.16, 45.08,  -17   ],
  [ 2.96, 13.66,  145    ], [20.16, 10.92,  186   ],
];
const VB = { x: -9, y: 6, w: 102, h: 44 };
const HALF_LEN = 3.5, RADIUS = 3.5;

function insideCapsule(px, py, cx, cy, deg) {
  const r = -deg * Math.PI / 180;               // הופכי לסיבוב של ה-SVG
  const dx = px - cx, dy = py - cy;
  const lx =  dx * Math.cos(r) - dy * Math.sin(r);
  const ly =  dx * Math.sin(r) + dy * Math.cos(r);
  const t = Math.max(-HALF_LEN, Math.min(HALF_LEN, lx));
  return Math.hypot(lx - t, ly) <= RADIUS;
}

function render(size) {
  const SS = 4;                                  // דגימת-על לקצוות חלקים
  const margin = size * (1 / 12);                // 2dp מתוך 24
  const scale = (size - 2 * margin) / VB.w;
  const offX = margin, offY = (size - VB.h * scale) / 2;

  const rgba = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let hits = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const ux = VB.x + (x + (sx + 0.5) / SS - offX) / scale;
        const uy = VB.y + (y + (sy + 0.5) / SS - offY) / scale;
        if (CAPSULES.some(c => insideCapsule(ux, uy, c[0], c[1], c[2]))) hits++;
      }
      const i = (y * size + x) * 4;
      rgba[i] = rgba[i + 1] = rgba[i + 2] = 255;  // לבן; אנדרואיד צובע מחדש
      rgba[i + 3] = Math.round(255 * hits / (SS * SS));
    }
  }
  return rgba;
}

function png(size, rgba) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;                 // filter: none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
    return Buffer.concat([len, td, crc]);
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

let TBL = null;
function crc32(buf) {
  if (!TBL) { TBL = []; for (let n = 0; n < 256; n++) { let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; TBL[n] = c; } }
  let c = 0xffffffff;
  for (const b of buf) c = TBL[(c ^ b) & 0xff] ^ (c >>> 8);
  return c ^ 0xffffffff;
}

const OUT = process.argv[2];
const DENSITIES = { mdpi: 24, hdpi: 36, xhdpi: 48, xxhdpi: 72, xxxhdpi: 96 };
for (const [d, s] of Object.entries(DENSITIES)) {
  const dir = `${OUT}/drawable-${d}`;
  fs.mkdirSync(dir, { recursive: true });
  const file = `${dir}/ic_stat_supplever.png`;
  fs.writeFileSync(file, png(s, render(s)));
  console.log(`${d}\t${s}x${s}\t${fs.statSync(file).size} bytes`);
}
