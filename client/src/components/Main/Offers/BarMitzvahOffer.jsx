
import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import barmitzvah from "../../../assets/imgs/barmitzvah.png";

const BarMitzvahOffer = () => {
  const navigate = useNavigate();

   const eventImage = barmitzvah;

  // נתוני ההזמנה נשמרו ללא שינוי
  const handleClick = () => {
    navigate("/GenericOrder", {
      state: {
        eventName: "בר/בת מצווה",
        pricePerDish: 110,
        selectionLimits: {
          salads: 5,
          first_courses: 3,
          main_courses: 3,
          side_dishes: 2,
        },
        eventImage,
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
           "פילה סלמון ברוטב אדם",
            "מוסקה בשרית",
            "מאפה פילו במילוי פרגית",
            "קרואסון אסאדו",
            "דג טונה",
          ],
          main_courses: [
            "כרעיים עוף ממולא",
            "חזה עוף ממולא",
              "אצבעות אסאדו בסגנון השף",
              "צלי בקר מספר 5",
              "צלי בקר מספר 6",
              "בשר ראש עם חומוס",
              "פרגית ממולא",
          ],
          side_dishes: [
            "זיתים מרוקאים",
          "ארטישוק ופטריות",
          "קוסקוס + מרק ירקות",
            "טנזיה",
          ],
        },
      },
    });
  };


  const features = [
    <>
      8 סוגי סלטים לבחירה
    </>,
    <>
      2 מנות ראשונות
      <Box
        component="span"
        sx={{ color: "#bdbdbd", fontSize: "0.75rem" }}
      >
        {" "}
        (מעל 90 איש – 3 לבחירה)
      </Box>
    </>,
    <>
      2 מנות עיקריות
      <Box
        component="span"
        sx={{ color: "#bdbdbd", fontSize: "0.75rem" }}
      >
        {" "}
        (מעל 90 איש – 3 לבחירה)
      </Box>
    </>,
    <>
      3 תוספות לבחירה
    </>,
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
        alt="חבילת בר מצווה - אולם האירועים הפנינה"
        loading="lazy"
        sx={{
          display: "block",
          width: "100%",
          height: { xs: 155, sm: 175, md: 165 },
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      {/* תוכן הכרטיס */}
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
         חבילת בר/בת מצווה 
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#bdbdbd",
            fontSize: "0.85rem",
          }}
        >
          חוגגים  בר/בת מצווה  עם תפריט עשיר ומגוון
        </Typography>

        {/* פירוט החבילה */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.4,
            my: 0.5,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1,
              }}
            >
              <CheckCircleOutlineIcon
                sx={{
                  color: "#c8a75e",
                  fontSize: 17,
                  flexShrink: 0,
                  mt: "2px",
                }}
              />

              <Typography
                component="div"
                variant="body2"
                sx={{
                  color: "#e0e0e0",
                  fontSize: "0.86rem",
                  lineHeight: 1.6,
                }}
              >
                {feature}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* מחיר למנה */}
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
            ₪110 למנה
          </Typography>
        </Box>

        {/* כפתור להזמנת החבילה */}
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
        בחירת חבילת בר/בת מצווה 
        </Button>
      </Box>
    </Card>
  );
};

export default BarMitzvahOffer;
