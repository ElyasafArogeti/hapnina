import React from "react";
import { Box, Typography, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";

const ContactSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: "400px", md: "550px" },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textAlign: "center",
        backgroundImage: `url('https://res.cloudinary.com/dhkegagjk/image/upload/v1755207336/%D7%97%D7%AA%D7%95%D7%A0%D7%AA-%D7%A6%D7%94%D7%A8%D7%99%D7%9D-1_ngcew5.webp')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: { xs: "scroll", md: "fixed" },
        borderRadius: "8px",
        overflow: "hidden",
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
      <Box sx={{ zIndex: 2, px: 2, textAlign: "center", maxWidth: "90%" }}>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
        >
          צרו איתנו קשר
        </Typography>

        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.5rem", md: "2.25rem" } }}
        >
          ? יש לכם אירוע בקרוב
        </Typography>

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontSize: { xs: "1.2rem", md: "1.8rem" } }}
        >
          השאירו פרטים
        </Typography>

        <Button
          variant="contained"
          color="warning"
          startIcon={<PhoneIcon />}
          sx={{
            marginTop: 2,
            fontWeight: "bold",
            paddingX: { xs: 3, md: 4 },
            paddingY: { xs: 1, md: 1.5 },
            fontSize: { xs: "0.9rem", md: "1rem" },
            borderRadius: 8,
            zIndex: 3,
          }}
          href="/contact"
        >
          צרו קשר
        </Button>
      </Box>
    </Box>
  );
};

export default ContactSection;
