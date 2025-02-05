import React, { useState, useEffect } from 'react';
import '../../assets/stylesManager/Calendar.css';
import NavbarAll from './NavbarAll';
import { useNavigate } from 'react-router-dom';

import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

import { HDate } from '@hebcal/core';

import 'moment/locale/he'; // אתחול עברית עבור moment

function EventCalendar() {
  const Navigate = useNavigate();
  const [orders, setOrders] = useState([]); // מצב לאחסון ההזמנות
  const [hebrewDateHeader, setHebrewDateHeader] = useState({ hebrewDateMonth: '', hebrewDateDay: '' }); // מצב לאחסון התאריך העברי
  const [currentTime, setCurrentTime] = useState('');

  const [note, setNote] = useState(''); // מצב חדש עבור ההערה
  const [currentDate, setCurrentDate] = useState(null);  // משתנה לתאריך שנבחר
  const [showNoteModal, setShowNoteModal] = useState(false); // משתנה למעקב אחרי אם המודל מוצג

  const [loading, setLoading] = useState(false); 
  const [showFullNote, setShowFullNote] = useState({});  

  useEffect(() => {
    fetchOrders();
    const today = new Date();
    updateHebrewDateHeader(today);
    updateCurrentTime(); // לעדכן פעם אחת בזמן הטעינה הראשונה
    const intervalId = setInterval(() => {
      updateCurrentTime(); // לעדכן כל שניה
    }, 1000);

    return () => clearInterval(intervalId); // לנקות את ה-intervall כשחוזרים ממרכיב אחר
  }, []);

  
  const fetchOrders = async () => { // פונקציה להורדת כל ההזמנות
    setLoading(true); 
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:3001/orders_calendar', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // הוספת הטוקן לכותרת 
        }
      });
      if (!response.ok) {
        throw new Error('שגיאה ברשת');
      }
      const ordersData = await response.json();

      const userPromises = ordersData.map(async (order) => { // להביא שם בעל האירוע 
        const userResponse = await fetch(`http://localhost:3001/user_calendar/${order.user_id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // הוספת הטוקן לכותרת 
          }
        });
        if (!userResponse.ok) {
          throw new Error('שגיאה בעת הבאת פרטי המשתמש');
        }
        const userData = await userResponse.json();
        return {
          ...order,
          user_name: userData.user_name, // הוספת שם המשתמש להזמנה
          notes: order.notes || '', // אם יש הערה, נוסיף אותה או מחרוזת ריקה
        };
      });
      // חיבור הנתונים
      const ordersWithUserNames = await Promise.all(userPromises);

      // כאן משנה את ה-ID לכל הזמנה על ידי שילוב של user_id ו-order.id
      const formattedOrders = ordersWithUserNames.map(order => {
        const israelDate = new Date(order.event_date);
        israelDate.setMinutes(israelDate.getMinutes() - israelDate.getTimezoneOffset()); 
        order.event_date = israelDate.toLocaleDateString('en-CA'); // שמירת התאריך בפורמט YYYY-MM-DD
        
        return {
          id: `${order.user_id}-${order.id}`, // שילוב user_id ו-order.id ל-ID ייחודי
          title: order.user_name,
          start: order.event_date,   
          order_menu: order.order_menu,
          notes: order.notes,
          event_location: order.event_location,
          address: order.address
        };
      });
      

    setOrders(formattedOrders); // עדכון המצב
    setNote(formattedOrders.notes)
   
    } catch (error) {
      console.error('שגיאה בעת הבאת ההזמנות:', error);
    }finally {
      setLoading(false); // סיום טעינה
    }
  };

  // פונקציה להורדת פרטי משתמש
  const fetchUser = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
     
    const [customerId, orderId] = userId.split('-'); 
      const response = await fetch(`http://localhost:3001/user_calendar/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('שגיאה ברשת');
      }

      const data = await response.json();

      if (data.orders_user && data.orders_user.length > 0) {
        const selectedOrder = data.orders_user.find(order => order.id === parseInt(orderId));
          if (selectedOrder) {
            Navigate('/KitchenOrder', {
              state: {
                orderSummary: [selectedOrder], // ההזמנה שנבחרה
                eventOwner: data.user_name,
                eventDate: selectedOrder.event_date,
                phoneNumber: data.phone_number,
                guestCount: selectedOrder.guest_count,
                totalPrice: selectedOrder.totalPrice,
                email: data.email,
                event_location: selectedOrder.event_location,
                address : selectedOrder.address
              }
            });
          } else {
            console.error('לא נמצאה הזמנה עם מספר זה');
          }
        } else {   // אם יש הזמנה אחת בלבד, פשוט העבר לדף עם הזמנה זו
          const order = data.orders_user[0];
          Navigate('/KitchenOrder', {
            state: {
              orderSummary: [order],
              eventOwner: data.user_name,
              eventDate: order.event_date,
              phoneNumber: data.phone_number,
              guestCount: order.guest_count,
              totalPrice: order.totalPrice,
              email: data.email,
              
            }
          });
        }
    } catch (error) {
      console.error('שגיאה בעת הבאת פרטי המשתמש:', error);
    }
  }
  
  // קריאה לפונקציה
  useEffect(() => {
    fetchUser(79);  // דוגמת קריאה עם user_id = 79
  }, []);
  

