import  { useState ,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../assets/stylesManager/KitchenOrder.css';
//------------PDF-------------------------------------
import html2pdf from 'html2pdf.js';
//-------------איקונים-------------------------------
import { BsWhatsapp } from "react-icons/bs";
import { MdLocalPrintshop } from "react-icons/md";
import { BiLogoGmail } from "react-icons/bi";
import { MdDownload } from "react-icons/md";
import { BsFiletypePdf } from "react-icons/bs";
import { TbArrowBadgeDown } from "react-icons/tb";
import { FaPhoneSquareAlt } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";


import { Snackbar, Alert } from '@mui/material';

import { CircularProgress } from '@mui/material';

const KitchenOrder = () => {
  const location = useLocation();
  const { orderSummary, eventDate, guestCount, totalPrice, eventOwner, phoneNumber , email , event_location , address,shippingCost,serviceCost,toolsType,eventType} = location.state || {};
  console.log(eventType);
  
  const name = "ארוגטי";
   const EventDate = new Date(eventDate).toLocaleDateString('he-IL');
 const [parsedOrderMenu,setParsedOrderMenu]= useState( orderSummary[0] && JSON.parse(orderSummary[0].order_menu));// משתנה התפריט

 const [ModalOpenOfWhatsApp, setModalOpenOfWhatsApp] = useState(false); // מודול שליחה וואצאפ
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // מודול עריכת מנה 
   const [dishToDelete, setDishToDelete] = useState(null);// מודול מחיקת מנה
  const [editAddDish,setEditAddDish] = useState(false);

  const [loading, setLoading] = useState(false);

const [kitchenMessage, setKitchenMessage] = useState('');//הערות במייל למטבח
const [pickupTime, setPickupTime] = useState('');// שעת איסוף בקובץ למטבח 

  const [newDish, setNewDish] = useState({ // מנה החדשה
    dish_name: "",
    price: "",
    weight: "",
    category: "",  
     selectedDish: '', 
  });
  const [allDishes, setAllDishes] = useState([]);  // כל המנות שיגיעו מהשרת
  // const [menuCategories, setMenuCategories] = useState([]);
  const [editDishData, setEditDishData] = useState({ //  מנה לעדכון
    dish_name: '',
    price: '',
    weight: '',
  });
  const token = localStorage.getItem('authToken');

  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [severity, setSeverity] = useState('success'); // ערך ברירת מחד


  //-----------סטייטים לשדות שאתה רוצה לשנות---------------------------------------------
// const [finalPriceUpdate, setFinalPriceUpdate] = useState(totalPrice || 0);
// const [shippingCostUpdate, setShippingCostUpdate] = useState(shippingCost || 0);
// const [serviceCostUpdate, setServiceCostUpdate] = useState(serviceCost || 0);
// const [toolsTypeUpdate, setToolsTypeUpdate] = useState(toolsType || '');





// מצבים למודול העריכה
const [editModalOpen, setEditModalOpen] = useState(false);
const [editField, setEditField] = useState('');
const [editValue, setEditValue] = useState('');


 // קריאה לשרת לקבלת התפריט הכללי
  useEffect(() => {
    const fetchAllDishes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventoryAll', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setAllDishes(data);
     
        
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };

    fetchAllDishes();
  }, []);


  if (!orderSummary) {
    return <div>לא נשלחו נתונים להצגה.</div>;
  }
 
//------------------עריכת עלות משלוח סכום סופי ועוד --------------------------------------------
 const handleEditSubmit = async () => {
  const user_id = orderSummary[0].user_id;
  console.log(user_id);
  
  if (!user_id) {
    alert('לא ניתן לעדכן ללא משתמש תקין');
    return;
  }

  const payload = { user_id };
  payload[editField] = editField === 'toolsType' ? editValue : Number(editValue);

  try {
  const response =  await axios.put( `http://localhost:3001/api/KitchenOrder/updateOrderDetails`, payload,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
       if (response.status === 200) {
         alert('העדכון בוצע בהצלחה!');
         setEditModalOpen(false);
       }
       
  } catch (error) {
    console.error('שגיאה בעדכון:', error);
    alert('אירעה שגיאה בעדכון');
  }
};


  // כותרות לפי השדה שנערך
  const titles = {
    shippingCost: 'עדכון עלות משלוח',
    serviceCost: 'עדכון עלות שירות',
    toolsType: 'עדכון סוג כלים',
    totalPrice: 'עדכון מחיר כולל',
  };

//--------------------------------------------------------------------------------
             /* הוספת מנה לתפריט*/
    const handleAddDish = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/KitchenOrder/addDish', {
        dish_name: newDish.dish_name,
        price: newDish.price,
        weight: newDish.weight,
        category: newDish.category,
        selectedDish: newDish.selectedDish,  // מנה שנבחרה
        user_id: orderSummary[0].user_id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert('המנה נוספה בהצלחה!');
        setNewDish({ dish_name: '', price: '', weight: '', category: '', selectedDish: '' });
        setParsedOrderMenu((prevMenuData) => ({
          ...prevMenuData,
          [newDish.category]: [
            ...(prevMenuData[newDish.category]),
            {
              dish_name: newDish.dish_name,
              totalPrice: newDish.price,
              totalWeight: newDish.weight,
            },
          ],
        }));
      }
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };
         /*     מחיקת מנה קיימת'     */
   const handleDeleteDish = async () => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/KitchenOrder/deleteDish`, {
        data: {
          dish_name: dishToDelete, 
          user_id: orderSummary[0].user_id
        } ,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert('המנה נמחקה בהצלחה!');
        setDishToDelete(null);

        setParsedOrderMenu((prevMenuData) => { // מחיקה מהסטייט
          const updatedMenu = { ...prevMenuData };
          for (let category in updatedMenu) {  // עובר על כל הקטגוריות ומסנן את המנה
            updatedMenu[category] = updatedMenu[category].filter(dish => dish.dish_name !== dishToDelete);
          }
          return updatedMenu;
        });
      }
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };
         /*     עדכון מנה קיימת    */
    const handleUpdateDish = async () => {
     try {
       const { dish_name, price, weight } = editDishData;
   
       const response = await axios.put("http://localhost:3001/api/KitchenOrder/updateDish", {
         dish_name: dish_name,
         price: price,
         weight: weight,
         user_id: orderSummary[0].user_id
       }, {
         headers: {
           Authorization: `Bearer ${token}`,
       }
       });
   
       if (response.status === 200) {
         alert('המנה עודכנה בהצלחה!');
         setIsEditModalOpen(false);
   
         // עדכון הסטייט של התפריט לאחר העריכה
         setParsedOrderMenu((prevMenuData) => {
           const updatedMenu = { ...prevMenuData };
   
           // עוברים על כל הקטגוריות ומעדכנים את המנה
           for (let category in updatedMenu) {
             const dishIndex = updatedMenu[category].findIndex(dish => dish.dish_name === dish_name);
             if (dishIndex !== -1) {
               // עדכון המחיר והמשקל של המנה
               updatedMenu[category][dishIndex].totalPrice = price;
               updatedMenu[category][dishIndex].totalWeight = weight;
               break;
             }
           }
   
           return updatedMenu;
         });
       }
     } catch (error) {
       console.error('Error updating dish:', error);
     }
   };
  
   /*   פתיחת מודול עריכת מנה   */
const handleShowEditModal = (dish_name, price, weight) => {
  setEditDishData({ dish_name, price, weight });
  setIsEditModalOpen(true);
};
   /* פתיחת מודול מחיקה   */
const handleShowDeleteConfirmation = (id) => {
  setDishToDelete(id);
};


  // פונקציה ליצירת PDF עבור המטבח
  const handleCreatePDF = (isForKitchen = false) => {
    const options = {
      margin: 10,
      filename: `${name}_Order_${isForKitchen ? 'Kitchen' : 'Full'}.pdf`,
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

const currentDate = new Date().toLocaleDateString('he-IL');
   let content = `
  <div style="position: relative; height: 80px; margin-bottom: 20px;">
    <div style="position: absolute; top: 10px; left: 20px; font-size: 14px;">${currentDate}</div>
    

    <img src="data:image/jpeg;base64,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"
   
     style="position: absolute; top: 0; right: 0; width: 250px; height: 200px;" />

  </div>

  <h2 style="text-align: center; font-weight: bold;">ארוגטי <br/> הזמנה למטבח</h2>
  <div style="font-size: 20px; text-align: center;">תאריך האירוע: ${EventDate}</div>
  ${pickupTime ? `<div style="font-size: 18px; text-align: center; margin-top: 8px;"><strong>שעת איסוף:</strong> ${pickupTime}</div>` : ''}
