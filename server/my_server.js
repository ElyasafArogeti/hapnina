const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const nodemailer = require('nodemailer');
const cron = require('node-cron');

const moment = require('moment'); // לעבודה עם תאריכים

const app = express();
app.use(express.json());
app.use(cors());

const startServer = async () => {
  //----------------חיבור למוסד נתונים -------------------------------
  const connection = await mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "123456",
    database: "bd",
  });
  connection.connect((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("חיבור מוצלח למסד נתונים...");
    }
  });
//MySQL פונקציה להמרת התאריך לפורמט של ---------------------------------------------------
const formatDateForMySQL = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
  //--------------בקשת כל הקטגוריות ------------------------------------------
  app.get("/inventoryAll", async (req, res) => {
    try {
      const [firstCourses] = await connection.query("SELECT * FROM first_courses");
      const [mainCourses] = await connection.query( "SELECT * FROM main_courses");
      const [salads] = await connection.query("SELECT * FROM salads");
      const [sideDishes] = await connection.query("SELECT * FROM side_dishes");
      res.send({
        first_courses: firstCourses,
        main_courses: mainCourses,
        salads: salads,
        side_dishes: sideDishes,
      });
    } catch (err) {
      console.error("Failed to fetch data from database:", err);
      res.status(500).send("Error fetching data");
    }
  });

            /*inventory   דף ניהול תפריט מורחב*/

  //------- הוספת מנה חדשה----------------------------------------------
  app.post("/addNewDish", async (req, res) => {
    const { dish_name, price, weight, category } = req.body;
    try {
      const [result] = await connection.query(
        `INSERT INTO ${category} (dish_name, price, weight) VALUES (?, ?, ?)`,
        [dish_name, price, weight]
      );
      res.status(201).send({ id: result.insertId, dish_name, price, weight });
    } catch (err) {
      console.error("Failed to add data to database:", err);
      res.status(500).send("Error adding data");
    }
  });
  //----- עדכון מנה--------------------------------------------------------
  app.put("/updateDish/:id", async (req, res) => {
    const { id } = req.params;
    const { dish_name, price, weight, category } = req.body;
    try {
      await connection.query(
        `UPDATE ${category} SET dish_name = ?, price = ?, weight = ? WHERE id = ?`,
        [dish_name, price, weight, id]
      );
      res.send("Dish updated successfully");
    } catch (err) {
      console.error("Failed to update data in database:", err);
      res.status(500).send("Error updating data");
    }
  });
  //----- מחיקת מנה--------------------------------------------------------
  app.delete("/deleteDish/:id", async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    try {
      await connection.query(`DELETE FROM ${category} WHERE id = ?`, [id]);
      res.send("Dish deleted successfully");
    } catch (err) {
      console.error("Failed to delete data from database:", err);
      res.status(500).send("Error deleting data");
    }
  });
  // ----------הסתר מנה ----------------------------------------------
