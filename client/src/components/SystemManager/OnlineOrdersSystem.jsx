import React, { useEffect, useState } from "react";
import NavbarAll from "./NavbarAll";
import '../../assets/stylesManager/OnlineOrdersSystem.css';
import { useNavigate } from 'react-router-dom';


const OnlineOrdersSystem = () => {
  const navigate = useNavigate();

  const [ordersOnline, setOrdersOnline] = useState([]); // מערך המכיל את כל ההזמנות
  const [selectedOrder, setSelectedOrder] = useState(null); // הזמנה שנבחרה לראות
  const [editWindow, setEditWindow] = useState(null); // מצב עבור אישור סגירת ההזמנה

  // הבאת ההזמנות
  useEffect(() => {
      const fetchOrdersOnline = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch('http://localhost:3001/api/online_orders', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // הוספת הטוקן לכותרת 
          }
      });
      const data = await response.json();
      setOrdersOnline(data.reverse());
    } catch (error) {
      console.error("שגיאה בהבאת הזמנות:", error);
    }
  };
    fetchOrdersOnline();
  }, []);


  // סגירת ההזמנה
  const handleAddCustomerOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("authToken");

      const orderToClose = ordersOnline.find(order => order.id === orderId);      
      if (!orderToClose) {
        console.error("ההזמנה לא נמצאה");
        return;
      }
      const orderData = {
        orderId: orderToClose.id,
        userName: orderToClose.user_name,
        userPhone: orderToClose.userPhone,
        guestCount: orderToClose.guest_count,
        eventDate: orderToClose.event_date,
        orderMenu: orderToClose.order_menu,
        totalPrice: orderToClose.total_price,
        email: orderToClose.email,
        password: orderToClose.password , 
        event_location: orderToClose.event_location,
        address: orderToClose.address
      };

      const response = await fetch('http://localhost:3001/api/online_orders/add_customer_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,

        },
        body: JSON.stringify(orderData),
      });
      if (response.ok) {
        // שליחה נוספת לשרת למחיקת ההזמנה מטבלת אונליין
        const deleteResponse = await fetch(`http://localhost:3001/api/online_orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (deleteResponse.ok) {
          setOrdersOnline((prevOrders) => prevOrders.filter(order => order.id !== orderId));
          setEditWindow(null); // סגור את חלון האישור
        } else {
          alert("שגיאה במחיקת ההזמנה אונליין");
          console.error("שגיאה במחיקת ההזמנה אונליין");
        }
      } else {
        console.error("שגיאה באישור ההזמנה");
      }
    } catch (error) {
      console.error("שגיאה באישור ההזמנה:", error);
    }
  };
  //----------מחיקת ההזמנה -------------------------------------------
  const handleDeleteOrder = async (orderId) => {
    // חלון אישור מחיקה
    const isConfirmed = window.confirm("האם אתה בטוח שברצונך למחוק את ההזמנה?");
    if (!isConfirmed) {
      return; // אם המשתמש בחר 'ביטול', הפעולה לא תתבצע
    }
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/online_orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if (response.ok) {
        setOrdersOnline((prevOrders) => prevOrders.filter(order => order.id !== orderId));
      } else {
        console.error("שגיאה במחיקת ההזמנה");
      }
    } catch (error) {
      console.error("שגיאה במחיקת ההזמנה:", error);
    }
  };
  //-----------פתיחת חלון הצגת הזמנה------------------------------------------------------------
  const handleShowOrder = (order) => {
    setSelectedOrder(order); 
    navigate(`/OrderDetails`, {state: { orderDetails: order }  // שלח את כל פרטי ההזמנה
    }); 
  };
  

  return (
    <>
     <NavbarAll/> <br />
    <div className="online-orders-system">
      <h1 className="online-orders-title">הזמנות אונליין</h1><br />
      <div className="orders-list">
        {ordersOnline.length === 0 ? (
          <p className="no-orders">אין הזמנות זמינות כרגע</p>
        )
         :
           (
          ordersOnline.map((order) => (
            <div key={order.id} className="order-card">
               <span className="delete-order-button" onClick={() => handleDeleteOrder(order.id)}>&times;</span>
              <h2 className="order-user-name">{order.user_name}</h2>
              <p className="order-user-phone">מספר טלפון: {order.userPhone}</p>
              <p className="order-guest-count">מספר אורחים: {order.guest_count}</p>
              <p className="order-guest-count"> אזור ההזמנה: {order.event_location}</p>
              <p className="order-guest-count"> כתובת ההזמנה: {order.address}</p>
              <p className="order-title">תאריך ביצוע ההזמנה: {new Date(order.event_date).toLocaleDateString()}</p>      
              <p className="order-guest-count"> לקוח שלח בתאריך: {new Date(order.shipping_date).toLocaleDateString()}</p>
              <div className="online-order-actions-container">
                <button  className="approve-button" onClick={() => setEditWindow(order.id)} >
                  אשר הזמנה
                </button>
                <button className="show-order-button"onClick={() => handleShowOrder(order)}>
                  הצג הזמנה
                </button>
               
              </div>
            </div>
          ))
        )}
      </div>

      {/* חלון אישור סגירת הזמנה */}
      {editWindow && (
        <div className="edit-window">
        <div className="edit-window-content">
          <span className="close-modal" onClick={() => setEditWindow(null)}>&times;</span>
          <h3>האם אתה בטוח שברצונך לסגור את ההזמנה</h3>
          <p>לאחר אישור - הזמנה זו תכנס למאגר ההזמנות במערכת </p>
          <div>
          <button onClick={() => handleAddCustomerOrder(editWindow)}>אישור</button>
          <button className="cancel-button" onClick={() => setEditWindow(null)}>סגור</button>
          </div>
        </div>
      </div>
      )}
    </div>
  </>
  );
};

export default OnlineOrdersSystem;
