import React, { useEffect, useState } from 'react';
import NavbarAll from './NavbarAll';
import '../../assets/stylesManager/Inventory.css';

import { BiShekel } from "react-icons/bi";
import { IoArrowBackSharp } from "react-icons/io5";
import { MdAssignmentAdd } from "react-icons/md";

const Inventory = () => {
    const [inventoryAll, setInventoryAll] = useState({
        first_courses: [],
        main_courses: [],
        salads: [],
        side_dishes: []
    });

    const [selectedCategory, setSelectedCategory] = useState(null);   //בחירת קטגוריה
    const [editModal, setEditModal] = useState(null);  //מודול עריכה
    const [newDishModal, setNewDishModal] = useState(false);   // מודאל הוספה
    const [newDish, setNewDish] = useState({ dish_name: "", price: "", weight: "" });   // פרטים של מנה חדשה

    useEffect(() => {
        const fetchInventoryAll = async () => {
            try {
                const response = await fetch('http://localhost:3001/inventoryAll');
                const data = await response.json();
                setInventoryAll(data);                           
            } catch (error) {
                console.error('Failed to fetch inventory:', error);
            }
        };
        fetchInventoryAll();
    }, []);

       // הוספת מנה חדשה
       const addDish = async () => {
        try {
            const response = await fetch('http://localhost:3001/addNewDish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newDish, category: selectedCategory }),
            });
            const newDishItem = await response.json();
            setInventoryAll({// הפעלת פרטים חדשים לראייה 
                ...inventoryAll, [selectedCategory]: [...inventoryAll[selectedCategory], newDishItem]
            });
            setNewDish({ dish_name: "", price: "", weight: "" }); // איפוס השדות
            setNewDishModal(false); // סגירת המודאל
        } catch (error) {
            console.error('Failed to add dish:', error);
        }
    };

    // עדכון מנה קיימת
    const updateDish = async (id, updatedDish) => {
        try {
            await fetch(`http://localhost:3001/updateDish/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...updatedDish, category: selectedCategory }),
            });
            setInventoryAll({
                ...inventoryAll,[updatedDish.category]:inventoryAll[updatedDish.category].map(item =>   
                    item.id === id ? updatedDish : item
                )});
            setEditModal(null); // סגירת חלון העריכה
        } catch (error) {
            console.error('Failed to update dish:', error);
        }
    };

    // מחיקת מנה
    const deleteDish = async (id, category) => {
        if (window.confirm("האם אתה בטוח שברצונך למחוק את המנה?")) {
            try {
            await fetch(`http://localhost:3001/deleteDish/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ category: selectedCategory }),
            });
            setInventoryAll({
                ...inventoryAll,
                [category]: inventoryAll[category].filter(item => item.id !== id),
            });
        } catch (error) {
            console.error('Failed to delete dish:', error);
        } 
          }
    };

    // פתיחת חלון עריכה
    const openEditModal = (item, category) => {  
        setEditModal({ ...item, category });
    };

    // טיפול בשינוי ערכים בחלון העריכה
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditModal(prev => ({ ...prev, [name]: value }));
    };

       // טיפול בשינוי ערכים במודאל הוספת מנה
       const handleNewDishChange = (e) => {
        const { name, value } = e.target;
        setNewDish(prev => ({ ...prev, [name]: value }));
    }; 

  
   // פונקציה להסתרה מהתצוגה 
const hideDish = async (id, category) => {
    setInventoryAll({
        ...inventoryAll,
        [category]: inventoryAll[category].map(item =>
          item.id === id ? { ...item, is_hidden: false } : item  // עדכון המנה כ"לא מוסתרת"
        ),
      });
    try {
      const response = await fetch(`http://localhost:3001/hideDish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          hidden: false,  
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);  // הודעת הצלחה
      } else {
        console.error('Error hiding dish:', data);
        setInventoryAll({
            ...inventoryAll,
            [category]: inventoryAll[category].map(item =>
              item.id === id ? { ...item, is_hidden: true } : item
            ),
          });
      }
    } catch (err) {
      console.error('Error hiding dish:', err);
    }
  };
  
  // להחזיר לתצוגה 
  const unhideDish = async (id, category) => {
    setInventoryAll({
        ...inventoryAll,
        [category]: inventoryAll[category].map(item =>
          item.id === id ? { ...item, is_hidden: true } : item  // עדכון המנה כ"לא מוסתרת"
        ),
      });
    try {
      const response = await fetch(`http://localhost:3001/hideDish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: category,
          hidden: true,  // שולחים true כדי להחזיר את המנה לתצוגה
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);  // הודעת הצלחה
      } else {
        console.error('Error unhiding dish:', data);
        setInventoryAll({
            ...inventoryAll,
            [category]: inventoryAll[category].map(item =>
              item.id === id ? { ...item, is_hidden: false } : item  // עדכון המנה כ"לא מוסתרת"
            ),
          });
      }
    } catch (err) {
      console.error('Error unhiding dish:', err);
    }
  };
  
  
  

  
