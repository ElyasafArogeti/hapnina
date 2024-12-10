import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginManager = () => {
  const navigate = useNavigate();

  // States לשם משתמש וסיסמא
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // קבלת ערכים מתוך משתני סביבה
    const storedUsername = process.env.REACT_APP_ADMIN_USERNAME;
    const storedPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    // בדיקה אם שם המשתמש והסיסמא נכונים
    if (username === storedUsername && password === storedPassword) {
      navigate('/SystemManagerHome'); // מעבר לדף הניהול
    } else {
      setError('שם משתמש או סיסמה שגויים');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundImage: `url("https://i.postimg.cc/gdS1PGkm/1.jpg")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          width: 400,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: 2,
          padding: 3,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#333' }}
        >
          כניסת מנהל
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ marginBottom: 2, position: 'relative' }}>
            <TextField
              fullWidth
              label="שם משתמש"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                endAdornment: <FaUser style={{ marginLeft: 8, color: '#555' }} />,
              }}
            />
          </Box>
          <Box sx={{ marginBottom: 2, position: 'relative' }}>
            <TextField
              fullWidth
              type="password"
              label="סיסמה"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: <FaLock style={{ marginLeft: 8, color: '#555' }} />,
              }}
            />
          </Box>
          {/* הצגת הודעת שגיאה אם יש */}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '10px 0',
              background: '#3f51b5',
            }}
          >
            כניסה
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default LoginManager;
