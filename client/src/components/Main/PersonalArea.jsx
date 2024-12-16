// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Avatar, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, CircularProgress, Box } from '@mui/material';
// import { Person as PersonIcon } from '@mui/icons-material';
// import { jsPDF } from 'jspdf';

// const PersonalArea = () => {
//   const location = useLocation();
//   const { state } = location;
//   const { orders , userDName } = state || {};
//   console.log(orders);

//   const [loading, setLoading] = useState(!orders || !userDName);

//   useEffect(() => {
//     if (!orders || !userDName) {
//       setLoading(false); 
//     }
//   }, [orders, userDName]);

//   const handleDownloadOrder = () => {
//     const doc = new jsPDF();
//     doc.text('סיכום ההזמנה:', 10, 10);

//     orders.forEach((order, index) => {
//       doc.text(`${order.name}: ${order.quantity} - ${order.price} ₪`, 10, 20 + index * 10);
//     });
//     doc.save('order-summary.pdf');
//   };

//   const handleSendToWhatsApp = () => {
//     if (userDName ) {
//       const message = `שלום, הנה פרטי ההזמנה שלך: ${orders.map(order => `\n${order.name}: ${order.quantity}`).join('')}`;
//       const phoneNumber = userData.phoneNumber;
//       const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
//       window.open(url, '_blank');
//     }
//   };

//   if (loading) {
//     return (
//       <Box
//         sx={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           minHeight: '100vh',
//         }}
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   if (!orders || !orders.length) {
//     return (
//       <div style={{ padding: 20 }}>
//         <Typography variant="h5" color="error">
//           .אין הזמנות זמינות עבור המשתמש הזה
//         </Typography>
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 20 }}>
//       {/* הצגת פרטי המשתמש */}
//       <div style={{ display: 'flex', alignItems: 'center' }}>
//         <Avatar sx={{ marginRight: 2 }}><PersonIcon /></Avatar>
//         <Typography variant="h5">{userDName}</Typography>
//       </div>
//       <div style={{ marginTop: 10 }}>
//         <Typography variant="body1"><strong>דוא"ל:</strong> 111</Typography>
//         <Typography variant="body1"><strong>מספר טלפון:</strong>22</Typography>
//       </div>

//       {/* הצגת ההזמנות */}
//       <div style={{ marginTop: 20 }}>
//         <Typography variant="h6">הזמנות אחרונות</Typography>
//         <TableContainer component={Paper} style={{ marginTop: 10 }}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell>שם המוצר</TableCell>
//                 <TableCell>כמות</TableCell>
//                 <TableCell>מחיר ההזמנה</TableCell>
//                 <TableCell>תפריט הזמנה</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {orders.map((order, index) => (
//                 <TableRow key={index}>
//                   <TableCell>{order.name}</TableCell>
//                   <TableCell>{order.quantity}</TableCell>
//                   <TableCell>{order.price}</TableCell>
//                   <TableCell>
//                     <TableContainer component={Paper}>
//                       <Table>
//                         <TableHead>
//                           <TableRow>
//                             <TableCell>פריט</TableCell>
//                             <TableCell>כמות</TableCell>
//                             <TableCell>מחיר</TableCell>
//                           </TableRow>
//                         </TableHead>
//                         <TableBody>
//                           {order.menuItems.map((menuItem, menuIndex) => (
//                             <TableRow key={menuIndex}>
//                               <TableCell>{menuItem.name}</TableCell>
//                               <TableCell>{menuItem.quantity}</TableCell>
//                               <TableCell>{menuItem.price}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </TableContainer>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </div>

//       {/* כפתורים להורדה ושליחה */}
//       <div style={{ marginTop: 20 }}>
//         <Button variant="contained" onClick={handleDownloadOrder} style={{ marginRight: 10 }}>
//           הורד PDF
//         </Button>
//         <Button variant="contained" color="success" onClick={handleSendToWhatsApp}>
//           שלח לוואטסאפ
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default PersonalArea;
