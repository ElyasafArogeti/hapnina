import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";

// אירוסין 

const EngagementOffer = () => {
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
            "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752413979/%D7%90%D7%99%D7%A8%D7%95%D7%A1%D7%99%D7%9F_vxbywc.jpg')", // שנה לתמונה רלוונטית לאירוסין
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
          direction: "rtl",
          "::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.4)", // שכבת שקיפות כהה
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 320 }}>
          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Typography variant="h5" fontWeight="bold" fontSize="1.6rem">
              תפריט אירוסין
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
          <Box textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/engagement-details")}
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

export default EngagementOffer;
