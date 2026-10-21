import React, { useState } from "react";
import { Box, Button, Card, CardContent, CardMedia, Typography, Paper, Divider, TextField, Stack, Chip } from "@mui/material";
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



// בדיקת תיבות הלקוח 
  const validateFinalForm = () => {
    const newErrors = {};

    if (!guestName.trim() || guestName.trim().length < 2)
      newErrors.guestName = "יש להזין שם מלא תקין";

    if (!/^05\d{8}$/.test(phoneNumber))
      newErrors.phoneNumber = "מספר פלאפון לא תקין";

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email))
      newErrors.email = "כתובת מייל לא תקינה";

    if (!eventDate)
      newErrors.eventDate = "יש לבחור תאריך";

    if (!eventLocation.trim())
      newErrors.eventLocation = "יש להזין כתובת";

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







  return (
    <Box sx={{ direction: "rtl", background: "#f5f5f5", minHeight: "100vh", pb: 8 }}>
      <NavbarHome />
      <br /><br /><br /><br />
      <TextMove />
      <br />
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
 <Grid container spacing={4} alignItems="flex-start">
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



  </Grid>
         {/* פרטי משתמש */}
      <Grid size={{ xs: 12, md: 4 }}>
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
              <Typography fontWeight="bold" fontSize={22} mb={3}>
                מילוי פרטים לפני שליחה
              </Typography>

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
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
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