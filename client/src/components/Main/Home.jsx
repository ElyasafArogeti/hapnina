
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

const Home = () => {
  return (
    <Box className={styles.mainHome}>
      <NavbarHome/><br/><br/><br/><br/>
       <TextMove/> 

       <Box
  sx={{
    width: "100%",
    height: { xs: "450px", md: "500px" },
    overflow: "hidden",
    position: "relative",
  }}
>
  <img 
    src="https://res.cloudinary.com/dhkegagjk/image/upload/v1738236849/manager_images/general_photos/%D7%AA%D7%9E%D7%95%D7%A0%D7%AA%20%D7%A8%D7%A7%D7%A2%201.jpg" 
    alt="" 
    style={{ 
      width: "100%", 
      height: "100%", 
      objectFit: "cover" 
    }} 
  />
  <Typography
    variant="h3"  
    sx={{
      position: "absolute",
      top: "10%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      color: "#FFF",
      textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
      textAlign: "center",
      fontSize: { xs: "1.5rem", md: "2.5rem" },
    }}
  >
    {/* טקסט כאן */}
  </Typography>
</Box>


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
      backgroundImage: "url('https://laraevents.co.il/wp-content/uploads/2022/07/%D7%90%D7%99%D7%9A-%D7%9C%D7%91%D7%97%D7%95%D7%A8-%D7%90%D7%95%D7%9C%D7%9D-%D7%90%D7%99%D7%A8%D7%95%D7%A2%D7%99%D7%9D-1.jpg')",
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




      {/* השארת פרטים ופוטר  */}
      <Box  sx={{backgroundColor: "#000"}}>  
      <ContactSection/> 
        <Footer />
      </Box>
      
    </Box>
  );
};

export default Home;
