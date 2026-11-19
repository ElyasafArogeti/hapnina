import { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  Avatar,
  Zoom,
  Grow,
  Tooltip,
  Fade,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToyRounded";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import PhoneIcon from "@mui/icons-material/PhoneInTalkRounded";
import { faqs, greeting, PHONE } from "./faqData";
import { respond, thinkingTime, THINKING_STEPS } from "./faqBrain";

const BRAND = "#b8860b"; // שנה לצבע של האתר שלך
const BRAND_DARK = "#8a6508";

/* ---------- כפתור צף: רובוט מרחף ---------- */
function RobotLauncher({ onClick }) {
  const [hint, setHint] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHint(true), 3000);
    const t2 = setTimeout(() => setHint(false), 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        gap: 1,
        direction: "rtl",
      }}
    >
      <Box
        component="button"
        onClick={onClick}
        aria-label="פתח את עוזרת ה-AI"
        sx={{
          position: "relative",
          width: 68,
          height: 68,
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          color: "#fff",
          background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
          boxShadow: "0 8px 24px rgba(138,101,8,0.45)",
          animation: "floaty 3s ease-in-out infinite",
          display: "grid",
          placeItems: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: `2px solid ${BRAND}`,
            animation: "pulse 2.4s ease-out infinite",
          },
          "&:hover": { transform: "scale(1.07)" },
          "@keyframes floaty": {
            "0%, 100%": { transform: "translateY(0)" },
            "50%": { transform: "translateY(-8px)" },
          },
          "@keyframes pulse": {
            "0%": { transform: "scale(1)", opacity: 0.7 },
            "100%": { transform: "scale(1.5)", opacity: 0 },
          },
        }}
      >
        <SmartToyIcon sx={{ fontSize: 38 }} />
        <Box
          sx={{
            position: "absolute",
            top: -4,
            right: -4,
            bgcolor: "#fff",
            color: BRAND_DARK,
            borderRadius: "50%",
            width: 24,
            height: 24,
            display: "grid",
            placeItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <AutoAwesomeIcon sx={{ fontSize: 15 }} />
        </Box>
      </Box>

      <Fade in={hint}>
        <Paper
          elevation={6}
          onClick={onClick}
          sx={{
            px: 1.8,
            py: 1,
            borderRadius: 3,
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 600,
            color: BRAND_DARK,
            display: { xs: "none", sm: "block" },
          }}
        >
          שלום! אפשר לעזור? 👋
        </Paper>
      </Fade>
    </Box>
  );
}

