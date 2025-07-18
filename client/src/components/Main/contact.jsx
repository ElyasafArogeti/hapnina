import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, IconButton, Snackbar, Alert } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import { BsWhatsapp, BsTelephoneOutbound } from 'react-icons/bs';
import NavbarHome from './NavbarHome';
import Footer from './Footer';
import Grid from '@mui/material/Grid2'; 
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); // מצב פתיחה של ה-Snackbar
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // סוג ההודעה (הצלחה או שגיאה)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/contact', formData);
      if (response.status === 200) {
    
        setFormData({ fullName: '', phone: '', message: '' });
        setSnackbarMessage('!ההודעה נשלחה בהצלחה');
        setSnackbarSeverity('success');
      }
    } catch (error) {
      setSnackbarMessage('שגיאה בשליחת ההודעה. נסה שוב');
      
      console.log(error);
      
      setSnackbarSeverity('error');
    }
    setOpenSnackbar(true); // מציג את ה-Snackbar לאחר שליחה
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ backgroundColor: '#f9f9f9', width: '100%', direction: 'rtl' }}>
      {/* תפריט ניווט */}
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br /> <br /> <br /><br />

      {/* כותרת ראשית */}
      <Box sx={{ position: 'relative', width: '100%', height: '400px', overflow: 'hidden' }}>
        <Box
          component="img"
          src="https://www.soferet-milim.com/wp-content/uploads/2022/04/Cover-1.jpg"
          alt="רקע יוקרתי"
          sx={{
            width: '100%',
            height: '400px',
            objectFit: 'cover',
            filter: 'brightness(40%)',
          }}
        />
        <Typography
          variant="h3"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontWeight: 'bold',
            fontSize: '3.5rem',
            color: 'white',
            textShadow: '0px 4px 8px rgba(0,0,0,0.7)',
            textAlign: 'center',
          }}
        >
          צור קשר
        </Typography>
      </Box>

      {/* תוכן הדף */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          תישארו קרובים - לפרטים
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 6, color: 'gray', fontSize: '1.2rem' }}
        >
          יש לכם אירוע בקרוב ומעוניינים לסגור איתנו? צרו קשר ונשמח לעזור!
        </Typography>

        <Grid container spacing={4} xs={{ display: 'flex', justifyContent: 'space-evenly',alignItems: 'center' }}>
          {/* פרטי קשר */}
          <Grid xs={12} md={6}>
            <Box
              sx={{
                textAlign: 'right',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                alignItems: 'flex-start',
              }}
            >
              <Box display="flex" alignItems="center" gap={2} sx={{ flexDirection: 'row-reverse' }}>
                <Phone sx={{ fontSize: 32, color: '#0072e3' }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  054-660-0200
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} sx={{ flexDirection: 'row-reverse' }}>
                <Email sx={{ fontSize: 32, color: '#0072e3' }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  Ely6600200@gmail.com
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={2} sx={{ flexDirection: 'row-reverse' }}>
                <LocationOn sx={{ fontSize: 32, color: '#0072e3' }} />
                <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                  רחוב מפעל הש"ס 1, ביתר עלית
                </Typography>
              </Box>

              <Box display="flex" justifyContent="flex-start" gap={3} mt={2}>
                <IconButton
                  href="tel:+972548520195"
                  target="_blank"
                  sx={{
                    backgroundColor: '#0072e3',
                    color: 'white',
                    '&:hover': { backgroundColor: '#005bb5' },
                  }}
                >
             <BsTelephoneOutbound size={20} />
                </IconButton>
                <IconButton
                  href="https://wa.me/+972546600200"
                  target="_blank"
                  sx={{
                    backgroundColor: '#25D366',
                    color: 'white',
                    '&:hover': { backgroundColor: '#1DA057' },
                  }}
                >
                  <BsWhatsapp size={20} />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* טופס יצירת קשר */}
          <Grid direction={"rtl"} xs={6} md={6}>
            <Box 
              component="form"
              onSubmit={handleSubmit}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                width: '100%',
                textAlign: 'right',
                backgroundColor: '#fff',
                padding: 4,
                borderRadius: '8px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <TextField
                name="fullName"
                label="שם מלא"
                variant="outlined"
                fullWidth
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                name="phone"
                label="פלאפון לחזרה"
                type="tel"
                variant="outlined"
                fullWidth
                required
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                name="message"
                label="הודעה"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                required
                value={formData.message}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{
                  backgroundColor: '#0072e3',
                  '&:hover': { backgroundColor: '#005bb5' },
                }}
              >
                שלח הודעה
              </Button>
            </Box>
          </Grid>
        </Grid>


     {/* הודעה שליחה */}
        <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}  // מיקום אמצעי למעלה
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>



         {/* מפה */}
         <Box mt={6} sx={{ height: '400px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3394.251301994778!2d35.11510721564083!3d31.6954784813095!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502dbf06e151619%3A0x7e5faecfb28cb705!2z15TXmdeT15nXnteZ16gg15XXqNeV16jXmdeZINec15nXnteU15nXlQ!5e0!3m2!1siw!2sil!4v1691684048408!5m2!1siw!2sil"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Contact;
