import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { useNavigate } from "react-router-dom";


const BarMitzvahOffer = () => {
  const navigate = useNavigate();

  const handleClick = () => { // לא לשכוח לשנות פרטים גם בקישורים
  navigate("/GenericOrder", {
  state: {
    eventName: "בר מצווה",
    pricePerDish: 70,
    selectionLimits: {
      salads: 5,
      first_courses: 3,
      main_courses: 3,
      side_dishes: 2,
    },
    eventImage:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752413870/%D7%91%D7%A8_%D7%9E%D7%A6%D7%95%D7%95%D7%94_4_ij29kz.jpg",
    hiddenItems: {
      salads: [
       "חסה, שרי ונבטים ברוטב",
        "מטבוחה",
        "שרי בבזיליקום",
        "פלפל מתוק בצבעים",
        "סלט בטטה",
        "סלט ירוק",
      ],
      first_courses: [
        "נסיכת הנילוס מזרחי",
       "ארטישוק ממולא בשר",
       "כבדי עוף מוקפצים",
       "פילה סלמון ברוטב פסטו",
        "מוסקה בשרית",
      ],
      main_courses: [
        "כרעיים עוף ממולא",
        "חזה עוף ממולא",
          "אצבעות אסאדו בסגנון השף",
          "צלי בקר מספר 5",
          "צלי בקר מספר 6",
          "בשר ראש עם חומוס",
      ],
      side_dishes: [
        "זיתים מרוקאים",
      "ארטישוק ופטריות",
        "קוסקוס עם ירקות",
      ],
    },
  },
});
  };

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
            "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752413870/%D7%91%D7%A8_%D7%9E%D7%A6%D7%95%D7%95%D7%94_4_ij29kz.jpg')",
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
          
            <Typography variant="h5" fontWeight="bold" fontSize="1.6rem">
              בר מצווה
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom fontSize="1.2rem">
            רק ₪60 למנה
          </Typography>

         <Typography   variant="body1"  sx={{ mb: 3, lineHeight: 1.8, fontSize: "1rem", direction: "rtl" }}>

                5 סוגי סלטים לבחירה ✔  <br />
               3 מנות עיקריות לבחירה ✔<br />
               3 תוספות לבחירה ✔ <br />
               </Typography>


          <Box textAlign="center">
            <Button
              variant="contained"
              color="warning"
              onClick={handleClick}
              sx={{ borderRadius: 8, px: 4, py: 1, fontWeight: "bold" }}
            >
             להזמנת תפריט בר מצווה 
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default BarMitzvahOffer;
