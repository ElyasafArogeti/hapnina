import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  CssBaseline,
  Box
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavbarHome from './NavbarHome';
import Footer from './Footer';
import img from '../../assets/imgs/imgFAQ.jpeg';
import TextMove from './textMove';

const faqs = [
  {
    question: 'רכשתי באתר ומשהו לא תקין בהזמנה, מה עושים',
    answer: 'פנה לשירות הלקוחות שלנו עם פרטי ההזמנה ונשמח לעזור!',
  },
  {
    question: 'איזה הכשר יש למנות',
    answer: 'כל האוכל בכשרות מהודרת של הרב לנדא שליט"א. חלק מהבשרים בכשרות בית יוסף.',
  },
  {
    question: 'אני רוצה לעשות הזמנה חדשה כמו הזמנה שעשיתי בעבר, יש אפשרות',
    answer: 'כן! ניתן להיכנס להיסטוריית ההזמנות ולבצע הזמנה חוזרת בקלות.',
  },
  {
    question: 'מתי אפשר לבצע הזמנה',
    answer: 'ניתן לבצע הזמנות בכל ימות השבוע עד יום חמישי בשעה 20:00.',
  },
  {
    question: 'לאיפה אתם עושים משלוחים וכמה עולה משלוח',
    answer: 'אנחנו מבצעים משלוחים לאזור המרכז והשרון. מחיר משלוח: 35 ש"ח.',
  },
];

export default function FAQAccordion() {
  return (
    <Box sx={{ backgroundColor: '#f9f9f9', width: '100%', direction: 'rtl'  }}>
     <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br /> <br /> <br /><br />
      <TextMove />
      {/* תמונה עם כותרת */}
<Box
  sx={{
    height: 400,
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${img})`,
    backgroundSize: 'cover',
    backgroundPosition: 'top center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textShadow: '0px 0px 10px rgba(0,0,0,0.8)',
    position: 'relative',
    overflow: 'hidden',
  }}
>
  {/* טקסט עם ריחוף */}
  <Typography
    variant="h3"
    sx={{
      textAlign: 'center',
      px: 2,
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      opacity: 0, // מתחיל מוסתר
      animation: 'fadeInUp 1.8s ease-out forwards',
    }}
  >
    שאלות ותשובות
  </Typography>

  {/* אנימציית ריחוף */}
  <style>
    {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(30%);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `}
  </style>
</Box>




      <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            sx={{
              backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',
              boxShadow: 2,
              borderRadius: 1,
              mb: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ flexDirection: 'row-reverse' }} />}
            >
              <Typography
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  textAlign: 'right',
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography
                color="text.secondary"
                sx={{ textAlign: 'center' }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>

      <Footer />
    </Box>
  );
}
