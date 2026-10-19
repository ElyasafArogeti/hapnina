import React, { useState, useEffect, useRef} from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Drawer,
  Badge,
  Divider
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Footer from './Footer';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import NavbarHome from "./NavbarHome";
import TextMove from "./textMove";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";



//   דף סל הקניות 





// פונקציית חישוב המנה כולל הרווח והמעמ 
const calculateCustomerPrice = (price) => {
  if (price == null) return null;

  return Math.round(price * 1.5 * 1.18 * 100) / 100;
};

// תפריט קייטרינג הפנינה
const dishes = [
  // =========================
  // דגים
  // =========================
  {
    id: 1,
    name: "פילה מושט מזרחי מרוקאי ",
    price: 14,
    unit: "למנה",
    category: "דגים",
    details: "מטוגן או מבושל",
    image: "",
  },
  {
    id: 2,
    name: "פילה סלמון ברוטב פסטו",
    price: 17,
    unit: "למנה",
    category: "דגים",
    details: "כל הטעמים",
    image: "",
  },
  {
    id: 86,
    name:   "פילה מושט ברוטב לימון ושקדים",
    price: 17,
    unit: "למנה",
    category: "דגים",
    details: "כל הטעמים",
    image: "",
  },
  {
    id: 3,
    name: "פילה לברק",
    price: null,
    unit: "",
    category: "דגים",
    details: "",
    image: "",
  },
  {
    id: 4,
    name: "קציצות דגים",
    price: 55,
    unit: "לק״ג",
    category: "דגים",
    details: "כ-50 גרם לקציצה",
    image: "",
  },

  // =========================
  // בשרים
  // =========================
  {
    id: 5,
    name: "מעורב ירושלמי + פירה ",
    price: 85,
    unit: "קילו ",
    category: "בשרים",
    details: "קילו מעורב וקילו פירה",
    image: "",
  },

  {
    id: 6,
    name: "כבדים מוקפצים + פירה",
    price: 90,
    unit: "לזוג ק״ג",
    category: "בשרים",
    details: "קילו מעורב וקילו פירה",
    image: "",
  },
  {
    id: 7,
    name: "מאפה פילו בשר",
    price: 15,
    unit: "ליחידה",
    category: "בשרים",
    details: "מוגש עם רוטב",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026786/manager_images/first_courses/%D7%9E%D7%90%D7%A4%D7%94%20%D7%A4%D7%99%D7%9C%D7%95%20%D7%91%D7%A9%D7%A8%20%D7%A2%D7%9D%20%D7%A8%D7%95%D7%98%D7%91.jpg",
  },
  {
    id: 8,
    name: "טורטיה בשר",
    price: 15,
    unit: "ליחידה",
    category: "בשרים",
    details: "מוגשת עם רוטב",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0115_jsponj.jpg",
  },
  {
    id: 9,
    name: "ארטישוק ממולא בשר",
    price: 15,
    unit: "ליחידה",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 10,
    name: "מאפה קדאיף בשר",
    price: null,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 11,
    name: "קוראסון אסאדו",
    price: null,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 12,
    name: "קרפצ'יו בקר",
    price: null,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 13,
    name: "צלי בשר מספר 5",
    price: 26,
    unit: "ליחידה",
    category: "בשרים",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 14,
    name: "צלי בשר מספר 6",
    price: 20,
    unit: "ליחידה",
    category: "בשרים",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 15,
    name: "אסאדו",
    price: 22,
    unit: "ליחידה",
    category: "בשרים",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 16,
    name: "אסאדו גוש",
    price: 180,
    unit: "לגוש",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 17,
    name: "אסאדו מפורק לקוראסון",
    price: null,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 18,
    name: "שיפודי קבב",
    price: 14,
    unit: "לשני שיפודים",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 19,
    name: "קבבונים",
    price: 75,
    unit: "לק״ג",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 20,
    name: "בשר לחמין",
    price: 80,
    unit: "לק״ג",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 21,
    name: "קציצות בשר ברוטב",
    price: 50,
    unit: "לק״ג",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 22,
    name: "קציצות בשר קבב",
    price: 80,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 23,
    name: "בשר ראש",
    price: null,
    unit: "",
    category: "בשרים",
    details: "",
    image: "",
  },

  // =========================
  // עופות
  // =========================
  {
    id: 24,
    name: "פרגית ממולאת",
    price: 22,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 25,
    name: "פרגית על האש",
    price: 17,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026551/manager_images/main_courses/%D7%A1%D7%98%D7%99%D7%99%D7%A7%20%D7%A4%D7%A8%D7%92%D7%99%D7%AA.jpg",
  },
  {
    id: 26,
    name: "פסטיה פרגית",
    price: null,
    unit: "",
    category: "עופות",
    details: "",
    image: "",
  },
  {
    id: 27,
    name: "עוף ברוטב שזיפים",
    price: 20,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 28,
    name: "עוף בגריל",
    price: 20,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 29,
    name: "חזה עוף ממולא",
    price: 16,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 30,
    name: "חזה עוף על האש",
    price: 13,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 31,
    name: "שניצל",
    price: 14,
    unit: "ליחידה",
    category: "עופות",
    details: "מינימום 120 גרם",
    image: "",
  },
  {
    id: 32,
    name: "שיפודי עוף וירקות",
    price: 14,
    unit: "לשני שיפודים",
    category: "עופות",
    details: "",
    image: "",
  },
  {
    id: 33,
    name: "שניצלונים",
    price: 80,
    unit: "לק״ג",
    category: "עופות",
    details: "",
    image: "",
  },
  {
    id: 34,
    name: "מוקפץ סיני עם רצועות עוף",
    price: 80,
    unit: "לק״ג",
    category: "עופות",
    details: "",
    image: "",
  },
  {
    id: 35,
    name: "שווארמה מוקפצת עם בצל",
    price: 80,
    unit: "לק״ג",
    category: "עופות",
    details: "",
    image: "",
  },
  {
    id: 36,
    name: "קציצות עוף ברוטב",
    price: 45,
    unit: "לק״ג",
    category: "עופות",
    details: "",
    image: "",
  },

  // =========================
  // תוספות
  // =========================
  {
    id: 37,
    name: "מוקפץ תאילנדי + פירה",
    price: 80,
    unit: "לזוג ק״ג",
    category: "תוספות",
    details: "קילו מוקפץ וקילו פירה",
    image: "",
  },
  {
    id: 38,
    name: "טורטיה צמחונית",
    price: 15,
    unit: "ליחידה",
    category: "תוספות",
    details: "מוגשת עם רוטב",
    image: "",
  },
  {
    id: 39,
    name: "מוסקה",
    price: 19,
    unit: "",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 40,
    name: "אורז עם קישוט",
    price: 16,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 41,
    name: "אורז צהוב",
    price: 16,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940128/manager_images/side_dishes/%D7%90%D7%95%D7%A8%D7%96%20%D7%A6%D7%94%D7%95%D7%91.jpg",
  },
  {
    id: 42,
    name: "אורז אשפלו עם ירקות",
    price: 16,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 43,
    name: "אפונה, ארטישוק וסלרי",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 44,
    name: "שעועית ארוכה מוקפצת",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 45,
    name: "שעועית ארוכה ברוטב עגבניות",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 46,
    name: "ירקות מאודים בתנור",
    price: 22,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 47,
    name: "ירקות סיני מוקפץ",
    price: 22,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940187/manager_images/side_dishes/%D7%99%D7%A8%D7%A7%D7%95%D7%AA%20%D7%A1%D7%99%D7%A0%D7%99%20%D7%9E%D7%95%D7%A7%D7%A4%D7%A5.jpg",
  },
  {
    id: 48,
    name: "ארטישוק ופטריות שלמות",
    price: 30,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 49,
    name: "כל סוגי תפוחי האדמה",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411438/IMG-20250713-WA0110_qsz1ry.jpg",
  },
  {
    id: 50,
    name: "כל סוגי הבטטה",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411441/IMG-20250713-WA0107_w1m5cg.jpg",
  },
  {
    id: 51,
    name: "קוסקוס + מרק קוסקוס",
    price: 20,
    unit: "לק״ג",
    category: "תוספות",
    details: "",
    image: "",
  },
  {
    id: 52,
    name: "קטניות לחמין",
    price: 16,
    unit: "לק״ג",
    category: "תוספות",
    details: "שעועית, חומוס וחיטה",
    image: "",
  },
  {
    id: 53,
    name: "ביצים עם קליפה",
    price: 2,
    unit: "ליחידה",
    category: "תוספות",
    details: "",
    image: "",
  },

  // =========================
  // סלטים
  // =========================
  {
    id: 54,
    name: "קרפצ'יו סלק",
    price: null,
    unit: "לקילו",
    category: "בשרים",
    details: "",
    image: "",
  },
  {
    id: 55,
    name: "גזר מרוקאי חי",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0123_oqu4hr.jpg",
  },
  {
    id: 56,
    name: "גזר מרוקאי מבושל",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411743/IMG-20250713-WA0130_vys8t0.jpg",
  },
  {
    id: 57,
    name: "טחינה מתובלת",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%98%D7%97%D7%99%D7%A0%D7%94_%D7%9E%D7%AA%D7%95%D7%91%D7%9C%D7%AA_vahf3p.webp",
  },
  {
    id: 58,
    name: "חמוצי הבית",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100669/manager_images/salads/%D7%97%D7%9E%D7%95%D7%A6%D7%99%20%D7%94%D7%91%D7%99%D7%AA.jpg",
  },
  {
    id: 59,
    name: "מבחר חמוצים",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 60,
    name: "ירקות חיים טריים ועשירים",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 61,
    name: "חציל בטחינה",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940059/manager_images/salads/%D7%97%D7%A6%D7%99%D7%9C%20%D7%91%D7%98%D7%97%D7%99%D7%A0%D7%94.jpg",
  },
  {
    id: 62,
    name: "חציל יווני",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%97%D7%A6%D7%99%D7%9C_%D7%99%D7%95%D7%95%D7%A0%D7%99_wyh4q0.webp",
  },
  {
    id: 63,
    name: "חציל טבעי על האש",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 64,
    name: "חציל במיונז",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 65,
    name: "קוביות חציל פיקנטי",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0129_vrhw3n.jpg",
  },
  {
    id: 66,
    name: "כרוב ושמיר",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 67,
    name: "כרוב וגזר במיונז",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%95%D7%92%D7%96%D7%A8_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_r8xpo4.jpg",
  },
  {
    id: 68,
    name: "כרוב וגזר מתובל",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 69,
    name: "כרוב אדום במיונז",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%90%D7%93%D7%95%D7%9D_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_wrftkh.jpg",
  },
  {
    id: 70,
    name: "סלט עגבניות חריף",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_7_bqk4r4.jpg",
  },
  {
    id: 71,
    name: "מטבוחה",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9E%D7%98%D7%91%D7%95%D7%97%D7%94_ziwlal.jpg",
  },
  {
    id: 72,
    name: "סלט מלפפון בשמיר",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 73,
    name: "שרי בבזיליקום",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 74,
    name: "פלפל מתוק בצבעים",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0141_edsu2v.jpg",
  },
  {
    id: 75,
    name: "סלט טבולה",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757938815/manager_images/salads/%D7%A1%D7%9C%D7%98%20%D7%98%D7%91%D7%95%D7%9C%D7%94.jpg",
  },
  {
    id: 76,
    name: "שורש סלרי",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 77,
    name: "תירס מקסיקני",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100721/manager_images/salads/%D7%AA%D7%99%D7%A8%D7%A1%20%D7%9E%D7%A7%D7%A1%D7%99%D7%A7%D7%A0%D7%99.jpg",
  },
  {
    id: 78,
    name: "תפוחי אדמה במיונז",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100613/manager_images/salads/%D7%AA%D7%A4%D7%95%27%D7%90%20%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96.jpg",
  },
  {
    id: 79,
    name: "קוביות סלק",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887467/%D7%A7%D7%95%D7%91%D7%99%D7%95%D7%AA_%D7%A1%D7%9C%D7%A7_bkcjei.webp",
  },
  {
    id: 80,
    name: "סלט בטטה",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%A1%D7%9C%D7%98_%D7%91%D7%98%D7%98%D7%94_t9vgji.webp",
  },
  {
    id: 81,
    name: "סלט ירוק",
    price: 29,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_sspqpy.jpg",
  },
  {
    id: 82,
    name: "חומוס ישראלי",
    price: 23,
    unit: "לקילו ",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%97%D7%95%D7%9E%D7%95%D7%A1_%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99_boq1zc.jpg",
  },
  {
    id: 83,
    name: "חסה, שרי ונבטים ברוטב",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 84,
    name: "קינואה",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "",
  },
  {
    id: 85,
    name: "פלפל חריף",
    price: 23,
    unit: "לקילו",
    category: "סלטים",
    details: "",
    image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411746/IMG-20250713-WA0108_noob7d.jpg",
  },
];