// טיפול בהסתרה והחזרת מנה למסד הנתונים
app.put('/hideDish/:id', async (req, res) => {
  const { id } = req.params;
  const { hidden , category } = req.body;
  try {
    // עדכון המנה במסד הנתונים
    const [result] = await connection.query(`UPDATE ${category} SET is_hidden = ? WHERE id = ?`,
      [hidden, id]
    );
    // אם לא נמצא שורה עדכון, מחזיר שגיאה
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    // מחזיר תשובה עם הודעת הצלחה
    res.status(200).json({
      message: hidden ? 'Dish hidden successfully' : 'Dish unhidden successfully'
    });
  } catch (err) {
    console.error('Error updating dish status:', err);
    // החזרת שגיאה JSON עם פרטי השגיאה
    res.status(500).json({ message: 'Error updating dish status', error: err.message });
  }
});



              /* newOrder   דף הצעת מחיר מנהלים     */

  //-------------סגירת הזמנה----------------------------------------------------------
  app.post("/orders", async (req, res) => {
    const { user_id, order_menu, guest_count, event_date, totalPrice } = req.body;
    try {
      const orderMenuString = JSON.stringify(order_menu);
      const [result] = await connection.query(
        "INSERT INTO orders (user_id, order_menu, guest_count, event_date ,totalPrice) VALUES (?, ?, ?, ?, ?)",
        [user_id, orderMenuString, guest_count, event_date,totalPrice]
      );
      res.status(201).send({ id: result.insertId, order: order_menu });
    } catch (err) {
      console.error("שגיאה בהוספת נתוני הזמנה למסד נתונים:", err);
      res.status(500).send("שגיאה בהוספת נתונים");
    }
  });
  //-----------------סגירת משתמש------------------------------------------
  app.post("/users", async (req, res) => {
    const { user_id, eventOwner, guestCount, eventDate } = req.body;
    try {                          // בדוק אם המשתמש כבר קיים
      const [existingUser] = await connection.query( "SELECT * FROM users WHERE phone = ?",  [user_id]);  
      let newUserId;
      if (existingUser.length > 0) {        // אם המשתמש קיים השתמש במזהה שלו ולא להוסיף אותו לטבלה 
        newUserId = existingUser[0].id;
      } else {                           // הוסף משתמש חדש אם הוא לא קיים
        const [result] = await connection.query("INSERT INTO users ( name, guest_count, event_date ,phone) VALUES (?, ?, ?, ?)",
          [eventOwner, guestCount, eventDate, user_id]
        );
        newUserId = result.insertId; // השגת ה-id החדש
      }
      res.status(201).send({ id: newUserId, user_id, eventOwner, guestCount, eventDate });
    } catch (err) {
      console.error("הוספת נתונים למסד הנתונים נכשלה", err);
      res.status(500).send("Error adding data");
    }
  });



            /* Calender    דף לוח שנה אירועים     */
  //-----------------הבאת ההזמנות -------------------------------------
  app.get("/orders_calendar", async (req, res) => {
    try {
      const [orders] = await connection.query("SELECT * FROM orders");
      const formattedOrders = orders.map(order => {
        if (order.event_date) {  // המרת התאריך ל- UTC קודם כל (אם הוא לא כבר ב- UTC)
          const eventDate = new Date(order.event_date);
          // המרת הזמן לשעון ישראל (UTC +3)
          const israelTime = eventDate.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
          const [date] = israelTime.split(','); // חיתוך התאריך מהזמן 
          order.event_date = date; // עדכון התאריך
        }  return order;
      });
      res.json(formattedOrders); // החזרת ההזמנות
    } catch (err) {
      console.error("נכשל בשליפת נתונים מהמסד:", err);
      res.status(500).send("שגיאה בשליפת נתונים");
    }
  });  
 //-------------------------הצגת הזמנה לפי משתמש---------------------------------------
app.get("/user_calendar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [orders_user] = await connection.query("SELECT * FROM orders WHERE user_id = ?", [id]);
    const [user_name] = await connection.query("SELECT name FROM users WHERE id = ?", [id]);
    const [phone] = await connection.query("SELECT phone FROM users WHERE id = ?", [id]);
    const [totalPrice] = await connection.query("SELECT totalPrice FROM orders WHERE user_id = ?", [id]);
    if (orders_user.length > 0 && user_name.length > 0) {
      res.json({
        orders_user: orders_user,  // כל ההזמנות של המשתמש
        user_name: user_name[0].name,  // שם המשתמש
        phone_number: phone[0].phone,
        totalPrice: totalPrice[0].totalPrice
      });
    } else {
      res.status(404).json({ message: "לא נמצאו הזמנות או משתמש עם מזהה זה" });
    }
  } catch (err) {
      console.error("בעיה בטבלה האישית", err);
      res.status(500).send("בעיה בטבלה האישית");
  }
 });
 //------------------הוספת העררה-------------------------------------------------
app.post('/save-note/:orderId/:notes', async (req, res) => {
  const orderId = req.params.orderId;
  const  note = req.params.notes;  // ההערה ששלח הלקוח
  try {
    const [rows] = await connection.query('SELECT * FROM orders WHERE user_id = ?', [orderId]);
    if (rows.length === 0) {
      // אם לא נמצאה הזמנה
      return res.status(404).json({ error: 'לא נמצא אירוע בתאריך זה' });
    }
    // עדכון ההערה בטבלה
    await connection.query('UPDATE orders SET notes = ? WHERE user_id = ?', [note, orderId]);

    res.status(200).json({ message: 'ההערה נשמרה בהצלחה' });
  } catch (error) {
    console.error('שגיאה בשרת:', error);
    res.status(500).json({ error: 'שגיאה בעת שמירת ההערה' });
  }
});
//---------------------------------------------------------------------



