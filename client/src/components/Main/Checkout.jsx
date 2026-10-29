import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Typography, Paper, Divider, TextField, Stack, Chip , IconButton,} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useLocation } from "react-router-dom";
import NavbarHome from "./NavbarHome";
import TextMove from "./textMove";
import { apiFetch } from '../api'; 
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import Footer from './Footer';
import HomeIcon from "@mui/icons-material/Home";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Checkout() {
  const { state } = useLocation();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  
  const productsTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = 0;
  const totalPrice = productsTotal + deliveryPrice;

  
const totalIncludingVat = totalPrice;
const priceBeforeVat = totalIncludingVat / 1.18;
const vatAmount = totalIncludingVat - priceBeforeVat;


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



// עמוד סיכום הזמנה באוכל מוכן 




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

  return order;
};

// בדיקת  הלקוח לפני שליחה 
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


//  שליחת סיכום הזמנה לשרת למסד נתונים
const handleFinalSubmit = async () => {
   setErrorMessage("");
   // בדיקת סכום מינימלי לפני שליחה לשרת
if (totalPrice < 1500) {
  setErrorMessage(
    `סכום ההזמנה המינימלי הוא 1,500 ₪. כרגע הסכום שלך הוא ${totalPrice.toFixed(2)} ₪.`
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




  return (
    <Box sx={{ direction: "rtl", background: "#f5f5f5", minHeight: "100vh", pb: 8 }}>

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
    bgcolor: "#171614",
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
                bgcolor: active ? "#C9A96E" : "transparent",
                color: active ? "#171614" : completed
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
                    ? "#C9A96E"
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
                  ? "#C9A96E"
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
        borderColor: "#C9A96E",
      },
    }}>
    <HomeIcon sx={{ fontSize: 17 }} />
  </IconButton>
</Box>


 <br/>

   {/* כפתור חזרה לעריכת ההזמנה */}
    <Box
  sx={{
    display: "flex",
    justifyContent: "flex-start",
    mb: 3,
  }}
>
  <Button
    variant="outlined"
    startIcon={<ArrowForwardIosIcon />}
    onClick={() => navigate("/MainCourse")}
    sx={{
      direction: "rtl",
      color: "#8c6a25",
      borderColor: "#b89546",
      borderRadius: "12px",
      px: 2.5,
      py: 1.2,
      fontWeight: 700,
      backgroundColor: "#fff",
      "&:hover": {
        backgroundColor: "#faf7ef",
        borderColor: "#8c6a25",
      },
    }}
  >
    חזרה לעריכת ההזמנה
  </Button>
    </Box>



    {/* תוכן העמוד  */}
      <Box sx={{ pt: 1, px: { xs: 2, md: 5 } }}>
        <Typography variant="h3" textAlign="center" fontWeight={700} sx={{ mt: 4, mb: 5, color: "#444", fontSize: { xs: 34, md: 52 } }}>
          סיכום ההזמנה
        </Typography>
        <Typography variant="h5" textAlign="center" fontWeight={700} sx={{ mt: 4, mb: 5, color: "#8c6a25", fontSize: { xs: 16, md: 25 } }}>
        מינימום הזמנה 1500 ש'ח 
        </Typography>
        <Typography variant="h5" textAlign="center" fontWeight={500} sx={{ mt: 4, mb: 5, color: "##444", fontSize: { xs: 16, md: 25 } }}>
        שימו לב: מחיר ההזמנה אינו כולל דמי משלוח.
        </Typography>
     



     
       {/* מלוי פרטים לשליחה  */} 
 <Grid
  container
  spacing={4}
  direction="column"
  alignItems="center"
  sx={{ width: "100%", mx: "auto" }}
>
   <Grid size={{ xs: 12, md: 8 }}>



  {/* רשימת מוצרים */}
<Paper elevation={0} sx={{ background: "#fff", borderRadius: 2, p: { xs: 2, md: 3 }, boxShadow: "0 3px 15px rgba(0,0,0,.15)" }}>
  <Typography fontWeight="bold" fontSize={22} mb={3}>המוצרים שבחרת</Typography>

  {/* כותרות במחשב */}
  <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "100px 1fr 100px 100px 120px", px: 2, mb: 2, color: "#555", fontWeight: "bold" }}>
    <Typography>תמונה</Typography>
    <Typography>מוצר</Typography>
    <Typography>מחיר</Typography>
    <Typography>כמות</Typography>
    <Typography>סה"כ</Typography>
  </Box>

  
  {cart.map((item) => (
    <Card key={item.id} sx={{ mb: 2, borderRadius: 2, boxShadow: "0 2px 10px rgba(0,0,0,.12)", overflow: "hidden" }}>
      {/* מובייל */}
      <Box sx={{ display: { xs: "flex", md: "none" }, direction: "rtl", alignItems: "stretch", gap: 2, p: 1.5 }}>
        <CardMedia component="img" image={item.image} alt={item.name} sx={{ width: 90, minWidth: 90, height: 100, borderRadius: 2, objectFit: "cover" }} />
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between", py: 0.5 }}>
          <Typography fontWeight="bold" fontSize={17} sx={{ lineHeight: 1.4, overflowWrap: "anywhere" }}>{item.name}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>כמות: {item.quantity} {item.unit}</Typography>
          <Typography fontWeight="bold" fontSize={18} color="success.main" sx={{ mt: 2, textAlign: "left", whiteSpace: "nowrap" }}>₪ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</Typography>
        </Box>
      </Box>

      {/* מחשב */}
      <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "100px 1fr 100px 100px 120px", alignItems: "center", gap: 2, p: 2 }}>
        <CardMedia component="img" image={item.image} alt={item.name} sx={{ width: 85, height: 85, borderRadius: 2, objectFit: "cover" }} />
        <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
          <Typography fontWeight="bold" fontSize={18}>{item.name}</Typography>
          <Chip label={item.unit} size="small" sx={{ mt: 1 }} />
        </CardContent>
        <Typography fontWeight="bold">₪ {Number(item.price).toFixed(2)}</Typography>
        <Typography fontWeight="bold">{item.quantity}</Typography>
        <Typography fontWeight="bold" color="success.main">₪ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</Typography>
      </Box>
    </Card>
  ))}

  <Divider sx={{ my: 4 }} />

  {/* פירוט מחיר ההזמנה */}
  <Typography fontWeight="bold" fontSize={22}>פירוט מחיר ההזמנה</Typography>
  <Box sx={{ mt: 3, background: "#fafafa", p: { xs: 2, md: 3 }, borderRadius: 2 }}>
    <Stack spacing={2}>
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
    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>המחיר הסופי יוצג לאישור לאחר יצירת קשר עם נציגנו.</Typography>
  </Box>
