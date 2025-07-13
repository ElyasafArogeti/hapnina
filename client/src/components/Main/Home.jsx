
import TextMove from "../Main/textMove";
import NavbarHome from "../Main/NavbarHome";
import { Typography, List,  ListItemText } from "@mui/material";
import { Box, Button, Container, Card } from "@mui/material";

import styles from "../../assets/stylesMain/home.module.css";
import Grid2 from '@mui/material/Grid2';
import Footer from './Footer';
import ContactSection from "./ContactSection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import imgApnina from "../../assets/imgs/img3.jpeg";

import OffersSection from "../Main/Offers/OffersSection";
import { motion } from "framer-motion";
const fadeInVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1, // דיליי בין כל תמונה
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const images = [
  // כאן תכניס כתובות של תמונות (תמונות אוכל)
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157503/manager_images/salads/%D7%A7%D7%95%D7%91%D7%99%D7%95%D7%AA%20%D7%97%D7%A6%D7%99%D7%9C%20%D7%A4%D7%A7%D7%A0%D7%98%D7%99.jpg",
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
  "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157676/manager_images/main_courses/%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99%20%D7%A7%D7%91%D7%91%20%D7%9E%D7%96%D7%A8%D7%97%D7%99.jpg",
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
  return (
    <Box className={styles.mainHome}>
      <NavbarHome/><br/><br/><br/><br/>
       <TextMove/> 

 <Box
  sx={{
    width: "100%",
    height: { xs: "50vh", md: "100vh" }, // חצי מסך במובייל, מלא בדסקטופ
    overflow: "hidden",
    position: "relative",
  }}
>
  {/* הווידאו */}
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="auto"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      position: "absolute",
      top: 0,
      left: 0,
    }}
  >
    <source
      src="https://res.cloudinary.com/dhkegagjk/video/upload/q_auto,f_auto/v1752406326/%D7%A1%D7%A8%D7%98%D7%95%D7%9F_%D7%93%D7%A3_%D7%94%D7%91%D7%99%D7%AA_dbzqoz.mp4"
      type="video/mp4"
    />
    Your browser does not support the video tag.
  </video>

  {/* שכבת כהות */}
  <Box
    sx={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      zIndex: 1,
    }}
  />

  {/* טקסט במרכז */}
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      textAlign: "center",
    }}
  >
    <Typography
      variant="h3"
      sx={{
        color: "#FFF",
        textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
        fontSize: { xs: "1.4rem", md: "3rem" },
      }}
    >
    
    </Typography>
  </Box>
</Box>



<OffersSection />







{/* כרטיס קייטרינג */}
<Container sx={{ padding: 4, width: "100%" }}>
  <Grid2 container spacing={2}>
    {/* כרטיס קייטרינג */}
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 2 }}>
      <Card
        sx={{
          boxShadow: 3,
          padding: 7,
          height: 'auto',
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="overline" display="block" fontWeight={"bold"} gutterBottom>
          CATERING
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <p style={{ width: "50px", height: "2px", backgroundColor: "#333" }}></p>  
        </Box>
        <Typography variant="h4" gutterBottom  fontWeight={"bold"}>
         קייטרינג אונליין 
       </Typography>
       <Typography variant="body1" sx={{ textAlign: "center", marginBottom: 2 }}>
        .האתר שלנו מציע שירות הזמנות אונליין מהיר ונוח, המאפשר לך להזמין את הקייטרינג המושלם לאירוע שלך בכמה קליקים בלבד. עם מערכת הזמנות פשוטה, תוכל לבחור את התפריט המושלם, להוסיף פרטים אישיים ולהזמין בקלות ישירות מהאתר שלנו, מבלי לצאת מהבית
       </Typography>
       <Typography variant="h6" gutterBottom textAlign={"center"} fontWeight={"bold"}>
         !! הזמנת קייטרינג דרך האתר
       </Typography>
        <Typography variant="h6" gutterBottom textAlign={"center"} fontWeight={"bold"}>
          :סוגי האירועים שלנו
        </Typography>
        <List>
          <ListItemText primary="✔ חתונות" />
          <ListItemText primary="✔  אירוסין" />
          <ListItemText primary="✔ בר/בת מצווה" />
          <ListItemText primary="✔ כנסים ואירועי תרבות" />
        </List>
        {/* כפתור מיוחד */}
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowBackIcon />}
          sx={{
            marginTop: 3,
            paddingX: 4,
            paddingY: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 8,
          }}   href="/ordersOnline" // קישור לדף תפריטים
        >
          <Typography variant="button">תפריטים והצעות</Typography>
        </Button>
      </Card>
    </Grid2>
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 1 }}>
    <img
        src={imgApnina}
        alt="תמונה של אופנוען משלוחים"
        style={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}      
      /> 
    </Grid2>

  </Grid2>
