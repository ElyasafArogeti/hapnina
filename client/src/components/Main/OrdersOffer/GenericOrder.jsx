import { useEffect, useState } from "react";
import { apiFetch } from '../../api';
import {
  Box,
  Typography,
  Container,
  Button,
  Snackbar,
  Alert,
  LinearProgress,
  Checkbox,
  Grid,
  Card,
  CardContent,
  Modal,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import NavbarHome from "../NavbarHome";
import Footer from "../Footer";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const MenuSection = ({ title, dishes, selected, setSelected }) => (
  <Card sx={{ mb: 2, boxShadow: 3 }}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Grid container spacing={1}>
        {dishes.map((dish) => (
          <Grid item xs={12} sm={6} md={4} key={dish.id}>
            <Box display="flex" alignItems="center">
              <Checkbox
                checked={selected.includes(dish.id)}
                onChange={(e) => {
                  setSelected((prev) =>
                    e.target.checked
                      ? [...prev, dish.id]
                      : prev.filter((id) => id !== dish.id)
                  );
                }}
              />
              <Typography>{dish.dish_name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </CardContent>
  </Card>
);

const GenericOrder = () => {
  
  const { state } = useLocation();
  const navigate = useNavigate();

  const {
    eventName,
    pricePerDish,
    selectionLimits,
    eventImage,
    hiddenItems = {},
  } = state || {};

  const [menuData, setMenuData] = useState({});
  const [selectedSalads, setSelectedSalads] = useState([]);
  const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);
  const [selectedMainDishes, setSelectedMainDishes] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

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

  // הסרת מנות נסתרות ומנות יקרות מ-60 ש"ח
const filterVisibleDishes = (dishes, category) => {
  const hidden = hiddenItems[category] || [];
  return (dishes || []).filter(
    (dish) => !hidden.includes(dish.dish_name.trim())
  );
};
const validateFinalForm = () => {// בדיקת הלקוח 
  let hasFinalError = false;
  const newErrors = {};

  // בדיקת שם מלא
  if (!guestName || guestName.trim().length < 2) {
    newErrors.guestName = 'יש להזין שם מלא תקין';
    hasFinalError = true;
  }

  // בדיקת מספר פלאפון
  const phoneRegex = /^0[5][0-9]{8}$/; // לדוגמה: 0501234567
  if (!phoneNumber) {
    newErrors.phoneNumber = 'יש להזין מספר פלאפון';
    hasFinalError = true;
  } else if (!phoneRegex.test(phoneNumber)) {
    newErrors.phoneNumber = 'מספר פלאפון לא תקין';
    hasFinalError = true;
  }

  // בדיקת מייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    newErrors.email = 'יש להזין כתובת מייל';
    hasFinalError = true;
  } else if (!emailRegex.test(email)) {
    newErrors.email = 'כתובת מייל לא תקינה';
    hasFinalError = true;
  }

  // בדיקת מספר מוזמנים
  if (!guestCount || guestCount < 30) {
    newErrors.guestCount = 'יש להזין לפחות 30 מוזמנים';
    hasFinalError = true;
  }

  // בדיקת תאריך
  if (!eventDate) {
    newErrors.eventDate = 'יש לבחור תאריך אירוע';
    hasFinalError = true;
  }

  setErrors(newErrors);
  return !hasFinalError;
};

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await apiFetch("/api/inventoryAll");
        setMenuData(data);
      } catch (err) {
        setErrorMessage("שגיאה בטעינת המנות");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // בדיקת כמות מנות מול המגבלות - מחזיר אמת אם תקין, אחרת שגיאה
const validateSelectionLimits = () => {
  let errors = [];

  // בדיקת חרגת מגבלה
  if (selectedSalads.length > (selectionLimits.salads || 0)) {
    errors.push(`חריגה במנות סלטים: עד ${selectionLimits.salads}`);
  }
  if (selectedFirstDishes.length > (selectionLimits.first_courses || 0)) {
    errors.push(`חריגה במנות ראשונות: עד ${selectionLimits.first_courses}`);
  }
  if (selectedMainDishes.length > (selectionLimits.main_courses || 0)) {
    errors.push(`חריגה במנות עיקריות: עד ${selectionLimits.main_courses}`);
  }
  if (selectedSides.length > (selectionLimits.side_dishes || 0)) {
    errors.push(`חריגה בתוספות: עד ${selectionLimits.side_dishes}`);
  }

  // בדיקת מינימום - לפחות 1 מכל קטגוריה
  if (selectedSalads.length === 0) {
    errors.push('יש לבחור לפחות סלט אחד');
  }
  if (selectedFirstDishes.length === 0) {
    errors.push('יש לבחור לפחות מנה ראשונה אחת');
  }
  if (selectedMainDishes.length === 0) {
    errors.push('יש לבחור לפחות מנה עיקרית אחת');
  }
  if (selectedSides.length === 0) {
    errors.push('יש לבחור לפחות תוספת אחת');
  }

  // אם נמצאו שגיאות, הצג אותן
  if (errors.length > 0) {
    setErrorMessage(errors.join('\n'));
    return false;
  }

  return true;
};


  // פתיחת מודל פרטי לקוח עם בדיקת מגבלות
  const handleOrderSummaryClick = () => {
    if (validateSelectionLimits()) {
      setIsModalOpen(true);
    }
  };

  const handleFinalSubmit = async () => {// סגירת הזמנה 
    if (!guestName || !guestCount || !eventDate || !eventLocation || !phoneNumber || !email) {
      setErrorMessage("אנא מלא את כל השדות");
      return;
    }

    const orderSummary = createOrderSummary();

    const total = pricePerDish * guestCount ;
    console.log(total);
    
    

    setSending(true);

    try {
      await apiFetch("/api/addOrdersOnline", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: guestName,
          userPhone: phoneNumber,
          guestCount,
          eventDate,
          orderMenu: orderSummary,
          totalPrice: total,
          shippingDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
          email: email,
          event_location: eventLocation,
          address: "",
          shippingCost: 0,
          serviceCost: 0,
          toolsType: "",
          eventType: eventName

        }),
      });

        setErrorMessage(null);
        setIsModalOpen(false);
        setSending(false);
        setSendingToManager(true);

    } catch (error) {
      console.error(error);
      setErrorMessage("אירעה שגיאה בשליחת ההזמנה");
      setSending(false);
    }
  };

  // פונקציה שמייצרת את סיכום ההזמנה עם המנות שנבחרו מלאות (לא רק IDs)
const createOrderSummary = () => {
  const extractDishNames = (dishes, selected) => {
    return dishes
      ?.filter((dish) => selected.includes(dish.id))
      .map((dish) => ({
        dish_name: dish.dish_name,
        totalPrice: "",
        totalWeight: "",
      })) || [];
  };

  return {
    salads: extractDishNames(menuData.salads, selectedSalads),
    first_courses: extractDishNames(menuData.first_courses, selectedFirstDishes),
    main_courses: extractDishNames(menuData.main_courses, selectedMainDishes),
    side_dishes: extractDishNames(menuData.side_dishes, selectedSides),
  };
};





  return (
    <>
       <NavbarHome sx={{ padding: 0, margin: 0 }} />
    <br/><br/><br/>

    {/* תמונה   */}
     <Box
  sx={{
    position: "relative",
    width: "100%",
    height: { xs: "250px", md: "400px" },
    overflow: "hidden",
  }}
>
  <Box
    component="img"
    src={eventImage}
    alt={`אירוע ${eventName}`}
    sx={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(50%)",
    }}
  />

  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      textAlign: "center",
      color: "#fff",
      zIndex: 2,
      px: { xs: 1.5, md: 2 }, // padding רספונסיבי
      width: "100%", // שיהיה תמיד בתוך התמונה
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: "bold",
        color: "#FFD700",
        textShadow: "2px 2px 6px black",
        mb: { xs: 0.5, md: 1 },
        fontSize: { xs: "1.3rem", sm: "1.6rem", md: "2.5rem" },
      }}
    >
      תפריט לאירוע {eventName}
    </Typography>

    <Typography
      variant="h6"
      sx={{
        textShadow: "1px 1px 4px black",
        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.3rem" },
        mb: { xs: 0.3, md: 0.5 },
      }}
    >
      קייטרינג הפנינה - אוכל ביתי, טרי וכשר למהדרין
    </Typography>

    <Typography
      variant="body2"
      sx={{
        textShadow: "1px 1px 4px black",
        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "1rem" },
      }}
    >
      להזמנות: 054-6600200 | eli6600200@gmail.com
    </Typography>
  </Box>
     </Box>


      <Container dir="rtl" maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
        {loading && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress />
          </Box>
        )}

        <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={() => setErrorMessage(null)}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>

        {/* מלל בהתחללה  */}
        <Box sx={{ textAlign: "center", my: { xs: 2, md: 5 }, px: { xs: 1.5, sm: 3 } }}>
 <Typography
  variant="h5"
  fontWeight="bold"
  gutterBottom
  sx={{
    fontSize: { xs: "1.3rem", sm: "1.8rem", md: "2rem" },
    color: "#1b5e20",
    whiteSpace: { xs: "pre-line", md: "normal" }, // שבירת שורה רק במסכים קטנים
  }}
