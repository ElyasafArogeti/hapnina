import React from 'react'
import { Box, Typography} from '@mui/material';
const textMove = () => {
  return (
    <div>
          {/* שלשלת מילים עם אנימציה */}
          <Box
        sx={{
          width: "100%",  backgroundColor: "#333", padding: "10px 0",
          display: "flex",justifyContent: "center", alignItems: "center",
          color: "#fff",
          fontSize: "1.2rem", overflow: "hidden", 
          whiteSpace: "nowrap",
          "@keyframes marquee": {
            "0%": {
              transform: "translateX(-100%)", // התחלה משמאל
            },
            "100%": {
              transform: "translateX(100%)", // סיום בימין
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            animation: "marquee 25s linear infinite",
          }}
        >
          <Typography sx={{ marginRight: 5 }}>
             מבצעי השבוע: קייטרינג 10% הנחה קייטרינג הפנינה 
          </Typography>
          <Typography sx={{ marginRight: 5 }}>
            ⭐️ קנה שני ברים וקבל בר שלישי חינם ⭐️
          </Typography>
          <Typography sx={{ marginRight: 5 }}>
            חבילות עיצוב לאירועים מיוחדים במחירים אטרקטיביים
          </Typography>
          <Typography sx={{ marginRight: 5 }}>
          קייטרינג הפנינה במבצע פתיחה מושלם 
          </Typography>
        </Box>
      </Box>
    </div>
  )
}

export default textMove;
