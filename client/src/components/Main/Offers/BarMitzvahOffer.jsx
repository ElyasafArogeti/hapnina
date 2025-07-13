import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate } from "react-router-dom";

// בר מצווה 


const BarMitzvahOffer = () => {
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
            "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752413870/%D7%91%D7%A8_%D7%9E%D7%A6%D7%95%D7%95%D7%94_4_ij29kz.jpg')", // החלף לכתובת תמונה אמיתית שלך
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
            bgcolor: "rgba(0, 0, 0, 0.4)", // שקיפות כהה מעל התמונה
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 320 }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <CelebrationIcon sx={{ fontSize: 40, color: "#ffeb3b", mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" fontSize="1.6rem">
              בר מצווה
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom fontSize="1.2rem">
            רק ₪50 למנה
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem" }}>
            5 סוגי סלטים ✔<br />
            3 מנות עיקריות ✔<br />
            תוספות ומנה אחרונה – במחיר משתלם במיוחד!
          </Typography>

          <Box textAlign="center">
            <Button
              variant="contained"
              color="warning"
              onClick={() => navigate("/BarMitzvahOrder")}
              sx={{ borderRadius: 8, px: 4, py: 1, fontWeight: "bold" }}
            >
              לפרטים נוספים
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default BarMitzvahOffer;
