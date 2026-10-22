import  { useState } from 'react';
import TextMove from "../Main/textMove";
import NavbarHome from "../Main/NavbarHome";
import { Typography, List,  ListItemText } from "@mui/material";
import { Box, Button, Container, Card , ListItem,} from "@mui/material";
import {
  CheckCircleOutline,
  RestaurantMenu,
  SupportAgent,
  Public,
  MonetizationOn,
} from "@mui/icons-material";
import { Divider, IconButton} from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/stylesMain/home.module.css";
import Grid2 from '@mui/material/Grid2';
import Footer from './Footer';
import ContactSection from "./ContactSection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OffersSection from "../Main/Offers/OffersSection";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";


const images = [
  // כאן תכניס כתובות של תמונות (תמונות אוכל)
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_sspqpy.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157676/manager_images/main_courses/%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99%20%D7%A7%D7%91%D7%91%20%D7%9E%D7%96%D7%A8%D7%97%D7%99.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157436/manager_images/main_courses/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%20%D7%A2%D7%95%D7%A3.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411438/IMG-20250713-WA0110_qsz1ry.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0131_ugknys.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0142_i0jf67.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0135_i0cvwo.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0127_fg3nao.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0115_jsponj.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0142_i0jf67.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411432/IMG-20250713-WA0147_xasixd.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411433/IMG-20250713-WA0144_behs5i.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0146_csvwdl.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0140_hlcl56.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0141_edsu2v.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%A1%D7%9C%D7%98_%D7%91%D7%98%D7%98%D7%94_t9vgji.webp",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0129_vrhw3n.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411442/IMG-20250713-WA0094_z5u8r2.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411744/IMG-20250713-WA0133_qjb810.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411743/IMG-20250713-WA0130_vys8t0.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411746/IMG-20250713-WA0113_ron68y.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411746/IMG-20250713-WA0108_noob7d.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0123_oqu4hr.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0117_tdbquh.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0118_lnqp6n.jpg",
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0129_vrhw3n.jpg",
 
  // תוסיף כמה שאתה רוצה
];

const Home = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);