// -----------------------------------------
    const whatCategory = { // הוסף תרגומים נוספים לפי הצורך 
        salads: 'ניהול סלטים',
        first_courses: 'ניהול מנות ראשונות',
        main_courses: 'ניהול מנות עיקריות',
        side_dishes: 'ניהול תוספות'
     }
    return (
        <div>
            <NavbarAll />
           
            <div> 
                {selectedCategory === null ? ( 
              <div className="category-container">
                 <div className="category-box  side-dishes-box"   onClick={() => setSelectedCategory("side_dishes")}>תוספות</div>
                  <div className="category-box  main-courses-box"  onClick={() => setSelectedCategory("main_courses")}>מנות עיקריות</div>
                 <div className="category-box  first-courses-box" onClick={() => setSelectedCategory("first_courses")}>מנות ראשונות</div>
                 <div className="category-box  salads-box"        onClick={() => setSelectedCategory("salads")}>סלטים</div>
              </div>
        
                ) : (
                    <div dir='rtl' className='styled-table-container'>
                        <br />
                       <h1>  {selectedCategory ? 
                            (whatCategory[selectedCategory] 
                              ? whatCategory[selectedCategory]   : "" ) : ''}
                        </h1>
                            <div className='butt-return' >
                            <button className='butt-return-category'  onClick={() => setSelectedCategory(null)}> <IoArrowBackSharp /></button>
                            <button className='butt-return-category'  onClick={() => setNewDishModal(true)}>הוסף פריט <MdAssignmentAdd/></button>
                     </div>
                        <table className='styled-table'>
                            <thead>
                                <tr>
                                    <th>שם פריט</th>
                                    <th>מחיר - לקילו / יחידה</th>
                                    <th>משקל - לגרם / יחידה</th>
                                    <th>עדכון</th>
                                    <th>מחיקה</th>
                                    <th>הסתר </th>
                                </tr>
                            </thead>
                            <tbody>
                               {inventoryAll[selectedCategory].map((item) => (
                                 <tr key={item.id} style={{ backgroundColor: item.is_hidden ?  'white': '#63000067' }}>
                                   <td>{item.dish_name}</td>
                                   <td>{<BiShekel />} {item.price}</td>
                                   <td>{item.weight}</td>
                                   <td>
                                     <button className="buttonAll" onClick={() => openEditModal(item, selectedCategory)}>ערוך</button>
                                   </td>
                                   <td>
                                     <button className="buttonAll" onClick={() => deleteDish(item.id, selectedCategory)}>מחק</button>
                                   </td>
                                   <td>
                                     {item.is_hidden ? (
                                         <button className="buttonAll" onClick={() => hideDish(item.id, selectedCategory)}>הסתר</button>
                                     ) : (
                                        <button className="buttonAll" onClick={() => unhideDish(item.id, selectedCategory)}>החזר</button>
                                     )}
                                   </td>
                                 </tr>
                               ))}
                              </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* חלון העריכה */}
            {editModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>עריכת מנה</h3>
                        <label>:שם הפריט</label>
                        <input  type="text" name="dish_name" value={editModal.dish_name}
                           onChange={handleEditChange}       
                        />
                        <label>:מחיר</label>
                        <input type="number" name="price" value={editModal.price || ""}
                            onChange={handleEditChange}
                        />
                        <label>:משקל</label>
                        <input type="number" name="weight" value={editModal.weight || ""}        
                            onChange={handleEditChange}
                        />
                       <button onClick={() =>{
                         if (window.confirm("האם אתה בטוח שברצונך לשנות את פרטי המנה?")) {
                            updateDish(editModal.id, editModal);
                          }
                         }}> שמור </button>
                       <button onClick={() => setEditModal(null)}>ביטול</button>
                    </div>
                </div>
            )}

             {/* חלון הוספת מנה חדשה */}
             {newDishModal && (
                <div className="modal" >
                    <div className="modal-content">
                        <h3>הוספת מנה/סלט</h3>
                        <label>:שם הפריט</label>
                        <input  type="text" name="dish_name" value={newDish.dish_name} onChange={handleNewDishChange} />
                        <label>:מחיר</label>
                        <input type="number" name="price" value={newDish.price} onChange={handleNewDishChange} />
                        <label>:משקל</label>
                        <input type="number" name="weight" value={newDish.weight} onChange={handleNewDishChange} />
                        <button onClick={addDish}>שמור</button>
                        <button onClick={() => setNewDishModal(false)}>ביטול</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
