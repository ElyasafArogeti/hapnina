import React from "react";
import { Card, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";



const PACKAGES = [



    //  בר מצווה
  {
    id: "barmitzva",
    title: "חבילת בר/בת מצווה",
    subtitle: "חוגגים בר/בת מצווה עם תפריט עשיר ומגוון",
    buttonText: "בחירת חבילת בר/בת מצווה",
    imageAlt: "חבילת בר מצווה - אולם האירועים הפנינה",
    image: 
    "https://res.cloudinary.com/dhkegagjk/image/upload/v1795002343/%D7%97%D7%92%D7%99%D7%92%D7%AA_%D7%91%D7%A8_%D7%95%D7%91%D7%AA_%D7%9E%D7%A6%D7%95%D7%95%D7%94_%D7%97%D7%92%D7%99%D7%92%D7%99%D7%AA_ypm6ct.png",
    pricePerDish: 110,
    features: [
      { text: "8 סוגי סלטים לבחירה" },
      { text: "2 מנות ראשונות", note: "(מעל 90 איש – 3 לבחירה)" },
      { text: "2 מנות עיקריות", note: "(מעל 90 איש – 3 לבחירה)" },
      { text: "3 תוספות לבחירה" },
    ],
    order: {
      eventName: "בר/בת מצווה",
      minGuests: 60,
      selectionLimits: {
        salads: 8,
        first_courses: 2,
        main_courses: 2,
        side_dishes: 2,
      },
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
  },





//   ברית מילה 
  {
    id: "brit",
    title: "חבילת ברית מילה",
    subtitle: "כל מה שצריך לאירוע ברית מושלם",
    buttonText: "בחירת חבילת ברית מילה",
    imageAlt: "מבחר מנות לחבילת ברית מילה",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752409193/%D7%91%D7%A8%D7%99%D7%AA_3_i9lfck.jpg",
    pricePerDish: 89,
    features: [
      { text: "8 סוגי סלטים לבחירה" },
      { text: "2 מנות עיקריות לבחירה" },
      { text: "3 תוספות לבחירה" },
    ],
    order: {
      eventName: "ברית מילה",
      minGuests: 30,
      selectionLimits: { salads: 8, main_courses: 2, side_dishes: 3 },
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
          "פטוצ'יני",
          "קוסקוס + מרק ירקות",
        ],
      },
    },
  },





//    אזכרות 
  {
    id: "azkara",
    title: "חבילת אזכרה",
    subtitle: "תפריט מכובד ומוקפד לאירועי זיכרון",
    buttonText: "בחירת חבילת אזכרה",
    imageAlt: "נר זיכרון - חבילת אזכרה",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1793523780/%D7%90%D7%95%D7%94%D7%9C_%D7%90%D7%96%D7%9B%D7%A8%D7%94_%D7%95%D7%A0%D7%A8_%D7%96%D7%99%D7%9B%D7%A8%D7%95%D7%9F_cnyrla.png",
    pricePerDish: 77,
    features: [
      { text: "5 סוגי סלטים לבחירה" },
      { text: "2 מנות עיקריות לבחירה" },
      { text: "2 תוספות לבחירה" },
    ],
    order: {
      eventName: " אזכרות ", // נשאר עם הרווחים כמו במקור
      minGuests: 30,
      selectionLimits: { salads: 5, main_courses: 2, side_dishes: 2 },
      hiddenItems: {
        salads: [
          "חסה, שרי ונבטים ברוטב",
          "סלט ירוק",
          "קינואה",
          "גזר מרוקאי מבושל",
          "תפו'א במיונז",
          "סלט בטטה",
        ],
        main_courses: [
          "כרעיים עוף ממולא",
          "חזה עוף ממולא",
          "אצבעות אסאדו בסגנון השף",
          "צלי בקר מספר 5",
          "צלי בקר מספר 6",
          "בשר ראש עם חומוס",
          "פרגית ממולא",
          "רוסטביף",
        ],
        side_dishes: ["ארטישוק ופטריות", "טנזיה", "פטוצ'יני"],
      },
    },
  },


//   שבתות 
  {
    id: "sabbath",
    title: "חבילת שבתות מפואר",
    subtitle: "תפריט מלא ומפנק לשבת חתן או שבת משפחתית",
    buttonText: "כנסו לתפריט שבתות",
    imageAlt: "תפריט GOLD - אולם האירועים הפנינה",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1791904848/%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%A9%D7%91%D7%AA_jmcv5t.jpg",
    pricePerDish: 190,
    pricePrefix: "רק ",
    features: [
      { text: "8 סוגי סלטים לבחירה" },
      { text: "2 סוגי דגים לבחירה" },
      { text: "2 סוגי עופות ובשרים לבחירה" },
      { text: "2 תוספות לבחירה" },
    ],
    route: "/Sabbath", 
  },
];





