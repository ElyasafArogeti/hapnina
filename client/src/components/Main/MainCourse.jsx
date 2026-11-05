import React, { useState, useEffect, useRef } from "react";

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
  Divider,
  Dialog,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Footer from "./Footer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import NavbarHome from "./NavbarHome";
import TextMove from "./textMove";
import defaultDishImage from "../../assets/imgs/imgdifolt.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HomeIcon from "@mui/icons-material/Home";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckIcon from "@mui/icons-material/Check";
import LinearProgress from "@mui/material/LinearProgress";

// ---- ייבואים חדשים ----
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import StarIcon from "@mui/icons-material/Star";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";

//   דף סל הקניות



// חישוב מחיר ללקוח כולל 70% רווח ומע"מ 18%
// עיגול תמיד כלפי מעלה לשקל שלם
const calculateCustomerPrice = (price) => {
  if (price == null) return null;
  return Math.ceil(price * 1.7 * 1.18);
};




// תפריט קייטרינג הפנינה
const dishes = [
  // =========================
  // דגים
  // =========================
  { id: 1, name: "פילה מושט מזרחי מרוקאי ", price: 14, unit: "למנה", category: "דגים", details: "מטוגן או מבושל", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902183/%D7%A4%D7%99%D7%9C%D7%94_%D7%9E%D7%95%D7%A9%D7%98_%D7%9E%D7%96%D7%A8%D7%97%D7%99_%D7%9E%D7%A8%D7%95%D7%A7%D7%90%D7%99_wsebic.jpg" },
    { id: 86, name: "פילה מושט ברוטב לימון ושקדים", price: 14, unit: "למנה", category: "דגים", details: "כל הטעמים", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902182/%D7%A4%D7%99%D7%9C%D7%94_%D7%9E%D7%95%D7%A9%D7%98_%D7%91%D7%A8%D7%95%D7%98%D7%91_%D7%9C%D7%99%D7%9E%D7%95%D7%9F_%D7%95%D7%A9%D7%A7%D7%93%D7%99%D7%9D_ulik71.webp" },
  { id: 2, name: "פילה סלמון ברוטב פסטו", price: 17, unit: "למנה", category: "דגים", details: "כל הטעמים", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902184/%D7%A4%D7%99%D7%9C%D7%94_%D7%A1%D7%9C%D7%9E%D7%95%D7%9F_%D7%91%D7%A8%D7%95%D7%98%D7%91_%D7%A4%D7%A1%D7%98%D7%95_daz0zj.jpg" },
  { id: 87, name: "פילה סלמון ברוטב אדם", price: 17, unit: "למנה", category: "דגים", details: "כל הטעמים", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902184/%D7%A4%D7%99%D7%9C%D7%94_%D7%A1%D7%9C%D7%9E%D7%95%D7%9F_%D7%91%D7%A8%D7%95%D7%98%D7%91_%D7%90%D7%93%D7%9D_qujkul.webp" },
  // { id: 3, name: "פילה לברק", price: null, unit: "", category: "דגים", details: "", image: "" },
  { id: 4, name: "קציצות דגים", price: 55, unit: "לק״ג", category: "דגים", details: "כ-50 גרם לקציצה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902187/%D7%A7%D7%A6%D7%99%D7%A6%D7%95%D7%AA_%D7%93%D7%92%D7%99%D7%9D_zhzhil.webp" },
  

  // =========================
  // בשרים
  // =========================
  { id: 5, name: "מעורב ירושלמי + פירה ", price: 105, unit: "קילו מכל אחד", category: "בשרים", details: "קילו מעורב וקילו פירה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757938928/manager_images/first_courses/%D7%9E%D7%A2%D7%95%D7%A8%D7%91%20%D7%99%D7%A8%D7%95%D7%A9%D7%9C%D7%9E%D7%99.jpg" },
  { id: 6, name: "כבדים מוקפצים + פירה", price: 90, unit: "קילו מכל אחד", category: "בשרים", details: "קילו מעורב וקילו פירה", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902391/%D7%9B%D7%91%D7%93%D7%99%D7%9D_%D7%9E%D7%95%D7%A7%D7%A4%D7%A6%D7%99%D7%9D_%D7%A4%D7%99%D7%A8%D7%94_bnbttd.jpg" },
  { id: 7, name: "מאפה פילו בשר + רוטב", price: 15, unit: "ליחידה", category: "בשרים", details: "מוגש עם רוטב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026786/manager_images/first_courses/%D7%9E%D7%90%D7%A4%D7%94%20%D7%A4%D7%99%D7%9C%D7%95%20%D7%91%D7%A9%D7%A8%20%D7%A2%D7%9D%20%D7%A8%D7%95%D7%98%D7%91.jpg" },
  { id: 8, name: "טורטיה בשר", price: 15, unit: "ליחידה", category: "בשרים", details: "מוגשת עם רוטב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411435/IMG-20250713-WA0115_jsponj.jpg" },
  { id: 9, name: "ארטישוק ממולא בשר", price: 15, unit: "ליחידה", category: "בשרים", details: "", image: "" },
  // { id: 10, name: "מאפה קדאיף בשר", price: null, unit: "", category: "בשרים", details: "", image: "" },
  // { id: 11, name: "קוראסון אסאדו", price: null, unit: "", category: "בשרים", details: "", image: "" },
  // { id: 12, name: "קרפצ'יו בקר", price: null, unit: "", category: "בשרים", details: "", image: "" },
  { id: 13, name: "צלי בקר מספר 5", price: 26, unit: "ליחידה", category: "בשרים", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902396/%D7%A6%D7%9C%D7%99_%D7%91%D7%A7%D7%A8_%D7%9E%D7%A1%D7%A4%D7%A8_5_izat3c.webp" },
  { id: 14, name: "צלי בקר מספר 6", price: 20, unit: "ליחידה", category: "בשרים", details: "מינימום 120 גרם", image: "" },
  { id: 15, name: "פרוסות אסאדו בסגנון השף", price: 22, unit: "ליחידה", category: "בשרים", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902395/%D7%A4%D7%A8%D7%95%D7%A1%D7%95%D7%AA_%D7%90%D7%A1%D7%90%D7%93%D7%95_%D7%91%D7%A1%D7%92%D7%A0%D7%95%D7%9F_%D7%94%D7%A9%D7%A3_gbcgo1.jpg" },
  { id: 16, name: "גוש אסאדו ", price: 180, unit: "גוש=ק״ג ", category: "בשרים", details: "", image: "" },
  // { id: 17, name: "אסאדו מפורק לקוראסון", price: null, unit: "", category: "בשרים", details: "", image: "" },
  { id: 18, name: "שיפודי קבב מזרחי 2 שיפודים", price: 14, unit: "לשני שיפודים", category: "בשרים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902397/%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99_%D7%A7%D7%91%D7%91_%D7%9E%D7%96%D7%A8%D7%97%D7%99_2_%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99%D7%9D_wzwj5p.webp" },
  { id: 19, name: "קבבונים", price: 80, unit: "לק״ג", category: "בשרים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1738157676/manager_images/main_courses/%D7%A9%D7%99%D7%A4%D7%95%D7%93%D7%99%20%D7%A7%D7%91%D7%91%20%D7%9E%D7%96%D7%A8%D7%97%D7%99.jpg" },
  // { id: 20, name: "בשר לחמין", price: 80, unit: "לק״ג", category: "בשרים", details: "", image: "" },
  { id: 21, name: "קציצות בשר ברוטב", price: 80, unit: "לק״ג", category: "בשרים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793904348/%D7%A7%D7%A6%D7%99%D7%A6%D7%95%D7%AA_%D7%91%D7%A9%D7%A8_%D7%91%D7%A8%D7%95%D7%98%D7%91_vigvhr.webp" },
  // { id: 23, name: "בשר ראש", price: null, unit: "", category: "בשרים", details: "", image: "" },
  // { id: 54, name: "קרפצ'יו סלק", price: null, unit: "לק״ג", category: "בשרים", details: "", image: "" },
  { id: 39, name: "מוסקה בשרית", price: 19, unit: "ליחידה", category: "בשרים", details: "", image: "" },
  { id: 88, name: "טורטיה בשר + רוטב ", price: 15, unit: "ליחידה", category: "בשרים", details: "מוגשת עם רוטב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902391/%D7%98%D7%95%D7%A8%D7%98%D7%99%D7%94_%D7%91%D7%A9%D7%A8_%D7%A8%D7%95%D7%98%D7%91_ih3dk2.webp" },
  { id: 95, name: "קציצות בשר קבב", price: 80, unit: "לק״ג", category: "בשרים", details: "", image: "" },

  // =========================
  // עופות
  // =========================
  { id: 22,name: "מוקפץ תאילנדי + פירה", price: 80, unit: "לק״ג", category: "עופות", details: "קילו מוקפץ וקילו פירה", image: "" },
   { id: 23, name: "שניצל עוף", price: 14, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903175/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C_%D7%A2%D7%95%D7%A3_ephcyd.webp" },
  { id: 24, name: "פרגית עוף ממולא", price: 22, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "" },
  { id: 25, name: "פרגית על האש", price: 17, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1755026551/manager_images/main_courses/%D7%A1%D7%98%D7%99%D7%99%D7%A7%20%D7%A4%D7%A8%D7%92%D7%99%D7%AA.jpg" },
  // { id: 26, name: "פסטיה פרגית", price: null, unit: "", category: "עופות", details: "", image: "" },
  { id: 27, name: "עוף בתנור בשזיפים", price: 20, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "" },
  { id: 28, name: "עוף בגריל", price: 20, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903170/%D7%A2%D7%95%D7%A3_%D7%91%D7%92%D7%A8%D7%99%D7%9C_cn0dyh.jpg" },
  { id: 29, name: "חזה עוף ממולא", price: 16, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "" },
  { id: 30, name: "סטייק חזה עוף על האש", price: 13, unit: "ליחידה", category: "עופות", details: "מינימום 120 גרם", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903169/%D7%A1%D7%98%D7%99%D7%99%D7%A7_%D7%97%D7%96%D7%94_%D7%A2%D7%95%D7%A3_%D7%A2%D7%9C_%D7%94%D7%90%D7%A9_bix2mk.webp" },
  { id: 31, name: "טורטיה צמחונית", price: 15, unit: "ליחידה", category: "עופות", details: "מוגשת עם רוטב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903347/%D7%98%D7%95%D7%A8%D7%98%D7%99%D7%94_%D7%A6%D7%9E%D7%97%D7%95%D7%A0%D7%99%D7%AA_miaxb1.webp" },
  { id: 32, name: "שיפודי עוף וירקות", price: 14, unit: "לשני שיפודים", category: "עופות", details: "", image: "" },
  { id: 33, name: "שניצלונים", price: 80, unit: "לק״ג", category: "עופות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903178/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C%D7%95%D7%A0%D7%99%D7%9D_ln3ggv.jpg" },
  { id: 34, name: "מוקפץ סיני עם רצועות עוף", price: 80, unit: "לק״ג", category: "עופות", details: "", image: "" },
  // { id: 35, name: "שווארמה מוקפצת עם בצל", price: 80, unit: "לק״ג", category: "עופות", details: "", image: "" },
  { id: 36, name: "קציצות עוף ברוטב", price: 45, unit: "לק״ג", category: "עופות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793903172/%D7%A7%D7%A6%D7%99%D7%A6%D7%95%D7%AA_%D7%A2%D7%95%D7%A3_%D7%91%D7%A8%D7%95%D7%98%D7%91_biky67.webp" },
 

  // =========================
  // תוספות
  // =========================
  { id: 40, name: "אורז עם שקדים וצימוקים", price: 16, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902793/%D7%90%D7%95%D7%A8%D7%96_%D7%A2%D7%9D_%D7%A9%D7%A7%D7%93%D7%99%D7%9D_%D7%95%D7%A6%D7%99%D7%9E%D7%95%D7%A7%D7%99%D7%9D_ivmmhz.webp" },
  { id: 41, name: "אורז צהוב", price: 16, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940128/manager_images/side_dishes/%D7%90%D7%95%D7%A8%D7%96%20%D7%A6%D7%94%D7%95%D7%91.jpg" },
  { id: 42, name: "אורז אשפלו עם ירקות", price: 16, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902791/%D7%90%D7%95%D7%A8%D7%96_%D7%90%D7%A9%D7%A4%D7%9C%D7%95_%D7%A2%D7%9D_%D7%99%D7%A8%D7%A7%D7%95%D7%AA_e5bfmv.webp" },
  { id: 43, name: "אפונה, ארטישוק וסלרי", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "" },
  { id: 44, name: "שעועית ארוכה מוקפצת", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902838/%D7%A9%D7%A2%D7%95%D7%A2%D7%99%D7%AA_%D7%90%D7%A8%D7%95%D7%9B%D7%94_%D7%9E%D7%95%D7%A7%D7%A4%D7%A6%D7%AA_o4j52p.webp" },
  { id: 45, name: "שעועית ארוכה ברוטב עגבניות", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757941450/manager_images/side_dishes/%D7%A9%D7%A2%D7%95%D7%A2%D7%99%D7%AA%20%D7%90%D7%A8%D7%95%D7%9B%D7%94%20%D7%91%D7%A8%D7%95%D7%98%D7%91%20%D7%A2%D7%92%D7%91%D7%A0%D7%99%D7%95%D7%AA.jpg" },
  { id: 46, name: "ירקות מאודים בתנור", price: 22, unit: "לק״ג", category: "תוספות", details: "", image: "" },
  { id: 47, name: "ירקות סיני מוקפץ", price: 22, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902835/%D7%99%D7%A8%D7%A7%D7%95%D7%AA_%D7%A1%D7%99%D7%A0%D7%99_%D7%9E%D7%95%D7%A7%D7%A4%D7%A5_gtmmhf.webp" },
  { id: 48, name: "ארטישוק ופטריות שלמות", price: 30, unit: "לק״ג", category: "תוספות", details: "", image: "" },
  { id: 50, name: "פירה לבד ", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "" },
  { id: 51, name: "קוסקוס + מרק ירקות", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902837/%D7%A7%D7%95%D7%A1%D7%A7%D7%95%D7%A1_%D7%9E%D7%A8%D7%A7_%D7%99%D7%A8%D7%A7%D7%95%D7%AA_ylyqxd.webp" },
  { id: 89, name: "תפו'א פרוס אנה", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "" },
  { id: 90, name: "תפו'א סירות", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902840/%D7%AA%D7%A4%D7%95_%D7%90_%D7%A1%D7%99%D7%A8%D7%95%D7%AA_cqyuuo.webp" },
  { id: 91, name: "דואט תפו'א ובטטה", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757939647/manager_images/side_dishes/%D7%93%D7%95%D7%90%D7%98%20%D7%AA%D7%A4%D7%95%27%D7%90%20%D7%95%D7%91%D7%98%D7%98%D7%94.jpg" },
  { id: 92, name: "תפו'א פריזיאן שלם", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411438/IMG-20250713-WA0110_qsz1ry.jpg" },
  { id: 93, name: "בטטה בשמן זית ורוזמרין", price: 20, unit: "לק״ג", category: "תוספות", details: "", image: "" },

  // =========================
  // סלטים
  // =========================
  { id: 55, name: "גזר מרוקאי חי", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0123_oqu4hr.jpg" },
   { id: 56, name: "גזר מרוקאי מבושל", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793904540/IMG-20250713-WA0134_eoik7q.jpg" },
  { id: 57, name: "טחינה מתובלת", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%98%D7%97%D7%99%D7%A0%D7%94_%D7%9E%D7%AA%D7%95%D7%91%D7%9C%D7%AA_vahf3p.webp" },
  { id: 58, name: "חמוצי הבית", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100669/manager_images/salads/%D7%97%D7%9E%D7%95%D7%A6%D7%99%20%D7%94%D7%91%D7%99%D7%AA.jpg" },
  { id: 59, name: "מבחר חמוצים", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 60, name: "ירקות חי טרי ועשיר", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 61, name: "חציל בטחינה", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902654/%D7%97%D7%A6%D7%99%D7%9C_%D7%91%D7%98%D7%97%D7%99%D7%A0%D7%94_ggwvvv.jpg" },
  { id: 62, name: "חציל יווני", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902655/%D7%97%D7%A6%D7%99%D7%9C_%D7%99%D7%95%D7%95%D7%A0%D7%99_pwnd2e.jpg" },
  { id: 63, name: "חציל טבעי על האש", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 64, name: "חציל במיונז", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 65, name: "קוביות חציל פיקנטי", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411745/IMG-20250713-WA0129_vrhw3n.jpg" },
  { id: 66, name: "כרוב ושמיר", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1757940314/manager_images/salads/%D7%9B%D7%A8%D7%95%D7%91%20%D7%95%D7%A9%D7%9E%D7%99%D7%A8.jpg" },
  { id: 67, name: "כרוב וגזר במיונז", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%95%D7%92%D7%96%D7%A8_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_r8xpo4.jpg" },
  { id: 68, name: "כרוב וגזר מתובל", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902672/%D7%9B%D7%A8%D7%95%D7%91_%D7%95%D7%92%D7%96%D7%A8_%D7%9E%D7%AA%D7%95%D7%91%D7%9C_etds51.webp" },
  { id: 69, name: "כרוב אדום במיונז", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9B%D7%A8%D7%95%D7%91_%D7%90%D7%93%D7%95%D7%9D_%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96_wrftkh.jpg" },
  { id: 70, name: "סלט עגבניות חריף", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_7_bqk4r4.jpg" },
  { id: 71, name: "מטבוחה", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%9E%D7%98%D7%91%D7%95%D7%97%D7%94_ziwlal.jpg" },
  { id: 72, name: "סלט מלפפון בשמיר", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 73, name: "שרי בבזיליקום", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 74, name: "פלפל מתוק בצבעים", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411434/IMG-20250713-WA0141_edsu2v.jpg" },
  { id: 75, name: "סלט טבולה", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902673/%D7%A1%D7%9C%D7%98_%D7%98%D7%91%D7%95%D7%9C%D7%94_rpqelv.jpg" },
  { id: 76, name: "שורש סלרי", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 77, name: "תירס מקסיקני", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100721/manager_images/salads/%D7%AA%D7%99%D7%A8%D7%A1%20%D7%9E%D7%A7%D7%A1%D7%99%D7%A7%D7%A0%D7%99.jpg" },
  { id: 78, name: "תפוחי אדמה במיונז", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1753100613/manager_images/salads/%D7%AA%D7%A4%D7%95%27%D7%90%20%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96.jpg" },
  { id: 79, name: "קוביות סלק", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887467/%D7%A7%D7%95%D7%91%D7%99%D7%95%D7%AA_%D7%A1%D7%9C%D7%A7_bkcjei.webp" },
  { id: 80, name: "סלט בטטה", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887466/%D7%A1%D7%9C%D7%98_%D7%91%D7%98%D7%98%D7%94_t9vgji.webp" },
  { id: 81, name: "סלט ירוק", price: 29, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791891249/WhatsApp_Image_2026-10-13_at_10.08.02_sspqpy.jpg" },
  { id: 82, name: "חומוס ישראלי", price: 23, unit: "לק״ג ", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791887822/%D7%97%D7%95%D7%9E%D7%95%D7%A1_%D7%99%D7%A9%D7%A8%D7%90%D7%9C%D7%99_boq1zc.jpg" },
  { id: 83, name: "חסה, שרי ונבטים ברוטב", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  // { id: 84, name: "קינואה", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "" },
  { id: 85, name: "פלפל חריף", price: 23, unit: "לק״ג", category: "סלטים", details: "", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752411746/IMG-20250713-WA0108_noob7d.jpg" },
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
];



// ============================================================
// MainCourse - חוויית הזמנה בשלבים (קטגוריה אחרי קטגוריה)
// סדר השלבים נקבע לפי הסדר של המערך `categories` למעלה.
// ============================================================

const MIN_ORDER = 1500;

const NAVBAR_HEIGHT = 50; // הנבר הקבוע (height: "90px" ב-NavbarHome)

// תשלומים: כרגע עד 5 תשלומים בכל סכום (לשינוי בעתיד - רק כאן)
const MAX_INSTALLMENTS = 5;

// מספר הלקוחות להצגה בסל  <-- עדכן למספר האמיתי שלכם
const CUSTOMERS_COUNT = 500;

// ניפוי לפי קטגוריה למטבח - מחוץ לקומפוננטה כדי שלא ייווצר מחדש בכל רינדור
const SALAD_ITEMS = [
  "גזר מרוקאי חי", "גזר מרוקאי מבושל", "טחינה מתובלת", "חמוצי הבית", "מבחר חמוצים",
  "ירקות חי טרי ועשיר", "חציל בטחינה", "חציל יווני", "חציל טבעי על האש", "חציל במיונז",
  "קוביות חציל פיקנטי", "כרוב ושמיר", "כרוב וגזר במיונז", "כרוב וגזר מתובל",
  "כרוב אדום במיונז", "סלט עגבניות חריף", "מטבוחה", "סלט מלפפון בשמיר", "שרי בבזיליקום",
  "פלפל מתוק בצבעים", "סלט טבולה", "שורש סלרי", "תירס מקסיקני", "תפוא במיונז",
  "תפוח אדמה במיונז", "קוביות סלק", "סלט בטטה", "סלט ירוק", "חומוס ישראלי",
  "חסה, שרי ונבטים ברוטב", "קינואה", "פלפל חריף",
];

const FIRST_COURSE_ITEMS = [
  "דג מושט", "סלמון", "מוקפץ תאילנדי", "מעורב ירושלמי", "כבדים מוקפצים", "מאפה פילו בשר",
  "טורטיה בשר", "טורטיה צמחונית", "ארטישוק ממולא בשר", "מאפה קדאיף בשר", "פסטיה פרגית",
  "קוראסון אסדו", "קוראסון אסאדו", "קרפציו בקר", "קרפציו סלק", "קציצות דגים", "מוסקה",
];

const SIDE_DISH_ITEMS = [
  "אורז", "אפונה ארטישוק וסלרי", "שעועית ארוכה", "ירקות מאודים", "ירקות סיני מוקפץ",
  "זיתים מרוקאים", "ארטישוק ופטריות", "תפוח אדמה", "תפוא", "תפו\"א", "בטטה", "קוסקוס",
  "קטניות לחמין", "קיטניות לחמין", "ביצים עם קליפה", "פירה", "פתיתים",
];

const MAIN_COURSE_ITEMS = [
  "עוף ברוטב שזיפים", "עוף בגריל", "עוף ברגריל", "פרגית ממולאת", "פרגית על האש",
  "חזה עוף ממולא", "חזה עוף על האש", "שניצל", "צלי בשר", "אסאדו", "אסאדו גוש",
  "שיפודי עוף", "שיפודי קבב", "קבבונים", "שניצלונים", "מוקפץ סיני", "בשר לחמין",
  "שווארמה מוקפצת", "קציצות בשר", "קציצות עוף", "בשר ראש",
];

const getKitchenCategory = (item) => {
  const name = (item.name || "").trim();
  const category = (item.category || "").trim();

  // 1. סלטים
  if (
    category === "סלטים" ||
    SALAD_ITEMS.some((n) => name.includes(n)) ||
    name.includes("סלט")
  ) {
    return "salads";
  }

  // 2. מנות ראשונות
  if (
    FIRST_COURSE_ITEMS.some((n) => name.includes(n)) ||
    name.includes("בורקס") ||
    name.includes("סיגר") ||
    name.includes("פסטל")
  ) {
    return "first_courses";
  }

  // 3. תוספות
  if (category === "תוספות" || SIDE_DISH_ITEMS.some((n) => name.includes(n))) {
    return "side_dishes";
  }

  // 4. מנות עיקריות
  if (
    MAIN_COURSE_ITEMS.some((n) => name.includes(n)) ||
    ["בשרים", "עופות", "דגים"].includes(category)
  ) {
    return "main_courses";
  }

  // 5. מוצר שלא זוהה
  return "uncategorized";
};

export default function MainCourse() {
  const navigate = useNavigate();

  // ---------- מצב ----------
  const [stepIndex, setStepIndex] = useState(0); // השלב הנוכחי = אינדקס בתוך categories
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [quantities, setQuantities] = useState({});
  const [openCart, setOpenCart] = useState(false);
  const [animateImage, setAnimateImage] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [stepsDialogOpen, setStepsDialogOpen] = useState(false); // מודול כל השלבים (טלפון)
  const [zoomImage, setZoomImage] = useState(null); // זום על תמונה מהסל: { src, name }

  // ---- נעיצת סרגל השלבים מתחת לנבר ----
  const stepsBarRef = useRef(null);
  const [stickyTop, setStickyTop] = useState(0); // גובה הנבר הקבוע (אם יש)
  const [stepsBarHeight, setStepsBarHeight] = useState(0);

  const introSectionRef = useRef(null); // תחילת העמוד של השלב (כולל "עכשיו הולכים על...")
  const activeStepRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // מדידה אוטומטית: אם הנבר קבוע/דביק בראש המסך, סרגל השלבים נעוץ ממש מתחתיו
  useEffect(() => {
    const measure = () => {
      let top = 0;
      document.querySelectorAll("header, nav, .MuiAppBar-root").forEach((el) => {
        if (stepsBarRef.current && stepsBarRef.current.contains(el)) return;
        const pos = window.getComputedStyle(el).position;
        if (pos === "fixed" || pos === "sticky") {
          const r = el.getBoundingClientRect();
          if (r.top <= 1 && r.height > 0) top = Math.max(top, r.bottom);
        }
      });
      setStickyTop(Math.round(top));
      if (stepsBarRef.current) setStepsBarHeight(stepsBarRef.current.offsetHeight);
    };

    measure();
    const t = setTimeout(measure, 400);
    window.addEventListener("resize", measure);

    let ro;
    if (typeof ResizeObserver !== "undefined" && stepsBarRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(stepsBarRef.current);
    }

    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
      if (ro) ro.disconnect();
    };
  }, []);

  // ---------- שלבים ----------
  const totalSteps = categories.length;
  const currentCategory = categories[stepIndex];
  const nextCategory = categories[stepIndex + 1];
  const prevCategory = categories[stepIndex - 1];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;
  const selectedCategory = currentCategory?.name;

  // אפשר לקפוץ לכל שלב בכל רגע (קדימה או אחורה)
  const goToStep = (index) => {
    if (index < 0 || index > totalSteps - 1) return;
    setStepIndex(index);
  };

  // בכל מעבר שלב: גלילה לתחילת הפתיח של השלב (כולל הכותרת "עכשיו הולכים על...")
useEffect(() => {
  if (firstRender.current) {
    firstRender.current = false;
    return;
  }
  // בכל מעבר שלב: חזרה לראש העמוד, כך שרואים את כל המלל "עכשיו הולכים על..."
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}, [stepIndex]);

  // ---------- כמויות ----------
  const increase = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));

  const decrease = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, (prev[id] || 1) - 1) }));

  // ---------- ערכת נושא ----------
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          background: {
            default: darkMode ? "#121212" : "#ffffff",
            paper: darkMode ? "#1e1e1e" : "#ffffff",
          },
        },
      }),
    [darkMode]
  );

  // ---------- סל ----------
  const addToCart = (dish, e) => {
    e?.stopPropagation();

    // אנימציית תמונה אל הסל
    const productCard = e?.currentTarget?.closest(".MuiCard-root");
    const productImage = productCard?.querySelector("img");
    const cartButton = document.getElementById("main-course-cart");

    if (productImage && cartButton) {
      const imageRect = productImage.getBoundingClientRect();
      const cartRect = cartButton.getBoundingClientRect();

      setAnimateImage({
        id: `${dish.id}-${Date.now()}`,
        image: productImage.currentSrc || productImage.src,
        top: imageRect.top,
        left: imageRect.left,
        width: imageRect.width,
        height: imageRect.height,
        targetTop: cartRect.top + cartRect.height / 2 - 18,
        targetLeft: cartRect.left + cartRect.width / 2 - 18,
      });
    }

    const finalPrice = calculateCustomerPrice(dish.price);
    const selectedQuantity = quantities[dish.id] || 1;

    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === dish.id);

      if (existingItem) {
        return prev.map((item) =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + selectedQuantity }
            : item
        );
      }

      return [...prev, { ...dish, price: finalPrice, quantity: selectedQuantity }];
    });

    // איפוס הכמות שנבחרה בכרטיס אחרי ההוספה
    setQuantities((prev) => ({ ...prev, [dish.id]: 1 }));
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const totalPrice = cart.reduce(
    (total, item) => total + (item.price == null ? 0 : item.price * item.quantity),
    0
  );
  const totalItems = cart.length;
  const missingForMinimum = Math.max(0, MIN_ORDER - totalPrice);
  const reachedMinimum = missingForMinimum === 0;

  // תשלומים: עד MAX_INSTALLMENTS בכל סכום
  const perPayment = totalPrice / MAX_INSTALLMENTS;

  // כמה מוצרים בסל מהקטגוריה הנוכחית
  const countInCategory = (catName) =>
    cart.filter((item) => item.category === catName).length;

  const filteredDishes = dishes.filter((item) => item.category === selectedCategory);
  const currentCategoryCount = countInCategory(selectedCategory);

  const goToCheckout = () => {
    navigate("/checkout", {
      state: {
        cart, // הסל המקורי נשאר ללא שינוי
        kitchenCart: cart.map((item) => ({
          ...item,
          kitchenCategory: getKitchenCategory(item),
        })),
      },
    });
  };

  // סיום ההזמנה (משמש את הכפתור התחתון והעליון בשלב האחרון)
  const handleFinish = () =>
    cart.length === 0 || !reachedMinimum ? setOpenCart(true) : goToCheckout();

  // ---------- הורדת תמונה למכשיר (מזום התמונה בסל) ----------
  const handleDownloadImage = async () => {
    if (!zoomImage) return;
    try {
      const res = await fetch(zoomImage.src);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const ext = (blob.type.split("/")[1] || "jpg").split("+")[0];
      a.href = url;
      a.download = `${zoomImage.name || "image"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // אם הדפדפן חוסם הורדה ישירה - פותחים את התמונה בלשונית חדשה
      window.open(zoomImage.src, "_blank", "noopener");
    }
  };

  // ---------- סגנונות משותפים ----------
  const topIconButtonSx = {
    width: 30,
    height: 30,
    minWidth: 30,
    color: "#D9BD86",
    bgcolor: "#29251E",
    border: "1px solid #51432D",
    borderRadius: "8px",
    flexShrink: 0,
    "&:hover": {
      bgcolor: "#3A3021",
      color: "#F5DDAA",
      borderColor: "#C9A96E",
    },
  };

  const progressPercent = ((stepIndex + 1) / totalSteps) * 100;

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          width: "100%",
          direction: "rtl",
          bgcolor: "background.default",
          color: "text.primary",
        }}
      >
        <NavbarHome sx={{ padding: 0, margin: 0 }} />
        <br /> <br /> <br /> <br />

        <TextMove />

       {/* ===== סרגל התקדמות עליון: איפה אני ולאן התקדמתי (נעוץ מתחת לנבר) ===== */}
        <Box
          ref={stepsBarRef}
          dir="rtl"
          sx={{
            width: "100%",
            position: "sticky",
            top: `${NAVBAR_HEIGHT}px`, 
            zIndex: 50,
            bgcolor: "#171614",
            borderBottom: "1px solid #51432D",
            boxSizing: "border-box",
          }}
        >
          {/* שורה עליונה: כותרת שלב + בית + מצב תצוגה */}
          <Box
           dir="rtl"
            sx={{
               display: "flex", justifyContent: "space-between", alignItems: "center",
              px: { xs: 1.5, sm: 2, md: 4 }, py: 1, gap: 1,
                bgcolor: "#171614", borderBottom: "1px solid #51432D",
                  }}
                 >
            <Typography
              sx={{
                fontSize: { xs: 12, sm: 13 },
                fontWeight: 700,
                color: "#F5DDAA",
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              בונים את התפריט שלך ביחד
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                {" "}· שלב {stepIndex + 1} מתוך {totalSteps}: {selectedCategory}
              </Box>
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton
                aria-label="חזרה לעמוד הראשי"
                onClick={() => navigate("/")}
                sx={topIconButtonSx}
              >
                <HomeIcon sx={{ fontSize: 17 }} />
              </IconButton>

              <IconButton
                aria-label="שינוי מצב תצוגה"
                onClick={() => setDarkMode((prev) => !prev)}
                sx={topIconButtonSx}
              >
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: 17 }} />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 17 }} />
                )}
              </IconButton>
            </Box>
          </Box>

          {/* ---- טלפון: כפתור אחד שפותח מודול עם כל השלבים ---- */}
          <Box sx={{ display: { xs: "block", sm: "none" }, px: 1.5, py: 0.8 }}>
            <Box
              component="button"
              type="button"
              onClick={() => setStepsDialogOpen(true)}
              aria-label="הצגת כל שלבי ההזמנה"
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                px: 1.5,
                py: 1,
                bgcolor: "#29251E",
                border: "1px solid #51432D",
                borderRadius: "10px",
                color: "#F5DDAA",
                fontFamily: "inherit",
                cursor: "pointer",
                "&:active": { bgcolor: "#3A3021" },
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: "inherit" }}>
                שלב {stepIndex + 1} מתוך {totalSteps}: {selectedCategory}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.3, color: "#D9BD86" }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "inherit" }}>
                  כל השלבים
                </Typography>
                <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
              </Box>
            </Box>
          </Box>

          {/* ---- טאבלט ומחשב: שלבים עם שמות - אפשר ללחוץ על כל שלב בכל רגע ---- */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 1,
              overflowX: "auto",
              px: { sm: 2, md: 4 },
              py: 0.8,
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
              justifyContent: { xs: "flex-start", md: "center" },
            }}
          >
            {categories.map((cat, index) => {
              const active = index === stepIndex;
              const completed = index < stepIndex;

              return (
                <React.Fragment key={cat.name}>
                  <Box
                    ref={active ? activeStepRef : null}
                    role="button"
                    tabIndex={0}
                    aria-label={`מעבר לשלב ${cat.name}`}
                    onClick={() => goToStep(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        goToStep(index);
                      }
                    }}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      flexShrink: 0,
                      cursor: "pointer",
                      "&:hover .step-label": { color: "#fff" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        fontWeight: 800,
                        bgcolor: active ? "#C9A96E" : completed ? "#3A3021" : "transparent",
                        color: active ? "#171614" : completed ? "#D9BD86" : "#8D8980",
                        border: active
                          ? "1px solid #E4CC9D"
                          : completed
                          ? "1px solid #9C7B47"
                          : "1px solid #514735",
                        boxSizing: "border-box",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {completed ? <CheckIcon sx={{ fontSize: 12 }} /> : index + 1}
                    </Box>

                    <Typography
                      className="step-label"
                      sx={{
                        fontSize: 11,
                        fontWeight: active ? 800 : 500,
                        color: active ? "#fff" : "#b8b8b8",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s ease",
                      }}
                    >
                      {cat.name}
                    </Typography>
                  </Box>

                  {index < totalSteps - 1 && (
                    <Box
                      sx={{
                        width: 18,
                        height: "1px",
                        bgcolor: completed ? "#9C7B47" : "#414141",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>

          {/* פס התקדמות */}
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            sx={{
              height: 3,
              bgcolor: "#2a2620",
              "& .MuiLinearProgress-bar": { bgcolor: "#C9A96E" },
              // במצב RTL הפס ימלא מימין לשמאל
              transform: "scaleX(-1)",
            }}
          />
        </Box>

        {/* ===== מודול כל השלבים (טלפון) ===== */}
        <Dialog
          open={stepsDialogOpen}
          onClose={() => setStepsDialogOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            dir: "rtl",
            sx: { borderRadius: 3, m: 2, width: "calc(100% - 32px)" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2.5,
              pt: 2,
              pb: 1,
            }}
          >
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>
              השלבים בהזמנה
            </Typography>
            <IconButton aria-label="סגירה" onClick={() => setStepsDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            {categories.map((cat, index) => {
              const active = index === stepIndex;
              const completed = index < stepIndex;
              const chosen = countInCategory(cat.name);

              return (
                <Box
                  key={cat.name}
                  onClick={() => {
                    goToStep(index);
                    setStepsDialogOpen(false);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.3,
                    mb: 0.8,
                    borderRadius: 2,
                    cursor: "pointer",
                    border: "1px solid",
                    borderColor: active ? "#C9A96E" : darkMode ? "#3a3a3a" : "#eadbc8",
                    bgcolor: active
                      ? darkMode ? "rgba(201,169,110,0.15)" : "#fffaf5"
                      : "transparent",
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 800,
                      flexShrink: 0,
                      bgcolor: active ? "#C9A96E" : completed ? "#294737" : "transparent",
                      color: active ? "#171614" : completed ? "#fff" : "#8D8980",
                      border: active || completed ? "none" : "1px solid #b5ad9d",
                    }}
                  >
                    {completed ? <CheckIcon sx={{ fontSize: 16 }} /> : index + 1}
                  </Box>

                  <Typography sx={{ flex: 1, fontSize: 16, fontWeight: active ? 800 : 600 }}>
                    {cat.name}
                  </Typography>

                  {active && (
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#9B7940" }}>
                      אתם כאן
                    </Typography>
                  )}
                  {!active && chosen > 0 && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      נבחרו {chosen}
                    </Typography>
                  )}
                </Box>
              );
            })}

            <Typography
              sx={{ mt: 1, fontSize: 12.5, textAlign: "center", color: "text.secondary" }}
            >
              אפשר לעבור לכל שלב בכל רגע
            </Typography>
          </Box>
        </Dialog>

        {/* ===== פתיח (אליו חוזרים בכל מעבר שלב) ===== */}
        <Box
          ref={introSectionRef}
          sx={{
            width: "100%",
            maxWidth: 1000,
            mx: "auto",
            mt: { xs: 2, md: 4 },
            mb: { xs: 2, md: 3 },
            px: { xs: 2, md: 3 },
            boxSizing: "border-box",
            // משאיר מקום לנבר ולסרגל השלבים הנעוצים
            scrollMarginTop: `${stickyTop + stepsBarHeight + 8}px`,
          }}
        >
          <Box
            sx={{
              textAlign: "center",
              bgcolor: darkMode ? "#1e1e1e" : "#fffaf5",
              border: `1px solid ${darkMode ? "#3a3a3a" : "#eadbc8"}`,
              borderRadius: 3,
              px: { xs: 2, md: 5 },
              py: { xs: 3, md: 4 },
              boxShadow: darkMode
                ? "0 4px 18px rgba(0,0,0,0.25)"
                : "0 4px 18px rgba(100,65,30,0.06)",
              transition: "background-color 0.3s, border-color 0.3s",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 23, md: 32 },
                fontWeight: 800,
                color: darkMode ? "#e8c99b" : "#6d4228",
                mb: 1,
              }}
            >
              {isFirstStep ? "הטעם הטוב מתחיל כאן" : `עכשיו הולכים על ${selectedCategory}`}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 14, md: 17 },
                color: darkMode ? "#d0d0d0" : "#62564d",
                lineHeight: 1.9,
                maxWidth: 700,
                mx: "auto",
              }}
            >
              {isFirstStep
                ? "ברוכים הבאים להזמנת האוכל המוכן שלנו. נבנה את התפריט שלכם יחד, שלב אחר שלב: מתחילים ב" +
                  selectedCategory +
                  ", ובסוף עוברים לסיכום. בחרו לפי קילוגרמים או יחידות, בהתאם לאופן שבו כל מנה מוצגת."
                : "בחרו את המנות שאתם אוהבים, אפשר לחזור לשלב הקודם או לדלג קדימה בכל רגע."}
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 14, md: 16 },
                color: darkMode ? "#ff7777" : "#940b11",
                fontWeight: 600,
                mt: 1,
              }}
            >
              מינימום הזמנה {MIN_ORDER.toLocaleString("he-IL")} ש"ח
            </Typography>

            {/* התקדמות לעבר המינימום */}
            {totalPrice > 0 && (
              <Typography
                sx={{
                  fontSize: { xs: 13, md: 15 },
                  mt: 0.5,
                  fontWeight: 600,
                  color: reachedMinimum
                    ? darkMode ? "#8fd19e" : "#2e7d32"
                    : darkMode ? "#d0d0d0" : "#62564d",
                }}
              >
                {reachedMinimum
                  ? `הגעתם למינימום ההזמנה · סה״כ בסל ₪${totalPrice.toFixed(2)}`
                  : `בסל כבר ₪${totalPrice.toFixed(2)} · חסרים עוד ₪${missingForMinimum.toFixed(2)} למינימום`}
              </Typography>
            )}

            {/* תשלומים: מוצג רק אחרי שהגיעו למינימום ההזמנה */}
            {totalPrice > 0 && reachedMinimum && (
              <Typography
                sx={{
                  fontSize: { xs: 13, md: 15 },
                  mt: 0.3,
                  fontWeight: 600,
                  color: darkMode ? "#d0d0d0" : "#62564d",
                }}
              >
                או עד {MAX_INSTALLMENTS} תשלומים של ₪{perPayment.toFixed(2)}
              </Typography>
            )}

            <Box sx={{ mt: 3, display: "flex", justifyContent: "center", width: "100%" }}>
              <Box
                component="button"
                onClick={() => setOpenCart(true)}
                sx={{
                  width: { xs: "100%", sm: 280 },
                  maxWidth: 320,
                  minHeight: 56,
                  px: 3,
                  py: 1.5,
                  border: `2px solid ${darkMode ? "#d6b77c" : "#6d4228"}`,
                  borderRadius: 2,
                  backgroundColor: darkMode ? "#292929" : "#fffaf5",
                  color: darkMode ? "#e8c99b" : "#6d4228",
                  fontSize: 18,
                  fontWeight: 800,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: darkMode
                    ? "0 3px 10px rgba(0,0,0,0.2)"
                    : "0 3px 10px rgba(100,65,30,0.08)",
                  "&:hover": {
                    backgroundColor: darkMode ? "#d6b77c" : "#6d4228",
                    color: darkMode ? "#171717" : "#ffffff",
                    boxShadow: darkMode
                      ? "0 5px 15px rgba(0,0,0,0.3)"
                      : "0 5px 15px rgba(100,65,30,0.2)",
                  },
                }}
              >
                סל הקניות שלך
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ===== כותרת השלב הנוכחי ===== */}
        <Box sx={{ textAlign: "center", my: 2 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: darkMode ? "#e8c99b" : "#111", transition: "color 0.3s" }}
          >
            {selectedCategory}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: darkMode ? "#bdbdbd" : "gray", transition: "color 0.3s" }}
          >
            {currentCategoryCount > 0
              ? `בחרתם ${currentCategoryCount} מוצרים מהקטגוריה הזו`
              : "בחרו את המנות שמתאימות לכם, או דלגו לשלב הבא"}
          </Typography>
        </Box>

        {/* ===== כפתורי ניווט קטנים (למעלה, לפני המוצרים): חזרה / דלג / המשך ===== */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          {!isFirstStep ? (
            <Button
              size="small"
              onClick={() => goToStep(stepIndex - 1)}
              startIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 38,
                px: 1.8,
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: 13,
                color: darkMode ? "#e8c99b" : "#6d4228",
                border: `1.5px solid ${darkMode ? "#d6b77c" : "#6d4228"}`,
                bgcolor: "transparent",
                "&:hover": {
                  bgcolor: darkMode ? "rgba(214,183,124,0.12)" : "rgba(109,66,40,0.08)",
                },
              }}
            >
              חזרה ל{prevCategory?.name}
            </Button>
          ) : (
            <Box />
          )}

          {!isLastStep ? (
            <Button
              size="small"
              onClick={() => goToStep(stepIndex + 1)}
              endIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 38,
                px: 1.8,
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: 13,
                color: "#FFFFFF",
                background:
                  currentCategoryCount > 0
                    ? "linear-gradient(135deg, #294737, #1D3529)"
                    : "linear-gradient(135deg, #8a7a5c, #6f6148)",
                boxShadow: "0 4px 8px rgba(41,71,55,0.16)",
                "&:hover": {
                  background:
                    currentCategoryCount > 0
                      ? "linear-gradient(135deg, #355C45, #294737)"
                      : "linear-gradient(135deg, #9a8a6c, #7f7158)",
                },
              }}
            >
              {currentCategoryCount > 0
                ? `המשך ל${nextCategory?.name}`
                : `דלג ל${nextCategory?.name}`}
            </Button>
          ) : (
            <Button
              size="small"
              onClick={handleFinish}
              endIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
              sx={{
                height: 38,
                px: 1.8,
                borderRadius: "10px",
                fontWeight: 800,
                fontSize: 13,
                color: "#FFFFFF",
                background: "linear-gradient(135deg, #294737, #1D3529)",
                boxShadow: "0 4px 8px rgba(41,71,55,0.16)",
                "&:hover": {
                  background: "linear-gradient(135deg, #355C45, #294737)",
                },
              }}
            >
              {reachedMinimum && cart.length > 0 ? "סיימנו, מעבר לסיכום " : "לצפייה בסל ההזמנה"}
            </Button>
          )}
        </Box>

        {/* ===== כפתור סל צף ===== */}
        <IconButton
          id="main-course-cart"
          aria-label="פתיחת סל הקניות"
          onClick={() => setOpenCart(true)}
          sx={{
            position: "fixed",
            left: 20,
            bottom: 20,
            zIndex: 999,
            bgcolor: "#fff",
            color: darkMode ? "#000" : "#555",
            boxShadow: 4,
            borderRadius: "50%",
            width: 60,
            height: 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { bgcolor: "#eee" },
          }}
        >
          <Badge badgeContent={totalItems} color="error">
            <ShoppingCartIcon fontSize="large" />
          </Badge>
        </IconButton>

        {/* ===== כרטיסי מוצרים ===== */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 1, sm: 3 },
            py: 3,
            boxSizing: "border-box",
          }}
        >
          {filteredDishes.length === 0 && (
            <Typography textAlign="center" color="text.secondary" sx={{ py: 6 }}>
              אין כרגע מוצרים בקטגוריה הזו. אפשר להמשיך לשלב הבא.
            </Typography>
          )}

          <Grid container spacing={4} justifyContent="center" sx={{ width: "100%" }}>
            {filteredDishes.map((dish) => (
              <Grid
                key={dish.id}
                size={{ xs: 12, sm: 6, md: 3 }}
                sx={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}
              >
                <Card
                  sx={{
                    width: { xs: "90%", sm: "100%" },
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
                    onClick={() => {
                      // זום רק כשיש תמונה אמיתית (לא תמונת ברירת המחדל)
                      if (dish.image?.trim()) {
                        setZoomImage({ src: dish.image.trim(), name: dish.name });
                      }
                    }}
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      bgcolor: "#FFFFFF",
                      cursor: dish.image?.trim() ? "zoom-in" : "default",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={dish.image?.trim() || defaultDishImage}
                      alt={dish.image?.trim() ? dish.name : "טרם צולמה תמונה למנה"}
                      onError={(e) => {
                        if (e.currentTarget.src !== defaultDishImage) {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = defaultDishImage;
                        }
                      }}
                      sx={{
                        height: 230,
                        width: "100%",
                        objectFit: dish.image?.trim() ? "cover" : "contain",
                        p: dish.image?.trim() ? 0 : 3,
                        boxSizing: "border-box",
                        bgcolor: "#FFFFFF",
                        transition: "transform 0.5s ease",
                        "&:hover": {
                          transform: dish.image?.trim() ? "scale(1.045)" : "none",
                        },
                      }}
                    />
                    {dish.image?.trim() && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 10,
                          left: 10,
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 19 }} />
                      </Box>
                    )}
                    
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
                      "&:last-child": { pb: 2.2 },
                    }}
                  >
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

                      <Box sx={{ flexShrink: 0, textAlign: "left", pl: 0.5 }}>
                        <Typography
                          sx={{
                            fontSize: 17,
                            fontWeight: 800,
                            color: "#9B7940",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {dish.price == null
                            ? "בתיאום"
                            : `₪ ${calculateCustomerPrice(dish.price).toFixed(2)}`}
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontSize: 16, color: "#888477" }}>
                          מחיר {dish.unit}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2, borderColor: "#EAE3D7" }} />

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
                          "&:hover": { bgcolor: "#EAE2D3" },
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
                          "&:hover": { bgcolor: "#D6E4D6" },
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
                      startIcon={<ShoppingBagOutlinedIcon sx={{ ml: 0.5 }} />}
                      sx={{
                        mt: "auto",
                        height: 49,
                        borderRadius: "13px",
                        fontWeight: 800,
                        fontSize: 15,
                        color: "#FFFFFF",
                        background: "linear-gradient(135deg, #294737, #1D3529)",
                        boxShadow: "0 8px 12px rgba(41,71,55,0.16)",
                        transition: "all 0.25s ease",
                        "&:hover": {
                          background: "linear-gradient(135deg, #355C45, #294737)",
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

        {/* ===== ניווט בין שלבים: חזרה / דלג / המשך ===== */}
        <Box
          sx={{
            width: "100%",
            maxWidth: 900,
            mx: "auto",
            mt: { xs: 2, md: 4 },
            mb: { xs: 8, md: 10 },
            px: { xs: 2, md: 3 },
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              alignItems: "stretch",
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            {/* חזרה לקטגוריה הקודמת (בשלב הראשון אין, נשאר מקום ריק לשמירת הפריסה) */}
            {!isFirstStep ? (
              <Button
                onClick={() => goToStep(stepIndex - 1)}
                startIcon={<ArrowForwardIcon />}
                sx={{
                  flex: { sm: "0 1 280px" },
                  height: 54,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: 15,
                  color: darkMode ? "#e8c99b" : "#6d4228",
                  border: `2px solid ${darkMode ? "#d6b77c" : "#6d4228"}`,
                  bgcolor: "transparent",
                  "&:hover": {
                    bgcolor: darkMode ? "rgba(214,183,124,0.12)" : "rgba(109,66,40,0.08)",
                  },
                }}
              >
                חזרה ל{prevCategory?.name}
              </Button>
            ) : (
              <Box sx={{ flex: { sm: "0 1 280px" }, display: { xs: "none", sm: "block" } }} />
            )}

            {/* המשך / דילוג / סיום */}
            {!isLastStep ? (
              <Button
                onClick={() => goToStep(stepIndex + 1)}
                endIcon={<ArrowBackIcon />}
                sx={{
                  flex: { sm: "0 1 320px" },
                  height: 54,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#FFFFFF",
                  background:
                    currentCategoryCount > 0
                      ? "linear-gradient(135deg, #294737, #1D3529)"
                      : "linear-gradient(135deg, #8a7a5c, #6f6148)",
                  boxShadow: "0 8px 12px rgba(41,71,55,0.16)",
                  "&:hover": {
                    background:
                      currentCategoryCount > 0
                        ? "linear-gradient(135deg, #355C45, #294737)"
                        : "linear-gradient(135deg, #9a8a6c, #7f7158)",
                  },
                }}
              >
                {currentCategoryCount > 0
                  ? `המשך ל${nextCategory?.name}`
                  : `דלג ל${nextCategory?.name}`}
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                endIcon={<ArrowBackIcon />}
                sx={{
                  flex: { sm: "0 1 320px" },
                  height: 54,
                  borderRadius: "14px",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#FFFFFF",
                  background: "linear-gradient(135deg, #294737, #1D3529)",
                  boxShadow: "0 8px 12px rgba(41,71,55,0.16)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #355C45, #294737)",
                  },
                }}
              >
                {reachedMinimum && cart.length > 0 ? "סיימנו, מעבר לסיכום הזמנה" : "לצפייה בסל ההזמנה"}
              </Button>
            )}
          </Box>

          {isLastStep && !reachedMinimum && (
            <Typography
              sx={{
                textAlign: "center",
                mt: 1.5,
                fontSize: 14,
                fontWeight: 600,
                color: darkMode ? "#ff7777" : "#940b11",
              }}
            >
              חסרים עוד ₪{missingForMinimum.toFixed(2)} כדי להגיע למינימום ההזמנה. אפשר לחזור לשלבים הקודמים ולהוסיף מנות.
            </Typography>
          )}
        </Box>

        {/* ===== אנימציית תמונה אל הסל ===== */}
        {animateImage && (
          <motion.img
            key={animateImage.id}
            src={animateImage.image}
            alt=""
            initial={{
              top: animateImage.top,
              left: animateImage.left,
              width: animateImage.width,
              height: animateImage.height,
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              top: animateImage.targetTop,
              left: animateImage.targetLeft,
              width: 36,
              height: 36,
              opacity: 0.15,
              scale: 0.35,
              rotate: 12,
            }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              zIndex: 99999,
              objectFit: "cover",
              borderRadius: 12,
              pointerEvents: "none",
              boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            }}
            onAnimationComplete={() => setAnimateImage(null)}
          />
        )}

        {/* ===== מגירת סל הקניות ===== */}
        <Drawer
          anchor="left"
          open={openCart}
          onClose={() => setOpenCart(false)}
          PaperProps={{
            sx: {
              width: { xs: "85%", sm: 380, md: 420 },
              maxWidth: "420px",
              height: "100dvh",
              display: "flex",
              flexDirection: "column",
              bgcolor: "#fafafa",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0,0,0,.18)",
              borderTopRightRadius: { xs: 20, sm: 24 },
              borderBottomRightRadius: { xs: 20, sm: 24 },
            },
          }}
        >
          {/* כותרת */}
          <Box
            sx={{
              p: 3,
              bgcolor: "#fff",
              color: darkMode ? "#000" : "#555",
              borderBottom: "1px solid #eee",
              flexShrink: 0,
            }}
          >
            <Typography variant="h5" fontWeight="bold" textAlign="center">
              🛒 סל הקניות
            </Typography>
          </Box>

          {cart.length === 0 ? (
            <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Typography color="text.secondary">הסל שלך ריק</Typography>
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
                  "&::-webkit-scrollbar": { width: "8px" },
                  "&::-webkit-scrollbar-thumb": { background: "#c7c7c7", borderRadius: "20px" },
                  "&::-webkit-scrollbar-thumb:hover": { background: "#9e9e9e" },
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
                      bgcolor: "#fff",
                      color: "#222",
                      borderRadius: 4,
                      boxShadow: "0 5px 15px rgba(0,0,0,.08)",
                    }}
                  >
                    {/* תמונה - בלחיצה נפתח זום במסך מלא */}
                    <Box
                      role="button"
                      aria-label={`הגדלת התמונה של ${item.name}`}
                      onClick={() =>
                        setZoomImage({
                          src: item.image?.trim() || defaultDishImage,
                          name: item.name,
                        })
                      }
                      sx={{
                        position: "relative",
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        cursor: "zoom-in",
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={item.image?.trim() || defaultDishImage}
                        alt={item.name}
                        onError={(e) => {
                          if (e.currentTarget.src !== defaultDishImage) {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultDishImage;
                          }
                        }}
                        sx={{ width: 80, height: 80, borderRadius: 3, objectFit: "cover" }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          bgcolor: "rgba(0,0,0,0.55)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <ZoomInIcon sx={{ fontSize: 15 }} />
                      </Box>
                    </Box>

                    <Box sx={{ flex: 1, mr: 2 }}>
                      <Typography fontWeight="bold">{item.name}</Typography>

                      <Typography color="success.main" fontWeight="bold">
                        ₪ {item.price == null ? "בתיאום" : item.price.toFixed(2)} / {item.unit}
                      </Typography>

                      <Box display="flex" alignItems="center" mt={1}>
                        <IconButton
                          size="small"
                          aria-label="הפחתת כמות"
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((p) =>
                                p.id === item.id
                                  ? { ...p, quantity: Math.max(1, p.quantity - 1) }
                                  : p
                              )
                            )
                          }
                        >
                          <RemoveIcon />
                        </IconButton>

                        <Typography sx={{ width: 30, textAlign: "center", fontWeight: "bold" }}>
                          {item.quantity}
                        </Typography>

                        <IconButton
                          size="small"
                          aria-label="הגדלת כמות"
                          onClick={() =>
                            setCart((prev) =>
                              prev.map((p) =>
                                p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
                              )
                            )
                          }
                        >
                          <AddIcon />
                        </IconButton>

                        <IconButton
                          color="error"
                          aria-label="הסרה מהסל"
                          sx={{ ml: "auto" }}
                          onClick={() => removeItem(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      <Typography mt={1} fontWeight="bold">
                        ₪ {item.price == null ? "בתיאום" : (item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>

              {/* תחתית קבועה */}
              <Box
                sx={{
                  px: 3,
                  pt: 2.5,
                  pb: 2,
                  bgcolor: "#fff",
                  color: "#111",
                  borderTop: "1px solid #e6e6e6",
                  flexShrink: 0,
                }}
              >
                {/* סה"כ */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography fontWeight="bold" fontSize={17}>
                    סה״כ:
                  </Typography>
                  <Typography fontWeight="bold" fontSize={24} color="success.main">
                    ₪ {totalPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* תשלומים: עד MAX_INSTALLMENTS בכל סכום */}
                {totalPrice > 0 && (
                  <Typography sx={{ mt: 0.5, fontSize: 14, color: "#555" }}>
                    או עד {MAX_INSTALLMENTS} תשלומים של ₪{perPayment.toFixed(2)}
                  </Typography>
                )}

                {/* מינימום הזמנה */}
                {!reachedMinimum && (
                  <Typography sx={{ mt: 1, fontSize: 13, fontWeight: 600, color: "#940b11" }}>
                    מינימום הזמנה {MIN_ORDER.toLocaleString("he-IL")} ש"ח · חסרים עוד ₪
                    {missingForMinimum.toFixed(2)}
                  </Typography>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  disabled={!reachedMinimum}
                  sx={{ mt: 2, height: 54, borderRadius: 4, fontWeight: "bold", fontSize: 16 }}
                  onClick={goToCheckout}
                >
                  מעבר לסיכום הזמנה
                </Button>

                <Button
                  fullWidth
                  onClick={() => setOpenCart(false)}
                  sx={{ mt: 0.5, fontWeight: 700, color: "#555" }}
                >
                  המשך בחירת מנות
                </Button>

                {/* דירוג לקוחות */}
                <Box
                  sx={{
                    mt: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Box sx={{ display: "flex", direction: "ltr" }} aria-label="דירוג 5 כוכבים">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <StarIcon key={n} sx={{ fontSize: 18, color: "#F5B301" }} />
                    ))}
                  </Box>
                  <Typography sx={{ fontSize: 13, color: "#444" }}>
                    מעל {CUSTOMERS_COUNT.toLocaleString("he-IL")}+ לקוחות מרוצים
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Drawer>

        {/* ===== זום על תמונה מהסל - מסך מלא ===== */}
        <Dialog
          fullScreen
          open={!!zoomImage}
          onClose={() => setZoomImage(null)}
          PaperProps={{ sx: { bgcolor: "rgba(0,0,0,0.96)" } }}
        >
          <Box
            onClick={() => setZoomImage(null)}
            sx={{
              position: "relative",
              width: "100%",
              height: "100dvh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 1, md: 4 },
              boxSizing: "border-box",
            }}
          >
            {/* X ליציאה + הורדה למכשיר */}
            <Box
              dir="rtl"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                display: "flex",
                gap: 1,
                zIndex: 2,
              }}
            >
              <IconButton
                aria-label="יציאה מהתמונה"
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomImage(null);
                }}
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.14)", "&:hover": { bgcolor: "rgba(255,255,255,0.26)" } }}
              >
                <CloseIcon />
              </IconButton>

              <IconButton
                aria-label="הורדת התמונה למכשיר"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownloadImage();
                }}
                sx={{ color: "#fff", bgcolor: "rgba(255,255,255,0.14)", "&:hover": { bgcolor: "rgba(255,255,255,0.26)" } }}
              >
                <DownloadIcon />
              </IconButton>
            </Box>

            {zoomImage && (
              <Box
                component="img"
                src={zoomImage.src}
                alt={zoomImage.name}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  if (e.currentTarget.src !== defaultDishImage) {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = defaultDishImage;
                  }
                }}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
            )}
          </Box>
        </Dialog>

        <Footer />


      </Box>{/* כפתורי קשר צפים - וואטסאפ וטלפון */}
      <Box
        sx={{
          position: "fixed",
          right: { xs: 14, md: 24 },
          bottom: { xs: 60, md: 60 },
          zIndex: 1500,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {/* WhatsApp */}
        <IconButton
          component="a"
          href="https://wa.me/972548520195"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שלחו לנו הודעה בוואטסאפ"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#fff",
            bgcolor: "#25D366",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              bgcolor: "#1ebe5d",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(37,211,102,0.35)",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 29, md: 33 } }} />
        </IconButton>
      
        {/* שיחת טלפון */}
        <IconButton
          component="a"
          href="tel:0795152820"
          aria-label="התקשרו אלינו"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#17130a",
            background: "linear-gradient(135deg, #f5df9b, #c6a24b)",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #ffe9a8, #d4b45f)",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(198,162,75,0.35)",
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: { xs: 26, md: 30 } }} />
        </IconButton>


      </Box>

    </ThemeProvider>
  );
}
