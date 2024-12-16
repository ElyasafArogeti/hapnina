import axios from 'axios';
import React, { useState, useEffect } from 'react';
import styles from '../../assets/stylesManager/UserManagement.module.css';
import NavbarAll from './NavbarAll';

import { FaSearch } from 'react-icons/fa'; 
import  {People} from '@mui/icons-material';
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [usersForSearch, setUsersForSearch] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    event_date: '',
    guest_count: 0,
  });

  // Fetch users from server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/UserManagement');
        const sortedOrders = response.data.reverse();
        setUsers(sortedOrders);
        setUsersForSearch(sortedOrders);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);


  const handleInputChange = (e) => {
    const { name , value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/UserManagement/${editingUser.id}`, formData );  
      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? { ...user, ...formData } : user
          )
        )
        alert('המשתמש עודכן בהצלחה');
        setEditingUser(null);
         setFormData({
        name: '',
        phone: '',
        event_date: '',
        guest_count: 0,
      });
      }

      else {
        alert(response.data.message || 'אירעה שגיאה בעדכון');
      }
    } catch (error) {
      console.error(error);
    }
  };



  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB'); 
  };


  const handleCloseButton = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      phone: '',
      event_date: '',
      guest_count: 0,
    });
  };

  
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();  // חיפוש באותיות קטנות
    if (query === "") {
        setUsers(usersForSearch);  // אם החיפוש ריק, הצג את כל ההזמנות
        return;
    }
    // סינון ההזמנות לפי שם בעל ההזמנה או תאריך האירוע
    const filtered = usersForSearch.filter((user) => {
        const ownerName = user.name.toLowerCase();
        const eventDate = new Date(user.event_date).toLocaleDateString('he-IL');
        const phone = new Date(user.phone).toLocaleDateString('he-IL');
        return ownerName.includes(query) || eventDate.includes(query) || phone.includes(query); // חיפוש במילים
    });
  
    // עדכון רשימת ההזמנות המוצגות על פי החיפוש
    setUsers(filtered);  // הצג את התוצאות הסינוניות
  };



  return (
    <div><NavbarAll/><br />
      <h1>ניהול נתוני לקוחות    <People/></h1>
    <br />

      {/* מצב עריכה  */}
      {editingUser && (
        <div className={styles.editForm} dir='rtl'>
          <div className={styles.editCentner}>      
          <div className={styles.formGroup}>
        <div onClick={handleCloseButton} className={styles.close}>&times;</div>
            <label>שם הלקוח</label>
            <input type="text" name="name" value={formData.name}
              onChange={handleInputChange}/> 
          </div>
          <div className={styles.formGroup}>
            <label>פלאפון</label>
            <input type="text"   name="phone" value={formData.phone}
              onChange={handleInputChange}/>         
          </div>
          <div className={styles.formGroup}>
            <label>תאריך אירוע : {formatDate(formData.event_date)}</label>
            <input type="date" name="event_date" value={formData.event_date}
              onChange={handleInputChange} />
          </div>
          <div className={styles.formGroup}>
            <label>מספר מוזמנים ניתן לשינוי בניהול הזמנות</label>
            <div type="number"  value={formData.guest_count} />
             {formData.guest_count}
          </div>
          <button onClick={handleSave}>שמור</button>
          <button onClick={() => setEditingUser(null)}>ביטול</button>
         </div>
       </div>
      )}

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
            <th className={styles.th}>לקוח</th>
            <th className={styles.th}>שם הלקוח</th>
            <th className={styles.th}>פלאפון</th>
            <th className={styles.th}>תאריך אירוע</th>
            <th className={styles.th}>מספר מוזמנים</th>
            <th className={styles.th}>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={styles.tr}>
              <td className={styles.td}>{user.id}</td>
              <td className={styles.td}>{user.name}</td>
              <td className={styles.td}>{user.phone}</td>
              <td className={styles.td}>{formatDate(user.event_date)}</td>
              <td className={styles.td}>{user.guest_count}</td>
              <td className={styles.td}>
                <button
                 className={styles.button}
                 onClick={() => {
                   setEditingUser(user);
                   setFormData({
                     name: user.name,
                     phone: user.phone,
                     event_date: user.event_date,
                     guest_count: user.guest_count,
                   });
                 }}
               >
                 ערוך
               </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && <tr><td colSpan="6">לא נמצאו לקוחות</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
