import { Container, Typography } from "@mui/material";
import BarMitzvahOffer from "./BarMitzvahOffer";//בר מצוה
import WeddingOffer from "./WeddingOffer";// חתונה
import EngagementOffer from "./EngagementOffer";//אירוסין
import BritOffer from "./BritOffer";//ברית
import Grid from '@mui/material/Grid2';
const OffersSection = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" textAlign="center"  gutterBottom>
         חבילות תפריטים שונים  
      </Typography>
      <Grid size={{ xs: 12, sm:4 }} container spacing={1}>
        {/* חתונה */}
      <Grid size={{ xs: 12, sm: 6 }} lg={3}><WeddingOffer /></Grid> 
        {/* בר מצוה */}
      <Grid size={{ xs: 12, sm: 6 }}  lg={3}><BarMitzvahOffer /></Grid>
        {/* אזכרות */}
      <Grid size={{ xs: 12, sm:6 }} lg={3}><EngagementOffer /></Grid>
        {/* ברית */}
      <Grid size={{ xs: 12, sm: 6 }} lg={3}><BritOffer /></Grid>
      </Grid>
    </Container>
  );
};

export default OffersSection;
