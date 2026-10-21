import React, { useEffect, useState } from "react";
import {
  Box,
  Link,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Typography,
  ListItemText
} from "@mui/material";
import {
  BsPersonCircle
} from "react-icons/bs";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/imgs/logo444.png";
import logokoshr from "../../assets/imgs/logokoshr.png";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";







const NavbarHome = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  handleScroll();

  window.addEventListener("scroll", handleScroll, {
    passive: true,
  });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);


// בתוך הקומפוננטה, לפני ה-return:
const [isScrolled, setIsScrolled] = useState(false);


  //  שליחת הנתונים לתפריט הגנרי
const handleNavigateToBarMitzvah = () => {  //בר מצווה 
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
        eventImage:
          "https://res.cloudinary.com/dhkegagjk/image/upload/v1752413870/%D7%91%D7%A8_%D7%9E%D7%A6%D7%95%D7%95%D7%94_4_ij29kz.jpg",
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
           "פילה סלמון ברוטב אדם",
            "מוסקה בשרית",
            "מאפה פילו במילוי פרגית",
            "קרואסון אסאדו",
            "דג טונה",
          ],
          main_courses: [
            "כרעיים עוף ממולא",
            "חזה עוף ממולא",
              "אצבעות אסאדו בסגנון השף",
              "צלי בקר מספר 5",
              "צלי בקר מספר 6",
              "בשר ראש עם חומוס",
              "פרגית ממולא",
          ],
          side_dishes: [
            "זיתים מרוקאים",
          "ארטישוק ופטריות",
            "קוסקוס עם ירקות",
            "טנזיה",
          ],
        },
      },
    });
};
const handleNavigateToBrit = () => { //ברית
  navigate("/GenericOrder", {
    state: {
      eventName: " ברית מילה  ",
      pricePerDish: 65,
      selectionLimits: {
        salads: 8,
        main_courses: 3,
        side_dishes: 3,
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
        main_courses: [
          "כרעיים עוף ממולא",
          "חזה עוף ממולא",
            "אצבעות אסאדו בסגנון השף",
            "צלי בקר מספר 5",
            "בשר ראש עם חומוס",
            "פרגית ממולא",
        ],
        side_dishes: [
          "זיתים מרוקאים",
        "ארטישוק ופטריות",
          "קוסקוס עם ירקות",
          "טנזיה",
        ],
      },
    },
  });
};
const handleNavigateToRentals = () => { //אזכרות
   navigate("/GenericOrder", {
    state: {
      eventName: " אזכרות  ",
      pricePerDish: 60,
      selectionLimits: {
        salads: 5,
        main_courses: 3,
        side_dishes: 2,
      },
      eventImage:
        "https://res.cloudinary.com/dhkegagjk/image/upload/v1754379285/%D7%A0%D7%A8_jokrfy.webp",
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
            "פרגית ממולא",
        ],
        side_dishes: [
          "זיתים מרוקאים",
        "ארטישוק ופטריות",
          "קוסקוס עם ירקות",
          "טנזיה",
        ],
      },
    },
});
};




// קישורים לסוגים בתצוגת מובייל
  const dropdownItems = [
    {label: "תפריט מורחב ", to: "/OrdersOnline"},
    { label: "תפריט לבר מצווה", onClick: handleNavigateToBarMitzvah },
    { label: "תפריט לברית",  onClick: handleNavigateToBrit },
    { label: "תפריט לאזכרות",  onClick: handleNavigateToRentals },
  ];


//  <Box  אם אני לא רוצה שקיפות בזמן גלילה להחזיר את הקוד הזה 
//    dir="rtl"
//      sx={{
//      position: "absolute",
//      top: 0,
//      left: 0,
//      width: "100%",
//      height: "90px",
//      backgroundColor: "black",
//      zIndex: 1000,
//      display: "flex",
//      alignItems: "center",
//      justifyContent: "space-between",
//      boxSizing: "border-box",
//      px: { xs: 1, md: 2 },
//    }}
//  >


