
import { Container, Typography, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";

import BarMitzvahOffer from "./BarMitzvahOffer"; // בר מצווה
import WeddingOffer from "./WeddingOffer"; // חתונה
import EngagementOffer from "./EngagementOffer"; // אירוסין
import BritOffer from "./BritOffer"; // ברית

// חלק החבילות בדף הבית
const OffersSection = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        textAlign="center"
        gutterBottom
        sx={{
          fontWeight: 800,
          color: "#d4bc82",
          mb: 4,
        }}
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
        <Grid container spacing={3} alignItems="stretch">
         
          {/* בר מצווה */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <BarMitzvahOffer />
          </Grid>
           {/* ברית */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <BritOffer />
          </Grid>
          {/* אזכרה  */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <EngagementOffer />
          </Grid>
           {/* חתונה */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <WeddingOffer />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default OffersSection;
