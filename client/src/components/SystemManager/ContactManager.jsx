import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosInstance'; 
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, IconButton, Snackbar, Alert, Badge } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import NavbarAll from './NavbarAll';

const ContactManager = () => {
  const [messages, setMessages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [newMessagesCount, setNewMessagesCount] = useState(0); // נוודא כאן את מספר ההודעות החדשות שלא נקראו

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // קבלת ההודעות מהשרת
    const fetchMessages = async () => {
      try {
        const response = await axiosInstance.get('/api/getMessages', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setMessages(response.data);
        // ספירת ההודעות שלא נקראו
        const unreadMessages = response.data.filter(message => !message.isRead);
        setNewMessagesCount(unreadMessages.length);
      } catch (error) {
        console.error('שגיאה בהבאת ההודעות:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      // קריאה למחיקת ההודעה
      const response = await axiosInstance.delete(`/api/deleteMessage/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (response.status === 200) {
        // עדכון הסטייט והצגת הודעת הצלחה
        setMessages(messages.filter(message => message.id !== id));
        setSnackbarMessage('ההודעה נמחקה בהצלחה!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('שגיאה במחיקת ההודעה.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <NavbarAll />
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
          ניהול פניות לקוחות
        </Typography>
        <TableContainer component={Paper} dir='rtl'>
          <Table sx={{ minWidth: 650 }} aria-label="messages table" >
            <TableHead>
              <TableRow>
                <TableCell sx={{ textAlign: 'right' }}>שם מלא</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>פלאפון</TableCell>
                <TableCell sx={{ textAlign: 'center' }}>הודעה</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>תאריך ושעה</TableCell>
                <TableCell sx={{ textAlign: 'right' }}>פעולה</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell sx={{ textAlign: 'right' }}>{message.full_name}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{message.phone}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{message.message}</TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>{new Date(message.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(message.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Snackbar להצגת הודעות הצלחה או שגיאה */}
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>

        {/* פעמון עם התראה אם יש הודעה חדשה */}
        <Badge badgeContent={newMessagesCount} color="error" sx={{ position: 'fixed', top: '16px', right: '16px' }}>
          <NotificationsIcon sx={{ fontSize: 30, color: '#FF0000' }} />
        </Badge>
      </Container>
    </>
  );
};

export default ContactManager;
