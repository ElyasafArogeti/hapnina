import React from "react";
import { useLocation } from "react-router-dom";

const OrderDetails = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {}; // קבלת פרטי ההזמנה

  if (!orderDetails) {
    return <p>לא נמצאו פרטי הזמנה.</p>;
  }

  // לפרק את פרטי ההזמנה
  const { user_name, userPhone, event_date, guest_count, shipping_date, order_menu } = orderDetails;

  const parsedOrderMenu = order_menu && JSON.parse(order_menu); // משתנה התפריט

  return (
    <div className="kitchen-order-container" dir="rtl">
      <div className="order-details-header">
        <h1>פרטי הזמנה</h1>
        <p>שם המזמין: {user_name}</p>
        <p>מספר טלפון: {userPhone}</p>
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
                    <td>{item.totalWeight > 1000 ? `${(item.totalWeight / 1000).toFixed(2)} קילו` : `${parseInt(item.totalWeight)} מנות`}</td>
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