// קביעת טרנספורטר לשליחת מיילים
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'elyasaf852@gmail.com',
//     pass: 'Aa135923',  // כדאי לשמור את הסיסמאות בסביבה מאובטחת
//   },
// });

// פונקציה לשליחת מייל למנהל
// const sendReminderEmail = (eventTitle, eventDate) => {
//   const mailOptions = {
//     from: 'ahdasa5340@gmail.com',
//     to: 'elyasaf852@gmail.com',  // המנהל
//     subject: `Reminder: Event Today - ${eventTitle}`,
//     text: `שלום! זהו תזכורת שיש לך אירוע היום, ${eventTitle}, בתאריך ${eventDate} בשעה 08:00 בבוקר.`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log('Error sending email:', error);
//     } else {
//       console.log('Email sent:', info.response);
//     }
//   });
// };

// תזמון שליחת תזכורת כל יום ב- 8:00 בבוקר
// cron.schedule('0 8 * * *', async () => {
//   const today = new Date().toISOString().split('T')[0];  // מקבלים את התאריך הנוכחי ב-YYYY-MM-DD
//   try {
//     const [orders] = await connection.query('SELECT * FROM orders');
//          // מסננים את ההזמנות שמתאימות לתאריך של היום
//     const todayOrders = orders.filter(order => order.event_date === today);

//     todayOrders.forEach(order => {
//       sendReminderEmail(order.title, order.event_date);  // שולחים את המייל
//     });
//   } catch (err) {
//     console.error('Error fetching orders for reminder email:', err);
//   }
// });
// const today = new Date().toISOString().split('T')[0]; // מקבל את התאריך היום ב-YYYY-MM-DD
// sendReminderEmail("Event Title", today); 

// cron.schedule('46 14 * * *', () => {
//   const today = new Date().toISOString().split('T')[0];
//   sendReminderEmail("Event Title", today);  // או כל שם אירוע שתרצה
// });




       /*OrdersOnline   דף הזמנות אונליין  צד לקוח  */
    
//  ---------הוספת הזמנה למאגר----------------------------
app.post('/addOrdersOnline', async (req, res) => {
  try {
      const { userName, userPhone, guestCount, eventDate, orderMenu, totalPrice, shippingDate } = req.body;
      const [result] = await connection.query(`
          INSERT INTO online_orders (user_name, user_phone, guest_count, event_date, order_menu, total_price, shipping_date)
          VALUES (?, ?, ?, ?, ?, ? , ?)
      `, [userName, userPhone, guestCount, eventDate,JSON.stringify(orderMenu), totalPrice, shippingDate]);
      console.log(result);
      
      res.status(201).json({ message: 'נשלח בהצלחה' });
  } catch (err) {
      console.error('שגיאה בשליחה הזמנות אונליין', err);
      return res.status(500).json({ error: 'בעיה בשליחת אונליין' });
  }
});


              
      /*OnlineOrdersSystem   דף הזמנות קבלת אונליין צד מנהל   */

//----------- לקבלת הזמנות אונליין למנהל------------------------------------------
app.get("/online_orders", async (req, res) => {
  try {
    const [orders] = await connection.query("SELECT * FROM online_orders");
    res.json(orders);
    
  } catch (err) {
    console.error("נכשל בשליפת נתונים מהמסד:", err);
    res.status(500).send("שגיאה בשליפת נתונים");
  }
})
 //---------------------סגירת הזמהת לקוח למערכת--------------------------------------------------          
