import { useEffect, useState } from "react";
import { apiFetch } from "../../api";
import { Box, Typography, Container, Button, Snackbar, Alert, LinearProgress, TextField, Dialog, IconButton, useMediaQuery } from "@mui/material";
import NavbarHome from "../NavbarHome";
import Footer from "../Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import defaultDishImage from "../../../assets/imgs/imgdifolt.png"; // <-- בדוק שהנתיב נכון לפי מיקום הקובץ אצלך
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import RoomServiceOutlinedIcon from "@mui/icons-material/RoomServiceOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

// ============================================================
// דף גנרי לתצוגת תפריטי חבילות (בר מצווה, ברית, אזכרה ועוד)
// ============================================================

// ===== הגדרות כלליות =====
const DEFAULT_MIN_GUESTS = 60;                      // מינימום מנות / מוזמנים כברירת מחדל (כרטיס חבילה יכול לשנות עם minGuests)
const FISH_EVENTS = ["אזכר", "הזכר"];               // אירועים שבהם מוסיפים גם דגים (מכסה: אזכרה, אזכרות, הזכרה)
const isFishName = (n) => /דג|מושט|סלמון|לברק|פורל|אמנון|טונה/.test(n || ""); // זיהוי מנת דג לפי השם
const GOLD = "#C9A96E", GOLD_DARK = "#8c6a25", INK = "#171614", CREAM = "#f6f3ec";

