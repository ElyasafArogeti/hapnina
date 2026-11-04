
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import {
  Box,
  Button,
  Typography,
  TextField,
  Snackbar,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import NavbarHome from "./NavbarHome";

import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
  MailOutline,
  SecurityOutlined,
  DiamondOutlined,
  CheckCircleOutline,
} from "@mui/icons-material";

const PersonalAreaLogin = () => {
  const navigate = useNavigate();

  // Login
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [error, setError] = useState("");

  // Forgot password
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [step, setStep] = useState(1);

  // Notifications
  const [snackMessage, setSnackMessage] = useState("");
  const [snackOpen, setSnackOpen] = useState(false);

  // Password visibility
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [newPasswordConfirmVisible, setNewPasswordConfirmVisible] =
    useState(false);

  // Validation
  const [errors, setErrors] = useState({
    userName: "",
    userPassword: "",
    email: "",
    verificationCode: "",
    newPassword: "",
    newPasswordConfirm: "",
  });

  const [loading, setLoading] = useState(false);

  // Registration
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerPasswordError, setRegisterPasswordError] = useState("");
  const [registerEmailError, setRegisterEmailError] = useState("");

  const gold = "#D6B56D";
  const darkGold = "#B18A42";
  const darkBackground = "#101010";

  // Reset errors when changing steps
  useEffect(() => {
    setErrors({
      userName: "",
      userPassword: "",
      email: "",
      verificationCode: "",
      newPassword: "",
      newPasswordConfirm: "",
    });

    setError("");
  }, [step]);

  // Check existing token
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("authToken");

      if (token && token.split(".").length === 3) {
        try {
          const response = await axiosInstance.post(
            "/api/verifyToken",
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const { role } = response.data.user;

          if (role === "manager") {
            navigate("/SystemManagerHome");
          }
        } catch (err) {
          console.error("שגיאה באימות טוקן:", err.message);
          localStorage.removeItem("authToken");
        }
      } else {
        localStorage.removeItem("authToken");
      }
    };

    checkToken();
  }, [navigate]);

  // Login
  const handleLogin = async () => {
    setErrors({
      ...errors,
      userName: "",
      userPassword: "",
    });

    if (!userName) {
      setErrors((prev) => ({
        ...prev,
        userName: "שם המשתמש לא יכול להיות ריק",
      }));
      return;
    }

    if (!userPassword) {
      setErrors((prev) => ({
        ...prev,
        userPassword: "הסיסמה לא יכולה להיות ריקה",
      }));
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post("/api/login", {
        userName,
        password: userPassword,
      });

      const { token, role } = response.data;

      localStorage.setItem("authToken", token);

      if (role === "manager") {
        navigate("/SystemManagerHome");
      } else {
        const ordersResponse = await axiosInstance.get(
          "/api/OrderPersonalArea",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const orders = ordersResponse.data;

        navigate("/PersonalArea", {
          state: {
            orders,
            userName,
          },
        });
      }
    } catch (err) {
      setError("שם המשתמש או הסיסמה אינם נכונים.");
      console.error(
        "Login error:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    setErrors((prev) => ({
      ...prev,
      email: "",
    }));

    if (!email) {
      setErrors((prev) => ({
        ...prev,
        email: "המייל לא יכול להיות ריק.",
      }));
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/forgotPassword", {
        email,
      });

      setSnackMessage("קוד לשחזור סיסמה נשלח בהצלחה למייל שלך.");
      setSnackOpen(true);

      setStep(3);
    } catch (err) {
      setError("בעיה בשליחת המייל. אנא נסה שוב.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Registration
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
      await axiosInstance.post("/api/registerPersonalArea", {
        email: registerEmail,
        password: registerPassword,
      });

      setSnackMessage("ההרשמה בוצעה בהצלחה! כעת תוכל להיכנס.");
      setSnackOpen(true);
      setOpenRegisterModal(false);
    } catch (err) {
      setRegisterEmailError("שגיאה בהרשמה, נסה שוב.");
    } finally {
      setLoading(false);
    }
  };

  // Verify code
  const handleVerifyCode = async () => {
    setErrors((prev) => ({
      ...prev,
      verificationCode: "",
    }));

    if (!verificationCode) {
      setErrors((prev) => ({
        ...prev,
        verificationCode: "יש להכניס קוד אימות.",
      }));
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/verifyCode", {
        email,
        verificationCode,
      });

      // Successful verification -> create password
      setStep(4);

      setSnackMessage("הקוד אומת בהצלחה. כעת ניתן ליצור סיסמה חדשה.");
      setSnackOpen(true);
    } catch (err) {
      setError("קוד אימות לא תקין.");
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    setErrors((prev) => ({
      ...prev,
      newPassword: "",
      newPasswordConfirm: "",
    }));

    if (!newPassword) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "הסיסמה החדשה לא יכולה להיות ריקה.",
      }));
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrors((prev) => ({
        ...prev,
        newPasswordConfirm: "הסיסמאות אינן תואמות.",
      }));
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post("/api/changePassword", {
        email,
        newPassword,
      });

      setSnackMessage("הסיסמה שונתה בהצלחה. כעת ניתן להתחבר.");
      setSnackOpen(true);

      setNewPassword("");
      setNewPasswordConfirm("");
      setVerificationCode("");
      setStep(1);
    } catch (err) {
      setError("שגיאה בשינוי הסיסמה.");
    } finally {
      setLoading(false);
    }
  };

  const handleSnackClose = () => {
    setSnackOpen(false);
  };

  const steps = [
    "הזנת כתובת מייל",
    "אימות קוד",
    "יצירת סיסמה",
  ];

  // Shared input styling
  const inputStyle = {
    mb: 2.5,

    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#FAFAFA",

      "& fieldset": {
        borderColor: "#D6D6D6",
      },

      "&:hover fieldset": {
        borderColor: darkGold,
      },

      "&.Mui-focused fieldset": {
        borderColor: darkGold,
        borderWidth: "2px",
      },
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: darkGold,
    },
  };

  // Gold button
  const goldButtonStyle = {
    background: `linear-gradient(135deg, ${gold}, ${darkGold})`,
    color: "#17130B",
    fontWeight: "bold",
    fontSize: "16px",
    borderRadius: "12px",
    py: 1.5,
    boxShadow: "0 5px 15px rgba(214,181,109,0.2)",

    "&:hover": {
      background: "linear-gradient(135deg, #E7C984, #C49A4C)",
      boxShadow: "0 7px 20px rgba(214,181,109,0.35)",
    },

    "&:disabled": {
      background: "#A8956E",
      color: "#555",
    },
  };

 
