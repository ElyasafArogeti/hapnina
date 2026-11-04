
import React, { useState } from 'react';
import axiosInstance from '../axiosInstance';

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
} from '@mui/material';

import {
  Phone,
  Email,
  LocationOn,
  AccessTime,
  WhatsApp,
  Send,
  EventAvailable,
  Favorite,
  Instagram,
} from '@mui/icons-material';

import NavbarHome from './NavbarHome';
import Footer from './Footer';
import TextMove from "./textMove";

const gold = '#b89556';
const dark = '#25221e';
const cream = '#faf8f4';

const Contact = () => {

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    eventType: '',
    message: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // שים לב: יש לוודא שגם השרת מקבל eventType
      await axiosInstance.post('/api/contact', formData);

      setFormData({
        fullName: '',
        phone: '',
        eventType: '',
        message: '',
      });

      setSnackbarMessage('תודה שפניתם אלינו! נחזור אליכם בהקדם.');
      setSnackbarSeverity('success');

    } catch (error) {
      console.error('Contact form error:', error);

      setSnackbarMessage('אירעה שגיאה בשליחת ההודעה. אנא נסו שוב.');
      setSnackbarSeverity('error');

    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const contactItems = [
    {
      icon: <Phone />,
      title: 'מספר הטלפון שלנו',
      value: '079-5152820',
      link: "tel:0795152820",
    },
    {
      icon: <Email />,
      title: 'דואר אלקטרוני',
      value: 'hpnina6600200@gmail.com',
      link: 'mailto:hpnina6600200@gmail.com',
    },
    {
      icon: <LocationOn />,
      title: 'המיקום שלנו',
      value: 'גבעת שאול - ירושלים   ',
      link: null,
    },
    {
      icon: <AccessTime />,
      title: 'שעות פעילות',
      value: 'א-ה - 10:00 - 20:00',
      link: null,
    },
  ];



  return (
    <Box sx={{ backgroundColor: cream, direction: 'rtl', minHeight: '100vh'  }}>
      <NavbarHome />
      <br /><br /><br /><br />
      <TextMove />

      {/* HERO */}

      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: 300, md: 460 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'hidden',
          backgroundImage: `
            linear-gradient(rgba(20,18,15,0.65), rgba(20,18,15,0.65)),
            url("https://res.cloudinary.com/dhkegagjk/image/upload/v1756303986/ChatGPT_Image_Aug_27_2025_05_12_17_PM_ycjcjb.png")
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            sx={{
              color: gold,
              letterSpacing: 3,
              fontSize: 15,
              mb: 2,
            }}
          >
            קייטרינג הפנינה
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '4.5rem' },
              mb: 3,
            }}
          >
            נשמח להכיר אתכם
          </Typography>

          <Typography
            sx={{
              color: '#f5f0e8',
              fontSize: { xs: '1rem', md: '1.3rem' },
              maxWidth: 650,
              mx: 'auto',
              lineHeight: 1.9,
            }}
          >
            כל אירוע מיוחד מתחיל בשיחה אחת.
            אנחנו כאן כדי להקשיב, לייעץ ולעזור לכם
            להפוך את החלום שלכם לחגיגה בלתי נשכחת.
          </Typography>

          <Button
            href="#contact-form"
            variant="contained"
            sx={{
              mt: 4,
              px: 5,
              py: 1.7,
              backgroundColor: gold,
              color: '#fff',
              borderRadius: '30px',
              fontSize: 17,
              '&:hover': {
                backgroundColor: '#9c7940',
              },
            }}
          >
            בואו נדבר
          </Button>
        </Container>
      </Box>

      {/* INTRO */}

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>

        <Box textAlign="center" mb={7}>

          <Typography
            sx={{
              color: gold,
              fontWeight: 600,
              mb: 2,
              letterSpacing: 2,
            }}
          >
            WE ARE HERE FOR YOU
          </Typography>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: dark,
              fontSize: { xs: '1.8rem', md: '2.7rem' },
              mb: 2,
            }}
          >
            בואו נתכנן יחד את האירוע שלכם
          </Typography>

          <Typography
            sx={{
              color: '#777',
              maxWidth: 700,
              mx: 'auto',
              lineHeight: 2,
              fontSize: '1.1rem',
            }}
          >
            בין אם אתם מתכננים חתונה, בר מצווה, בת מצווה,
            אירוע משפחתי או חגיגה מיוחדת –
            אנחנו כאן בשבילכם לכל שאלה, התייעצות ותכנון.
            השאירו פרטים ונחזור אליכם בהקדם.
          </Typography>

        </Box>

        {/* CONTACT CARDS */}

        <Grid container spacing={3} sx={{ mb: 9 }}>

          {contactItems.map((item, index) => (

            <Grid item xs={12} sm={6} md={3} key={index}>

              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  backgroundColor: '#fff',
                  border: '1px solid #eee8dc',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-7px)',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                  },
                }}
              >

                <CardContent
                  sx={{
                    textAlign: 'center',
                    py: 4,
                  }}
                >

                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      backgroundColor: '#f5efe3',
                      color: gold,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      '& svg': { fontSize: 28 },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    fontWeight="bold"
                    sx={{ mb: 1, color: dark }}
                  >
                    {item.title}
                  </Typography>

                  {item.link ? (
                    <Typography
                      component="a"
                      href={item.link}
                      sx={{
                        color: '#777',
                        textDecoration: 'none',
                        fontSize: 14,
                        '&:hover': { color: gold },
                      }}
                    >
                      {item.value}
                    </Typography>
                  ) : (
                    <Typography
                      sx={{ color: '#777', fontSize: 14 }}
                    >
                      {item.value}
                    </Typography>
                  )}

                </CardContent>

              </Card>

            </Grid>

          ))}

        </Grid>

        {/* FORM + CONTACT DETAILS */}

        <Grid container spacing={5} alignItems="stretch">

          {/* דברו איתנו */}

          <Grid item xs={12} md={5}>

            <Box
              sx={{
                backgroundColor: dark,
                color: '#fff',
                height: '100%',
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >

              <Typography
                sx={{
                  color: gold,
                  mb: 2,
                  fontWeight: 600,
                }}
              >
                THE PEARL EXPERIENCE
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mb: 3, lineHeight: 1.5 }}
              >
                הרגעים שלכם.
                <br />
                האירוע שלנו.
              </Typography>

              <Typography
                sx={{
                  color: '#ddd',
                  lineHeight: 2,
                  mb: 4,
                }}
              >
                אנחנו מאמינים שכל אירוע הוא סיפור בפני עצמו.
                לכן חשוב לנו להכיר אתכם, להבין את החלומות שלכם
                ולהעניק לכם יחס אישי לאורך הדרך.
              </Typography>

              <Divider sx={{ borderColor: '#514a40', mb: 3 }} />

              <Stack spacing={3}>

                <Box display="flex" alignItems="center" gap={2}>
                  <Favorite sx={{ color: gold }} />
                  <Typography>יחס אישי וליווי מקצועי</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <EventAvailable sx={{ color: gold }} />
                  <Typography>תכנון אירוע בהתאמה אישית</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Send sx={{ color: gold }} />
                  <Typography>מענה לכל שאלה ובקשה</Typography>
                </Box>

              </Stack>

              <Button
                component="a"
                href="https://wa.me/972548520195"
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsApp />}
                sx={{
                  mt: 5,
                  color: '#fff',
                  backgroundColor: '#25D366',
                  borderRadius: 3,
                  py: 1.5,
                  '&:hover': {
                    backgroundColor: '#1da851',
                  },
                }}
              >
                דברו איתנו בוואטסאפ
              </Button>

            </Box>

          </Grid>

       <br/><br/>
          {/* טופס שליחה  */}
          <Grid item xs={12} md={7} id="contact-form">

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                backgroundColor: '#fff',
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                boxShadow: '0 5px 30px rgba(0,0,0,0.05)',
                border: '1px solid #eee8dc',
              }}
            >

              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ color: dark, mb: 1 }}
              >
                השאירו לנו הודעה
              </Typography>

              <Typography sx={{ color: '#888', mb: 4 }}>
                מלאו את הפרטים ונחזור אליכם בהקדם.
              </Typography>

              <Stack spacing={3}>

                <TextField
                  name="fullName"
                  label="שם מלא"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  name="phone"
                  label="מספר טלפון לחזרה"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  select
                  name="eventType"
                  label="איזה אירוע אתם מתכננים?"
                  value={formData.eventType}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="חתונה">חתונה</MenuItem>
                  <MenuItem value="בר מצווה">בר מצווה</MenuItem>
                  <MenuItem value="בת מצווה">בת מצווה</MenuItem>
                  <MenuItem value="ברית">ברית</MenuItem>
                  <MenuItem value="אירוע משפחתי">אירוע משפחתי</MenuItem>
                  <MenuItem value="אירוע עסקי">אירוע עסקי</MenuItem>
                  <MenuItem value="אחר">אחר</MenuItem>
                </TextField>

                <TextField
                  name="message"
                  label="ספרו לנו קצת על האירוע שלכם"
                  multiline
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                  sx={{
                    py: 1.8,
                    backgroundColor: gold,
                    borderRadius: 3,
                    fontSize: 17,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#9c7940',
                    },
                  }}
                >
                  {loading ? 'שולח...' : 'שליחת הודעה'}
                </Button>

                <Typography
                  variant="caption"
                  textAlign="center"
                  color="text.secondary"
                >
                  הפרטים שלכם ישמשו אותנו לצורך חזרה אליכם
                  בנוגע לפנייתכם.
                </Typography>

              </Stack>

            </Box>

          </Grid>

        </Grid>

      </Container>

  

    

      {/* BOTTOM MESSAGE */}

      <Box
        sx={{
          backgroundColor: dark,
          textAlign: 'center',
          py: 6,
          px: 4,
        }}
      >

        <Typography
          variant="h4"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            mb: 6,
          }}
        >
          האירוע הבא שלכם מתחיל כאן
        </Typography>

        <Typography sx={{ color: '#ddd', lineHeight: 2 }}>
          קייטרינג הפנינה – כי הרגעים החשובים בחיים
          ראויים למקום מיוחד.
        </Typography>

      </Box>

      {/* SNACKBAR */}

      <Footer />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default Contact;
