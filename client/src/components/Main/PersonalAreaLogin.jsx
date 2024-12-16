import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";
import axios from "axios";

const PersonalAreaLogin = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(""); // שם המשתמש
  const [userPassword, setUserPassword] = useState(""); // סיסמת המשתמש
  const [error, setError] = useState(""); // הודעת שגיאה


  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.post("http://localhost:3001/api/verifyToken", {}, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { role } = response.data.user;

          if (role === "manager") {
            navigate("/SystemManagerHome");
          } else {  
        
           console.log("אני ביוזאפקט");
          }
        } catch (err) {
          localStorage.removeItem("authToken");
        }
      }
    };
  
    checkToken(); // קריאה לפונקציה האסינכרונית
  }, [navigate]); // תלות ריקה
  

  const handleLogin = async () => {
    try {
      // שליחת בקשה לשרת עם שם המשתמש והסיסמה
      const response = await axios.post("http://localhost:3001/api/login", {
        userName: userName,
        password: userPassword, // הסיסמה שהוזנה
      });
  
      const { token, role } = await response.data;  // הפקת המידע מהתשובה
  
      localStorage.setItem("authToken", token); // מאחסנים את הטוקן במאגרים המקומיים
  
      if (role === "manager") {
        // ניווט למנהל
        navigate("/SystemManagerHome");
      } else {   // במקרה של לקוח רגיל, שולחים את הטוקן כדי לשלוף את ההזמנות
        const ordersResponse = await axios.get("http://localhost:3001/api/OrderPersonalArea", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(ordersResponse.data);
        
        const orders = ordersResponse.data;
        
  
        navigate("/PersonalArea", { state: { orders , userName} });   // ניווט לדף האזור האישי עם ההזמנות
     
        
      }
    } catch (err) {
      // הצגת שגיאה אם האימות נכשל
      setError("שם המשתמש או הסיסמה אינם נכונים.");
    }
  };
  

  return (
    <div>
      <NavbarHome />
      <br /> <br /> <br /> <br />
      <Box
        className="content-personal-area"
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        sx={{ backgroundColor: "#f5f5f5" }}
      >
        <Box
          component="form"
          sx={{
            width: 400,
            p: 3,
            borderRadius: 2,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            backgroundColor: "#fff",
          }}
          dir="rtl"
        >
          <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
            כניסה לאזור אישי
          </Typography>

          <TextField
            label="שם משתמש"
            fullWidth
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="סיסמה"
            type="password"
            fullWidth
            variant="outlined"
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleLogin}
            sx={{
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#357AE8" },
            }}
          >
            כניסה
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default PersonalAreaLogin;
