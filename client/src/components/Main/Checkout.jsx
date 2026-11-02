import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Paper,
  Divider,
  TextField,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLocation } from "react-router-dom";
import NavbarHome from "./NavbarHome";
import TextMove from "./textMove";
import { apiFetch } from "../api";
import defaultDishImage from "../../assets/imgs/imgdifolt.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import HomeIcon from "@mui/icons-material/Home";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// ---- ייבואים חדשים ----
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";


// ============================================================
// עמוד סיכום הזמנה באוכל מוכן
// ============================================================


// מינימום הזמנה (על המנות, לא כולל תוספות)
const MIN_ORDER = 1500;

// ============================================================
// מתג תוספות מעבר לתפריט (עוגות, פטיפורים, לחם, שתייה)
// false = מושעה: לא מוצג בעמוד, לא נקרא, ולא נשלח לשרת.
// כשהבעלים ירצה להפעיל: משנים ל-true, וזה הכול.
// ============================================================
const ENABLE_ADDONS = false;

// ---------- תוספות להזמנה ----------
// <-- עדכן כאן שמות ומחירים. המחיר הוא מחיר סופי ללקוח, כולל מע"מ.
// ה-id חייב להיות ייחודי ושונה מה-id של המנות בתפריט (המנות הן 1-95).
const ADDON_CATEGORIES = [
  { key: "cakes", title: "עוגות ועוגיות", emoji: "🍰" },
  { key: "petitfours", title: "פטיפורים", emoji: "🧁" },
  { key: "bread", title: "לחם", emoji: "🥖" },
  { key: "drinks", title: "שתייה", emoji: "🥤" },
];
const ADDONS = [
  // עוגות ועוגיות
  { id: 901, category: "cakes", name: "עוגת שוקולד", unit: "ליחידה", price: 60 },
  { id: 902, category: "cakes", name: "עוגת גבינה", unit: "ליחידה", price: 70 },
  { id: 903, category: "cakes", name: "מגש עוגיות בית", unit: "למגש", price: 90 },
  // פטיפורים
  { id: 911, category: "petitfours", name: "מגש פטיפורים", unit: "למגש", price: 120 },
  { id: 912, category: "petitfours", name: "מגש פטיפורים שוקולד", unit: "למגש", price: 130 },
  // לחם
  { id: 921, category: "bread", name: "חלות", unit: "ליחידה", price: 12 },
  { id: 922, category: "bread", name: "לחמניות", unit: "לשישייה", price: 25 },
  // שתייה
  { id: 931, category: "drinks", name: "שתייה קלה 1.5 ליטר", unit: "לבקבוק", price: 12 },
  { id: 932, category: "drinks", name: "מים מינרליים", unit: "לשישייה", price: 20 },
];



// ---------- סגנונות ----------------------------------------------
const GOLD = "#C9A96E";
const GOLD_DARK = "#8c6a25";
const INK = "#171614";

const fieldSx = {
  mb: 2,
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#fff",
    "&:hover fieldset": { borderColor: GOLD },
    "&.Mui-focused fieldset": { borderColor: GOLD_DARK },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: GOLD_DARK },
};

const cardSx = {
  background: "#fff",
  borderRadius: "18px",
  p: { xs: 2, md: 3 },
  boxShadow: "0 4px 22px rgba(23,22,20,0.08)",
  border: "1px solid #eee6d6",
};






