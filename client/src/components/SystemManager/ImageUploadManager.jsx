import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, CircularProgress, IconButton, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

import NavbarAll from "./NavbarAll";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ImageUploadManager = () => {

  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [category, setCategory] = useState(''); // קטגוריה שנבחרה
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [editingImage, setEditingImage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [imagesByCategory, setImagesByCategory] = useState({
    first_courses: [],
    main_courses: [],
    salads: [],
    side_dishes: [],
    general_photos: [],
  });
  console.log(imagesByCategory);
  
  const [imagesLoading, setImagesLoading] = useState(true);

  const [deleteImageConfirmOpen, setDeleteImageConfirmOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  const [imageUrl, setImageUrl] = useState(null);
 const token = localStorage.getItem("authToken");
useEffect(() => {
  const fetchImages = async () => {
   
    try {
      const response = await axios.get('http://localhost:3001/api/getUploadedImages',{
        headers: {
          Authorization: `Bearer ${token}`,
      },
    });
      setImagesByCategory(response.data);
      console.log(response.data);
    } catch (err) {
      console.error('Error fetching images by categories:', err);
    } finally {
      setImagesLoading(false);
    }
  };

  fetchImages();
}, []);


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleNameChange = (event) => setImageName(event.target.value);

  const handleCategoryChange = (event) => setCategory(event.target.value); // טיפול בבחירת קטגוריה

  const handleUpload = async () => {
    if (!image || !imageName || !category) {
      alert('אנא מלא שם לתמונה, בחר קטגוריה ובחר תמונה להעלאה.');
      return;
    }
  
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', imageName);
    formData.append('category', category);
  
    try {
      const response = await axios.post('http://localhost:3001/api/uploadImage', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data' ,
           Authorization: `Bearer ${token}`,
        }
      });
  
      // הוספת התמונה החדשה ל-state של התמונות
      const newImage = {
        public_id: response.data.public_id,
        url: response.data.url,
        name: imageName,
        category: category
      };
  
      setImageUrl(response.data.url);
      setUploadedImages([...uploadedImages, newImage]);  // הוספת התמונה החדשה לרשימה
      setImagesByCategory(prev => {
        // עדכון קטגוריה עם התמונה החדשה
        const updatedCategory = { ...prev };
        updatedCategory[category] = [...updatedCategory[category], newImage];
        return updatedCategory;
      });
    } catch (err) {
      setError('שגיאה בהעלאת התמונה. נסה שנית.');
    } finally {
      setLoading(false);
    }
  };
  
  

  

  //------------------------------------------------------------------
  const handleDeleteImage = async (public_id) => {
    try {
      setLoading(true);
  
      // ודא שה- public_id עבר encoding
      const encodedPublicId = encodeURIComponent(public_id);  // מזהה התמונה (כולל השם המלא, כל התוים שכוללים רווחים)
  
      const response = await axios.delete(`http://localhost:3001/api/deleteImage/${encodedPublicId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      console.log(response.data);
  
      if (response.data.success) {
        setUploadedImages(uploadedImages.filter((image) => image.public_id !== public_id));
  
        setImagesByCategory((prev) => {
          const updatedCategory = {};
          Object.keys(prev).forEach((category) => {
            updatedCategory[category] = prev[category].filter((image) => image.public_id !== public_id);
          });
          return updatedCategory;
        });
        setDeleteImageConfirmOpen(false);
      } else {
        alert(response.data.message);
      }
    } catch (err) {
      console.error('Error deleting image:', err);
      alert('שגיאה במערכת. נסה שנית מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleUpdateImage = async () => {
    if (!imageName) {
      alert('אנא מלא שם לתמונה.');
      return;
    }
  
    try {
      const response = await axios.put(`http://localhost:3001/api/updateImage/${editingImage.public_id}`, { name: imageName });
      const updatedImage = { ...editingImage, name: imageName };
      setUploadedImages(uploadedImages.map((img) => (img.public_id === updatedImage.public_id ? updatedImage : img)));
      setOpenDialog(false);
      setEditingImage(null);
    } catch (err) {
      console.error('Error updating image:', err);
      alert('שגיאה בעדכון התמונה. נסה שנית.');
    }
  };
  

  const openDeleteDialog = (image) => {
    console.log(image.public_id);
    
    setImageToDelete(image);
    setDeleteImageConfirmOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteImageConfirmOpen(false);
    setImageToDelete(null);
  };

  const handleCopyUrl = (url) => {
    if (url) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('כתובת התמונה הועתקה ללוח');
        })
        .catch((err) => {
          console.error('שגיאה בהעתקת הכתובת:', err);
        });
    }
  };
  const categoryTranslation = {
    first_courses: 'מנה ראשונה',
    main_courses: 'מנה עיקרית',
    salads: 'סלטים',
    side_dishes: 'תוספות',
    general_photos: 'תמונות כלליות',
  };
  
  return (
    <div>
      <NavbarAll />

      <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" p={3}>
        <p>Hp@6600200 : פרטי הסיסמה באתר</p>

        {/* כפתור Cloudinary */}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => window.open("https://console.cloudinary.com/console/c-f47da755a7e4df43d457f88477171e/media_library/folders/home?view_mode=list", "_blank")}
          style={{ marginBottom: '20px' }}
        >
          Cloudinary - גישה לאתר
        </Button>


        <Typography variant="h4">ניהול תמונות</Typography>



 <Grid container spacing={3} mt={2} style={{ marginTop: '5px' , maxWidth: '1200px' , border: '1px solid #ccc', padding: '20px', borderRadius: '8px',}}>
  <Grid item xs={12} sm={4}>
    <TextField
      label="שם התמונה"
      variant="outlined"
      value={imageName}
      onChange={handleNameChange}
      fullWidth
    />
  </Grid>

  <Grid item xs={12} sm={4}> 
    <FormControl fullWidth variant="outlined">
      <InputLabel>בחר קטגוריה</InputLabel>
      <Select
        value={category}
        onChange={handleCategoryChange}
        label="בחר קטגוריה"
      >
        <MenuItem value="first_courses">מנה ראשונה</MenuItem>
        <MenuItem value="main_courses">מנה עיקרית</MenuItem>
        <MenuItem value="salads">סלטים</MenuItem>
        <MenuItem value="side_dishes">תוספות</MenuItem>
        <MenuItem value="general_photos">תמונות כללי</MenuItem>
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={12} sm={3}> 
    <input 
      variant="contained"
     color="primary"
      type="file"
      onChange={handleImageChange}
      style={{ width: '100%', marginTop: '5px' , color:"primary", maxWidth: '250px' , textAlign: 'center', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}
    />
  </Grid>

  <Grid item xs={12} sm={12}> 
    <Button
      variant="contained"
      color="primary"
      onClick={handleUpload}
      disabled={loading}
      fullWidth
      style={{ marginTop: '5px' ,maxWidth: '150px'}}
    >
      {loading ? <CircularProgress size={24} /> : 'העלה תמונה'}
    </Button>
  </Grid>
</Grid>

{error && (
  <Typography color="error" mt={2}>
    {error}
  </Typography>
)}



        {imageUrl && (
          <Box mt={2}>
            <Typography variant="h6">הקישור לתמונה שהועלתה:</Typography>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl}
            </a>
          </Box>
        )}

        {imagesLoading ? (
          <CircularProgress size={50} style={{ marginTop: 20 }} />
        ) : (
          <Box mt={4} width="100%">
            <Typography variant="h4" gutterBottom>
              תמונות שהועלו לפי קטגוריות
            </Typography>

            {Object.entries(imagesByCategory).map(([category, images]) => (
              <Box key={category} mb={4} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
                <Typography variant="h6">{categoryTranslation[category] || category}</Typography> {/* המרת קטגוריה לעברית */}
                <Grid container spacing={2}>
                  {images.map((image) => (
                    <Grid item xs={12} sm={6} md={3} key={image.public_id}>
                      <Box border={1} borderRadius={2} p={2}>
                         <div
                           style={{
                             width: '100%', 
                             height: '250px', 
                             overflow: 'hidden', 
                             borderRadius: '8px',
                           }}
                         >
                           <img
                             src={image.url}
                             alt={image.name}
                             style={{
                               width: '100%', 
                               height: '100%', 
                               objectFit: 'cover',
                             }}
                           />
                         </div>
                       <Typography
                          variant="subtitle1"
                          align="center"
                          style={{ wordWrap: 'break-word' }}
                        >
                          {image.display_name}
                        </Typography>
                        <Box display="flex" justifyContent="space-between">
                        <IconButton onClick={()=> handleCopyUrl(image.url)} color="primary" style={{ marginLeft: '10px' }}>
                        <ContentCopyIcon />
                      </IconButton>
                          <IconButton onClick={() => openDeleteDialog(image)} color="secondary">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}

        {/* Delete confirmation dialog */}
        <Dialog open={deleteImageConfirmOpen} onClose={closeDeleteDialog}>
          <DialogTitle>האם אתה בטוח שברצונך למחוק את התמונה?</DialogTitle>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="secondary">ביטול</Button>
            <Button onClick={() => handleDeleteImage(imageToDelete.public_id)} color="primary">מחק</Button>
          </DialogActions>
        </Dialog>

        {/* Edit Image Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>ערוך שם תמונה</DialogTitle>
          <DialogContent>
            <TextField
              label="שם התמונה"
              variant="outlined"
              fullWidth
              value={imageName}
              onChange={handleNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="secondary">ביטול</Button>
            <Button onClick={handleUpdateImage} color="primary">עדכן</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default ImageUploadManager;
