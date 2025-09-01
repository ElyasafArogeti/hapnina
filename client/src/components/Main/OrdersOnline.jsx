import React, { useEffect, useState, useMemo ,useRef } from 'react';
import { apiFetch } from '../api'; 
import '../../assets/stylesMain/OrdersOnline.css';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import dayjs from 'dayjs';
// import html2pdf from 'html2pdf.js';

import  Grid  from '@mui/material/Grid2';
import { Card, CardContent, CardMedia, Checkbox } from "@mui/material";

import { Snackbar, Alert ,Modal, Box,Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import NavbarHome from './NavbarHome';
import LinearProgress from '@mui/material/LinearProgress';

import Stack from '@mui/material/Stack';

import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { Container } from '@mui/material';


const OrdersOnline = () => {
    const Navigate = useNavigate();
  
    const [inventoryAll, setInventoryAll] = useState({  //מאגר המנות
        first_courses: [],
        main_courses: [],
        salads: [],
        side_dishes: []
    });
    const [onlineOrderMain, setOnlineOrderMain] = useState(true);//התפריט הראשי

    const [loginUser, setLoginUser] = useState(null); // להירשם למערכת   
    const [sendingToManger , setSendingToManger] = useState(null);// הודעה אישור שליחה למנהל 
    const [customerOrderSummary, setCustomerOrderSummary] = useState(null); //מערך המכיל סיכום ההזמנה של הלקוח

     const [eventOwner, setEventOwner] = useState(""); //שם בעל האירוע
    const [guestCount, setGuestCount] = useState(""); //כמות האורחים
    const [eventDate, setEventDate] = useState(""); // תאריך האירוע
    const [phoneNumber, setPhoneNumber] = useState(""); //מספר האירוע
    const [shippingDate, setShippingDate] = useState(""); //תאריך שליחה
    const [email, setEmail] = useState(""); // מייל לקוח
  


    const [selectedSalads, setSelectedSalads] = useState([]); //סלטים נבחרים
    const [selectedFirstDishes, setSelectedFirstDishes] = useState([]); //מנות ראשונות נבחרות
    const [selectedMainDishes, setSelectedMainDishes] = useState([]); //נבחרו מנות עיקריות
    const [selectedSides, setSelectedSides] = useState([]); //צדדים נבחרים 
    

    const [orderSummary, setOrderSummary] = useState(null); //מערך המכיל סיכום ההזמנה
    const [totalPrice, setTotalPrice] = useState(0); //מחיר כולל

    
    const [firstDishQuantities, setFirstDishQuantities] = useState({}); // כמות מנות ראשונות לכל מנה ראשונה
    const [mainDishQuantities, setMainDishQuantities] = useState({}); // כמות מנות עיקריות לכל מנה עיקרית



    const [errorFirstDish, setErrorFirstDish] = useState(null); // הודעת שגיאה כמות מנות לא תואמות למוזמנים
    const [errorMainDish, setErrorMainDish] = useState(null); // הודעת שגיאה כמות מנות לא תואמות למוזמנים
  
    const [isQuantityModalOpen, setIsQuantityModalOpen] = useState(false); // מצב חלון הכמויות
    const [errorMessage , setErrorMessage] = useState(null); // הודעת שגיאה כללית 
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [selectedImage, setSelectedImage] = useState(null); // בחירת ראיית תמונה

    const [openImageDialog, setOpenImageDialog] = useState(false);
    
     // המגבלות עבור כל קטגוריה
  const maxSalads = 8;
  const maxFirstDishes =3;
  const maxMainDishes = 3;
  const maxSides =3;

    const [totalDelivery , setTotalDelivery] = useState(0);

  
     const [imagesByCategory, setImagesByCategory] = useState({
       first_courses: [],
       main_courses: [],
       salads: [],
       side_dishes: [],
     });

const [loading, setLoading] = useState(false);




const [shippingCost, setShippingCost] = useState(0); // דמי משלוח


const [serviceCost, setServiceCost] = useState(0);// דמי שירות מלצרים 


const [deliveryRegion, setDeliveryRegion] = useState('');//אזור משלוח
const [toolsType, setToolsType] = useState("ללא"); // ברירת מחדל: ללא צורך בכלים
const [exactLocation, setExactLocation] = useState('');//מיקום מיוחד

// ------------------------------------------------------------
const [subtotal, setSubtotal] = useState(0);       // סכום לפני מע"מ
const [vatAmount, setVatAmount] = useState(0);     // סכום מע"מ


const summaryRef = useRef(null); // יוזרים יכולים לקרוא לזה גם scrollTarget או משהו דומה
const formSectionRef = useRef(null);

  //-----------מלאי התפריט---------------------------------------------------------------
    useEffect(() => {
        const fetchInventoryAll = async () => {
            try {
                 const data = await apiFetch('/api/inventoryAll');
                setInventoryAll(data);
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            }
        };

        fetchInventoryAll();
    }, []);

    // פונקציה להורדת כל התוויים שאינם עבריים מהשם
const removeNonHebrew = (text) => { 
  return text.replace(/_/g, ' ').replace(/_[a-zA-Z0-9]+$/, ''); // מחליף את כל ה-underscore לרווח ומסיר את כל התוויים הלטיניים אחרי קו תחתון
};
  //------------תמונות התפריט---------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    const fetchImages = async () => {
      try {
        const data = await apiFetch('/api/getUploadedImages');
        setImagesByCategory(data);
      } catch (err) {
        console.error('Error fetching images by categories:', err);

      }finally {
        setLoading(false); // סיום טעינה
      }
    };

    fetchImages();
  }, []);
  //------------------------------------------------------------------
    useEffect(() => {
      if (customerOrderSummary && orderSummary) {
        setIsModalOpen(true); // פותחים את המודל כאשר יש מידע להזמנה
      }
    }, [customerOrderSummary, orderSummary]);
  //--------------------------------------------------------------------------
  const validateSelections = () => { // בדיקת הבחירות של הלקוח
    
    if (selectedSalads.length > maxSalads) {
      setErrorMessage(`לא ניתן לבחור יותר מ-${maxSalads} סלטים.`);
      return false;
    }
    if (selectedFirstDishes.length > maxFirstDishes) {
      setErrorMessage(`לא ניתן לבחור יותר מ-${maxFirstDishes} מנות ראשונות.`);
      return false;
    }
    if (selectedMainDishes.length > maxMainDishes) {
      setErrorMessage(`לא ניתן לבחור יותר מ-${maxMainDishes} מנות עיקריות.`);
      return false;
    }
    if (selectedSides.length > maxSides ) {
      setErrorMessage(`לא ניתן לבחור יותר מ-${maxSides} תוספות.`);
      return false;
    }
    setErrorMessage(null); // אם אין שגיאה, ננקה את ההודעה
    return true;
  };


  //--- חישוב המנות כולם  --------------------------------------------------------------
    const handleSubmit = async () => {

      const totalFirstDish = Object.values(firstDishQuantities).map(quantity => Number(quantity)).reduce((total, quantity) => total + quantity, 0);
      const totalMainDish  = Object.values(mainDishQuantities).map(quantity => Number(quantity)).reduce((total, quantity) => total + quantity, 0);
  
      setErrorFirstDish(totalFirstDish);
      setErrorMainDish(totalMainDish);
      
      if (totalFirstDish > guestCount || totalFirstDish < guestCount || totalMainDish > guestCount || totalMainDish < guestCount ) {
        setErrorMessage(" הכמויות שהזנת לא תואמות את כמות המוזמנים . אנא חשב שוב את הכמויות");  
        setTimeout(() => {
           setErrorMessage(null);
        },7000);
      } else {
        setErrorMessage(null); // אם אין שגיאה, ננקה את ההודעה
    
        let total = 0;
  
        const roundWeight = (weight) => {  // פונקציה לעיגול המשקל
          const rounded = Math.ceil(weight / 500) * 500;
          return rounded;
        };
    
        // סלטים
        const selectedSaladsData = selectedSalads.map((id) => {
          const salad = inventoryAll.salads.find(d => Number(d.id) === Number(id));

            const totalWeight = roundWeight(salad.weight * guestCount); // עיגול המשקל
            const totalPrice = totalWeight * salad.price / 1000;
            total += totalPrice;       
            return {
                dish_name: salad.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
        //מנה ראשונה
        const selectedFirstDishesData = selectedFirstDishes.map((id) => {
            const firstDish = inventoryAll.first_courses.find(d => d.id === id);
            let totalPrice = 0;
            let totalWeight = 0;
            if (firstDish.weight > 0 && firstDish.weight < 2) { // יחידות
                totalPrice = firstDishQuantities[id] * firstDish.price;
                totalWeight = firstDishQuantities[id];
            } else {
                totalWeight = roundWeight(firstDishQuantities[id] * firstDish.weight);
                totalPrice = (totalWeight * firstDish.price / 1000);  
            }
            total += totalPrice;
            return {
                dish_name: firstDish.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
        //מנה עיקרית
        const selectedMainDishesData = selectedMainDishes.map((id) => {
            const mainDish = inventoryAll.main_courses.find(d => d.id === id);
            const noRoundWeightMainDishIds = [3, 8, 11,12, 28 ,29]; // לדוג' פרגית ממולא, אסאדו, צלי וכו'

            let totalPrice = 0;
            let totalWeight = 0;
            if (mainDish.weight > 0 && mainDish.weight < 2) { 
                 // מנות לפי יחידות
                totalPrice = mainDishQuantities[id] * mainDish.price;
                totalWeight = mainDishQuantities[id];
            } else {
            // מנות לפי גרם
            const rawWeight = mainDishQuantities[id] * mainDish.weight;

            if (noRoundWeightMainDishIds.includes(Number(mainDish.id))) {
              totalWeight = rawWeight; // לא נעגל
            } else {
              totalWeight = roundWeight(rawWeight); // כן נעגל
            }

            totalPrice = totalWeight * mainDish.price / 1000;
          }
            total += totalPrice;
            return {
                dish_name: mainDish.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
        // תוספות
        const selectedSidesData = selectedSides.map((id) => {
         const side = inventoryAll.side_dishes.find(d => Number(d.id) === Number(id));
            const totalWeight = roundWeight(side.weight * guestCount ); // עיגול המשקל
            const totalPrice = totalWeight * side.price / 1000;
            total += totalPrice;
            return {
                dish_name: side.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        }).filter(Boolean);
    
        const selectedItems = {
            salads: selectedSaladsData,
            first_courses: selectedFirstDishesData,
            main_courses: selectedMainDishesData,
            side_dishes: selectedSidesData
        };

        // הוספת רווח של 40%
          const profitRate = 0.4; // 40%
          const profitAmount = total * profitRate; // שיעור רווח 
          total += profitAmount; // הוספת הרווח
        
          total += totalDelivery;

        const vatRate = 0.18; // מחיר המעם בישראל 

       setSubtotal(Number(total.toFixed(2))); // סכום לפני מעם 
        const vatAmount = total * vatRate; // סכום מע״מ בלבד
        setVatAmount(vatAmount);  // סכום מע״מ בסטיט

       const totalWithVAT = total + vatAmount; // כולל מע״מ

        setOrderSummary(selectedItems);
       setTotalPrice(Number(totalWithVAT)); // סכום סופי כולל מע״מ 

        setCustomerOrderSummary(selectedItems);  
        setIsQuantityModalOpen(false);
        setOnlineOrderMain(false);
      }
    };
    
  
    //--------------הוספת הזמנה למערכת מנהל ------------------------------------------------------------
   const addOrdersOnline = async () => {
     try {
        setLoading(true);
              const data = await apiFetch('/api/addOrdersOnline', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      userName: eventOwner,
                      userPhone: phoneNumber,
                      guestCount: guestCount,
                      eventDate: eventDate,
                      orderMenu: customerOrderSummary,
                      totalPrice: totalPrice,
                      shippingDate: shippingDate,
                      email: email,
                      event_location: deliveryRegion,
                      address: exactLocation,
                      shippingCost: shippingCost,
                      serviceCost: serviceCost,
                      toolsType: toolsType, 
                      eventType: "תפריט כללי"
                  }),
              });
           if (data.message === "נשלח בהצלחה") {
            setSendingToManger("true");

           }

          } catch (error) {
              console.error('שגיאה בשמירת ההזמנה:', error);
              alert("אירעה שגיאה בשמירת ההזמנה.");
          }
      } 


//--------------------------------------------------------------------------    
      const [errors, setErrors] = useState({
        phoneNumber: '',
        guestCount: '',
        email:'',
    });


  // בדיקת הלקוח בהכנסת פרטים
 let hasError = false; 
  const openQuantityModal = () => { 
    const newErrors = {
        eventOwner: '',
        eventDate: '',
        guestCount: '',
    };

    if (guestCount < 30 || guestCount > 1000) { // בדיקת כמות מוזמנים (לא יותר מ-1000)
      newErrors.guestCount = "כמות המוזמנים חייבת להיות לפחות 30 איש";
        hasError = true;
    }

  // בדיקת שם מלא (לא ריק)
  if (!eventOwner.trim()) {
    newErrors.eventOwner = "עריכת שם שדה חובה";
    hasError = true;
  }
  // בדיקת תאריך האירוע (לא פחות מ-3 ימים מהיום)
  const today = dayjs(); // התאריך הנוכחי
  const selectedDate = dayjs(eventDate); // התאריך שנבחר
  if (selectedDate.isBefore(today.add(3, 'day'), 'day')) {
    newErrors.eventDate = "אין אפשרות להזמין תפריט בתוך שלושה ימי עסקים מהיום";
    hasError = true;
  }

   // בדיקת תאריך האירוע - לא יכול להיות לפני היום הנוכחי
   const today2 = dayjs(); // התאריך הנוכחי
   const selectedDate2 = dayjs(eventDate); // התאריך שנבחר
   if (!eventDate || selectedDate.isBefore(today, 'day')) {
     newErrors.eventDate = "תאריך האירע צריך להיות לאחר היום הנוכחי";
     hasError = true;
   }

    setErrors(newErrors);
    setShippingDate(new Date().toISOString().slice(0, 19).replace('T', ' '));
    setTotalDelivery(calculateDeliveryCost(deliveryRegion));

    if (!hasError) {
      setIsQuantityModalOpen(true);
      setLoginUser(null);
    }
  };
  //---- הלקוח בסגירת הזמנה-----------------------------------
  const validateFinalForm = () => {
  let hasFinalError = false;
  const newErrors = { ...errors }; // שומר את השגיאות הקיימות

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    newErrors.phoneNumber = 'מספר פלאפון לא תקין (10 ספרות בלבד)';
    hasFinalError = true;
  } else {
    newErrors.phoneNumber = '';
  }

 const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!emailRegex.test(email)) {
    newErrors.email = 'כתובת מייל לא חוקית';
    hasFinalError = true;
  } else {
    newErrors.email = '';
  }

  setErrors(newErrors);
  return !hasFinalError;
};

  //--------------------------------------------------------------------------
//חלון הרשמה 
    const openEditModal = () => {  
    if (!validateSelections()) return;
      setLoginUser("true"); 
  };
    //--------------------------------------------------------------------------
  //סגירת חלון הרשמה 
  const closeEditModal = () => {
    setLoginUser(null);
  };
    //--------------------------------------------------------------------------
  // שינוי כמות הלקוח
  const handleQuantityChange = (category, id, quantity) => {
    switch (category) { 
      case 'first_courses':
        // עדכון כמות המנות הראשונות
        setFirstDishQuantities(prev => ({ ...prev, [id]: quantity }));
        break;
      case 'main_courses':
        // עדכון כמות המנות העיקריות
        setMainDishQuantities(prev => ({ ...prev, [id]: quantity }));
        break;
      default:
        break;
    }
  };

// בדיקה אם המשתמש בחר משהו מכל הקטגוריות----------------------------------------------------
  const handleOrderSummaryClick = () => {
    if (
      selectedSalads.length === 0 ||
      selectedFirstDishes.length === 0 ||
      selectedMainDishes.length === 0 ||
      selectedSides.length === 0
    ) {
      // אם לא נבחר שום דבר, הצג הודעת שגיאה
      setErrorMessage("נא לבחור לפחות מנה אחת מכל קטגוריה.");
    } else {
      // אם נבחרו פריטים, פתח את המודל
      openEditModal();
    }
  };

//-------------פתיחת תמונה לצפייה-------------------------------------
const handleImageClick = (imageSrc) => {
  setSelectedImage(imageSrc);
  setOpenImageDialog(true);
};
//-------------------------------------------------
const closeDialog = () => {
  setOpenImageDialog(false);
  setSelectedImage(null);
};
//----------------------------------------------
useEffect(() => {
  if (customerOrderSummary && orderSummary && summaryRef.current) {
    summaryRef.current.scrollIntoView({ behavior: 'smooth' }); // גלילה חלקה לסיכום
  }
}, [customerOrderSummary, orderSummary]);

//----------------------------------------------------


//------------משלוח לאזורים ----------------------------------
const regionPrices = {
  "ירושלים והסביבה": 50,
  "תל אביב והמרכז": 40,
  "חיפה והצפון": 60,
  "באר שבע והדרום": 70,
  "השפלה": 45,
  "יהודה ושומרון": 55,
  "השרון": 50,
  "הגליל": 65,
  "נגב": 75,
 "אולמי הפנינה": 0
};

// לאחר בחירת האזור, חישוב עלות ההובלה
const calculateDeliveryCost = (region) => {
  return regionPrices[region] || 0; // אם לא נמצא אזור, מחזיר 0
};



//------------מציאת תמונה למנה --------------------------------------------------------
const imagesMap = useMemo(() => {//סלטים
  const map = new Map();
  imagesByCategory.salads.forEach(img => {
    map.set(removeNonHebrew(img.display_name), img.url);
  });
  return map;
}, [imagesByCategory.salads]);

const firstCoursesImageMap = useMemo(() => {//מנה ראשונה 
  const map = new Map();
  imagesByCategory.first_courses.forEach(img => {
    map.set(removeNonHebrew(img.display_name), img.url);
  });
  return map;
}, [imagesByCategory.first_courses]);


const mainCoursesImageMap = useMemo(() => {// מנה עיקרת 
  const map = new Map();
  imagesByCategory.main_courses.forEach(img => {
    map.set(removeNonHebrew(img.display_name), img.url);
  });
  return map;
}, [imagesByCategory.main_courses]);


const sideDishesImageMap = useMemo(() => {// תוספות
  const map = new Map();
  imagesByCategory.side_dishes.forEach(img => {
    map.set(removeNonHebrew(img.display_name), img.url);
  });
  return map;
}, [imagesByCategory.side_dishes]);



return (
  <div>
     <NavbarHome sx={{ padding: 0, margin: 0 }} />
    <br/><br/><br/>
  {/* תיבת תמונה עם כותרת במרכז */}
  <Box
    sx={{
      position: "relative",
      width: "100%",
      maxHeight: "500px",
      overflow: "hidden",
      mb: 4, // רווח מתחת לתמונה
    }}
  >
    <Box
      component="img"
      src="https://res.cloudinary.com/dhkegagjk/image/upload/v1754492906/pexels-ella-olsson-572949-1640773_l5ebhe.jpg"
      alt="אולם האירועים הפנינה"
      sx={{
        width: "100%",
        maxHeight: "400px",
        objectFit: "cover",
        backgroundPosition: "center",
        filter: "brightness(50%)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    />
    <Typography
      variant="h3"
      component="h1"
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontWeight: "bold",
        fontSize: { xs: "2.5rem", md: "5rem" }, // רספונסיבי לגודל גופן
        color: "#FFD700",
        textAlign: "center",
        textShadow: "2px 2px 4px black",
        zIndex: 1000,
      }}
    >
    התפריט שלנו
    </Typography>
  </Box>
{onlineOrderMain && (
    <div className="online-order-container">

{/* המלל בהתחלה  */}
     <Box sx={{ fontWeight: 1200 }}>
  <Container
    dir="rtl"
    sx={{
      maxWidth: "1200px", // קובע מקסימום 1200px גם בדסקטופ
      width: "100%",
      backgroundColor: 'rgba(255, 255, 255, 0.92)',
      borderRadius: 3,
      boxShadow: 3,
      px: { xs: 2, sm: 4 },
      py: { xs: 3, sm: 6 },
    }}
  >
    <Typography
      variant="h4"
      sx={{
        fontWeight: 1200,
        color: '#1b5e20',
        mb: { xs: 1, sm: 2 },
        fontSize: { xs: '1.6rem', sm: '2rem' },
        textAlign: 'center',
      }}
    >
      תפריט אירועים 
    </Typography>

    <Typography
      variant="h6"
      sx={{
        color: '#4e342e',
        mb: { xs: 1.5, sm: 2 },
        fontSize: { xs: '1rem', sm: '1.2rem' },
        textAlign: 'center',
      }}
    >
      קייטרינג הפנינה - כשר למהדרין יורה דעה הרב מחפוד
    </Typography>

    <Typography
      variant="body1"
      sx={{
        mb: 2,
        fontSize: { xs: '0.85rem', sm: '1rem' },
        fontWeight: 500,
        textAlign: 'center',
        color: '#333',
      }}
    >
      פלאפון: <strong>  054-6600-200 </strong> | מייל: hpnina6600200@gmail.com
    </Typography>

    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        fontSize: { xs: '0.8rem', sm: '1rem' },
        mb: 2,
        textAlign: 'center',
      }}
    >
      ברוכים הבאים! לפניכם התפריט העשיר שלנו בו תקבלו בפשטות ובמהירות הצעת מחיר משתלמת במיוחד עבור האירוע שלכם.
      <br />
      שליחת התפריט אינה מהווה התחייבות עד לאישור סופי מנציג.
    </Typography>

    <Typography
      variant="subtitle1"
      sx={{
        color: '#2e7d32',
        fontWeight: 600,
        fontSize: { xs: '0.9rem', sm: '1rem' },
        textAlign: 'center',
      }}
    >
      מינימום הזמנה 30 מנות !!
    </Typography>
  </Container>
     </Box>


      <div dir="rtl" className="menu-container">
       
          
        {loading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )} 

  {/* להודעת שגיאה */}
      <Snackbar
              open={!!errorMessage} 
              autoHideDuration={6000} 
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} // מיקום ההודעה
              onClose={() => setErrorMessage(null)} 
            >
              <Alert severity="error" sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
       </Snackbar>


{/*  התפריט */}

<Box mt={6}>
 
  <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
    <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
    <Typography
      variant="h5"
      sx={{
        fontWeight: 700,
        color: '#333',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      סלטים [8 לבחירה]
    </Typography>
    <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
  </Box>
 {/* סלטים */}
  <Grid container spacing={2} justifyContent="center">
    {inventoryAll.salads.filter((side) => side.is_hidden).map((salad) => {
      const imageUrl = imagesMap.get(removeNonHebrew(salad.dish_name)) || null;
      return (
        <Grid size={{ xs:6, sm: 3 }}  key={salad.id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 3,
            }}
          >
            {imageUrl ? (
              <CardMedia
                component="img"
                height="140"
                image={imageUrl}
                alt={salad.dish_name}
                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                onClick={() => handleImageClick(imageUrl)}
              />
            ) : (
              <Box
                height="140px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bgcolor="#f0f0f0"
                color="#888"
                fontSize="0.9rem"
                fontStyle="italic"
                textAlign="center"
                px={1}
              >
                טרם צולמה תמונה למנה
              </Box>
            )}

            <CardContent sx={{ px: 1.5, py: 1 }}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                flexDirection="row-reverse"
                gap={1}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.9rem' },
                    textAlign: 'right',
                    flexGrow: 1,
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    lineHeight: 1.4,
                  }}
                >
                  {salad.dish_name}
                </Typography>
                <Checkbox
                  value={salad.id}
                  size="small"
                  sx={{ padding: '4px', marginRight: 0 }}
                  onChange={(e) => {
                    const id = salad.id;
                    setSelectedSalads((prev) =>
                      e.target.checked ? [...prev, id] : prev.filter((s) => s !== id)
                    );
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      );
    })}
  </Grid>

  {/* מנה ראשונה */}
  <Box mt={6}>
    <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        מנה ראשונה [3 לבחירה]
      </Typography>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
    </Box>

    <Grid container spacing={2} justifyContent="center">
      {inventoryAll.first_courses.filter((side) => side.is_hidden).map((firstDish) => {
        const imageUrl = firstCoursesImageMap.get(removeNonHebrew(firstDish.dish_name)) || null;
        return (
          <Grid size={{ xs:6, sm: 3 }} key={firstDish.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
              }}
            >
              {imageUrl ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  alt={firstDish.dish_name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(imageUrl)}
                />
              ) : (
                <Box
                  height="140px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="#f0f0f0"
                  color="#888"
                  fontSize="0.9rem"
                  fontStyle="italic"
                  textAlign="center"
                  px={1}
                >
                  טרם צולמה תמונה למנה
                </Box>
              )}

              <CardContent sx={{ px: 1.5, py: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row-reverse"
                  gap={1}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      textAlign: 'right',
                      flexGrow: 1,
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word',
                      lineHeight: 1.4,
                    }}
                  >
                    {firstDish.dish_name}
                  </Typography>
                  <Checkbox
                    value={firstDish.id}
                    size="small"
                    sx={{ padding: '4px', marginRight: 0 }}
                    onChange={(e) => {
                      const id = firstDish.id;
                      setSelectedFirstDishes((prev) =>
                        e.target.checked ? [...prev, id] : prev.filter((f) => f !== id)
                      );
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>

  {/* מנה עיקרית */}
  <Box mt={6}>
    <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        מנה עיקרית [3 לבחירה]
      </Typography>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
    </Box>

    <Grid container spacing={2} justifyContent="center">
      {inventoryAll.main_courses.filter((side) => side.is_hidden).map((mainDish) => {
        const imageUrl = mainCoursesImageMap.get(removeNonHebrew(mainDish.dish_name)) || null;
        return (
          <Grid size={{ xs:6, sm: 3 }} key={mainDish.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
              }}
            >
              {imageUrl ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  alt={mainDish.dish_name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(imageUrl)}
                />
              ) : (
                <Box
                  height="140px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="#f0f0f0"
                  color="#888"
                  fontSize="0.9rem"
                  fontStyle="italic"
                  textAlign="center"
                  px={1}
                >
                  טרם צולמה תמונה למנה
                </Box>
              )}

              <CardContent sx={{ px: 1.5, py: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row-reverse"
                  gap={1}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      textAlign: 'right',
                      flexGrow: 1,
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word',
                      lineHeight: 1.4,
                    }}
                  >
                    {mainDish.dish_name}
                  </Typography>
                  <Checkbox
                    value={mainDish.id}
                    size="small"
                    sx={{ padding: '4px', marginRight: 0 }}
                    onChange={(e) => {
                      const id = mainDish.id;
                      setSelectedMainDishes((prev) =>
                        e.target.checked ? [...prev, id] : prev.filter((m) => m !== id)
                      );
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>

  {/* תוספות */}
  <Box mt={6} mb={6}>
    <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        תוספות [3 לבחירה]
      </Typography>
      <Box sx={{ flex: 1, height: '2px', backgroundColor: '#90caf9', mx: 2 }} />
    </Box>

    <Grid container spacing={2} justifyContent="center">
      {inventoryAll.side_dishes.filter((side) => side.is_hidden).map((side) => {
        const imageUrl = sideDishesImageMap.get(removeNonHebrew(side.dish_name)) || null;
        return (
          <Grid size={{ xs:6, sm: 3 }}  key={side.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: 3,
              }}
            >
              {imageUrl ? (
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  alt={side.dish_name}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleImageClick(imageUrl)}
                />
              ) : (
                <Box
                  height="140px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="#f0f0f0"
                  color="#888"
                  fontSize="0.9rem"
                  fontStyle="italic"
                  textAlign="center"
                  px={1}
                >
                  טרם צולמה תמונה למנה
                </Box>
              )}

              <CardContent sx={{ px: 1.5, py: 1 }}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  flexDirection="row-reverse"
                  gap={1}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      textAlign: 'right',
                      flexGrow: 1,
                      whiteSpace: 'normal',
                      overflowWrap: 'break-word',
                      lineHeight: 1.4,
                    }}
                  >
                    {side.dish_name}
                  </Typography>
                  <Checkbox
                    value={side.id}
                    size="small"
                    sx={{ padding: '4px', marginRight: 0 }}
                    onChange={(e) => {
                      const id = side.id;
                      setSelectedSides((prev) =>
                        e.target.checked ? [...prev, id] : prev.filter((s) => s !== id)
                      );
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  </Box>
</Box>








   {/* כפתור סיכום הזמנה */}
        <div className="order-summary-container">
        <br />
        <button onClick={handleOrderSummaryClick} className="order-summary-button">
          סיכום הזמנה
        </button>
        <br />
        <br />
      </div>

      </div>


   {/* תמונות הגדלה */}
<Dialog
  open={openImageDialog}
  onClose={closeDialog}
  maxWidth="xl"
  fullWidth
  PaperProps={{
    sx: {
      backgroundColor: "transparent", // שקוף לחלוטין
      boxShadow: "none",
      m: 0,
      p: 0,
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: "rgba(0, 0, 0, 0.3)", // שקיפות עדינה מסביב לתמונה
    },
  }}
>
  <DialogContent
    sx={{
      p: 0,
      m: 0,
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      cursor: "pointer", // כדי שהמשתמש יבין שאפשר לסגור
    }}
    onClick={closeDialog} // סוגר בלחיצה על הרקע
  >
    {selectedImage ? (
      <Box
        component="img"
        src={selectedImage}
        alt="תמונה מוגדלת"
        onClick={(e) => e.stopPropagation()} // לא נסגר כשנלחצים על התמונה עצמה
        sx={{
          maxWidth: "95vw",
          maxHeight: "95vh",
          objectFit: "contain",
          borderRadius: 2,
          boxShadow: 3,
        }}
      />
    ) : (
      <Typography
        variant="body1"
        sx={{ color: "#444", backgroundColor: "#fff", p: 2, borderRadius: 1 }}
      >
        תמונת ברירת מחדל – טרם צולמה תמונה למנה
      </Typography>
    )}
  </DialogContent>
</Dialog>







  </div>
     )}


{/* -------------------חלון השארת פרטים--------------------------------------------------------- */}
 {loginUser && (
  <Modal open={true} onClose={closeEditModal}>
    <Box
      dir="rtl"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        borderRadius: 3,
        padding: 4,
        width: '90%',
        maxWidth: 400,
        boxShadow: 24,
      }}
    >
      <Stack spacing={3}>
  <Typography variant="h6" align="center">
    בוא נחשב לך הצעת מחיר 🔍
  </Typography>

  <TextField
    label="שם מלא"
    type="text"
    
    value={eventOwner}
    onChange={(e) => setEventOwner(e.target.value)}
    fullWidth
    error={Boolean(errors.eventOwner)}
    helperText={errors.eventOwner || 'נשתמש בשם כדי לפנות אליך אישית'}
    required
  />

<TextField
  label="כמה אורחים צפויים?"
  type="number"
  value={guestCount}
  onChange={(e) => setGuestCount(Number(e.target.value))}
  fullWidth
  inputProps={{ inputMode: 'numeric', min: 1 }}
  error={Boolean(errors.guestCount)}
  helperText={errors.guestCount || 'רק מספר משוער, אפשר לשנות בהמשך'}
  required
/>


  <TextField
    label="מתי האירוע?"
    type="date"
    value={eventDate}
    onChange={(e) => setEventDate(e.target.value)}
    fullWidth
    InputLabelProps={{ shrink: true }}
    error={Boolean(errors.eventDate)}
    helperText={errors.eventDate}
    required
  />

  <Button variant="contained" size="large" onClick={openQuantityModal}>
    המשך להצעת מחיר
  </Button>
</Stack>

    </Box>
  </Modal>
)}


  {/* ---------------- חלון כמות מנות -------------------------------------------------------------------- */}
  <Dialog textAlign="center" open={isQuantityModalOpen}>
      <DialogTitle>
        <Typography variant="h6" style={{fontFamily:"-moz-initial"}}>! עזור לנו לדעת מה רצונך</Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" style={{fontFamily:"-moz-initial"}}>הגדר את כמות המנות במדויק עבור כל סוג מנה שבחרת</Typography>
        <Typography variant="body1" style={{fontFamily:"-moz-initial"}}>פרוס את בחירתך עבור : <strong>{guestCount}</strong> איש לכל קטגוריה</Typography>

        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" style={{fontWeight: 'bold'}}>מנות ראשונות</Typography>
          {selectedFirstDishes.map((id) => {
            const dish = inventoryAll.first_courses.find(d => d.id === id);
            return (
              <Grid container spacing={1} key={id} alignItems="center">
                <Grid  size={{ xs: 12, sm: 6 }}>
                  <Typography style={{fontFamily:"-moz-initial"}}> {dish.dish_name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} marginTop={1} >
                  <TextField
                    fullWidth
                    type="number"
                    min="0"
                    value={firstDishQuantities[id]}
                    onChange={(e) => handleQuantityChange('first_courses', id, e.target.value)}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>        
              </Grid>
            );
          })}
          {errorFirstDish && (errorFirstDish > guestCount || errorFirstDish < guestCount) && (
            <Typography color="error" variant="body2">הזנת: <strong>{errorFirstDish}</strong> אך יש לך {guestCount} מוזמנים</Typography>
          )}
        </div>
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6" style={{fontWeight: 'bold'}}>מנות עיקריות</Typography>
          {selectedMainDishes.map((id) => {
            const dish = inventoryAll.main_courses.find(d => d.id === id);
            return (
              <Grid container spacing={1} key={id} alignItems="center">  
              <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography style={{fontFamily:"-moz-initial"}}>{dish.dish_name}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }} marginTop={1}>
                  <TextField
                    fullWidth
                    type="number"
                    min="0"
                    value={mainDishQuantities[id]}
                    onChange={(e) => handleQuantityChange('main_courses', id, e.target.value)}
                    required
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              
              </Grid>
            );
          })}
          {errorMainDish && (errorMainDish > guestCount || errorMainDish < guestCount) && (
            <Typography color="error" variant="body2">הזנת: <strong>{errorMainDish}</strong> אך יש לך {guestCount} מוזמנים</Typography>
          )}
        </div>
        {errorMessage && (
          <Typography color="error" variant="body2" style={{ marginTop: '5px' }}>
            {errorMessage}
          </Typography>
        )}
      </DialogContent>
      <DialogActions >
        <Button onClick={handleSubmit} color="primary" variant="contained">
          המשך להצעת מחיר
        </Button>
      </DialogActions>
    </Dialog>
    

{/* //-----------------------------סיכום הצעת מחיר------------------------------------------------ */}
{customerOrderSummary && orderSummary && (

  <Box ref={summaryRef} sx={{ padding: 4, maxWidth: 1200, margin: 'auto' }}>
  <br/>
    <Paper ref={formSectionRef}  elevation={3} sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        היי {eventOwner}, תודה שבחרת בקייטרינג הפנינה 🎉
      </Typography>
  
  <Typography variant="h6" sx={{ mt: 2 }}>הצעת המחיר שלך: <strong style={{ color: '#1F8A70' }}>   ₪ {totalPrice.toFixed(2)}</strong>
</Typography>

<Box sx={{ mt: 1, display: 'flex', justifyContent: 'center', gap: 2, color: 'text.secondary' }}>
  <Typography variant="body2" component="span">
    מספר המוזמנים שלך : <strong style={{ color: '#1F8A70' }}>{guestCount}</strong>
  </Typography>
  <Typography variant="body2" component="span">|</Typography>
  <Typography variant="body2" component="span">
    תאריך האירוע שלך : <strong style={{ color: '#1F8A70', marginRight: 4 }}>  {new Date(eventDate).toLocaleDateString('he-IL')} </strong>
  </Typography>
</Box>

<br/>

 <Typography
  color="text.secondary"
  sx={{
    mb: 2,
    textAlign: 'center',
    fontSize: {
      xs: '0.9rem', // גודל לפלאפונים
      sm: '1rem',   // גודל למסכים בינוניים ומעלה
    },
    lineHeight: 1.6,
  }}
>
  ... המחיר אינו כולל: דמי משלוח, שירותי מלצרות, כלי פורצלן, ועוד
</Typography>

<Typography
  color="text.secondary"
  sx={{
    mb: 3,
    textAlign: 'center',
    fontSize: {
      xs: '0.9rem',
      sm: '1rem',
    },
    lineHeight: 1.6,
  }}
>
  שימו ❤ - ניתן לבחור בשירותים נוספים להזמנה = שירות מלא / כלים פורצלן / דמי משלוח - על ידי הנציג שיחזור אליכם
</Typography>


{/* תצוגת תיבות  */}

      <Grid  container spacing={3}>
        {/* מייל */}
        <Grid size={{ xs: 12, sm: 3 }}>
         <TextField
  label="כתובת מייל"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  fullWidth
  required
  error={Boolean(errors.email)}
  helperText={errors.email || ''}
/>
        </Grid>

        {/* פלאפון */}
        <Grid size={{ xs: 12, sm: 3 }}>
         <TextField
  label="מספר פלאפון"
  type="tel"
  value={phoneNumber}
  onChange={(e) => setPhoneNumber(e.target.value)}
  fullWidth
  required
  error={Boolean(errors.phoneNumber)}
  helperText={errors.phoneNumber || ''}
/>
        </Grid>

         {/* אזור משלוח */}
         <Grid  size={{ xs: 12, sm: 3 }}>
  <FormControl fullWidth required>
    <InputLabel id="region-label">אזור משלוח הזמנה</InputLabel>
    <Select
      labelId="region-label"
      value={deliveryRegion}
      onChange={(e) => {
        setDeliveryRegion(e.target.value);

        const regionShippingPrices = {
          'ירושלים והסביבה': 300,
          'בית שמש והסביבה': 250,
          'תל אביב והמרכז': 300,
          'קרית גת, אשקלון, אשדוד': 150,
          'באר שבע והדרום': 300,
          'אזור בנימין': 400,
          'גוש עציון': 350,
          'הרצליה והסביבה': 400,
          'חיפה וצפון': 500,
          'איסוף עצמי: מושב עין צורים': 0,
        };

        const cost = regionShippingPrices[e.target.value] ?? 0;
        setShippingCost(cost);
      }}
    >
      <MenuItem value="ירושלים והסביבה">ירושלים והסביבה</MenuItem>
      <MenuItem value="בית שמש והסביבה">בית שמש והסביבה</MenuItem>
      <MenuItem value="תל אביב והמרכז">תל אביב והמרכז</MenuItem>
      <MenuItem value="קרית גת, אשקלון, אשדוד">קרית גת, אשקלון, אשדוד</MenuItem>
      <MenuItem value="באר שבע והדרום">באר שבע והדרום</MenuItem>
      <MenuItem value="אזור בנימין">אזור בנימין</MenuItem>
      <MenuItem value="גוש עציון">גוש עציון</MenuItem>
      <MenuItem value="הרצליה והסביבה">הרצליה והסביבה</MenuItem>
      <MenuItem value="חיפה וצפון">חיפה וצפון</MenuItem>
      <MenuItem value="איסוף עצמי: מושב עין צורים">איסוף עצמי: מושב עין צורים</MenuItem>
    </Select>
  </FormControl>

 {shippingCost > 0 && (
  <>
    <Typography variant="body2" color="text.secondary">
      דמי משלוח <strong>החל מ -</strong> ₪{shippingCost}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      פרטים נוספים אצל הנציג
    </Typography>
  </>
)}


  {shippingCost === 0 && deliveryRegion === 'איסוף עצמי: מושב עין צורים' && (
    <Typography variant="body2" color="text.secondary">
      הזמנה לא כוללת דמי משלוח (איסוף עצמי)
    </Typography>
  )}
         </Grid>
         
        {/* מיקום מדויק */}
        <Grid size={{ xs: 12, sm: 3 }}>
          <TextField
            label="מיקום מדויק של האירוע"
            value={exactLocation}
            onChange={(e) => setExactLocation(e.target.value)}
            fullWidth
          />
        </Grid>

        {/* סוג כלים
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel id="tools-label">סוג הכלים</InputLabel>
            <Select
              labelId="tools-label"
              value={toolsType}
              onChange={(e) => {
                setToolsType(e.target.value);
                if (e.target.value === 'פורצלן') {
                  setToolCost(500); // דוגמה
                } else if (e.target.value === 'חד פעמי איכותי') {
                  setToolCost(200);
                } else {
                  setToolCost(0);
                }
              }}
            >
              <MenuItem value="פורצלן">כלי פורצלן - 500</MenuItem>
              <MenuItem value="חד פעמי איכותי">חד פעמי איכותי - 200</MenuItem>
              <MenuItem value="ללא">ללא צורך בכלים</MenuItem>
            </Select>
          </FormControl>
          {toolCost > 0 && (
            <Typography variant="body2" color="text.secondary">
              תוספת עבור כלים: ₪{toolCost}
            </Typography>
          )}
        </Grid>

       {/* דמי שירות מלצרים */}

       {/* <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
                <InputLabel id="service-label">שירות ומלצרים</InputLabel>
             <Select
              labelId="service-label"
           value={selectedServiceType}
           onChange={(e) => {
             const selected = e.target.value;
             setSelectedServiceType(selected);
       
             if (selected === 'full') {
               if (!guestCount || guestCount < 1) {
                 alert('אנא הזן את כמות האורחים לפני בחירת שירות מלא');
                 setServiceCost(0);
                 setSelectedServiceType("none");
                 return;
               }
               const calculated = calculateFullServiceCost(guestCount);
               setServiceCost(calculated);
             } else if (selected === 'basic') {
               setServiceCost(500);
             } else {
               setServiceCost(0);
             }
           }}
         >
         
           <MenuItem value="basic">שירות בסיסי = איש מטבח + כלים פורצלן - ₪500</MenuItem>
           <MenuItem value="full">שירות מלא (מחושב לפי כמות אורחים)</MenuItem> 
           <MenuItem value="none">ללא שירות</MenuItem>
         </Select>
         <Typography variant="caption" color="text.secondary">
           השירות מלא תחושב אוטומטית לפי גודל האירוע     
        </Typography>
       </FormControl>
       {serviceCost > 0 && (
         <Typography variant="body2" color="text.secondary">
           תוספת שירות: ₪{serviceCost}
         </Typography>
          )}
     </Grid> } */}





      </Grid>




{/*   פרטי התפריט ללקוח   */}
<Box sx={{ mt: 5, maxWidth: '800px', mx: 'auto' }}>
  <Typography variant="h6" gutterBottom color="primary" textAlign="center">
   🍽️ פרטי ההזמנה שלך 🍽️
  </Typography>

  {Object.keys(orderSummary).map((category) => (
    <Box key={category} sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          borderBottom: '1px solid #ccc',
          pb: 1,
          mb: 2,
          color: '##1F8A70',
        }}
      >
        {category === 'salads'
          ? 'סלטים'
          : category === 'first_courses'
          ? 'מנות ראשונות'
          : category === 'main_courses'
          ? 'מנות עיקריות'
          : 'תוספות'}
      </Typography>

      <List disablePadding>
        {orderSummary[category].map((item, index) => (
          <ListItem
            key={`${item.dish_name}-${index}`}
            sx={{
              bgcolor: index % 2 === 0 ? '#e6e6e6ff':'#fafafa'  ,
              border: '1px solid #c2c2c2ff',
              borderRadius: 1,
              mb: 1,
              px: 2,
              py: 1.5,
            }}
          >
            <ListItemText
              primary={
                <Typography variant="body1" textAlign="right" fontWeight="500">
                  {item.dish_name}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  ))}
</Box>


 <Divider sx={{ my: 3 }} />


{/* סיכום הסכום */}
<Box
  sx={{
    border: '1px solid #ddd',  borderRadius: 2,  p: 2,  mt: 2,  width: '100%',  maxWidth: 400, mx: 'auto', // מרכז את הריבוע
       direction: 'rtl', }}
>
  <Typography
    variant="body1" sx={{ display: 'flex', justifyContent: 'space-between' }} >
    <span>סכום לפני מע״מ:</span>
    <strong>₪ {subtotal.toFixed(2)}</strong>
  </Typography>

  <Typography
    variant="body1"  sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }} >
    <span>מע״מ (18%):</span>
    <strong>₪ {vatAmount.toFixed(2)}</strong>
  </Typography>

  <Divider sx={{ my: 1 }} />

  <Typography
    variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }} >
    <span>סה״כ לתשלום:</span>
    <strong style={{ color: '#1F8A70' }}>₪ {totalPrice.toFixed(2)}</strong>
  </Typography>
</Box>



<Button
  sx={{ mt: 3 }}
  variant="contained"
  color="primary"
  onClick={() => {
    if (validateFinalForm()) {
      addOrdersOnline();
    } else {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }}
  disabled={loading}
  startIcon={loading && <CircularProgress size={20} color="inherit" />}
>
  {loading ? 'שולח הזמנה...' : 'שליחת ההזמנה'}
</Button>


    </Paper>
  </Box>
)}



    {/* -------------------הודעת ברכות להרשמה----------------------------------------------------- */}
   {sendingToManger && (
<Dialog
  open={sendingToManger}
  onClose={() => Navigate('/')}
  fullScreen
  PaperProps={{
    sx: {
      m: 0,
      p: 0,
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      position: 'relative',
      overflow: 'hidden',
    },
  }}
  BackdropProps={{
    sx: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  }}
>
  {/* קונפטי ברקע */}
  <Box
     sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 1500, // גבוה יותר מהדיאלוג
        pointerEvents: 'none', // שלא יפריע ללחיצות
      }}
  >
    <Confetti width={window.innerWidth} height={window.innerHeight} />
  </Box>

  {/* תוכן דיאלוג */}
  <Box
    sx={{
        position: 'relative',
        zIndex: 1600,
        bgcolor: 'white',
        borderRadius: 3,
        textAlign: 'center',
        direction: 'rtl',
        padding: 4,
        width: {
          xs: '90%',
          sm: '70%',
          md: '50%',
        },
        maxHeight: '90vh',
        overflowY: 'auto',
      }}
  >
    <DialogTitle sx={{ fontWeight: 'bold', color: '#1F8A70' }}>
      ברכת מזל טוב - {eventOwner}
    </DialogTitle>

    <DialogContent>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: 'green' }}>
        הזמנתך נשלחה בהצלחה!
      </Typography>

      <Typography variant="body1" sx={{ mb: 1 }}>
        ניצור איתך קשר בהקדם להמשך התהליך
      </Typography>
      <Typography variant="body1" sx={{ mb: 1 }}>
        לאחר אישור ההזמנה תקבלו תגובה במייל ותוכלו לראות את ההזמנות שלכם
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        תודה שבחרתם בקייטרינג הפנינה
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
       אנא שים לב: שליחת ההזמנה הינה שלב ראשוני בלבד ואינה מהווה התחייבות לתשלום או לאישור סופי.
      </Typography>


      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => Navigate('/')}
          sx={{ borderRadius: 2, px: 4 }}
        >
          סגור
        </Button>
      </Box>
    </DialogContent>
  </Box>
</Dialog>

)}



   </div>
 )}


export default OrdersOnline;