return (
  <Box
    sx={{
      minHeight: "100vh",
      background: "#090909",
      overflowX: "hidden",
      position: "relative",
      "&::before": {
        content: '""',
        position: "fixed",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "rgba(214,181,109,0.07)",
        filter: "blur(130px)",
        top: "-250px",
        right: "-150px",
        pointerEvents: "none",
      },
      "&::after": {
        content: '""',
        position: "fixed",
        width: "500px",
        height: "500px",
        borderRadius: "50%",
        background: "rgba(214,181,109,0.05)",
        filter: "blur(120px)",
        bottom: "-250px",
        left: "-150px",
        pointerEvents: "none",
      },
    }}
  >
    <NavbarHome />
     <br /> <br /> <br /> <br />

    <Box
      dir="rtl"
      sx={{
        minHeight: {
          xs: "auto",
          md: "calc(100vh - 80px)",
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        px: { xs: 2, sm: 4, md: 6, lg: 9 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1450px",
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "0.95fr 1.05fr",
          },
          alignItems: "center",
          gap: { xs: 4, md: 7, lg: 11 },
        }}
      >
      
        {/* ================================= */}
        {/* צד שמאל - כרטיס התחברות */}
        {/* ================================= */}

        <Box
          sx={{
            order: { xs: 2, md: 2 },
            width: "100%",
            maxWidth: 530,
            mx: "auto",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              overflow: "hidden",
              borderRadius: {
                xs: "20px",
                md: "27px",
              },
              background: "#FDFCF9",
              border: "1px solid rgba(214,181,109,0.7)",
              boxShadow:
                "0 25px 90px rgba(0,0,0,0.55), 0 0 40px rgba(214,181,109,0.07)",
            }}
          >
            {/* כותרת הכרטיס */}

            <Box
              sx={{
                background:
                  "linear-gradient(135deg, #171717 0%, #29251D 100%)",
                py: { xs: 3, md: 4 },
                px: 3,
                textAlign: "center",
                borderBottom: `2px solid ${gold}`,
                position: "relative",
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: "18px",
                  border: "1px solid rgba(214,181,109,0.5)",
                  background: "rgba(214,181,109,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <DiamondOutlined
                  sx={{
                    color: gold,
                    fontSize: 34,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: 25, md: 29 },
                  fontWeight: 800,
                  mb: 1,
                }}
              >
                האזור האישי שלי
              </Typography>

              <Typography
                sx={{
                  color: "#D6B56D",
                  fontSize: 13,
                  letterSpacing: 0.5,
                }}
              >
                ברוכים הבאים למרחב האישי שלכם
              </Typography>
            </Box>

            <Box
              sx={{
                p: {
                  xs: 2.5,
                  sm: 3.5,
                  md: 4,
                },
              }}
            >
              {/* ================= LOGIN ================= */}

              {step === 1 && (
                <>
                  <Typography
                    variant="h5"
                    fontWeight={800}
                    textAlign="center"
                    color="#202020"
                    mb={1}
                  >
                    כניסה לחשבון
                  </Typography>

                  <Typography
                    textAlign="center"
                    color="#888"
                    fontSize={13}
                    mb={3}
                  >
                    התחברו כדי לצפות בפרטי ההזמנה שלכם
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="שם משתמש"
                      fullWidth
                      variant="outlined"
                      value={userName}
                      error={Boolean(errors.userName)}
                      helperText={errors.userName}
                      onChange={(e) => setUserName(e.target.value)}
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonOutline sx={{ color: darkGold }} />
                          </InputAdornment>
                        ),
                      }}
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
                      sx={inputStyle}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockOutlined sx={{ color: darkGold }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Box
                    sx={{
                      textAlign: "center",
                      mb: 3,
                    }}
                  >
                    <Typography
                      onClick={() => setStep(2)}
                      sx={{
                        cursor: "pointer",
                        display: "inline-block",
                        color: darkGold,
                        fontWeight: 700,
                        fontSize: 14,
                        transition: "0.2s",
                        "&:hover": {
                          color: "#76531D",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      שכחתי סיסמה / יצירת סיסמה ראשונה
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleLogin}
                    disabled={loading}
                    sx={{
                      ...goldButtonStyle,
                      py: 1.7,
                      fontSize: 16,
                      letterSpacing: 0.4,
                    }}
                  >
                    כניסה לאזור האישי
                  </Button>

                
                
                </>
              )}

              {/* ================= FORGOT PASSWORD ================= */}

              {step === 2 && (
                <>
                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      borderRadius: "20px",
                      background: "#F8F0DF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <MailOutline
                      sx={{ fontSize: 33, color: darkGold }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    textAlign="center"
                    mb={1}
                  >
                    שחזור / יצירת סיסמה
                  </Typography>

                  <Typography
                    textAlign="center"
                    color="#777"
                    fontSize={13}
                    lineHeight={1.9}
                    mb={3}
                  >
                    הזינו את כתובת המייל שאיתה ביצעתם את ההזמנה.
                    נשלח אליכם קוד חד-פעמי לצורך יצירת סיסמה אישית.
                  </Typography>

                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#FBF5E8",
                      border: "1px solid #E7D4AB",
                      mb: 3,
                    }}
                  >
                    <Typography
                      color="#70521E"
                      fontSize={13}
                      lineHeight={1.9}
                    >
                      אין צורך בסיסמה קודמת. אם זו הכניסה
                      הראשונה שלכם, תוכלו ליצור סיסמה חדשה
                      באמצעות קוד שיישלח למייל.
                    </Typography>
                  </Box>

                  <TextField
                    label="כתובת המייל שלכם"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(errors.email)}
                    helperText={errors.email}
                    sx={inputStyle}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MailOutline sx={{ color: darkGold }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    sx={{
                      ...goldButtonStyle,
                      py: 1.7,
                    }}
                  >
                    שלחו לי קוד למייל
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => setStep(1)}
                    sx={{ mt: 2, color: "#777" }}
                  >
                    חזרה לכניסה
                  </Button>
                </>
              )}

              {/* ================= VERIFY CODE ================= */}

              {step === 3 && (
                <>
                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      borderRadius: "20px",
                      background: "#F8F0DF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <SecurityOutlined
                      sx={{ fontSize: 34, color: darkGold }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    textAlign="center"
                    mb={1}
                  >
                    אימות כתובת המייל
                  </Typography>

                  <Typography
                    textAlign="center"
                    color="#777"
                    fontSize={13}
                    lineHeight={1.9}
                    mb={3}
                  >
                    קוד חד-פעמי נשלח לכתובת המייל שלכם.
                    הזינו את הקוד שקיבלתם כדי להמשיך.
                  </Typography>

                  <TextField
                    label="קוד אימות"
                    fullWidth
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(e.target.value)
                    }
                    error={Boolean(errors.verificationCode)}
                    helperText={errors.verificationCode}
                    sx={inputStyle}
                    inputProps={{
                      dir: "ltr",
                      style: {
                        textAlign: "center",
                        letterSpacing: 7,
                        fontSize: 22,
                        fontWeight: "bold",
                      },
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleVerifyCode}
                    disabled={loading}
                    sx={{
                      ...goldButtonStyle,
                      py: 1.7,
                    }}
                  >
                    אימות והמשך
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => setStep(2)}
                    sx={{ mt: 2, color: "#777" }}
                  >
                    חזרה
                  </Button>
                </>
              )}

              {/* ================= NEW PASSWORD ================= */}

              {step === 4 && (
                <>
                  <Box
                    sx={{
                      width: 65,
                      height: 65,
                      borderRadius: "20px",
                      background: "#F8F0DF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <LockOutlined
                      sx={{ fontSize: 34, color: darkGold }}
                    />
                  </Box>

                  <Typography
                    variant="h5"
                    fontWeight={800}
                    textAlign="center"
                    mb={1}
                  >
                    יצירת סיסמה אישית
                  </Typography>

                  <Typography
                    textAlign="center"
                    color="#777"
                    fontSize={13}
                    lineHeight={1.9}
                    mb={3}
                  >
                    כתובת המייל אומתה בהצלחה!
                    בחרו סיסמה חדשה שתשמש אתכם בכל כניסה
                    עתידית לאזור האישי.
                  </Typography>

                  <TextField
                    label="סיסמה חדשה"
                    type={newPasswordVisible ? "text" : "password"}
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={Boolean(errors.newPassword)}
                    helperText={errors.newPassword}
                    sx={inputStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setNewPasswordVisible(!newPasswordVisible)
                            }
                          >
                            {newPasswordVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    label="אישור סיסמה חדשה"
                    type={
                      newPasswordConfirmVisible ? "text" : "password"
                    }
                    fullWidth
                    value={newPasswordConfirm}
                    onChange={(e) =>
                      setNewPasswordConfirm(e.target.value)
                    }
                    error={Boolean(errors.newPasswordConfirm)}
                    helperText={errors.newPasswordConfirm}
                    sx={inputStyle}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setNewPasswordConfirmVisible(
                                !newPasswordConfirmVisible
                              )
                            }
                          >
                            {newPasswordConfirmVisible ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{
                      ...goldButtonStyle,
                      py: 1.7,
                    }}
                  >
                    שמירת הסיסמה
                  </Button>

                  <Button
                    fullWidth
                    onClick={() => setStep(1)}
                    sx={{ mt: 2, color: "#777" }}
                  >
                    חזרה לכניסה
                  </Button>
                </>
              )}

              {/* LOADING */}

              {loading && (
                <Box
                  sx={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 9999,
                    backgroundColor: "rgba(0,0,0,0.68)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <Box
                    sx={{
                      background: "#191919",
                      border: `1px solid ${gold}`,
                      borderRadius: 4,
                      p: 4,
                      textAlign: "center",
                    }}
                  >
                    <CircularProgress
                      sx={{ color: gold }}
                      size={48}
                    />

                    <Typography
                      sx={{
                        color: gold,
                        mt: 2,
                        fontSize: 13,
                      }}
                    >
                      אנא המתינו...
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            {/* FOOTER */}

            <Box
              sx={{
                background: "#171717",
                borderTop: `1px solid ${gold}`,
                py: 2,
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  color: gold,
                  fontSize: 12,
                  letterSpacing: 0.5,
                }}
              >
                PREMIUM PERSONAL AREA
              </Typography>

              <Typography
                sx={{
                  color: "#888",
                  fontSize: 11,
                  mt: 0.5,
                }}
              >
                שירות אישי | חוויית משתמש יוקרתית
              </Typography>
            </Box>
          </Paper>
        </Box>
        {/* ================================= */}
        {/* צד ימין - אזור הסבר יוקרתי */}
        {/* ================================= */}

        <Box
          sx={{
            color: "#fff",
            textAlign: { xs: "center", md: "right" },
            order: { xs: 1, md: 1 },
            px: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              border: "1px solid rgba(214,181,109,0.4)",
              borderRadius: "30px",
              px: 2.5,
              py: 1,
              mb: 3,
              background: "rgba(214,181,109,0.06)",
            }}
          >
            <DiamondOutlined
              sx={{ color: gold, fontSize: 19 }}
            />

            <Typography
              sx={{
                color: gold,
                fontSize: 12,
                letterSpacing: 2,
                fontWeight: 600,
              }}
            >
              PREMIUM CUSTOMER EXPERIENCE
            </Typography>
          </Box>

          <Typography
            sx={{
              fontSize: {
                xs: 31,
                sm: 39,
                md: 43,
                lg: 55,
              },
              fontWeight: 800,
              lineHeight: 1.25,
              color: "#fff",
              mb: 2,
            }}
          >
           ההזמנות שלכם.
          </Typography>

          <Typography
            sx={{
              color: "#B9B9B9",
              fontSize: {
                xs: 14,
                md: 17,
              },
              lineHeight: 2,
              maxWidth: 550,
              mx: { xs: "auto", md: 0 },
              mb: 4,
            }}
          >
            ברוכים הבאים לאזור האישי שלכם.
            כאן תוכלו ליהנות מגישה נוחה לפרטי ההזמנה,
            לעקוב אחר המידע האישי שלכם ולנהל את החוויה
            שלכם במקום אחד.
          </Typography>

          {/* הסבר חשוב ללקוחות חדשים */}

          <Box
            sx={{
              background:
                "linear-gradient(145deg, rgba(214,181,109,0.12), rgba(214,181,109,0.035))",
              border: "1px solid rgba(214,181,109,0.45)",
              borderRadius: "20px",
              p: { xs: 2.5, md: 3 },
              mb: 4,
              textAlign: "right",
              boxShadow: "0 15px 45px rgba(0,0,0,0.25)",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              mb={2}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  background: "rgba(214,181,109,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleOutline
                  sx={{ color: gold, fontSize: 25 }}
                />
              </Box>

              <Typography
                sx={{
                  color: gold,
                  fontSize: { xs: 16, md: 19 },
                  fontWeight: 700,
                }}
              >
                ביצעתם הזמנה? כך נכנסים בפעם הראשונה
              </Typography>
            </Box>

            <Typography
              sx={{
                color: "#E1E1E1",
                fontSize: { xs: 13, md: 14 },
                lineHeight: 2,
              }}
            >
              חשוב לדעת: לאחר ביצוע הזמנה באתר לא נוצרת
              עבורכם סיסמה באופן אוטומטי.
              כדי להיכנס לאזור האישי בפעם הראשונה,
              עליכם ליצור סיסמה אישית באמצעות כתובת
              המייל שאיתה ביצעתם את ההזמנה.
            </Typography>

            <Divider
              sx={{
                my: 2,
                borderColor: "rgba(214,181,109,0.25)",
              }}
            />

            {/* שלבי יצירת הסיסמה */}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
              {[
                {
                  number: "01",
                  title: "שם המשתמש שלכם",
                  description:
                    "השתמשו בשם הפרטי כפי שהופיע בפרטי ההזמנה.",
                  icon: <PersonOutline />,
                },
                {
                  number: "02",
                  title: "קבלת קוד למייל",
                  description:
                    'לחצו על "שכחתי סיסמה" והזינו את כתובת המייל שאיתה ביצעתם את ההזמנה.',
                  icon: <MailOutline />,
                },
                {
                  number: "03",
                  title: "יצירת סיסמה אישית",
                  description:
                    "הזינו את הקוד שקיבלתם במייל ובחרו סיסמה אישית לכניסות הבאות.",
                  icon: <LockOutlined />,
                },
              ].map((item) => (
                <Box
                  key={item.number}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 43,
                      height: 43,
                      borderRadius: "13px",
                      background: "rgba(214,181,109,0.12)",
                      border: "1px solid rgba(214,181,109,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: gold,
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography
                      sx={{
                        color: gold,
                        fontSize: 14,
                        fontWeight: 700,
                        mb: 0.4,
                      }}
                    >
                      {item.number} | {item.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#BDBDBD",
                        fontSize: 13,
                        lineHeight: 1.8,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "flex-start" },
              alignItems: "center",
              gap: 1,
              color: "#AFAFAF",
            }}
          >
            <SecurityOutlined
              sx={{ color: gold, fontSize: 20 }}
            />

            <Typography fontSize={12}>
              גישה אישית ומאובטחת לפרטי ההזמנה שלכם
            </Typography>
          </Box>
        </Box>    
      </Box> 
      
   

    </Box>

  

    {/* ================= SNACKBAR ================= */}

    <Snackbar
      open={snackOpen}
      autoHideDuration={6000}
      onClose={handleSnackClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
    >
      <Alert
        onClose={handleSnackClose}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {snackMessage}
      </Alert>
    </Snackbar>
  </Box>
);

};

export default PersonalAreaLogin;