app.post('/online_orders/add_customer_order', async (req, res) => {
  const { userName, userPhone, guestCount, eventDate, orderMenu, totalPrice } = req.body;
  try {
    // המרת התאריך לפורמט תואם MySQL
    const formattedEventDate = formatDateForMySQL(eventDate);
    const [existingUser] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [userPhone]);
    let userId;
    if (existingUser.length === 0) { // שהמשתמש לא קיים 
      const [newUser] = await connection.query(
        `INSERT INTO users (name, guest_count, event_date, phone) VALUES (?, ?, ?, ?)`,
        [userName, guestCount, formattedEventDate, userPhone]
      );
      userId = newUser.insertId;
    } else {
      userId = existingUser[0].id; //אם המשתמש קיים זה המזהה שלו 
    }
    // הוספת ההזמנה 
     await connection.query(
      `INSERT INTO orders (user_id, order_menu, guest_count, event_date, totalPrice) VALUES (?, ?, ?, ?, ?)`,
      [userId, orderMenu, guestCount, formattedEventDate, totalPrice]
    );
    res.status(200).send({ message: 'ההזמנה והמשתמש הוספו בהצלחה!' });
  } catch (error) {
    console.error("שגיאה בסגירת ההזמנה והוספת המשתמש:", error);
    res.status(500).send({ error: "שגיאה פנימית בשרת" });
  }
});
//-----------------מחיקת הזמנה מטבלת אונליין--------------------------------------------
app.delete('/online_orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.query(`DELETE FROM online_orders WHERE id = ?`, [id]);
    if (result.affectedRows > 0) {
      res.status(200).send({ message: 'ההזמנה נמחקה בהצלחה!' });
    } else {
      res.status(404).send({ error: 'ההזמנה לא נמצאה' });
    }
  } catch (error) {
    console.error("שגיאה במחיקת ההזמנה אונליין:", error);
    res.status(500).send({ error: "שגיאה פנימית בשרת" });
  }
});



             /* KitchenOrder  צד מנהל */

//-----------KitchenOrder  תצוגת ההזמנה ועריכה- -----------------------------------------------------------------
app.post('/KitchenOrder/addDish', async (req, res) => {
  const { dish_name, price, weight, category, user_id } = req.body;
  const newDish = {
    dish_name: dish_name,
    totalPrice: price,
    totalWeight: weight
  };
  try {
    // שליפת המידע הקיים בתפריט
    const [orderResult] = await connection.query('SELECT order_menu FROM orders WHERE user_id = ?', [user_id]);
    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let orderMenu = orderResult[0].order_menu; // התפריט של הלקוח
    const orderMenuJson = JSON.parse(orderMenu);// המרת התפריט כדי להכניס בבטחה
    orderMenuJson[category].push(newDish); // הוספת המנה לקטגוריה

    // להחזיר את התפריט עם המנה שהוספנו
    await connection.query('UPDATE orders SET order_menu = ? WHERE user_id = ?', [JSON.stringify(orderMenuJson), user_id]);
    res.status(200).json({ message: 'Dish added successfully!' });
  } catch (error) {
    console.error('Error adding dish to menu:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת הוספת המנה לתפריט' });
  }
});
//-----------מחיקת פריט מהתפריט---------------------------------------
app.delete('/KitchenOrder/deleteDish', async (req, res) => {
  const { dish_name , user_id } = req.body;
  try {
    const [orderResult] = await connection.query('SELECT order_menu FROM orders WHERE user_id = ?', [user_id]);
    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let orderMenu = orderResult[0].order_menu;
    const orderMenuJson = JSON.parse(orderMenu);
  
    for (let category in orderMenuJson) {  // מחיקת המנה מהקטגוריה המתאימה
      const updatedCategory = orderMenuJson[category].filter(dish => dish.dish_name !== dish_name);
      orderMenuJson[category] = updatedCategory;
    }
       // שמירת השינויים בבסיס הנתונים
    await connection.query('UPDATE orders SET order_menu = ? WHERE user_id = ?', [JSON.stringify(orderMenuJson), user_id]);
    res.status(200).json({ message: 'Dish deleted successfully!' });
  } catch (error) {
    console.error('Error deleting dish from menu:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת מחיקת המנה' });
  }
});
//----------------עידכון מנה קיימת--------------------------------------------------
app.put('/KitchenOrder/updateDish', async (req, res) => {
  const { dish_name, price, weight, user_id } = req.body;
  try {
    const [orderResult] = await connection.query('SELECT order_menu FROM orders WHERE user_id = ?', [user_id]); // שליפת המידע הקיים בתפריט
    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    let orderMenu = orderResult[0].order_menu;
    const orderMenuJson = JSON.parse(orderMenu);
   
    let dishUpdated = false; //  לוודא שהמנה נמצאה // עדכון המנה בתפריט
    for (let category in orderMenuJson) {  // מוצאים את המנה על פי שם המנה
      const dishIndex = orderMenuJson[category].findIndex(dish => dish.dish_name === dish_name);
      if (dishIndex !== -1) {  // עדכון המחיר והמשקל
        orderMenuJson[category][dishIndex].totalPrice = price;
        orderMenuJson[category][dishIndex].totalWeight = weight;
        dishUpdated = true;
        break;
      }
    }
    if (!dishUpdated) {
      return res.status(404).json({ message: 'Dish not found in menu' });
    }
    // שמירת השינויים בבסיס הנתונים
    await connection.query('UPDATE orders SET order_menu = ? WHERE user_id = ?', [JSON.stringify(orderMenuJson), user_id]);
    res.status(200).json({ message: 'Dish updated successfully!' });
  } catch (error) {
    console.error('Error updating dish in menu:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת עדכון המנה בתפריט' });
  }
});



            /*UserManagement  ניהול משתמשים  */
