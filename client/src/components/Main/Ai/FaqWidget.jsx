import { useState, useRef, useEffect } from "react";
import {
  Box,
  Fab,
  Paper,
  TextField,
  IconButton,
  Typography,
  Chip,
  Avatar,
  Zoom,
  Grow,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/ChatBubbleRounded";
import CloseIcon from "@mui/icons-material/CloseRounded";
import SendIcon from "@mui/icons-material/SendRounded";
import PhoneIcon from "@mui/icons-material/PhoneInTalkRounded";
import { faqs, greeting, fallback, PHONE } from "./faqData";

const BRAND = "#b8860b"; // שנה לצבע של האתר שלך
const BRAND_DARK = "#8a6508";

const findAnswer = (text) => {
  const t = text.trim().toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const item of faqs) {
    const score = item.keywords.filter((k) => t.includes(k.toLowerCase())).length;
    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }
  return best ? best.answer : fallback;
};

function TypingDots() {
  return (
    <Box sx={{ display: "flex", gap: 0.5, p: 1.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: "text.disabled",
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
  );
}

export default function FaqWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: greeting }]);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  const ask = (text, directAnswer) => {
    if (!text.trim() || typing) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { from: "bot", text: directAnswer || findAnswer(text) },
      ]);
      setTyping(false);
    }, 700);
  };

  return (
    <>
      <Zoom in={!open}>
        <Fab
          onClick={() => setOpen(true)}
          aria-label="פתח צ'אט"
          sx={{
            position: "fixed",
            bottom: 20,
            left: 20,
            zIndex: 1300,
            color: "#fff",
            background: `linear-gradient(135deg, ${BRAND}, ${BRAND_DARK})`,
            "&:hover": { background: BRAND_DARK },
          }}
        >
          <ChatIcon />
        </Fab>
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
              🌸
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight={700}>קייטרינג הפנינה</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#4ade80" }} />
                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                  מוכנה לעזור
                </Typography>
              </Box>
            </Box>
            <Tooltip title="התקשרו אלינו">
              <IconButton component="a" href={`tel:${PHONE.replace(/-/g, "")}`} sx={{ color: "#fff" }}>
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
                <TypingDots />
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
            {faqs.map((f) => (
              <Chip
                key={f.id}
                label={f.label}
                onClick={() => ask(f.question, f.answer)}
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
              sx={{
                color: "#fff",
                bgcolor: BRAND,
                "&:hover": { bgcolor: BRAND_DARK },
                // החץ מצביע לשמאל בכיוון RTL
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