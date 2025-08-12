import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import styles from '../../assets/stylesManager/OrderManagement.module.css';
import NavbarAll from './NavbarAll';


import DescriptionIcon from '@mui/icons-material/Description';


import { FaSearch } from 'react-icons/fa';  // אייקון חיפוש
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


import { Snackbar, Alert } from '@mui/material';
import  {ShoppingCart} from '@mui/icons-material';
const OrderManagement = () => {
  const navigate = useNavigate();

 const [orders, setOrders] = useState([]);  // מציג את ההזמנות הסינוניות
const [ordersForSearch, setOrdersForSearch] = useState([]);  // מציג את כל ההזמנות המקוריות
  const [editingOrder, setEditingOrder] = useState(null);
  const [quantityModalOpen, setQuantityModalOpen] = useState(false); // לקיחת כמויות שונות
  const [formData, setFormData] = useState({ guest_count: 0 });

  const [inventoryAll, setInventoryAll] = useState({
    first_courses: [],
    main_courses: [],
    salads: [],
    side_dishes: [],
  });

  const [selectedSalads, setSelectedSalads] = useState([]);
  const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);
  const [selectedMainDishes, setSelectedMainDishes] = useState([]);
  const [selectedSides, setSelectedSides] = useState([]);

  const [guestCount, setGuestCount] = useState(0);

  const [firstDishQuantities, setFirstDishQuantities] = useState({});
  const [mainDishQuantities, setMainDishQuantities] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);  // שומר את ההזמנה למחיקה
  const [openSnackbar, setOpenSnackbar] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [snackbarSeverity, setSnackbarSeverity] = useState('success');

const token = localStorage.getItem('authToken');

//-------------------------------
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/OrderManagement', { headers: { Authorization: `Bearer ${token}` } });
        const sortedOrders = response.data.reverse(); // הופכים את המערך כך שההזמנה האחרונה בראש
        setOrders(sortedOrders);
        setOrdersForSearch(sortedOrders);  // שמירה על הגיבוי של ההזמנות
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
   
  }, []);
//-------------------------------
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/InventoryAll', { headers: { Authorization: `Bearer ${token}` } });
        setInventoryAll(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInventory();
  }, []);
  
  

