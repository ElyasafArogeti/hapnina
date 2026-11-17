import React from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Button,
  Link as MuiLink,
} from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Link } from "react-router-dom";
import logo from "../../assets/imgs/logonew.png";

const GOLD = "#C9A96E";
const GOLD_LIGHT = "#E4CC9D";
const INK = "#171614";

// עיצוב משותף לכל הקישורים ברשימות
const linkSx = {
  display: "block",
  color: "#C7BDAA",
  fontSize: 14.5,
  lineHeight: 1.6,
  py: 0.6,
  textDecoration: "none",
  transition: "color 0.2s ease, transform 0.2s ease",
  "&:hover": {
    color: GOLD_LIGHT,
    transform: "translateX(-4px)",
  },
  "&:focus-visible": {
    outline: `2px solid ${GOLD}`,
    outlineOffset: 3,
    borderRadius: "4px",
  },
};

// כותרת עמודה עם קו זהב קצר צמוד מעליה
const ColumnTitle = ({ children }) => (
  <Box
    sx={{
      mb: 2.5,
      display: "flex",
      // בטלפון הכותרת במרכז העמוד, במחשב היא נשארת בצד ימין של העמודה
      justifyContent: { xs: "center", md: "flex-start" },
    }}
  >
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* הקו הזהב צמוד מעל הכותרת, ממורכז מעל אמצע הטקסט */}
      <Box
        sx={{
          mb: 0.8,
          width: 34,
          height: "2px",
          borderRadius: 2,
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
        }}
      />
      <Typography
        component="h3"
        sx={{ color: "#F5E9D0", fontWeight: 800, fontSize: 18, textAlign: "center" }}
      >
        {children}
      </Typography>
    </Box>
  </Box>
);

// שורת פרטי קשר עם אייקון בריבוע שחור-זהב
const ContactRow = ({ icon, children }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      // בטלפון השורה במרכז המסך, במחשב היא נשארת בצד ימין
      justifyContent: { xs: "center", md: "flex-start" },
      gap: 1.5,
      mb: 1.8,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#1d1b18",
        border: "1px solid #393024",
        color: GOLD,
      }}
    >
      {icon}
    </Box>
    <Box
      sx={{
        color: "#C7BDAA",
        fontSize: 14.5,
        lineHeight: 1.7,
        pt: 0.2,
        textAlign: { xs: "center", md: "right" },
      }}
    >
      {children}
    </Box>
  </Box>
);

const contactLinkSx = {
  color: "#F1D7A5",
  textDecoration: "none",
  "&:hover": { color: GOLD_LIGHT, textDecoration: "underline" },
};

const Footer = () => {
  return (
    <Box
      component="footer"
      dir="rtl"
      sx={{
        position: "relative",
        direction: "rtl",
        mt: 8,
        pt: { xs: 6, md: 8 },
        pb: 3,
        color: "#fff",
        background: `linear-gradient(180deg, ${INK} 0%, #0d0c0b 100%)`,
        // פס זהב דק בראש הפוטר
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: `linear-gradient(90deg, transparent 0%, ${GOLD} 25%, ${GOLD_LIGHT} 50%, ${GOLD} 75%, transparent 100%)`,
        },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 4 }}>

          {/* לוגו + תיאור + כפתור סל קניות */}
          <Grid
            item
            xs={12}
            md={3}
            // בטלפון הלוגו, הטקסט והכפתור במרכז
            sx={{ textAlign: { xs: "center", md: "initial" } }}
          >
            <Link to="/" style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}>
              <Box
                component="img"
                src={logo}
                alt="לוגו קייטרינג הפנינה"
                sx={{
                  width: 150,
                  height: "auto",
                  mb: 2.5,
                  borderRadius: "12px",
                  objectFit: "cover",
                  border: `1px solid ${GOLD}`,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                }}
              />
            </Link>

            <Typography
              sx={{
                color: "#C7BDAA",
                fontSize: 14.5,
                lineHeight: 1.9,
                textAlign: "center",
                maxWidth: 320,
                // בטלפון הבלוק עצמו ממורכז באמצע המסך
                mx: { xs: "auto", md: 0 },
                mb: 3,
              }}
            >
              קייטרינג איכותי עם שירות אישי, באירועים קטנים וגדולים. גבעת שאול, ירושלים.
             </Typography>


          </Grid>

          {/* ניווט מהיר */}
          <Grid item xs={6} md={3}>
            <ColumnTitle>ניווט מהיר</ColumnTitle>
            <MuiLink component={Link} to="/" sx={linkSx}>דף הבית</MuiLink>
            <MuiLink component={Link} to="/about" sx={linkSx}>אודות</MuiLink>
            <MuiLink component={Link} to="/FAQAccordion" sx={linkSx}>שאלות ותשובות</MuiLink>
            <MuiLink component={Link} to="/contact" sx={linkSx}>צור קשר</MuiLink>
            <MuiLink component={Link} to="/MainCourse" sx={linkSx}>אוכל מוכן עד הבית</MuiLink>
          <MuiLink component={Link} to="/#event-packages" sx={linkSx}> חבילות התפריטים שלנו</MuiLink>
 
  
 

 

         
          </Grid>

          {/* מידע חשוב */}
          <Grid item xs={6} md={3}>
            <ColumnTitle>מידע חשוב</ColumnTitle>
            <MuiLink href="/FAQAccordion#2" sx={linkSx}>מה ההכשר שלנו?</MuiLink>
            <MuiLink href="/FAQAccordion#5" sx={linkSx}>האם יש משלוחים?</MuiLink>
            <MuiLink href="/FAQAccordion#3" sx={linkSx}>כמה זמן מראש צריך לתאם הזמנה?</MuiLink>
            <MuiLink href="/FAQAccordion#6" sx={linkSx}>האם ניתן לשנות הזמנה?</MuiLink>
            <MuiLink href="/FAQAccordion#8" sx={linkSx}>יש מנות צמחוניות?</MuiLink>
          </Grid>

          {/* צור קשר */}
          <Grid item xs={12} md={3}>
            <ColumnTitle>צור קשר</ColumnTitle>

            <ContactRow icon={<PlaceOutlinedIcon sx={{ fontSize: 19 }} />}>
              גבעת שאול, ירושלים
            </ContactRow>

            <ContactRow icon={<PhoneOutlinedIcon sx={{ fontSize: 19 }} />}>
              שירות לקוחות
              <br />
              <MuiLink href="tel:0795152820" sx={contactLinkSx}>
                0795152820 (שלוחה 1)
              </MuiLink>
            </ContactRow>

            <ContactRow icon={<EmailOutlinedIcon sx={{ fontSize: 19 }} />}>
              <MuiLink
                href="mailto:hpnina6600200@gmail.com"
                sx={{ ...contactLinkSx, overflowWrap: "anywhere" }}
              >
                hpnina6600200@gmail.com
              </MuiLink>
            </ContactRow>
          </Grid>

        </Grid>

        {/* שורת תחתונה */}
        <Box
          sx={{
            mt: { xs: 5, md: 7 },
            pt: 3,
            textAlign: "center",
            borderTop: "1px solid #393024",
          }}
        >
          <Typography sx={{ color: "#8D8980", fontSize: 13 }}>
            קייטרינג הפנינה בע"מ © {new Date().getFullYear()} | כל הזכויות שמורות
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
