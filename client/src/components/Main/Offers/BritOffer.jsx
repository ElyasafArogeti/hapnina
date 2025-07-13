import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate } from "react-router-dom";

// ברית

const BritOffer = () => {
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
            "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752409193/%D7%91%D7%A8%D7%99%D7%AA_3_i9lfck.jpg')",
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
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 300 }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <CelebrationIcon sx={{ fontSize: 40, color: "#ffeb3b", mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" fontSize="1.6rem">
              ברית מילה
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom fontSize="1.2rem">
            רק ₪60 למנה
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem" }}>
            5 סלטים טריים ✔<br />
            2 מנות פתיחה ✔<br />
            3 מנות עיקריות לבחירה ✔<br />
            קינוח אישי מפנק ✔
          </Typography>

          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/Offers/Brit")}
            sx={{ borderRadius: 8, px: 4, py: 1, fontWeight: "bold" }}
          >
            לצפייה בהצעה
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default BritOffer;