/* ================================================================
   עיצוב משותף
   ================================================================ */
const IMG_HEIGHT = { xs: 155, sm: 175, md: 165 };

const cardSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  borderRadius: 3,
  bgcolor: "#1e1e1e",
  color: "#fff",
  border: "1px solid rgba(212,175,98,0.22)",
  boxShadow: "0 6px 22px rgba(0,0,0,0.28)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
  "&:hover": {
    transform: "translateY(-5px)",
    borderColor: "#c7a45a",
    boxShadow: "0 12px 30px rgba(0,0,0,0.42)",
  },
};

const buttonSx = {
  py: 1.15,
  borderRadius: 2,
  fontWeight: 800,
  fontSize: "0.9rem",
  color: "#17130a",
  background: "linear-gradient(135deg, #f3dfa2 0%, #d4af62 55%, #b38a38 100%)",
  boxShadow: "0 4px 14px rgba(212,175,98,0.15)",
  "&:hover": {
    background: "linear-gradient(135deg, #ffeab0 0%, #e0bd70 55%, #c39a49 100%)",
    boxShadow: "0 6px 18px rgba(212,175,98,0.28)",
  },
};

/* ================================================================
   כרטיס חבילה גנרי
   ================================================================ */
const PackageCard = ({ pkg }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (pkg.route) {
      navigate(pkg.route);
      return;
    }
    navigate("/GenericOrder", {
      state: {
        eventName: pkg.order.eventName,
        minGuests: pkg.order.minGuests,
        pricePerDish: pkg.pricePerDish,
        selectionLimits: pkg.order.selectionLimits,
        eventImage: pkg.image,
        hiddenItems: pkg.order.hiddenItems,
      },
    });
  };

  return (
    <Card sx={cardSx}>
      {/* תמונת החבילה */}
      <Box
        component="img"
        src={pkg.image}
        alt={pkg.imageAlt}
        loading="lazy"
        sx={{ display: "block", width: "100%", height: IMG_HEIGHT, objectFit: "cover", objectPosition: "center" }}
      />

      {/* תוכן הכרטיס */}
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, p: 2, gap: 1.5, textAlign: "right", direction: "rtl" }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.15rem", color: "#e1c27a" }}>
          {pkg.title}
        </Typography>

        <Typography variant="body2" sx={{ color: "#bdbdbd", fontSize: "0.85rem", lineHeight: 1.7 }}>
          {pkg.subtitle}
        </Typography>

        {/* מה כלול בחבילה */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.4, my: 0.5 }}>
          {pkg.features.map((f) => (
            <Box key={f.text} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ color: "#c8a75e", fontSize: 17, flexShrink: 0, mt: "2px" }} />
              <Typography component="div" variant="body2" sx={{ color: "#e0e0e0", fontSize: "0.86rem", lineHeight: 1.6 }}>
                {f.text}
                {f.note && (
                  <Box component="span" sx={{ color: "#bdbdbd", fontSize: "0.75rem" }}>
                    {" "}
                    {f.note}
                  </Box>
                )}
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
          <Typography sx={{ color: "#e1c27a", fontSize: "1.25rem", fontWeight: 900 }}>
            {pkg.pricePrefix || ""}₪{pkg.pricePerDish} למנה
          </Typography>
        </Box>

        {/* כפתור בחירה */}
        <Button fullWidth onClick={handleClick} variant="contained" sx={buttonSx}>
          {pkg.buttonText}
        </Button>
      </Box>
    </Card>
  );
};

/* ================================================================
   כל החבילות ברשת אחת (אפשר גם לייבא רק PACKAGES ו-PackageCard)
   ================================================================ */
const Packages = () => (
  <Grid container spacing={3} alignItems="stretch">
    {PACKAGES.map((pkg) => (
      <Grid key={pkg.id} size={{ xs: 12, sm: 6, lg: 3 }}>
        <PackageCard pkg={pkg} />
      </Grid>
    ))}
  </Grid>
);

export default Packages;
export { PACKAGES, PackageCard };