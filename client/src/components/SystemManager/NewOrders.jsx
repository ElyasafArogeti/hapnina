import React, { useEffect, useState } from 'react';
import '../../assets/stylesManager/NewOrders.css';
import NavbarAll from './NavbarAll';

import { ImExit } from "react-icons/im";
import { apiFetch } from '../api';

const NewOrders = () => {
    const [inventoryAll, setInventoryAll] = useState({//מאגר המנות
        first_courses: [],
        main_courses: [],
        salads: [],
        side_dishes: []
    });

    const [guestCount, setGuestCount] = useState(""); //כמות האורחים
    const [eventOwner, setEventOwner] = useState("");//שם בעל האירוע
    const [eventDate, setEventDate] = useState("");// תאריך האירוע
    const [phoneNumber, setPhoneNumber] = useState("");//מספר בעל האירוע
    const [location, setIocation] = useState("");//מיקום האירוע
    const [password, setPassword] = useState(""); // מייל לקוח
    const [userEmail, setUerEmail] = useState(""); // מייל לקוח

    const [orderSummary, setOrderSummary] = useState(null);//מערך המכיל סיכום ההזמנה 
    const [totalPrice, setTotalPrice] = useState(0);//מחיר כולל 
        
    const [selectedSalads, setSelectedSalads] = useState([]);//סלטים נבחרים
    const [selectedFirstDishes, setSelectedFirstDishes] = useState([]);//מנות ראשונות נבחרות
    const [selectedMainDishes, setSelectedMainDishes] = useState([]);//נבחרו מנות עיקריות
    const [selectedSides, setSelectedSides] = useState([]);//צדדים נבחרים 
    
    const [orderDisplay, setOrderDisplay] = useState(true);// מעבר למסך סיכום ההזמנה
    const [closingOrderSummary, setClosingOrderSummary] = useState(null);// סגירת הזמנה
    const [editModal, setEditModal] = useState(false); // אישור סגירת הזמנה
    
    useEffect(() => {   
        const fetchInventoryAll = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const data = await apiFetch('/api/inventoryAll', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setInventoryAll(data);
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            }
        };
        fetchInventoryAll(); 
    }, []);

    const handleOrderSummary = () => {   
        let total = 0;   
                      //  סלטים 
        const selectedSaladsData = selectedSalads.map((id) => {
            const salad = inventoryAll.salads[id-1];  // ממסד הנתונים       
            const totalPrice = salad.weight * salad.price / 1000 * guestCount;
            const totalWeight = salad.weight * guestCount;
            total += totalPrice;
            return {
                dish_name: salad.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: totalWeight.toFixed(2)
            };
        });
                //מנה ראשונה
        const selectedFirstDishesData = selectedFirstDishes.map((dish) => {
            const firstDish = inventoryAll.first_courses.find(d => d.id === dish.id);
            let totalPrice = 0 ;
            let totalWeight = 0 ; 
            if(firstDish.weight > 0 && firstDish.weight < 2) {   // משווה לפי יחידות מנה        
                totalPrice = dish.value  *  firstDish.price; 
                totalWeight = dish.value;                
          }else {  // משווה לפי גרם מנה 
            totalPrice = (dish.value * firstDish.weight) / 1000 * firstDish.price; 
            totalWeight = dish.value; 
          }
            total += totalPrice;
            return {
                dish_name: firstDish.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: totalWeight
            };
        });
                  //  מנות עיקריות 
        const selectedMainDishesData = selectedMainDishes.map((dish) => {
            const mainDish = inventoryAll.main_courses.find(d => d.id === dish.id);
            let totalPrice = 0 ;
            let totalWeight = 0 ;
            if(mainDish.weight > 0 && mainDish.weight < 2) { // אם זה לפי יחידות 
            totalPrice = dish.value * mainDish.price;
            totalWeight = dish.value;
           } else {
            totalPrice =(dish.value * mainDish.weight) / 1000 * mainDish.price; 
            totalWeight = dish.value; 
           }  
            total += totalPrice;
            return {
                dish_name: mainDish.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: totalWeight
            };
        });
                  //  תוספות 
        const selectedSidesData = selectedSides.map((id) => {
            const Sides = inventoryAll.side_dishes[id-1];
            const totalPrice = Sides.weight * Sides.price / 1000 * guestCount;
             const totalWeight = Sides.weight * guestCount;
            total += totalPrice;
            return {
                dish_name: Sides.dish_name,
                totalPrice: totalPrice.toFixed(2),
                totalWeight: totalWeight.toFixed(2)
            };
        });
            // אובייקט סיכום הזמנה לאחר חישוב
        const selectedItems = {
            salads: selectedSaladsData,
            first_courses: selectedFirstDishesData,
            main_courses: selectedMainDishesData,
            side_dishes: selectedSidesData
        };
             
        setTotalPrice(total.toFixed(2)); // עדכון המחיר הכולל

        setOrderSummary(selectedItems);//עדכון סיכום הזמנה
        setClosingOrderSummary(selectedItems);//עדכון סגירת הזמנה 
        setOrderDisplay(false);  // תצוגת מסך ההזמנה 
    };

    // פתיחת חלון אישור הזמנה
    const openEditModal = () => {  
        setEditModal(true);
    };
    //--בגירת חלון אישור הזמנה---------------------
     const closingButtonEditModal = () => {
    setEditModal(false); 
  }
  //----------  חזרה לתפריט-חדש--------------------
  const handleBack = () => {
    setOrderDisplay(true);
    setSelectedFirstDishes([]);
    setSelectedMainDishes([]);
    setSelectedSalads([]);
    setSelectedSides([]);
    setOrderSummary([]);
  }
    //------------------------------------------
             // סגירת הזמנה
    const ClosingOrderSummary = async () => {
       const users = {
           user_id: phoneNumber,
           eventOwner: eventOwner,
           guestCount: guestCount,
           eventDate: eventDate,
           password: password,
           email: userEmail
       };
       const orderSummary = {      
           order_menu: closingOrderSummary,   // פריטי הזמנה שנסגרה
           guest_count: guestCount,          // כמות האורחים
           event_date: eventDate,            // תאריך האירוע
           totalPrice: totalPrice            // מחיר כולל
       };       
       try {
        const token = localStorage.getItem("authToken");
           const userResponse = await apiFetch('/api/users', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json' ,
                   'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify(users)
           });   
           if (!userResponse.ok) {
               throw new Error("שגיאה בהכנסת משתמש");
           }
           const userData = await userResponse.json();      // השגת נתוני המשתמש שנוסף
           const userId = userData.id;              // קבלת ה-id של המשתמש החדש
           const updatedOrderSummary = {
               user_id: userId ,               // השתמש ב-id שנוצר, לא בטלפון
               ...orderSummary               // שאר פרטי ההזמנה
           };
           const orderResponse = await apiFetch('/api/orders', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json', 
                   'Authorization': `Bearer ${token}`
               },
               body: JSON.stringify(updatedOrderSummary)
           });   
              if (!orderResponse.ok) {
               throw new Error("שגיאה בהכנסת הזמנה");
           }   
           alert("ההזמנה נשלחה בהצלחה");
           setOrderDisplay(true); 
         } catch (error) {
           console.error("שגיאה:", error);
           alert("אירעה שגיאה בתהליך שליחת ההזמנה או הכנסת המשתמש.");
       }
       setEditModal(false);
   };

   const whatCategory = { // הוסף תרגומים נוספים לפי הצורך 
    salads: ' סלטים',
    first_courses: ' מנות ראשונות',
    main_courses: ' מנות עיקריות',
    side_dishes: ' תוספות'
 }

    return (
        <div>
            <NavbarAll />
     {orderDisplay  ?  ( 
        <div>
         <div className='header-data'>
                <h2 id="h2he">פרטי בעל ההזמנה</h2>
                <div dir="rtl" className="input-container1">
                    <input type="text" className="input-field-NewOrder"  placeholder="שם בעל האירוע" onChange={(e) => setEventOwner(e.target.value)} />
                    <input type="date" className="input-field-NewOrder"   onChange={(e) => setEventDate(e.target.value)} placeholder='תאריך האירוע'/>
                    <input type="number" className="input-field-NewOrder"  placeholder="מספר טלפון" onChange={(e) => setPhoneNumber(e.target.value)} />
                    <input type="email" className="input-field-NewOrder"  placeholder="כתובת מייל" onChange={(e) => setUerEmail(e.target.value)} />
                </div>
                <div dir="rtl" className="input-container">
                    <input type="number" className="input-field-NewOrder"  placeholder="מספר מוזמנים" onChange={(e) => setGuestCount(e.target.value)} />
                    <input list="locushn" type="text" className="input-field-NewOrder" placeholder="מקום האירוע"  onChange={(e) => setIocation(e.target.value)}/>
                    <input list="locushn" type="password" className="input-field-NewOrder" placeholder=" סיסמא לאזור אישי"  onChange={(e) => setPassword(e.target.value)}/>
                    <datalist id="locushn">
                        <option value="הפנינה">ביתר עלית</option>
                    </datalist>
                </div>
            </div>

            <div dir="rtl" className="container">
                <div className="header_newOrder">
                    <h1 id="h1container">תפריט אירועים</h1>
                    <h2>קייטרינג הפנינה - כשר למהדרין</h2>
                    <p>פלאפון - 054-6600-200 | מייל - eli6600200@gmail.com</p>
              </div>
 <div>
  <table>           
     <tbody>
        <tr>
        <td className="section">
            <h2>סלטים [8 לבחירה]</h2>
            <ul>
                {inventoryAll.salads.filter(side => side.is_hidden).map((salad) => (
                    <li key={salad.id}>
                        <label >
                            <input
                                type="checkbox"
                                value={salad.id} 
                                onChange={(e) => {
                                    const id = salad.id;
                                    setSelectedSalads((prev) => {
                                        if (e.target.checked) {
                                            if (!prev.includes(id)) { // בדיקה אם לא קיים המספר כבר
                                                return [...prev, id]; 
                                            }
                                        } else { // אחרת מורידים את המספר 
                                            return prev.filter((s) => s !== id);
                                        }
                                        return prev; // החזר את הרשימה ללא שינוי
                                    });
                                }}
                            />
                            {salad.dish_name}
                        </label>
                    </li>
                ))}
            </ul>
        </td>
        <td className="section">
    <h2>מנה ראשונה [3 לבחירה]</h2>
    <h4>[הכנס כמות ביחידות]</h4>
    <ul>
        {inventoryAll.first_courses.filter(side => side.is_hidden).map((firstDish) => (
            <li key={firstDish.id}>
                <label>
                    <input
                        type="number"
                        className="menu-item"
                        min="1"
                        step="1"
                        defaultValue=""
                        onBlur={(e) => {
                            const value = e.target.value;
                            // אם הערך ריק, פשוט מחק את המנה
                            setSelectedFirstDishes((prev) => {
                                if (value === "") {
                                    // אם הכמות ריקה, מסננים ומסירים את המנה
                                    return prev.filter(dish => dish.id !== firstDish.id);
                                }
                                // אחרת, הוסף או עדכן את המנה
                                const newValue = { id: firstDish.id, name: firstDish.dish_name, value };
                                // סנן את המנות הישנות, הוסף את המנה החדשה, ומיין לפי ID
                                const updatedDishes = prev.filter(dish => dish.id !== firstDish.id);
                                const updatedList = [...updatedDishes, newValue];
                                // מיין את המנות לפי ה-ID
                                updatedList.sort((a, b) => a.id - b.id);
                                return updatedList;
                            });
                        }}
                    />
                    {firstDish.dish_name}
                </label>
            </li>
        ))}
    </ul>
</td>
        <td className="section">
            <h2>מנה עיקרית [3 לבחירה]</h2>
            <h4>[הכנס כמות ביחידות]</h4>
            <ul>
                {inventoryAll.main_courses.filter(side => side.is_hidden).map((mainDish) => (
                    <li key={mainDish.id}>
                        <label>
                        <input
                        type="number"
                        className="menu-item"
                        min="1"
                        step="1"
                        defaultValue=""
                        onBlur={(e) => {
                            const value = e.target.value;
                            setSelectedMainDishes((prev) => {
                                if (value === "") {
                                    // אם הכמות ריקה, מסננים ומסירים את המנה
                                    return prev.filter(dish => dish.id !== mainDish.id);
                                }
                                // אחרת, הוסף או עדכן את המנה
                                const newValue = { id: mainDish.id, name: mainDish.dish_name, value };
                                // סנן את המנות הישנות, הוסף את המנה החדשה, ומיין לפי ID
                                const updatedDishes = prev.filter(dish => dish.id !== mainDish.id);
                                const updatedList = [...updatedDishes, newValue];
                                // מיין את המנות לפי ה-ID
                                updatedList.sort((a, b) => a.id - b.id);
                                return updatedList;
                            });
                        }}
                      />
                            {mainDish.dish_name}
                        </label>
                    </li>
                ))}
            </ul>
        </td>
    </tr>

    <tr>
        <td className="section">
            <h2>תוספות [3 לבחירה]</h2>
            <ul>
                {inventoryAll.side_dishes.filter(side => side.is_hidden).map((sideDish) => (
                    <li key={sideDish.id}>
                        <label>
                        <input
                                type="checkbox"
                                value={sideDish.id} 
                                onChange={(e) => {
                                    const id = sideDish.id;
                                    setSelectedSides((prev) => {
                                        if (e.target.checked) {
                                            if (!prev.includes(id)) {  // בדיקה אם לא קיים המספר כבר
                                                return [...prev, id]; 
                                            }
                                        } else { // אחרת מורידים את המספר 
                                            return prev.filter((s) => s !== id);
                                        }
                                        return prev; // החזר את הרשימה ללא שינוי
                                    });
                                }}
                            />
                            {sideDish.dish_name}
                        </label>
                    </li>
                ))}
            </ul>
        </td>
    </tr> 
 </tbody>    
</table> 
</div>
<button onClick={handleOrderSummary} className="order-summary-button">סיכום הזמנה</button>
</div>
</div>

  ) : (
  
    <div>
        <br />
        <div className="back-button">       
        <button onClick={openEditModal} className='close-summary-button'>סגירת הזמנה</button>   
        <ImExit onClick={handleBack} className='back'/>
       </div>
        <br />
        <div dir="rtl" className="order-summary-details">
            <h2>שם בעל האירוע: {eventOwner}</h2>
            <h3 >תאריך האירוע: {eventDate}</h3>
            <h3>מספר טלפון: {phoneNumber}</h3>
            <h3>מספר האורחים: {guestCount}</h3>
        </div>
        <br />
        <div className="total-price">
        <h2>סה"כ מחיר:  ₪ {totalPrice} </h2>
          </div>
          <br />
        <h2>רשימת פריטים נבחרים</h2>
        <table dir='rtl' className="order-summary-table">
            <thead className="order-summary-header">
                <tr>
                    <th>שם המנה</th>
                    <th>מחיר כולל</th>
                    <th>משקל כולל</th>
                </tr>
            </thead>
            <tbody className="order-summary-body">
            {Object.keys(orderSummary).map((category) => (
                <React.Fragment key={category}>
                    <tr className="category-row">
                        <th colSpan="3" className="category-header">
                        {category ? 
                            (whatCategory[category] 
                              ? whatCategory[category] : "" ) : ''}
                        </th>
                    </tr>
                    {/* הצגת פריטי הקטגוריה */}
                    {orderSummary[category].map((item, index) => (
                        <tr key={`${item.dish_name}-${index}`}>
                            <td>{item.dish_name}</td>
                            <td className="order-summary-weight">₪ {item.totalPrice}</td>
                            <td className="order-summary-weight">
                                {item.totalWeight > 1000 
                                    ? `${(item.totalWeight / 1000).toFixed(2)} קילו` 
                                    : `${parseInt(item.totalWeight)} מנות`}
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            ))}
        </tbody>
        </table>
    </div>
)}

     {editModal && (
     <div className="modal" >
         <div className="modal-content">
         <button onClick={closingButtonEditModal} className='close-modal'>X</button>
         <br />
          <h2>אשר סגירת ההזמנה </h2>
          <br />
        <button onClick ={ClosingOrderSummary}>אישור</button>
      </div>
     </div>
     

)
}
</div>

);
};

export default NewOrders;