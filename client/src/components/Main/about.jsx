import React from 'react';
import { Box, Typography, Container ,Button,IconButton} from '@mui/material';
import NavbarHome from './NavbarHome';
import TextMove from './textMove';
import Grid from '@mui/material/Grid2';
import Footer from './Footer';
import ContactSection from "./ContactSection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BsWhatsapp, BsTelephoneOutbound } from 'react-icons/bs';

const About = () => {
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', width: '100%',direction: 'rtl'}}>
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br/> <br/> <br/><br/>
    <TextMove/>
      <Container disableGutters={true} maxWidth={false} sx={{ padding: 0 }}>
        {/* כותרת על תמונה */}
   <Box
  sx={{
    position: "relative",
    width: "100%",
    height: "400px",
    overflow: "hidden",
  }}
>
  {/* תמונת רקע */}
  <Box
    component="img"
    src="https://res.cloudinary.com/dhkegagjk/image/upload/v1755207429/%D7%94%D7%A1%D7%99%D7%A4%D7%95%D7%A8_m6vugz.webp"
    alt="אולם האירועים הפנינה"
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(40%)",
      backgroundPosition: "center",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 1,
    }}
  />

  {/* טקסט עם אנימציה */}
  <Typography
    variant="h3"
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      fontWeight: "bold",
      fontSize: "3.5rem",
      color: "white",
      textShadow: "0px 4px 8px rgba(0,0,0,0.7)",
      textAlign: "center",
      zIndex: 2,
      opacity: 0, // מתחיל מוסתר
      animation: "fadeInUp 1.8s ease-out forwards",
    }}
  >
    הסיפור שלנו
  </Typography>

  {/* אנימציית fadeInUp */}
  <style>
    {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translate(-50%, 30%);
        }
        100% {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
    `}
  </style>
</Box>




        {/* חלק אודות ------------------------------------------------------------------*/}
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto', // ממרכז את התוכן
            paddingTop: '2rem', // הוספתי רווח עליון
          }}
        >

          {/* טקסט בצד ימין */}
          <Grid size={{ xs: 12, sm: 6 }} md={6}>
            <p style={{ fontSize: '15px', textAlign: 'right', paddingRight: '1.5rem'}}>  הסיפור שלנו ❕ </p>
            <Typography
              variant="h1"
              sx={{
                fontSize: '2rem', paddingRight: '1.5rem',  
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'right',
              }}
            >
              אז מי אנחנו ?
            </Typography>
          <Typography
  variant="body1"
  sx={{
    textAlign: 'right',
    paddingRight: '1.5rem',
    fontFamily: 'Arial, sans-serif',
    margin: '20px 0',
    fontSize: {
      xs: '15px',
      sm: '16px',
    },
    lineHeight: 1.8,
    color: '#555',
  }}
>
  ברוכים הבאים לקייטרינג <strong>"הפנינה"</strong> 🌟<br />
  קייטרינג הפנינה נולד מתוך חזון להעניק חוויית אירוח יוקרתית, מרגשת ובלתי נשכחת.<br />
  עם שנים של ניסיון, מקצועיות ואהבה אמיתית לאוכל – הפכנו את ההגשה לאמנות, ואת הטעם לחוויה. <br />
  אנו מתמחים ביצירת תפריטים עשירים, טריים וכשרים למהדרין, בהתאמה אישית לאירועים מכל סוג וגודל.<br />
  צוות השפים, המלצרים והמפיקים שלנו כאן כדי ללוות אתכם – מהרגע הראשון ועד הקינוח האחרון.<br />
  נשמח לקחת חלק ברגעים החשובים שלכם, ולהפוך כל אירוע לחגיגה של טעמים, יופי וסטייל.
</Typography>

          </Grid>

           {/* תמונה בצד שמאל */}
          <Grid size={{ xs: 12, sm: 6 }} md={6}>
            <img
              src="https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0115_jsponj.jpg"
              alt="logo"
              style={{ width: '95%', borderRadius: '10px' , boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            />
          </Grid>
        </Grid>




        {/* רווח בין החלקים */}
        <div style={{ marginBottom: '3rem' }} />


        <ContactSection/>      




        {/* חלק היסטוריה */}
        <Grid
          container
          spacing={2}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto', // ממרכז את התוכן
            paddingTop: '2rem', // הוספתי רווח עליון
          }}
        >
          {/* טקסט בצד שמאל */}
          <Grid size={{ xs: 12, sm: 6 }} md={6}> 
            <Typography
              variant="h1"
              sx={{  fontSize: '2rem', paddingRight: '1.5rem',    fontWeight: 'bold',   
                textAlign: 'right'   
              }}
            >
              ההיסטורייה שלנו !! 
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'right',
                paddingRight: '1.5rem',  
                paddingLeft: '1.5rem',  
                fontFamily: 'Arial, sans-serif',
              
                fontSize: '18px',
                lineHeight: 1,
                color: '#555',
              }}
            >
              קייטרינג הפנינה קיים למעלה מ-15 שנה, הבישול הביתי באיכות מרבית והמטבח הנקי
              חומרי הגלם האיכותיים והטריים הביאו את שמם הטוב למרחוק<br/><br/> בקייטרינג לא מתפשרים על
              כשרות ולכן הכשרות שלנו היא למהדרין בדץ יורד דעה הרב מחפוד <br/><br/> המשגיח נמצא כל יום
              מפתיחה ועד סגירה והוא אחראי שכל חומרי הגלם יהיו כשרים למהדרין,וכן שהבישול
              יהיה בישול יהודי ואופן ההכנה יהיה לפי כל כללי ההלכה<br/><br/>
              הניסיון של 15 שנה באירועים גדולים וקטנים מקנה לכם שקט נפשי שהאירוע שלכם יהיה
              ברמה הגבוהה ביותר <br/><br/>
               בכל אירוע אנו מספקים מנהל אירועים
              מקצועי, שירות מלצרים אדיב ואיכותי , אנשי מטבח מהמומחים בתחום
               <br/><br/>
               המוטו שלנו הוא שהאירוע שלכם זה האירוע שלנו<br/><br/> על אף
             כל היתרונות שלנו, המחירים שלנו הינם מהזולים בשוק וזה לא בא על חשבון האיכות
             <br/><br/>
             צלצלו עכשיו וקבלו הצעת מחיר משתלמת לאירוע הבא שלכם 
            </Typography>
            <Button  variant="contained"color="warning"
          endIcon={<ArrowBackIcon />}
          sx={{
            marginTop: 3,   paddingX: 4,paddingY: 1.5, fontSize: "1rem",  fontWeight: "bold",
            borderRadius: 8,
          }} href="/contact"  >
          <Typography variant="button">צורו איתנו קשר</Typography>
           </Button>
         <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={2}>
                <IconButton
                  href="tel:+972548520195"
                  target="_blank"
                  sx={{
                    backgroundColor: '#0072e3',
                    color: 'white',
                    '&:hover': { backgroundColor: '#005bb5' },
                  }}
                >
             <BsTelephoneOutbound size={20} />
                </IconButton>
                <IconButton
                  href="https://wa.me/+972548520195"
                  target="_blank"
                  sx={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1DA057' },
                  }}
                >
                  <BsWhatsapp size={20} />
                </IconButton>
              </Box>
          </Grid>


       {/* תמונה בצד ימין */}
          <Grid size={{ xs: 12, sm: 6 }} md={6}>
            <img
              src="https://www.britot.co.il/media-lib/business717_media28.jpg"
              alt="logo"
              style={{ width: '95%', borderRadius: '10px' , boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
            />
          </Grid>
         
        </Grid>
        <Box>
     
    </Box>
   </Container>
  <Footer />
 </Box>
  );
};

export default About;