export default function Checkout() {
  const { state } = useLocation();

  const [cart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } catch {
      return [];
    }
  });

  // ---------- תוספות שהלקוח בחר: { [id]: כמות } ----------
  const [addons, setAddons] = useState(() => {
    if (!ENABLE_ADDONS) return {};
    try {
      return JSON.parse(localStorage.getItem("checkoutAddons")) || {};
    } catch {
      return {};
    }
  });


  const [addonTab, setAddonTab] = useState(ADDON_CATEGORIES[0].key);

  useEffect(() => {
    if (!ENABLE_ADDONS) return;
    try {
      localStorage.setItem("checkoutAddons", JSON.stringify(addons));
    } catch {
      /* מתעלמים אם אין גישה לאחסון */
    }
  }, [addons]);

  const setAddonQty = (id, qty) =>
    setAddons((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });

    
  const selectedAddons = !ENABLE_ADDONS ? [] : ADDONS.filter((a) => (addons[a.id] || 0) > 0).map((a) => ({
    ...a,
    quantity: addons[a.id],
  }));

  const productsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const deliveryPrice = 0;
  const totalPrice = productsTotal + addonsTotal + deliveryPrice;

  const totalIncludingVat = totalPrice;
  const priceBeforeVat = totalIncludingVat / 1.18;
  const vatAmount = totalIncludingVat - priceBeforeVat;

  const missingForMinimum = Math.max(0, MIN_ORDER - productsTotal);

  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // ---------- כפתור צף בטלפון: מעבר לטופס ----------
  const formRef = useRef(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFormVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);


  // פונקציה שמייצרת את סיכום ההזמנה
  const createOrderSummary = () => {
    const order = {
      salads: [],
      first_courses: [],
      main_courses: [],
      side_dishes: [],
      other_items: [],
    };

    cart.forEach((item) => {
      const quantity = Number(item.quantity) || 0;

      const dish = {
        id: item.id,
        dish_name: item.name.trim(),
        price: Number(item.price) || 0,
        quantity,
        unit: item.unit || "",
        totalPrice: Number(
          ((Number(item.price) || 0) * quantity).toFixed(2)
        ),

        // מעביר למנהל את הכמות שנבחרה בסל
        totalWeight: quantity,

        category: item.category,
      };

      switch (item.category) {
        case "סלטים":
          order.salads.push(dish);
          break;

        case "ראשונות":
        case "מנות ראשונות":
          order.first_courses.push(dish);
          break;

        case "עיקריות":
        case "מנות עיקריות":
        case "בשרים":
        case "דגים":
          order.main_courses.push(dish);
          break;

        case "תוספות":
          order.side_dishes.push(dish);
          break;

        default:
          order.other_items.push(dish);
          break;
      }
    });

    // התוספות שהלקוח הוסיף בעמוד הסיכום (עוגות, פטיפורים, לחם, שתייה) נשמרות בתוך התוספות
    selectedAddons.forEach((addon) => {
      order.side_dishes.push({
        id: addon.id,
        dish_name: addon.name.trim(),
        price: addon.price,
        quantity: addon.quantity,
        unit: addon.unit || "",
        totalPrice: Number((addon.price * addon.quantity).toFixed(2)),
        totalWeight: addon.quantity,
        category: "תוספות",
      });
    });

    return order;
  };

  // בדיקת הלקוח לפני שליחה
  const validateFinalForm = () => {
    const newErrors = {};

    // בדיקת שם מלא
    if (!guestName.trim() || guestName.trim().length < 2) {
      newErrors.guestName = "יש להזין שם מלא תקין";
    }

    // בדיקת מספר טלפון ישראלי
    if (!/^05\d{8}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "יש להזין מספר פלאפון תקין, לדוגמה 0501234567";
    }

    // בדיקת כתובת Gmail בלבד
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(email.trim())) {
      newErrors.email = "יש להזין כתובת Gmail תקינה המסתיימת ב-@gmail.com";
    }

    // תאריך מינימלי: שלושה ימים קלנדריים מהיום
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 3);

    // המרת התאריך שנבחר לתאריך מקומי
    const selectedDate = eventDate
      ? new Date(`${eventDate}T00:00:00`)
      : null;

    // בדיקת תאריך
    if (!eventDate) {
      newErrors.eventDate = "יש לבחור תאריך לאירוע";
    } else if (
      !selectedDate ||
      Number.isNaN(selectedDate.getTime())
    ) {
      newErrors.eventDate = "התאריך שהוזן אינו תקין";
    } else if (selectedDate < minDate) {
      newErrors.eventDate =
        "לא ניתן לבצע הזמנה בהתראה קצרה. יש להזמין לפחות 2 ימי עסקים מראש, ולכן ניתן לבחור תאריך החל משלושה ימים מהיום";
    }

    // בדיקת כתובת משלוח
    if (!eventLocation.trim()) {
      newErrors.eventLocation = "יש להזין כתובת משלוח";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // שליחת סיכום הזמנה לשרת למסד נתונים
  const handleFinalSubmit = async () => {
    setErrorMessage("");
    // בדיקת סכום מינימלי לפני שליחה לשרת (על המנות, בלי התוספות)
    if (productsTotal < MIN_ORDER) {
      setErrorMessage(
        `סכום ההזמנה המינימלי הוא 1,500 ₪. כרגע סכום המנות שלך הוא ${productsTotal.toFixed(2)} ₪.`
      );
      return;
    }

    setErrors({});
    setErrorMessage("");

    if (!validateFinalForm()) return;

    if (cart.length === 0) {
      setErrorMessage("סל הקניות ריק");
      return;
    }

    setSending(true);

    try {
      const customerOrderSummary = createOrderSummary();

      const response = await apiFetch("/api/addOrdersOnline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: guestName.trim(),
          userPhone: phoneNumber.trim(),
          guestCount: Number(guestCount) || 0,
          eventDate,
          orderMenu: customerOrderSummary,
          totalPrice: Number(totalPrice.toFixed(2)),
          shippingDate: new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          email: email.trim(),
          event_location: eventLocation.trim(),
          address: eventLocation.trim(),
          shippingCost: deliveryPrice,
          serviceCost: 0,
          toolsType: "",
          eventType: "אוכל מוכן",
        }),
      });

      if (response.message === "נשלח בהצלחה") {
        localStorage.removeItem("cart");
        localStorage.removeItem("checkoutAddons");
        setSending(false);
        setShowSuccessDialog(true);
      } else {
        setSending(false);
        setErrorMessage(
          response.message || "אירעה שגיאה בשליחת ההזמנה"
        );
      }
    } catch (error) {
      console.error("שגיאה בשמירת ההזמנה:", error);
      setSending(false);
      console.log(error);

      setErrorMessage("אירעה שגיאה בשליחת ההזמנה");
    }
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

  const activeAddons = ADDONS.filter((a) => a.category === addonTab);
  const addonCountInCategory = (key) =>
    selectedAddons.filter((a) => a.category === key).length;






  return (
    <Box
      sx={{
        direction: "rtl",
        background: "#f6f3ec",
        minHeight: "100vh",
        pb: { xs: 12, md: 8 },
      }}
    >

      <NavbarHome />
      <br /><br /><br /><br />
      <TextMove />


      {/* סרגל עליון – סיכום הזמנה בעיצוב שחור וזהב */}
      <Box
        dir="rtl"
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, sm: 2, md: 4 },
          py: 1,
          boxSizing: "border-box",
          bgcolor: INK,
          borderBottom: "1px solid #51432D",
          minHeight: 48,
        }}
      >
        {/* שלבי ההזמנה */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1 },
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          {[
            { number: 1, label: "בחירה" },
            { number: 2, label: "סיכום" },
            { number: 3, label: "פרטים ושליחה" },
          ].map((step, index) => {
            const activeStep = 2;
            const active = step.number === activeStep;
            const completed = step.number < activeStep;

            return (
              <React.Fragment key={step.number}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.6,
                    flexShrink: 0,
                  }}
                >
                  {/* עיגול שלב */}
                  <Box
                    sx={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      bgcolor: active ? GOLD : "transparent",
                      color: active ? INK : completed
                        ? "#D9BD86"
                        : "#8D8980",
                      border: active
                        ? "1px solid #E4CC9D"
                        : completed
                          ? "1px solid #9C7B47"
                          : "1px solid #514735",
                      boxSizing: "border-box",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {step.number}
                  </Box>

                  {/* כיתוב שלב */}
                  <Typography
                    sx={{
                      fontSize: { xs: 10, sm: 11 },
                      fontWeight: active ? 800 : 500,
                      color: active
                        ? "#F1D7A5"
                        : completed
                          ? GOLD
                          : "#8D8980",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>

                {/* קו בין השלבים */}
                {index < 2 && (
                  <Box
                    sx={{
                      width: { xs: 7, sm: 18, md: 28 },
                      height: "1px",
                      background: completed
                        ? GOLD
                        : "#40392E",
                      flexShrink: 1,
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* כפתור חזרה לעמוד הבית – צד שמאל */}
        <IconButton
          aria-label="חזרה לעמוד הראשי"
          onClick={() => navigate("/")}
          sx={{
            width: 30,
            height: 30,
            minWidth: 30,
            color: "#D9BD86",
            bgcolor: "#29251E",
            border: "1px solid #51432D",
            borderRadius: "8px",
            flexShrink: 0,
            "&:hover": {
              bgcolor: "#3A3021",
              color: "#F5DDAA",
              borderColor: GOLD,
            },
          }}>
          <HomeIcon sx={{ fontSize: 17 }} />
        </IconButton>
      </Box>


      <Box sx={{ maxWidth: 1200, mx: "auto", px: { xs: 2, md: 5 } }}>

        {/* כפתור חזרה לעריכת ההזמנה */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: 3,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowForwardIosIcon />}
            onClick={() => navigate("/MainCourse")}
            sx={{
              direction: "rtl",
              color: GOLD_DARK,
              borderColor: "#b89546",
              borderRadius: "12px",
              px: 2.5,
              py: 1.2,
              fontWeight: 700,
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#faf7ef",
                borderColor: GOLD_DARK,
              },
            }}
          >
            חזרה לעריכת ההזמנה
          </Button>
        </Box>


        {/* ===== כותרת העמוד ===== */}
        <Box
          sx={{
            textAlign: "center",
            borderRadius: "22px",
            px: { xs: 2.5, md: 6 },
            py: { xs: 4, md: 5 },
            mb: 3,
            background: "linear-gradient(135deg, #111111 0%, #1d1b18 55%, #111111 100%)",
            border: "1px solid #393024",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            sx={{ color: GOLD, fontSize: 11, letterSpacing: 3, fontWeight: 700, mb: 1 }}
          >
            ORDER SUMMARY
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: "#F5E9D0",
              fontWeight: 800,
              fontSize: { xs: 32, md: 46 },
              lineHeight: 1.2,
            }}
          >
            סיכום ההזמנה
          </Typography>

          <Typography
            sx={{
              color: "#C7BDAA",
              fontSize: { xs: 14, md: 17 },
              lineHeight: 1.9,
              maxWidth: 680,
              mx: "auto",
              mt: 1.5,
            }}
          >
            {ENABLE_ADDONS
              ? "הנה כל מה שבחרתם. עברו על המנות, הוסיפו עוגות, פטיפורים, לחם ושתייה אם תרצו, ואז מלאו את הפרטים בסוף העמוד כדי לשלוח את ההזמנה."
              : "הנה כל מה שבחרתם. עברו על המנות ואז מלאו את הפרטים בסוף העמוד כדי לשלוח את ההזמנה."}
          </Typography>

          <Typography
            sx={{ color: "#E4CC9D", fontWeight: 700, fontSize: { xs: 14, md: 17 }, mt: 2 }}
          >
            מינימום הזמנה 1500 ש'ח
          </Typography>
        </Box>

        {/* ===== מידע חשוב ===== */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            {
              icon: <LocalShippingOutlinedIcon />,
              title: "משלוח",
              text: "שימו לב: מחיר ההזמנה אינו כולל דמי משלוח.",
            },
            {
              icon: <EventAvailableOutlinedIcon />,
              title: "הזמנה מראש",
              text: "יש להזמין לפחות 2 ימי עסקים מראש. ניתן לבחור תאריך החל משלושה ימים מהיום.",
            },
            {
              icon: <SupportAgentOutlinedIcon />,
              title: "אישור סופי",
              text: "לאחר שליחת ההזמנה נציגנו יחזור אליכם. המחיר הסופי יוצג לאישור לאחר יצירת קשר.",
            },
          ].map((info) => (
            <Box
              key={info.title}
              sx={{
                display: "flex",
                gap: 1.5,
                alignItems: "flex-start",
                bgcolor: "#fff",
                border: "1px solid #eee6d6",
                borderRadius: "16px",
                p: 2,
                boxShadow: "0 3px 14px rgba(23,22,20,0.05)",
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "12px",
                  bgcolor: INK,
                  color: GOLD,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {info.icon}
              </Box>
              <Box>
                <Typography fontWeight={800} fontSize={15} sx={{ color: "#2b2418" }}>
                  {info.title}
                </Typography>
                <Typography fontSize={13.5} sx={{ color: "#6b6254", lineHeight: 1.7, mt: 0.3 }}>
                  {info.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>


        {/* ===== תוכן העמוד ===== */}
        <Grid container spacing={{ xs: 3, md: 4 }} sx={{ width: "100%" }}>

          {/* ---------- עמודה ראשית: מוצרים, תוספות, מחיר ---------- */}
          <Grid size={{ xs: 12, md: 7 }}>

            {/* רשימת מוצרים */}
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5, gap: 1 }}>
                <Typography fontWeight="bold" fontSize={22}>המוצרים שבחרת</Typography>
                <Chip
                  label={`${cart.length} מוצרים`}
                  size="small"
                  sx={{ bgcolor: INK, color: "#E4CC9D", fontWeight: 700 }}
                />
              </Box>

              {cart.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    הסל שלך ריק. חזרו לתפריט כדי לבחור מנות.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/MainCourse")}
                    sx={{ color: GOLD_DARK, borderColor: "#b89546", borderRadius: "12px", fontWeight: 700 }}
                  >
                    חזרה לתפריט
                  </Button>
                </Box>
              )}

              {cart.map((item) => (
                <Card
                  key={item.id}
                  sx={{
                    mb: 1.5,
                    borderRadius: "14px",
                    boxShadow: "none",
                    border: "1px solid #eee6d6",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ display: "flex", direction: "rtl", alignItems: "center", gap: 2, p: 1.5 }}>
                    <CardMedia
                      component="img"
                      image={item.image?.trim() || defaultDishImage}
                      alt={item.name}
                      onError={(e) => {
                        if (e.currentTarget.src !== defaultDishImage) {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultDishImage;
                        }
                      }}
                      sx={{
                        width: { xs: 76, md: 88 },
                        minWidth: { xs: 76, md: 88 },
                        height: { xs: 76, md: 88 },
                        borderRadius: "12px",
                        objectFit: "cover",
                        bgcolor: "#fff",
                      }}
                    />

                    <CardContent sx={{ p: 0, flex: 1, minWidth: 0, "&:last-child": { pb: 0 } }}>
                      <Typography
                        fontWeight="bold"
                        fontSize={{ xs: 16, md: 18 }}
                        sx={{ lineHeight: 1.4, overflowWrap: "anywhere" }}
                      >
                        {item.name}
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mt: 0.8 }}>
                        <Chip label={item.unit} size="small" />
                        <Typography variant="body2" color="text.secondary">
                          ₪ {Number(item.price).toFixed(2)} × {item.quantity}
                        </Typography>
                      </Box>
                    </CardContent>

                    <Box sx={{ textAlign: "left", flexShrink: 0 }}>
                      <Typography fontSize={{ xs: 11, md: 12 }} color="text.secondary">
                        סה"כ
                      </Typography>
                      <Typography
                        fontWeight="bold"
                        fontSize={{ xs: 17, md: 19 }}
                        color="success.main"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        ₪ {(Number(item.price) * Number(item.quantity)).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              ))}

              {/* הודעת מינימום */}
              {cart.length > 0 && missingForMinimum > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.8,
                    borderRadius: "12px",
                    bgcolor: "#fff4f4",
                    border: "1px solid #f1c9c9",
                    display: "flex",
                    gap: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <InfoOutlinedIcon sx={{ color: "#940b11", fontSize: 20, mt: 0.2 }} />
                  <Typography sx={{ color: "#940b11", fontSize: 14, fontWeight: 600, lineHeight: 1.7 }}>
                    סכום המנות הוא ₪{productsTotal.toFixed(2)}. חסרים עוד ₪{missingForMinimum.toFixed(2)} כדי להגיע
                    למינימום ההזמנה{ENABLE_ADDONS ? " (התוספות אינן נספרות במינימום)" : ""}. אפשר לחזור לתפריט ולהוסיף מנות.
                  </Typography>
                </Box>
              )}
            </Paper>

            <Box sx={{ height: 24 }} />


            {ENABLE_ADDONS && (
            <>
            {/* ===== תוספות: עוגות, פטיפורים, לחם, שתייה ===== */}
            <Paper elevation={0} sx={cardSx}>
              <Typography fontWeight="bold" fontSize={22}>
                רוצים להשלים את השולחן?
              </Typography>
              <Typography sx={{ color: "#6b6254", fontSize: 14.5, lineHeight: 1.8, mt: 0.5, mb: 2.5 }}>
                הוסיפו להזמנה עוגות ועוגיות, פטיפורים, לחם ושתייה. התוספות יתווספו לסכום ההזמנה
                ויישלחו אלינו יחד עם המנות.
              </Typography>

              {/* בחירת קטגוריית תוספות */}
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  overflowX: "auto",
                  pb: 1,
                  mb: 2,
                  scrollbarWidth: "none",
                  "&::-webkit-scrollbar": { display: "none" },
                }}
              >
                {ADDON_CATEGORIES.map((cat) => {
                  const active = cat.key === addonTab;
                  const count = addonCountInCategory(cat.key);
                  return (
                    <Box
                      key={cat.key}
                      component="button"
                      type="button"
                      onClick={() => setAddonTab(cat.key)}
                      sx={{
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.8,
                        px: 2,
                        py: 1,
                        borderRadius: "999px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: 14,
                        fontWeight: active ? 800 : 600,
                        border: "1px solid",
                        borderColor: active ? GOLD : "#e4dccb",
                        bgcolor: active ? INK : "#fff",
                        color: active ? "#F1D7A5" : "#4b4435",
                        transition: "all 0.2s ease",
                        "&:hover": { borderColor: GOLD },
                      }}
                    >
                      <span>{cat.emoji}</span>
                      <span>{cat.title}</span>
                      {count > 0 && (
                        <Box
                          component="span"
                          sx={{
                            minWidth: 20,
                            height: 20,
                            px: 0.6,
                            borderRadius: "10px",
                            bgcolor: GOLD,
                            color: INK,
                            fontSize: 11,
                            fontWeight: 800,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {count}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* מוצרי התוספות בקטגוריה */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 1.5,
                }}
              >
                {activeAddons.map((addon) => {
                  const qty = addons[addon.id] || 0;
                  return (
                    <Box
                      key={addon.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 1,
                        p: 1.5,
                        borderRadius: "14px",
                        border: "1px solid",
                        borderColor: qty > 0 ? GOLD : "#eee6d6",
                        bgcolor: qty > 0 ? "#fffaf0" : "#fff",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography fontWeight={700} fontSize={15} sx={{ lineHeight: 1.4 }}>
                          {addon.name}
                        </Typography>
                        <Typography fontSize={13} color="text.secondary">
                          ₪ {addon.price.toFixed(2)} · {addon.unit}
                        </Typography>
                        {qty > 0 && (
                          <Typography fontSize={13} fontWeight={700} color="success.main">
                            סה"כ ₪ {(addon.price * qty).toFixed(2)}
                          </Typography>
                        )}
                      </Box>

                      {qty === 0 ? (
                        <Button
                          onClick={() => setAddonQty(addon.id, 1)}
                          startIcon={<AddIcon />}
                          sx={{
                            flexShrink: 0,
                            borderRadius: "10px",
                            fontWeight: 800,
                            fontSize: 13,
                            px: 1.5,
                            color: INK,
                            border: `1px solid ${GOLD}`,
                            bgcolor: "#fff",
                            "&:hover": { bgcolor: "#faf3e2" },
                          }}
                        >
                          הוספה
                        </Button>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            flexShrink: 0,
                            bgcolor: INK,
                            borderRadius: "10px",
                            p: 0.3,
                          }}
                        >
                          <IconButton
                            size="small"
                            aria-label="הפחתת כמות"
                            onClick={() => setAddonQty(addon.id, qty - 1)}
                            sx={{ color: GOLD }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography
                            sx={{ minWidth: 22, textAlign: "center", color: "#F5E9D0", fontWeight: 800 }}
                          >
                            {qty}
                          </Typography>
                          <IconButton
                            size="small"
                            aria-label="הגדלת כמות"
                            onClick={() => setAddonQty(addon.id, qty + 1)}
                            sx={{ color: GOLD }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* סיכום התוספות שנבחרו */}
              {selectedAddons.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.8,
                    borderRadius: "12px",
                    bgcolor: "#faf7ef",
                    border: "1px dashed #d9c48f",
                  }}
                >
                  <Typography fontWeight={800} fontSize={14} sx={{ mb: 1 }}>
                    התוספות שנוספו להזמנה ({selectedAddons.length})
                  </Typography>
                  <Stack spacing={0.6}>
                    {selectedAddons.map((a) => (
                      <Box key={a.id} display="flex" justifyContent="space-between" gap={2}>
                        <Typography fontSize={13.5}>
                          {a.name} × {a.quantity}
                        </Typography>
                        <Typography fontSize={13.5} fontWeight={700} sx={{ whiteSpace: "nowrap" }}>
                          ₪ {(a.price * a.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Box sx={{ height: 24 }} />
            </>
            )}


            {/* פירוט מחיר ההזמנה */}
            <Paper elevation={0} sx={cardSx}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ReceiptLongOutlinedIcon sx={{ color: GOLD_DARK }} />
                <Typography fontWeight="bold" fontSize={22}>פירוט מחיר ההזמנה</Typography>
              </Box>
              <Box sx={{ mt: 2.5, background: "#fafafa", p: { xs: 2, md: 3 }, borderRadius: "14px" }}>
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography>מנות</Typography>
                    <Typography fontWeight="bold">₪ {productsTotal.toFixed(2)}</Typography>
                  </Box>
                  {addonsTotal > 0 && (
                    <Box display="flex" justifyContent="space-between" gap={2}>
                      <Typography>תוספות</Typography>
                      <Typography fontWeight="bold">₪ {addonsTotal.toFixed(2)}</Typography>
                    </Box>
                  )}
                  <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography>סכום לפני מע"מ</Typography>
                    <Typography fontWeight="bold">₪ {priceBeforeVat.toFixed(2)}</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" gap={2}>
                    <Typography>מע"מ (18%)</Typography>
                    <Typography fontWeight="bold">₪ {vatAmount.toFixed(2)}</Typography>
                  </Box>
                </Stack>
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={2}>
                  <Typography fontSize={22} fontWeight="bold">סה"כ כולל מע"מ</Typography>
                  <Typography fontSize={{ xs: 21, md: 26 }} color="success.main" fontWeight="bold" sx={{ whiteSpace: "nowrap" }}>₪ {totalIncludingVat.toFixed(2)}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  המחיר הסופי יוצג לאישור לאחר יצירת קשר עם נציגנו. דמי משלוח אינם כלולים בסכום.
                </Typography>
              </Box>
            </Paper>

            <Box sx={{ height: 24 }} />


            {/* סרגל שלבי הזמנה – שחור וזהב יוקרתי */}
            <Box
              dir="rtl"
              sx={{
                width: "100%",
                boxSizing: "border-box",
                px: { xs: 1.5, sm: 3, md: 4 },
                py: { xs: 2, sm: 2.5 },
                background:
                  "linear-gradient(135deg, #111111 0%, #1d1b18 55%, #111111 100%)",
                border: "1px solid #393024",
                borderRadius: "18px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                overflow: "hidden",
              }}
            >
              {/* כותרת הסרגל */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                  gap: 1,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: GOLD,
                      fontSize: 10,
                      letterSpacing: 2,
                      fontWeight: 700,
                      mb: 0.5,
                    }}
                  >
                    HAPNINA CATERING
                  </Typography>

                  <Typography
                    sx={{
                      color: "#F5E9D0",
                      fontSize: { xs: 16, sm: 19 },
                      fontWeight: 700,
                    }}
                  >
                    תהליך ההזמנה
                  </Typography>
                </Box>

                <Box
                  sx={{
                    border: "1px solid #6F5936",
                    borderRadius: "20px",
                    px: 1.5,
                    py: 0.7,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#D9BD86",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    שלב 3 מתוך 3
                  </Typography>
                </Box>
              </Box>

              {/* שלבי ההזמנה */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                {[
                  { number: 1, label: "בחירה" },
                  { number: 2, label: "סיכום" },
                  { number: 3, label: "פרטים ושליחה" },
                ].map((step, index) => {
                  const activeStep = 3;
                  const active = step.number === activeStep;
                  const completed = step.number < activeStep;

                  return (
                    <React.Fragment key={step.number}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1,
                          flex: "0 0 auto",
                          minWidth: 0,
                        }}
                      >
                        <Box
                          sx={{
                            width: active ? 38 : 32,
                            height: active ? 38 : 32,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxSizing: "border-box",
                            bgcolor: active ? GOLD : "transparent",
                            border: active
                              ? "1px solid #E4CC9D"
                              : completed
                                ? "1px solid #9C7B47"
                                : "1px solid #514735",
                            color: active ? "#17130D" : "#D9BD86",
                            boxShadow: active
                              ? "0 0 18px rgba(201,169,110,0.18)"
                              : "none",
                            transition: "all 0.25s ease",
                          }}
                        >
                          {completed ? (
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <Typography
                              sx={{
                                fontSize: 13,
                                fontWeight: 800,
                                color: "inherit",
                              }}
                            >
                              {step.number}
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          sx={{
                            color: active
                              ? "#F1D7A5"
                              : completed
                                ? GOLD
                                : "#8D8980",
                            fontSize: { xs: 10, sm: 12, md: 13 },
                            fontWeight: active ? 700 : 500,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {step.label}
                        </Typography>
                      </Box>

                      {index < 2 && (
                        <Box
                          sx={{
                            flex: 1,
                            minWidth: { xs: 12, sm: 24 },
                            height: "1px",
                            mt: `${activeStep === step.number ? 19 : 16}px`,
                            mx: { xs: 0.75, sm: 1.5 },
                            background: completed
                              ? "linear-gradient(90deg, #C9A96E, #8C6A3B)"
                              : "#40392E",
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>

              {/* הודעה לשלב האחרון */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 2.5,
                  pt: 2,
                  borderTop: "1px solid #393024",
                }}
              >
                <CheckCircleIcon
                  sx={{ color: GOLD, fontSize: 18, flexShrink: 0 }}
                />

                <Typography
                  sx={{
                    color: "#C7BDAA",
                    fontSize: { xs: 11, sm: 12 },
                    lineHeight: 1.7,
                  }}
                >
                  כמעט סיימנו — מלאו את הפרטים והשלימו את שליחת ההזמנה.
                </Typography>
              </Box>
            </Box>

          </Grid>


          {/* ---------- פרטי משתמש (טופס שליחה) ---------- */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              ref={formRef}
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                bgcolor: "#fff",
                border: "1px solid #eee6d6",
                boxShadow: "0 6px 28px rgba(23,22,20,0.12)",
              }}
            >
              {/* כותרת מלוי פרטים */}
              <Box
                sx={{
                  px: { xs: 2.5, md: 3 },
                  py: 3,
                  textAlign: "right",
                  background: "linear-gradient(135deg, #111111 0%, #1d1b18 60%, #2a2418 100%)",
                  borderBottom: `3px solid ${GOLD}`,
                }}
              >
                <Typography
                  sx={{
                    color: GOLD,
                    fontSize: 13,
                    fontWeight: 800,
                    mb: 1,
                  }}
                >
                  שלב 3 — השלב האחרון
                </Typography>

                <Typography
                  fontWeight="bold"
                  fontSize={24}
                  sx={{ color: "#F5E9D0", mb: 1 }}
                >
                  פרטים לשליחת ההזמנה
                </Typography>

                <Typography
                  fontSize={14}
                  sx={{ color: "#C7BDAA", lineHeight: 1.7 }}
                >
                  מלאו את הפרטים שלכם ונחזור אליכם להמשך תהליך
                  ההזמנה ולאישור הפרטים.
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    height: 4,
                    width: "100%",
                    bgcolor: "#3a3326",
                    borderRadius: 5,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      bgcolor: GOLD,
                      borderRadius: 5,
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography color="success.main" fontSize={15} mb={2.5} sx={{ lineHeight: 1.7 }}>
                  לאחר שליחת ההזמנה נציגנו יחזור אלייך להמשך תהליך ההזמנה
                </Typography>

                <TextField
                  fullWidth
                  label="שם מלא"
                  autoComplete="name"
                  value={guestName}
                  onChange={e => setGuestName(e.target.value)}
                  error={Boolean(errors.guestName)}
                  helperText={errors.guestName}
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="טלפון"
                  type="tel"
                  autoComplete="tel"
                  inputProps={{ inputMode: "tel" }}
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  error={Boolean(errors.phoneNumber)}
                  helperText={errors.phoneNumber}
                  sx={fieldSx}
                />

                <TextField
                  fullWidth
                  label="כתובת אימייל"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  error={Boolean(errors.email)}
                  helperText={errors.email}
                  sx={fieldSx}
                />

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

                <TextField
                  fullWidth
                  label="כתובת משלוח"
                  autoComplete="street-address"
                  value={eventLocation}
                  onChange={e => setEventLocation(e.target.value)}
                  error={Boolean(errors.eventLocation)}
                  helperText={errors.eventLocation}
                  sx={{ ...fieldSx, mb: 3 }}
                />

                {/* סיכום קצר לפני שליחה */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 1.8,
                    mb: 2,
                    borderRadius: "12px",
                    bgcolor: "#faf7ef",
                    border: "1px solid #eadbb7",
                  }}
                >
                  <Typography fontWeight={700}>סה"כ להזמנה (כולל מע"מ)</Typography>
                  <Typography fontWeight={800} fontSize={20} color="success.main" sx={{ whiteSpace: "nowrap" }}>
                    ₪ {totalIncludingVat.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleFinalSubmit}
                  disabled={sending}
                  sx={{
                    width: "100%",
                    minHeight: 54,
                    background: "linear-gradient(135deg, #C9A96E 0%, #E4CC9D 50%, #C9A96E 100%)",
                    color: "#131313",
                    border: "1px solid #E4CC9D",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: 18,
                    boxShadow: "0 6px 16px rgba(201,169,110,0.35)",
                    transition: "all 0.25s ease",

                    "&:hover": {
                      background: "linear-gradient(135deg, #B89555 0%, #D9BD86 50%, #B89555 100%)",
                      boxShadow: "0 8px 20px rgba(201,169,110,0.45)",
                    },

                    "&.Mui-disabled": {
                      background: "#D8C6A5",
                      color: "#6B6252",
                    },
                  }}
                >
                  {sending ? "שולח..." : "שלח הזמנה"}
                </Button>

                <Typography
                  sx={{ mt: 1.5, textAlign: "center", fontSize: 12.5, color: "#7a7160", lineHeight: 1.7 }}
                >
                  אין חיוב בשלב זה. נציג יחזור אליכם לאישור סופי של ההזמנה והמחיר.
                </Typography>

                {errorMessage && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {errorMessage}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Box>


      {/* פס תחתון קבוע בטלפון: סכום + מעבר לטופס */}
      {!formVisible && !showSuccessDialog && cart.length > 0 && (
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 2,
            py: 1.2,
            bgcolor: INK,
            borderTop: `1px solid ${GOLD}`,
            boxShadow: "0 -6px 20px rgba(0,0,0,0.25)",
            direction: "rtl",
          }}
        >
          <Box>
            <Typography sx={{ color: "#C7BDAA", fontSize: 11 }}>סה"כ כולל מע"מ</Typography>
            <Typography sx={{ color: "#F1D7A5", fontWeight: 800, fontSize: 19 }}>
              ₪ {totalIncludingVat.toFixed(2)}
            </Typography>
          </Box>
          <Button
            onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            sx={{
              px: 3,
              height: 44,
              borderRadius: "12px",
              fontWeight: 800,
              color: "#131313",
              background: "linear-gradient(135deg, #C9A96E 0%, #E4CC9D 100%)",
            }}
          >
            להשלמת הפרטים
          </Button>
        </Box>
      )}


      {/* כרטיס הצלחה לאחר שליחה */}
      <Dialog
        open={showSuccessDialog}
        onClose={() => navigate("/")}
        fullScreen
        PaperProps={{
          sx: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "rgba(0,0,0,0.5)",
            overflow: "hidden",
          },
        }}
        BackdropProps={{
          sx: { bgcolor: "rgba(0,0,0,0.5)" },
        }}
      >
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
          />
        </Box>

        <Box
          sx={{
            position: "relative",
            zIndex: 2,
            bgcolor: "#fff",
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            width: { xs: "90%", sm: "70%", md: "50%" },
            maxWidth: 600,
            maxHeight: "90vh",
            overflowY: "auto",
            textAlign: "center",
            direction: "rtl",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          }}
        >
          <DialogTitle
            sx={{ fontWeight: "bold", color: "#1F8A70" }}
          >
            🎉 תודה על הזמנתך!
          </DialogTitle>

          <DialogContent>
            <Typography
              variant="h5"
              sx={{ mb: 2, fontWeight: "bold", color: "green" }}
            >
              הזמנתך נשלחה בהצלחה!
            </Typography>

            <Typography sx={{ mb: 2 }}>
              נציגנו יחזור אליך בהקדם להמשך תהליך ההזמנה.
            </Typography>

            <Typography sx={{ mb: 2 }}>
              לאחר אישור ההזמנה נעדכן אותך בפרטים הנוספים.
            </Typography>

            <Typography sx={{ mb: 3 }}>
              תודה שבחרת בקייטרינג הפנינה ❤️
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              שליחת ההזמנה היא שלב ראשוני בלבד ואינה מהווה
              התחייבות לתשלום או לאישור סופי.
            </Typography>

            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("/")}
              sx={{
                mt: 4,
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              סגור וחזרה לתפריט הראשי
            </Button>
          </DialogContent>
        </Box>
      </Dialog>

      <Footer />
    </Box>

  );
}