const navigate = useNavigate();

  return (
    <Box className={styles.mainHome}>
      <NavbarHome/><br/><br/><br/><br/>

       <TextMove/> 

{/*סרטון התחלתי פתיח יוקרתי – קייטרינג הפנינה */}
<Box
  sx={{
    width: "100%",
    height: { xs: "82svh", sm: "88vh", md: "92vh" },
    minHeight: { xs: 520, md: 620 },
    maxHeight: 1000,
    overflow: "hidden",
    position: "relative",
    isolation: "isolate",
    bgcolor: "#17130f",
  }}
>
  {/* תמונת גיבוי בזמן טעינת הסרטון */}
  {!videoLoaded && (
    <Box
      component="img"
      src="https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0131_ugknys.jpg"
      alt="קייטרינג הפנינה"
      sx={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center",
      }}
    />
  )}

  {/* סרטון הרקע */}
  <Box
    component="video"
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    onCanPlay={() => setVideoLoaded(true)}
    onError={() => setVideoLoaded(false)}
    sx={{
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      opacity: videoLoaded ? 1 : 0,
      transition: "opacity 1s ease",
    }}
  >
    <source
      src="https://res.cloudinary.com/dhkegagjk/video/upload/q_auto,f_auto/v1752406326/%D7%A1%D7%A8%D7%98%D7%95%D7%9F_%D7%93%D7%A3_%D7%94%D7%91%D7%99%D7%AA_dbzqoz.mp4"
      type="video/mp4"
    />
  </Box>

  {/* שכבת עומק עדינה */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      background: `
        linear-gradient(
          180deg,
          rgba(10, 8, 5, 0.32) 0%,
          rgba(10, 8, 5, 0.10) 30%,
          rgba(10, 8, 5, 0.30) 58%,
          rgba(10, 8, 5, 0.68) 78%,
          rgba(10, 8, 5, 0.88) 100%
        )
      `,
      zIndex: 1,
    }}
  />

  {/* תוכן מרכזי */}
  <Box
    sx={{
      position: "absolute",
      inset: 0,
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      px: { xs: 2.5, md: 4 },
      pt: 3,
      pb: { xs: 7, md: 9 },
      animation: "heroReveal 1.4s ease-out both",
    }}
  >
    {/* קו זהב וכותרת קטנה */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        mb: 2.5,
      }}
    >
      <Box
        sx={{
          width: { xs: 28, md: 48 },
          height: "1px",
          bgcolor: "#c6a15b",
        }}
      />

      <Typography
        sx={{
          color: "#e6c98c",
          fontSize: { xs: 13, md: 16 },
          letterSpacing: { xs: 2, md: 4 },
          fontWeight: 500,
        }}
      >
        טעמים של חוויה
      </Typography>

      <Box
        sx={{
          width: { xs: 28, md: 48 },
          height: "1px",
          bgcolor: "#c6a15b",
        }}
      />
    </Box>

    {/* שם העסק */}
    <Typography
      component="h1"
      sx={{
        color: "#fffaf0",
        fontWeight: 800,
        fontSize: {
          xs: "clamp(2.5rem, 10vw, 3.6rem)",
          sm: "3.8rem",
          md: "5.5rem",
        },
        lineHeight: 1.15,
        letterSpacing: { xs: 0, md: 1.5 },
        textShadow: "0 4px 24px rgba(0,0,0,0.35)",
        mb: 2,
      }}
    >
      קייטרינג הפנינה
    </Typography>

    {/* תת-כותרת */}
    <Typography
      sx={{
        color: "rgba(255,255,255,0.88)",
        fontSize: { xs: 16, sm: 18, md: 23 },
        fontWeight: 400,
        lineHeight: 1.8,
        maxWidth: 600,
        textShadow: "0 2px 12px rgba(0,0,0,0.45)",
      }}
    >
      טעם משובח, אירוח מוקפד ורגעים בלתי נשכחים
    </Typography>

    {/* קו זהב קטן */}
    <Box
      sx={{
        width: 54,
        height: 2,
        borderRadius: 5,
        bgcolor: "#c6a15b",
        mt: 3,
      }}
    />
  </Box>

  {/* חיווי גלילה */}
  <Box
    sx={{
      position: "absolute",
      bottom: { xs: 35, md: 48 },
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 3,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      animation: "heroBounce 2s infinite",
    }}
  >
    <Typography
      sx={{
        color: "rgba(255,255,255,0.78)",
        fontSize: 10,
        letterSpacing: 2,
      }}
    >
      גלו עוד
    </Typography>

    <Box
      sx={{
        width: 32,
        height: 32,
        border: "1px solid rgba(198,161,91,0.8)",
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        color: "#e6c98c",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="m6 9 6 6 6-6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Box>
  </Box>

  {/* מעבר הדרגתי לרקע הלבן של האתר */}
  <Box
    sx={{
      position: "absolute",
      zIndex: 2,
      bottom: 0,
      left: 0,
      width: "100%",
      height: { xs: 100, md: 150 },
      background:
        "linear-gradient(to bottom, transparent 0%, rgba(245,245,245,0.35) 45%, #f5f5f5 100%)",
      pointerEvents: "none",
    }}
  />

  {/* אנימציות */}
  <style>
    {`
      @keyframes heroReveal {
        from {
          opacity: 0;
          transform: translateY(18px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes heroBounce {
        0%, 100% {
          margin-bottom: 0;
        }
        50% {
          margin-bottom: -7px;
        }
      }
    `}
  </style>
  
</Box>



{/* שני כרטיסי קייטרינג - עיצוב שחור וזהב */}
<Container
  maxWidth={false}
  sx={{
    py: { xs: 2, md: 4 },
    px: { xs: 2, md: 4 },
    width: "100%",
    boxSizing: "border-box",
  }}
>

  <Grid2 container spacing={3} alignItems="stretch">

    {/* כרטיס 1 - אוכל מוכן */}
    <Grid2 size={{ xs: 12, md: 6 }}>
      <Card
        sx={{
          position: "relative",
          height: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0,0,0,0.22)",
          backgroundColor: "#111111",
          border: "1px solid #b89546",
          color: "#fff",
        }}
      >
        {/* סרט זהב */}
        <Box
          sx={{
            position: "absolute",
            top: 22,
            left: -39,
            width: 145,
            py: 0.8,
            textAlign: "center",
            transform: "rotate(-45deg)",
            background: "linear-gradient(135deg, #f5df9b, #b89546, #8c6a25)",
            color: "#17130a",
            fontWeight: "bold",
            fontSize: "1rem",
            zIndex: 2,
            boxShadow: 2,
          }}
        >
          חדש
        </Box>

        {/* תוכן הכרטיס */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 3, md: 2.5 },
            pt: { xs: 5, md: 3 },
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#e5c46a",
              mb: 1.5,
              fontSize: { xs: "1.7rem", md: "1.8rem" },
            }}
          >
            משלוח אוכל מוכן
          </Typography>

          <Divider
            sx={{
              width: 65,
              height: 4,
              borderRadius: 5,
              backgroundColor: "#c6a24b",
              mb: 2,
              border: 0,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#fff",
              mb: 1.5,
              fontSize: { xs: "1.1rem", md: "1.2rem" },
            }}
          >
           ! סל הקניות המשתלם ביותר 
          </Typography>

          <Typography
            sx={{
              color: "#d1d1d1",
              fontSize: { xs: "0.95rem", md: "0.95rem" },
              lineHeight: 1.8,
              mb: 2,
            }}
          >
            הוסיפו לסל הקניות מבחר מנות עשיר ומגוון מבלי לצאת מהבית
           צפו בתפריט הכולל מנות עשירות והזמינו ישירות מהאתר
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.05rem" },
              fontWeight: 800,
              color: "#e5c46a",
              mb: 0.5,
            }}
          >
             ? לאילו אירועים אפשר להזמין
          </Typography>

          <List
            dense
            sx={{
              width: "100%",
              maxWidth: 300,
              p: 0,
              mb: 1,
            }}
          >
            {[
              "אזכרות",
              "ברית מילה",
              "בר/בת מצווה",
              "כנסים ואירועי תרבות",
              "שמחה משפחתית ועוד",
            ].map((item) => (
              <ListItem
                key={item}
                sx={{ py: 0.25, px: 0, gap: 1 }}
              >
                <CheckCircleIcon
                  sx={{ color: "#d4b45f", fontSize: 21 }}
                />
                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    fontSize: { xs: "0.95rem", md: "0.95rem" },
                    color: "#e0e0e0",
                    textAlign: "right",
                  }}
                />
              </ListItem>
            ))}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="contained"
            href="/MainCourse"
            endIcon={<ArrowBackIcon />}
            sx={{
              mt: 2,
              px: { xs: 3, md: 2.5 },
              py: 1.3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #f5df9b, #c6a24b, #a47b25)",
              color: "#17130a",
              fontSize: { xs: "0.95rem", md: "0.9rem" },
              fontWeight: 800,
              boxShadow: "0 5px 14px rgba(198,162,75,0.22)",
              "&:hover": {
                background: "linear-gradient(135deg, #ffe9a8, #d4b45f, #b89546)",
                boxShadow: "0 7px 18px rgba(198,162,75,0.35)",
              },
            }}
          >
            להזמנת אוכל מוכן לחצו
          </Button>
        </Box>

        {/* תמונת האוכל */}
        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            height: { xs: 260, md: "auto" },
            minHeight: { md: 480 },
            p: { xs: 1.5, md: 1.5 },
            boxSizing: "border-box",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0131_ugknys.jpg"
            alt="מבחר מנות אוכל מוכן של קייטרינג הפנינה"
            sx={{
              width: "100%",
              height: { xs: 260, md: "100%" },
              minHeight: { md: 450 },
              objectFit: "cover",
              display: "block",
              borderRadius: 3,
              border: "1px solid #b89546",
            }}
          />
        </Box>
      </Card>
    </Grid2>

    {/* כרטיס 2 - הזמנות תפריטים אונליין */}
    <Grid2 size={{ xs: 12, md: 6 }}>
      <Card
        sx={{
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
          p: { xs: 3, md: 4 },
          height: "100%",
          boxSizing: "border-box",
          borderRadius: 4,
          textAlign: "center",
          background: "linear-gradient(180deg, #1c1c1c 0%, #0b0b0b 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #b89546",
          color: "#fff",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 14px 32px rgba(198,162,75,0.18)",
          },
        }}
      >
        {/* פס עיצוב עליון בזהב */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 7,
            background: "linear-gradient(90deg, #8c6a25, #f5df9b, #b89546)",
          }}
        />

        {/* סמל */}
        <Box
          sx={{
            mt: 1,
            mb: 2,
            width: 66,
            height: 66,
            borderRadius: "22px",
            background: "linear-gradient(135deg, #f5df9b, #b89546)",
            color: "#17130a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "inset 0 0 0 1px #f5df9b",
          }}
        >
          <RestaurantMenuIcon sx={{ fontSize: 36 }} />
        </Box>

        <Typography
          variant="overline"
          sx={{
            color: "#d4b45f",
            fontWeight: 800,
            letterSpacing: 1,
            fontSize: "0.8rem",
          }}
        >
          מזמינים בקלות ובנוחות
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#f5df9b",
            mt: 1,
            mb: 2,
            fontSize: { xs: "1.20rem", md: "1.7rem" },
          }}
        >
       תפריט כללי - הצעת מחיר במקום
        </Typography>

        <Box
          sx={{
            width: 55,
            height: 3,
            borderRadius: 5,
            backgroundColor: "#c6a24b",
            mb: 2.5,
          }}
        />

        <Typography
          sx={{
            textAlign: "center",
            mb: 3,
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.9,
            color: "#d1d1d1",
          }}
        >
          אצלנו תוכלו לבחור תפריט מתאים, למלא את הפרטים
          ולקבל הצעת מחיר פשוטה, נוחה ומהירה במקום 
        </Typography>

        {/* אזור סוגי האירועים */}
        <Box
          sx={{
            width: "100%",
            backgroundColor: "#171717",
            border: "1px solid #8c6a25",
            borderRadius: 3,
            p: { xs: 2, md: 2.5 },
            mb: 2,
            boxSizing: "border-box",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              color: "#e5c46a",
              mb: 1.5,
              fontSize: "1.05rem",
            }}
          >
          : מתאימים לכל סוגי האירועים
          </Typography>

          <List dense sx={{ p: 0 }}>
            {[
              "חתונות",
              "אירוסין", 
              "בר/בת מצווה",
              "ברית מילה",
              "אזכרות",
              "שמחות משפחתיות ועוד",

            ].map((item) => (
              <ListItem
                key={item}
                sx={{
                  py: 0.55,
                  px: 0,
                  gap: 1.2,
                  borderBottom: "1px solid #333",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                }}
              >
                <CheckCircleIcon
                  sx={{
                    color: "#d4b45f",
                    fontSize: 21,
                    flexShrink: 0,
                  }}
                />

                <ListItemText
                  primary={item}
                  primaryTypographyProps={{
                    textAlign: "right",
                    fontSize: { xs: "0.92rem", md: "0.98rem" },
                    color: "#e0e0e0",
                    fontWeight: 500,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Typography
          sx={{
            color: "#bdbdbd",
            fontSize: "0.9rem",
            mb: 1,
          }}
        >
          התפריט המתאים לאירוע שלכם מתחיל כאן
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* כפתור הזמנת תפריט */}
        <Button
          variant="contained"
          href="/ordersOnline"
          endIcon={<ArrowBackIcon />}
          sx={{
            mt: 2,
            px: { xs: 3, md: 4 },
            py: 1.4,
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f5df9b, #c6a24b, #a47b25)",
            color: "#17130a",
            fontWeight: 800,
            fontSize: { xs: "0.95rem", md: "1rem" },
            boxShadow: "0 5px 14px rgba(198,162,75,0.22)",
            "&:hover": {
              background: "linear-gradient(135deg, #ffe9a8, #d4b45f, #b89546)",
              boxShadow: "0 8px 20px rgba(198,162,75,0.35)",
            },
          }}
        >
          להזמנת תפריט לחצו
        </Button>
      </Card>
    </Grid2>

  </Grid2>
</Container>



{/* שאלות נפוצות – עמוד הבית */}
<Box
  dir="rtl"
  sx={{
    py: { xs: 5, md: 7 },
    px: 2,
    background: "linear-gradient(135deg, #171614, #252019)",
  }}
>
  <Box sx={{ maxWidth: 850, mx: "auto" }}>
    <Typography
      sx={{
        color: "#C9A96E",
        textAlign: "center",
        fontSize: 12,
        letterSpacing: 2,
        mb: 1,
        fontWeight: 700,
      }}
    >
      HAPNINA CATERING
    </Typography>

    <Typography
      component="h2"
      sx={{
        color: "#F5E9D0",
        textAlign: "center",
        fontSize: { xs: 26, md: 34 },
        fontWeight: 800,
        mb: 1,
      }}
    >
      שאלות נפוצות
    </Typography>

    <Typography
      sx={{
        color: "#C7BDAA",
        textAlign: "center",
        mb: 4,
        fontSize: 14,
      }}
    >
      כל מה שחשוב לדעת לפני שמזמינים
    </Typography>

    {[
      {
        question: "איזו כשרות יש לקייטרינג הפנינה?",
        answer:
          'האוכל בכשרות בד"ץ "יורה דעה" של הרב מחפוד שליט"א.',
      },
      {
        question: "כמה זמן מראש צריך להזמין?",
        answer:
          "יש לתאם את ההזמנה לפחות 72 שעות מראש.",
      },
      {
        question: "לאילו אזורים אתם מבצעים משלוחים?",
        answer:
          "המשלוחים מתבצעים מאזור באר שבע ועד אזור הרצליה, כפר סבא וצפון רמת השרון. עלות המשלוח נקבעת בהתאם לאזור.",
      },
    ].map((faq, index) => (
      <Accordion
        key={index}
        disableGutters
        elevation={0}
        sx={{
          mb: 1.5,
          color: "#F5E9D0",
          backgroundColor: "#211F1B",
          border: "1px solid #51432D",
          borderRadius: "10px !important",
          "&::before": { display: "none" },
          "&:hover": { borderColor: "#C9A96E" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <ExpandMoreIcon sx={{ color: "#C9A96E" }} />
          }
          sx={{ px: 2.5, py: 0.5 }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: 15 }}>
            {faq.question}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
          <Typography
            sx={{
              color: "#D0C7B7",
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            {faq.answer}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ))}

    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Button
        onClick={() => navigate("/FAQAccordion")}
        variant="outlined"
        sx={{
          color: "#D9BD86",
          borderColor: "#9C7B47",
          borderRadius: "10px",
          px: 4,
          py: 1.2,
          fontWeight: 700,
          "&:hover": {
            borderColor: "#E4CC9D",
            backgroundColor: "rgba(201,169,110,0.08)",
          },
        }}
      >
        לכל השאלות והתשובות
      </Button>
    </Box>
  </Box>
</Box>



{/* קטע החבילות  */}
<OffersSection />




{/* ------------------------------------------------------------------------------------- */}


{/* חבילה של כמה אלמנטים */}
 <Box sx={{ width: "100%",  overflowX: "hidden",  boxSizing: "border-box",  padding: 0,  margin: 0, }}>
   



{/* כרטיס המיוחדות שלנו - עיצוב שחור וזהב */}
<Container
  maxWidth="xl"
  sx={{
    py: { xs: 3, md: 6 },
    direction: "rtl",
  }}
>

  <Grid2
    container
    spacing={{ xs: 2, md: 0 }}
    alignItems="stretch"
    sx={{
      overflow: "hidden",
      borderRadius: { xs: 3, md: 5 },
      background:
        "linear-gradient(145deg, #1c1c1c 0%, #090909 65%, #17130b 100%)",
      border: "1px solid rgba(212,175,98,0.35)",
      boxShadow: "0 12px 40px rgba(0,0,0,0.3)",
    }}
  >

    {/* התמונה */}
    <Grid2 size={{ xs: 12, md: 6 }} order={{ xs: 2, md: 1 }}>
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          alignItems: "center",
          height: { xs: 250, sm: 350, md: "100%" },
          minHeight: { md: 560 },
          overflow: "hidden",
          "&:hover img": {
            transform: "scale(1.04)",
          },
        }}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dhkegagjk/image/upload/v1755027385/pexels-elina-sazonova-1838607_wj6n0u.jpg"
          alt="אירוע יוקרתי מבית קייטרינג הפנינה"
          loading="lazy"
          sx={{
            display: "block",
            width: "100%",
            height: "100%",
            minHeight: { md: 560 },
            objectFit: "cover",
            objectPosition: "center",
            transition: "transform 0.6s ease",
          }}
        />

        {/* הצללה הדרגתית בגווני שחור וזהב */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: {
              xs: "linear-gradient(180deg, transparent 60%, rgba(9,9,9,0.65) 100%)",
              md: "linear-gradient(270deg, transparent 60%, rgba(9,9,9,0.5) 100%)",
            },
          }}
        />

        {/* תווית על התמונה */}
        <Box
          sx={{
            position: "absolute",
            bottom: { xs: 16, md: 24 },
            right: { xs: 16, md: 24 },
            px: 2,
            py: 1,
            borderRadius: 2,
            color: "#f5df9b",
            background: "rgba(10,10,10,0.78)",
            border: "1px solid rgba(212,175,98,0.4)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Typography sx={{ fontSize: "0.85rem", fontWeight: 800 }}>
            קייטרינג הפנינה | חוויה של טעם
          </Typography>
        </Box>
      </Box>
    </Grid2>

    {/* אזור התוכן */}
    <Grid2 size={{ xs: 12, md: 6 }} order={{ xs: 1, md: 2 }}>
      <Box
        sx={{
          height: "100%",
          minHeight: { md: 560 },
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          flexDirection: "column",
          justifyContent: "center",
          p: { xs: 2.5, sm: 4, md: 5 },
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        {/* כותרת קטנה */}
        <Typography
          sx={{
            color: "#d4af62",
            fontSize: "0.8rem",
            fontWeight: 800,
            letterSpacing: 3,
            mb: 1.5,
          }}
        >
          THE PEARL EXPERIENCE
        </Typography>

        {/* כותרת ראשית */}
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "2.6rem" },
            fontWeight: 900,
            lineHeight: 1.25,
            mb: 1.5,
            background:
              "linear-gradient(135deg, #fff1bd 0%, #d4af62 55%, #f5df9b 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          המיוחדות שלנו
        </Typography>

        {/* קו זהב */}
        <Box
          sx={{
            width: 75,
            height: 3,
            borderRadius: 5,
            mb: 2.5,
            background:
              "linear-gradient(90deg, #a47b25, #f5df9b, #a47b25)",
          }}
        />
        {/* כל התוכן  */}
        <Typography
          sx={{
            color: "#d0d0d0",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            lineHeight: 1.9,
            mb: 3,
          }}
        >
          בקייטרינג הפנינה כל אירוע מקבל יחס אישי,
          אוכל עשיר ושירות מוקפד — מהתכנון ועד הרגע האחרון.
        </Typography>

        {/* היתרונות שלנו */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.2,
          }}
        >
          {[
            {
              icon: <CheckCircleOutline />,
              title: "אמינות ושקיפות",
              text: "ליווי אישי ותיאום ציפיות לאורך כל הדרך.",
            },
            {
              icon: <RestaurantMenu />,
              title: "אוכל ברמה גבוהה",
              text: "תפריטים מגוונים, מנות טריות והגשה מוקפדת.",
            },
            {
              icon: <SupportAgent />,
              title: "שירות מכל הלב",
              text: "אנחנו כאן בשבילכם, משלב התכנון ועד האירוע.",
            },
            {
              icon: <MonetizationOn />,
              title: "הזמנה פשוטה אונליין",
              text: "בוחרים חבילה ומקבלים הצעת מחיר בקלות.",
            },
          ].map((item, index) => (
            <Box
              key={item.title}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2,
                  color: "#e1c27a",
                  background: "rgba(212,175,98,0.10)",
                  border: "1px solid rgba(212,175,98,0.25)",
                  "& svg": { fontSize: 21 },
                }}
              >
                {item.icon}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: "#f0d58f",
                    fontWeight: 800,
                    fontSize: "1rem",
                    mb: 0.3,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#c5c5c5",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                  }}
                >
                  {item.text}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* כפתור יצירת קשר */}
        <Button
          variant="contained"
          endIcon={<ArrowBackIcon />}
          href="/contact"
          sx={{
           alignSelf: "center",
            mt: 4,
            px: 4,
            py: 1.4,
            textAlign: "center",
             alignItems: "center",
            borderRadius: 2,
            fontWeight: 900,
            fontSize: "0.95rem",
            color: "#17130a",
            background:
              "linear-gradient(135deg, #f5df9b 0%, #d4af62 55%, #a47b25 100%)",
            boxShadow: "0 5px 18px rgba(198,162,75,0.18)",
            transition: "all 0.3s ease",
            "&:hover": {
              background:
                "linear-gradient(135deg, #fff0b5, #dfbd62, #b58b32)",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 24px rgba(198,162,75,0.3)",
            },
          }}
        >
          בואו נתכנן את האירוע שלכם
        </Button>
      </Box>
    </Grid2>

    


  </Grid2>
</Container>

{/* -------------------------------------------------------- */}

{/* קטע תמונה שקופה 2 */}
<Box
  sx={{
    width: "100%",
    minHeight: "500px",
    backgroundImage: "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752410371/IMG-20250713-WA0106_oenesp.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    display: "flex",
    alignItems: "center", // מרכז אנכי
    justifyContent: "center", // מרכז אופקי
    textAlign: "center",
      pointerEvents: "none",
  }}
>
 <Typography
      component="h2"
      sx={{
        fontSize: { xs: "1.8rem", md: "3rem" },
        fontWeight: 900,
        lineHeight: 1.4,
        background:
          "linear-gradient(110deg, #fff1bd, #d4af62 50%, #a47b25)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 2,
      }}
    >
    ״חוויה בלתי נשכחת״
    </Typography>
</Box>


{/* -----------קטע מבדיל----------------------------------------------- */}
<br /><br />

<Box
  sx={{
    width: "100%",
    minHeight: { xs: 320, md: 390 },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    px: 2,
    py: 7,
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
    background:
      "radial-gradient(ellipse at center, #191610 0%, #0b0b0b 60%, #050505 100%)",
    "@keyframes pearlGlow": {
      "0%,100%": { opacity: 0.25, transform: "scale(1)" },
      "50%": { opacity: 0.5, transform: "scale(1.08)" },
    },
    "@keyframes pearlFade": {
      from: { opacity: 0, transform: "translateY(18px)" },
      to: { opacity: 1, transform: "translateY(0)" },
    },
  }}
 >
  {/* הילה זהובה */}
  <Box
    sx={{
      position: "absolute",
      width: 500,
      height: 500,
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(212,175,98,.13), transparent 70%)",
      animation: "pearlGlow 7s ease-in-out infinite",
      pointerEvents: "none",
    }}
  />

  {/* מסגרת */}
  <Box
    sx={{
      position: "absolute",
      inset: { xs: 12, md: 22 },
      border: "1px solid rgba(212,175,98,.18)",
      pointerEvents: "none",
    }}
  />

  {/* תוכן */}
  <Box
    sx={{
      maxWidth: 760,
      width: "100%",
      position: "relative",
      animation: "pearlFade 1.2s ease-out both",
    }}
  >
    <Typography
      sx={{
        color: "#d4af62",
        fontSize: ".75rem",
        fontWeight: 800,
        letterSpacing: 4,
        mb: 3,
      }}
    >
     DREAMY CATERING
    </Typography>

    <Typography
      component="h2"
      sx={{
        fontSize: { xs: "1.8rem", md: "3rem" },
        fontWeight: 900,
        lineHeight: 1.4,
        background:
          "linear-gradient(110deg, #fff1bd, #d4af62 50%, #a47b25)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        mb: 2,
      }}
    >
      ״תנו לנו לשדרג לכם את החלום״
    </Typography>

    {/* קו הפרדה זהוב */}
    <Box
      sx={{
        width: 120,
        height: 2,
        mx: "auto",
        my: 3,
        background:
          "linear-gradient(90deg, transparent, #fff1bd, #a47b25, transparent)",
        boxShadow: "0 0 14px rgba(212,175,98,.25)",
      }}
    />

    <Typography
      sx={{
        color: "#ded8ca",
        fontSize: { xs: ".95rem", md: "1.15rem" },
        lineHeight: 1.9,
      }}
    >
      תכנון האירוע המושלם מתחיל כאן
    </Typography>

    <Typography
      sx={{
        color: "#d4af62",
        fontSize: ".7rem",
        fontWeight: 700,
        letterSpacing: 3,
        mt: 3,
      }}
    >
      ✦ קייטרינג הפנינה ✦
    </Typography>
  </Box>
</Box>





</Box>

{/* ------------------------------------------------------------ */}
{/* גלריה משודרגת */}
<Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#000000" }}>
  <Box sx={{ textAlign: "center", mb: 6 }}>
    <Typography
      variant="h4"
      fontWeight="bold"
      sx={{
        color: "#d4af62",
        fontSize: { xs: "1.8rem", md: "2.5rem" },
        mb: 1,
      }}
    >
      🍽️ גלריית הטעמים שלנו
    </Typography>

    {/* קו דקורטיבי מתחת לכותרת */}
    <Box
      sx={{
        width: "80px",
        height: "4px",
        margin: "0 auto",
        background: "linear-gradient(90deg, #f5a623, #ff6f61)",
        borderRadius: "2px",
      }}
    />
  </Box>

  <Grid2 container spacing={3} justifyContent="center">
    {images.map((img, index) => (
      <Grid2 size={{ xs: 6, sm: 3 }} key={index}>
        <Box
          component="img"
          src={img}
          alt={`gallery-img-${index}`}
          loading="lazy"
          className="fade-in"
          sx={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            borderRadius: 3,
            boxShadow: 2,
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 6,
            },
          }}
        />
      </Grid2>
    ))}
  </Grid2>

  {/* CSS אנימציה */}
  <style>
    {`
      .fade-in {
        opacity: 0;
        animation: fadeInSmooth 1.5s ease-in-out forwards;
      }

      @keyframes fadeInSmooth {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `}
  </style>
</Box>





{/* ---------------------------------------------------------------- */}

      {/* השארת פרטים ופוטר  */}
      <Box  sx={{backgroundColor: "#000"}}>  
      <ContactSection/> 
        <Footer />
      </Box>
      


{/* כפתורי קשר צפים - וואטסאפ וטלפון */}
<Box
  sx={{
    position: "fixed",
    right: { xs: 14, md: 24 },
    bottom: { xs: 60, md: 60 },
    zIndex: 1500,
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
    alignItems: "center",
  }}
>
  {/* WhatsApp */}
  <IconButton
    component="a"
    href="https://wa.me/972548520195"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="שלחו לנו הודעה בוואטסאפ"
    sx={{
      width: { xs: 52, md: 58 },
      height: { xs: 52, md: 58 },
      color: "#fff",
      bgcolor: "#25D366",
      boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
      border: "2px solid #fff",
      transition: "transform .25s ease, box-shadow .25s ease",
      "&:hover": {
        bgcolor: "#1ebe5d",
        transform: "scale(1.08)",
        boxShadow: "0 8px 22px rgba(37,211,102,0.35)",
      },
    }}
  >
    <WhatsAppIcon sx={{ fontSize: { xs: 29, md: 33 } }} />
  </IconButton>

  {/* שיחת טלפון */}
  <IconButton
    component="a"
    href="tel:+972548520195"
    aria-label="התקשרו אלינו"
    sx={{
      width: { xs: 52, md: 58 },
      height: { xs: 52, md: 58 },
      color: "#17130a",
      background: "linear-gradient(135deg, #f5df9b, #c6a24b)",
      boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
      border: "2px solid #fff",
      transition: "transform .25s ease, box-shadow .25s ease",
      "&:hover": {
        background: "linear-gradient(135deg, #ffe9a8, #d4b45f)",
        transform: "scale(1.08)",
        boxShadow: "0 8px 22px rgba(198,162,75,0.35)",
      },
    }}
  >
    <PhoneIcon sx={{ fontSize: { xs: 26, md: 30 } }} />
  </IconButton>
</Box>

    </Box>
  );
};

export default Home;
