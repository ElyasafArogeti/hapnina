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
    question: 'רכשתי באתר ומשהו לא תקין בהזמנה, מה עושים?',
    answer: 'פנה לשירות הלקוחות שלנו עם פרטי ההזמנה ונשמח לעזור!',
  },
  {
    question: 'מה הכשרות שלכם?',
    answer: 'האוכל בכשרות בד"ץ "יורה דעה" של הרב מחפוד שליט"א.',
  },
  {
    question: 'כמה זמן מראש צריך לתאם הזמנה?',
    answer: 'יש לתאם את ההזמנה עד שלושה ימים מראש (72- שעות לפני מועד האירוע).',
  },
  {
    question: 'מה קורה אם חסר מוצר ממה שהזמנתי?',
    answer: 'השליח עובר על ההזמנה עם הלקוח. במקרה של חוסר – עליו לדאוג ולטפל במקום בפתרון הבעיה מול הלקוח.',
  },
  {
    question: 'לאילו אזורים אתם עושים משלוחים ומה העלות?',
    answer: 'אנחנו עושים משלוחים מאזור הדרום (באר שבע) ועד אזור הרצליה, כפר סבא, צפון רמת השרון. עלות המשלוח תיקבע בהתאם לאזור.',
  },
  {
    question: 'האם ניתן לבצע שינויים בהזמנה אחרי שבוצעה?',
    answer: 'בוודאי. ניתן ליצור קשר עם הנציג שלנו במספר: 054-8520195 ולקבל שירות אישי לביצוע שינויים, הוספות, מחיקות או עריכה של התפריט – כל עוד זה לא מאוחר מ-3 ימים לפני ההזמנה.',
  },
  {
    question: 'מה צריך לעשות לקראת האירוע?',
    answer: 'שום דבר! אנו ניצור איתכם קשר מבעוד מועד כדי לוודא שהכול מוכן ושתקבלו אירוע או קייטרינג ברמה הגבוהה ביותר.',
  },
  {
    question: 'האם יש לכם גם מנות צמחוניות?',
    answer: 'בהחלט. ניתן להזמין מנות צמחוניות בתיאום מראש עם שירות הלקוחות שלנו.',
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
    backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://res.cloudinary.com/dhkegagjk/image/upload/v1757592341/%D7%A9%D7%90%D7%9C%D7%95%D7%AA_%D7%95%D7%AA%D7%A9%D7%95%D7%91%D7%95%D7%AA_hsdur3.jpg")`,
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