//---------עדכון הכמויות------------------------------------------
const handleQuantityChange = (category , id, quantity) => {
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

//-------------פתחית חלון כמויות------------------------------
  const handleSaveGuestCount = () => {
    setGuestCount(formData.guest_count); // עדכון כמות המוזמנים
     setQuantityModalOpen(true);
  };

//-------------הבאת ההזמנה של הלקוח הנבחר-----------------------------------------------------------
  const OpenEditingOrder = async (order) => {// הזמנה של המשתמש הנבחר
    setFormData({ guest_count: order.guest_count });
    try {
      const response = await axios.get(`http://localhost:3001/api/OrderManagement/users/${order.user_id}`, { headers: { Authorization: `Bearer ${token}` } });
      const orderData = response.data;
      if (!orderData) {
        alert("הזמנה לא נמצאה");
        return;
      } 
      const OrderMenu = JSON.parse( orderData[0].order_menu);
      setEditingOrder(orderData);
      setSelectedFirstDishes(OrderMenu.first_courses);
      setSelectedMainDishes(OrderMenu.main_courses);
      setSelectedSalads(OrderMenu.salads);
      setSelectedSides(OrderMenu.side_dishes);

      const firstQuantities = {};
      const mainQuantities = {};

      setFirstDishQuantities(firstQuantities);
      setMainDishQuantities(mainQuantities);

    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

//---------------החישוב מחדש--------------------------------------------------------
  const handleQuantityModalSubmit = async() => {
    // let total = 0;
 
    const selectedFirstDishesData = selectedFirstDishes.map((id) => {
        const dishName = id.dish_name; // אם id מכיל את שם המנה
        const firstDish = inventoryAll.first_courses.find(d => d.dish_name === dishName);
          let index = firstDish.id;
          
        let totalPrice = 0 ;
        let totalWeight = 0;
    
        if(firstDish.weight > 0 && firstDish.weight < 2) { // יחידות
            totalPrice = firstDishQuantities[index] * firstDish.price;
            totalWeight = firstDishQuantities[index];
        } else {
            totalPrice = (firstDishQuantities[index] * firstDish.weight) / 1000 * firstDish.price;
            totalWeight = firstDishQuantities[index];
        }
        // total += totalPrice;
        return {
            dish_name: firstDish.dish_name,
            totalPrice: totalPrice.toFixed(2),
            totalWeight: totalWeight
        };
    });
    const selectedMainDishesData = selectedMainDishes.map((id) => {
        const dishName = id.dish_name; // אם id מכיל את שם המנה
        const mainDish = inventoryAll.main_courses.find(d => d.dish_name === dishName);
        let index = mainDish.id;

        let totalPrice = 0 ;
        let totalWeight = 0;
        if(mainDish.weight > 0 && mainDish.weight < 2) { // יחידות
            totalPrice = mainDishQuantities[index] * mainDish.price;
            totalWeight = mainDishQuantities[index];
        } else {
            totalPrice = (mainDishQuantities[index] * mainDish.weight) / 1000 * mainDish.price;
            totalWeight = mainDishQuantities[index];
        }
        // total += totalPrice;
        return {
            dish_name: mainDish.dish_name,
            totalPrice: totalPrice.toFixed(2),
            totalWeight: totalWeight
        };
    });

    const selectedSaladsData = selectedSalads.map((id) => {
        const dishName = id.dish_name; // אם id מכיל את שם המנה
        const salad = inventoryAll.salads.find(d => d.dish_name === dishName);
        const totalPrice = salad.weight * salad.price / 1000 * guestCount ;
        // total += totalPrice;
        return {
            dish_name: salad.dish_name,
            totalPrice: totalPrice.toFixed(2),
            totalWeight: (salad.weight * guestCount).toFixed(2)
        };
    });

    const selectedSidesData = selectedSides.map((id) => {
        const dishName = id.dish_name; // אם id מכיל את שם המנה
        const side = inventoryAll.side_dishes.find(d => d.dish_name === dishName);
        const totalPrice = (side.weight * side.price) / 1000 * guestCount;
        // total += totalPrice;
        return {
            dish_name: side.dish_name,
            totalPrice: totalPrice.toFixed(2),
            totalWeight: (side.weight * guestCount).toFixed(2)
        };
    });

    const selectedItems = {
        salads: selectedSaladsData,
        first_courses: selectedFirstDishesData,
        main_courses: selectedMainDishesData,
        side_dishes: selectedSidesData
    };

    try {
             // קריאה לשרת כדי לעדכן את ההזמנה
    const response = await axios.put(`http://localhost:3001/api/OrderManagement/UpdateOrder/${editingOrder[0].user_id}/${editingOrder[0].id}`,
      {
        guest_count: guestCount,
        order_menu: selectedItems
      },{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    if (response.status === 200) {
      alert("ההזמנה עודכנה בהצלחה");
      setEditingOrder(null);
      setQuantityModalOpen(false);
      setSelectedFirstDishes([]);
      setSelectedMainDishes([]);
      setSelectedSalads([]);
      setSelectedSides([]);
    } else {
      alert("שגיאה בעדכון ההזמנה");
    }
  } catch (error) {
    console.error('Error updating order:', error);
  }

  };


  // -------מחיקת ההזמנה והלקוח ------------------------------------------------------
  const handleDeleteOrder = async () => {
    try {
      if (orderToDelete) {
        const response = await axios.delete(`https://localhost:3001/OrderManagement/DeleteOrder/${orderToDelete.user_id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
        if (response.status === 200) {
          // עדכון רשימת ההזמנות לאחר המחיקה
          setSnackbarMessage('ההזמנה נמחקה בהצלחה');
          setSnackbarSeverity('success');
          setOrders(orders.filter(o => o.user_id !== orderToDelete.user_id));
        } else {
          setSnackbarMessage('שגיאה במחיקת ההזמנה');
          setSnackbarSeverity('error');
        }
        setOpenSnackbar(true); // הצג את ה-Snackbar
      }
      setOpenDeleteDialog(false);  // סגור את הדיאלוג
    } catch (error) {
      console.error('Error deleting order:', error);
      setSnackbarMessage('שגיאה במחיקת ההזמנה');
      setSnackbarSeverity('error');
      setOpenSnackbar(true); // הצג את ה-Snackbar במקרה של שגיאה
      setOpenDeleteDialog(false);  // סגור את הדיאלוג גם במקרה של שגיאה
    }
  };
  

// פונקציה לפתיחת הדיאלוג למחיקת הזמנה
  const handleDeleteDialogOpen = (order) => {
    setOrderToDelete(order);
    setOpenDeleteDialog(true);
  };

  // פונקציה לסגירת הדיאלוג
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

//--------פונקציה לחיפוש הזמנה---------------------------
const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();  // חיפוש באותיות קטנות
  if (query === "") {
    setOrders(ordersForSearch);  // הצג את כל ההזמנות
    return;
  }
  // סינון ההזמנות לפי שם בעל ההזמנה או תאריך האירוע
  const filtered = ordersForSearch.filter((order) => {
    const ownerName = order.owner_name.toLowerCase();
    const eventDate = new Date(order.event_date).toLocaleDateString('he-IL');
    return ownerName.includes(query) || eventDate.includes(query); // חיפוש במילים
  });

  setOrders(filtered);  // הצג את התוצאות הסינוניות
};
//------------עריכת תוכן ההזמנה---------------------------------------
const editOrderDetails = (order) => {

  // שולח את המידע הרלוונטי לעריכת ההזמנה לדף KitchenOrder
  navigate('/KitchenOrder', {
    state: {
      orderSummary: [order],
      eventOwner: order.owner_name,
      eventDate: order.event_date,
      phoneNumber: order.owner_phone,
      guestCount: order.guest_count,
      totalPrice: order.totalPrice, 
      email: order.owner_email, 
      event_location: order.event_location, 
      address: order.address, 
      shippingCost: order.shipping_cost,
      serviceCost: order.service_cost,
      toolsType: order.tools_type,
      eventType: order.event_type
    }
  });
};


  return (
    <div>
      <NavbarAll /><br />
      <h1>ניהול הזמנות    <ShoppingCart/> </h1>
      <br />

      {/* תיבת חיפוש */}
      <div className={styles.searchContainer}>
        <input dir='rtl'
          type="text" className={styles.searchInput} placeholder = "חפש לפי שם בעל ההזמנה או תאריך אירוע"
          onChange={handleSearch}
        />
        <FaSearch className={styles.searchIcon} />
      </div>


      <table className={styles.table} dir="rtl">
        <thead>
          <tr>
            <th className={styles.th}> לקוח</th>
            <th className={styles.th}>שם בעל ההזמנה</th>
            <th className={styles.th}>תאריך אירוע</th>
            <th className={styles.th}>מספר מוזמנים</th>
          
            <th className={styles.th}>צפייה / עריכה בהזמנה</th>
             <th className={styles.th}>ביצוע חישוב מחדש </th>
            <th className={styles.th}>מחיקה</th>
          </tr>
        </thead>
        <tbody>
           {orders.map((order,index) => (
             <tr key={order.user_id} className={styles.tr}>
               <td className={styles.td}>{orders.length - index}</td>
               <td className={styles.td}>{order.owner_name}</td>
               <td className={styles.td}>{new Date(order.event_date).toLocaleDateString('he-IL')}</td>
               <td className={styles.td}>{order.guest_count}</td>
              

               <td className={styles.td}>
               <div style={{ cursor: 'pointer' }} onClick={() => editOrderDetails(order)}>
                 <DescriptionIcon style={{ marginRight: '5px' }} />

                צפייה בהזמנה
               </div>
             </td>

               <td className={styles.td}>
               <button className={styles.blue} onClick={() => OpenEditingOrder(order)} >
                 פתיחה </button>      
                 </td>

                <td className={styles.td}>
                <div style={{ cursor: 'pointer' }} onClick={() => handleDeleteDialogOpen(order)}>
                 <DeleteIcon style={{ marginRight: '8px' }} />
               </div>
              
           </td>

             </tr>
           ))}
         {orders.length === 0 && <tr><td colSpan="6">לא נמצאו הזמנות</td></tr>}
          

         </tbody>
      </table>

      {/* לקיחת מספר מוזמנים שונה  */}
      {editingOrder && (
        <div className="modal-online" dir="rtl">
          <div className="modal-content-user-order-online">
            <div>
              <div onClick={() => setEditingOrder(false)} className={styles.close}>&times;</div>
              <h3>עדכון מספר מוזמנים</h3>
              <input  className="form-input"  type="number" name="guest_count"
                value={formData.guest_count}
                onChange={(e) => setFormData({ ...formData, guest_count: e.target.value })}
              />
            </div><br />
            <div className={styles.buttons}>
            <button className={styles.blue} onClick={handleSaveGuestCount}>אישור</button>
            <button className={styles.red} onClick={() => setEditingOrder(false)}>ביטול</button>
            </div>
          </div>
        </div>
      )}

  {/* שינוי כמויות ההזמנה */}
{quantityModalOpen && (
  <div className="modal-online">
    <div className="modal-content-user-order-online">
      <div onClick={() => setQuantityModalOpen(false)}className={styles.close} >&times;</div>
      <h3>הגדר את כמות המנות במדויק</h3>
      <h3>עבור {formData.guest_count} איש ששינת</h3>
      <hr />

      {/* מנות ראשונות */}
      <h3>מנות ראשונות</h3>
      {selectedFirstDishes && Object.entries(selectedFirstDishes).map((id) => {
      const dish = inventoryAll.first_courses.find(d => d.dish_name === id[1].dish_name);
        if (!dish) return null; // אם המנה לא נמצאה, לא תציג אותה
        return (
          <div key={id}>
            <label>{dish.dish_name}  - <strong>{id[1].totalWeight || ''}</strong></label>
            <input
              className="form-input"
              type="number"
              onChange={(e) => handleQuantityChange('first_courses', dish.id, e.target.value)}
            />
          </div>
        );
      })}
      
      {/* מנות עיקריות */}
      <div className="form-group-quantity">
        <h3>מנות עיקריות</h3>
        {selectedMainDishes && Object.entries(selectedMainDishes).map((id) =>{
          const dish = inventoryAll.main_courses.find(d => d.dish_name === id[1].dish_name);
          if (!dish) return null; // אם המנה לא נמצאה, לא תציג אותה
          return (
            <div key={id}>
              <label>{dish.dish_name} - <strong>{id[1].totalWeight || ''}</strong></label>
           
              <input
                className="form-input"
                type="number"
                onChange={(e) => handleQuantityChange('main_courses', dish.id, e.target.value)}
              />
            </div>
          );
        })}
      </div>
     <br />
      {/* כפתור אישור */}
      <button onClick={handleQuantityModalSubmit} className="submit-button">
         עדכן הזמנה
      </button>
    </div>
  </div>
)}



    <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>אישור מחיקת הזמנה</DialogTitle>
        <DialogContent>
          <p>האם אתה בטוח שברצונך למחוק את ההזמנה של  {orderToDelete?.owner_name}<br/>  פעולה זו לא ניתנת לביטול</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            ביטול
          </Button>
          <Button onClick={handleDeleteOrder} color="secondary">
            מחיקה
          </Button>
        </DialogActions>
      </Dialog>


  <Snackbar
  open={openSnackbar}
  autoHideDuration={6000} // הזמן שההודעה תישאר פתוחה
  onClose={() => setOpenSnackbar(false)} // סוגר את ה-Snackbar כאשר נגמר הזמן או נלחץ
>
  <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity}>
    {snackbarMessage}
  </Alert>
</Snackbar>





    </div>
  );
};

export default OrderManagement;
