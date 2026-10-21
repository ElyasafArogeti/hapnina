
import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

// תפריט אזכרות
const EngagementOffer = () => {
  const navigate = useNavigate();

  const eventImage =
    "https://res.cloudinary.com/dhkegagjk/image/upload/v1754379285/%D7%A0%D7%A8_jokrfy.webp";

  // נתוני ההזמנה המקוריים נשמרו
  const handleClick = () => {
    navigate("/GenericOrder", {
      state: {
        eventName: " אזכרות  ",
        pricePerDish: 60,
        selectionLimits: {
          salads: 5,
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
            "מוסקה בשרית",
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
            "קוסקוס עם ירקות",
            "טנזיה",
          ],
        },
      },
    });
  };

  const features = [
    "5 סוגי סלטים לבחירה",
    "3 מנות עיקריות לבחירה",
    "2 תוספות לבחירה",
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
        alt="נר זיכרון - חבילת אזכרה"
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
          חבילת אזכרה
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#bdbdbd",
            fontSize: "0.85rem",
          }}
        >
          תפריט מכובד ומוקפד לאירועי זיכרון
        </Typography>

        {/* מה כלול בחבילה */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.4,
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

        {/* מחיר */}
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
            ₪60 למנה
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
          בחירת חבילת אזכרה
        </Button>
      </Box>
    </Card>
  );
};

export default EngagementOffer;
