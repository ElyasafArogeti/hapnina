import { Container, Typography } from "@mui/material";
import BarMitzvahOffer from "./BarMitzvahOffer";//בר מצוה
import WeddingOffer from "./WeddingOffer";// חתונה
import EngagementOffer from "./EngagementOffer";//אירוסין
import BritOffer from "./BritOffer";//ברית
import Grid from '@mui/material/Grid2';
const OffersSection = () => {
  return (
    <Container sx={{ py: 6 }}>
      <Typography variant="h4" textAlign="center" fontWeight="bold" gutterBottom>
       הצעות מחיר לאירועים 
      </Typography>
      <Grid size={{ xs: 12, sm:4 }} container spacing={1}>

        <Grid size={{ xs: 12, sm: 6 }}  lg={3}><BarMitzvahOffer /></Grid>
        <Grid size={{ xs: 12, sm: 6 }} lg={3}><WeddingOffer /></Grid>
        <Grid size={{ xs: 12, sm:6 }} lg={3}><EngagementOffer /></Grid>
        <Grid size={{ xs: 12, sm: 6 }} lg={3}><BritOffer /></Grid>
      </Grid>
    </Container>
  );
};

export default OffersSection;
