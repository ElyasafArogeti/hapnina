
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
          overflow: "hidden",
          boxShadow: "0 8px 28px rgba(0,0,0,0.22)",
          p: { xs: 2, md: 3 },
          borderRadius: 4,
          background:
            "linear-gradient(180deg, #1c1c1c 0%, #0b0b0b 100%)",
          border: "1px solid #b89546",
          color: "#fff",
          boxSizing: "border-box",
        }}
      >
        <Grid container spacing={3} alignItems="stretch">
          {/* חתונה */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <WeddingOffer />
          </Grid>

          {/* בר מצווה */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <BarMitzvahOffer />
          </Grid>

          {/* אירוסין */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <EngagementOffer />
          </Grid>

          {/* ברית */}
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <BritOffer />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default OffersSection;
