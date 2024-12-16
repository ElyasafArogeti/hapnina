import React from 'react';
import { Box, Typography, Container, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { FaWaze } from "react-icons/fa";
import { Link  } from 'react-router-dom';
import {BsTelephoneOutbound} from "react-icons/bs";
import logo from "../../assets/imgs/הלוגו.png";
const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#000', // צבע רקע שחור
        color: '#fff', // צבע טקסט לבן
        textAlign: 'center',
        padding: '2rem 0',
        marginTop: '2rem', // רווח מלמעלה
      }}
    >

      <Container maxWidth="lg">
       
      <Box display="flex" alignItems="center" justifyContent={"center"} marginTop={"auto"}>   
        <Link component={Link} to="/" sx={{ textDecoration: 'none' }}>
          <Box 
            component="img" 
            src={logo} 
            alt="אולם האירועים הפנינה"
            sx={{
              width: { xs: '140px', sm: '200px', md: '200px' }, 
              height: { xs: '100px', sm: '200px', md: '150px' },
              position: 'relative',
              maxHeight: '150px', 
              borderRadius: '8px', 
              marginTop: 'auto',
              cursor: 'pointer',
              objectFit: 'cover',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 3)',
            }} 
          />
        </Link> 
      </Box>
        <br/><br/>
        <Typography variant="body1" sx={{ fontSize: '1rem', marginBottom: '1rem' }}>
          אלום אירועים הפנינה רחוב מפעל השס 1 ביתר עלית 
        </Typography>

        {/* אייקונים לרשתות חברתיות */}
       
        <Box >
            <IconButton
              href="https://ul.waze.com/ul?preview_venue_id=23003453.230165602.328234&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"
              target="_blank"  sx={{ color: '#fff', margin: '0 0.5rem' }}aria-label="Instagram" > <FaWaze /> 
            </IconButton>
            <IconButton href="tel:+972546600200" target="_blank"  sx={{ color: '#fff', margin: '0 0.5rem' }}aria-label="Instagram">
              <BsTelephoneOutbound />
            </IconButton>
            <IconButton href="https://wa.me/+972546600200" target="_blank" sx={{ color: '#fff', margin: '0 0.5rem' }}aria-label="Instagram">
            <WhatsAppIcon/>
            </IconButton>
 
      </Box>
         
       

        {/* זכויות יוצרים */}
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.9rem',
            marginTop: '1rem',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
         אולמי הפנינה בעם  © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
