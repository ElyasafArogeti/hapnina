import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {Box, AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import { Menu as MenuIcon, Home as HomeIcon, People as PeopleIcon, ShoppingCart as ShoppingCartIcon, EventNote as EventNoteIcon, Settings as SettingsIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { TbLogout } from 'react-icons/tb';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ContactMailIcon from '@mui/icons-material/ContactMail';
const NavbarAll = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // בודק אם המסך קטן מ-600px

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'ניהול תפריט מורחב', icon: <SettingsIcon />, to: '/Inventory' },
    { text: 'לוח שנה אירועים', icon: <EventNoteIcon />, to: '/EventCalendar' },
    { text: 'הזמנות אונליין', icon: <DvrOutlinedIcon />, to: '/OnlineOrdersSystem' },
    { text: 'הצעת מחיר בתפריט', icon: <FactCheckIcon />, to: '/NewOrders' },   
     { text: 'ניהול לקוחות', icon: <PeopleIcon />, to: '/UserManagement' },
     { text: 'ניהול הזמנות', icon: <ShoppingCartIcon />, to: '/OrderManagement' },
     { text: 'העמוד הראשי', icon: <HomeIcon />, to: '/systemManagerHome' },

     
  ];


  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1000) {
        setDrawerOpen(false); // סגור את הדראוור אם המסך גדול מ-1000px
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const open = Boolean(anchorEl);

  return (
    <AppBar position="static" color="white" sx={{ maxWidth: "1200px", margin: '0 auto' }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ mr: 3 }}>
          <MenuIcon />
        </IconButton>

        {/* תפריט רגיל במסכים גדולים */}
        {!isMobile && (
          <List sx={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center' }}>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.to} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '150px' }}>
                <IconButton color="black" >{item.icon}</IconButton>
                <ListItemText primary={item.text} sx={{ textAlign: 'center' ,color:"black"}} />
              </ListItem>
            ))}

          </List>
        )}


        {/* תפריט דינמי לכל המסכים */}
        <Drawer dir='rtl' anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.to} sx={{ textAlign: 'center' ,color:"black",marginLeft: 'auto',display: 'flex', marginLeft: 'auto', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton color="black" edge="start" sx={{marginLeft: 'auto'}}>{item.icon}</IconButton>
                <ListItemText primary={item.text}/>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box
        sx={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}
        >
        <IconButton color="inherit" component={Link} to="/" title="יציאה">
          <TbLogout fontSize={"30px"}/>
        </IconButton> 
        <IconButton color="inherit"  component={Link} to="/ContactManager" title="יצירת קשר">
            < ContactMailIcon fontSize={"30px"}/>
        </IconButton> 
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default NavbarAll;