return (
  <Box
    dir="rtl"  // שקיפות הנבבר בשעת גלילה 
    sx={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "90px",

      // שחור מלא בראש העמוד, שקיפות בגלילה
      backgroundColor: isScrolled
        ? "rgba(0, 0, 0, 0.55)"
        : "#000000",

      // אפקט זכוכית עדין בגלילה
      backdropFilter: isScrolled
        ? "blur(12px)"
        : "blur(0px)",
      WebkitBackdropFilter: isScrolled
        ? "blur(12px)"
        : "blur(0px)",

      // צל משתנה לפי מצב הגלילה
      boxShadow: isScrolled
        ? "0 5px 25px rgba(0, 0, 0, 0.25)"
        : "0 3px 18px rgba(0, 0, 0, 0.65)",

      borderBottom: isScrolled
        ? "1px solid rgba(255, 215, 0, 0.12)"
        : "1px solid rgba(255, 255, 255, 0.06)",

      transition:
        "background-color 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",

      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxSizing: "border-box",
      px: { xs: 1, md: 2 },
    }}
  >

    {/* לוגו ראשי - מרכז בטלפון, צד שמאל במחשב */}
    <Box
      sx={{
        position: "absolute",
        left: { xs: "50%", md: 20 },
        top: "50%",
        transform: {
          xs: "translate(-50%, -50%)",
          md: "translateY(-35%)",
        },
        display: "flex",
        alignItems: "center",
        zIndex: 4,
      }}
    >
      <Link component={RouterLink} to="/" underline="none">
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
            objectPosition: "left center",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)",
            maskImage:
              "linear-gradient(to bottom, black 0%, black 72%, rgba(0,0,0,0.85) 86%, transparent 100%)",
          }}
        />
      </Link>
    </Box>

    {/* קישורים - מרכז הכותרת במחשב בלבד */}
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        alignItems: "center",
        justifyContent: "center",
        gap: { md: 1.5, lg: 2.5 },
        whiteSpace: "nowrap",
      }}
    >
      {[
        { label: "דף הבית", to: "/" },
        { label: "אוכל מוכן עד הבית", to: "/MainCourse" },
        { label: "שאלות ותשובות", to: "/FAQAccordion" },
        { label: "קצת עלינו", to: "/about" },
        { label: "צור קשר", to: "/contact" },
      ].map((link) => (
        <Link
          key={link.to}
          component={RouterLink}
          to={link.to}
          underline="none"
          sx={{
            color: "#FFF",
            fontSize: { md: "0.85rem", lg: "0.95rem" },
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFD700",
            },
          }}
        >
          {link.label}
        </Link>
      ))}

      {/* תפריט הזמנות אונליין */}
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
            fontSize: { md: "0.85rem", lg: "0.95rem" },
            cursor: "pointer",
            transition: "color 0.3s ease",
            "&:hover": {
              color: "#FFD700",
            },
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
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                paddingTop: 12,
                backgroundColor: "#080808",
                boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
                borderRadius: "0 0 8px 8px",
                overflow: "hidden",
                zIndex: 999,
                minWidth: 210,
              }}
            >
              {dropdownItems.map((item) => (
                <Box
                  key={item.label}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(item.to);
                    }

                    setIsDropdownOpen(false);
                  }}
                  sx={{
                    padding: "10px 20px",
                    color: "#FFF",
                    fontSize: "0.95rem",
                    cursor: "pointer",
                    transition:
                      "background-color 0.3s ease, color 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#222",
                      color: "#FFD700",
                    },
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

    {/* לוגו כשרות - הכי ימינה במחשב */}
    <Box
      component="img"
      src={logokoshr}
      alt="כשר בהשגחת הרב מחפוד"
      sx={{
        display: { xs: "none", md: "block" },
        position: "absolute",
        right: { md: 8, lg: 12 },
        top: "50%",
        transform: "translateY(-50%)",
        width: 130,
        height: 140,
        objectFit: "contain",
        zIndex: 6,
      }}
    />

  
{/* אייקונים - משמאל ללוגו הכשרות במחשב */}
<Box
  sx={{
    display: { xs: "none", md: "flex" },
    position: "absolute",
    right: { md: 120, lg: 150 },
    top: "50%",
    transform: "translateY(-50%)",
    alignItems: "center",
    gap: 0.5,
    zIndex: 6,
  }}
>
  <IconButton
    component={RouterLink}
    to="/PersonalAreaLogin"
    aria-label="אזור אישי"
    sx={{
      color: "#FFF",
      p: 0.75,
      display: "flex",
      flexDirection: "column",
      gap: 0.2,
      "&:hover": { color: "#FFD700" },
    }}
  >
    <BsPersonCircle size={18} />

    <Typography
      sx={{
        textAlign: "center",
        color: "#FFF",
        fontSize: "8px",
        lineHeight: 1,
        letterSpacing: "0px",
        whiteSpace: "nowrap",
      }}
    >
      אזור אישי
    </Typography>
  </IconButton>
</Box>




{/* אייקונים ולוגו כשרות - טלפון בצד שמאל */}
<Box
  sx={{
    display: { xs: "flex", md: "none" },
    position: "absolute",
    left: 4,
    top: "50%",
    transform: "translateY(-50%)",
    alignItems: "center",
    justifyContent: "center",
    gap: 0,
    zIndex: 6,
  }}
>
  <IconButton
    component={RouterLink}
    to="/PersonalAreaLogin"
    aria-label="אזור אישי"
    sx={{
      color: "#FFF",
      p: 0.4,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.2,
      "&:hover": { color: "#FFD700" },
    }}
  >
    <BsPersonCircle size={16} />

    <Typography
      sx={{
        textAlign: "center",
        color: "#FFF",
        fontSize: "8px",
        lineHeight: 1,
        letterSpacing: "0px",
        whiteSpace: "nowrap",
      }}
    >
      אזור אישי
    </Typography>
  </IconButton>

  <Box
    component="img"
    src={logokoshr}
    alt="כשר בהשגחת הרב מחפוד"
    sx={{
      width: 70,
      height: 80,
      objectFit: "contain",
      ml: 1,
    }}
  />
</Box>


    {/* תפריט מובייל - שלושת הפסים בצד ימין */}
    <Box
      sx={{
        display: { xs: "flex", md: "none" },
        position: "absolute",
        right: 8,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 5,
      }}
    >
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="פתיחת תפריט"
        sx={{
          color: "#FFF",
          "&:hover": { color: "#FFD700" },
        }}
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.97)",
            width: 260,
            color: "#FFF",
          },
        }}
      >
        <Box dir="rtl" sx={{ p: 1 }}>
          <List>
            {[
              { label: "דף הבית", to: "/" },
              { label: "אוכל מוכן עד הבית", to: "/MainCourse" },
              { label: "קצת עלינו", to: "/about" },
              { label: "צור קשר", to: "/contact" },
              { label: "שאלות ותשובות", to: "/FAQAccordion" },
            ].map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={link.to}
                  onClick={toggleDrawer(false)}
                  sx={{
                    justifyContent: "center",
                    py: 1.2,
                    border: "1px solid #444",
                    borderRadius: 2,
                    my: 0.5,
                    color: "#FFF",
                    "&:hover": {
                      backgroundColor: "#222",
                      borderColor: "#FFD700",
                      color: "#FFD700",
                    },
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    sx={{ textAlign: "center" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                my: 2,
                color: "#FFD700",
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  bgcolor: "#555",
                }}
              />

              <Box sx={{ px: 2, fontWeight: "bold" }}>
                סוגי חבילות
              </Box>

              <Box
                sx={{
                  flex: 1,
                  height: "1px",
                  bgcolor: "#555",
                }}
              />
            </Box>

            {dropdownItems.map((item) => (
              <ListItem key={item.label} disablePadding>
                <ListItemButton
                  component={item.to ? RouterLink : "div"}
                  to={item.to}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    }

                    toggleDrawer(false)();
                  }}
                  sx={{
                    justifyContent: "center",
                    py: 1.2,
                    border: "1px solid #444",
                    borderRadius: 2,
                    my: 0.5,
                    color: "#FFF",
                    "&:hover": {
                      backgroundColor: "#222",
                      borderColor: "#FFD700",
                      color: "#FFD700",
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    sx={{ textAlign: "center" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  </Box>
);



};

export default NavbarHome;