</Container>
 <Box>



  {/* מקטע ראשון */}
  <Box
    sx={{
      width: "100%",
      minHeight: "500px",
      backgroundImage: "url('https://10comm.com/photos/UploadImage/4b8d0528bc117e68502c575a768f616f_ari-events-9.jpeg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}>
    <Typography size={12}  variant="h3" sx={{ color: "#FFF", textAlign: "center", pt: 20 }}>
      ברוכים הבאים
    </Typography>
  </Box>
  
 





 {/* עיצוב ברים */}
 <Container sx={{ padding: 4 , width: "100%" }}>
  <Grid2 container spacing={2} alignItems="center">
    {/* כרטיס העיצוב */}
    <Grid2 size={{ xs: 12, sm: 6 }} order={{ md: 1 }} md={6}>
      <Card
        sx={{
          boxShadow: 3,
          padding: 7,
          height:'auto',
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="overline" display="block"fontWeight={"bold"} gutterBottom>
          DESIGN
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center"  }}>
        <p style={{width: "50px", height: "2px", backgroundColor: "#333" }}></p>  
        </Box>
        
        <Typography variant="h4" gutterBottom fontWeight={"bold"}>
          העיצוב שלנו 
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", marginBottom: 2 }}>
          אנחנו דואגים לעיצוב האולם בצורה הכי יפה ומציעים ללקוחותינו ליצור אירוע מעוצב
          באופן אישי ובהתאמה לצרכים שלכם. הצוות המיומן שלנו מספק שירותי עיצוב מקצועיים הכוללים בין
          היתר: עיצובי שולחן , עיצובי ברים , חופה , כיסא כלה , ועוד
        </Typography>
  
      <br /><br /><br /><br />
      {/* כפתור מיוחד */}
       <Button
          variant="contained"
          color="warning"
          endIcon={<ArrowBackIcon />}
          sx={{
            marginTop: 3,
            paddingX: 4,
            paddingY: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 8,
          }}
          href="/contact" // קישור לדף יצירת קשר
        >
          <Typography variant="button">צור קשר</Typography>
        </Button> 
      </Card>
    </Grid2>
    {/* תמונה */}
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 2 }}>
  <img
        src="https://ari-events.co.il/wp-content/uploads/2023/11/hupa-ari-10.webp" // החלף בקישור לתמונה של עיצוב בר
        alt="עיצוב בר"
        style={{
          width: "100%",
          height: "auto",
          maxHeight:"500px",
          objectFit: "cover",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}      
      /> 
    </Grid2>
  
     </Grid2>
  </Container>





  {/* מקטע שני */}
  <Box
    sx={{
      width: "100%",
      minHeight: "500px",
      backgroundImage: "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752410371/IMG-20250713-WA0106_oenesp.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed"
    }}
  >
    <Typography variant="h3" sx={{ color: "#FFF", textAlign: "center", pt: 20 }}>
      חוויה בלתי נשכחת
    </Typography>
  </Box>


   <Box sx={{ 
        width: "100%",
        height: "50vh", // גובה של חצי דף
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        color: "#333", 
      }}
    >
      
      <Typography
        variant="h4"
        sx={{ fontFamily: "Arial, sans-serif", fontWeight: "bold" }}
      >
        ״תנו לנו לשדרג לכם את החלום״
      </Typography>
      <Box
        sx={{
          width: "50px",
          height: "2px",
          backgroundColor: "#333",
          margin: "20px 0",
        }}
      />
      <Typography variant="h6" sx={{ color: "#555" }}>
        ⭐️ תכנון האירוע המושלם מתחיל כאן ⭐️
      </Typography>
    </Box>
</Box>



<Box sx={{ py: 6, px: { xs: 2, md: 6 }, backgroundColor: "#f9f9f9" }}>
  <Typography
    variant="h4"
    textAlign="center"
    fontWeight="bold"
    mb={4}
    sx={{ color: "#444" }}
  >
    🍽️ גלריית הטעמים שלנו
  </Typography>

  <Grid2 container spacing={3} justifyContent="center">
    {images.map((img, index) => (
      <Grid2 size={{ xs: 6, sm: 3 }} item key={index}>
        <motion.div
          custom={index}
          variants={fadeInVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Box
            component="img"
            src={img}
            alt={`gallery-img-${index}`}
            sx={{
              objectFit: "cover",
              boxShadow: 3,
              width: "100%",
              height: "auto",
              borderRadius: 2,
              transition: "transform 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
            }}
          />
        </motion.div>
      </Grid2>
    ))}
  </Grid2>
</Box>



      {/* השארת פרטים ופוטר  */}
      <Box  sx={{backgroundColor: "#000"}}>  
      <ContactSection/> 
        <Footer />
      </Box>
      
    </Box>
  );
};

export default Home;
