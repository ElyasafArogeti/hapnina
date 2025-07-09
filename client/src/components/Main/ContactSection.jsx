import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "550px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        backgroundImage: `url('https://www.colonia-events.co.il/wp-content/uploads/2019/09/%D7%97%D7%AA%D7%95%D7%A0%D7%AA-%D7%A6%D7%94%D7%A8%D7%99%D7%9D-1.jpeg')`, // החלף בקישור לתמונת הרקע שלך
        backgroundPosition: "center",
        borderRadius: "8px",
        overflow: "hidden",
         backgroundSize: "cover",
      
        backgroundAttachment: "fixed"
      }}
    >
      {/* שכבת כהות מעל התמונה */}
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
      
      {/* תוכן */}
      <Box sx={{ zIndex: 2, padding: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          צרו איתנו קשר
        </Typography>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          ? יש לכם אירוע בקרוב
        </Typography>
        <Typography variant="h5" gutterBottom>
          השאירו פרטים
        </Typography>
        <Button
          variant="contained"
           color="warning"
          startIcon={<PhoneIcon />}
          sx={{
            marginTop: 2,
            fontWeight: "bold",
            paddingX: 4,
            paddingY: 1.5,
            borderRadius: 8,
            zIndex: 3,
          }}
          href="/contact" // קישור לדף יצירת קשר
        >
          צרו קשר
        </Button>
      </Box>
    </Box>
  );
};

export default ContactSection;
