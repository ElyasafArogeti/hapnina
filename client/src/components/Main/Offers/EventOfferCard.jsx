import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const EventOfferCard = ({ title, price, details, href }) => {
  return (
    <Card sx={{ boxShadow: 3, borderRadius: 4, padding: 3, minHeight: 300 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" color="green" gutterBottom>
          {price} ₪ למנה
        </Typography>
        <Typography variant="body2" sx={{ minHeight: "100px" }}>
          {details}
        </Typography>
        <Box mt={2} textAlign="center">
          <Button variant="contained" endIcon={<ArrowBackIcon />} href={href}>
            להזמנה
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EventOfferCard;
