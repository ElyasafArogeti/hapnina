
import TextMove from "../Main/textMove";
import NavbarHome from "../Main/NavbarHome";
import { Typography, List,  ListItemText } from "@mui/material";
import { Box, Button, Container, Card } from "@mui/material";
import {
  CheckCircleOutline,
  RestaurantMenu,
  SupportAgent,
  Public,
  MonetizationOn,
} from "@mui/icons-material";
import { Divider } from "@mui/material";

import styles from "../../assets/stylesMain/home.module.css";
import Grid2 from '@mui/material/Grid2';
import Footer from './Footer';
import ContactSection from "./ContactSection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import imgApnina from "../../assets/imgs/img3.jpeg";

import OffersSection from "../Main/Offers/OffersSection";
import { motion } from "framer-motion";



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

{/* /קטע וידיאו/ */}
<Box
  sx={{
    width: "100%",
    height: { xs: "50vh", md: "70vh" },
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
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 1,
    }}
  />

  {/* טקסט עם אפקט הופעה מעל הווידאו */}
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      textAlign: "center",
      color: "#FFF",
      textShadow: "2px 2px 6px rgba(0,0,0,0.9)",
      animation: "fadeInUp 1.8s ease-out forwards",
      opacity: 0, // מתחיל מוסתר
    }}
  >
    <Typography
      sx={{
        fontWeight: 800,
        fontSize: { xs: "2.5rem", md: "4rem" },
        fontFamily: "'Playfair Display', serif",
        letterSpacing: "2px",
      }}
    >
      קייטרינג הפנינה
    </Typography>
  </Box>

  {/* חץ למטה */}
  <Box
    sx={{
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 2,
      animation: "bounce 2s infinite",
    }}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="white"
      viewBox="0 0 24 24"
    >
      <path d="M12 16.5l-7-7 1.4-1.4L12 13.7l5.6-5.6L19 9.5l-7 7z" />
    </svg>
  </Box>

  {/* אנימציות CSS */}
  <style>
    {`
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateX(-50%) translateY(0);
        }
        40% {
          transform: translateX(-50%) translateY(-8px);
        }
        60% {
          transform: translateX(-50%) translateY(-4px);
        }
      }

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


{/* כרטיס קייטרינג */}
<Container sx={{ py: { xs: 2, md: 4 }, width: "100%" }}>
  <Grid2 container spacing={2}>
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 2 }}>
      <Card
        sx={{
          boxShadow: 3,
          p: { xs: 2, md: 7 },
          height: "auto",
          borderRadius: 4,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="overline"
          display="block"
          fontWeight="bold"
          gutterBottom
          fontSize={{ xs: "0.75rem", md: "inherit" }}
        >
          CATERING
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Box
            sx={{
              width: "40px",
              height: "2px",
              backgroundColor: "#333",
            }}
          />
        </Box>

        <Typography
          variant="h5"
          gutterBottom
          fontWeight="bold"
          fontSize={{ xs: "1.25rem", md: "2rem" }}
        >
          הצעת מחיר לאירוע שלכם
        </Typography>

        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            mb: 2,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          .האתר שלנו מציע שירות הזמנות אונליין מהיר ונוח, המאפשר לך להזמין את הקייטרינג המושלם לאירוע שלך בכמה קליקים בלבד. עם מערכת הזמנות פשוטה, תוכל לבחור את התפריט המושלם, להוסיף פרטים אישיים ולהזמין בקלות ישירות מהאתר שלנו, מבלי לצאת מהבית
        </Typography>

        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
          fontSize={{ xs: "1rem", md: "1.25rem" }}
        >
          !! הצעת מחיר דרך האתר
        </Typography>

        <Typography
          variant="subtitle1"
          gutterBottom
          fontWeight="bold"
          textAlign="center"
          fontSize={{ xs: "1rem", md: "1.25rem" }}
        >
          :סוגי האירועים שלנו
        </Typography>

        <List dense sx={{ textAlign: "center" }}>
          <ListItemText primary="✔ חתונות" />
          <ListItemText primary="✔ אירוסין" />
          <ListItemText primary="✔ בר/בת מצווה" />
          <ListItemText primary="✔ כנסים ואירועי תרבות" />
        </List>

        {/* כפתור */}
        <Button
          variant="contained"
          color="success"
          endIcon={<ArrowBackIcon />}
          sx={{
            mt: 3,
            px: { xs: 3, md: 4 },
            py: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.9rem", md: "1rem" },
            fontWeight: "bold",
            borderRadius: 8,
          }}
          href="/ordersOnline"
        >
          <Typography variant="button">להצעת מחיר בתפריט</Typography>
        </Button>
      </Card>
    </Grid2>

    {/* תמונה */}
    <Grid2 size={{ xs: 12, sm: 6 }} md={1} order={{ md: 1 }}>
    <img
        src='https://res.cloudinary.com/dhkegagjk/image/upload/v1752410371/IMG-20250713-WA0099_vqvudj.jpg'
        alt="אוכל קיירינט הפנינה"
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


<OffersSection />



{/* ------------------------------------------------------------------------------------- */}


{/* חבילה של כמה אלמנטים */}
 <Box sx={{ width: "100%",  overflowX: "hidden",  boxSizing: "border-box",  padding: 0,  margin: 0, }}>
   

  {/* קטע תמונה שקופה 1  */}
 <Box
  sx={{
    width: "100%",
    minHeight: "500px",
    position: "relative",
    backgroundImage:
      "url('https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0131_ugknys.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>
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
      width: "90%",           // מתאים לרוחב המסך
      maxWidth: "1000px",     // לא יחרוג גם במסך רחב
      mx: "auto",
      px: 2,
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: "#fff",
        fontWeight: "bold",
        textShadow: "2px 2px 8px rgba(0,0,0,0.8)",
        mb: 2,
        fontSize: { xs: "1.8rem", md: "2rem" },
      }}
    >
      ברוכים הבאים לקייטרינג הפנינה
    </Typography>

    <Typography
      variant="h5"
      sx={{
        color: "#fff",
        fontWeight: "bold",
        textShadow: "1px 1px 6px rgba(0,0,0,0.7)",
        mb: 2,
        fontSize: { xs: "1.2rem", md: "1.6rem" },
        lineHeight: 1.6,
      }}
    >
      טעם של חגיגה בכל ביס – באירועים עסקיים, משפחתיים ופרטיים
    </Typography>

    <Typography
      variant="h6"
      sx={{
        color: "#fff",
        textShadow: "1px 1px 5px rgba(0,0,0,0.6)",
        fontSize: { xs: "1rem", md: "1.2rem" },
        lineHeight: 1.6,
      }}
    >
      קייטרינג מקצועי עם טאץ' אישי • חומרי גלם טריים ואיכותיים • חוויה קולינרית בלתי נשכחת
    </Typography>
  </Box>

</Box>

{/* ----------------------------------------------------------- */}

 {/* כרטיס ותמונה מיוחדות שלנו  */}
<Container sx={{ py: { xs: 2, md: 4 }, width: "100%" }}>
  <Grid2 container spacing={2} alignItems="stretch">
    {/* כרטיס התוכן */}
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 1 }}>
      <Card
        sx={{
          boxShadow: 2,
          padding: { xs: 3, md: 4 },
          borderRadius: 3,
          textAlign: "center",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="overline"
          display="block"
          fontWeight="bold"
          gutterBottom
        >
          DESIGN
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Box sx={{ width: "50px", height: "2px", backgroundColor: "#333" }} />
        </Box>

        <Typography variant="h5" gutterBottom fontWeight="bold">
          המיוחדות שלנו
        </Typography>

 <Box
  sx={{
    textAlign: "right",
    mx: "auto",    
    direction: "rtl", 
    maxWidth: "600px",
    fontSize: { xs: "0.95rem", md: "1rem" },
  }}
  // מלל בתוך הכרטיס 
>
  <Typography variant="body1" sx={{ mb: 3 }}>
    בקייטרינג הפנינה אנו מציעים הרבה מעבר לאוכל – אנחנו מביאים איתנו ניסיון,
    הקפדה על כל פרט, וגישה שממקדת את האירוע סביבכם:
  </Typography>

  {/* אמינות */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <CheckCircleOutline color="success" sx={{ mr: 1 }} />
    <Typography fontWeight="bold">אמינות מלאה:</Typography>
  </Box>
  <Typography sx={{ mb: 1 }}>
    שקיפות מלאה בתהליך – החל משיחת ההיכרות ועד סיום האירוע.
  </Typography>
  <Divider sx={{ my: 2 }} />

  {/* אוכל */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <RestaurantMenu color="error" sx={{ mr: 1 }} />
    <Typography fontWeight="bold">אוכל עשיר וטעים:</Typography>
  </Box>
  <Typography sx={{ mb: 1 }}>
    תפריטים מגוונים עם מנות טריות, יצירתיות ואסתטיות.
  </Typography>
  <Divider sx={{ my: 2 }} />

  {/* שירות */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <SupportAgent color="info" sx={{ mr: 1 }} />
    <Typography fontWeight="bold">שירות מקיף:</Typography>
  </Box>
  <Typography sx={{ mb: 1 }}>
    ליווי אישי וצמוד בכל שלב – מהתכנון ועד סיום האירוע בשטח.
  </Typography>
  <Divider sx={{ my: 2 }} />

  {/* דיגיטל */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <Public color="primary" sx={{ mr: 1 }} />
    <Typography fontWeight="bold">שירותים דיגיטליים:</Typography>
  </Box>
  <Typography sx={{ mb: 1 }}>
    תיאומים, בחירת תפריט ומענה – הכל אונליין, בצורה פשוטה.
  </Typography>
  <Divider sx={{ my: 2 }} />

  {/* הצעת מחיר */}
  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
    <MonetizationOn color="warning" sx={{ mr: 1 }} />
    <Typography fontWeight="bold">הצעת מחיר מיידית באתר:</Typography>
  </Box>
  <Typography>
    בחרו את סוג האירוע, מספר המשתתפים – וקבלו הערכת מחיר במקום.
  </Typography>
</Box>
        <Button
          variant="contained"
          color="warning"
          endIcon={<ArrowBackIcon />}
          sx={{
            marginTop: 4,
            paddingX: 4,
            paddingY: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: 8,
          }}
          href="/contact"
        >
          <Typography variant="button">צור קשר</Typography>
        </Button>
      </Card>
    </Grid2>

    {/* תמונה */}
    <Grid2 size={{ xs: 12, sm: 6 }} md={6} order={{ md: 2 }}>
      <img
        src="https://res.cloudinary.com/dhkegagjk/image/upload/v1755027385/pexels-elina-sazonova-1838607_wj6n0u.jpg"
        alt="תמונת אירוע"
        style={{
          width: "100%",
        
          maxHeight: "718px",
          objectFit: "cover",
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      />
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
    textAlign: "center"
  }}
>
  <Typography variant="h3" sx={{ color: "#FFF", px: 2 }}>
    חוויה בלתי נשכחת
  </Typography>
</Box>


{/* ---------------------------------------------------------- */}
<br /><br />
<Box
  sx={{
    width: "100%",
    minHeight: "40vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    px: 2,
   background: "#f5f5f5",
    position: "relative",
    overflow: "hidden",
  }}
>
  {/* אפקט אור רקע עדין */}
  <Box
    sx={{
      position: "absolute",
      top: "-30%",
      left: "-30%",
      width: "200%",
      height: "200%",
      background: "radial-gradient(circle at center, rgba(86, 82, 82, 0.08), transparent 60%)",
      animation: "pulse 6s infinite ease-in-out",
      zIndex: 0,
    }}
  />

  {/* תוכן קדמי */}
  <Box
    sx={{
      width: "100%",
      maxWidth: "600px",
      mx: "auto",
      px: 2,
      zIndex: 1,
      animation: "fadeIn 2s ease-in-out",
    }}
  >
    <Typography
      variant="h3"
      sx={{
        fontWeight: 800,
         fontSize: { xs: "1.6rem", md: "2.5rem" },
        color: "#black",
    
        lineHeight: 1.4,
        mb: 2,
      }}
    >
      ״תנו לנו לשדרג לכם את החלום״
    </Typography>

    <Box
      sx={{
        width: "80px",
        height: "4px",
        background: "linear-gradient(90deg, #fff176, #1b1813ff)",
        borderRadius: 2,
        mx: "auto",
        my: 3,
      }}
    />

    <Typography
      variant="h6"
      sx={{
        color: "black",
         fontSize: { xs: "0.95rem", md: "1.1rem" }, 
        fontWeight: 400,
   
        letterSpacing: "0.5px",
      }}
    >
      ⭐ תכנון האירוע המושלם מתחיל כאן ⭐
    </Typography>
  </Box>

  {/* keyframes */}
  <style>
    {`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.3; }
        50% { transform: scale(1.1); opacity: 0.1; }
      }
    `}
  </style>
</Box>





</Box>

{/* ------------------------------------------------------------ */}
{/* גלריה משודרגת */}
<Box sx={{ py: 8, px: { xs: 2, md: 6 }, backgroundColor: "#fdfdfd" }}>
  <Box sx={{ textAlign: "center", mb: 6 }}>
    <Typography
      variant="h4"
      fontWeight="bold"
      sx={{
        color: "#333",
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
      


    </Box>
  );
};

export default Home;
