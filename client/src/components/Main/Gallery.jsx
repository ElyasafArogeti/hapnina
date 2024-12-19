import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import NavbarHome from './NavbarHome';
import Footer from './Footer';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import { Box, Tabs, Tab, Container, Typography } from '@mui/material';

// קטגוריות התמונות
const categories = {
  הכל: [], // יתווסף דינמית למטה
  האולם: [
    { img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', title: 'Wedding 1' },
    { img: 'https://tesoro.co.il/wp-content/uploads/2018/01/1-5-2.jpg', title: 'Engagement 2' },
    { img: 'https://www.hafakot.co.il/wp-content/uploads/2024/03/%D7%A7%D7%93%D7%9D-%D7%90%D7%95%D7%9C%D7%9D-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%9C%D7%99%D7%93-%D7%AA%D7%9C-%D7%90%D7%91%D7%99%D7%91-%D7%9C%D7%97%D7%AA%D7%95%D7%A0%D7%95%D7%AA.webp', title: 'Engagement 2' },
    { img: 'https://www.nine9.co.il/wp-content/uploads/2015/12/020.jpg', title: 'Engagement 2' },
    { img: 'https://www.harmoniabagan.co.il/wp-content/uploads/2016/02/%D7%92%D7%9F-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%91%D7%A9%D7%93%D7%A8%D7%95%D7%AA.jpg', title: 'Engagement 2' },
    { img: 'https://arya.co.il/wp-content/uploads/2022/05/%D7%90%D7%95%D7%9C%D7%9D-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%99%D7%95%D7%A7%D7%A8%D7%AA%D7%99-%D7%90%D7%A8%D7%99%D7%90-%D7%A2%D7%99%D7%A6%D7%95%D7%91-%D7%A9%D7%95%D7%9C%D7%97%D7%9F.jpg', title: 'Wedding 2' },
  ],
  האוכל: [
    { img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', title: 'Brit 1' },
    { img: 'https://mekomot-eruim.co.il/images/businesses_multi/1701860430aterethall3.jpg', title: 'Brit 2' },
    { img: 'https://www.harmoniabagan.co.il/wp-content/uploads/2016/02/%D7%92%D7%9F-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%91%D7%A9%D7%93%D7%A8%D7%95%D7%AA.jpg', title: 'Engagement 2' },
    { img: 'https://tesoro.co.il/wp-content/uploads/2018/01/1-5-2.jpg', title: 'Engagement 2' },
  ],
   ברים: [
    { img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', title: 'Brit 1' },
    { img: 'https://mekomot-eruim.co.il/images/businesses_multi/1701860430aterethall3.jpg', title: 'Brit 2' },
    { img: 'https://www.harmoniabagan.co.il/wp-content/uploads/2016/02/%D7%92%D7%9F-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%91%D7%A9%D7%93%D7%A8%D7%95%D7%AA.jpg', title: 'Engagement 2' },
    { img: 'https://tesoro.co.il/wp-content/uploads/2018/01/1-5-2.jpg', title: 'Engagement 2' },
  ],
};

// הוספת כל התמונות לקטגוריית "הכל"
categories['הכל'] = Object.values(categories).flat();

export default function CategorizedGallery() {
  const [selectedCategory, setSelectedCategory] = useState('הכל'); // ברירת מחדל: הכל
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCategoryChange = (event, newCategory) => {
    setSelectedCategory(newCategory);
  };

  const handleClickOpen = (img) => {
    setSelectedImage(img);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  return (
    <Box>
      <NavbarHome />
      <br/> <br/> <br/><br/>
      {/* ------------------------------------------------------------------------------ */}
      <Box sx={{ position: 'relative', width: '100%', maxHeight: '500px', overflow: 'hidden' }}>
        <Box
          component="img"
          src="https://neriyaboutique.co.il/wp-content/uploads/2023/03/0b381968-c9f4-45bf-8d36-1a4ca9a95e44-1.jpg"
          alt="אולם האירועים הפנינה"
          sx={{
            width: '100%',
            minHeight: '500px',
            maxHeight: '550px',
            objectFit: 'cover',
            backgroundPosition: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  filter: 'brightness(50%)', 
          }}
        />
        <Typography
          variant="h3"
          component="h1"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: '2px 2px 4px black',
            fontWeight: 'bold',
            fontSize: '5rem',
            color: '#FFD700',
            textAlign: 'center',
            zIndex: 1000, 
          }}
        >
          הגלרייה שלנו
        </Typography>
      </Box>
      {/* ------------------------------------------------------------------------------ */}
      {/* תפריט קטגוריות */}
      <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, textAlign: 'center' }}>
        <Container maxWidth="lg">
          <Tabs 
            value={selectedCategory}
            onChange={handleCategoryChange}
            centered
            sx={{
              direction: 'rtl',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              textAlign: 'center',
            }}
          >
            {Object.keys(categories).map((category) => (
              <Tab key={category} label={category} value={category} />
            ))}
          </Tabs>
        </Container>
      </Box>
      {/* ------------------------------------------------------------------------------ */}
      {/* גלריה לפי קטגוריה */}
      <Container
        maxWidth="lg"
        sx={{
          maxWidth: '1200px',
          marginTop: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={2}>
          {categories[selectedCategory].map((item ,index) => (
            <Grid size={{ xs: 12, sm: 4 }} md={4} key={item.img + index}>
              <Box
                component="img"
                src={item.img}
                alt={item.title}
                width="90%"
                height="auto"
                objectFit="cover"
                loading="lazy"
                onClick={() => handleClickOpen(item.img)}
                sx={{
            
                  height: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: 'transform 0.3s',
                  cursor: 'pointer',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
              />
            </Grid>
          ))}

        </Grid>
      </Container>

 <Dialog>
  <DialogTitle>
    <IconButton
      color="inherit"
      onClick={handleClose}
      aria-label="close"
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[600],
      }}
    >
      <CloseIcon />
    </IconButton>
  </DialogTitle>

  <DialogContent>
    <img
      src={selectedImage}
      alt="Enlarged"
      style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
    />
  </DialogContent>
</Dialog>

      <Footer />
    </Box>
  );
}
