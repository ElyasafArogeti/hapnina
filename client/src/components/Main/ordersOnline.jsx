import React, { useEffect, useState } from 'react';
import '../../assets/stylesMain/OrdersOnline.css';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import dayjs from 'dayjs';
// import html2pdf from 'html2pdf.js';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import  Grid  from '@mui/material/Grid2';

import { MenuItem,Select,InputLabel, Snackbar, Alert ,Modal, Box,Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography, InputAdornment, IconButton,Autocomplete } from '@mui/material';
import NavbarHome from './NavbarHome';
import LinearProgress from '@mui/material/LinearProgress';
import axios from 'axios';


const OrdersOnline = () => {
    const Navigate = useNavigate();
  
    const [inventoryAll, setInventoryAll] = useState({//מאגר המנות
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
    const [userPassword, setUserPassword] = useState(""); // מייל לקוח

    const [showPassword, setShowPassword] = useState(false);  // משתנה כדי לדעת אם להראות או להסתיר את הסיסמה

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
  const maxFirstDishes = 3;
  const maxMainDishes = 3;
  const maxSides = 3;

    const [deliveryRegion, setDeliveryRegion] = useState(null); 
    const [totalDelivery , setTotalDelivery] = useState(0);

    const [address, setAddress] = useState("");  // מיקום קבלת המשלוח
  
     const [imagesByCategory, setImagesByCategory] = useState({
       first_courses: [],
       main_courses: [],
       salads: [],
       side_dishes: [],
     });


   const [loading, setLoading] = useState(false); 

  //--------------------------------------------------------------------------
    useEffect(() => {
        const fetchInventoryAll = async () => {
            try {
               console.log("www");
              const response = await fetch('https://hapnina-b1d08178cec4.herokuapp.com/inventoryAll');
              if (!response.ok) {
                throw new Error('Network response was not ok');
            }
                const data = await response.json();
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
        const response = await axios('https://hapnina-b1d08178cec4.herokuapp.com/getUploadedImages');
        setImagesByCategory(response.data);
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

  //--------------------------------------------------------------------------
    // חישוב המנות כולם  
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
    
        // חישוב סיכום הזמנה
        const selectedSaladsData = selectedSalads.map((id) => {
            const salad = inventoryAll.salads[id - 1];
            const totalWeight = roundWeight(salad.weight * guestCount); // עיגול המשקל
            const totalPrice = totalWeight * salad.price / 1000;
            total += totalPrice;       
            return {
                dish_name: salad.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
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
    
        const selectedMainDishesData = selectedMainDishes.map((id) => {
            const mainDish = inventoryAll.main_courses.find(d => d.id === id);
            let totalPrice = 0;
            let totalWeight = 0;
            if (mainDish.weight > 0 && mainDish.weight < 2) { // יחידות
                totalPrice = mainDishQuantities[id] * mainDish.price;
                totalWeight = mainDishQuantities[id];
            } else {
                totalWeight = roundWeight(mainDishQuantities[id] * mainDish.weight); // עיגול המשקל
                totalPrice = totalWeight * mainDish.price / 1000;
            }
            total += totalPrice;
            return {
                dish_name: mainDish.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
        const selectedSidesData = selectedSides.map((id) => {
            const side = inventoryAll.side_dishes[id - 1];
            const totalWeight = roundWeight(side.weight * guestCount ); // עיגול המשקל
            const totalPrice = totalWeight * side.price / 1000;
            total += totalPrice;
            return {
                dish_name: side.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: Number(totalWeight).toFixed(2)
            };
        });
    
        const selectedItems = {
            salads: selectedSaladsData,
            first_courses: selectedFirstDishesData,
            main_courses: selectedMainDishesData,
            side_dishes: selectedSidesData
        };
        console.log(total);
        
        total += totalDelivery;
        console.log(total);
        
        setOrderSummary(selectedItems);
        setTotalPrice(total.toFixed(2));
        setCustomerOrderSummary(selectedItems);  
        setIsQuantityModalOpen(false);
        setOnlineOrderMain(false);
      }
    };
    
    
    
    //--------------הוספת הזמנה למערכת מנהל ------------------------------------------------------------
   const addOrdersOnline = async () => {
     try {
              const response = await fetch('https://hapnina-b1d08178cec4.herokuapp.com/addOrdersOnline', {
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
                      Password : userPassword,
                      event_location: deliveryRegion,
                      address: address  // כתובת מדויקת לשליחה
                  }),
              });
              const data = await response.json();
              if (data.message === 'נשלח בהצלחה') {
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
        Password: '',
        address: ''
    });
  //--------------------------------------------------------------------------
  const openQuantityModal = () => { // כמות המנות שבוחר הלקוח
    let hasError = false; // בדיקת הלקוח בהכנסת פרטים
    const newErrors = {
        eventOwner: '',
        eventDate: '',
        phoneNumber: '',
        guestCount: '',
        email: '',
        Password: '', 
        address: ''
    };

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {  // בדיקת מספר פלאפון (10 ספרות)
        newErrors.phoneNumber = "מספר הפלאפון חייב להיות בן 10 ספרות";
        hasError = true;
    }
    if (guestCount < 30 || guestCount > 1000) { // בדיקת כמות מוזמנים (לא יותר מ-1000)
      newErrors.guestCount = "כמות המוזמנים חייבת להיות לפחות 30 איש";
        hasError = true;
    }
       // בדיקה עבור המייל
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {  
        newErrors.email = "כתובת מייל אינה חוקית";
        hasError = true;
    }

  // בדיקת שם מלא (לא ריק)
  if (!eventOwner.trim()) {
    newErrors.eventOwner = "עריכת שם שדה חובה";
    hasError = true;
  }

  // בדיקת סיסמא (לפחות 4 תווים)
  if (userPassword.length < 4) {
    newErrors.Password = "הסיסמה חייבת להיות לפחות 4 ספרות";
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

   if(address.length === 0){
    newErrors.address = "  שדה חובה";
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

//--------------------------------------------------
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
useEffect(() => { // אם המידע קיים, נגלול את הדף לראש
  if (customerOrderSummary && orderSummary) {
    window.scrollTo(0, 0); // גלילה לראש העמוד
  }
}, [customerOrderSummary, orderSummary]); // פונקציה זו תתבצע בכל פעם שהמידע משתנה
//----------------------------------------------------
const handleClickShowPassword = () => { // מתחלף בין הצגת הסיסמה להסתרת הסיסמה
  setShowPassword((prev) => !prev); 
};

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

//-------------------------------------------------------------------------------------




return (
  <div>
    <NavbarHome/>


    
{onlineOrderMain && (
    <div className="online-order-container">
      <div className="order-header">
        <h2 className="order-header-title">בחירת תפריט </h2>
      </div>
      <div dir="rtl" className="menu-container">
        <div className="menu-header">
          <h1 className="menu-title">תפריט אירועים</h1>
          <h2 className="menu-subtitle">קייטרינג הפנינה - כשר למהדרין</h2>
          <p className="menu-contact">פלאפון - 054-6600-200 | מייל - eli6600200@gmail.com</p>
        </div>
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

        <table className="menu-table-order-online" dir="rtl">
          <tbody>
            {/* סלטים */}
            <tr>
            <td className="menu-section-from">
              <h2 className="menu-section-title">סלטים [8 לבחירה]</h2>
              <ul className="menu-list">
                {inventoryAll.salads.filter(side => side.is_hidden).map((salad) => { // מציאת התמונה המתאימה לפי שם המנה
                console.log(salad);
                
                  const image = imagesByCategory.salads.find(img =>removeNonHebrew(img.display_name).includes(salad.dish_name));      
                  return (
                    <div key={salad.id} className="menu-item-img">
                    <img
                     src={image ? image.url : 'https://via.placeholder.com/150'}  // תמונה ברירת מחדל
                     alt={salad.dish_name}
                     className="menu-item-thumbnail"
                     onClick={() => handleImageClick(image ? image.url : '')}  // לחיצה על התמונה
                   />
                      <label className="menu-item-label">
                        <span className="menu-item-name">{salad.dish_name}</span>
                      </label>
                      <input
                        type="checkbox"
                        value={salad.id}
                        className="menu-checkbox"
                        onChange={(e) => {
                          const id = salad.id;
                          setSelectedSalads((prev) => {
                            if (e.target.checked) {
                              return [...prev, id];
                            } else {
                              return prev.filter((s) => s !== id);
                            }
                          });
                        }}
                      />
                    </div>
                  );
                })}
              </ul>
            </td>
            </tr>

   {/* מנה ראשונה */}
<tr>
  <td className="menu-section-from">
    <h2 className="menu-section-title">מנה ראשונה [3 לבחירה]</h2>
    <ul className="menu-list">
      {inventoryAll.first_courses.filter(side => side.is_hidden).map((firstDish) => {
        const image = imagesByCategory.first_courses.find(img =>
          removeNonHebrew(img.display_name).includes(firstDish.dish_name)
        );
        return (
          <div key={firstDish.id} className="menu-item-img">
            <img
              src={image ? image.url : 'https://via.placeholder.com/150'} // תמונה ברירת מחדל
              alt={firstDish.dish_name}
              className="menu-item-thumbnail"
              onClick={() => handleImageClick(image ? image.url : '')} // לחיצה על התמונה
            />
            <label className="menu-item-label">
              <span className="menu-item-name">{firstDish.dish_name}</span>
            </label>
            <input
              type="checkbox"
              value={firstDish.id}
              className="menu-checkbox"
              onChange={(e) => {
                const id = firstDish.id;
                setSelectedFirstDishes((prev) => {
                  if (e.target.checked) {
                    return [...prev, id];
                  } else {
                    return prev.filter((f) => f !== id);
                  }
                });
              }}
            />
          </div>
        );
      })}
    </ul>
  </td>
</tr>

{/* מנה עיקרית */}
<tr>
  <td className="menu-section-from">
    <h2 className="menu-section-title">מנה עיקרית [3 לבחירה]</h2>
    <ul className="menu-list">
      {inventoryAll.main_courses.filter(side => side.is_hidden).map((mainDish) => {
        const image = imagesByCategory.main_courses.find(img =>
          removeNonHebrew(img.display_name).includes(mainDish.dish_name)
        );
        return (
          <div key={mainDish.id} className="menu-item-img">
            <img
              src={image ? image.url : 'https://via.placeholder.com/150'} // תמונה ברירת מחדל
              alt={mainDish.dish_name}
              className="menu-item-thumbnail"
              onClick={() => handleImageClick(image ? image.url : '')} // לחיצה על התמונה
            />
            <label className="menu-item-label">
              <span className="menu-item-name">{mainDish.dish_name}</span>
            </label>
            <input
              type="checkbox"
              value={mainDish.id}
              className="menu-checkbox"
              onChange={(e) => {
                const id = mainDish.id;
                setSelectedMainDishes((prev) => {
                  if (e.target.checked) {
                    return [...prev, id];
                  } else {
                    return prev.filter((m) => m !== id);
                  }
                });
              }}
            />
          </div>
        );
      })}
    </ul>
  </td>
</tr>

{/* תוספות */}
<tr>
  <td className="menu-section-from">
    <h2 className="menu-section-title">תוספות [3 לבחירה]</h2>
    <ul className="menu-list">
      {inventoryAll.side_dishes.filter(side => side.is_hidden).map((side) => {
        const image = imagesByCategory.side_dishes.find(img =>
          removeNonHebrew(img.display_name).includes(side.dish_name)
        );
        return (
          <div key={side.id} className="menu-item-img">
            <img
              src={image ? image.url : 'https://via.placeholder.com/150'} // תמונה ברירת מחדל
              alt={side.dish_name}
              className="menu-item-thumbnail"
              onClick={() => handleImageClick(image ? image.url : '')} // לחיצה על התמונה
            />
            <label className="menu-item-label">
              <span className="menu-item-name">{side.dish_name}</span>
            </label>
            <input
              type="checkbox"
              value={side.id}
              className="menu-checkbox"
              onChange={(e) => {
                const id = side.id;
                setSelectedSides((prev) => {
                  if (e.target.checked) {
                    return [...prev, id];
                  } else {
                    return prev.filter((s) => s !== id);
                  }
                });
              }}
            />
          </div>
        );
      })}
    </ul>
  </td>
</tr>
          </tbody>
        </table>

        <div className="order-summary-container">
        <br />
        <button onClick={handleOrderSummaryClick} className="order-summary-button">
          סיכום הזמנה
        </button>
        <br />
        <br />
      </div>

      </div>
   
      <Dialog open={openImageDialog} onClose={closeDialog} maxWidth="md" fullWidth>
      <DialogTitle>תמונה מוגדלת</DialogTitle>
      <DialogContent>
        {/* התמונה שתופס את כל הרוחב */}
        <img src={selectedImage} alt="מנה גדולה" className="image-dialog-img" ObjectFit="cover"/>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} color="primary">
          סגור
        </Button>
      </DialogActions>
    </Dialog>


  </div>
     )}
      
    
    {/* -------------------חלון השארת פרטים--------------------------------------------------------- */}
    {loginUser && (
      <Modal open={true} onClose={closeEditModal}>
        <Box dir="rtl"  component="form"  sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
          bgcolor: 'background.paper', borderRadius: 2, padding: 3, width: '80%', maxWidth: 500, boxShadow: 24,
        }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            השאר פרטים כדי שנמשיך
          </Typography>

          <Grid container spacing={3} padding={2}>
            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                label="תאריך האירוע שלכם"
                type="date"
                fullWidth
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                error={Boolean(errors.eventDate)}
                helperText={errors.eventDate}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                label="שם מלא"
                type="text"
                fullWidth
                value={eventOwner}
                error={Boolean(errors.eventOwner)}
                helperText={errors.eventOwner}
                xs={{textAlign:'center'}}
                onChange={(e) => setEventOwner(e.target.value)}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                label="מספר פלאפון"
                type="tel"
                fullWidth
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                error={Boolean(errors.phoneNumber)}
                helperText={errors.phoneNumber}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                label="כתובת מייל"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={Boolean(errors.email)}
                helperText={errors.email}
                required
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
                label="בחר סיסמא לאזור אישי  " 
                type={showPassword ? 'text' : 'password'}fullWidth
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                error={Boolean(errors.Password)}  // הצגת שגיאה אם קיימת
                helperText={errors.Password}
                required
                InputProps={{
                    endAdornment: (
                        <InputAdornment position=" end">
                            <IconButton
                                onClick={handleClickShowPassword} >
                                {showPassword ? <VisibilityOff /> : <Visibility />}  {/* אם הסיסמה מוצגת, מציגים אייקון של עין סגורה, אחרת עין פתוחה */}
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
             />
             </Grid>

            <Grid size={{ xs: 12, sm: 6 }} >
              <TextField
                label="כמות המוזמנים"
                type="number"
                fullWidth
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                error={Boolean(errors.guestCount)}
                helperText={errors.guestCount}
                required
              />
            </Grid>

           <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel htmlFor="region-select">בחר אזור משלוח </InputLabel>
          <Select
            labelId="region-select"
            id="region-select"
            value={deliveryRegion}
            onChange={(e) => setDeliveryRegion(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="ירושלים והסביבה">אזור ירושלים והסביבה</MenuItem>
            <MenuItem value="תל אביב והמרכז">אזור תל אביב והמרכז</MenuItem>
            <MenuItem value="חיפה והצפון">אזור חיפה והצפון</MenuItem>
            <MenuItem value="באר שבע והדרום">אזור באר שבע והדרום</MenuItem>
            <MenuItem value="השפלה">אזור השפלה</MenuItem>
            <MenuItem value="יהודה ושומרון">אזור יהודה ושומרון</MenuItem>
            <MenuItem value="השרון">אזור השרון</MenuItem>
            <MenuItem value="הגליל">אזור הגליל</MenuItem>
            <MenuItem value="נגב">אזור הנגב</MenuItem>
            <MenuItem value="אולמי הפנינה">אולמי הפנינה</MenuItem>
          </Select>
        </Grid>


          <Grid size={{ xs: 12, sm: 6 }}>
          <InputLabel htmlFor="address-select"> כתובת מדויקת למשלוח </InputLabel>
          <TextField
            label="הכנס כתובת מדויקת"
           type="text"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={Boolean(errors.address)}
            helperText={errors.address}
            required
          />
         </Grid>


            <Grid size={{ xs: 12, sm:12 }} display="flex" justifyContent="center">
              <Button variant="contained" onClick={openQuantityModal} color="primary">
                המשך בהזמנה
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    )};





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
  <div className="kitchen-order-container"> <br />
  <div className='kitchen-order-header'>
    <br/><br/>
    
    <h1>{eventOwner} תודה שבחרת בקיינטרינג הפנינה</h1>
<h1>הצעת המחיר שלנו להזמנה שלך <br/> סה"כ :
  ₪  <strong style={{color:"#1F8A70"}}>{totalPrice}  </strong></h1>
<h3 style={{color: '#4F4F4F'}}>תאריך ביצוע ההזמנה שלך: <strong  style={{color:"#1F8A70"}}>{new Date(eventDate).toLocaleDateString('he-IL')}</strong></h3>
<h3 style={{color: '#4F4F4F'}}>מיקום ההזמנה שלך: <strong style={{color:"#1F8A70"}}>{address}</strong> </h3>
<h3 style={{color: '#4F4F4F'}}>דמי משלוח: ₪ <strong style={{color:"#1F8A70"}}>{totalDelivery}</strong></h3>
<br/>
<h2 style={{color: '#1F8A70'}}>פרטי ההזמנה שלך</h2>

    </div>
    {Object.keys(orderSummary).map((category) => ( 
      <div key={category} className="kitchen-order-category">   
        <h4 className="kitchen-order-category-title">
          {category === 'salads' ? 'סלטים' :
           category === 'first_courses' ? 'מנות ראשונות' :
           category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}
        </h4>
        <table className="kitchen-order-table" dir='rtl'>
          <thead>
            <tr>
              <th>שם המנה</th>    
            </tr>
          </thead>
          <tbody>
            {orderSummary[category].map((item, index) => (
              <tr key={`${item.dish_name}-${index}`}>
                <td>{item.dish_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>   
    ))}
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
     <h4>אני מאשר על אשר עברתי על פרטי ההזמנה בהצלחה וברצוני שתחזרו אלינו בהקדם </h4>
     <input type='checkbox' className="menu-checkbox"></input>
     </div><br />
    <button className="order-summary-button" onClick={addOrdersOnline}>שליחת ההזמנה</button>
    <br /><br />
  </div>
)}




    {/* -------------------הודעת ברכות להרשמה----------------------------------------------------- */}
    {sendingToManger && (
      <div className='modal-online-success'>
    <div className="modal-content-user-order-online-success">
      <button  className="close-button-user-order-online-success" onClick={() => { Navigate('/')}} >סגור</button>       
        <Confetti width={window.innerWidth} height={window.innerHeight} />
        <div>
          <br />
          <h1>ברכת מזל טוב   - {eventOwner}</h1>
        <h1 className="success-message">הזמנתך נשלחה  בהצלחה </h1>
        <h3> ניצור איתך קשר בהקדם להמשך התהליך</h3>
        <h3>לאחר אישור ההזמנה תקבלו תגובה במייל ותוכלו לראות את ההזמנות שלכם </h3>
        <h3> שלום ותודה קיינטרינג הפנינה </h3>
        <br />
      </div>
   </div>
  </div>
  )}



   </div>
 )}


export default OrdersOnline;