/* ---------- אנימציית "חושבת" עם שלבים ---------- */
function Thinking({ step }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.8, py: 1.2 }}>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <Box
            key={i}
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: BRAND,
              animation: "blink 1.2s infinite",
              animationDelay: `${i * 0.2}s`,
              "@keyframes blink": {
                "0%, 80%, 100%": { opacity: 0.3, transform: "scale(0.8)" },
                "40%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          />
        ))}
      </Box>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {THINKING_STEPS[step]}
      </Typography>
    </Box>
  );
}

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([{ from: "bot", text: greeting }]);
  const ctxRef = useRef({}); // זיכרון השיחה (על מה דיברנו)
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, step, open]);

  // מחליף את הודעת ה"חושבת" כל ~1 שנייה
  useEffect(() => {
    if (!typing) return;
    setStep(0);
    const id = setInterval(() => setStep((s) => Math.min(s + 1, THINKING_STEPS.length - 1)), 1000);
    return () => clearInterval(id);
  }, [typing]);

  const ask = (text) => {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);

    const result = respond(text, ctxRef.current);
    ctxRef.current = { topic: result.topic, event: result.event || ctxRef.current.event };

    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: result.answer, suggestions: result.suggestions },
      ]);
      setTyping(false);
    }, thinkingTime(result.answer));
  };

  const lastIndex = messages.length - 1;

  return (
    <>
      <Zoom in={!open}>
        <Box>{!open && <RobotLauncher onClick={() => setOpen(true)} />}</Box>
      </Zoom>

      <Grow in={open} style={{ transformOrigin: "bottom left" }}>
        <Paper
          elevation={12}
          dir="rtl"
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20,
            width: { xs: "calc(100vw - 32px)", sm: 370 },
            height: { xs: "75vh", sm: 560 },
            maxHeight: "calc(100vh - 40px)",
            display: open ? "flex" : "none",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            zIndex: 1300,
          }}
        >
          {/* כותרת */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 2,
              color: "#fff",
              background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
            }}
          >
            <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", width: 42, height: 42 }}>
              <SmartToyIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>עוזרת AI · הפנינה</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4ade80" }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  מוכנה לעזור
                </Typography>
              </Box>
            </Box>
            <Tooltip title="התקשרו אלינו">
              <IconButton
                component="a"
                href={`tel:${PHONE.trim().replace(/-/g, "")}`}
                sx={{ color: "#fff" }}
              >
                <PhoneIcon />
              </IconButton>
            </Tooltip>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }} aria-label="סגור">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* הודעות */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "#faf7f2",
              display: "flex",
              flexDirection: "column",
              gap: 1.2,
            }}
          >
            {messages.map((m, i) => {
              const isUser = m.from === "user";
              return (
                <Box
                  key={i}
                  sx={{
                    alignSelf: isUser ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                  }}
                >
                  <Typography
                    component="div"
                    sx={{
                      whiteSpace: "pre-line",
                      fontSize: 14.5,
                      lineHeight: 1.6,
                      px: 1.8,
                      py: 1.2,
                      boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      bgcolor: isUser ? BRAND : "#fff",
                      color: isUser ? "#fff" : "text.primary",
                    }}
                  >
                    {m.text}
                  </Typography>

                  {/* הצעות המשך מהבוט */}
                  {!isUser && i === lastIndex && !typing && m.suggestions?.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.7, mt: 1 }}>
                      {m.suggestions.map((s) => (
                        <Chip
                          key={s}
                          label={s}
                          size="small"
                          onClick={() => ask(s)}
                          sx={{
                            bgcolor: "rgba(184,134,11,0.12)",
                            color: BRAND_DARK,
                            fontWeight: 600,
                            "&:hover": { bgcolor: "rgba(184,134,11,0.25)" },
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              );
            })}
            {typing && (
              <Box
                sx={{
                  alignSelf: "flex-end",
                  bgcolor: "#fff",
                  borderRadius: "18px 18px 18px 4px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                }}
              >
                <Thinking step={step} />
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>

          {/* שאלות מהירות - גלילה אופקית */}
          <Box
            sx={{
              display: "flex",
              gap: 0.8,
              overflowX: "auto",
              px: 1.5,
              py: 1,
              bgcolor: "#fff",
              borderTop: "1px solid #eee",
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            {faqs.filter((f) => f.quick !== false).map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                onClick={() => ask(f.question)}
                variant="outlined"
                sx={{
                  flexShrink: 0,
                  borderColor: BRAND,
                  color: BRAND_DARK,
                  fontWeight: 500,
                  "&:hover": { bgcolor: "rgba(184,134,11,0.1)" },
                }}
              />
            ))}
          </Box>

          {/* שורת כתיבה */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: 1.5, bgcolor: "#fff" }}>
            <TextField
              fullWidth
              size="small"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder="כתבו שאלה..."
              InputProps={{ sx: { borderRadius: 6, bgcolor: "#f4f1ec" } }}
              sx={{ "& fieldset": { border: "none" } }}
            />
            <IconButton
              onClick={() => ask(input)}
              disabled={typing}
              sx={{
                color: "#fff",
                bgcolor: BRAND,
                "&:hover": { bgcolor: BRAND_DARK },
                "&.Mui-disabled": { bgcolor: "#d9cfae", color: "#fff" },
                "& svg": { transform: "scaleX(-1)" },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Grow>
    </>
  );
}