//------------------------------------------------------------------------------
app.get('/UserManagement', async  (req, res) => {
  try {
    const [orders] = await connection.query("SELECT * FROM users");
    res.json(orders);
    
  } catch (err) {
    console.error("נכשל בשליפת נתונים מהמסד:", err);
    res.status(500).send("שגיאה בשליפת נתונים");
  }
});
// ---------עריכת משתמש---------------------------------
app.put('/UserManagement/:id', async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const eventDate = new Date(updatedData.event_date);
  try {  // 1. בדוק אם המספר טלפון כבר קיים במסד נתונים
    const [existingUser] = await connection.query('SELECT * FROM users WHERE phone = ? AND id != ?', [updatedData.phone, id] );
    if (existingUser.length > 0) {
      return res.json({ message: 'המספר הזה כבר קיים במערכת עבור משתמש אחר' });
    }
    // 2. חפש את המשתמש הנוכחי לפני ביצוע השינויים כדי להשוות את תאריך האירוע
    const [currentUser] = await connection.query('SELECT event_date FROM users WHERE id = ?',[id] );
    if (currentUser.length === 0) {
      return res.json({ message: 'משתמש לא נמצא' });
    }
    const currentEventDate = currentUser[0].event_date;
    // 3. עדכון טבלת המשתמשים אם יש שינוי בפרטי המשתמש
    const [result] = await connection.query(
      'UPDATE users SET name = ?, phone = ?, event_date = ?, guest_count = ? WHERE id = ?',
      [updatedData.name, updatedData.phone, eventDate, updatedData.guest_count, id]
    );
    // 4. אם לא נמצא משתמש עם ה-ID הספציפי
    if (result.affectedRows === 0) {
      return res.json({ message: 'משתמש לא נמצא' });
    }
    // 5. אם תאריך האירוע שונה, עדכן גם את טבלת ההזמנות
    if (updatedData.event_date !== currentEventDate) {
      await connection.query( 'UPDATE orders SET event_date = ? WHERE user_id = ?', [eventDate, id]);  
    }
    res.json({ success: true, message: 'המשתמש עודכן בהצלחה' });
  } catch (err) {
    console.error("נכשל בשליפת נתונים מהמסד:", err);
    res.status(500).send("שגיאה בעדכון נתונים");
  }
});






              /* OrderManagement ניהול הזמנות */