`;


          // עבור כל קטגוריית מנות, הצגת המנות המתאימות
    const renderMenu = (category) => {
      let categoryContent = `
        <h4 style="text-align: center;">${category === 'salads' ? 'סלטים' :
          category === 'first_courses' ? 'מנות ראשונות' :
          category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}</h4>
        <table dir="rtl" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 8px; text-align: center;">שם המנה</th>
              ${isForKitchen ? '' : '<th style="border: 1px solid black; padding: 8px; text-align: center;">מחיר המנה</th>'}
              <th style="border: 1px solid black; padding: 8px; text-align: center;">משקל כולל</th>
            </tr>
          </thead>
          <tbody>
      `;
      parsedOrderMenu[category].forEach(item => {
        categoryContent += `
          <tr>
            <td style="border: 1px solid black; padding: 8px; text-align: center;">${item.dish_name}</td>
            ${isForKitchen ? '' : `<td style="border: 1px solid black; padding: 8px; text-align: center;">${item.totalPrice}</td>`}
            <td style="border: 1px solid black; padding: 8px; text-align: center;">
              ${item.totalWeight > 1000 ? `${(item.totalWeight / 1000).toFixed(2)} קילו` : `${parseInt(item.totalWeight)} יחידות`}
            </td>
          </tr>
        `;
      });
      categoryContent += '</tbody></table><br />';
      return categoryContent;
    };
      // דאג להוסיף את כל המנות (לפי קטגוריות)
    if (parsedOrderMenu) {
      Object.keys(parsedOrderMenu).forEach(category => {
        content += renderMenu(category);
      });
    }
     // המרת התוכן ל-PDF
    html2pdf().from(content).set(options).save();
  };


// שליחה במייל
  const generateCustomerOrderHTML = () => { 
    const orderDetails = `