>
  מחפשים קייטרינג יוקרתי{" "}
  <Box
    component="span"
    sx={{
      borderBottom: "1px solid black",
  
      px: "4px", // ריווח פנימי בצדדים
      fontWeight: "bold",
    }}
  >
    ל־ {eventName}
  </Box>
  ?
</Typography>


  <Typography
    variant="body1"
    sx={{
      maxWidth: 650,
      mx: "auto",
      lineHeight: { xs: 1.6, sm: 1.8, md: 2 },
      fontSize: { xs: "0.82rem", sm: "0.95rem", md: "1.05rem" },
      color: "#333",
    }}
  >
    <strong>ברוכים הבאים לקייטרינג הפנינה</strong> – הבחירה הנכונה לאירוע בלתי נשכח!
    <br />
    אנו מתמחים בקייטרינג <strong>כשר למהדרין</strong> בהשגחת "יורה דעה" של הרב מחפוד,
    תוך שימוש בחומרי גלם <strong>טריים ואיכותיים</strong>, תפריטים מגוונים, ועיצוב אסתטי
    שמרשים את האורחים כבר מהביס הראשון.
    <br /><br />
    רוצים שהאורחים שלכם ידברו על האוכל הרבה אחרי שהאירוע נגמר?
    <span style={{ color: "#2e7d32", fontWeight: 600 }}> אנחנו כאן בדיוק בשביל זה.</span><br/>
     בחרו מנות מהתפריט ונציגנו יחזרו אליכם 
    <br />
   
    <Typography
      component="span"
      sx={{
        display: "inline-block",
        color: "#d74444ff",
        fontWeight: "bold",
        mt: 1,
        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      }}
    >
      שימו לב: מינימום הזמנה 30 מנות! / שליש מכל סוג
    </Typography>
    <hr />
    <Typography
      component="span"
      sx={{
        
        fontWeight: "bold",
        mt: 1,
        fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
      }}
    >
     מחיר למנה - {pricePerDish} ש"ח
    </Typography>
  </Typography>
         </Box>




        {menuData.salads && (
          <MenuSection
            title={`סלטים [${selectionLimits.salads} לבחירה]`}
            dishes={filterVisibleDishes(menuData.salads, "salads")}
            selected={selectedSalads}
            setSelected={setSelectedSalads}
          />
        )}

        {menuData.first_courses && (
          <MenuSection
            title={`מנות ראשונות [${selectionLimits.first_courses} לבחירה]`}
            dishes={filterVisibleDishes(menuData.first_courses, "first_courses")}
            selected={selectedFirstDishes}
            setSelected={setSelectedFirstDishes}
          />
        )}

        {menuData.main_courses && (
          <MenuSection
            title={`מנות עיקריות [${selectionLimits.main_courses} לבחירה]`}
            dishes={filterVisibleDishes(menuData.main_courses, "main_courses")}
            selected={selectedMainDishes}
            setSelected={setSelectedMainDishes}
          />
        )}

        {menuData.side_dishes && (
          <MenuSection
            title={`תוספות [${selectionLimits.side_dishes} לבחירה]`}
            dishes={filterVisibleDishes(menuData.side_dishes, "side_dishes")}
            selected={selectedSides}
            setSelected={setSelectedSides}
          />
        )}

        <Box sx={{ textAlign: "center", mt: 4 ,width:"100%"}}>
          <Button variant="contained" size="large" onClick={handleOrderSummaryClick}>
          המשך בהזמנה
          </Button>
        </Box>

      
      </Container>
      <Footer />

      {/* מודל פרטי לקוח */}
 <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <Box
    dir="rtl"
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "#fff",
      borderRadius: 3,
      width: "90%",
      maxWidth: 400,
      maxHeight: "90vh",
      overflowY: "auto",
      p: 4,
      boxShadow: 24,
    }}
  >
    <Typography variant="h6" mb={2} textAlign="center">
      פרטי לקוח
    </Typography>

    <TextField
      fullWidth
      label="שם מלא"
      value={guestName}
      onChange={(e) => setGuestName(e.target.value)}
      sx={{ mb: 2 }}
      error={Boolean(errors.guestName)}
      helperText={errors.guestName || ''}
    />

    <TextField
      fullWidth
      label="מספר פלאפון"
      value={phoneNumber}
      onChange={(e) => setPhoneNumber(e.target.value)}
      sx={{ mb: 2 }}
      error={Boolean(errors.phoneNumber)}
      helperText={errors.phoneNumber || ''}
    />

    <TextField
      fullWidth
      label="כתובת מייל"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      sx={{ mb: 2 }}
      error={Boolean(errors.email)}
      helperText={errors.email || ''}
    />

    <TextField
      fullWidth
      label="מספר מוזמנים"
      type="number"
      value={guestCount}
      onChange={(e) => setGuestCount(Number(e.target.value))}
      sx={{ mb: 2 }}
      error={Boolean(errors.guestCount)}
      helperText={errors.guestCount || ''}
    />

    <TextField
      fullWidth
      label="תאריך האירוע"
      type="date"
      InputLabelProps={{ shrink: true }}
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
      sx={{ mb: 2 }}
      error={Boolean(errors.eventDate)}
      helperText={errors.eventDate || ''}
    />

    <TextField
      fullWidth
      label="מיקום האירוע"
      value={eventLocation}
      onChange={(e) => setEventLocation(e.target.value)}
      sx={{ mb: 3 }}
    />

    <Button
      variant="contained"
      fullWidth
      onClick={() => {
        if (validateFinalForm()) {
          handleFinalSubmit();
        }
      }}
      disabled={sending}
    >
      {sending ? "שולח..." : "שלח הזמנה  "}
    </Button>
  </Box>
