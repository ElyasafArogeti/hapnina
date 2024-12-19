import React, { useState, useEffect } from 'react';
import '../../assets/stylesManager/Calendar.css';
import NavbarAll from './NavbarAll';
import { useNavigate } from 'react-router-dom';

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

      const formattedOrders = ordersWithUserNames.map(order => {

        const israelDate = new Date(order.event_date);
        israelDate.setMinutes(israelDate.getMinutes() - israelDate.getTimezoneOffset()); // התאמת זמן ישראל
        order.event_date = israelDate.toLocaleDateString('en-CA'); // שמירת התאריך בפורמט YYYY-MM-DD
        return {
          id: order.user_id,
          title: order.user_name,
          start: order.event_date,   // תאריך מותאם לזמן ישראל
          order_menu: order.order_menu,
          notes: order.notes,
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
      const user = userId
      const response = await fetch(`http://localhost:3001/user_calendar/${user}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // הוספת הטוקן לכותרת 
        }
      });

      if (!response.ok) {
        throw new Error('שגיאה ברשת');
      }
      const data = await response.json(); 
      
      if (data.orders_user && data.orders_user.length > 0) {
        Navigate('/KitchenOrder', {
          state: {
            orderSummary: data.orders_user,
            eventOwner: data.user_name,
            eventDate: data.orders_user[0].event_date,
            phoneNumber: data.phone_number,
            guestCount: data.orders_user[0].guest_count,
            totalPrice: data.totalPrice,
            email: data.email
          }
        });
      } else {
        console.error('אין נתונים מתאימים במערך orders_user');
     }    
    } catch (error) {
      console.error('שגיאה בעת הבאת פרטי המשתמש:', error);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, 
  []);


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
  
  
  
  const saveNote = async () => {
    try {
      const token = localStorage.getItem("authToken");
      // קביעת התאריך הנוכחי במבנה מתאים
      const currentDateFormatted = currentDate.toLocaleDateString('en-CA'); // התאריך בפורמט YYYY-MM-DD
      const updatedOrder = orders.find(order => order.start === currentDateFormatted);
  
      if (!updatedOrder) {
        // אם לא נמצאה הזמנה עבור התאריך
        alert('לא נמצא אירוע בתאריך זה');
        return;
      }
  
      // אם ההערה ריקה, נשלח null כדי למחוק את ההערה
      const noteToSend = note.trim() === "" ? null : note; // אם ההערה ריקה, נשלח null
  
      // עדכון ההערה
      setNote(note); // עדכון הסטייט של ההערה החדשה
  
      // שמירת ההערה (או מחיקת ההערה אם היא ריקה)
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
            // עדכון ההזמנה עם ההערה החדשה או עם null אם ההערה נמחקה
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
  




// פונקציה לחישוב תאריך עברי
const getHebrewDate = (date) => {
  const hdate = new HDate(date); // יצירת תאריך עברי
  return hdate.renderGematriya(); // מחזיר תאריך עברי בפורמט עברי
};

  // תצוגת הזמנה
  const openEditModal = (info) => {
    const orderId = info.event._def.publicId; // העברת המזהה לקוח
    fetchUser(orderId); 
  
    const existingNote = info.event.extendedProps.notes || ''; // קבלת ההערה אם קיימת, אחרת מחרוזת ריקה
    setNote(existingNote);  // עדכון הערה במצב
  };

 const updateHebrewDateHeader = (date) => {
    const hdate = new HDate(date);
    const hebrewMonth = hdate.renderGematriya('he');  // שם החודש העברי בעברית
    const hebrewDateFormatted = `${date.toLocaleDateString('he-IL')}`;
    setHebrewDateHeader({
      hebrewDateMonth: hebrewMonth,  // התאריך העברי
      hebrewDateDay: hebrewDateFormatted  // התאריך הלועזי
    });
};



  const updateCurrentTime = () => {
    const now = new Date(); // יצירת אובייקט תאריך חדש עבור הזמן הנוכחי
    const hours = now.getHours().toString().padStart(2, '0');  // שעות
    const minutes = now.getMinutes().toString().padStart(2, '0');  // דקות
    const seconds = now.getSeconds().toString().padStart(2, '0');  // שניות
    const timeString = `${hours}:${minutes}:${seconds}`;  // יצירת המחרוזת של הזמן
    setCurrentTime(timeString);  // עדכון הסטייט של השעה הנוכחית
  };
  

// נוסיף טיפול כאשר תצוגת החודש משתנה
const handleDateChange = (info) => {
  const viewType = info.view.type;  
  if (viewType === 'dayGridMonth') {

    const today = new Date();  // תאריך נוכחי
    updateHebrewDateHeader(today);  // עדכון הכותרת עם התאריך הנוכחי
  } else {
    updateHebrewDateHeader(info.view.currentStart); // עדכון התאריך בעבור תצוגת יום או שבוע
  }
  if (viewType === 'timeGridDay') {
    const currentDate = info.view.currentStart; // התאריך הנוכחי בתצוגת היום
    openEditNoteModal(currentDate); // פתיחת המודל להוספת הערה
  } else {
    setShowNoteModal(false); // סגירת המודל אם לא בתצוגת יום
  }
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

          eventClick={(info) => {
            openEditModal(info); // הצגת פרטי האירוע בלחיצה
          }}

          eventClassNames={(info) => {
            return info.event.extendedProps.status === 'busy' ? 'busy-event' : '';
          }}

          dateClick={(info) => { 
            setCurrentDate(info.date);  // שמירת התאריך שנבחר בסטייט של currentDate
            openEditNoteModal(info.date);  // הצגת המודל להוספת או עדכון הערה
          }}
          
            
          dayCellDidMount={(info) => {
            const date = info.date; // תאריך לועזי
            const hebrewDate = getHebrewDate(date).split(' ')[0]; // תאריך עברי ללא השנה
            const cellElement = info.el.querySelector('.fc-daygrid-day-top');
            if (cellElement) {
                const hebrewDateElement = document.createElement('span');
                hebrewDateElement.innerHTML = hebrewDate;
                hebrewDateElement.classList.add('hebrew-date'); // הוספת class חדש
                cellElement.appendChild(hebrewDateElement);
              }
          }}
          
           datesSet={(info) => {
            handleDateChange(info);
          }}

          eventContent={(eventInfo) => {
            const event = eventInfo.event;
            const notes = event.extendedProps.notes || ''; // אם יש הערה, הצג אותה
            const truncatedNotes = notes.length > 30 ? notes.slice(0, 17) + '...' : notes; // חיתוך הערות אם הן ארוכות מדי      
            return (
              <>
                <div>{event.title}</div>
                {truncatedNotes && <div className='event-note-container'>
                  <label className='event-label'>הערות:</label>
                  <div className="event-note">{truncatedNotes}</div>
                </div>}
              </>
            );
          }}
          
        
        />

        {showNoteModal && (
          <div className="note-modal">
          <h1 style={{ color: 'white', fontWeight: 'bold'}}>הערות אירוע בתאריך : {currentDate.toLocaleDateString('en-CA')}</h1><hr />
            <h2 style={{ color: 'white',fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}> הוסף / ערוך הערות </h2>
            <br />
            <textarea className='note-textarea' value={note} dir='rtl'
              onChange={(e) => setNote(e.target.value)} // עדכון הערה
              placeholder="הקלד את ההערה כאן"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' , maxWidth: '400px'}}>
            <button onClick={saveNote} className='save-button'>שמור</button>
            <button onClick={() => {setNote('')
               setShowNoteModal(false)}} className='save-button'>סגור</button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}

export default EventCalendar;