// קטגוריות
const categories = [
  {
    name: "סלטים",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411743/IMG-20250713-WA0130_vys8t0.jpg",
  },
  {
    name: "בשרים",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0135_i0cvwo.jpg",
  },
  {
    name: "עופות",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940232/manager_images/main_courses/%D7%A2%D7%95%D7%A3%20%D7%91%D7%92%D7%A8%D7%99%D7%9C.jpg",
  },
  {
    name: "דגים",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0146_csvwdl.jpg",
  },
  {
    name: "תוספות",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411441/IMG-20250713-WA0107_w1m5cg.jpg",
  },
  {
    name: "לשבתות ",
    image:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1791904848/%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%A9%D7%91%D7%AA_jmcv5t.jpg",
  },
];





export default function MainCourse() {
  

const [selectedCategory, setSelectedCategory] = useState("סלטים");

const navigate = useNavigate();

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

const [addingToCart, setAddingToCart] = useState(null);
  const [quantities, setQuantities] = useState({});

  const [openCart, setOpenCart] = useState(false);

  const [animateImage, setAnimateImage] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

const productsSectionRef = useRef(null);

  const increase = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1
    }));

  };

  const decrease = (id) => {

    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1)
    }));

  };



const addToCart = (dish, e) => {
  if (e) e.stopPropagation();

  const finalPrice = calculateCustomerPrice(dish.price);
  const selectedQuantity = quantities[dish.id] || 1;

  setCart((prev) => {
    const existingItem = prev.find(
      (item) => item.id === dish.id
    );

    if (existingItem) {
      return prev.map((item) =>
        item.id === dish.id
          ? {
              ...item,
              quantity: item.quantity + selectedQuantity,
            }
          : item
      );
    }

    return [
      ...prev,
      {
        ...dish,
        price: finalPrice,
        quantity: selectedQuantity,
      },
    ];
  });

  setOpenCart(true);
};


  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

 const totalPrice = cart.reduce(
  (total, item) =>
    total + (item.price == null ? 0 : item.price * item.quantity),
  0
);

  const totalItems = cart.length;
  
