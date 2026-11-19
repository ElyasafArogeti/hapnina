import { faqs, PHONE } from "./faqData";

const PH = PHONE.trim();

/* ------------------------------------------------------------------ */
/*  סוגי אירועים – כאן אתה מגדיר מה קיים אצלך.                        */
/*  available: true  = יש תפריט, והבוט יציג את ה-menu                  */
/*  available: false = אין תפריט, הבוט יגיד "ניסינו למצוא ולא מצאנו"   */
/* ------------------------------------------------------------------ */
export const EVENTS = [
  {
    id: "yizkor",
    name: "אזכרה",
    keywords: ["אזכרה", "אזכרות", "אזכרת", "יארצייט", "יארצאייט"],
    available: true,
    menu: "יש לנו תפריט אזכרה במחיר של 77 ₪ למנה.\nבחבילה כמות בחירה מסוימת של מנות, ואת הפירוט המלא אפשר לראות בעמוד הבית בחבילות התפריטים.",
  },
  {
    id: "brit",
    name: "ברית",
    keywords: ["ברית", "ברית מילה", "שלום זכר", "מילה", "בריתה", "זכר"],
    available: true,
    menu: "יש לנו תפריט ברית מילה במחיר של 89 ₪ למנה.\nבחבילה כמות בחירה מסוימת של מנות, ואת הפירוט המלא אפשר לראות בעמוד הבית בחבילות התפריטים.",
  },
  {
    id: "barmitzvah",
    name: "בר/בת מצווה",
    keywords: ["בר מצווה", "בר מצוה", "בת מצווה", "בת מצוה", "מצווה", "מצוה"],
    available: true,
    menu: "יש לנו חבילות לבר ובת מצווה במחיר של 110 ₪ למנה.\nבחבילה כמות בחירה מסוימת של מנות, ואת הפירוט המלא אפשר לראות בעמוד הבית בחבילות התפריטים.",
  },
  {
    id: "shabbat-chatan",
    name: "שבת",
    keywords: ["שבת חתן", "שבת חתנים", "אויפרוף", "שבת אופרוף", "שבת", "שבתות"],
    available: true,
    menu: "יש לנו תפריט מפואר לשבתות במחיר של 190 ₪ למנה.\nבחבילה כמות בחירה מסוימת של מנות, ואת הפירוט המלא אפשר לראות בעמוד הבית בחבילות התפריטים.",
  },
  {
    id: "wedding",
    name: "חתונה",
    keywords: ["חתונה", "חופה", "אירוסין", "חתונת"],
    available: true,
    menu: "יש לנו תפריט חתונות מורחב. בעמוד \"תפריט כללי – הצעת מחיר\" תקבלו את התפריט המלא ללא סינונים, ואת הצעת המחיר במקום לפי מספר המוזמנים שלכם.",
  },
  {
    id: "company",
    name: "אירוע חברה",
    keywords: ["חברה", "עסקי", "עובדים", "כנס", "ארוע חברה", "אירוע חברה", "משרד"],
    available: true,
    menu: "אנחנו מכינים אירועי חברה וארוחות לעובדים, מבופה ועד מגשי אירוח.", // ← ערוך
  },
  {
    id: "birthday",
    name: "יום הולדת",
    keywords: ["יום הולדת", "יומולדת", "יום נישואין"],
    available: false,
  },
  {
    id: "henna",
    name: "חינה",
    keywords: ["חינה", "חנה"],
    available: false,
  },
];

/* מילים שמסמנות שאלת מחיר */
const PRICE_WORDS = [
  "מחיר", "מחירים", "כמה עולה", "כמה יעלה", "כמה זה", "עלות", "תמחור",
  "הצעת מחיר", "למנה", "לאיש", "לסועד", "לאורח", "חבילות", "תעריף",
];

const THANKS = ["תודה", "תודה רבה", "מעולה", "אחלה", "סבבה", "יופי"];
const HELLO = ["שלום", "היי", "הי", "אהלן", "בוקר טוב", "ערב טוב", "צהריים טובים"];

