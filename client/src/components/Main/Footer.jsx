import React from 'react';
import { Box, Typography, Container, Grid, IconButton, Link as MuiLink } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaWaze } from "react-icons/fa";
import { BsTelephoneOutbound } from "react-icons/bs";
import { Link } from 'react-router-dom';
import logo from "../../assets/imgs/logo.jpg";

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#000',
        color: '#fff',
        padding: '3rem 0 2rem 0',
        mt: 6,
        borderTop: '1px solid #333',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* לוגו + תיאור */}
          <Grid item xs={12} md={3}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box
                component="img"
                src={logo}
                alt="לוגו קייטרינג הפנינה"
                sx={{
                  width: '160px',
                  height: 'auto',
                  mb: 2,
                  borderRadius: '8px',
                  objectFit: 'cover',
                  boxShadow: '0 5px 20px rgba(0,0,0,0.5)'
                }}
              />
            </Link>
            <Typography variant="body2">
              קייטרינג איכותי עם שירות אישי, באירועים קטנים וגדולים – מושב עין צורים.
            </Typography>
          </Grid>

          {/* ניווט מהיר */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>ניווט מהיר</Typography>
            <Box>
              <MuiLink component={Link} to="/" color="inherit" underline="hover" display="block">דף הבית</MuiLink>
              <MuiLink component={Link} to="/FAQAccordion" color="inherit" underline="hover" display="block">שאלות ותשובות</MuiLink>
              <MuiLink component={Link} to="/contact" color="inherit" underline="hover" display="block">צור קשר</MuiLink>
              <MuiLink component={Link} to="/OrdersOnline" color="inherit" underline="hover" display="block">הזמנה אונליין</MuiLink>
            </Box>
          </Grid>

      <Grid item xs={12} md={3}>
  <Typography variant="h6" gutterBottom>מידע חשוב</Typography>
  <Box>
    <MuiLink href="/FAQAccordion#2" color="inherit" underline="hover" display="block">מה ההכשר שלנו?</MuiLink>
    <MuiLink href="/FAQAccordion#5" color="inherit" underline="hover" display="block">האם יש משלוחים?</MuiLink>
    <MuiLink href="/FAQAccordion#3" color="inherit" underline="hover" display="block">כמה זמן מראש צריך לתאם הזמנה?</MuiLink>
    <MuiLink href="/FAQAccordion#6" color="inherit" underline="hover" display="block">האם ניתן לשנות הזמנה?</MuiLink>
    <MuiLink href="/FAQAccordion#8" color="inherit" underline="hover" display="block">יש מנות צמחוניות?</MuiLink>
  </Box>
</Grid>


          {/* צור קשר + כפתורים */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>צור קשר</Typography>
            <Typography variant="body2" gutterBottom>
              מושב עין צורים, ישראל<br />
              שירות לקוחות: <MuiLink href="tel:+972548520195" color="inherit">054-8520-195</MuiLink><br />
              אימייל: <MuiLink href="mailto:hpnina6600200@gmail.com" color="inherit">hpnina6600200@gmail.com</MuiLink>
            </Typography>

            <Box mt={1}>
              <IconButton
                href="https://ul.waze.com/ul?preview_venue_id=23003453.230165602.328234&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
                target="_blank"
                sx={{ color: '#fff', mr: 1 }}
                aria-label="Waze"
              >
                <FaWaze size={20} />
              </IconButton>

              <IconButton
                href="tel:+972548520195"
                sx={{ color: '#fff', mr: 1 }}
                aria-label="Phone"
              >
                <BsTelephoneOutbound size={20} />
              </IconButton>

              <IconButton
                href="https://wa.me/972548520195"
                target="_blank"
                sx={{ color: '#fff' }}
                aria-label="WhatsApp"
              >
                <WhatsAppIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* שורת תחתונה */}
        <Box textAlign="center" mt={5} pt={3} borderTop="1px solid #333">
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.85rem' }}
          >
            קייטרינג הפנינה בע"מ © {new Date().getFullYear()} | כל הזכויות שמורות
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