// ===== תמונות למנות =====
// כל שורה: שם המנה (בדיוק כמו במסד הנתונים) + נתיב התמונה. לא יותר מזה.
// אפשר להעתיק שורות ישירות מרשימת המנות בעמוד הסל (שדות נוספים כמו id ומחיר מתעלמים).
const DISH_IMAGE_LIST = [
  // מנות ראשונות ועיקריות
  { name: "מאפה פילו בשר + רוטב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026786/manager_images/first_courses/%D7%9E%D7%90%D7%A4%D7%94%20%D7%A4%D7%99%D7%9C%D7%95%20%D7%91%D7%A9%D7%A8%20%D7%A2%D7%9D%20%D7%A8%D7%95%D7%98%D7%91.jpg" },
  { name: "טורטיה בשר", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0115_jsponj.jpg" },
  { name: "פרגית על האש", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026551/manager_images/main_courses/%D7%A1%D7%98%D7%99%D7%99%D7%A7%20%D7%A4%D7%A8%D7%92%D7%99%D7%AA.jpg" },
  // תוספות
  { name: "אורז צהוב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940128/manager_images/side_dishes/%D7%90%D7%95%D7%A8%D7%96%20%D7%A6%D7%94%D7%95%D7%91.jpg" },
  { name: "שעועית ארוכה ברוטב עגבניות", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757941450/manager_images/side_dishes/%D7%A9%D7%A2%D7%95%D7%A2%D7%99%D7%AA%20%D7%90%D7%A8%D7%95%D7%9B%D7%94%20%D7%91%D7%A8%D7%95%D7%98%D7%91%20%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%95%D7%AA.jpg" },
  { name: "דואט תפו'א ובטטה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757939647/manager_images/side_dishes/%D7%93%D7%95%D7%90%D7%98%20%D7%AA%D7%A4%D7%95%27%D7%90%20%D7%95%D7%91%D7%98%D7%98%D7%94.jpg" },
  { name: "תפו'א פריזיאן שלם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411438/IMG-20250713-WA0110_qsz1ry.jpg" },
  // סלטים
  { name: "גזר מרוקאי חי", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0123_oqu4hr.jpg" },
  { name: "טחינה מתובלת", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%98%D7%97%D7%99%D7%A0%D7%94_%D7%9E%D7%AA%D7%95%D7%91%D7%9C%D7%AA_vahf3p.webp" },
  { name: "חמוצי הבית", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100669/manager_images/salads/%D7%97%D7%9E%D7%95%D7%A6%D7%99%20%D7%94%D7%91%D7%99%D7%AA.jpg" },
  { name: "קוביות חציל פיקנטי", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0129_vrhw3n.jpg" },
  { name: "כרוב ושמיר", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940314/manager_images/salads/%D7%9B%D7%A8%D7%95%D7%91%20%D7%95%D7%A9%D7%9E%D7%99%D7%A8.jpg" },
  { name: "כרוב וגזר במיונז", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%95%D7%92%D7%96%D7%A8_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_r8xpo4.jpg" },
  { name: "כרוב אדום במיונז", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%90%D7%93%D7%95%D7%9D_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_wrftkh.jpg" },
  { name: "סלט עגבניות חריף", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_7_bqk4r4.jpg" },
  { name: "מטבוחה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9E%D7%98%D7%91%D7%95%D7%97%D7%94_ziwlal.jpg" },
  { name: "פלפל מתוק בצבעים", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0141_edsu2v.jpg" },
  { name: "תירס מקסיקני", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100721/manager_images/salads/%D7%AA%D7%99%D7%A8%D7%A1%20%D7%9E%D7%A7%D7%A1%D7%99%D7%A7%D7%A0%D7%99.jpg" },
  { name: "תפוחי אדמה במיונז", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100613/manager_images/salads/%D7%AA%D7%A4%D7%95%27%D7%90%20%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96.jpg" },
  { name: "קוביות סלק", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887467/%D7%A7%D7%95%D7%91%D7%99%D7%95%D7%AA_%D7%A1%D7%9C%D7%A7_bkcjei.webp" },
  { name: "סלט בטטה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%A1%D7%9C%D7%98_%D7%91%D7%98%D7%98%D7%94_t9vgji.webp" },
  { name: "סלט ירוק", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_sspqpy.jpg" },
  { name: "חומוס ישראלי", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%97%D7%95%D7%9E%D7%95%D7%A1_%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99_boq1zc.jpg" },
  { name: "פלפל חריף", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411746/IMG-20250713-WA0108_noob7d.jpg" },
];
const normName = (n) => String(n || "").replace(/\s+/g, " ").trim();
const DISH_IMAGES = Object.fromEntries(DISH_IMAGE_LIST.map((d) => [normName(d.name), d.image]));
const getDishImage = (name) => DISH_IMAGES[normName(name)] || "";

// ===== סגנונות משותפים =====
const fieldSx = { mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff", "&:hover fieldset": { borderColor: GOLD }, "&.Mui-focused fieldset": { borderColor: GOLD_DARK } }, "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK } };
const darkBg = "linear-gradient(135deg, #111111 0%, #1d1b18 55%, #2a2418 100%)";


// ============================================================
// קטע תפריט: כותרת, מונה בחירות, וכרטיסי מנות עם תמונה
// ============================================================
const MenuSection = ({ title, note, dishes, selected, setSelected, limit, fishIds, onZoom }) => {
  const count = selected.length;
  const full = count >= limit;

  // בחירה / ביטול בחירה (אי אפשר לעבור את המגבלה)
  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= limit ? prev : [...prev, id]));

  return (
    <Box sx={{ mb: 3, borderRadius: "18px", overflow: "hidden", bgcolor: "#fff", border: "1px solid #eee6d6", boxShadow: "0 4px 22px rgba(23,22,20,0.08)" }}>
      {/* כותרת הקטע + מונה */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 2, background: darkBg, borderBottom: `3px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ color: "#F5E9D0", fontWeight: 800, fontSize: { xs: 18, md: 22 } }}>{title}</Typography>
          <Typography sx={{ color: "#C7BDAA", fontSize: { xs: 12, md: 13.5 }, mt: 0.3, lineHeight: 1.6 }}>
            {full ? "בחרתם את כל המנות. כדי להחליף, בטלו בחירה קיימת." : `בחרו עד ${limit} מנות`}
          </Typography>
        </Box>
        <Box sx={{ flexShrink: 0, px: 1.6, py: 0.7, borderRadius: "999px", border: `1px solid ${full ? GOLD : "#6F5936"}`, bgcolor: full ? GOLD : "transparent", color: full ? INK : "#D9BD86", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", gap: 0.5 }}>
          {full && <CheckIcon sx={{ fontSize: 15 }} />} {count} מתוך {limit}
        </Box>
      </Box>
      <LinearProgress variant="determinate" value={Math.min(100, (count / limit) * 100)} sx={{ height: 3, bgcolor: "#efe7d4", "& .MuiLinearProgress-bar": { bgcolor: GOLD_DARK } }} />

      {note && (
        <Box sx={{ mx: { xs: 2, md: 3 }, mt: 2, p: 1.5, borderRadius: "12px", bgcolor: "#faf7ef", border: "1px dashed #d9c48f", display: "flex", gap: 1, alignItems: "flex-start" }}>
          <InfoOutlinedIcon sx={{ color: GOLD_DARK, fontSize: 19, mt: 0.2 }} />
          <Typography sx={{ fontSize: 13.5, color: "#5b5140", lineHeight: 1.7 }}>{note}</Typography>
        </Box>
      )}

      {/* כרטיסי המנות */}
      <Box sx={{ p: { xs: 1.5, md: 3 }, display: "grid", gap: { xs: 1.2, md: 2 }, gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)" } }}>
        {dishes.map((dish) => {
          const isSel = selected.includes(dish.id);
          const locked = !isSel && full; // הגענו למגבלה: המנה מוחשכת ולא ניתנת לבחירה
          const img = getDishImage(dish.dish_name);

          return (
            <Box key={dish.id} onClick={() => !locked && toggle(dish.id)}
              sx={{ borderRadius: "14px", overflow: "hidden", bgcolor: "#fff", cursor: locked ? "not-allowed" : "pointer", border: "2px solid", borderColor: isSel ? GOLD : "#eee6d6", boxShadow: isSel ? "0 6px 18px rgba(201,169,110,0.35)" : "none", opacity: locked ? 0.4 : 1, filter: locked ? "grayscale(0.7)" : "none", transition: "all 0.2s ease", "&:hover": { borderColor: locked ? "#eee6d6" : GOLD } }}>
              {/* תמונה (בלחיצה עליה - זום) */}
              <Box sx={{ position: "relative", height: { xs: 118, sm: 140 }, bgcolor: "#faf7ef" }}>
                <Box component="img" src={img || defaultDishImage} alt={dish.dish_name}
                  onError={(e) => { if (e.currentTarget.src !== defaultDishImage) { e.currentTarget.onerror = null; e.currentTarget.src = defaultDishImage; } }}
                  sx={{ width: "100%", height: "100%", display: "block", objectFit: img ? "cover" : "contain", p: img ? 0 : 2.5, boxSizing: "border-box" }} />
                {img && (
                  <IconButton aria-label="הגדלת התמונה" onClick={(e) => { e.stopPropagation(); onZoom({ src: img, name: dish.dish_name }); }}
                    sx={{ position: "absolute", bottom: 6, left: 6, width: 30, height: 30, bgcolor: "rgba(0,0,0,0.62)", color: "#fff", "&:hover": { bgcolor: "rgba(0,0,0,0.85)" } }}>
                    <ZoomInIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                )}
                {fishIds?.has(dish.id) && <Box sx={{ position: "absolute", top: 8, right: 8, px: 1, py: 0.2, borderRadius: "8px", bgcolor: INK, color: GOLD, fontSize: 11, fontWeight: 800 }}>🐟 דג</Box>}
              </Box>

              {/* שם המנה + סימון בחירה */}
              <Box sx={{ p: { xs: 1.1, md: 1.4 }, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                <Typography sx={{ fontWeight: 700, fontSize: { xs: 13.5, md: 15 }, lineHeight: 1.4, minHeight: { xs: 38, md: 42 }, display: "flex", alignItems: "center", overflowWrap: "anywhere" }}>{dish.dish_name}</Typography>
                <Box sx={{ width: 26, height: 26, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: isSel ? GOLD : "transparent", border: `2px solid ${isSel ? GOLD : "#cfc5ae"}`, color: INK }}>
                  {isSel && <CheckIcon sx={{ fontSize: 17 }} />}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};


// ============================================================
// הדף הראשי
// ============================================================
const GenericOrder = () => {

  const { state } = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  // נתונים שמגיעים מכרטיס החבילה בעמוד הבית
  const { eventName, pricePerDish, selectionLimits = {}, eventImage, hiddenItems = {}, includeFish, minGuests } = state || {};
  const MIN_GUESTS = Number(minGuests) || DEFAULT_MIN_GUESTS; // המינימום בפועל לחבילה הזו

  // ----- מצב -----
  const [menuData, setMenuData] = useState({});
  const [selectedSalads, setSelectedSalads] = useState([]);
  const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);
  const [selectedMainDishes, setSelectedMainDishes] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [zoomImage, setZoomImage] = useState(null); // זום על תמונת מנה: { src, name }

  // פרטי לקוח
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

  // מצב שליחת ההזמנה (טעינה והצגה)
  const [sending, setSending] = useState(false);
  const [sendingToManager, setSendingToManager] = useState(false);

  // ----- טעינת התפריט המלא מהשרת -----
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiFetch("/api/inventoryAll");
        setMenuData(data);
      } catch (err) {
        setErrorMessage(err.message || "אירעה שגיאה בטעינת התפריט");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // ----- סינון: הסרת מנות נסתרות לפי כרטיס החבילה -----
  const filterVisibleDishes = (dishes, category) => {
    const hidden = hiddenItems[category] || [];
    return (dishes || []).filter((dish) => !hidden.includes(dish.dish_name.trim()));
  };

  // ----- בניית רשימות המנות לתצוגה -----
  // אפשר לקבוע מהכרטיס עם includeFish: true, ואם לא נשלח - מזהים לפי שם האירוע
  const isMemorial = includeFish ?? FISH_EVENTS.some((k) => (eventName || "").includes(k));
  const saladsList = filterVisibleDishes(menuData.salads, "salads");
  const sidesList = filterVisibleDishes(menuData.side_dishes, "side_dishes");
  const mainVisible = filterVisibleDishes(menuData.main_courses, "main_courses");
  const firstVisible = filterVisibleDishes(menuData.first_courses, "first_courses");

  // באזכרה: מוסיפים גם את כל מנות הדגים (מהמנות הראשונות והעיקריות) לבחירה בתוך המנות העיקריות
  const fishAll = isMemorial
    ? [...mainVisible, ...firstVisible].filter((d) => isFishName(d.dish_name)).filter((d, i, arr) => arr.findIndex((x) => x.id === d.id) === i)
    : [];
  const fishIds = new Set(fishAll.map((d) => d.id));
  const mainList = isMemorial ? [...mainVisible.filter((d) => !fishIds.has(d.id)), ...fishAll] : mainVisible;
  const firstList = isMemorial ? firstVisible.filter((d) => !fishIds.has(d.id)) : firstVisible;

  // ----- הגדרת הקטעים (כותרת, מגבלה, רשימה, בחירות) -----
  const sections = [
    { key: "salads", title: "סלטים", limit: selectionLimits.salads || 0, dishes: saladsList, selected: selectedSalads, set: setSelectedSalads },
    { key: "first", title: "מנות ראשונות", limit: selectionLimits.first_courses || 0, dishes: firstList, selected: selectedFirstDishes, set: setSelectedFirstDishes },
    { key: "main", title: "מנות עיקריות", limit: selectionLimits.main_courses || 0, dishes: mainList, selected: selectedMainDishes, set: setSelectedMainDishes, fish: fishIds, note: isMemorial ? "באירוע אזכרה ניתן לבחור גם מנות דגים. הן נספרות במסגרת המנות העיקריות שבחבילה." : "" },
    { key: "sides", title: "תוספות", limit: selectionLimits.side_dishes || 0, dishes: sidesList, selected: selectedSides, set: setSelectedSides },
  ].filter((s) => s.limit > 0 && s.dishes.length > 0);

  const totalLimit = sections.reduce((sum, s) => sum + s.limit, 0);
  const totalSelected = sections.reduce((sum, s) => sum + s.selected.length, 0);
  const guests = Number(guestCount) || 0;
  const totalPriceToShow = (Number(pricePerDish) || 0) * guests;

  // ----- בדיקת פרטי הלקוח -----
  const validateFinalForm = () => {
    let hasFinalError = false;
    const newErrors = {};

    // בדיקת שם מלא
    if (!guestName || guestName.trim().length < 2) { newErrors.guestName = "יש להזין שם מלא תקין"; hasFinalError = true; }

    // בדיקת מספר פלאפון
    const phoneRegex = /^0[5][0-9]{8}$/; // לדוגמה: 0501234567
    if (!phoneNumber) { newErrors.phoneNumber = "יש להזין מספר פלאפון"; hasFinalError = true; }
    else if (!phoneRegex.test(phoneNumber)) { newErrors.phoneNumber = "מספר פלאפון לא תקין"; hasFinalError = true; }

    // בדיקת מייל
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!email) { newErrors.email = "יש להזין כתובת מייל"; hasFinalError = true; }
    else if (!emailRegex.test(email)) { newErrors.email = "כתובת מייל לא תקינה"; hasFinalError = true; }

    // בדיקת מספר מוזמנים
    if (!guestCount || guestCount < MIN_GUESTS) { newErrors.guestCount = `יש להזין לפחות ${MIN_GUESTS} מוזמנים`; hasFinalError = true; }

    // בדיקת תאריך
    if (!eventDate) { newErrors.eventDate = "יש לבחור תאריך אירוע"; hasFinalError = true; }

    // בדיקת מיקום
    if (!eventLocation.trim()) { newErrors.eventLocation = "יש להזין מיקום לאירוע"; hasFinalError = true; }

    setErrors(newErrors);
    return !hasFinalError;
  };

    // אומר שגיאה ללקוח שתאריך לפני 2 ימי עסקים
  const minEventDate = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 3);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  })();

  
  // ----- בדיקת כמות מנות מול המגבלות (רק על קטגוריות שמוצגות בפועל) -----
  const validateSelectionLimits = () => {
    if (sections.length === 0) {
      setErrorMessage(loading ? "התפריט עדיין נטען, נסו שוב בעוד רגע" : "לא הצלחנו לטעון את התפריט. נסו לרענן את העמוד");
      return false;
    }

    const MIN_MSG = { salads: "יש לבחור לפחות סלט אחד", first: "יש לבחור לפחות מנה ראשונה אחת", main: "יש לבחור לפחות מנה עיקרית אחת", sides: "יש לבחור לפחות תוספת אחת" };
    const errs = [];

    sections.forEach((s) => {
      if (s.selected.length > s.limit) errs.push(`חריגה ב${s.title}: עד ${s.limit}`); // חריגה ממגבלה
      if (s.selected.length === 0) errs.push(MIN_MSG[s.key]);                          // מינימום פריט אחד
    });

    if (errs.length > 0) { setErrorMessage(errs.join("\n")); return false; }
    return true;
  };

  // פתיחת מודול סיכום הזמנה עם בדיקת מגבלות
  const handleOrderSummaryClick = () => { if (validateSelectionLimits()) setIsModalOpen(true); };

  // ----- סגירת הזמנה: שליחה לשרת -----
  const handleFinalSubmit = async () => {
    if (!guestName || !guestCount || !eventDate || !eventLocation || !phoneNumber || !email) {
      setErrorMessage("אנא מלא את כל השדות");
      return;
    }

    const orderSummary = createOrderSummary();
    const total = pricePerDish * guestCount;

    setSending(true);

    try {
      const data = await apiFetch("/api/addOrdersOnline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: guestName, userPhone: phoneNumber, guestCount, eventDate,
          orderMenu: orderSummary, totalPrice: total,
          shippingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          email: email, event_location: eventLocation, address: "",
          shippingCost: 0, serviceCost: 0, toolsType: "", eventType: eventName,
        }),
      });

      if (data.message === "נשלח בהצלחה") {
        setErrorMessage(null);
        setIsModalOpen(false);
        setSending(false);
        setSendingToManager(true);
      } else {
        setErrorMessage("אירעה שגיאה בשליחת ההזמנה");
        setSending(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("אירעה שגיאה בשליחת ההזמנה");
      setSending(false);
    }
  };

  // ----- סיכום ההזמנה לשרת: שמות המנות שנבחרו -----
  const createOrderSummary = () => {
    const extractDishNames = (dishes, selected) =>
      dishes?.filter((dish) => selected.includes(dish.id)).map((dish) => ({ dish_name: dish.dish_name, totalPrice: "", totalWeight: "" })) || [];

    return {
      salads: extractDishNames(saladsList, selectedSalads),
      first_courses: extractDishNames(firstList, selectedFirstDishes),
      main_courses: extractDishNames(mainList, selectedMainDishes),
      side_dishes: extractDishNames(sidesList, selectedSides),
    };
  };

  // ----- התפריט שנבחר, מקובץ לפי קטגוריה (להצגה במודול הסיכום) -----
  const chosenGroups = sections
    .map((s) => ({ title: s.title, items: s.dishes.filter((d) => s.selected.includes(d.id)) }))
    .filter((g) => g.items.length > 0);

  // ----- מגן: הגעה לעמוד בלי לבחור חבילה -----
  if (!state) {
    return (
      <>
        <NavbarHome sx={{ padding: 0, margin: 0 }} />
        <Box dir="rtl" sx={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, textAlign: "center", px: 2, pt: 10 }}>
          <Typography variant="h5" fontWeight="bold">לא נבחרה חבילה</Typography>
          <Typography color="text.secondary">חזרו לעמוד הבית ובחרו את החבילה המתאימה לאירוע שלכם.</Typography>
          <Button variant="contained" onClick={() => navigate("/")} sx={{ bgcolor: INK, color: GOLD, fontWeight: 800, borderRadius: "12px", px: 4, "&:hover": { bgcolor: "#2a2418" } }}>חזרה לעמוד הבית</Button>
        </Box>
        <Footer />
      </>
    );
  }


  return (
    <Box sx={{ bgcolor: CREAM }}>
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br /><br /><br />

      {/* ===== תמונת פתיחה (Hero) ===== */}
      <Box sx={{ position: "relative", width: "100%", height: { xs: 270, md: 420 }, overflow: "hidden" }}>
        <Box component="img" src={eventImage} alt={`אירוע ${eventName}`} sx={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(45%)" }} />
        <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)" }} />
        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", color: "#fff", zIndex: 2, px: { xs: 2, md: 3 }, width: "100%", boxSizing: "border-box" }}>
          <Typography sx={{ color: GOLD, fontSize: { xs: 10, md: 12 }, letterSpacing: 3, fontWeight: 700, mb: 1 }}>HAPNINA CATERING</Typography>
          <Typography component="h1" sx={{ fontWeight: 800, color: "#F5E3B8", textShadow: "2px 2px 8px black", mb: 1, fontSize: { xs: "1.6rem", sm: "2rem", md: "3rem" }, lineHeight: 1.2 }}>תפריט לאירוע {eventName}</Typography>
          <Box sx={{ width: 70, height: 2, bgcolor: GOLD, mx: "auto", mb: 1.5 }} />
          <Typography sx={{ textShadow: "1px 1px 4px black", fontSize: { xs: "0.9rem", sm: "1rem", md: "1.3rem" }, mb: 0.6 }}>קייטרינג הפנינה - אוכל ביתי, טרי וכשר למהדרין</Typography>
          <Typography sx={{ textShadow: "1px 1px 4px black", fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" } }}>
            להזמנות: <Box component="a" href="tel:0548520195" sx={{ color: "inherit", textDecoration: "none" }}>079-5152820</Box> | <Box component="a" href="mailto:hpnina6600200@gmail.com" sx={{ color: "inherit", textDecoration: "none" }}>hpnina6600200@gmail.com</Box>
          </Typography>
        </Box>
      </Box>


      <Container dir="rtl" maxWidth="lg" sx={{ mt: { xs: 3, md: 5 }, mb: 6, pb: { xs: 10, md: 8 } }}>
        {loading && <Box sx={{ width: "100%", mb: 2 }}><LinearProgress sx={{ "& .MuiLinearProgress-bar": { bgcolor: GOLD_DARK }, bgcolor: "#efe7d4" }} /></Box>}

        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert severity="error" sx={{ whiteSpace: "pre-line" }}>{errorMessage}</Alert>
        </Snackbar>


        {/* ===== מלל פתיחה ===== */}
        <Box sx={{ textAlign: "center", mb: { xs: 3, md: 5 }, px: { xs: 0.5, sm: 3 } }}>
          <Typography component="h2" sx={{ fontWeight: 800, color: INK, fontSize: { xs: "1.45rem", sm: "1.9rem", md: "2.3rem" }, lineHeight: 1.3, mb: 1.5 }}>
            חבילת <Box component="span" sx={{ color: GOLD_DARK, borderBottom: `2px solid ${GOLD}`, px: "4px" }}>{eventName}</Box>
          </Typography>
          <Typography sx={{ maxWidth: 720, mx: "auto", lineHeight: { xs: 1.8, md: 2 }, fontSize: { xs: "0.92rem", sm: "1rem", md: "1.08rem" }, color: "#3b3528" }}>
            <strong>קייטרינג הפנינה</strong> מגיש אוכל ביתי, טרי וכשר <strong>למהדרין</strong>, בהשגחת “יורה דעה” של הרב מחפוד, מחומרי גלם איכותיים ובהגשה אסתטית שמרשימה כבר מהביס הראשון.
            <br />
            בחרו מהתפריט את המנות האהובות עליכם, ונשוב אליכם בהקדם עם הצעת מחיר מסודרת.
          </Typography>
        </Box>

        {/* ===== מה כלול בחבילה + מחיר ===== */}
        <Box sx={{ mb: 3, borderRadius: "22px", background: darkBg, border: "1px solid #393024", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", p: { xs: 2.5, md: 4 }, textAlign: "center" }}>
          <Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 3, fontWeight: 700, mb: 1 }}>PACKAGE</Typography>
          <Typography sx={{ color: "#C7BDAA", fontSize: { xs: 13, md: 15 } }}>מחיר למנה</Typography>
          <Typography sx={{ color: "#F5E3B8", fontWeight: 800, fontSize: { xs: 40, md: 54 }, lineHeight: 1.1 }}>₪{pricePerDish}</Typography>
          <Typography sx={{ color: "#C7BDAA", fontSize: { xs: 12.5, md: 14 }, mb: 2.5 }}>כולל מע"מ</Typography>

          <Typography sx={{ color: "#E4CC9D", fontWeight: 700, fontSize: { xs: 14, md: 16 }, mb: 1.5 }}>מה כלול בחבילה</Typography>
          <Box sx={{ display: "grid", gap: 1.2, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
            {[
              { label: "סלטים", n: selectionLimits.salads },
              { label: "מנות ראשונות", n: selectionLimits.first_courses },
              { label: "מנות עיקריות", n: selectionLimits.main_courses },
              { label: "תוספות", n: selectionLimits.side_dishes },
            ].filter((x) => x.n > 0).map((x) => (
              <Box key={x.label} sx={{ py: 1.5, borderRadius: "14px", border: "1px solid #5b4a2c", bgcolor: "rgba(201,169,110,0.07)" }}>
                <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: { xs: 26, md: 32 }, lineHeight: 1.1 }}>{x.n}</Typography>
                <Typography sx={{ color: "#F5E9D0", fontSize: { xs: 13, md: 14.5 }, fontWeight: 600 }}>{x.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ===== שימו לב: תנאים ומה לא כלול ===== */}
        <Box sx={{ mb: { xs: 4, md: 5 }, borderRadius: "18px", bgcolor: "#fff", border: `1px solid ${GOLD}`, p: { xs: 2, md: 3 }, boxShadow: "0 4px 22px rgba(23,22,20,0.06)" }}>
          <Typography sx={{ color: GOLD_DARK, fontWeight: 800, fontSize: { xs: 16, md: 18 }, mb: 1.5, display: "flex", alignItems: "center", gap: 0.8 }}>
            <InfoOutlinedIcon sx={{ fontSize: 22 }} /> שימו לב
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "11px", bgcolor: INK, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><GroupsOutlinedIcon /></Box>
            <Typography sx={{ fontSize: { xs: 14, md: 15.5 }, lineHeight: 1.8, color: "#3b3528" }}>
              מינימום הזמנה הינו <strong>{MIN_GUESTS} מנות</strong>, אשר יוגשו בחלוקה שווה של <strong>שליש מכל סוג</strong> עבור כלל האורחים.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", mb: 2 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: "11px", bgcolor: INK, color: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><ReceiptLongOutlinedIcon /></Box>
            <Typography sx={{ fontSize: { xs: 14, md: 15.5 }, lineHeight: 1.8, color: "#3b3528" }}>
              מחיר למנה: <strong>{pricePerDish} ₪ כולל מע'מ</strong>. <strong>המחיר כולל אוכל בלבד.</strong>
            </Typography>
          </Box>

          <Typography sx={{ fontWeight: 800, fontSize: 14, color: "#7a1f1f", mb: 1 }}>לא כלול במחיר:</Typography>
          <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
            {[
              { icon: <AutoAwesomeOutlinedIcon />, text: "שירותי הפקה" },
              { icon: <RoomServiceOutlinedIcon />, text: "מלצרים" },
              { icon: <LocalShippingOutlinedIcon />, text: "משלוח" },
              { icon: <RestaurantOutlinedIcon />, text: "כלים" },
            ].map((x) => (
              <Box key={x.text} sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1.1, borderRadius: "12px", bgcolor: "#fbf3f3", border: "1px solid #ecd0d0", color: "#7a1f1f", fontWeight: 700, fontSize: 14, "& svg": { fontSize: 20 } }}>
                {x.icon} {x.text}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ===== איך זה עובד ===== */}
        <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, mb: { xs: 4, md: 5 } }}>
          {[
            { n: 1, t: "בוחרים מנות", d: "מסמנים את המנות האהובות עליכם בכל קטגוריה, עד המגבלה של החבילה." },
            { n: 2, t: "ממלאים פרטים", d: "בסיכום ההזמנה בודקים את התפריט ומשאירים פרטים ליצירת קשר." },
            { n: 3, t: "מקבלים הצעת מחיר", d: "נציגנו יחזור אליכם בהקדם עם הצעת מחיר מסודרת." },
          ].map((s) => (
            <Box key={s.n} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", bgcolor: "#fff", border: "1px solid #eee6d6", borderRadius: "16px", p: 2 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: "50%", bgcolor: GOLD, color: INK, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s.n}</Box>
              <Box>
                <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{s.t}</Typography>
                <Typography sx={{ fontSize: 13.5, color: "#6b6254", lineHeight: 1.7 }}>{s.d}</Typography>
              </Box>
            </Box>
          ))}
        </Box>


        {/* ===== קטעי התפריט: סלטים, ראשונות, עיקריות (כולל דגים באזכרה), תוספות ===== */}
        {sections.map((s) => (
          <MenuSection key={s.key} title={s.title} note={s.note} dishes={s.dishes} selected={s.selected} setSelected={s.set} limit={s.limit} fishIds={s.fish} onZoom={setZoomImage} />
        ))}

        <Box sx={{ textAlign: "center", mt: 4, width: "100%" }}>
          <Button size="large" onClick={handleOrderSummaryClick}
            sx={{ px: 6, minHeight: 54, borderRadius: "12px", fontWeight: 800, fontSize: 18, color: "#131313", border: "1px solid #E4CC9D", background: "linear-gradient(135deg, #C9A96E 0%, #E4CC9D 50%, #C9A96E 100%)", boxShadow: "0 6px 16px rgba(201,169,110,0.35)", "&:hover": { background: "linear-gradient(135deg, #B89555 0%, #D9BD86 50%, #B89555 100%)" } }}>
            המשך בהזמנה
          </Button>
        </Box>
      </Container>

 {/* כפתורי קשר צפים - וואטסאפ וטלפון */}
      <Box
        sx={{
          position: "fixed",
          right: { xs: 14, md: 24 },
          bottom: { xs: 60, md: 60 },
          zIndex: 1500,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {/* WhatsApp */}
        <IconButton
          component="a"
          href="https://wa.me/972548520195"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שלחו לנו הודעה בוואטסאפ"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#fff",
            bgcolor: "#25D366",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              bgcolor: "#1ebe5d",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(37,211,102,0.35)",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 29, md: 33 } }} />
        </IconButton>
      
        {/* שיחת טלפון */}
        <IconButton
          component="a"
          href="tel:0795152820"
          aria-label="התקשרו אלינו"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#17130a",
            background: "linear-gradient(135deg, #f5df9b, #c6a24b)",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #ffe9a8, #d4b45f)",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(198,162,75,0.35)",
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: { xs: 26, md: 30 } }} />
        </IconButton>


      </Box>


      <Box dir="rtl"><Footer /></Box>


      {/* ===== פס תחתון קבוע: כמה נבחרו + המשך ===== */}
      {sections.length > 0 && !isModalOpen && !sendingToManager && (
        <Box dir="rtl" sx={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, px: { xs: 2, md: 4 }, py: 1.2, bgcolor: INK, borderTop: `1px solid ${GOLD}`, boxShadow: "0 -6px 20px rgba(0,0,0,0.25)" }}>
          <Box sx={{ flex: 1, minWidth: 0, maxWidth: 360 }}>
            <Typography sx={{ color: "#F1D7A5", fontWeight: 800, fontSize: { xs: 13.5, md: 15 } }}>נבחרו {totalSelected} מתוך {totalLimit} מנות</Typography>
            <LinearProgress variant="determinate" value={totalLimit ? (totalSelected / totalLimit) * 100 : 0} sx={{ mt: 0.7, height: 4, borderRadius: 2, bgcolor: "#3a3326", "& .MuiLinearProgress-bar": { bgcolor: GOLD } }} />
          </Box>
          <Button onClick={handleOrderSummaryClick} sx={{ px: { xs: 2.5, md: 4 }, height: 44, borderRadius: "12px", fontWeight: 800, flexShrink: 0, color: "#131313", background: "linear-gradient(135deg, #C9A96E 0%, #E4CC9D 100%)" }}>המשך בהזמנה</Button>
        </Box>
      )}


      {/* ===== זום על תמונת מנה (מסך מלא) ===== */}
      <Dialog fullScreen open={!!zoomImage} onClose={() => setZoomImage(null)} PaperProps={{ sx: { bgcolor: "rgba(0,0,0,0.96)" } }}>
        <Box onClick={() => setZoomImage(null)} sx={{ position: "relative", width: "100%", height: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: { xs: 1, md: 4 }, boxSizing: "border-box" }}>
          <IconButton aria-label="יציאה מהתמונה" onClick={(e) => { e.stopPropagation(); setZoomImage(null); }}
            sx={{ position: "absolute", top: 12, right: 12, zIndex: 2, color: "#fff", bgcolor: "rgba(255,255,255,0.14)", "&:hover": { bgcolor: "rgba(255,255,255,0.26)" } }}>
            <CloseIcon />
          </IconButton>
          {zoomImage && (
            <>
              <Box component="img" src={zoomImage.src} alt={zoomImage.name} onClick={(e) => e.stopPropagation()} sx={{ maxWidth: "100%", maxHeight: "85%", objectFit: "contain", borderRadius: 2 }} />
              <Typography sx={{ color: "#F5E3B8", fontWeight: 700, fontSize: 18, mt: 2, textAlign: "center" }}>{zoomImage.name}</Typography>
            </>
          )}
        </Box>
      </Dialog>


      {/* ===== מודול סיכום הזמנה: התפריט שנבחר + טופס שליחה ===== */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} fullScreen={isMobile} fullWidth maxWidth="sm"
        PaperProps={{ dir: "rtl", sx: { borderRadius: isMobile ? 0 : "22px", bgcolor: CREAM } }}>

        {/* כותרת המודול */}
        <Box sx={{ position: "relative", px: 3, py: 3, background: darkBg, borderBottom: `3px solid ${GOLD}` }}>
          <IconButton aria-label="סגירה" onClick={() => setIsModalOpen(false)} sx={{ position: "absolute", top: 10, left: 10, color: GOLD }}><CloseIcon /></IconButton>
          <Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 3, fontWeight: 700, mb: 0.5 }}>ORDER SUMMARY</Typography>
          <Typography sx={{ color: "#F5E9D0", fontWeight: 800, fontSize: { xs: 24, md: 28 } }}>סיכום ההזמנה</Typography>
          <Typography sx={{ color: "#C7BDAA", fontSize: 14, mt: 0.5 }}>חבילת {eventName}</Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, overflowY: "auto" }}>

          {/* התפריט שנבחר */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 1.5 }}>התפריט שבחרת</Typography>
          {chosenGroups.map((g) => (
            <Box key={g.title} sx={{ mb: 1.5, bgcolor: "#fff", border: "1px solid #eee6d6", borderRadius: "14px", overflow: "hidden" }}>
              <Box sx={{ px: 1.8, py: 0.9, bgcolor: INK, color: GOLD, fontWeight: 800, fontSize: 14 }}>{g.title} ({g.items.length})</Box>
              {g.items.map((d) => {
                const img = getDishImage(d.dish_name);
                return (
                  <Box key={d.id} sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 1.5, py: 1, borderTop: "1px solid #f1ead9" }}>
                    <Box component="img" src={img || defaultDishImage} alt={d.dish_name} onError={(e) => { if (e.currentTarget.src !== defaultDishImage) { e.currentTarget.onerror = null; e.currentTarget.src = defaultDishImage; } }}
                      sx={{ width: 46, height: 46, borderRadius: "10px", objectFit: img ? "cover" : "contain", bgcolor: "#faf7ef", flexShrink: 0 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{d.dish_name}</Typography>
                  </Box>
                );
              })}
            </Box>
          ))}

          {/* מחיר */}
          <Box sx={{ mt: 2, mb: 3, p: 2, borderRadius: "14px", bgcolor: "#fff", border: `1px solid ${GOLD}` }}>
            <Box display="flex" justifyContent="space-between" gap={2} sx={{ mb: 0.8 }}>
              <Typography>מחיר למנה (כולל מע"מ)</Typography>
              <Typography fontWeight={800}>₪ {pricePerDish}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" gap={2} sx={{ mb: 0.8 }}>
              <Typography>מספר מוזמנים</Typography>
              <Typography fontWeight={800}>{guests > 0 ? guests : "-"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap={2} sx={{ pt: 1, borderTop: "1px dashed #d9c48f" }}>
              <Typography fontWeight={800} fontSize={17}>סה"כ משוער</Typography>
              <Typography fontWeight={800} fontSize={22} color="success.main" sx={{ whiteSpace: "nowrap" }}>{guests > 0 ? `₪ ${totalPriceToShow.toFixed(2)}` : "-"}</Typography>
            </Box>
            <Typography sx={{ mt: 1, fontSize: 12.5, color: "#7a1f1f", lineHeight: 1.7 }}>המחיר כולל אוכל בלבד ואינו כולל שירותי הפקה, מלצרים, משלוח או כלים. ההצעה הסופית תישלח אליכם לאחר יצירת קשר.</Typography>
          </Box>

          {/* טופס שליחה */}
          <Typography sx={{ fontWeight: 800, fontSize: 18, mb: 0.5 }}>פרטי לקוח</Typography>
          <Typography sx={{ color: "#6b6254", fontSize: 13.5, mb: 2, lineHeight: 1.7 }}>מלאו את הפרטים ונחזור אליכם בהקדם עם הצעת המחיר.</Typography>

          <TextField fullWidth label="שם מלא" autoComplete="name" value={guestName} onChange={(e) => setGuestName(e.target.value)} sx={fieldSx} error={Boolean(errors.guestName)} helperText={errors.guestName || ""} />
          <TextField fullWidth label="מספר פלאפון" type="tel" autoComplete="tel" inputProps={{ inputMode: "tel" }} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} sx={fieldSx} error={Boolean(errors.phoneNumber)} helperText={errors.phoneNumber || ""} />
          <TextField fullWidth label="כתובת מייל" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} sx={fieldSx} error={Boolean(errors.email)} helperText={errors.email || ""} />
          <TextField fullWidth label="מספר מוזמנים" type="number" value={guestCount === 0 ? "" : guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} sx={fieldSx} error={Boolean(errors.guestCount)} helperText={errors.guestCount || `מינימום ${MIN_GUESTS} מוזמנים`} />
        <TextField
                         fullWidth
                         label="תאריך ביצוע ההזמנה"
                         type="date"
                         InputLabelProps={{ shrink: true }}
                         inputProps={{ min: minEventDate }}
                         value={eventDate}
                         onChange={(e) => setEventDate(e.target.value)}
                         error={Boolean(errors.eventDate)}
                         helperText={errors.eventDate || "ניתן לבחור תאריך החל משלושה ימים מהיום"}
                         sx={fieldSx}
                       />

          <Button fullWidth disabled={sending} onClick={() => { if (validateFinalForm()) handleFinalSubmit(); }}
            sx={{ minHeight: 54, color: "#131313", border: "1px solid #E4CC9D", borderRadius: "12px", fontWeight: 800, fontSize: 18, background: "linear-gradient(135deg, #C9A96E 0%, #E4CC9D 50%, #C9A96E 100%)", boxShadow: "0 6px 16px rgba(201,169,110,0.35)", "&:hover": { background: "linear-gradient(135deg, #B89555 0%, #D9BD86 50%, #B89555 100%)" }, "&.Mui-disabled": { background: "#D8C6A5", color: "#6B6252" } }}>
            {sending ? "שולח..." : "שלח הזמנה"}
          </Button>
          <Typography sx={{ mt: 1.5, textAlign: "center", fontSize: 12.5, color: "#7a7160", lineHeight: 1.7 }}>אין חיוב בשלב זה. שליחת ההזמנה היא בקשה להצעת מחיר.</Typography>
        </Box>
      </Dialog>


      {/* ===== הודעת ברכה לאחר שליחה (ואז חזרה לעמוד הראשי) ===== */}
      {sendingToManager && (
        <Dialog open={sendingToManager} onClose={() => navigate("/")} fullScreen
          PaperProps={{ sx: { m: 0, p: 0, height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(0, 0, 0, 0.6)", position: "relative", overflow: "hidden" } }}
          BackdropProps={{ sx: { backgroundColor: "rgba(0, 0, 0, 0.6)" } }}>

          {/* קונפטי ברקע */}
          <Box sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 1500, pointerEvents: "none" }}>
            <Confetti width={window.innerWidth} height={window.innerHeight} colors={["#C9A96E", "#E4CC9D", "#8c6a25", "#ffffff", "#171614"]} />
          </Box>

          {/* תוכן הברכה */}
          <Box dir="rtl" sx={{ position: "relative", zIndex: 1600, bgcolor: "#fff", borderRadius: "22px", overflow: "hidden", width: { xs: "90%", sm: 440 }, maxWidth: 440, textAlign: "center", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}>
            <Box sx={{ py: 3, background: darkBg, borderBottom: `3px solid ${GOLD}` }}>
              <Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 3, fontWeight: 700 }}>HAPNINA CATERING</Typography>
              <Typography sx={{ color: "#F5E9D0", fontWeight: 800, fontSize: 30, mt: 0.5 }}>תודה רבה!</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 19, color: "#1F8A70", mb: 1.5 }}>ההזמנה התקבלה בהצלחה</Typography>
              <Typography sx={{ mb: 3, lineHeight: 1.8, color: "#3b3528" }}>נשוב אליכם בהקדם עם הצעת המחיר. תודה שבחרתם בקייטרינג הפנינה.</Typography>
              <Button fullWidth onClick={() => navigate("/")} sx={{ minHeight: 50, borderRadius: "12px", fontWeight: 800, fontSize: 16, bgcolor: INK, color: GOLD, border: `1px solid ${GOLD}`, "&:hover": { bgcolor: "#2a2418" } }}>חזרה לעמוד הבית</Button>
            </Box>
          </Box>
        </Dialog>
      )}
    </Box>
  );
};

export default GenericOrder;
