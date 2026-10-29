
import React from "react";
import {
  Card,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

const BritOffer = () => {
  const navigate = useNavigate();

  const eventImage =
    "https://res.cloudinary.com/dhkegagjk/image/upload/v1752409193/%D7%91%D7%A8%D7%99%D7%AA_3_i9lfck.jpg";

  const handleClick = () => {
    navigate("/GenericOrder", {
      state: {
        eventName: "ברית מילה",
        pricePerDish: 89,
        selectionLimits: {
          salads: 8,
          main_courses: 2,
          side_dishes: 3,
        },
        eventImage,
        hiddenItems: {
          salads: [
             "קינואה",
           "גזר מרוקאי מבושל",
           "תפו'א במיונז",
            "חסה, שרי ונבטים ברוטב",
            "שרי בבזיליקום",
            "פלפל מתוק בצבעים",
            "סלט ירוק",
          ],
          main_courses: [
            "כרעיים עוף ממולא",
            "חזה עוף ממולא",
            "צלי בקר מספר 5",
            "בשר ראש עם חומוס",
            "פרגית ממולא",
            "רוסטביף",
  

          ],
          side_dishes: [
            "זיתים מרוקאים",
            "ארטישוק ופטריות",
            "טנזיה",
            "פטוצ'יני"  ,
              "קוסקוס + מרק ירקות",

          ],
        },
      },
    });
  };

  const features = [
    "8 סוגי סלטים לבחירה",
    "2 מנות עיקריות לבחירה",
    "3 תוספות לבחירה",
  ];

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: 3,
        bgcolor: "#1e1e1e",
        color: "#fff",
        border: "1px solid rgba(212,175,98,0.22)",
        boxShadow: "0 6px 22px rgba(0,0,0,0.28)",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: "#c7a45a",
          boxShadow: "0 12px 30px rgba(0,0,0,0.42)",
        },
      }}
    >
      {/* תמונת החבילה */}
      <Box
        component="img"
        src={eventImage}
        alt="מבחר מנות לחבילת ברית מילה"
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          height: { xs: 155, sm: 175, md: 165 },
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* פרטי החבילה */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          p: 2,
          gap: 1.5,
          textAlign: "right",
          direction: "rtl",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: "1.15rem",
            color: "#e1c27a",
          }}
        >
          חבילת ברית מילה
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: "#bdbdbd", fontSize: "0.85rem" }}
        >
          כל מה שצריך לאירוע מושלם
        </Typography>

        {/* רשימת מה כלול בחבילה */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.2,
            my: 0.5,
          }}
        >
          {features.map((feature) => (
            <Box
              key={feature}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  color: "#c8a75e",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  color: "#e0e0e0",
                  fontSize: "0.86rem",
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* המחיר */}
        <Box
          sx={{
            mt: "auto",
            py: 1.2,
            px: 1,
            textAlign: "center",
            borderRadius: 2,
            bgcolor: "rgba(212,175,98,0.10)",
            border: "1px solid rgba(212,175,98,0.2)",
          }}
        >
          <Typography
            sx={{
              color: "#e1c27a",
              fontSize: "1.25rem",
              fontWeight: 900,
            }}
          >
            ₪89 למנה
          </Typography>
        </Box>

        {/* כפתור בחירת החבילה */}
        <Button
          fullWidth
          onClick={handleClick}
          variant="contained"
          sx={{
            py: 1.15,
            borderRadius: 2,
            fontWeight: 800,
            fontSize: "0.9rem",
            color: "#17130a",
            background:
              "linear-gradient(135deg, #f3dfa2 0%, #d4af62 55%, #b38a38 100%)",
            boxShadow: "0 4px 14px rgba(212,175,98,0.15)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #ffeab0 0%, #e0bd70 55%, #c39a49 100%)",
              boxShadow: "0 6px 18px rgba(212,175,98,0.28)",
            },
          }}
        >
         בחירת חבילת ברית מילה 
        </Button>
      </Box>
    </Card>
  );
};

export default BritOffer;