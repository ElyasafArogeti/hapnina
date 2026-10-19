
import React from "react";
import { Box, Typography } from "@mui/material";

const TextMarquee = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#000000",
        padding: "10px 0",
        overflow: "hidden",
        position: "relative",
        direction: "ltr",
       backgroundColor: "#000000",
      }}
    >
      <Box
        sx={{
          display: "inline-flex",
          animation: "marquee 30s linear infinite",
          color: "#d6b56d",
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
        <Typography sx={{ color: "#d6b56d" }}>
          מבצעים מיוחדים בהזמנת אירוע
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          הקייטרינג בהכשר למהדרין יורה דעה הרב מחפוד
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          בהזמנת אירוע אפשרות לטעימות
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          אפשרות להפקת אירוע מושלם כולל: כלי פורצלן, מלצרים ועיצובי שולחן
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          בוחרים מהתפריט ומקבלים הצעת מחיר במקום
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        {/* שכפול לרצף רציף – נשמר כמו במקור */}
        <Typography sx={{ color: "#d6b56d" }}>
          מבצעים מיוחדים בהזמנת אירוע
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          הקייטרינג בהכשר למהדרין יורה דעה הרב מחפוד
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          בהזמנת אירוע אפשרות לטעימות
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          אפשרות להפקת אירוע מושלם כולל: כלי פורצלן, מלצרים ועיצובי שולחן
        </Typography>

        <Typography
          sx={{
            color: "#b89546",
            width: "50px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          ◆
        </Typography>

        <Typography sx={{ color: "#d6b56d" }}>
          בוחרים מהתפריט ומקבלים הצעת מחיר במקום
        </Typography>
      </Box>

      <style>
        {`
          @keyframes marquee {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default TextMarquee;
