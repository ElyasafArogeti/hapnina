import { Box, Typography } from "@mui/material";
import Packages from "./Packages";

// חלק החבילות בדף הבית
const OffersSection = () => {
  return (
    <Box
      id="event-packages"
      sx={{
        width: "100%",
        py: 6,
        px: { xs: 2, md: 4 },
        boxSizing: "border-box",
        scrollMarginTop: "90px",
      }}
    >
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{ fontWeight: 500, color: "#d4bc82", mb: 3 }}
      >
        חבילות תפריטים שונים
      </Typography>

      {/* מעטפת שחור וזהב לכל ארבע החבילות */}
      <Box
        sx={{
          position: "relative",
          p: { xs: 1, md: 2 },
          borderRadius: 4,
          background: "linear-gradient(180deg, #141414, #080808)",
          border: "1px solid rgba(212,175,98,0.18)",
          boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        <Packages />
      </Box>
    </Box>
  );
};

export default OffersSection;