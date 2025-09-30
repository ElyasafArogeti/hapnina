import React from "react";
import { useLocation } from "react-router-dom";

const OrderDetails = () => {

  const formatDisplayWeight = (weight, dishWeight) => {
  // dishWeight === משקל של מנה אחת מהדאטהבייס
  const isUnits = dishWeight > 0 && dishWeight < 2;

 if (isUnits) return `${parseInt(weight)} מנות`;
  if (weight >= 1000) return `${(weight / 1000).toFixed(2)} ק"ג`;
 return `${parseInt(weight)} גרם`;
};


  const location = useLocation();
  const { orderDetails } = location.state || {}; // קבלת פרטי ההזמנה

  if (!orderDetails) {
    return <p>לא נמצאו פרטי הזמנה.</p>;
  }

  // לפרק את פרטי ההזמנה
  const { user_name, userPhone, event_date, guest_count, shipping_date, order_menu, total_price,event_type } = orderDetails;

  const parsedOrderMenu = order_menu && JSON.parse(order_menu); // משתנה התפריט

  return (
    <div className="kitchen-order-container" dir="rtl">
      <div className="order-details-header">
        <h1>פרטי הזמנה</h1>
        <p>שם המזמין: {user_name}</p>
        <p>מספר טלפון: {userPhone}</p>
        <p> סה"כ: {total_price}</p>
        <p> סוג אירוע : {event_type}</p>
        <p>תאריך האירוע: {new Date(event_date).toLocaleDateString()}</p>
        <p>מספר אורחים: {guest_count}</p>
        <p>תאריך שליחה: {new Date(shipping_date).toLocaleDateString()}</p>
      </div>
      <hr />
          
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
                </tr>
              </thead>
              <tbody>
                {parsedOrderMenu[category].map((item, index) => (
                  <tr key={`${item.dish_name}-${index}`}>
                    <td>{item.dish_name}</td>
                    <td>{item.totalPrice}</td>
                    <td> {formatDisplayWeight(item.totalWeight, item.dishWeight)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

    </div>
  );
};

export default OrderDetails;
