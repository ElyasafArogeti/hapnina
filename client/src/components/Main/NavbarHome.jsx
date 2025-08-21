import React, { useState } from "react";
import {
  Box,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from "@mui/material";
import { FaWaze } from "react-icons/fa";
import {
  BsWhatsapp,
  BsTelephoneOutbound,
  BsPersonCircle
} from "react-icons/bs";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/imgs/logo.jpg";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NavbarHome = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNavigateToBarMitzvah = () => {//בר מצווה 
    navigate("/GenericOrder", {
      state: {
        eventName: "בר מצווה",
        pricePerDish: 70,
        selectionLimits: {
          salads: 5,
          first_courses: 3,
          main_courses: 3,
          side_dishes: 2,
        },
        eventImage: "https://res.cloudinary.com/dhkegagjk/image/upload/v1752413870/%D7%91%D7%A8_%D7%9E%D7%A6%D7%95%D7%95%D7%94_4_ij29kz.jpg",
        hiddenItems: {
      salads: [
       "חסה, שרי ונבטים ברוטב",
        "מטבוחה",
        "שרי בבזיליקום",
        "פלפל מתוק בצבעים",
        "סלט בטטה",
        "סלט ירוק",
      ],
      first_courses: [
        "נסיכת הנילוס מזרחי",
       "ארטישוק ממולא בשר",
       "כבדי עוף מוקפצים",
       "פילה סלמון ברוטב פסטו",
        "מוסקה בשרית",
      ],
      main_courses: [
        "כרעיים עוף ממולא",
        "חזה עוף ממולא",
          "אצבעות אסאדו בסגנון השף",
          "צלי בקר מספר 5",
          "צלי בקר מספר 6",
          "בשר ראש עם חומוס",
      ],
      side_dishes: [
        "זיתים מרוקאים",
      "ארטישוק ופטריות",
        "קוסקוס עם ירקות",
      ],
    },
      },
    });
  };
const handleNavigateToBrit = () => {//ברית
  navigate("/GenericOrder", {
    state: {
      eventName: "ברית מילה",
      pricePerDish: 60,
      selectionLimits: {
        salads: 5,
        first_courses: 3,
        main_courses: 3,
        side_dishes: 2,
      },
      eventImage:
        "https://res.cloudinary.com/dhkegagjk/image/upload/v1752409193/%D7%91%D7%A8%D7%99%D7%AA_3_i9lfck.jpg",
      hiddenItems: {
        salads: [
          "חסה, שרי ונבטים ברוטב",
          "מטבוחה",
          "שרי בבזיליקום",
          "פלפל מתוק בצבעים",
          "סלט בטטה",
          "סלט ירוק",
        ],
        first_courses: [
          "נסיכת הנילוס מזרחי",
          "ארטישוק ממולא בשר",
          "כבדי עוף מוקפצים",
          "פילה סלמון ברוטב פסטו",
          "מוסקה בשרית",
        ],
        main_courses: [
          "כרעיים עוף ממולא",
          "חזה עוף ממולא",
          "אצבעות אסאדו בסגנון השף",
          "צלי בקר מספר 5",
          "צלי בקר מספר 6",
          "בשר ראש עם חומוס",
        ],
        side_dishes: [
          "זיתים מרוקאים",
          "ארטישוק ופטריות",
          "קוסקוס עם ירקות",
        ],
      },
    },
  });
};

