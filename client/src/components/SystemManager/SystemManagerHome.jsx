import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Box, LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import {LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import NavbarAll from '../SystemManager/NavbarAll';
import Grid2 from '@mui/material/Grid2';

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';

import { useNavigate } from 'react-router-dom';
const SystemManagerHome = () => {
  const navigate = useNavigate(); // יצירת פונקציה לנווט
  const [userCount, setUserCount] = useState(0); // כמות משתמשים
  const [monthlyOrders, setMonthlyOrders] = useState([]); // כמות אירועים לפי חודש
  const [weeklyEvents, setWeeklyEvents] = useState([]); // אירועים לשבוע הקרוב
  const [pendingEvents, setPendingEvents] = useState(0); // אירועים לא סגורים
  const [sliderValue, setSliderValue] = useState([0, 11]); // הערכים ב-Slider מייצגים את האינדקסים של החודשים
  const [yearlyOrders, setYearlyOrders] = useState([]); // הזמנות שנתיות לפי חודש

  const [percentageChange, setPercentageChange] = useState(0);
  const [lastMonthOrders, setLastMonthOrders] = useState(0);
  const [twoMonthsAgoOrders, setTwoMonthsAgoOrders] = useState(0);
  const [loadingData, setLoadingData] = useState({
    orders: true,
    users: true,
    monthlyOrders: true,
    weeklyEvents: true,
    pendingEvents: true,
  });

  const [newRequests, setNewRequests] = useState(0); // פניות חדשות

  const monthNamesHebrew = [
    'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 
    'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
  ];

  const calculatePercentageChange = (lastMonth, twoMonthsAgo) => {
    if (twoMonthsAgo === 0) return 100; // להימנע מחלוקה ב-0
    return ((lastMonth - twoMonthsAgo) / twoMonthsAgo) * 100;
  };

    // קריאת נתונים מהשרת
    useEffect(() => {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const headers = {
            Authorization: `Bearer ${token}`, // הוספת הטוקן כ-Bearer
          };
          const [
            userCountRes,
            monthlyOrdersRes,
            weeklyEventsRes,
            pendingEventsRes,
            yearlyOrdersRes,
            newRequestsRes
          ] = await Promise.all([
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/user-count', { headers }),
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/monthly-orders', { headers }),
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/weekly-events', { headers }),
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/events-pending', { headers }),
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/monthly-orders-summary', { headers }),
            axios.get('https://hapnina-b1d08178cec4.herokuapp.com/getMessages', { headers }),  // קריאה לפניות החדשות
          ]);
          const unreadMessages = newRequestsRes.data.filter(message => !message.isRead);

          setNewRequests(unreadMessages.length);  // עדכון מצב הפניות החדשות

          setUserCount(userCountRes.data.user_count);
          setMonthlyOrders(
            monthlyOrdersRes.data.map(item => ({
              ...item,
              month: monthNamesHebrew[item.month - 1] || item.month,
            }))
          );
          setWeeklyEvents(weeklyEventsRes.data);
          setPendingEvents(pendingEventsRes.data.count);
  
          const yearlyData = yearlyOrdersRes.data.monthlyOrders.map(item => ({
            ...item,
            monthName: monthNamesHebrew[item.month - 1] || item.month,
          }));
          setYearlyOrders(yearlyData);
  
          // חישוב שינוי שנתי
          const lastMonthData = yearlyData[yearlyData.length - 1] || {};
          const twoMonthsAgoData = yearlyData[yearlyData.length - 2] || {};
          setLastMonthOrders(lastMonthData.order_count || 0);
          setTwoMonthsAgoOrders(twoMonthsAgoData.order_count || 0);
          setPercentageChange(
            calculatePercentageChange(lastMonthData.order_count || 0, twoMonthsAgoData.order_count || 0)
          );
  
          // עדכון מצב הטעינה
          setLoadingData(prev => ({
            ...prev,
            orders: false,
            users: false,
            monthlyOrders: false,
            weeklyEvents: false,
            pendingEvents: false,
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
          setLoadingData(prev => ({
            ...prev,
            orders: false,
            users: false,
            monthlyOrders: false,
            weeklyEvents: false,
            pendingEvents: false,
          }));
        }
      };
  
      fetchData();
    }, []);

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const filteredData = monthlyOrders.slice(sliderValue[0], sliderValue[1] + 1); // פילטרציה של המידע על פי הבחירה ב-Slider
const isLoading = Object.values(loadingData).includes(true);



  
  return (
    <>

    <NavbarAll />
   <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 4 }}>
   <Grid2 container spacing={3}>

    {/*  פעמון פניות חדשות*/}
   <Box sx={{  
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
      }}>
        <IconButton color="inherit"   onClick={() => navigate('/ContactManager')}>
          <NotificationsIcon sx={{ fontSize: 40 }} />
          {newRequests > 0 && (
            <Badge badgeContent={newRequests} color="error" sx={{ marginLeft: -1 }} />
          )}
        </IconButton>
      </Box>

    {/* כרטיס כמות משתמש */}
   <Grid2 size={{ xs: 12, sm: 3 }} md={6} lg={4}>
          <Card sx={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="subtitle1" sx={{ color: '#888888', fontWeight: 'bold' }}>
              כמות משתמשים
            </Typography>
            <Typography variant="h3" sx={{ color: '#4caf50', fontWeight: 'bold', marginTop: '8px' }}>
              {userCount}
            </Typography>
          </CardContent>
          </Card>
         </Grid2>

   {/* כרטיס כמות אירועים שעדיין לא אושרו */}
<Grid2 size={{ xs: 12, sm: 3 }} md={6} lg={4}>
<Card sx={{ height: '150px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
    <CardContent sx={{ textAlign: 'center' }}>
      <Typography variant="subtitle1" sx={{ color: '#888888', fontWeight: 'bold' }} component="div" gutterBottom>כמות ההזמנות הממתינים לאישור</Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          {pendingEvents > 0 ? (
            <Typography variant="h3" sx={{ color:"red", fontWeight: 'bold', marginTop: '8px' }}>{pendingEvents}</Typography>
          ) : (
            <Typography variant="h6" color="textSecondary">אין הזמנות ממתינות לאישור</Typography>
          )}
        </>
      )}
    </CardContent>
  </Card>
</Grid2>

    {/* אירועים לשבוע הקרוב */}
          <Grid2 size={{ xs: 12, sm: 6 }}lg={4} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  אירועים השבוע
                </Typography>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>תאריך</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>שם בעל האירוע</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>מספר פלאפון</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={3} align="center"><CircularProgress /></TableCell>
                        </TableRow>
                      ) : (
                        Array.isArray(weeklyEvents) && weeklyEvents.length > 0 ? (
                          weeklyEvents.map((event, index) => (
                            <TableRow key={index} sx={{ '&:nth-of-type(even)': { backgroundColor: '#f4f4f4' }, '&:hover': { backgroundColor: '#e0e0e0' } }}>
                              <TableCell align="center">{new Date(event.event_date).toLocaleDateString()}</TableCell>
                              <TableCell align="center">{event.name}</TableCell>
                              <TableCell align="center">{event.phone}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} align="center">אין אירועים לשבוע הקרוב</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid2>

 
    {/* גרף כמות הזמנות חודשיות */}
          <Grid2 size={{ xs: 12, sm: 12 }}lg={4} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5">גרף כמות אירועים לפי חודש</Typography>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filteredData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="order_count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </Grid2>

    {/* גרף אחוזי עלייה */}
      <Grid2 size={{ xs: 12, sm: 12 }} md={6} lg={4}>
            <Card sx={{ height: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" sx={{ color: '#888888', fontWeight: 'bold' }}>
                  אחוזי עלייה / ירידת  אירועים חודשית - תצוגה שנתית
                </Typography>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <>
                    <Typography variant="h3" sx={{ color: percentageChange >= 0 ? '#4caf50' : '#f44336', fontWeight: 'bold', marginTop: '8px' }}>
                      {percentageChange >= 0 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} {Math.abs(percentageChange.toFixed(1))}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888888', marginTop: '8px' }}>
                      {lastMonthOrders} הזמנות החודש 
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#888888', marginTop: '8px' }}>
                      {twoMonthsAgoOrders} הזמנות חודש שעבר
                    </Typography>
                  </>
                )}
              </CardContent>
              {/* גרף */}
              <Box sx={{ height: '150px', padding: '0 16px 16px 16px' }}>
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={yearlyOrders}>
                      <XAxis dataKey="monthName" />
                      <Tooltip />
                      <Line type="monotone" dataKey="order_count" stroke="#8884d8" name='הזמנות' />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Card>
        </Grid2>
 
        </Grid2>
      </Box>
    </>
  );
};

export default SystemManagerHome;