<html>
  <head>
    <style>
     body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 0;
  color: #333;
  display: flex;
  justify-content: center; /* למרכז את כל התוכן בעמוד */
  align-items: center; /* למרכז את התוכן מבחינת גובה */
  height: 100vh; /* חשוב כדי שימשוך את כל הגובה */
}

      .container {
        max-width: 100%;
        margin: 30px auto;
        padding: 20px;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        position: relative;
      }

      .header {
        background-color: #4CAF50;
        color: white;
        text-align: center;
        padding: 20px;
        border-radius: 8px 8px 0 0;
        position: relative;
      }

      .header img {
        position: absolute;
        top: 20px;
        right: 20px;
        height: 60px; /* גודל הלוגו */
        cursor: pointer;
      }

      .header h1 {
        margin: 0;
        font-size: 32px;
      }


      .order-info {
        display: flex;
        flex-wrap: wrap; /* תומך בשורות נפרדות */
        justify-content: center; /* למרכז את כל התוכן */
        font-size: 18px;
        line-height: 1.6;
      }
      
      .order-info .row {
        width: 48%; /* שורות עם רווח קטן ביניהם */
        text-align: center;
        margin: 10px 0;
      }
      .table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 30px;
      }

      .table th,
      .table td {
        padding: 12px;
        text-align: right;
        border: 1px solid #ddd;
      }

      .table th {
        background-color: #f2f2f2;
        text-align: center;
        font-size: 20px;
        color: #333;
        border-bottom: 2px solid #4CAF50;
      }

      .table td {
        font-size: 16px;
      }

      .section-title {
        font-size: 24px;
        text-align: center;
        margin-top: 40px;
        color: #333;
      }

      .footer {
        margin-top: 40px;
        font-size: 14px;
        text-align: center;
        color: #888;
      }

      .footer a {
        
        text-decoration: none;
        color: #4CAF50; 
        
      }
         .footer a:hover {
            text-decoration: underline;
            }

      .footer .phone {
        margin-top: 10px;
        font-size: 16px;
      }

      .button-link {
        display: inline-block;
         background-color: black;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 4px;
        margin-top: 20px;
        font-size: 16px;
        border: 1px solid #4CAF50;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>הזמנתך מקייטרינג הפנינה</h1>
      </div>
</div>
  
    <div class="order-info">
   <div class="row">
        <p><strong>סה"כ מחיר:</strong> ₪ ${totalPrice || 'לא זמין'}</p>
      </div>
  <div class="row">
        <p><strong>מספר אורחים:</strong> ${guestCount}</p>
      </div>
      <div class="row">
        <p><strong>תאריך האירוע:</strong> ${EventDate}</p>
      </div>
      <div class="row">
        <p><strong>שם בעל האירוע:</strong> ${eventOwner || 'לא זמין'}</p>
      </div>
    </div>

      <div class="section-title">
        <h3>סיכום פרטי ההזמנה שלך</h3>
      </div>

      ${Object.keys(parsedOrderMenu).map((category) => {
        return `
        <h4 style="font-size: 22px; text-align: center;">${category === 'salads' ? 'סלטים' :
          category === 'first_courses' ? 'מנות ראשונות' :
          category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}</h4>
        <table class="table">
          <thead>
            <tr>
              <th>שם המנה</th>
            </tr>
          </thead>
          <tbody>
            ${parsedOrderMenu[category].map((item) => {
              return `
                <tr>
                  <td>${item.dish_name}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        `;
      }).join('')}

      <div class="footer">
        <p>!!! תודה שבחרתם בקייטרינג הפנינה</p>
      <p>
  <a href="mailto:ely6600200@gmail.com">ely6600200@gmail.com</a> לשאלות או בירורים, אנא פנה אלינו במייל
</p>

        <p class="phone">לפרטים נוספים, חייגו: <strong>054-6600-200</strong></p>
        <a href="http://localhost:3001/api/PersonalAreaLogin" class="button-link">
          לכניסה לאזור האישי שלכם לחצו כאן
        </a>
      </div>
    </div>
  </body>
</html>

    `;

    return orderDetails;
  };

  //------שליחת מייל למטבח עם הקובץ ---------------------------------
  const handleSendOrderToKitchenEmail = async () => {
    setLoading(true)
    const options = {
      margin: 10,
      filename: `${name}_Order_Kitchen.pdf`,
      html2canvas: { scale: 4 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };
  
const currentDate = new Date().toLocaleDateString('he-IL');

let content = `
  <div style="position: relative; height: 80px; margin-bottom: 20px;">
    <div style="position: absolute; top: 10px; left: 20px; font-size: 14px;">${currentDate}</div>
    
    <!-- הלוגו ממורכז למעלה -->
    <img src="https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" 
         style="position: absolute; top: 10px; right: 50%; transform: translateX(50%); height: 60px;" />
  </div>

  <h2 style="text-align: center; font-weight: bold;">ארוגטי <br/> הזמנה למטבח</h2>
  <div style="font-size: 20px; text-align: center;">תאריך האירוע: ${EventDate}</div>
  ${pickupTime ? `<div style="font-size: 18px; text-align: center; margin-top: 8px;"><strong>שעת איסוף:</strong> ${pickupTime}</div>` : ''}
`;





  
    // Render Menu content dynamically
    const renderMenu = (category) => {
      let categoryContent = `
        <h4 style="text-align: center;">${category === 'salads' ? 'סלטים' :
          category === 'first_courses' ? 'מנות ראשונות' :
          category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}</h4>
        <table dir="rtl" style="width: 100%; border: 1px solid black; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid black; padding: 8px; text-align: center;">שם המנה</th>
              <th style="border: 1px solid black; padding: 8px; text-align: center;">משקל כולל</th>
            </tr>
          </thead>
          <tbody>
      `;
  
      parsedOrderMenu[category].forEach(item => {
        categoryContent += `
          <tr>
            <td style="border: 1px solid black; padding: 8px; text-align: center;">${item.dish_name}</td>
            <td style="border: 1px solid black; padding: 8px; text-align: center;">
              ${item.totalWeight > 1000 ? `${(item.totalWeight / 1000).toFixed(2)} קילו` : `${parseInt(item.totalWeight)} יחידות`}
            </td>
          </tr>
        `;
      });
      
      categoryContent += '</tbody></table><br />';
      return categoryContent;
    };
  
   
    if (parsedOrderMenu) {
      Object.keys(parsedOrderMenu).forEach(category => {
        content += renderMenu(category);
      });
    }
  

    const pdfBlob = await new Promise((resolve, reject) => {
      html2pdf()
        .from(content)
        .set(options)
        .toPdf()
        .get('pdf')
        .then((pdf) => {
          const blob = pdf.output('blob');
          resolve(blob);
        })
        .catch((error) => {
          reject(error);
        });
    });
    const formData = new FormData();
    formData.append('file', pdfBlob, `${name}_Order_Kitchen.pdf`);
    formData.append('recipient', 'elyasaf852@gmail.com'); 
    formData.append('message', kitchenMessage); // מלל בטקסט 
  
    try {

      const response = await axios.post('http://localhost:3001/api/sendOrderToKitchen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
         setLoading(false)
        setSnackbarMessage('ההזמנה נשלחה בהצלחה למטבח !!');
        setSeverity('success');
       
      } else {
        setSnackbarMessage('שגיאה בשליחת ההזמנה למטבח');
        setSeverity('error');
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending order to kitchen email:', error);
      setSnackbarMessage('שגיאה בשליחת ההזמנה למטבח');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  

// ------------שליחת מייל ללקוח -----------------------------------------------------------
  const handleSendOrderToCustomerEmail = async () => {
    const orderHTML = generateCustomerOrderHTML();  // יצירת ה-HTML של ההזמנה
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3001/api/sendOrderToCustomer', {
        customerEmail: email,
        orderHTML: orderHTML,
      });
        console.log(response.data);
        
      if (response.status === 200) {
         setLoading(false)
        setSnackbarMessage('ההזמנה נשלחה בהצלחה למייל של הלקוח  !!');
        setSeverity('success'); 
      } else {
        setSnackbarMessage('שגיאה בשליחת ההזמנה למייל של הלקוח');
        setSeverity('error');
      }
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error sending order to customer email:', error);
      setSnackbarMessage('שגיאה בשליחת ההזמנה למייל של הלקוח');
      setSeverity('error');
      setOpenSnackbar(true);
    }
  };
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


// -----------------------------------------------------------------------
// שליחה בווטסאפ
  const handleShareWhatsApp = () => {
    setModalOpenOfWhatsApp(true);
  };
 const phoneNumbers = [
    '9720546600200 אבא', // דוגמה, הכנס מספרים אמיתיים
    '972553069666 מטבח', 
    '972523456789 נריה',
  ];
  const handlePhoneSelection = (phoneNumber) => { 
    handleCreatePDF(true); // יצירת PDF לפני שליחה
    const message = `הזמנה עבור ${name}\nתאריך האירוע: ${EventDate}\nמספר אורחים: ${guestCount}\n\nפרטי ההזמנה (הקובץ מצורף)`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    setModalOpenOfWhatsApp(false);  // סגור את המודאל אחרי שליחה
  };
  
  //-------------------------------------------------------------------------
  const handleCreatePrint = () => {
    window.print();
  }


  const loadingStyle = {
    position: 'fixed', 
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    fontSize: '18px',  
    zIndex: 9999, 
    backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    width: '100vw',
    height: '100vh', 
  };

//------------פתיחת מודול עריכת לקוח -------------------------------------------------------------------
  const openEditModal = (field) => {
    setEditField(field);
    setEditValue(''); // מתחיל עם שדה ריק
    setEditModalOpen(true);
  };






  return (
    <div className="kitchen-order-container" dir="rtl"> 

   <div className="edit-manager-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
      <button className='button-add-dish' onClick={ () => setEditAddDish(!editAddDish)}>הוספת מנה חדשה </button>  
      <button onClick={() => openEditModal('totalPrice')}>  סה"כ מחיר 💰</button>
      <button onClick={() => openEditModal('shippingCost')}> עלות משלוח 🚚</button>
      <button onClick={() => openEditModal('serviceCost')}> עלות שירות 🛠</button>
      <button onClick={() => openEditModal('toolsType')}> סוג כלים 🍽️</button>
    
</div>

      <div className="kitchen-order-info">
        <div className='kitchen-order-header'>
        <h1>אולמי הפנינה</h1>
        <p>שם המזמין: {eventOwner || 'לא זמין'}</p>
        <p>תאריך האירוע: {EventDate}</p>
        <p> סוג הזמנה: {eventType}</p>
        <p>מייל לקוח: {email}</p>
        <p>אזור ההזמנה: {event_location}</p>
        <p>מיקום ביצוע ההזמנה: {address}</p>
        <p>מספר אורחים: <MdPeopleAlt/> {guestCount}</p>
        <p>מספר פלאפון: <FaPhoneSquareAlt/> {phoneNumber}</p>
        <p>סה"כ מחיר: 💰 ₪ {totalPrice > 0 ? totalPrice : 'לא זמין'}</p>  
        <p>עלות משלוח: 🚚 ₪ {shippingCost > 0 ? shippingCost : 'ללא '}</p>
        <p>עלות שירות: 🛠 ₪ {serviceCost  > 0 ? serviceCost :'ללא '}</p>
        <p>סוג כלים: 🍽️ {toolsType && toolsType.trim() !== '' ? toolsType : 'ללא'}</p>

        </div>

    {/* הוספת מנה מודול*/}
 {editAddDish && (
<div className="add-dish">
<h3>הוסף מנה חדשה</h3>  
  <select
      onChange={(e) => setNewDish({ ...newDish, category: e.target.value })}
        value={newDish.category}
      >
        <option value="">בחר קטגוריה</option>
        <option value="salads">סלטים</option>
        <option value="first_courses">מנות ראשונות</option>
        <option value="main_courses">מנות עיקריות</option>
        <option value="side_dishes">תוספות</option>
      </select>
  {/* הצגת המנות לפי הקטגוריה */}
  <select
      onChange={(e) => {
        const selectedDish = e.target.value;
        setNewDish({ ...newDish, selectedDish, dish_name: selectedDish }); // עדכון שם המנה הנבחרת
      }}
      value={newDish.selectedDish}
    >
     <option value="">בחר מנה מהתפריט הכללי</option>
      {newDish.category &&
        allDishes[newDish.category] &&
        allDishes[newDish.category].map((dish) => (
          <option key={dish.dish_name} value={dish.dish_name}>
            {dish.dish_name}
          </option>
        ))}
    </select>

      <input
        type="number"
        placeholder="מחיר המנה"
        value={newDish.price}
        onChange={(e) => setNewDish({ ...newDish, price: e.target.value })}
      />
      <input
        type="number"
        placeholder="משקל המנה"
        value={newDish.weight}
        onChange={(e) => setNewDish({ ...newDish, weight: e.target.value })}
      />
    

 <p>תזכורת: מנהל המוסיף מנה לתפריט המנה לא תעבור חישוב לפי מספר המוזמנים</p>
 <p>עלייך לוודא את החישוב כרצונך עבור המנה </p>
  <button onClick={handleAddDish} className="add-button">הוסף מנה</button>
</div>
)}
 

<br />
   {parsedOrderMenu && Object.keys(parsedOrderMenu).map((category) => (
          <div key={category} className="kitchen-order-category">
            <h4 className="kitchen-order-category-title">
              {category === 'salads' ? 'סלטים' :
               category === 'first_courses' ? 'מנות ראשונות' :
               category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}
            </h4>
            <table className="kitchen-order-table">
              <thead>
                <tr>
                  <th>שם המנה</th>
                  <th>מחיר המנה </th>
                  <th>משקל כולל</th>
                  <th  >עריכה</th>
                  <th >מחיקה</th>
                </tr>
              </thead>
              <tbody>
                {parsedOrderMenu[category].map((item, index) => (
                  <tr key={`${item.dish_name}-${index}`}>
                    <td>{item.dish_name}</td>
                    <td>{item.totalPrice}</td>
                    <td>{item.totalWeight > 1000 ? `${(item.totalWeight / 1000).toFixed(2)} קילו` : `${parseInt(item.totalWeight)} מנות`}</td>
                    <td>
                    <button className='kitchen-order-edit-button' onClick={() => handleShowEditModal(item.dish_name, item.totalPrice, item.totalWeight)}>ערוך</button>
                    </td>
                    <td>
                    <button className='kitchen-order-delete-button' onClick={() => handleShowDeleteConfirmation(item.dish_name)}>מחק</button>
                    </td>
                
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
   ))}
  </div>

      <label className='kitchen-order-label-button'><TbArrowBadgeDown/> מנהל <TbArrowBadgeDown/></label>
      <br />
      <div className="kitchen-order-actions"> 
        <button className="kitchen-order-action-button" onClick={() => handleCreatePDF(false)}  title="הורד סיכום הזמנה למחשב "><MdDownload />הורד</button>
        <button className="kitchen-order-action-button" onClick={() => handleCreatePrint()} title="הדפס סיכום הזמנה"><MdLocalPrintshop />הדפס</button>
        <hr />
        </div>
        <label className='kitchen-order-label-button'><TbArrowBadgeDown/> מטבח <TbArrowBadgeDown/></label>
        <br />
        <div className="kitchen-order-actions">
        <button className="kitchen-order-action-button" onClick={() => handleSendOrderToKitchenEmail()} title='שליחה למטבח'><BiLogoGmail />  מייל למטבח</button>
        <textarea className="kitchen-order-action-button"
              placeholder="הזן הערה למשלוח למטבח"
              value={kitchenMessage}
              onChange={(e) => setKitchenMessage(e.target.value)}
              rows={4}
              style={{ width: '100px', marginBottom: '2px', padding: '2px', fontSize: '16px' ,height:'50px'}}
            />
            <input
                  type="time"
                  className="kitchen-order-action-button"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  style={{ width: '140px', marginBottom: '8px', padding: '6px', fontSize: '16px' }}
                  placeholder="שעת איסוף"
                 />


        <button className="kitchen-order-action-button" onClick={() => handleShareWhatsApp()}title='שליחה בוואצאפ למטבח'><BsWhatsapp /> שלח וואצאפ</button>
        <button className="kitchen-order-action-button" onClick={() => handleCreatePDF(true)} title='הורד סיכום למטבח'><BsFiletypePdf /> הורד סיכום מטבח</button>
        </div>
        <br/>
         <label className='kitchen-order-label-button'><TbArrowBadgeDown/> ללקוח <TbArrowBadgeDown/></label>
           <br />
        <div className="kitchen-order-actions">
         <button className="kitchen-order-action-button" onClick={() => handleSendOrderToCustomerEmail()} title='שליחה לבעל ההזמנה '><BiLogoGmail />   שליחת הזמנה ללקוח</button>
        </div>


        {loading && (
        <div style={loadingStyle}>
          <CircularProgress />
          <p>טוען...</p>
        </div>
      )}


 {/* מודל עריכה */}
 {isEditModalOpen && (
        <div className="whatsapp-modal-container">
          <div className="modal-edit-kitchen-orders">
            <h3>ערוך את המנה</h3>
            <label className='whatsapp-modal-list'>שם המנה: {editDishData.dish_name}</label><br /><br />
            <label className='whatsapp-modal-list'>עדכון מחיר הכולל</label>
            <input className='kitchen-order-edit-form-input'
              type="number"
              placeholder="עדכון מחיר"
              value={editDishData.price}
              onChange={(e) => setEditDishData({ ...editDishData, price: e.target.value })}
            /> 
            <label className='whatsapp-modal-list'>עדכון משקל :<br/>  אם מדובר בגרמים כתוב כך : <br/> לדוגמה 7 קילו כתוב 70000</label>
            <input className='kitchen-order-edit-form-input'
              type="number"
              placeholder="עדכון משקל"
              value={editDishData.weight}
              onChange={(e) => setEditDishData({ ...editDishData, weight: e.target.value })}
            />
            <div className='modal-edit-kitchen-orders-close'>
            <button onClick={handleUpdateDish}>עדכן</button>
            <button onClick={() => setIsEditModalOpen(false)}>סגור</button>
            </div>
          </div>
        </div>
      )}

 {/* מודל אישור מחיקה */}
 {dishToDelete && (
        <div className="whatsapp-modal-container">
          <div className="modal-edit-kitchen-orders">
            <h3>האם אתה בטוח שברצונך למחוק את המנה?</h3>
            <div className='modal-edit-kitchen-orders-close'>
            <button onClick={handleDeleteDish}>אישור</button>
            <button  onClick={() => setDishToDelete(null)}>סגירה</button>
            </div>
          </div>
        </div>
      )}

{/* מודול וואצאפ */}
{ModalOpenOfWhatsApp && (
  <div className="whatsapp-modal-container">
    <div className="whatsapp-modal">
      <h3 className="whatsapp-modal-title">בחר את מספר הטלפון לשליחה בוואצאפ</h3>
      <ul className="whatsapp-modal-list">
        {phoneNumbers.map((number, index) => (
          <li key={index} className="whatsapp-modal-item">
            <button onClick={() => handlePhoneSelection(number)}className="whatsapp-modal-button"  > 
              {number}
            </button>
          </li>
        ))}
      </ul>
      <button 
        onClick={() => setModalOpenOfWhatsApp(false)}  className="whatsapp-modal-close-button" >  סגור</button>
    </div>
  </div>
  )}

{/* מודול עריכת פרטי לקוח  */}
{editModalOpen && (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '20px 30px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      width: '300px',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      fontFamily: 'Arial, sans-serif',
    }}
  >
    <h3 style={{ margin: 0, fontSize: '1.2rem', textAlign: 'center' }}>
      {titles[editField]}
    </h3>
    <input
      type={editField === 'toolsType' ? 'text' : 'number'}
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
      placeholder="הכנס ערך חדש"
      style={{
        padding: '8px 10px',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        outline: 'none',
        transition: 'border-color 0.2s ease-in-out',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#007bff')}
      onBlur={(e) => (e.target.style.borderColor = '#ccc')}
    />
    <button
      onClick={handleEditSubmit}
      style={{
        padding: '8px 12px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
    >
      אישור
    </button>
    <button
      onClick={() => setEditModalOpen(false)}
      style={{
        padding: '8px 12px',
        fontSize: '1rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#ccc',
        color: '#333',
      }}
      onMouseOver={(e) => (e.target.style.backgroundColor = '#aaa')}
      onMouseOut={(e) => (e.target.style.backgroundColor = '#ccc')}
    >
      בטל
    </button>
  </div>
)}




   <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={severity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

</div>
  );
};

export default KitchenOrder;
