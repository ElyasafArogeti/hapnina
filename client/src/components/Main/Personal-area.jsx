import React, { useState } from "react";
import { Box, TextField, Button, Typography, Avatar } from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
initializeApp(firebaseConfig);

const PersonalArea = () => {
  const Navigate = useNavigate();
  const [loginPersonalArea, setLoginPersonalArea] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhoto, setUserPhoto] = useState("");

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserName(user.displayName || "");
      setUserEmail(user.email || "");
      setUserPhoto(user.photoURL || "");
      setLoginPersonalArea(false); 
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  return (
    <div>
       <NavbarHome/>  <br/> <br/> <br/><br/>
       
    <Box
      className="content-personal-area"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{ backgroundColor: "#f5f5f5" }}
    >
     
      {loginPersonalArea ? (
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
            label="שם מלא"
            fullWidth
            variant="outlined"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="מייל"
            type="email"
            fullWidth
            variant="outlined"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGoogleSignIn}
            startIcon={<GoogleIcon />}
            sx={{
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#357AE8" },
            }}
          >
            כניסה דרך גוגל
          </Button>
          <br/><br />
          <Button  variant="contained"
            color="primary"
            fullWidth
            onClick={() => Navigate('/LoginManager')} 
            sx={{
              backgroundColor: "#4285F4",
              "&:hover": { backgroundColor: "#357AE8" }
            }}>
            כניסת מנהל
          </Button>
        </Box>
      ) : (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          p={2}
          sx={{ backgroundColor: "#fff", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)" }}
        >
          <Typography variant="h6">שלום, {userName}</Typography>
          <Avatar alt={userName} src={userPhoto} />
        </Box>
      )}
    </Box>
    </div>
  );
};

export default PersonalArea;
