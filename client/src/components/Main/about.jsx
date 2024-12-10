import React from 'react';
import { Box, Typography, Container ,Button,IconButton} from '@mui/material';
import NavbarHome from './NavbarHome';
import Grid from '@mui/material/Grid2';
import Footer from './Footer';
import ContactSection from "./ContactSection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BsWhatsapp, BsTelephoneOutbound } from 'react-icons/bs';
const About = () => {
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', width: '100%' }}>
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br/> <br/> <br/><br/>
      <Container disableGutters={true} maxWidth={false} sx={{ padding: 0 }}>
        {/* כותרת על תמונה */}
        <Box sx={{ position: 'relative', width: '100%', maxHeight: '500px', overflow: 'hidden' }}>
          <Box
            component="img"
            src="https://www.acosta.co.il/wp-content/uploads/2022/10/%D7%90%D7%95%D7%9C%D7%9D-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-%D7%99%D7%95%D7%A7%D7%A8%D7%AA%D7%99.webp"
            alt="אולם האירועים הפנינה"
            sx={{
              width: '100%',
              minHeight: '500px',      
              maxHeight: '550px',
              objectFit: 'cover',
              backgroundPosition: 'center',  filter: 'brightness(50%)', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Typography variant="h3" component="h1"
            sx={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              fontWeight: 'bold', fontSize: '5rem',color: "#FFD700",  textAlign: 'center',     
              textShadow: '2px 2px 4px black',zIndex: 1000,
            }} >
            הסיפור שלנו
          </Typography>
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
            <p style={{ fontSize: '15px', textAlign: 'right', paddingRight: '1.5rem'}}> ❕ הסיפור שלנו</p>
            <Typography
              variant="h1"
              sx={{
                fontSize: '2rem', paddingRight: '1.5rem',  
                fontWeight: 'bold',
                marginBottom: '1rem',
                textAlign: 'right',
              }}
            >
              ? אז מי אנחנו
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'right',
                paddingRight: '1.5rem',  
                fontFamily: 'Arial, sans-serif',
                margin: "20px 0",
                fontSize: '16px',
                lineHeight: 1,
                color: '#555',
              }}
            >
        "ברוכים הבאים לאולם לקייטרינג ואולם אירועים "הפנינה <br/>הפנינה נולד מתוך חזון להעניק חוויית אירוח יוקרתית ומרהיבה<br />
              .במשך שנים רבות האירוח הפך לאומנות, ואנו שמחים להיות חלק מרגעי השמחה של לקוחותינו
            </Typography>
          </Grid>

           {/* תמונה בצד שמאל */}
          <Grid size={{ xs: 12, sm: 6 }} md={6}>
            <img
              src="https://www.tarin.co.il/wp-content/uploads/2023/08/LIRO0553_800x533.jpg"
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
              !! ההיסטורייה שלנו
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
              קייטרינג ואולמי הפנינה קיים למעלה מ-15 שנה, הבישול הביתי באיכות מרבית והמטבח הנקי
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
                  href="https://wa.me/+972546600200"
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