//-------------------------------------------------
  const openEditNoteModal = (date) => {
    const Date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const existingOrder = orders.find(order => order.start === Date);
    if (existingOrder) {
      // אם מצאנו הזמנה בתאריך זה, נעשה עדכון של ההערה
      setNote(existingOrder.notes || '');  // עדכון הערה אם קיימת, אחרת מחרוזת ריקה
    }
    setCurrentDate(date);  // שמירת התאריך הנבחר בסטייט
    setShowNoteModal(true);  // פתיחת המודל להוספת או עדכון הערה
  };
  
  

  ///----------------------------------------------------
  const saveNote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const currentDateFormatted = currentDate.toLocaleDateString('en-CA'); // התאריך בפורמט YYYY-MM-DD
      const updatedOrder = orders.find(order => order.start === currentDateFormatted);
    
      if (!updatedOrder) {
        alert('לא נמצא אירוע בתאריך זה');
        return;
      }
  
      const noteToSend = note.trim() === "" ? null : note;
  
      setNote(note); // עדכון הסטייט של ההערה החדשה
      const response = await fetch(`http://localhost:3001/save-note/${updatedOrder.id}/${noteToSend}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('שגיאה ברשת');
      }
      
      // עדכון רשימת ההזמנות אם הבקשה הצליחה
      setOrders((prevOrders) => {
        return prevOrders.map(order => {
          if (order.id === updatedOrder.id) {
            return { ...order, notes: noteToSend };
          }
          return order;
        });
      });
  
      setShowNoteModal(false); // סגירת המודל אחרי שמירת ההערה
    } catch (error) {
      console.error('שגיאה בעת שמירת ההערה:', error);
    }
  };
  
//----------------------------------------------------
// פונקציה לחישוב תאריך עברי
const getHebrewDate = (date) => {
  const hdate = new HDate(date); // יצירת תאריך עברי
  return hdate.renderGematriya(); // מחזיר תאריך עברי בפורמט עברי
};

//---------------------------------------------------------
  // תצוגת הזמנה
  const openEditModal = (info) => {
    const orderId = info.event._def.publicId; 
    fetchUser(orderId); 
    
    const existingNote = info.event.extendedProps.notes || ''; // קבלת ההערה אם קיימת
    setNote(existingNote);  // עדכון הערה במצב
  };
  
//----------------------------------------------------------
const updateHebrewDateHeader = (date) => {
  const hdate = new HDate(date);  // יצירת אובייקט תאריך עברי
  const hebrewMonth = hdate.renderGematriya('he');  // שם החודש העברי בעברית
  const hebrewDateFormatted = `${date.toLocaleDateString('he-IL')}`; // תאריך לועזי עם פורמט עברי
  setHebrewDateHeader({
    hebrewDateMonth: hebrewMonth,  // התאריך העברי
    hebrewDateDay: hebrewDateFormatted  // התאריך הלועזי
  });
};

//------------------------------------------------------
  const updateCurrentTime = () => {
    const now = new Date(); // יצירת אובייקט תאריך חדש עבור הזמן הנוכחי
    const hours = now.getHours().toString().padStart(2, '0');  // שעות
    const minutes = now.getMinutes().toString().padStart(2, '0');  // דקות
    const seconds = now.getSeconds().toString().padStart(2, '0');  // שניות
    const timeString = `${hours}:${minutes}:${seconds}`;  // יצירת המחרוזת של הזמן
    setCurrentTime(timeString);  // עדכון הסטייט של השעה הנוכחית
  };
  
//--------------------------------------------------------------
// נוסיף טיפול כאשר תצוגת החודש משתנה
const handleDateChange = (info) => {
  const viewType = info.view.type;  
  const currentStartDate = info.view.currentStart;  // התאריך הראשון בתצוגת החודש
  const today = new Date();
  const isCurrentMonth = currentStartDate.getMonth() === today.getMonth() && currentStartDate.getFullYear() === today.getFullYear();

  if (viewType === 'dayGridMonth') {
    if (isCurrentMonth) {
      // אם אנחנו בחודש הנוכחי, הצג את התאריך של היום
      updateHebrewDateHeader(today);
    } else {
      // אחרת, הצג את תחילת החודש הנוכחי
      updateHebrewDateHeader(currentStartDate);
    }
  } else {
    updateHebrewDateHeader(currentStartDate); // עדכון תאריך עבור תצוגת יום או שבוע
  }

  if (viewType === 'timeGridDay') {
    const currentDate = info.view.currentStart; // התאריך הנוכחי בתצוגת היום
    openEditNoteModal(currentDate); // פתיחת המודל להוספת הערה
  } else {
    setShowNoteModal(false); // סגירת המודל אם לא בתצוגת יום
  }
};
//---------------------------------------------------
const toggleFullNote = (eventId) => {
  setShowFullNote(prevState => ({
    ...prevState,
    [eventId]: !prevState[eventId]  // מתחלף בין להראות את כל ההערה או רק את החלק הקצר
  }));
};




  return (
    <div> 
      <NavbarAll />
      <br />
      <div className="event-calendar-container"> 
        {loading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      )}
      <div className="hebrew-date-header">
        {currentTime} {/* תציג את השעה הנוכחית */}
       </div>
       <div className="hebrew-date-month">
        {hebrewDateHeader.hebrewDateMonth} <br/>
       {hebrewDateHeader.hebrewDateDay} 
      </div>
      <br />
      <FullCalendar
  direction="rtl"
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
  headerToolbar={{
    left: 'prev,next',
    center: 'title',
    right: 'today,dayGridMonth,dayGridWeek,dayGridDay',
  }}
  buttonText={{
    today: 'היום',
    month: 'תצוגת חודש',
    week: 'שבוע',
    day: 'יום',
  }}
  events={orders} // הזמנות שהתקבלו מהשרת
  locale="he"     // הגדרת שפת הקלנדר לעברית
  eventClick={(info) => openEditModal(info)} // הצגת פרטי האירוע בלחיצה
  dateClick={(info) => openEditNoteModal(info.date)} // הצגת המודל להוספת או עדכון הערה
  dayCellDidMount={(info) => {
    const date = info.date;
    const hebrewDate = getHebrewDate(date).split(' ')[0]; // תאריך עברי ללא השנה
    const cellElement = info.el.querySelector('.fc-daygrid-day-top');
    if (cellElement) {
      const hebrewDateElement = document.createElement('span');
      hebrewDateElement.innerHTML = hebrewDate;
      hebrewDateElement.classList.add('hebrew-date'); // הוספת class חדש
      cellElement.appendChild(hebrewDateElement);
    }
  }}
  datesSet={(info) => handleDateChange(info)} // טיפול כשחודש משתנה
  eventContent={(eventInfo) => {
    const event = eventInfo.event;
    const notes = event.extendedProps.notes || ''; 
    const truncatedNotes = notes.slice(0, 8) + (notes.length > 5 ? '...' : '');
    return (
      <>
        <div>{event.title}</div>
            {notes && (
              <div className="event-note-container">
                <label className="event-label">הערות:</label>
                <div className="event-note">
                  {showFullNote[event.id] ? notes : truncatedNotes}
                </div>
                
              
              </div> 
             )}
      </>
    );
  }}
/>





<Dialog
  open={showNoteModal}
  onClose={() => setShowNoteModal(false)}
  BackdropProps={{
    style: {
      backgroundColor: 'rgba(0, 0, 0, 0.4)' // רקע חשוך עם שקיפות
    },
  }}
>
  <DialogTitle sx={{ color: 'white', fontWeight: 'bold', backgroundColor: '#1976d2' }}>
    הערות אירוע בתאריך: {currentDate ? currentDate.toLocaleDateString('he-IL') : 'תאריך לא זמין'}
  </DialogTitle>

  <DialogContent sx={{ 
    backgroundColor: '#1976d2', 
    color: 'white', 
    maxHeight: '70vh',  // הגבלת גובה התוכן
    overflowY: 'auto',  // אפשרות לגלול
    paddingBottom: 2 // הוספת מרווח בתחתית
  }}>
    <h2 style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>הוסף / ערוך הערות</h2>
    <TextField
      fullWidth
      multiline
      rows={6}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      placeholder="הקלד את ההערה כאן"
      sx={{ marginTop: 2, backgroundColor: '#fff', borderRadius: '4px' }}
      inputProps={{ style: { textAlign: 'right' } }} // עריכת טקסט מימין לשמאל
    />
  </DialogContent>

  <DialogActions sx={{ backgroundColor: '#1976d2' }}>
    <Button onClick={saveNote} variant="contained" sx={{ backgroundColor: '#388e3c' }}>
      שמור
    </Button>
  </DialogActions>
</Dialog>





      </div>
    </div>
  );
}

export default EventCalendar;
