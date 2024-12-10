import React from 'react';
import { useLocation } from 'react-router-dom';

const OrderManagementDetails = () => {
  const location = useLocation();
  const { orderDetails } = location.state || {}; 

  if (!orderDetails) {
    return <p>לא נמצאו פרטי הזמנה.</p>; 
  }


  const { owner_name, owner_phone, event_date, guest_count,totalPrice, order_menu } = orderDetails;
  const parsedOrderMenu = order_menu && JSON.parse(order_menu); // Parse the order menu

  return (
    <div className="kitchen-order-container" dir="rtl">
      <div className="order-details-header">
        <h1>פרטי הזמנה</h1>
        <p><strong>שם המזמין:</strong> {owner_name}</p>
        <p><strong>מספר טלפון:</strong> {owner_phone}</p>
        <p><strong>תאריך האירוע:</strong> {new Date(event_date).toLocaleDateString()}</p>
        <p><strong>מספר אורחים:</strong> {guest_count}</p>
        <p><strong> סה"כ:</strong> {totalPrice}</p>
      </div>
      <hr />
      
      {/* Displaying the order menu by categories */}
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
                <th>מחיר המנה</th>
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

export default OrderManagementDetails;
