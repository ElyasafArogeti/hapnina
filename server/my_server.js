const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const moment = require('moment'); // לעבודה עם תאריכים
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);


require('dotenv').config(); 

app.use(cors({
  origin: [
    "https://cateringhapnina.netlify.app",
    "https://cateringhapnina.co.il",   // הדומיין החדש שלך
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


console.log("🚀 שרת עלה! (נבדק פריסה חדשה)");


const useLocalDB = process.env.USE_LOCAL_DB === 'true'; // שרת רלוואי כ- נכון מקומי - לא נכון

const DB_URL = useLocalDB ? process.env.LOCAL_DB_URL : process.env.DB_URL;

const JWT_SECRET = process.env.JWT_SECRET;

if (!DB_URL) {
  console.error("❌ שגיאה: לא הוגדר DB_URL או LOCAL_DB_URL לפי USE_LOCAL_DB");
  process.exit(1); // עוצר את הריצה כדי שלא תמשיך בלי חיבור DB
}

console.log("🔌 חיבור למסד הנתונים:", DB_URL?.includes('localhost') ? "לוקלי" : "Railway");


let connection;



    const managers = [// רשימת המנהלים
  {
    email: "ely6600200@gmail.com",
    userName: "אלי ארוגטי",
    password: bcrypt.hashSync("1234", 10), // סיסמה מוצפנת
  },];
 const isManager = (userName) => managers.some((m) => m.userName === userName);



 
const startServer = async () => {

try {
  const pool = mysql.createPool({
    uri: DB_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  connection = pool; // 🪄 שומר את אותו שם כמו קודם
  app.locals.db = pool;

  console.log("✅ ⭕ Connected to the database!");

  // 🧪 בדיקה
  const [rows] = await connection.query('SELECT 1 + 1 AS solution');
  console.log("🔍 בדיקת חיבור למסד: ", rows[0].solution); // צריך להחזיר 2

  if (!DB_URL) {
    throw new Error("Missing database URL");
  }
} catch (error) {
  console.error("❌ Error connecting to the database:", error.message);
  setTimeout(startServer, 5000); // מנסה להתחבר שוב אחרי 5 שניות במקרה של כשלון
}

const testConnection = async () => {
  try {
    const [rows] = await app.locals.db.query('SELECT 1 + 1 AS solution');
    console.log('Database connection successful: ', rows[0].solution); // צריך להחזיר 2
  } catch (err) {
    console.error('Error testing database connection:', err.message);
  }
};

testConnection();





  

//MySQL פונקציה להמרת התאריך לפורמט של ---------------------------------------------------
const formatDateForMySQL = (isoDate) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
//-----------------------------------------------------------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // בדיקת קיום טוקן
  if (!token) {
    console.log("❌ שגיאה: לא סופק טוקן");
    return res.status(401).json({ message: "הגישה נדחתה, לא סופק אסימון." });
  }

  // בדיקת תקינות בסיסית של מבנה JWT (שלושה חלקים מופרדים בנקודות)
  if (token.split(".").length !== 3) {
    console.log("❌ טוקן לא תקני:", token);
    return res.status(400).json({ message: "טוקן לא תקני." });
  }


  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ שגיאה באימות טוקן:", err.message);
    return res.status(403).json({ message: "טוקן שגוי או פג תוקף." });
  }
};


//---------------------------------------------------------------------------
// נתיב אימות טוקן
app.post("/api/verifyToken", authenticateToken , (req, res) => { // אם הטוקן תקין, יש לשלוח את המידע על המשתמש
  res.status(200).json({
    message: "Token is valid",
    user: req.user,   // שולחים את המידע שהופק מהטוקן
  });
});


  //--------------בקשת כל הקטגוריות ------------------------------------------
  app.get("/api/inventoryAll", async (req, res) => {
    try {
     
      const [firstCourses] = await connection.query("SELECT * FROM first_courses");
      const [mainCourses] = await connection.query("SELECT * FROM main_courses");
      const [salads] = await connection.query("SELECT * FROM salads");
      const [sideDishes] = await connection.query("SELECT * FROM side_dishes");
      
  
      res.json({
        first_courses: firstCourses,
        main_courses: mainCourses,
        salads: salads,
        side_dishes: sideDishes,
      });
    } catch (err) {
      console.error("Failed to fetch data from database:", err);
      res.status(500).json("Error fetching data");
    }
  });
  



//-----------התחברות אזור אישי----------------------------------------------------------------
app.post("/api/login", async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ error: "אנא ספק את שם המשתמש והסיסמה בצורה תקינה." });
  }
  // בדיקה אם המשתמש הוא מנהל
  if (isManager(userName)) {
    const manager = managers.find((m) => m.userName === userName);
    // בדיקת סיסמה
    const passwordMatch = bcrypt.compareSync(password, manager.password);
    if (!passwordMatch) {
      console.log("Incorrect manager password.");
      return res.status(401).json({ error: "שם משתמש או סיסמה שגויים." });
    }
    const token = jwt.sign({ userName, role: "manager" }, JWT_SECRET, { expiresIn: "1h" });
    return res.status(200).json({
      message: `שלום ${userName}, המנהל הינך עובר למערכת הניהול שלך`,
      token,
      role: "manager",
    });
  }
  try {  // חיפוש משתמש רגיל בבסיס נתונים
    const [rows] = await connection.query("SELECT * FROM users WHERE name = ?", [userName]);
    const user = rows[0]; 
    if (!user) {
      console.log("User not found.");
      return res.status(401).json({ error: "שם משתמש או סיסמה שגוייה." });
    }
    // בדיקת סיסמה
    const passwordMatch = bcrypt.compareSync(password, user.password); 
    if (!passwordMatch) {
      return res.status(401).json({ error: "שם משתמש או סיסמה שגוי." });
    }
    const token = jwt.sign({ userName, role: "user" }, JWT_SECRET, { expiresIn: "1h" });  
   return res.status(200).json({
      message: `שלום ${userName}, ברוך הבא לאזור האישי שלך`,
      token,
      role: "user",
    });
  } catch (err) {
    console.error("Error during user authentication:", err);
    res.status(500).json({ error: "שגיאה בשרת. אנא נסה שוב מאוחר יותר." });
  }
});

//------------נתיב לשליפת הזמנות לפי משתמש --------------------------------------------------------------------
app.get("/api/OrderPersonalArea", async (req, res) => {

  const token = req.headers.authorization?.split(" ")[1]; // שליפה של ה-token מה-header
  if (!token) {
    return res.status(403).json({ error: "אין טוקן, גישה לא מורשית." });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET); // בדיקה אם ה-token חוקי
    const { userName } = decoded; // שליפה של שם המשתמש מה-token

    const [userRows] = await connection.query("SELECT * FROM users WHERE name = ?", [userName]);
    const user = userRows[0];
    if (!user) {
      return res.status(404).json({ error: "לא נמצא משתמש עם שם זה." });
    }
    // חיפוש הזמנות עבור המשתמש
    const [orders] = await connection.query("SELECT * FROM orders WHERE user_id = ?", [user.id]);
    res.status(200).json({ orders, userName });
  } catch (err) {
    console.error("Error verifying token:", err);
    res.status(401).json({ error: "ה-token לא תקין או פג תוקף." });
  }
});