const filteredDishes = dishes.filter(
  (item) => item.category === selectedCategory
); 




  return (
    <Box sx={{ backgroundColor: '#f9f9f9', width: '100%',direction: 'rtl'}}>
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br/> <br/> <br/><br/>
      <TextMove/>
{/* פתיח להזמנה */}
<Box sx={{ width: "100%", maxWidth: 1000, mx: "auto", mt: { xs: 2, md: 4 }, mb: { xs: 3, md: 5 }, px: { xs: 2, md: 3 }, boxSizing: "border-box" }}>
  <Box sx={{ textAlign: "center", bgcolor: "#fffaf5", border: "1px solid #eadbc8", borderRadius: 3, px: { xs: 2, md: 5 }, py: { xs: 3, md: 4 }, boxShadow: "0 4px 18px rgba(100,65,30,0.06)" }}>
    <Typography sx={{ fontSize: { xs: 23, md: 32 }, fontWeight: 800, color: "#6d4228", mb: 1 }}>
      הטעם הטוב מתחיל כאן
    </Typography>
    <Typography sx={{ fontSize: { xs: 14, md: 17 }, color: "#62564d", lineHeight: 1.9, maxWidth: 700, mx: "auto" }}>
      ברוכים הבאים להזמנת האוכל המוכן שלנו. בחרו ממגוון המנות האהובות עליכם, לפי קילוגרמים או יחידות, בהתאם לאופן שבו כל מנה מוצגת בתפריט.
    </Typography>
    <Typography sx={{ fontSize: { xs: 14, md: 16 }, color: "#6d4228", fontWeight: 600, mt: 1 }}>
      הוסיפו את המנות לסל הקניות, עברו לסיכום ההזמנה והמשיכו להשלמת הפרטים.
    </Typography>
  </Box>
</Box>
     {/* קטגוריות */}
<Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
    py: 4,
    px: 2,
  }}