const handleNavigateToRentals = () => { //הזכרות
  navigate("/GenericOrder", {
    state: {
      eventName: "אזכרות",
      pricePerDish: 50,
      selectionLimits: {
        salads: 4,
        first_courses: 2,
        main_courses: 2,
        side_dishes: 1,
      },
      eventImage:
      "https://res.cloudinary.com/dhkegagjk/image/upload/v1754379285/%D7%A0%D7%A8_jokrfy.webp",
      hiddenItems: {
        salads: [
          "חסה, שרי ונבטים ברוטב",
          "מטבוחה",
          "סלט פטרוזיליה ולימון",
        ],
        first_courses: [
          "קובה סלק",
          "מרק כתום עשיר",
        ],
        main_courses: [
          "שניצל עוף פריך",
          "קציצות בקר ברוטב עגבניות",
        ],
        side_dishes: [
          "אורז עם שקדים וצימוקים",
        ],
      },
    },
  });
};


  const dropdownItems = [
    {label: "תפריט אירועים", to: "/OrdersOnline"},
    { label: "תפריט לבר מצווה", onClick: handleNavigateToBarMitzvah },
    { label: "תפריט לברית",  onClick: handleNavigateToBrit },
    { label: "תפריט לאזכרות",  onClick: handleNavigateToRentals },
  ];

  return (
    <Box
      dir="rtl"
      sx={{
        marginTop: 0,
        backgroundColor: "black",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
        height: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly"
      }}
    >
      {/* לוגו */}
      <Box display="flex" alignItems="center" marginTop={"auto"}>
        <Link component={RouterLink} to="/" sx={{ textDecoration: "none" }}>
          <Box
            component="img"
            src={logo}
            alt="אולם האירועים הפנינה"
            sx={{
              width: { xs: "140px", sm: "200px", md: "200px" },
              height: { xs: "100px", sm: "200px", md: "150px" },
              position: "relative",
              maxHeight: "150px",
              borderRadius: "8px",
              marginTop: "auto",
              cursor: "pointer",
              objectFit: "cover",
              boxShadow: "0 5px 20px rgba(0, 0, 0, 3)"
            }}
          />
        </Link>
      </Box>

      {/* קישורים במרכז */}
      <Box sx={{ display: { xs: "none", md: "flex" }, gap: "1rem" }}>
        {[
          { label: "דף הבית", to: "/" },
          { label: "שאלות ותשובות", to: "/FAQAccordion" },
          { label: "קצת עלינו", to: "/about" },
          { label: "צור קשר", to: "/contact" }
     
        ].map((link, index) => (
          <Link
            key={index}
            component={RouterLink}
            to={link.to}
            underline="none"
            sx={{
              color: "#FFF",
              fontSize: "1rem",
              transition: "color 0.3s",
              "&:hover": { color: "#FFD700" }
            }}
          >
            {link.label}
          </Link>
        ))}

        {/* דרופדאון הזמנות אונליין */}
        <Box
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
          sx={{ position: "relative" }}
        >
         <Link
               component={RouterLink}
               to="/OrdersOnline"
               underline="none"
               sx={{
                 color: "#FFF",
                 fontSize: "1rem",
                 cursor: "pointer",
                 "&:hover": { color: "#FFD700" }
               }}
                >
                  הזמנות אונליין
        </Link>


          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  backgroundColor: "black",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
                  borderRadius: "0 0 8px 8px",
                  overflow: "hidden",
                  zIndex: 999,
                  minWidth: "220px"
                }}
              >
                {dropdownItems.map((item, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      item.onClick ? item.onClick() : navigate(item.to);
                      setIsDropdownOpen(false);
                    }}
                    sx={{
                      display: "block",
                      padding: "10px 20px",
                      color: "#FFF",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      transition: "background-color 0.3s",
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#222",
                        color: "#FFD700"
                      }
                    }}
                  >
                    {item.label}
                  </Box>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* אייקונים */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton
          href="https://ul.waze.com/ul?preview_venue_id=23003453.230165602.328234&navigate=yes"
          target="_blank"
          sx={{ color: "#FFF", "&:hover": { color: "#FFD700" } }}
        >
          <FaWaze />
        </IconButton>
        <IconButton href="tel:+972548520195" sx={{ color: "#FFF", "&:hover": { color: "#FFD700" } }}>
          <BsTelephoneOutbound />
        </IconButton>
        <IconButton href="https://wa.me/+972548520195" target="_blank" sx={{ color: "#FFF", "&:hover": { color: "#FFD700" } }}>
          <BsWhatsapp />
        </IconButton>
        <IconButton href="/PersonalAreaLogin" sx={{ color: "#FFF", "&:hover": { color: "#FFD700" } }}>
          <BsPersonCircle />
        </IconButton>
      </Box>

      {/* תפריט מובייל */}
      <Box sx={{ display: { xs: "block", md: "none" }, padding: "0 1rem" }}>
        <IconButton onClick={toggleDrawer(true)} sx={{ color: "#FFF", "&:hover": { color: "#FFD700" } }}>
          <MenuIcon />
        </IconButton>

        <AnimatePresence>
          {drawerOpen && (
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{
                component: motion.div,
                initial: { x: "-100%", opacity: 0 },
                animate: { x: 0, opacity: 1 },
                exit: { x: "-100%", opacity: 0 },
                transition: { duration: 0.4 },
                style: {
                  backgroundColor: "rgba(0, 0, 0, 0.95)",
                  width: "260px"
                }
              }}
            >
              <Box>
               <List>
  {[{ label: "דף הבית", to: "/" }, { label: "קצת עלינו", to: "/about" }, { label: "צור קשר", to: "/contact" }, { label: "שאלות ותשובות", to: "/FAQAccordion" }].map(
    (link, index) => (
      <ListItem key={index} disablePadding>
        <ListItemButton
          component={RouterLink}
          to={link.to}
          onClick={toggleDrawer(false)}
          sx={{
            justifyContent: "center",
            padding: "10px 0",
            border: "2px solid #444",
            borderRadius: "8px",
            margin: "5px 0",
            color: "#FFF",
            "&:hover": {
              backgroundColor: "#444",
              borderColor: "#FFD700",
              color: "#FFD700"
            }
          }}
        >
          <ListItemText primary={link.label} sx={{ textAlign: "center" }} />
        </ListItemButton>
      </ListItem>
    )
  )}

  {/* קישורי הזמנות אונליין */}
  <Box sx={{ display: "flex", alignItems: "center", textAlign: "center", marginY: 2 }}>
    <Box sx={{ flex: 1, height: "1px", backgroundColor: "#555" }} />
    <Box sx={{ paddingX: 2, color: "#FFD700", fontWeight: "bold", fontSize: "1rem" }}>
      הזמנות אונליין
    </Box>
    <Box sx={{ flex: 1, height: "1px", backgroundColor: "#555" }} />
  </Box>

  {/* כל תתי-חבילות ההזמנות */}
  {[
    { label: "תפריט אירועים ", to: "/OrdersOnline" },
    { label: "תפריט לבר מצווה", onClick: handleNavigateToBarMitzvah },
    { label: "תפריט לברית", onClick: handleNavigateToBrit },
    { label: "תפריט לאזכרות", onClick: handleNavigateToRentals }
  ].map((item, index) => (
    <ListItem key={index} disablePadding>
      <ListItemButton
        component={item.to ? RouterLink : "div"}
        to={item.to}
        onClick={() => {
          if (item.onClick) item.onClick();
          toggleDrawer(false)();
        }}
        sx={{
          justifyContent: "center",
          padding: "10px 0",
          border: "2px solid #444",
          borderRadius: "8px",
          margin: "5px 0",
          color: "#FFF",
          "&:hover": {
            backgroundColor: "#444",
            borderColor: "#FFD700",
            color: "#FFD700"
          }
        }}
      >
        <ListItemText primary={item.label} sx={{ textAlign: "center" }} />
      </ListItemButton>
    </ListItem>
  ))}
</List>

              </Box>
            </Drawer>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default NavbarHome;
