import React, { useEffect, useState } from 'react';
import NavbarAll from './NavbarAll';
import '../../assets/stylesManager/Inventory.css';

import { BiShekel } from "react-icons/bi";
import { Box, Typography, Button, Modal, TextField, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { MdAssignmentAdd } from "react-icons/md";
import Grid from '@mui/material/Grid2';

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
              const token = localStorage.getItem("authToken");
                const response = await fetch('http://localhost:3001/api/inventoryAll', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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
          const token = localStorage.getItem("authToken");
            const response = await fetch('http://localhost:3001/api/addNewDish', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
          const token = localStorage.getItem("authToken");
            await fetch(`http://localhost:3001/api/updateDish/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem("authToken");
            await fetch(`http://localhost:3001/api/deleteDish/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/hideDish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      const token = localStorage.getItem("authToken");
      const response = await fetch(`http://localhost:3001/api/hideDish/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
      <Box sx={{ padding: 2 }} >
          {selectedCategory === null ? (
             <Grid container spacing={2} maxWidth="1200px" margin="0 auto">
             <Grid size={{ xs: 12, sm: 3 }}>
               <Box
                 sx={{
                   textAlign: 'center',
                   padding: 2,
                   border: '1px solid #ccc',
                   cursor: 'pointer',
                   objectFit:'cover',
                   backgroundImage: 'url("https://www.yad-mordechai.co.il/Uploads//Recipes/From%20Old%20Web/tariaki_rimon.jpg")',
                   backgroundSize: 'cover', 
                   backgroundPosition: 'center', 
                   height: 200,  height: 200,
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',   borderRadius: '10px'
                 }}
                 onClick={() => setSelectedCategory('side_dishes')}
                >
                <Typography variant="h6"  sx={{fontSize: 35,  fontWeight: 'bold',  color: 'white',  }} >תוספות</Typography>  
               </Box>          
             </Grid>
           
             <Grid size={{ xs: 12, sm: 3 }}>
               <Box
                 sx={{
                   textAlign: 'center',
                   padding: 2, objectFit:'cover',
                   border: '1px solid #ccc',
                   cursor: 'pointer',
                   backgroundImage: 'url("https://ynet-pic1.yit.co.il/cdn-cgi/image/f=auto,w=740,q=75/picserver5/crop_images/2024/05/13/BJ11iMHy70/BJ11iMHy70_0_0_1000_667_0_x-large.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   height: 200, display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',   borderRadius: '10px'
                 }}
                 onClick={() => setSelectedCategory('main_courses')}
               >
                 <Typography variant="h6" sx={{fontSize:35,fontWeight:'bold', color: 'white'}}>מנות עיקריות</Typography>
               </Box>
             </Grid>
           
             <Grid size={{ xs: 12, sm: 3 }}>
               <Box
                 sx={{
                   textAlign: 'center',
                   padding: 2, objectFit:'cover',
                   border: '1px solid #ccc',
                   cursor: 'pointer',
                   backgroundImage: 'url("https://static.wixstatic.com/media/91dd81_1af0fe2fc4a84c87875602be8280eba8~mv2.jpg/v1/fill/w_558,h_288,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/91dd81_1af0fe2fc4a84c87875602be8280eba8~mv2.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   height: 200, display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',   borderRadius: '10px'
                 }}
                 onClick={() => setSelectedCategory('first_courses')}
               >
                 <Typography variant="h6" sx={{fontSize:35,fontWeight:'bold', color: 'white'}}>מנות ראשונות</Typography>
               </Box>
             </Grid>
           
             <Grid size={{ xs: 12, sm: 3 }}>
               <Box
                 sx={{
                   textAlign: 'center',
                   padding: 2, objectFit:'cover',
                   border: '1px solid #ccc',
                   cursor: 'pointer',
                   backgroundImage: 'url("https://www.delis.co.il/contentManagment/uploadedFiles/DSC_2983a_975.jpg")',
                   backgroundSize: 'cover',
                   backgroundPosition: 'center',
                   height: 200, display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center', 
                   borderRadius: '10px'
                 }}
                 onClick={() => setSelectedCategory('salads')}
               >
                 <Typography variant="h6" sx={{fontSize:35,fontWeight:'bold', color: 'white'}}>סלטים</Typography>
               </Box>
             </Grid>
           </Grid>
           
          ) : (

           <Box dir='rtl' sx={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Typography variant="h4" gutterBottom>
                {whatCategory[selectedCategory]}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <Button
                    variant="outlined"
                    onClick={() => setSelectedCategory(null)}>   
                        חזרה
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setNewDishModal(true)}
                    startIcon={<MdAssignmentAdd />}
                >
                    הוסף פריט
                </Button>
            </Box>
            <Table dir="rtl" sx={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                <TableHead>
                    <TableRow dir="rtl">
                        <TableCell sx={{ textAlign: 'right' }}>שם הפריט</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>מחיר</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>משקל</TableCell>
                        <TableCell sx={{ textAlign: 'right' }}>פעולות</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody dir="rtl">
                    {inventoryAll[selectedCategory].map((item) => (
                        <TableRow key={item.id} sx={{  backgroundColor: item.is_hidden ? 'transparent' : '#63000067' ,'@media (max-width: 600px)':{maxWidth: '95%'}  }}>      
                            <TableCell sx={{ textAlign: 'right' }}>{item.dish_name}</TableCell>
                            <TableCell sx={{ textAlign: 'right' ,'@media (max-width: 600px)':{maxWidth: 'auto'} }} ><BiShekel /> {item.price}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>{item.weight}</TableCell>
                            <TableCell sx={{ textAlign: 'right' }}>

                        <Box sx={{  flexDirection: 'row', justifyContent: 'space-between', display: 'flex' ,  '@media (max-width: 600px)': { flexDirection: 'column', alignItems: 'flex-start' } }}>
                                    <Button
                                        variant="contained"
                                        onClick={() => openEditModal(item, selectedCategory)}                                    
                                    >
                                        ערוך
                                    </Button>
                                    <Button
                                        variant="contained" color="error"
                                        onClick={() => deleteDish(item.id, selectedCategory)}                                     
                                    >
                                        מחק
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color={item.is_hidden ? 'default' : 'primary'}
                                        onClick={() => item.is_hidden ? hideDish(item.id, selectedCategory) : unhideDish(item.id, selectedCategory)}
                                      
                                    >
                                        {item.is_hidden ? 'הסתר' : 'החזר'}
                                    </Button>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
        
          )}
      </Box>

      {/* עריכת מנה*/}
      <Modal open={editModal !== null} onClose={() => setEditModal(null)}>
          <Box sx={{
                   backgroundColor: 'white',
                   padding: 3,
                   borderRadius: 2,
                   position: 'absolute',  
                   top: '50%',  
                   left: '50%', 
                   transform: 'translate(-50%, -50%)', 
                   maxWidth: '300px',  
                   width: '100%',  
              }}>
              <Typography variant="h6" gutterBottom>
                  עריכת מנה
              </Typography>
              <TextField 
                  dir='rtl'
                  label="שם הפריט"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="dish_name"
                  value={editModal?.dish_name || ""}
                  onChange={handleEditChange}
              />
              <TextField  dir='rtl'
                  label="מחיר"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="price"
                  textAlign='right'
                  value={editModal?.price || ""}
                  onChange={handleEditChange}
              />
              <TextField  dir='rtl'
                  label="משקל"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  name="weight"
                  textAlign='right'
                  value={editModal?.weight || ""}
                  onChange={handleEditChange}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                  <Button
                      variant="contained"
                      onClick={() => updateDish(editModal.id, editModal)}
                  >
                      עדכן
                  </Button>
                  <Button
                      variant="outlined"
                      onClick={() => setEditModal(null)}
                  >
                      סגור
                  </Button>
              </Box>
          </Box>
      </Modal>

      {/* הוספת מנה */}
      <Modal open={newDishModal} onClose={() => setNewDishModal(false)}>
    <Box sx={{
        backgroundColor: 'white',
        padding: 3,
        borderRadius: 2,
        position: 'absolute',  
        top: '50%',  
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        maxWidth: '300px',  
        width: '100%',  
    }}>
        <Typography variant="h6" gutterBottom>
            הוסף פריט חדש
        </Typography>
        <TextField  dir='rtl'
            label="שם המנה"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dish_name"
            value={newDish.dish_name}
            onChange={handleNewDishChange}
        />
        <TextField  dir='rtl'
            label="מחיר"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            name="price"
            value={newDish.price}
            onChange={handleNewDishChange}
        />
        <TextField  dir='rtl'
            label="משקל"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            name="weight"
            value={newDish.weight}
            onChange={handleNewDishChange}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <Button
                variant="contained"
                onClick={addDish}
            >
                הוסף
            </Button>
            <Button
                variant="outlined"
                onClick={() => setNewDishModal(false)}
            >
                סגור
            </Button>
        </Box>
    </Box>
</Modal>

  </div>
    );
};

export default Inventory;