>
  {categories.map((cat) => (
    <Box
      key={cat.name}
     onClick={() => {
  setSelectedCategory(cat.name);

  if (window.innerWidth < 900) {
    setTimeout(() => {
      productsSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }
}}
      sx={{
        width: 150,
        cursor: "pointer",
        textAlign: "center",
        borderRadius: 4,
        overflow: "hidden",
        boxShadow:
          selectedCategory === cat.name
            ? "0 10px 30px rgba(0,0,0,0.25)"
            : "0 4px 15px rgba(0,0,0,0.12)",
        transform:
          selectedCategory === cat.name
            ? "scale(1.08)"
            : "scale(1)",
        transition: "0.3s",
        bgcolor: "#fff",
        "&:hover": {
          transform: "scale(1.08)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        },
      }}
    >
      <Box
        component="img"
        src={cat.image}
        alt={cat.name}
        sx={{
          width: "100%",
          height: 110,
          objectFit: "cover",
        }}
      />

      <Typography
        sx={{
          py: 2,
          fontWeight: "bold",
          fontSize: "1.15rem",
          color:
            selectedCategory === cat.name
              ? "#d32f2f"
              : "#333",
        }}
      >
        {cat.name}
      </Typography>
    </Box>
  ))}


</Box>

{/* טקסט איזה קטגורייה אנחנו  */}
<Box
  sx={{
    textAlign: "center",
    my: 2
  }}
>
  <Typography
    variant="h5"
    fontWeight="bold"
    sx={{
      color: "#111",
      transition: "0.3s"
    }}
  >
    {selectedCategory}
  </Typography>

  <Typography
    variant="body2"
    sx={{
      color: "gray"
    }}
  >
    מציג מוצרים מקטגוריית {selectedCategory}
  </Typography>
</Box>


    {/* כפתור סל הקניות */}
 <IconButton
        onClick={() => setOpenCart(true)}
       sx={{ position: "fixed", left: 20, bottom: 20,  zIndex: 999,  bgcolor: "white",  boxShadow: 4,
         borderRadius: "50%",  width: 60,height: 60, display: "flex",justifyContent: "center",alignItems: "center",
         "&:hover": {
           bgcolor: "#f5f5f5"
         }
       }}  >
        <Badge
          badgeContent={totalItems}
          color="error" >
         <ShoppingCartIcon fontSize="large" />
        </Badge>

    </IconButton>

{/* כרטיסי מוצרים - עיצוב יוקרתי */}

  <Box 
   ref={productsSectionRef}
  sx={{
    width: "100%",
    scrollMarginTop: "100px",
    maxWidth: 1200,
    mx: "auto",
    px: { xs: 1, sm: 3 },
    py: 5,
    boxSizing: "border-box",
  }}
>
  <Grid
    container
    spacing={4}
    justifyContent="center"
    sx={{ width: "100%" }}
  >
    {filteredDishes.map((dish) => (
      <Grid
        key={dish.id}
        size={{
          xs: 12,
          sm: 6,
          md: 3,
        }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
        }}
      >
        <Card
          sx={{
            width: {
              xs: "90%",
              sm: "100%",
            },
            maxWidth: 320,
            height: "100%",
            borderRadius: "22px",
            overflow: "hidden",
            bgcolor: "#FFFFFF",
            border: "1px solid #EAE3D7",
            boxShadow: "0 8px 28px rgba(38,55,43,0.07)",
            transition: "all 0.3s ease",
            display: "flex",
            flexDirection: "column",

            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 16px 36px rgba(38,55,43,0.14)",
              borderColor: "#C6B184",
            },
          }}
        >
          {/* תמונת המוצר */}
          <Box
            sx={{
              position: "relative",
              overflow: "hidden",
              bgcolor: "#F3EFE7",
            }}
          >
            <CardMedia
              component="img"
              image={dish.image}
              alt={dish.name}
              sx={{
                height: 230,
                objectFit: "cover",
                transition: "transform 0.5s ease",
                "&:hover": {
                  transform: "scale(1.045)",
                },
              }}
            />

            {/* תג מחיר על התמונה */}
            <Box
              sx={{
                position: "absolute",
                top: 14,
                right: 14,
                px: 1.7,
                py: 0.8,
                borderRadius: "10px",
                bgcolor: "rgba(255,255,255,0.94)",
                border: "1px solid rgba(198,177,132,0.65)",
                color: "#294737",
                fontWeight: 700,
                fontSize: "0.82rem",
                boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
              }}
            >
              {dish.price == null
                ? "מחיר בתיאום"
                : `₪ ${calculateCustomerPrice(dish.price).toFixed(2)}`}
            </Box>
          </Box>

          {/* פרטי המוצר */}
          <CardContent
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              p: 2.2,
              "&:last-child": {
                pb: 2.2,
              },
            }}
          >
            {/* שם המוצר והמחיר */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                mb: 1.5,
              }}
            >
              
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: "#263F33",
                    lineHeight: 1.4,
                    overflowWrap: "anywhere",
                  }}
                >
                  {dish.name}
                </Typography>

              
              </Box>

              <Box
                sx={{
                  flexShrink: 0,
                  textAlign: "left",
                  pl: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#9B7940",
                    whiteSpace: "nowrap",
                  }}>
                
                  {dish.price == null
                    ? "בתיאום"
                    : `₪ ${calculateCustomerPrice(dish.price).toFixed(2)}`}
                </Typography>
                 <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: 16,
                    color: "#888477",
                  }}
                >
                  מחיר {dish.unit}
                </Typography>
              </Box>
            </Box>

            <Divider
              sx={{
                mb: 2,
                borderColor: "#EAE3D7",
              }} />
            {/* בחירת כמות */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              gap={2}
              mb={2.5}
            >
              <IconButton
                onClick={() => decrease(dish.id)}
                aria-label="הפחתת כמות"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#F5F1E8",
                  color: "#294737",
                  border: "1px solid #E5DDCE",
                  "&:hover": {
                    bgcolor: "#EAE2D3",
                  },
                }}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography
                sx={{
                  fontSize: 21,
                  fontWeight: 800,
                  color: "#263F33",
                  width: 36,
                  textAlign: "center",
                }}
              >
                {quantities[dish.id] || 1}
              </Typography>

              <IconButton
                onClick={() => increase(dish.id)}
                aria-label="הגדלת כמות"
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#E7EEE7",
                  color: "#294737",
                  border: "1px solid #D5E1D5",
                  "&:hover": {
                    bgcolor: "#D6E4D6",
                  },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            {/* הוספה לסל */}
            <Button
              fullWidth
              onClick={(e) => addToCart(dish, e)}
             startIcon={
                <ShoppingBagOutlinedIcon  sx={{ ml: 0.5 }}  />}

              sx={{
                mt: "auto",

                height: 49,
                borderRadius: "13px",
                fontWeight: 800,
                fontSize: 15,
                color: "#FFFFFF",
                background:
                  "linear-gradient(135deg, #294737, #1D3529)",
                boxShadow: "0 8px 12px rgba(41,71,55,0.16)",
                transition: "all 0.25s ease",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #355C45, #294737)",
                  boxShadow: "0 7px 17px rgba(41,71,55,0.25)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              הוסף לסל
            </Button>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>





      {animateImage && (
        <motion.img
          src={animateImage.image}
          alt=""
          style={{
            position: "fixed",
            top: animateImage.top,
            left: animateImage.left,
            width: animateImage.width,
            height: animateImage.height,
            zIndex: 9999,
            pointerEvents: "none",
            borderRadius: 12
          }}
          initial={{
            opacity: 1
          }}
          animate={{
            top: 40,
            left: 25,
            width: 45,
            height: 45,
            opacity: 0
          }}
          transition={{
            duration: 0.7,
            ease: "easeInOut"
          }}
          onAnimationComplete={() => setAnimateImage(null)}
        />
      )}



{/* סל הקניות  */}
   <Drawer
  anchor="left"
  open={openCart}
  onClose={() => setOpenCart(false)}
 PaperProps={{
  sx: {
    width: {
      xs: "88%", // בטלפון משאיר חלק מהמסך גלוי
      sm: 380,
      md: 420,
    },
    maxWidth: "420px",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
    bgcolor: "#fafafa",
    overflow: "hidden",
    boxShadow: "0 10px 40px rgba(0,0,0,.18)",
    borderTopRightRadius: {
      xs: 20,
      sm: 24,
    },
    borderBottomRightRadius: {
      xs: 20,
      sm: 24,
    },
  },
}}
>

  {/* כותרת */}
  <Box
    sx={{
      p: 3,
      bgcolor: "#fff",
      borderBottom: "1px solid #eee",
      flexShrink: 0,
    }}
  >
    <Typography
      variant="h5"
      fontWeight="bold"
      textAlign="center"
    >
      🛒 סל הקניות
    </Typography>
  </Box>

  {cart.length === 0 ? (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography color="text.secondary">
        הסל שלך ריק
      </Typography>
    </Box>
  ) : (
    <>
      {/* רשימת המוצרים */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2,
          py: 2,

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#c7c7c7",
            borderRadius: "20px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#9e9e9e",
          },
        }}
      >
        {cart.map((item) => (
          <Card
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              p: 1.5,
              borderRadius: 4,
              boxShadow: "0 5px 15px rgba(0,0,0,.08)",
            }}
          >
            <CardMedia
              component="img"
              image={item.image}
              sx={{
                width: 80,
                height: 80,
                borderRadius: 3,
                objectFit: "cover",
              }}
            />

            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography fontWeight="bold">
                {item.name}
              </Typography>

              <Typography
                color="success.main"
                fontWeight="bold"
              >
               ₪ {item.price == null ? "בתיאום" : item.price.toFixed(2)} / {item.unit}
              </Typography>

              <Box
                display="flex"
                alignItems="center"
                mt={1}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((p) =>
                        p.id === item.id
                          ? {
                              ...p,
                              quantity: Math.max(
                                1,
                                p.quantity - 1
                              ),
                            }
                          : p
                      )
                    )
                  }
                >
                  <RemoveIcon />
                </IconButton>

                <Typography
                  sx={{
                    width: 30,
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {item.quantity}
                </Typography>

                <IconButton
                  size="small"
                  onClick={() =>
                    setCart((prev) =>
                      prev.map((p) =>
                        p.id === item.id
                          ? {
                              ...p,
                              quantity: p.quantity + 1,
                            }
                          : p
                      )
                    )
                  }
                >
                  <AddIcon />
                </IconButton>

                <IconButton
                  color="error"
                  sx={{ ml: "auto" }}
                  onClick={() => removeItem(item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>

              <Typography
                mt={1}
                fontWeight="bold"
              >
               ₪ {item.price == null
  ? "בתיאום"
  : (item.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* תחתית קבועה */}
      <Box
        sx={{
          p: 3,
          bgcolor: "#fff",
          borderTop: "1px solid #eee",
          flexShrink: 0,
        }}
      >
        <Typography
          textAlign="center"
          fontWeight="bold"
        >
          סה״כ לתשלום
        </Typography>

        <Typography
          textAlign="center"
          variant="h4"
          color="success.main"
          fontWeight="bold"
          mt={1}
        >
          ₪ {totalPrice.toFixed(2)}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          color="success"
          sx={{
            mt: 3,
            height: 54,
            borderRadius: 4,
            fontWeight: "bold",
            fontSize: 16,
          }}
        onClick={() =>
         navigate("/checkout", {
         state: { cart },
       })
         }
        >
          מעבר לסל הקניות
        </Button>
      </Box>
    </>
  )}
</Drawer>




{/* בחירת קטגוריות בתחתית העמוד */}
<Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", mt: { xs: 4, md: 6 }, mb: { xs: 5, md: 7 }, px: { xs: 1, md: 3 }, boxSizing: "border-box" }}>
  <Typography sx={{ textAlign: "center", fontSize: { xs: 13, md: 16 }, fontWeight: 600, color: "#555", mb: 1.5 }}>
    המשך לבחור מוצרים לפי קטגוריה
  </Typography>

  <Box sx={{ width: "100%", display: "flex", justifyContent: "center", overflow: "hidden" }}>
    <Box sx={{ display: "flex", flexWrap: "nowrap", justifyContent: { xs: "flex-start", md: "center" }, alignItems: "center", gap: { xs: 0.7, md: 1.5 }, width: "fit-content", maxWidth: "100%", overflowX: "auto", direction: "rtl", py: 1, mx: "auto", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
      {categories.map((cat) => (
        <Box key={cat.name} onClick={() => {
          setSelectedCategory(cat.name);
          if (window.innerWidth < 900) setTimeout(() => productsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
        }} sx={{ flex: "0 0 auto", cursor: "pointer", whiteSpace: "nowrap", px: { xs: 1.2, md: 2 }, py: { xs: 0.7, md: 1 }, borderRadius: 10, border: "1px solid", borderColor: selectedCategory === cat.name ? "#d32f2f" : "#e0e0e0", bgcolor: selectedCategory === cat.name ? "#d32f2f" : "#fff", color: selectedCategory === cat.name ? "#fff" : "#444", fontSize: { xs: 11, md: 14 }, fontWeight: selectedCategory === cat.name ? 700 : 500, boxShadow: selectedCategory === cat.name ? "0 3px 8px rgba(211,47,47,0.2)" : "none", transition: "0.2s", "&:hover": { borderColor: "#d32f2f" } }}>
          {cat.name}
        </Box>
      ))}
    </Box>
  </Box>
</Box>



  <Footer />
    </Box>
  );
}