</Modal>




      {/* -------------------הודעת ברכות להרשמה----------------------------------------------------- */}
      {sendingToManager && (
        <Dialog
          open={sendingToManager}
          onClose={() => navigate("/")}
          fullScreen
          PaperProps={{
            sx: {
              m: 0,
              p: 0,
              height: "100%",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              position: "relative",
              overflow: "hidden",
            },
          }}
          BackdropProps={{
            sx: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          {/* קונפטי ברקע */}
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              zIndex: 1500,
              pointerEvents: "none",
            }}
          >
            <Confetti width={window.innerWidth} height={window.innerHeight} />
          </Box>

          {/* תוכן דיאלוג */}
          <Box
            sx={{
              position: "relative",
              zIndex: 1600,
              bgcolor: "white",
              p: 4,
              borderRadius: 2,
              maxWidth: 400,
              textAlign: "center",
            }}
          >
            <Typography variant="h4" fontWeight="bold" mb={2} color="green">
           !  תודה רבה 
            </Typography>
            <Typography variant="body1" mb={2}>
              ההזמנה התקבלה בהצלחה נשוב אליכם בהקדם עם הצעת המחיר
            </Typography>
            <Button variant="contained" onClick={() => navigate("/")}>
              חזרה לעמוד הבית
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
};

export default GenericOrder;
