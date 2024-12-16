import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import NavbarAll from './NavbarAll';
const ContactManager = () => {
  const [messages, setMessages] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    // קבלת ההודעות מהשרת
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3001/getMessages', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setMessages(response.data); 
        console.log(response.data);
        
      } catch (error) {
        console.error('שגיאה בהבאת ההודעות:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    try {
      // קריאה למחיקת ההודעה
      const response = await axios.delete(`http://localhost:3001/deleteMessage/${id}`, {
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
    <NavbarAll/>
    <Container maxWidth="lg" sx={{ mt: 6 }}>
      <Typography variant="h4" component="h1" align="center" sx={{ mb: 4 }}>
        ניהול פניות לקוחות
      </Typography>
      <TableContainer component={Paper} dir='rtl'>
        <Table sx={{ minWidth: 650 }} aria-label="messages table" >
          <TableHead>
            <TableRow>
              <TableCell>שם מלא</TableCell>
              <TableCell>אימייל</TableCell>
              <TableCell>הודעה</TableCell>
              <TableCell>תאריך ושעה</TableCell>
              <TableCell>פעולה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
            {messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell>{message.full_name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
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
    </Container>
     </>
  );
};

export default ContactManager;
