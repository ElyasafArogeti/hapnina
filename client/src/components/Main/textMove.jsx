import React from "react";
import { Box, Typography } from "@mui/material";

const TextMarquee = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#000",
        padding: "10px 0",
        overflow: "hidden",
        position: "relative",
        direction: "ltr",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          animation: "marquee 30s linear infinite",
          color: "#fff",
          fontSize: { xs: "0.9rem", md: "1.2rem" },
          fontWeight: 600,
          "& > *": {
            marginRight: "60px",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
            fontSize: { xs: "0.95rem", md: "1.3rem" },
          },
        }}
      >
        <Typography>🎉 מבצעים מיוחדים בהזמנה אירוע  🎉</Typography>
         <Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
        <Typography>הקייטרינג בהכשר למהדרין יורה דעה הרב מחפוד</Typography>
       <Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
        <Typography>⭐️ בהזמנת אירוע אפשרות לטעימות ⭐️</Typography>
      <Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |  </Typography>
        <Typography>💎 אפשרות להפקת אירוע מושלם כולל: כלי פורצלן ,מלצרים ,עיצובי שולחן 💎</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
        <Typography>🍽️ ייחודי : בוחרים מהתפריט ומקבלים הצעת מחיר במקום  🍽️</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>

        {/* שכפול לרצף רציף */}
        <Typography>🎉 מבצעים מיוחדים בהזמנה אירוע  🎉</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
  <Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
        <Typography>הקייטרינג בהכשר למהדרין יורה דעה הרב מחפוד</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
        <Typography>⭐️ בהזמנת אירוע אפשרות לטעימות ⭐️</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
          <Typography>💎 אפשרות להפקת אירוע מושלם כולל : כלי פורצלן ,מלצרים ,עיצובי שולחן 💎</Typography>
<Typography  sx={{ color: "#888",  width: "50px",  textAlign: "center", marginLeft: "10px", }} > |    </Typography>
       <Typography>🍽️ ייחודי : בוחרים מהתפריט ומקבלים הצעת מחיר במקום  🍽️</Typography>
      </Box>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </Box>
  );
};

export default TextMarquee;