</Paper>

<br/>


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
    borderRadius: "14px",
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
          color: "#C9A96E",
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
                bgcolor: active ? "#C9A96E" : "transparent",
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
                    ? "#C9A96E"
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
      sx={{ color: "#C9A96E", fontSize: 18, flexShrink: 0 }}
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

    {/* פרטי משתמש */}
      <Grid size={{ xs: 12, md: 8 }}>

            <Paper
              elevation={0}
              sx={{
                background: "#fff",
                p: 3,
                borderRadius: 2,
                boxShadow: "0 3px 15px rgba(0,0,0,.15)",
                position: { md: "sticky" },
                top: 100
              }}
            >
             {/* כותרת מלוי פרטים */}
            <Box sx={{ mb: 3, textAlign: "right" }}>
              <Typography
                sx={{
                  color: "#8c6a25",
                  fontSize: 13,
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                שלב  3 — השלב האחרון
              </Typography>
            
              <Typography
                fontWeight="bold"
                fontSize={24}
                sx={{ color: "#333", mb: 1 }}
              >
                פרטים לשליחת ההזמנה
              </Typography>
            
              <Typography
                fontSize={14}
                sx={{ color: "#666", lineHeight: 1.7 }}
              >
                מלאו את הפרטים שלכם ונחזור אליכם להמשך תהליך
                ההזמנה ולאישור הפרטים.
              </Typography>
            
              <Box
                sx={{
                  mt: 2,
                  height: 4,
                  width: "100%",
                  bgcolor: "#e8e8e8",
                  borderRadius: 5,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    bgcolor: "#8c6a25",
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>


              <Typography color="success.main" fontSize={15} mb={2}>
                לאחר שליחת ההזמנה נציגנו יחזור אלייך להמשך תהליך ההזמנה
              </Typography>

              <TextField
                fullWidth
                label="שם מלא"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                error={Boolean(errors.guestName)}
                helperText={errors.guestName}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="טלפון"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="כתובת אימייל"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                sx={{ mb: 2 }}
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
                helperText={errors.eventDate}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="כתובת משלוח"
                value={eventLocation}
                onChange={e => setEventLocation(e.target.value)}
                error={Boolean(errors.eventLocation)}
                helperText={errors.eventLocation}
                sx={{ mb: 3 }}
              />
          
              <Button
                variant="contained"
                fullWidth
                onClick={handleFinalSubmit}
                disabled={sending}
                sx={{
                  width: "100%",
                  minHeight: 50,
                  bgcolor: "#8c6a25",
                  color: "#131313",
                  border: "1px solid #C9A96E",
                  borderRadius: "10px",
                  fontWeight: 800,
                  fontSize: 18,
                  boxShadow: "0 4px 12px rgba(201,169,110,0.2)",
                  transition: "all 0.25s ease",
              
                  "&:hover": {
                    bgcolor: "#B89555",
                    borderColor: "#E4CC9D",
                    boxShadow: "0 6px 16px rgba(201,169,110,0.3)",
                  },
              
                  "&.Mui-disabled": {
                    bgcolor: "#D8C6A5",
                    color: "#6B6252",
                  },
                }}
              >
                {sending ? "שולח..." : "שלח הזמנה"}
              </Button>
              

              {errorMessage && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {errorMessage}
                </Typography>
              )}
            </Paper>
       </Grid>
      </Grid>

      </Box>



    {/* כרטיס הצלחה לאחר שליחה  */}
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