// ---------------ניהול ההזמנות----------------------------------------
app.get('/OrderManagement', async (req, res) => {
  try {
    const [orders] = await connection.query(`
      SELECT 
        orders.user_id, 
        orders.guest_count, 
        orders.event_date, 
        orders.order_menu,-- הוספת שדה פריטי התפריט
         orders.totalPrice,   
        users.name AS owner_name, 
        users.phone AS owner_phone  -- הוספת שדה טלפון של בעל ההזמנה
      FROM orders 
      JOIN users ON orders.user_id = users.id
    `);
    res.json(orders);
  } catch (err) {
    console.error("נכשל בשליפת נתונים:", err);
    res.status(500).send("שגיאה בשליפת נתונים");
  }
});
//--------הבאת הזמנה מסויימת של לקוח------------------------------------------------------
app.get('/OrderManagement/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await connection.query( `SELECT * FROM orders WHERE user_id = ?`,[id]);
    if (results.length === 0) {
      return res.status(404).json({ message: "הזמנה לא נמצאה" });
    }
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ message: "שגיאה בשרת בעת הבאת נתוני ההזמנה" });
  }
});
//--------------עידכון ההזמנה והחישוב-----------------------------------------------------------
// עדכון הזמנה על פי ID של הזמנה ולקוח
app.put('/OrderManagement/UpdateOrder/:userId/:orderId', async (req, res) => {
  const { userId , orderId } = req.params; // (ID לקוח והזמנה)
  const { guest_count , order_menu } = req.body; // הנתונים החדשים (כמות מוזמנים ותפריט)
  try {
    // עדכון כמות המוזמנים בהזמנה
    await connection.query(
      'UPDATE orders SET guest_count = ? WHERE user_id = ? AND id = ?',
      [guest_count, userId, orderId]
    );
    await connection.query(
      'UPDATE orders SET order_menu = ? WHERE user_id = ? AND id = ?',
      [JSON.stringify(order_menu), userId, orderId]
    );
    res.json({ message: 'ההזמנה עודכנה בהצלחה' });
  } catch (err) {
    console.error("שגיאה בעדכון הזמנה:", err);
    res.status(500).send("שגיאה בעדכון הזמנה");
  }
});
// ----------- מחיקת הזמנה ומחיקת משתמש -----------------------------------
app.delete('/OrderManagement/DeleteOrder/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    // מחיקת ההזמנה מתוך טבלת ההזמנות
    const [orderResult] = await connection.query('SELECT * FROM orders WHERE user_id = ? ', [userId]);
    if (orderResult.length === 0) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }
    // מחיקת ההזמנה מתוך טבלת ההזמנות
    await connection.query('DELETE FROM orders WHERE user_id = ? ', [userId]);
    // מחיקת המשתמש מתוך טבלת המשתמשים
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    res.status(200).json({ message: 'ההזמנה והמשתמש נמחקו בהצלחה' });
  } catch (err) {
    console.error("שגיאה במחיקת ההזמנה או המשתמש:", err);
    res.status(500).send("שגיאה בשרת בעת מחיקת הנתונים");
  }
});
//-----------------------------------------------------------------------







        /*SystemManagerHone  דף הבית המנהל */
