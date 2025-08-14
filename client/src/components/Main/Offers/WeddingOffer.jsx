import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

// חתונה 

const WeddingOffer = () => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow: 4,
        transition: "0.3s",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          height: "100%",
          backgroundImage:
            "url('https://ari-events.co.il/wp-content/uploads/2023/11/hupa-ari-10.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          px: 3,
          py: 3,
          color: "#fff",
          textAlign: "center",
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.4)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 320 }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
         
            <Typography variant="h5" fontWeight="bold" fontSize="1.3rem">
             אירועי יוקרה - חתונות / דינרים
            </Typography>
          </Box>

        <Typography variant="h6" gutterBottom fontSize="1.2rem">
                  תפריט עשיר ויוקרתי , הצעת מחיר במקום 
                  </Typography>
        
                        <Typography   variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem", direction: "rtl" }}  >
                   8 סוגי סלטים לבחירה ✔      <br />
                   3  מנות ראשונות לבחירה ✔       <br />
                  3 מנות עיקריות לבחירה ✔<br />
                  3 תוספות לבחירה ✔ <br />
                </Typography>

          <Box textAlign="center">
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/OrdersOnline")}
              sx={{ borderRadius: 8, px: 4, py: 1, fontWeight: "bold" }}
            >
            לתפריט הצעת מחיר במקום 
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default WeddingOffer;