//--------------------רישום לאתר אזור אישי --------------------------------------------------------------------
// רישום סיסמה לאזור האישי
app.post("/api/registerPersonalArea", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "יש למלא מייל וסיסמה." });
  }

  try {
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: "משתמש לא נמצא במערכת." });
    }

    // יצירת hash של הסיסמה
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // עדכון הסיסמה המוצפנת במסד
    await connection.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    return res.status(200).json({ success: true, message: "ההרשמה בוצעה בהצלחה!" });

  } catch (err) {
    console.error("Error during registerPersonalArea:", err);
    res.status(500).json({ success: false, error: "שגיאת שרת. אנא נסה שוב מאוחר יותר." });
  }
});





            /*inventory   דף ניהול תפריט מורחב*/

  //------- הוספת מנה חדשה----------------------------------------------
  app.post("/api/addNewDish", authenticateToken , async (req, res) => {
    const { dish_name, price, weight, category } = req.body;
    try {
      if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      } 
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
  app.put("/api/updateDish/:id", authenticateToken ,async (req, res) => {
    const { id } = req.params;
    const { dish_name, price, weight, category } = req.body;
    try {
      if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      } 
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
  app.delete("/api/deleteDish/:id",authenticateToken , async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;
    try {
      if (req.user.role !== "manager") {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      } 
      await connection.query(`DELETE FROM ${category} WHERE id = ?`, [id]);
      res.send("Dish deleted successfully");
    } catch (err) {
      console.error("Failed to delete data from database:", err);
      res.status(500).send("Error deleting data");
    }
  });
  // ----------הסתר מנה ----------------------------------------------
app.put('/api/hideDish/:id',authenticateToken , async (req, res) => {// טיפול בהסתרה והחזרת מנה למסד הנתונים
  const { id } = req.params;
  const { hidden , category } = req.body;
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    } 
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
  app.post("/api/orders",authenticateToken , async (req, res) => {
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
  app.post("/api/users" ,authenticateToken , async (req, res) => {
    const { user_id, eventOwner, guestCount, eventDate,password ,email} = req.body;
    try { 
      const role = "user";
      const hashedPassword = bcrypt.hashSync(password, 10);                 
      const [existingUser] = await connection.query( "SELECT * FROM users WHERE phone = ?",  [user_id]);  
      let newUserId;
      if (existingUser.length > 0) {        // אם המשתמש קיים השתמש במזהה שלו ולא להוסיף אותו לטבלה 
        newUserId = existingUser[0].id;
      } else {                           // הוסף משתמש חדש אם הוא לא קיים
        const [result] = await connection.query("INSERT INTO users ( name, guest_count, event_date ,phone ,email,role, password) VALUES (?,?, ?, ?,?,?,?)",
          [eventOwner, guestCount, eventDate, user_id , email ,role, hashedPassword]
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
  app.get("/api/orders_calendar", authenticateToken , async (req, res) => {
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
app.get("/api/user_calendar/:id", authenticateToken , async (req, res) => {
  const { id } = req.params;
  try {  
    if (req.user.role !== "manager") {   
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    } 
    const [orders_user] = await connection.query("SELECT * FROM orders WHERE user_id = ?", [id]);
    const [user_name] = await connection.query("SELECT name FROM users WHERE id = ?", [id]);
    const [phone] = await connection.query("SELECT phone FROM users WHERE id = ?", [id]);
    const [totalPrice] = await connection.query("SELECT totalPrice FROM orders WHERE user_id = ?", [id]);
    const [email] = await connection.query("SELECT email FROM users WHERE id = ?", [id]);
    if (orders_user.length > 0 && user_name.length > 0) {
      res.json({
        orders_user: orders_user,  // כל ההזמנות של המשתמש
        user_name: user_name[0].name,  // שם המשתמש
        phone_number: phone[0].phone,
        totalPrice: totalPrice[0].totalPrice,
        email: email[0].email
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
 app.post('/api/save-note/:orderId/:notes', authenticateToken , async (req, res) => { 
  const orderId = req.params.orderId;
  const note = req.params.notes;  // ההערה ששלח הלקוח
  // פרוק ה- orderId לשני חלקים
  const [customerId, orderIdValue] = orderId.split('-');
  try {
    if (req.user.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    } 

    // חיפוש הזמנה לפי הלקוח ומזהה ההזמנה
    const [rows] = await connection.query('SELECT * FROM orders WHERE user_id = ? AND id = ?', [customerId, orderIdValue]); 

    if (rows.length === 0) {
      // אם לא נמצאה הזמנה
      return res.status(404).json({ error: 'לא נמצא אירוע בתאריך זה' });
    }

    if (note === "null" || note.trim() === "") { 
      await connection.query('UPDATE orders SET notes = null WHERE user_id = ? AND id = ?', [customerId, orderIdValue]);
      return res.status(200).json({ message: 'ההערה נמחקה בהצלחה' });
    } else {  // אם יש הערה, נעדכן אותה בטבלה
      await connection.query('UPDATE orders SET notes = ? WHERE user_id = ? AND id = ?', [note, customerId, orderIdValue]);
      res.status(200).json({ message: 'ההערה נשמרה בהצלחה' });
    }
  } catch (error) {
    console.error('שגיאה בשרת:', error);
    res.status(500).json({ error: 'שגיאה בעת שמירת ההערה' });
  }
});
//---------------------------------------------------------------------





       /*OrdersOnline   דף הזמנות אונליין  צד לקוח  */

//  --------- סגירת הזמנה למערכת----------------------------
app.post('/api/addOrdersOnline', async (req, res) => {
  try {
    const {
      userName, userPhone, guestCount, eventDate, orderMenu,
      totalPrice, shippingDate, email, event_location, address,
      shippingCost, serviceCost, toolsType, eventType
    } = req.body;

    await connection.query(`
      INSERT INTO online_orders (
        user_name, userPhone, guest_count, event_date,
        order_menu, total_price,shipping_date, email,
        event_location, address, shipping_cost, service_cost, tools_type, event_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      userName, userPhone, guestCount, eventDate,
      JSON.stringify(orderMenu), totalPrice, shippingDate, email,
      event_location, address, shippingCost, serviceCost, toolsType, eventType
    ]);

    // שליחת מיילים ברקע
    (async () => {
      try {
        const templatePath = path.join(__dirname, 'templates', 'orderEmailTemplate.html');
        let emailTemplate = fs.readFileSync(templatePath, 'utf8');

        const orderMenuContent = Object.keys(orderMenu).map((category) => {
          return `
            <h4 style="font-size: 22px; text-align: center;">${category === 'salads' ? 'סלטים' :
          category === 'first_courses' ? 'מנות ראשונות' :
          category === 'main_courses' ? 'מנות עיקריות' : 'תוספות'}</h4>
            <table class="table">
              <thead><tr><th>שם המנה</th></tr></thead>
              <tbody>
                ${orderMenu[category].map((item) => `
                  <tr><td>${item.dish_name}</td></tr>
                `).join('')}
              </tbody>
            </table>
          `;
        }).join('');

        emailTemplate = emailTemplate
          .replace('{{orderMenuContent}}', orderMenuContent)
          .replace('{{userName}}', userName)
          .replace('{{eventDate}}', eventDate)
          .replace('{{guestCount}}', guestCount)
          .replace('{{totalPrice}}', totalPrice)
          .replace('{{shippingCost}}', shippingCost)
          .replace('{{serviceCost}}', serviceCost)
          .replace('{{toolsType}}', toolsType);

        // מייל ללקוח
        await resend.emails.send({
          from: 'קייטרינג הפנינה <info@cateringhapnina.co.il>',
          to: email,
          subject: 'הזמנתך התקבלה בהצלחה',
          html: emailTemplate,
        });

        // מייל למנהל
        await resend.emails.send({
           from: 'קייטרינג הפנינה <info@cateringhapnina.co.il>',
          to: 'elyasaf852@gmail.com',
          subject: 'התקבלה הזמנה חדשה באתר',
          html: `
            <h2>התקבלה הזמנה חדשה באתר</h2>
            <p>שם הלקוח: ${userName}</p>
            <p>טלפון: ${userPhone}</p>
            <p>תאריך האירוע: ${eventDate}</p>
            <p>סכום כולל: ₪${totalPrice}</p>
          `
        });

        console.log('✔ המיילים נשלחו בהצלחה דרך Resend');

      } catch (mailErr) {
        console.error('❌ שגיאה בשליחת המיילים דרך Resend:', mailErr);
      }
    })();

    await new Promise(resolve => setTimeout(resolve, 4000));
    res.status(200).json({ message: 'נשלח בהצלחה' });

  } catch (err) {
    console.error('❌ שגיאה בשליחה הזמנות אונליין', err);
    res.status(500).json({ error: 'בעיה בשליחת ההזמנה או המיילים' });
  }
});


         



      /*OnlineOrdersSystem   דף הזמנות קבלת אונליין צד מנהל   */

//----------- לקבלת הזמנות אונליין למנהל------------------------------------------
app.get("/api/online_orders",authenticateToken , async (req, res) => {
  try {
    const [orders] = await connection.query("SELECT * FROM online_orders");
    res.json(orders);
  } catch (err) {
    console.error("נכשל בשליפת נתונים מהמסד:", err);
    res.status(500).send("שגיאה בשליפת נתונים");
  }
})
 //---------------------סגירת הזמהת מנהל למערכת--------------------------------------------------          
app.post('/api/online_orders/add_customer_order', authenticateToken , async (req, res) => {
 const { 
  userName, userPhone, guestCount, eventDate, orderMenu, totalPrice, email, password, event_location, address,  
  shippingCost, serviceCost, toolsType ,eventType
} = req.body;


  try {   // המרת התאריך לפורמט תואם MySQL
    const formattedEventDate = formatDateForMySQL(eventDate);
    // בודקים אם יש משתמש קיים לפי מספר הטלפון
    const [existingUser] = await connection.query(`SELECT * FROM users WHERE phone = ?`, [userPhone]);
    let userId;
    if (existingUser.length === 0) { // אין משתמש כזה
      const [newUser] = await connection.query(
        `INSERT INTO users (name, guest_count, event_date, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)`,
        [userName, guestCount, formattedEventDate, userPhone, email, password] // שמירה עם הסיסמה המוצפנת
      );
      userId = newUser.insertId;
    } else {
      userId = existingUser[0].id; // אם המשתמש קיים, ניקח את המזהה שלו
    }
    // הוספת ההזמנה לאחר יצירת או עדכון המשתמש
   await connection.query(
  `INSERT INTO orders 
  (user_id, order_menu, guest_count, event_date, totalPrice,event_type, event_location, address, shipping_cost, service_cost, tools_type) 
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [userId, orderMenu, guestCount, formattedEventDate, totalPrice,eventType, event_location, address, shippingCost, serviceCost, toolsType]
);

    res.status(200).send({ message: 'ההזמנה והמשתמש הוספו בהצלחה!' });
  } catch (error) {
    console.error("שגיאה בסגירת ההזמנה והוספת המשתמש:", error);
    res.status(500).send({ error: "שגיאה פנימית בשרת" });
  }
});
//-----------------מחיקת הזמנה מטבלת אונליין--------------------------------------------
app.delete('/api/online_orders/:id',authenticateToken, async (req, res) => {
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
app.post('/api/KitchenOrder/addDish',authenticateToken, async (req, res) => {
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
app.delete('/api/KitchenOrder/deleteDish',authenticateToken, async (req, res) => {
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
app.put('/api/KitchenOrder/updateDish',authenticateToken, async (req, res) => {
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
// עדכון פרטים כלליים של ההזמנה לפי user_id
app.put('/api/KitchenOrder/updateOrderDetails', authenticateToken, async (req, res) => {
  const { user_id, shippingCost, serviceCost, toolsType, totalPrice } = req.body;
   console.log(user_id);

  try {
    // בדיקה שהמשתמש קיים
    const [orderResult] = await connection.query('SELECT * FROM orders WHERE user_id = ?', [user_id]);
    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'הזמנה לא נמצאה עבור המשתמש הזה' });
    }

    // בניית שאילתה דינמית רק עם הערכים שנשלחו
    const fieldsToUpdate = [];
    const values = [];

    if (shippingCost !== undefined) {
      fieldsToUpdate.push('shipping_cost = ?');
      values.push(shippingCost);
    }

    if (serviceCost !== undefined) {
      fieldsToUpdate.push('service_cost = ?');
      values.push(serviceCost);
    }

    if (toolsType !== undefined) {
      fieldsToUpdate.push('tools_type = ?');
      values.push(toolsType);
    }

    if (totalPrice !== undefined) {
      fieldsToUpdate.push('totalPrice = ?'); // נשאר כמו שהיה כי זה כבר תואם
      values.push(totalPrice);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'לא נשלחו שדות לעדכון' });
    }

    // ביצוע העדכון
    const query = `UPDATE orders SET ${fieldsToUpdate.join(', ')} WHERE user_id = ?`;
    values.push(user_id);
    await connection.query(query, values);

    res.status(200).json({ message: 'ההזמנה עודכנה בהצלחה' });
  } catch (error) {
    console.error('שגיאה בעת עדכון ההזמנה:', error);
    res.status(500).json({ message: 'שגיאה בשרת בעת עדכון ההזמנה' });
  }
});









            /*UserManagement  ניהול משתמשים  */
//------------------------------------------------------------------------------
app.get('/api/UserManagement', authenticateToken, async  (req, res) => {
  try {
    const [orders] = await connection.query("SELECT * FROM users");
    res.json(orders);
    
  } catch (err) {
    console.error("נכשל בשליפת נתונים מהמסד:", err);
    res.status(500).send("שגיאה בשליפת נתונים");
  }
});
// ---------עריכת משתמש---------------------------------
app.put('/api/UserManagement/:id', authenticateToken, async (req, res) => {
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
      'UPDATE users SET name = ?, phone = ?, email = ?, event_date = ?, guest_count = ? WHERE id = ?',
      [updatedData.name, updatedData.phone, updatedData.email, eventDate, updatedData.guest_count, id]
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
//---------------מחיקת משתמש--------------------------------------------------
app.delete('/api/UserManagement/DeleteUser/:userId', authenticateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    // חיפוש המשתמש בטבלת המשתמשים
    const [userResult] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (userResult.length === 0) {
      return res.status(404).json({ message: "המשתמש לא נמצא" });
    }
    // מחיקת המשתמש מתוך טבלת המשתמשים
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);
    // החזרת תשובה חיובית אם המשתמש נמחק בהצלחה
    res.status(200).json({ message: 'המשתמש נמחק בהצלחה' });
  } catch (err) {
    console.error("שגיאה במחיקת המשתמש:", err);
    res.status(500).send("שגיאה בשרת בעת מחיקת המשתמש");
  }
});





              /* OrderManagement ניהול הזמנות */
// ---------------ניהול ההזמנות----------------------------------------
app.get('/api/OrderManagement',authenticateToken,  async (req, res) => {
  try {
    const [orders] = await connection.query(`
      SELECT 
        orders.user_id, 
        orders.guest_count, 
        orders.event_date, 
        orders.order_menu,-- הוספת שדה פריטי התפריט
        orders.totalPrice,   
        orders.event_location,
        orders.address,
        orders.shipping_cost,
        orders.service_cost,
        orders.tools_type,
        users.name AS owner_name, 
        users.phone AS owner_phone , -- הוספת שדה טלפון של בעל ההזמנה
        users.email AS owner_email -- הוספת שדה דוא"ל של בעל ההזמנה

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
app.get('/api/OrderManagement/users/:id',authenticateToken, async (req, res) => {
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
app.put('/api/OrderManagement/UpdateOrder/:userId/:orderId',authenticateToken, async (req, res) => {
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
      // עדכון כמות המוזמנים בטבלת הלקוחות
      await connection.query(
        'UPDATE users SET guest_count = ? WHERE id = ?',
        [guest_count, userId]
      );
    res.json({ message: 'ההזמנה עודכנה בהצלחה' });
  } catch (err) {
    console.error("שגיאה בעדכון הזמנה:", err);
    res.status(500).send("שגיאה בעדכון הזמנה");
  }
});
// ----------- מחיקת הזמנה ומחיקת משתמש -----------------------------------
app.delete('/api/OrderManagement/DeleteOrder/:userId', authenticateToken,async (req, res) => {
  const { userId } = req.params;
  try {
    // מחיקת ההזמנה מתוך טבלת ההזמנות
    const [orderResult] = await connection.query('SELECT * FROM orders WHERE user_id = ? ', [userId]);
    if (orderResult.length === 0) {
      return res.status(404).json({ message: "ההזמנה לא נמצאה" });
    }
    // מחיקת ההזמנה מתוך טבלת ההזמנות
    await connection.query('DELETE FROM orders WHERE user_id = ? ', [userId]);
    res.status(200).json({ message: 'ההזמנה והמשתמש נמחקו בהצלחה' });
  } catch (err) {
    console.error("שגיאה במחיקת ההזמנה או המשתמש:", err);
    res.status(500).send("שגיאה בשרת בעת מחיקת הנתונים");
  }
});
//-----------------------------------------------------------------------







        /*SystemManagerHone  דף הבית המנהל */
//-----------------------------------------------------------------------------
      app.get('/api/monthly-orders-summary',authenticateToken, async (req, res) => {
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
app.get('/api/user-count',authenticateToken, async (req, res) => {
  try {
    const [results] = await connection.execute('SELECT COUNT(*) AS user_count FROM users');
    res.json(results[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});
//-------------גרף אירועים לפי חודש -----------------------------------------------------------------------------
app.get('/api/monthly-orders',authenticateToken, async (req, res) => {
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
app.get('/api/weekly-events',authenticateToken, async (req, res) => {
  try {   // קביעת התאריך העברי הנוכחי
    const todayHebrew = moment().locale('he'); // תאריך עברי נוכחי
    const startOfWeekHebrew = todayHebrew.clone().startOf('week'); // תחילת השבוע העברי
    const endOfWeekHebrew = todayHebrew.clone().endOf('week'); // סיום השבוע העברי
    // המרת תחילת וסיום השבוע העברי לתאריכים גרגוריאניים
    const startOfWeekGrigorian = startOfWeekHebrew.format('YYYY-MM-DD'); // תאריך גרגוריאני של תחילת השבוע
    const endOfWeekGrigorian = endOfWeekHebrew.format('YYYY-MM-DD'); // תאריך גרגוריאני של סוף השבוע
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
app.get('/api/events-pending',authenticateToken, async (req, res) => {
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
app.post('/api/contact', async (req, res) => {
  console.log("הגעתי לפנייה ");
  
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
app.get('/api/getMessages',authenticateToken, async (req, res) => {
  try {
    const [messages] = await connection.execute('SELECT * FROM contact');
    res.json(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});
//------------------מחיקת ההודעות במנהל--------------------------------------------------
app.delete('/api/deleteMessage/:id',authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    await connection.execute('DELETE FROM contact WHERE id = ?', [id]);
    res.status(200).send('ההודעה נמחקה');
  } catch (err) {
    res.status(500).send(err);
  }
});






//------------שיחזור סיסמא ללקוח בכניסה---------------------------------------------------------------
// שלב 1: שליחת קוד אימות למייל
app.post("/api/forgotPassword", async (req, res) => {
  const { email } = req.body;
  console.log("שרת עובד בשליחת קוד אימות");
  
  try { // חיפוש משתמש לפי המייל
    const [user] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);
     if (user.length === 0) {      // אם לא נמצא משתמש
      return res.status(404).json({ success: false, message: "משתמש לא נמצא." });
    }
    // יצירת קוד אימות אקראי
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    // עדכון קוד האימות במסד הנתונים
    await connection.execute("UPDATE users SET password = ? WHERE email = ?", [verificationCode, email]);
    // שליחת המייל עם הקוד
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "hpnina6600200@gmail.com",  // כתובת המייל שלך
        pass: "ycxt oeyj ojha xvyt",   
      },
    });
    const mailOptions = {
      from: "hpnina6600200@gmail.com",  // כתובת המייל ששולחת
      to: email,       // המייל של המשתמש
      subject: "קוד לשחזור סיסמה",
      text: `הקוד לשחזור הסיסמה שלך הוא: ${verificationCode}`,
    };
    // שליחת המייל
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ success: false, message: "בעיה בשליחת המייל." });
      }
        res.json({ success: true, message: "קוד לשחזור נשלח בהצלחה." });
    });
  } catch (err) {
    console.error(err);  // הדפסת שגיאה לקונסול אם יש בעיות
    return res.status(500).json({ success: false, message: "שגיאה בתהליך." });
  }});
//-------------------------------------------------------------------------------
// שלב 2: אימות קוד לשחזור סיסמה
app.post("/api/verifyCode", async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const [verifyCodeUser] = await connection.query("SELECT password FROM users WHERE email = ?", [email]);
    // אם לא נמצא משתמש עם המייל, יש להחזיר שגיאה
    if (verifyCodeUser.length === 0) {
      return res.status(400).json({ success: false, message: "קוד אימות לא תקין" });
    }
    // בדיקת קוד האימות
    if (verifyCodeUser[0].password === verificationCode) {
      return res.status(200).json({ success: true, message: "קוד אימות תקין" });
    } else {
      return res.status(400).json({ success: false, message: "קוד אימות לא תקין" });
    }
  } catch (err) {
    console.error("Error during code verification:", err);
    return res.status(500).json({ success: false, message: "שגיאה בתהליך האימות." });
  }
});
//-------------שלב 3 סיסמה חדשה ללקוח --------------------------------------------------
app.post("/api/changePassword", async (req, res) => {
  const { email, newPassword } = req.body;
  try {// חיפוש המשתמש לפי המייל
    const [results] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) { // אם לא נמצא משתמש עם המייל
      return res.status(400).json({ success: false, message: "המשתמש לא נמצא." });
    }
    // הצפנת הסיסמה החדשה
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    // עדכון הסיסמה החדשה
    await connection.query("UPDATE users SET Password = ? WHERE email = ?", [hashedPassword, email]);
    // שליחת תגובה עם הצלחה
    res.json({ success: true, message: "הסיסמה שונתה בהצלחה." });
  } catch (err) {
    console.error(err);  
    return res.status(500).json({ success: false, message: "שגיאה בעדכון הסיסמה." });
  }
});
//-----------------------------------------------------------------------------





        /* מיילים ללקוח והמטבח */
//--------------מייל ללקוח -------------------------------------------------------------       

app.post('/api/sendOrderToCustomer', async (req, res) => {
  const { customerEmail, orderHTML } = req.body;

  try {
    await resend.emails.send({
      from: 'קייטרינג הפנינה <info@cateringhapnina.co.il>',
      to: customerEmail,
      subject: 'סיכום הזמנתך מקייטרינג הפנינה',
      html: orderHTML,
    });

    res.status(200).send('ההזמנה נשלחה בהצלחה ללקוח!');
  } catch (error) {
    console.error('שגיאה בשליחת מייל ללקוח:', error);
    res.status(500).send('שגיאה בשליחת מייל ללקוח');
  }
});
//-----------------מייל למטבח ----------------------------------------------
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });  // הגדרת מקלט הקבצים (בכדי לשמור את הקבצים שהלקוח שולח)

app.post('/api/sendOrderToKitchen', upload.single('file'), async (req, res) => {
  const { recipient, message } = req.body;
  const file = req.file;

  try {
    const pdfData = fs.readFileSync(file.path).toString('base64');

    await resend.emails.send({
     from: 'קייטרינג הפנינה <info@cateringhapnina.co.il>',
      to: recipient,
      subject: 'סיכום הזמנה למטבח',
      text: `הזמנה מצורפת כקובץ PDF.\n\nהערת מנהל:\n${message}`,
      attachments: [
        {
          filename: file.originalname,
          content: pdfData,
          contentType: 'application/pdf',
        }
      ]
    });

    // מחיקת הקובץ מהשרת
    fs.unlinkSync(file.path);

    res.status(200).send('ההזמנה נשלחה בהצלחה למטבח!');
  } catch (error) {
    console.error('שגיאה בשליחת מייל למטבח:', error);
    res.status(500).send('שגיאה בשליחת מייל למטבח');
  }
});








        /*Cloudinary  שירות התמונות */

//--------Cloudinary---התחברות לענן אחסון התמונות ---------------------------------------------------
const multerImg = require('multer');
const imageUpload = multerImg({ storage: multer.memoryStorage() }); // מאחסן את הקובץ בזיכרון

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dhkegagjk',  // הכנס את שם הענן שלך מ-Cloudinary
    api_key: '489637112758284', // הכנס את ה-API Key שלך
    api_secret: '7ujnK9T1z-eHo69CcCYdbp5PUZE' // הכנס את ה-API Secret שלך
});

//--------Cloudinary-----הוספת תמונה -------------------------------------------------------------
app.post('/api/uploadImage',authenticateToken, imageUpload.single('image'), async (req, res) => {
  try {
    const file = req.file; // הקובץ שהועלה
    const name = req.body.name; // שם התמונה
    const category = req.body.category; // הקטגוריה

    if (!file) {
      return res.status(400).json({ success: false, message: 'לא הועלתה תמונה' });
    }
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'לא נבחר שם או קטגוריה' });
    }
    const result = await new Promise((resolve, reject) => { // העלאה ל-Cloudinary
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `manager_images/${category}`,
          display_name: name,
          resource_type: 'image',
          public_id: name,
        },
        (error, result) => {
          if (error) {
            reject(error); 
          } else {
            resolve(result);
          }
        }
      );
      stream.end(file.buffer);
    });
    res.status(200).json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      name: result.public_id,
      category,
    });

  } catch (err) {
    console.error('Error uploading image:', err);
    res.status(500).json({ success: false, message: 'שגיאה בהעלאת התמונה' });
  }
});
//---------- להורדת כל התמונות שהועלו-------------------------------------------------
app.get('/api/getUploadedImages', async (req, res) => {
  try {
    // פונקציה לשאיבת תמונות לפי תיקיה
    const fetchImagesByFolder = async (folder) => {
      const result = await cloudinary.search
        .expression(`folder:${folder}`) // חיפוש לפי תיקיה
        .sort_by("public_id", "desc") // סדר לפי מזהה
        .max_results(1000) // מספר מקסימלי של תוצאות
        .execute();

      return result.resources.map((image) => ({
        public_id: image.public_id,
        url: image.secure_url,
        folder: folder,
        display_name: image.public_id.split("/").pop(), 
      }));
    };

    const firstCourses = await fetchImagesByFolder("manager_images/first_courses");
    const mainCourses = await fetchImagesByFolder("manager_images/main_courses");
    const salads = await fetchImagesByFolder("manager_images/salads");
    const sideDishes = await fetchImagesByFolder("manager_images/side_dishes");
    
    // החזרת תוצאות
    res.send({
      first_courses: firstCourses,
      main_courses: mainCourses,
      salads: salads,
      side_dishes: sideDishes,
    });
    
  } catch (err) {
    console.error("Failed to fetch images by categories:", err);
    res.status(500).send("Error fetching images");
  }
});
// ----- מחיקת תמונה ספציפית ---------------------------------------------------------
app.delete('/api/deleteImage/:public_id',authenticateToken, async (req, res) => {
  try {
    const { public_id } = req.params;  
    const result = await cloudinary.uploader.destroy(public_id); // מבצע את מחיקת התמונה

    if (result.result === 'ok') {
      // אם הצלחה, מחזירים תשובה חיובית
      res.status(200).json({ success: true, message: 'תמונה נמחקה בהצלחה' });
    } else {
      // אם נכשל, מחזירים תשובת שגיאה
      res.status(500).json({ success: false, message: 'שגיאה במחיקת התמונה' });
    }
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ success: false, message: 'שגיאה במחיקת התמונה' });
  }
});


  // 🧱 קבצים סטטיים של React
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });




//------------------------------------------------------------------------------------


};
startServer(); // הפעלה

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 השרת רץ על פורט ${PORT}`);
});





