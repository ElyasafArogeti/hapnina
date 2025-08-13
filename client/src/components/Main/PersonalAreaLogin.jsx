import React, { useState, useEffect } from "react";
import axiosInstance from '../axiosInstance'; 
import { Box, Button, Typography, TextField, Snackbar,InputAdornment, IconButton, Alert, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // אייקונים לעין
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import Divider from '@mui/material/Divider';

const PersonalAreaLogin = () => {
  const navigate = useNavigate();

  const [userName, setUserName] = useState(""); // שם המשתמש
  const [userPassword, setUserPassword] = useState(""); // סיסמת המשתמש
  const [error, setError] = useState(""); // הודעת שגיאה
  const [email, setEmail] = useState(""); // המייל לשחזור סיסמה
  const [verificationCode, setVerificationCode] = useState(""); // קוד אימות
  const [newPassword, setNewPassword] = useState(""); // סיסמה חדשה
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(""); // סיסמה חדשה (אישור)

  const [step, setStep] = useState(1); // שלב התצוגה הנוכחי
  const [snackMessage, setSnackMessage] = useState(""); // הודעה ל-snackbar
  const [snackOpen, setSnackOpen] = useState(false); // האם ה-snackbar פתוח


  const [newPasswordVisible, setNewPasswordVisible] = useState(false); // מצב הצגת הסיסמה
  const [newPasswordConfirmVisible, setNewPasswordConfirmVisible] = useState(false); // מצב הצגת אישור הסיסמה

  const [errors, setErrors] = useState({
    userName: '',
    userPassword: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const [loading, setLoading] = useState(false); // מצב טעינה


  //-------------------------------------------------
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
const [registerEmail, setRegisterEmail] = useState("");
const [registerPassword, setRegisterPassword] = useState("");
const [registerPasswordError, setRegisterPasswordError] = useState("");
const [registerEmailError, setRegisterEmailError] = useState("");



  useEffect(() => { // כל פעם שעובר שלב, נמחק את השגיאות הקודמות
    setErrors({
      userName: '',
      userPassword: '',
      email: '',
      verificationCode: '',
      newPassword: '',
      newPasswordConfirm: ''
    });
    setError('');
  }, [step]);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axiosInstance.post("/api/verifyToken", {}, {
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
    checkToken();
  }, [navigate]);

  const handleLogin = async () => {
    setErrors({ userName: '', userPassword: '' });
    if (!userName ) {
      setErrors((prev) => ({ ...prev, userName: "שם המשתמש לא יכול להיות ריק" }));
      return;
    }
    if (!userPassword) {
      setErrors((prev) => ({ ...prev, userPassword: "הסיסמה לא יכולה להיות ריקה" }));
      return;
    }

    setLoading(true); // הפעלת טעינה
    try {
      const response = await axiosInstance.post("/api/login", {
        userName: userName,
        password: userPassword,
      });

      const { token, role } = await response.data;
      localStorage.setItem("authToken", token);

      if (role === "manager") {
        navigate("/SystemManagerHome");
      } else {
        const ordersResponse = await axiosInstance.get("/api/OrderPersonalArea", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const orders = ordersResponse.data;
        console.log(orders);
        
       navigate("/PersonalArea", { state: { orders, userName } });
      }
    } catch (err) {
      setError("שם המשתמש או הסיסמה אינם נכונים.");
    } finally {
      setLoading(false); // עצירת טעינה
    }
  };


  
  const handleForgotPassword = async () => {
    setErrors({ email: '' });
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "המייל לא יכול להיות ריק." }));
      return;
    }
    setLoading(true); // הפעלת טעינה
    try {

      console.log("אניפה ");
      
      const response = await axiosInstance.post("/api/forgotPassword", { email });
      if (response.data.success) {
        setSnackMessage("קוד לשחזור סיסמה נשלח בהצלחה למייל שלך.");
        setSnackOpen(true);
        setStep(3);
      }
      else {
        setError("המייל אינו תקין. אנא נסה שוב.");
      
        
      }
    } catch (err) {
      setError("בעיה בשליחת המייל. אנא נסה שוב.");  console.log(err);
    } finally {
      setLoading(false); // עצירת טעינה
    }
  };

const handleRegisterUser = async () => {
  setRegisterEmailError("");
  setRegisterPasswordError("");

  if (!registerEmail) {
    setRegisterEmailError("נא להכניס מייל");
    return;
  }
  if (!registerPassword) {
    setRegisterPasswordError("נא להכניס סיסמה");
    return;
  }

  setLoading(true);
  try {
    const response = await axiosInstance.post("/api/registerPersonalArea", {
      email: registerEmail,
      password: registerPassword,
    });

    if (response.data.success) {
      setSnackMessage("ההרשמה בוצעה בהצלחה! כעת תוכל להיכנס");
      setSnackOpen(true);
      setOpenRegisterModal(false);
    } else {
      setRegisterEmailError("המייל כבר קיים במערכת או שגיאה אחרת.");
    }
  } catch (err) {
    setRegisterEmailError("שגיאה בהרשמה, נסה שוב.");
  } finally {
    setLoading(false);
  }
};

  const handleVerifyCode = async () => {
    setErrors({ verificationCode: '' });
    if (!verificationCode) {
      setErrors((prev) => ({ ...prev, verificationCode: "יש להכניס קוד אימות." }));
      return;
    }
  setLoading(true); // הפעלת טעינה
    try {
      const response = await axiosInstance.post("/api/verifyCode", { email, verificationCode });
      if (response.data.success) {
        setSnackMessage("קוד האימות אושר בהצלחה");
        setSnackOpen(true);
        setStep(4);  
      } else {
        setError("קוד אימות לא תקין.");
      }
    } catch (err) {
       setError("קוד אימות לא תקין.");
    } finally {
      setLoading(false); // עצירת טעינה
    }
  };

  const handleChangePassword = async () => {
    setErrors({ newPassword: '', newPasswordConfirm: '' });

    if (!newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "הסיסמה החדשה לא יכולה להיות ריקה." }));
    
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrors((prev) => ({ ...prev, newPasswordConfirm: "הסיסמאות אינן תואמות." }));
     
      return;
    }

    setLoading(true); // הפעלת טעינה
    try {
      const response = await axiosInstance.post("/api/changePassword", { email, newPassword });
      if (response.data.success) {
        setSnackMessage("הסיסמה שונתה בהצלחה.");
        setSnackOpen(true);
        setStep(1);
      }else {
        setError("שגיאה בשינוי הסיסמה.");
      }
    } catch (err) {
      setError("שגיאה בשינוי הסיסמה.");
    } finally {
      setLoading(false); // עצירת טעינה
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const loadingStyle = {
    position: 'fixed',top: '50%',  left: '50%',   transform: 'translate(-50%, -50%)',
    display: 'flex',alignItems: 'center',justifyContent: 'center',flexDirection: 'column',
    fontSize: '18px',zIndex: 9999,   backgroundColor: 'rgba(255, 255, 255, 0.7)', 
    width: '100vw',    height: '100vh', 
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
          {/* Step 1: Login */}
          {step === 1 && (
            <>
              <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
                כניסה לאזור אישי
              </Typography>
            <Typography variant="body2" textAlign="center" mb={3} color="gray">
                      שימו לב: משתמש חדש שביצע הזמנה דרך האתר נדרש להירשם.
            </Typography>         
              <Divider variant="middle" sx={{ borderColor: '#ccc', mb: 4 }} />
              <TextField
                label="שם משתמש"
                fullWidth
                variant="outlined"
                value={userName}
                error={Boolean(errors.userName)}
                helperText={errors.userName}
                onChange={(e) => setUserName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="סיסמה"
                type="password"
                fullWidth
                variant="outlined"
                value={userPassword}
                error={Boolean(errors.userPassword)}
                helperText={errors.userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                sx={{ mb: 2 }}
              />
              {error && (
                <Typography color="error" textAlign="center" mb={2}>
                  {error}
                </Typography>
              )}
              <Typography
                variant="h6"
                textAlign="center"
                mb={3}
                fontWeight="bold"
                sx={{ cursor: "pointer", color: "blue", fontSize: '15px' }}
                onClick={() => setStep(2)}
              >
                שכחתי סיסמה ?
              </Typography>
<Typography
  variant="h6"
  textAlign="center"
  mb={3}
  fontWeight="bold"
  sx={{ cursor: "pointer", color: "blue", fontSize: '15px' }}
  onClick={() => setOpenRegisterModal(true)}
>
  אין לך עדיין סיסמה? הירשם כאן
</Typography>

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

             {loading && (
                     <div style={loadingStyle}>
                       <CircularProgress />
                    
                     </div>
                   )}
             
            </>
          )}

          {/* Step 2: Forgot Password */}
          {step === 2 && (
            <>
              <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
                שחזור סיסמה
              </Typography>
              <TextField
                label="הכנס מייל לשחזור סיסמה"
                fullWidth
                variant="outlined"
                value={email}
                error={Boolean(errors.email)}
                helperText={errors.email}
                onChange={(e) => setEmail(e.target.value)}
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
                onClick={handleForgotPassword}
                sx={{
                  backgroundColor: "#4285F4",
                  "&:hover": { backgroundColor: "#357AE8" },
                }}
              >
                שלח קוד לשחזור
              </Button>

                   {loading && (
                      <div style={loadingStyle}>
                        <CircularProgress />
                      </div>
                    )}
              
            </>
          )}

          {/* Step 3: Verify Code */}
          {step === 3 && (
            <>
              <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
                הכנס סיסמה חד פעמית שנשלחה
              </Typography>

              <TextField
                label="הכנס קוד אימות"
                fullWidth
                variant="outlined"
                value={verificationCode}
                error={Boolean(errors.verificationCode)}
                helperText={errors.verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
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
                onClick={handleVerifyCode}
                sx={{
                  backgroundColor: "#4285F4",
                  "&:hover": { backgroundColor: "#357AE8" },
                }}
              >
                אימות קוד
              </Button>

                  {loading && (
                   <div style={loadingStyle}>
                     <CircularProgress />
                   
                   </div>
                 )}
            </>
          )}


<Dialog open={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
  <DialogTitle>הרשמה לאזור האישי</DialogTitle>
  <DialogContent>
    <TextField
      label="כתובת מייל"
      fullWidth
      variant="outlined"
      value={registerEmail}
      error={Boolean(registerEmailError)}
      helperText={registerEmailError}
      onChange={(e) => setRegisterEmail(e.target.value)}
      sx={{ mb: 2, mt: 1 }}
    />
    <TextField
      label="סיסמה חדשה"
      type="password"
      fullWidth
      variant="outlined"
      value={registerPassword}
      error={Boolean(registerPasswordError)}
      helperText={registerPasswordError}
      onChange={(e) => setRegisterPassword(e.target.value)}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenRegisterModal(false)}>ביטול</Button>
    <Button onClick={handleRegisterUser} variant="contained" color="primary">
      הירשם
    </Button>
  </DialogActions>
</Dialog>



          {/* Step 4: Change Password */}
          {step === 4 && (
            <>
        <Typography variant="h5" textAlign="center" mb={3} fontWeight="bold">
          יצירת סיסמה חדשה
         </Typography>

      <TextField 
        label="סיסמה חדשה"
        type={newPasswordVisible ? "text" : "password"} 
        fullWidth
        variant="outlined"
        value={newPassword}
        error={Boolean(errors.newPassword)}
        helperText={errors.newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{ 
          endAdornment: (
            <InputAdornment position="end">
              <IconButton 
                onClick={() => setNewPasswordVisible(!newPasswordVisible)}
                edge="end"
              >
                {newPasswordVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="אישור סיסמה חדשה"
        type={newPasswordConfirmVisible ? "text" : "password"} // הצגת הסיסמה אם המצב "הסיסמה גלויה"
        fullWidth
        variant="outlined"
        value={newPasswordConfirm}
        error={Boolean(errors.newPasswordConfirm)}
        helperText={errors.newPasswordConfirm}
        onChange={(e) => setNewPasswordConfirm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setNewPasswordConfirmVisible(!newPasswordConfirmVisible)}
                edge="end"
              >
                {newPasswordConfirmVisible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
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
        onClick={handleChangePassword}
        sx={{
          backgroundColor: "#4285F4",
          "&:hover": { backgroundColor: "#357AE8" },
        }}
      >
        עדכון סיסמה
      </Button>

              {loading && (
                      <div style={loadingStyle}>
                        <CircularProgress />
                
                      </div>
                    )}
              
            </>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' , }}>
          {snackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PersonalAreaLogin;