/* ------------------------------------------------------------------ */
/*  כלי עזר: ניקוי טקסט + התאמה מטושטשת (סובלת טעויות כתיב)           */
/* ------------------------------------------------------------------ */
const norm = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/["'״׳`]/g, "")
    .replace(/[^\u0590-\u05FFa-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const stripPrefix = (w) => (w.length > 3 && "הבלוכמש".includes(w[0]) ? w.slice(1) : w);

const lev = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return 9;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
  return dp[a.length][b.length];
};

const hit = (t, tokens, kw) => {
  const k = norm(kw);
  if (!k) return 0;
  if (k.includes(" ")) return t.includes(k) ? 2 : 0;
  if (tokens.some((w) => w === k || stripPrefix(w) === k)) return 2;
  if (k.length >= 3 && tokens.some((w) => w.includes(k))) return 1.5;
  if (k.length >= 4 && tokens.some((w) => lev(stripPrefix(w), k) <= 1)) return 1;
  return 0;
};

const scoreKeywords = (t, tokens, kws) =>
  kws.reduce((sum, k) => sum + hit(t, tokens, k) * Math.max(norm(k).length, 1) ** 0.5, 0);

const detectEvent = (t, tokens) => {
  let best = null;
  let bestScore = 0;
  for (const e of EVENTS) {
    const s = scoreKeywords(t, tokens, e.keywords);
    if (s > bestScore) {
      best = e;
      bestScore = s;
    }
  }
  return best;
};

const bestFaq = (t, tokens) => {
  let best = null;
  let bestScore = 0;
  for (const f of faqs) {
    if (f.id === "9") continue; // מחיר מטופל בנפרד
    const s = scoreKeywords(t, tokens, f.keywords);
    if (s > bestScore) {
      best = f;
      bestScore = s;
    }
  }
  return { faq: best, score: bestScore };
};

/* ------------------------------------------------------------------ */
/*  תשובות                                                             */
/* ------------------------------------------------------------------ */
const availableEvents = () => EVENTS.filter((e) => e.available).map((e) => e.name);

const askEventType = () => ({
  answer:
    "המחיר למנה תלוי באיזה תפריט תבחרו 🍽️ יש לנו מגוון תפריטים:\n• אזכרה – 77 ₪ למנה\n• ברית – 89 ₪ למנה\n• בר/בת מצווה – 110 ₪ למנה\n• שבת – 190 ₪ למנה\n\nבכל חבילה כמות בחירה שונה, והפירוט בעמוד הבית בחבילות התפריטים. צריכים מוצרים בודדים? יש סל קניות לבחירה אישית והצעת מחיר.\n\nאיזה סוג אירוע אתם מתכננים?",
  suggestions: EVENTS.filter((e) => e.available).map((e) => e.name),
  topic: "event",
});

const eventAnswer = (e) => {
  if (!e.available) return notFound(e.name);
  return {
    answer: `מעולה, ${e.name}! 🎉\n${e.menu}\n\nכדי לתת לך הצעת מחיר מדויקת: כמה אורחים צפויים, ובאיזה אזור יתקיים האירוע?\nאפשר גם לדבר איתנו ישירות: ${PH}`,
    suggestions: ["משלוחים", "כשרות", "מנות צמחוניות"],
    topic: "quote",
    event: e,
  };
};

const notFound = (name) => ({
  answer: `חיפשתי עבורך תפריט ${name ? `ל${name}` : "מתאים"} ולצערי לא מצאתי תפריט ייעודי כזה כרגע 🙏\nאבל יש לנו עוד הרבה מה להציע – אפשר להתאים תפריט אישי, ויש לנו חבילות ל${availableEvents().join(", ")}.\n\nאשמח אם תשאיר טלפון או תתקשר אלינו ונבנה לך משהו מדויק: ${PH}`,
  suggestions: availableEvents(),
  topic: "event",
});

/* ------------------------------------------------------------------ */
/*  המוח: מקבל טקסט + הקשר שיחה, מחזיר תשובה                          */
/* ------------------------------------------------------------------ */
export function respond(text, ctx = {}) {
  const t = norm(text);
  const tokens = t.split(" ");

  const event = detectEvent(t, tokens);
  const priceScore = scoreKeywords(t, tokens, [
    ...PRICE_WORDS,
    ...faqs.find((f) => f.id === "9").keywords,
  ]);
  const { faq, score: faqScore } = bestFaq(t, tokens);

  // תודה / ברכה
  if (!event && !faq && priceScore === 0) {
    if (THANKS.some((w) => t === norm(w))) {
      return { answer: "בשמחה! 🌸 אם יש עוד משהו, אני כאן.", suggestions: [], topic: null };
    }
    if (HELLO.some((w) => t === norm(w))) {
      return {
        answer: "שלום וברכה! 🌸 במה אפשר לעזור?",
        suggestions: ["כמה יעלה לי התפריט?", "משלוחים", "כשרות"],
        topic: null,
      };
    }
  }

  // המשך שיחה: הלקוח משיב כמה אורחים
  if (ctx.topic === "quote" && /\d+/.test(t) && !faq) {
    const n = t.match(/\d+/)[0];
    return {
      answer: `מעולה, רשמתי ${n} אורחים${ctx.event ? ` ל${ctx.event.name}` : ""} ✨\nכדי לסגור הצעת מחיר מסודרת, הנציג שלנו ישמח לדבר איתך: ${PH}`,
      suggestions: ["משלוחים", "תיאום מראש"],
      topic: null,
    };
  }

  // זוהה סוג אירוע
  if (event && (priceScore > 0 || ctx.topic === "event" || !faq || faqScore < 2)) {
    return eventAnswer(event);
  }

  // שאלת מחיר בלי סוג אירוע
  if (priceScore > 0 && !faq) return askEventType();

  // שאלה רגילה מהרשימה
  if (faq) return { answer: faq.answer, suggestions: [], topic: null };

  // היינו באמצע "איזה אירוע?" והלקוח כתב משהו שלא מכירים
  if (ctx.topic === "event") return notFound(text.length < 25 ? text : "");

  return {
    answer: `לא הצלחתי להבין בדיוק 🙂\nאפשר לבחור אחת מהשאלות הנפוצות למטה, או לדבר איתנו ישירות בטלפון: ${PH}`,
    suggestions: ["כמה יעלה לי התפריט?", "משלוחים", "כשרות"],
    topic: null,
  };
}

/* זמן "מחשבה" – נע בין ~2 ל-4.5 שניות, תלוי באורך התשובה */
export const thinkingTime = (answer) =>
  1800 + Math.min(answer.length * 10, 2000) + Math.random() * 600;

export const THINKING_STEPS = [
  "קוראת את השאלה...",
  "מחפשת בתפריטים ובמידע שלנו...",
  "מנסחת תשובה...",
];