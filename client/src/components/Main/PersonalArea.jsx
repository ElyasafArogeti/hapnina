import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import Grid from '@mui/material/Grid2';
import { Person as PersonIcon, Close as CloseIcon } from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import NavbarHome from './NavbarHome';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/system';

// סטייל מותאם ל-TableCell
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
}));

const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: '500px',
  overflowY: 'auto',  // מאפשר גלילה
  '&::-webkit-scrollbar': {
    width: '8px',  // רוחב הגלגלת
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#888',  // צבע של ידית הגלגלת
    borderRadius: '10px',  // קימור ידית הגלגלת
    transition: 'background-color 0.3s ease',  // אנימציה לשינוי צבע
  },
  '&::-webkit-scrollbar-thumb:hover': {
    backgroundColor: '#555',  // צבע ידית הגלגלת בעת ריחוף
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',  // צבע רקע למסלול הגלגלת
    borderRadius: '10px',  // קימור למסלול
  },
}));

const PersonalArea = () => {
  const location = useLocation();
  const state = location.state || {}; 

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState(state.userName);
  const [orders, setOrders] = useState(state.orders.orders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    setLoading(false);
    console.log(userName);
    console.log(orders);
  }, [state]);

  const handleDownloadOrder = (orderItem) => {
    const doc = new jsPDF();
    doc.text(`Order ID: ${orderItem.id}`, 10, 10);
    doc.text(`Total Price: ${orderItem.totalPrice} ₪`, 10, 20);

    if (orderItem.order_menu) {
      const menu = JSON.parse(orderItem.order_menu);
      let yOffset = 30;

      Object.keys(menu).forEach((category) => {
        doc.text(category, 10, yOffset);
        yOffset += 10;
        menu[category].forEach((item) => {
          doc.text(
            `${item.dish_name} - Price: ${item.totalPrice} ₪ - Quantity: ${item.totalWeight}`,
            10,
            yOffset
          );
          yOffset += 10;
        });
      });
    }

    doc.save(`order-${orderItem.id}.pdf`);
  };

  const handleViewOrder = (orderItem) => {
    setSelectedOrder(orderItem);
  };

  const handleCloseDialog = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <NavbarHome /> 
      <br /><br /><br /><br /><br /><br /><br />
      <Box sx={{ padding: 4, direction: 'rtl', maxWidth: '1200px', margin: '0 auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 4 }}>
          <Avatar sx={{ marginLeft: 2 }}>
            <PersonIcon />
          </Avatar>
          <Typography variant="h5">{userName}</Typography>
        </Box>

        <Grid size={{ xs: 12, sm: 4 }} container spacing={3} sx={{ marginBottom: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" align="center">כמות הזמנות שלך :</Typography>
                <Typography variant="h4" align="center">{orders.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 4 }} md={4}>

        <TableContainer dir="rtl" component={Paper}>
          <Table dir="rtl">
            <TableHead>
              <TableRow>
                <StyledTableCell>פעולות</StyledTableCell>
                <StyledTableCell>מחיר כולל</StyledTableCell>
                <StyledTableCell>תאריך ההזמנה</StyledTableCell>
                <StyledTableCell>כמות האורחים באירוע</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((item) => (
                <TableRow key={item.id}>
                  <TableCell style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => handleDownloadOrder(item)}
                      sx={{ marginRight: 1 }}
                    >
                      הורדה
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleViewOrder(item)}
                    >
                      צפייה בהזמנה
                    </Button>
                  </TableCell>
                  
                  <TableCell>{item.totalPrice} ₪</TableCell>
                  <TableCell>{new Date(item.event_date).toLocaleDateString()}</TableCell>
                  <TableCell>{item.guest_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
        {/* דיאלוג הצגת פרטי הזמנה */}
        <Dialog open={!!selectedOrder} onClose={handleCloseDialog} fullWidth maxWidth="lg">
          <DialogTitle sx={{ position: 'relative', textAlign: 'center' }}>
            <div>
              פרטי הזמנה לתאריך{' '}
              {selectedOrder && selectedOrder.event_date
                ? format(new Date(selectedOrder.event_date), 'dd/MM/yyyy')  // הוספת תאריך בפורמט יומי
                : 'לא זמין'}
            </div>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ padding: '16px', maxHeight: '500px' }}>
            {selectedOrder && (
              <CustomTableContainer sx={{ maxHeight: '500px' }}>
                <Table sx={{ width: '100%' }}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        שם מנה
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(JSON.parse(selectedOrder.order_menu)).map(([category, items]) => (
                      <React.Fragment key={category}>
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            align="center"
                            sx={{
                              fontWeight: 'bold',
                              backgroundColor: '#f5f5f5',
                              fontSize: '1.1rem',
                              padding: '8px 16px',
                            }}
                          >
                            {category === 'salads'
                              ? 'סלטים'
                              : category === 'first_courses'
                              ? 'מנות ראשונות'
                              : category === 'main_courses'
                              ? 'מנות עיקריות'
                              : 'תוספות'}
                          </TableCell>
                        </TableRow>
                        {items.map((dish, index) => (
                          <TableRow key={index}>
                            <TableCell
                              align="right"
                              sx={{
                                padding: '12px 16px',
                                fontSize: '1rem',
                                borderBottom: '1px solid #e0e0e0',
                              }}
                            >
                              {dish.dish_name}
                            </TableCell>
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </CustomTableContainer>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default PersonalArea;
