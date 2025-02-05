import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Typography, IconButton, Drawer, Box } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Grid from '@mui/material/Grid2';
import NavbarHome from "./NavbarHome";
import TextMove from './textMove';
import { motion } from 'framer-motion';

const dishes = [
  { id: 1, name: "שיפודי קבב מזרחי", price: 34.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157676/manager_images/main_courses/%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99%20%D7%A7%D7%91%D7%91%20%D7%9E%D7%96%D7%A8%D7%97%D7%99.jpg" }, 
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  { id: 4, name: "שניצל עוף", price: 24.9, image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg" },
  // שאר המנות
];

const MainCourse = () => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [openCart, setOpenCart] = useState(false);
  const [animateImage, setAnimateImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish, event) => {
    // תיאום מיקום התמונה למקום שבו נלחץ
    const imgElement = event.target.closest('button').previousElementSibling;
    const imgRect = imgElement.getBoundingClientRect();
    
    setAnimateImage({
      image: dish.image,
      left: imgRect.left,
      top: imgRect.top,
      width: imgRect.width,
      height: imgRect.height,
    });

    setCart((prevCart) => [...prevCart, dish]);
  };

  const toggleCartDrawer = () => {
    setOpenCart(!openCart);
  };

  return (
    <div style={{ position: "relative", padding: "20px" }}>
      <NavbarHome/><br/><br/><br/>
      <TextMove/>

      <IconButton
        onClick={toggleCartDrawer}
        color="primary"
        style={{
          position: "fixed", 
          top: 40, 
          left: 20, 
          zIndex: 1000,
          backgroundColor: "#fff", 
          borderRadius: "50%",
          padding: "10px"
        }}
      >
        <ShoppingCartIcon fontSize="large" />
      </IconButton>

      {/* Dish Cards Grid */}
      <Grid container spacing={4}>
        {dishes.map((dish) => (
          <Grid size={{ xs: 12, sm: 3 }} sm={6} md={4} lg={3} key={dish.id}>
            <Card sx={{ maxWidth: 250, borderRadius: 2, boxShadow: 3 }}>
              <CardMedia
                component="img"
                alt={dish.name}
                height="200"
                image={dish.image}
                title={dish.name}
              />
              <CardContent>
                <Typography variant="h6" component="div" textAlign="center">
                  {dish.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" textAlign="center">
                  ₪{dish.price}
                </Typography>
                <Button
                  onClick={(event) => addToCart(dish, event)}
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  הוסף לסל
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Animation of image moving to the cart */}
      {animateImage && (
        <motion.img
          src={animateImage.image}
          alt="Dish"
          style={{
            position: "fixed",
            top: animateImage.top,
            left: animateImage.left,
            width: animateImage.width,
            height: animateImage.height,
            zIndex: 999,
            pointerEvents: "none",
          }}
          initial={{ opacity: 1 }}
          animate={{
            top: 40,  // מיקום הסל בצד שמאל למעלה
            left: 20,
            width: 50,  // גודל התמונה כשהיא "מתכווצת"
            height: 50,
            opacity: 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onAnimationComplete={() => setAnimateImage(null)}  // אחרי האנימציה, מנקים את התמונה
        />
      )}

      {/* Cart Drawer */}
      <Drawer
        anchor="left"
        open={openCart}
        onClose={toggleCartDrawer}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography variant="h6" gutterBottom>
            מנות שנבחרו
          </Typography>
          {cart.length > 0 ? (
            <Box>
              {cart.map((dish, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
                  <Typography variant="body2">{dish.name}</Typography>
                  <Typography variant="body2">₪{dish.price}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              אין מנות בסל
            </Typography>
          )}
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => alert("הזמנה נשלחה")}
            sx={{ marginTop: 2 }}
          >
            בצע הזמנה
          </Button>
        </Box>
      </Drawer>
    </div>
  );
};

export default MainCourse;