//-----------------------------------------------------------------------------
      app.get('/monthly-orders-summary', async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    // שאילתה: כמות הזמנות לכל חודש בשנה האחרונה
    const [monthlyOrders] = await connection.query(
      `SELECT MONTH(event_date) AS month, COUNT(*) AS order_count
       FROM orders
       WHERE YEAR(event_date) = ?
       GROUP BY MONTH(event_date)
       ORDER BY MONTH(event_date)`,
      [currentYear]
    ); // חישוב השינוי באחוזים בין כל חודש לחודש שעבר
    const monthlyChanges = monthlyOrders.map((current, index, array) => {
      if (index === 0) return { ...current, change: null }; // לא ניתן לחשב עבור החודש הראשון
      const lastMonth = array[index - 1].order_count; // כמות ההזמנות בחודש הקודם
      const change = lastMonth !== 0
        ? ((current.order_count - lastMonth) / lastMonth) * 100
        : 0;
      return { ...current, change };
    });
    res.json({
      monthlyOrders: monthlyChanges
    });
  } catch (err) {
    console.error('Error retrieving order stats:', err);
    res.status(500).send('Server error while retrieving order stats');
  }
});
//------------שאילתת כמות משתמשים-----------------------------------------------------------------  
app.get('/user-count', async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT COUNT(*) AS user_count FROM users');
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});
//-------------גרף אירועים לפי חודש -----------------------------------------------------------------------------
app.get('/monthly-orders', async (req, res) => {
  try {
    const currentDate = new Date(); // התאריך הנוכחי
    const currentMonth = currentDate.getMonth(); // החודש הנוכחי (0-11)
    const currentYear = currentDate.getFullYear(); // השנה הנוכחית
    const nextYear = currentYear + 1; // שנה קדימה
    // מחשבים את טווח התאריכים: החודש הנוכחי עד סוף השנה הבאה
    const startDate = new Date(currentYear, currentMonth, 1); // התחלת החודש הנוכחי
    const endDate = new Date(nextYear + 1, 0, 1); 
    // מבצעים את השאילתה ומחזירים את התוצאות
    const [results] = await connection.execute(`
      SELECT MONTH(event_date) AS month, COUNT(*) AS order_count 
      FROM orders 
      WHERE event_date >= ? AND event_date < ?
      GROUP BY MONTH(event_date)
    `, [startDate, endDate]);  // מכינים מערך של חודשים מסודרים
    const ordersPerMonth = Array.from({ length: 24 }, (_, i) => {
      const month = (currentMonth + i) % 12; // כל חודש לפי סדר
      const year = currentYear + Math.floor((currentMonth + i) / 12); // בודק את השנה הנכונה
      const orderCount = results.find(r => r.month === month + 1)?.order_count || 0; // אם אין תוצאה אז 0
      return { month: month + 1, year, order_count: orderCount };
    });
    res.json(ordersPerMonth);
  } catch (err) {
    res.status(500).send(err);
  }
});
//----------- אירועים לפי שבוע-----------------------------------------------------------------------------
app.get('/weekly-events', async (req, res) => {
  try {   // קביעת התאריך העברי הנוכחי
    const todayHebrew = moment().locale('he'); // תאריך עברי נוכחי
    const startOfWeekHebrew = todayHebrew.clone().startOf('week'); // תחילת השבוע העברי
    const endOfWeekHebrew = todayHebrew.clone().endOf('week'); // סיום השבוע העברי
    // המרת תחילת וסיום השבוע העברי לתאריכים גרגוריאניים
    const startOfWeekGrigorian = startOfWeekHebrew.format('YYYY-MM-DD'); // תאריך גרגוריאני של תחילת השבוע
    const endOfWeekGrigorian = endOfWeekHebrew.format('YYYY-MM-DD'); // תאריך גרגוריאני של סוף השבוע
    console.log('Start of Week Gregorian:', startOfWeekGrigorian);
    console.log('End of Week Gregorian:', endOfWeekGrigorian);
    // ביצוע שאילתה להחזרת אירועים מהשבוע הנוכחי
    const [results] = await connection.execute(`
      SELECT u.name AS name, u.phone, e.event_date
      FROM users u
      JOIN orders e ON u.id = e.user_id
      WHERE e.event_date >= ? AND e.event_date <= ?
      ORDER BY e.event_date
    `, [startOfWeekGrigorian, endOfWeekGrigorian]);
    res.json(results); // החזרת התוצאות
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send(err);
  }
});
//-----------שאילתת כמות אירועים שלא אושרו--------------------------------------------------------
app.get('/events-pending', async (req, res) => {
  try {
    const [results] = await connection.execute(`
      SELECT COUNT(*) AS count  FROM online_orders`);
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});
//-----------------------------------------------------------







       /*Contact , יצירת קשר עם המנהל  */
//---------------------------------------------------------------------------
app.post('/contact', async (req, res) => {
  const { fullName, phone, message } = req.body;

  if (!fullName || !phone || !message) {  // בדיקת אם כל השדות מלאים
    return res.status(400).json({ message: 'נא למלא את כל השדות!' });
  } // יצירת התאריך הנוכחי
   const currentDate = new Date();
  const sql = 'INSERT INTO contact (full_name, phone, message, created_at) VALUES (?, ?, ? , ?)'; // הכנת השאילתה להוספת נתונים לטבלה contact_us
  try {   // ביצוע השאילתה
    const [results] = await connection.execute(sql, [fullName, phone, message, currentDate]);
    res.status(200).json({ message: 'הודעה נשמרה בהצלחה!' });
  } catch (err) {
    console.error('שגיאה בשמירת הנתונים:', err);
    res.status(500).json({ message: 'שגיאה בשמירת ההודעה' });
  }
});
//------------- קבלת הודעות למנהל-------------------------------------------
app.get('/getMessages', async (req, res) => {
  try {
    const [messages] = await connection.execute('SELECT * FROM contact');
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------מחיקת ההודעות במנהל--------------------------------------------------
app.delete('/deleteMessage/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await connection.execute('DELETE FROM contact WHERE id = ?', [id]);
    res.status(200).send('ההודעה נמחקה');
  } catch (err) {
    res.status(500).send(err);
  }
});
//---------------------------------------------------------------------------











  app.listen(3001, () => {
    console.log("Server started on port 3001");
  });
};

startServer();
