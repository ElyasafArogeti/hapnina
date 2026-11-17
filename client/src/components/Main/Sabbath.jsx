import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Typography, IconButton, TextField, Dialog, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { apiFetch } from "../api";
import NavbarHome from "./NavbarHome";
import Footer from "./Footer";
import defaultDishImage from "../../assets/imgs/imgdifolt.png";

import { dishes } from "./MainCourse";

// ============================================================
// קבועים
// ============================================================
const PRICE_PER_GUEST = 190; // ₪ למנה
const MIN_GUESTS = 50;
const SALADS_LIMIT = 8;
const FRIDAY_LIMITS = { fish: 2, mains: 2, sides: 2 };
const SEUDA3_LIMIT = 2; // כמה תוספות לסעודה שלישית (לשינוי - רק כאן)
const SERVICE_PHONE = " 0795152820 (שלוחה 1)";
const EVENT_TYPE = "שבת חתן "; // אותו ערך כמו בסל הקניות. אפשר לשנות ל"שבת חתן" אם תרצה להבדיל במסד הנתונים

// ---- תוספות בתשלום (מחיר למנה, הלקוח בוחר כמות ידנית) ----
const SCHNITZEL_PRICE = 20; // ₪ למנת שניצל בשבת בבוקר (במקום חמין)
const SALMON_PRICE = 5; // ₪ למנת סלמון בסעודה שלישית

// ---- מנות שלא יוצגו בשלב המנות העיקריות של ליל שבת ----
const EXCLUDED_MAINS = [
  "מעורב ירושלמי + פירה",
  "צלי בקר מספר 5",
  "גוש אסאדו",
  "מוקפץ סיני עם רצועות עוף",
  "קבבונים",
  "כבדים מוקפצים + פירה",
  "מוסקה בשרית",
  "פרגית עוף ממולא",
];
// נרמול טקסט להשוואה: בלי ניקוד, רווחים, גרשיים וסימנים
const normalize = (s) =>
  (s || "")
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[^\u05D0-\u05EAA-Za-z0-9]/g, "")
    .toLowerCase();
const EXCLUDED_MAINS_NORM = EXCLUDED_MAINS.map(normalize);
const isExcludedMain = (dish) => {
  const n = normalize(dish.name);
  return EXCLUDED_MAINS_NORM.some((ex) => n === ex || n.includes(ex));
};

const STEP_IMAGES = {
  intro: "https://res.cloudinary.com/dhkegagjk/image/upload/v1791904848/%D7%AA%D7%9E%D7%95%D7%A0%D7%94_%D7%A9%D7%91%D7%AA_jmcv5t.jpg", // פתיח וסיום
  salads: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794860469/%D7%A1%D7%A2%D7%95%D7%93%D7%AA_%D7%97%D7%92_%D7%90%D7%9C%D7%92%D7%A0%D7%98%D7%99%D7%AA_%D7%91%D7%90%D7%95%D7%9C%D7%9D_%D7%9E%D7%95%D7%90%D7%A8_%D1%81%D0%B2%D0%B5%D1%87%E1%83%94%E1%83%91%E1%83%98%E1%83%97_fzvgg3.png", // סועדים ליד שולחנות, זקן מרים כוס קידוש, חושך בחוץ, נרות שבת בפינה
  friday: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794860062/%D7%A1%D7%A2%D7%95%D7%93%D7%AA_%D7%A9%D7%91%D7%AA_%D7%97%D7%92%D7%99%D7%92%D7%99%D7%AA_%D7%95%D7%9E%D7%A9%D7%A4%D7%97%D7%AA%D7%99%D7%AA_hy90m0.png", // גברים בלבד אוכלים סעודת ליל שבת (משמש את שלושת שלבי ליל שבת)
  morning: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794860677/%D7%A1%D7%A2%D7%95%D7%93%D7%AA_%D7%97%D7%92_%D7%91%D7%90%D7%95%D7%9C%D7%9D_%D7%9E%D7%95%D7%90%D7%A8_cand%D7%9C%E0%AA%BF%E0%AA%B8%E0%AB%8D%E0%AA%9F_dttlr7.png", // אור יום בחוץ, סיר חמין על השולחן, ילדים משחקים ברקע
  seuda3: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794860698/%D7%91%D7%A8%D7%9B%D7%AA_%D7%A0%D7%A8%D7%95%D7%AA_%D7%A1%D7%91%D7%99%D7%91_%D7%A9%D7%95%D7%9C%D7%97%D7%9F_%D7%94%D7%A9%D7%91%D7%AA_fjr0ab.png", // סועדים, נר הבדלה ובקבוק יין ברקע
};

// ---- עיצוב ----
const C = {
  night: "#101B2E",
  nightSoft: "#1A2A45",
  pearl: "#F7F8FA",
  gold: "#B8975A",
  goldLight: "#E3CFA3",
  wine: "#6B1E2E",
  ink: "#1B2433",
  mute: "#6C7587",
  line: "#E3E6EC",
};
const SERIF = `"Frank Ruhl Libre", "David Libre", Georgia, serif`;
const SANS = `"Heebo", "Assistant", Arial, sans-serif`;

// ---- מנות "חמים" לשבת בבוקר (אין להן מחיר, חלק מהחבילה) ----
const HOT_ITEMS = [
  { id: "hot-wheat", name: "  חיטה", details: "הקלאסי של שבת בבוקר", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794904856/%D7%AA%D7%91%D7%A9%D7%99%D7%9C_%D7%97%D7%99%D7%98%D7%94_%D7%96%D7%94%D7%95%D7%91_%D7%91%D7%A6%D7%9C%D7%97%D7%AA_%D7%9E%D7%A2%D7%95%D7%98%D7%A8%D7%AA_fjq8up.png" },
  { id: "hot-beans", name: "שעועית", details: "חמין בלי שעועית אך אפשר", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794905318/%D7%AA%D7%91%D7%A9%D7%99%D7%9C_%D7%A9%D7%A2%D7%95%D7%A2%D7%99%D7%AA_%D7%A2%D7%A9%D7%99%D7%A8_%D7%91%D7%A7%D7%A2%D7%A8%D7%AA_%D7%A4%D7%95%D7%A8%D7%A6%D7%9C%D7%9F_la3mkb.png" },
  { id: "hot-eggs", name: "ביצים", details: "חומות וטעימות ", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794905318/%D7%A7%D7%A2%D7%A8%D7%94_%D7%9E%D7%A2%D7%95%D7%98%D7%A8%D7%AA_%D7%A2%D7%9D_%D7%91%D7%99%D7%A6%D7%99%D7%9D_%D7%97%D7%95%D7%9E%D7%95%D7%AA_tejfh5.png" },
  { id: "hot-rice", name: "אורז", details: "בצד הולך טוב", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902793/%D7%90%D7%95%D7%A8%D7%96_%D7%A2%D7%9D_%D7%A9%D7%A7%D7%93%D7%99%D7%9D_%D7%95%D7%A6%D7%99%D7%9E%D7%95%D7%A7%D7%99%D7%9D_ivmmhz.webp" },
];

// ---- תוספות בתשלום: שניצל בשבת בבוקר (לאלה שלא אוכלים חמין) ----
const SCHNITZEL_ITEM = {
  name: "מנת שניצל",
  details: "לאלה שלא אוכלים חמין: שניצל במקום",
  image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794129100/%D7%A9%D7%A0%D7%99%D7%A6%D7%9C_%D7%A2%D7%95%D7%A3_w7w77j.jpg",
};

// ---- תוספות בתשלום: סלמון בסעודה שלישית ----
const SALMON_ITEM = {
  name: "מנת סלמון",
  details: "סלמון לסעודה שלישית",
  image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1793902184/%D7%A4%D7%99%D7%9C%D7%94_%D7%A1%D7%9C%D7%9E%D7%95%D7%9F_%D7%91%D7%A8%D7%95%D7%98%D7%91_%D7%90%D7%93%D7%9D_qujkul.webp", // אפשר להדביק כאן קישור לתמונת סלמון. אם ריק תוצג תמונת ברירת המחדל
};

// ---- תוספות לסעודה שלישית (אפשר לערוך חופשי) ----
const byId = (id) => dishes.find((d) => d.id === id);
const SEUDA3_ITEMS = [
  { id: "s3-fried-fish", name: "דג מטוגן", details: "פריך וטרי", image: "https://res.cloudinary.com/dhkegagjk/image/upload/v1794909204/%D7%A4%D7%99%D7%9C%D7%94_%D7%93%D7%92_%D7%9E%D7%98%D7%95%D7%92%D7%9F_%D7%A2%D7%9D_%D7%9C%D7%99%D7%9E%D7%95%D7%9F_%D7%95%D7%A4%D7%98%D7%A8%D7%95%D7%96%D7%99%D7%9C%D7%99%D7%94_shaecw.png" },
  byId(4),
  byId(1),
].filter(Boolean);

// ---- השלבים. ליל שבת מפוצל לשלושה שלבים נפרדים ----
const STEPS = [
  { key: "intro", group: null },
  { key: "salads", group: "salads", next: "המשך לליל שבת" },
  { key: "fish", group: "friday", sub: "דגים", next: "המשך למנות העיקריות" },
  { key: "mains", group: "friday", sub: "מנות עיקריות", next: "המשך לתוספות" },
  { key: "sides", group: "friday", sub: "תוספות", next: "המשך לשבת בבוקר" },
  { key: "morning", group: "morning", next: "המשך לסעודה שלישית" },
  { key: "seuda3", group: "seuda3", next: "המשך לסיכום" },
  { key: "summary", group: "summary" },
];
const LAST = STEPS.length - 1;

// הסרגל העליון מציג את כל המסלול (5 תחנות)
const GROUPS = [
  { key: "salads", label: "סלטים" },
  { key: "friday", label: "ליל שבת" },
  { key: "morning", label: "שבת בבוקר" },
  { key: "seuda3", label: "סעודה שלישית" },
  { key: "summary", label: "סיכום" },
];

// ============================================================
// עזרים
// ============================================================
const imgSrc = (item) => item.image?.trim() || defaultDishImage;

const localDateStr = (d) => {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

function Hero({ image, title, subtitle, tall = false }) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: tall ? 420 : 250, md: tall ? 560 : 340 },
        background: image
          ? `url(${image}) center/cover no-repeat`
          : `linear-gradient(160deg, ${C.night}, ${C.nightSoft} 60%, #2a2140)`,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to top, ${C.night} 0%, rgba(16,27,46,0.55) 38%, rgba(16,27,46,0.05) 100%)`,
        }}
      />
      <Box sx={{ position: "relative", textAlign: "center", px: 2, pb: { xs: 3, md: 5 }, maxWidth: 820 }}>
        <Typography
          sx={{
            fontFamily: SERIF,
            fontWeight: 700,
            color: "#fff",
            fontSize: { xs: tall ? 54 : 30, md: tall ? 84 : 46 },
            lineHeight: 1.15,
            textShadow: "0 2px 18px rgba(0,0,0,0.45)",
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            sx={{ mt: 1, fontFamily: SANS, color: C.goldLight, fontSize: { xs: 15, md: 20 }, lineHeight: 1.7 }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}

// כרטיס בחירה: שניים בשורה גם בטלפון
function PickCard({ item, selected, locked, onToggle }) {
  const hasImage = !!item.image?.trim();
  return (
    <Box
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      sx={{
        position: "relative",
        height: "100%",
        bgcolor: "#fff",
        borderRadius: "14px",
        overflow: "hidden",
        cursor: locked && !selected ? "not-allowed" : "pointer",
        opacity: locked && !selected ? 0.45 : 1,
        border: `2px solid ${selected ? C.gold : C.line}`,
        boxShadow: selected ? `0 0 0 3px ${C.goldLight}66` : "none",
        transition: "border-color .2s, box-shadow .2s, opacity .2s",
        display: "flex",
        flexDirection: "column",
        "&:focus-visible": { outline: `3px solid ${C.gold}`, outlineOffset: 2 },
      }}
    >
      <Box sx={{ position: "relative", bgcolor: "#fff" }}>
        <Box
          component="img"
          src={imgSrc(item)}
          alt={item.name}
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== defaultDishImage) {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultDishImage;
            }
          }}
          sx={{
            display: "block",
            width: "100%",
            height: { xs: 112, sm: 160, md: 180 },
            objectFit: hasImage ? "cover" : "contain",
            p: hasImage ? 0 : 2,
            boxSizing: "border-box",
          }}
        />
        {selected && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              width: 28,
              height: 28,
              borderRadius: "50%",
              bgcolor: C.gold,
              color: C.night,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckIcon sx={{ fontSize: 18 }} />
          </Box>
        )}
      </Box>
      <Box sx={{ p: { xs: 1, sm: 1.5 }, textAlign: "center", flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: { xs: 13.5, sm: 16 },
            lineHeight: 1.35,
            color: C.ink,
            overflowWrap: "anywhere",
          }}
        >
          {item.name}
        </Typography>
        {item.details ? (
          <Typography sx={{ mt: 0.3, fontFamily: SANS, fontSize: { xs: 11.5, sm: 13 }, color: C.mute }}>
            {item.details}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
}

// כרטיס תוספת בתשלום עם בחירת כמות ידנית (₪ למנה)
function ExtraQtyCard({ item, price, qty, max, onChange }) {
  const set = (v) => onChange(Math.max(0, Math.min(max, Number.isNaN(v) ? 0 : v)));
  const active = qty > 0;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.5, sm: 2.5 },
        flexWrap: "wrap",
        bgcolor: "#fff",
        borderRadius: "14px",
        border: `2px solid ${active ? C.gold : C.line}`,
        boxShadow: active ? `0 0 0 3px ${C.goldLight}66` : "none",
        transition: "border-color .2s, box-shadow .2s",
        p: { xs: 1.2, sm: 1.8 },
      }}
    >
      <Box
        component="img"
        src={imgSrc(item)}
        alt={item.name}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.src !== defaultDishImage) {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultDishImage;
          }
        }}
        sx={{
          width: { xs: 84, sm: 120 },
          height: { xs: 84, sm: 120 },
          borderRadius: "12px",
          objectFit: item.image?.trim() ? "cover" : "contain",
          bgcolor: "#fff",
          flexShrink: 0,
        }}
      />
      <Box sx={{ flex: "1 1 160px", minWidth: 0 }}>
        <Typography sx={{ fontFamily: SANS, fontWeight: 700, fontSize: { xs: 16, sm: 19 }, color: C.ink }}>
          {item.name}
        </Typography>
        {item.details && (
          <Typography sx={{ fontFamily: SANS, fontSize: { xs: 12.5, sm: 14 }, color: C.mute, mt: 0.3 }}>
            {item.details}
          </Typography>
        )}
        <Box
          sx={{
            display: "inline-block",
            mt: 0.8,
            px: 1.4,
            py: 0.3,
            borderRadius: 99,
            bgcolor: C.pearl,
            border: `1px solid ${C.goldLight}`,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 13.5,
            color: C.night,
          }}
        >
          תוספת ₪{price} למנה
        </Box>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mx: "auto" }}>
        <IconButton
          aria-label={`הפחתת ${item.name}`}
          onClick={() => set(qty - 1)}
          disabled={qty <= 0}
          sx={{ color: C.night, border: `1px solid ${C.gold}` }}
        >
          <RemoveIcon />
        </IconButton>
        <Box
          component="input"
          type="number"
          inputMode="numeric"
          aria-label={`כמות ${item.name}`}
          value={qty}
          onChange={(e) => set(parseInt(e.target.value.replace(/\D/g, ""), 10))}
          onFocus={(e) => e.target.select()}
          sx={{
            width: 70,
            textAlign: "center",
            border: "none",
            borderBottom: `2px solid ${C.gold}`,
            outline: "none",
            background: "transparent",
            color: C.night,
            fontFamily: SERIF,
            fontWeight: 700,
            fontSize: 26,
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
          }}
        />
        <IconButton
          aria-label={`הוספת ${item.name}`}
          onClick={() => set(qty + 1)}
          disabled={qty >= max}
          sx={{ color: C.night, border: `1px solid ${C.gold}` }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      {active && (
        <Typography
          sx={{ width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 700, color: C.wine, fontSize: 14 }}
        >
          {qty} מנות × ₪{price} = ₪{(qty * price).toLocaleString("he-IL")}
        </Typography>
      )}
    </Box>
  );
}

// מונה בחירה "נבחרו 3 מתוך 8"
function Counter({ label, count, limit }) {
  const done = limit ? count === limit : count > 0;
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5, mt: 3 }}>
      <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: C.night }}>
        {label}
      </Typography>
      <Box
        sx={{
          px: 1.6,
          py: 0.5,
          borderRadius: 99,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 14,
          bgcolor: done ? C.night : "transparent",
          color: done ? C.goldLight : C.mute,
          border: `1px solid ${done ? C.night : C.line}`,
          transition: "all .2s",
        }}
      >
        {limit ? `${count} מתוך ${limit}` : `נבחרו ${count}`}
      </Box>
    </Box>
  );
}

function PickGrid({ items, picked, limit, onToggle }) {
  const full = limit ? picked.length >= limit : false;
  return (
    <Grid container spacing={{ xs: 1.2, sm: 2.2 }}>
      {items.map((item) => {
        const selected = picked.includes(item.id);
        return (
          <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}>
            <PickCard item={item} selected={selected} locked={full} onToggle={() => onToggle(item.id)} />
          </Grid>
        );
      })}
    </Grid>
  );
}

// רשימה קטנה של מה שנבחר
function ChosenList({ title, names }) {
  return (
    <Box sx={{ bgcolor: "#fff", border: `1px solid ${C.line}`, borderRadius: "14px", p: { xs: 2, md: 3 }, mb: 3 }}>
      <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: C.night, mb: 1.2 }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {names.length === 0 ? (
          <Typography sx={{ fontFamily: SANS, color: C.mute, fontSize: 14 }}>לא נבחרו מנות</Typography>
        ) : (
          names.map((n) => (
            <Box
              key={n}
              sx={{
                px: 1.4,
                py: 0.5,
                borderRadius: 99,
                bgcolor: C.pearl,
                border: `1px solid ${C.goldLight}`,
                fontFamily: SANS,
                fontSize: 13.5,
                color: C.ink,
              }}
            >
              {n}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}

// סרגל המסלול: כל התחנות, אפשר לקפוץ לכל תחנה שכבר הגעתם אליה (ולחזור למקום שבו עצרתם)
function JourneyBar({ step, maxStep, onJump, total }) {
  const current = STEPS[step];
  const gi = GROUPS.findIndex((g) => g.key === current.group);
  const friday = STEPS.filter((s) => s.group === "friday");
  const subIndex = friday.findIndex((s) => s.key === current.key);

  return (
    <Box
      sx={{
        position: "sticky",
        top: 50,
        zIndex: 50,
        bgcolor: C.night,
        borderBottom: `1px solid ${C.nightSoft}`,
        px: { xs: 1, sm: 2 },
        pt: 1,
        pb: 1,
      }}
    >
      <Box sx={{ display: "flex", maxWidth: 760, mx: "auto", gap: { xs: 0.6, sm: 1.2 } }}>
        {GROUPS.map((g, i) => {
          const active = i === gi;
          const done = i < gi;
          const firstStepIndex = STEPS.findIndex((s) => s.group === g.key);
          const lastStepIndex = STEPS.map((s) => s.group).lastIndexOf(g.key);
          // אפשר ללחוץ על כל תחנה שכבר הגענו אליה (גם אם היא אחרי המקום הנוכחי)
          const reachable = !active && firstStepIndex <= maxStep;
          // קופצים לשלב האחרון שהגענו אליו בתוך התחנה (למשל ליל שבת -> תוספות)
          const target = Math.min(maxStep, lastStepIndex);
          const visited = firstStepIndex <= maxStep;
          return (
            <Box
              key={g.key}
              role="button"
              tabIndex={reachable ? 0 : -1}
              aria-current={active ? "step" : undefined}
              aria-label={reachable ? `מעבר לשלב ${g.label}` : g.label}
              onClick={() => reachable && onJump(target)}
              onKeyDown={(e) => e.key === "Enter" && reachable && onJump(target)}
              sx={{ flex: 1, minWidth: 0, textAlign: "center", cursor: reachable ? "pointer" : "default" }}
            >
              <Box
                sx={{
                  height: 4,
                  borderRadius: 99,
                  bgcolor: active ? C.gold : visited ? C.goldLight : "#33435f",
                  transition: "background-color .3s",
                }}
              />
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.4, mt: 0.7 }}>
                {visited && !active && <CheckIcon sx={{ fontSize: 12, color: C.goldLight }} />}
                <Typography
                  sx={{
                    fontFamily: SANS,
                    fontSize: { xs: 10.5, sm: 13 },
                    fontWeight: active ? 800 : 500,
                    lineHeight: 1.25,
                    color: active ? "#fff" : visited ? C.goldLight : "#8f9bb3",
                  }}
                >
                  {g.label}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* תתי-שלבים של ליל שבת */}
      {current.group === "friday" && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 0.8, mt: 0.9 }}>
          {STEPS.map((s, i) => {
            if (s.group !== "friday") return null;
            const isCur = i === step;
            const canGo = !isCur && i <= maxStep;
            return (
              <Box
                key={s.key}
                role="button"
                tabIndex={canGo ? 0 : -1}
                onClick={() => canGo && onJump(i)}
                onKeyDown={(e) => e.key === "Enter" && canGo && onJump(i)}
                sx={{
                  px: 1.3,
                  py: 0.25,
                  borderRadius: 99,
                  fontFamily: SANS,
                  fontSize: { xs: 11.5, sm: 12.5 },
                  fontWeight: isCur ? 800 : 500,
                  color: isCur ? C.night : canGo ? C.goldLight : "#8f9bb3",
                  bgcolor: isCur ? C.goldLight : "transparent",
                  border: `1px solid ${isCur ? C.goldLight : canGo ? C.gold : "#33435f"}`,
                  cursor: canGo ? "pointer" : "default",
                }}
              >
                {s.sub}
              </Box>
            );
          })}
        </Box>
      )}

      <Typography sx={{ textAlign: "center", mt: 0.8, fontFamily: SANS, fontSize: { xs: 12, sm: 13 }, color: C.goldLight }}>
        שלב {gi + 1} מתוך {GROUPS.length}: {GROUPS[gi].label}
        {current.sub ? ` · ${current.sub} (${subIndex + 1} מתוך ${friday.length})` : ""}
        {" · "}
        <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
          סה״כ כרגע ₪{total.toLocaleString("he-IL")}
        </Box>
      </Typography>
    </Box>
  );
}

// קונפטי זהב ושחור שמתפוצץ מאמצע הכרטיס
const CONFETTI_COLORS = ["#D4AF37", "#B8975A", "#E3CFA3", "#111111", "#000000", "#F3E3B3"];
function ConfettiBurst() {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const pieces = useMemo(
    () =>
      Array.from({ length: 100 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 110 + Math.random() * 280;
        const round = Math.random() > 0.6;
        const size = 6 + Math.random() * 9;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist * 0.8 - 40,
          fall: 160 + Math.random() * 240,
          rot: (Math.random() - 0.5) * 900,
          w: size,
          h: round ? size : size * 0.45,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          round,
          delay: Math.random() * 0.2,
          dur: 1.8 + Math.random() * 1.4,
        };
      }),
    []
  );
  if (reduce) return null;
  return (
    <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
      <Box sx={{ position: "absolute", top: "36%", left: "50%" }}>
        {pieces.map((p) => (
          <motion.span
            key={p.id}
            style={{
              position: "absolute",
              display: "block",
              width: p.w,
              height: p.h,
              background: p.color,
              borderRadius: p.round ? "50%" : 2,
            }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.2 }}
            animate={{
              x: [0, p.dx, p.dx * 1.08],
              y: [0, p.dy, p.dy + p.fall],
              opacity: [1, 1, 0],
              rotate: p.rot,
              scale: [0.2, 1, 1],
            }}
            transition={{ duration: p.dur, delay: p.delay, ease: "easeOut", times: [0, 0.35, 1] }}
          />
        ))}
      </Box>
    </Box>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": { bgcolor: "#fff", borderRadius: "12px", fontFamily: SANS },
  "& .MuiInputLabel-root": { fontFamily: SANS },
  "& .MuiOutlinedInput-root.Mui-focused fieldset": { borderColor: C.gold },
  "& .MuiInputLabel-root.Mui-focused": { color: C.wine },
};

function Body({ children }) {
  return <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 1.5, sm: 3 }, pb: 2 }}>{children}</Box>;
}

// ============================================================
// העמוד
// ============================================================
export default function Sabbath() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0); // השלב הכי רחוק שהגענו אליו
  const [sel, setSel] = useState({ salads: [], fish: [], mains: [], sides: [], hot: [], seuda3: [] });
  const [extras, setExtras] = useState({ schnitzel: 0, salmon: 0 }); // כמויות של תוספות בתשלום
  const [guests, setGuests] = useState(String(MIN_GUESTS));
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "", address: "" });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const guestsNum = parseInt(guests, 10) || 0;
  const guestsEff = Math.max(guestsNum, MIN_GUESTS);

  // פונטים
  useEffect(() => {
    if (document.getElementById("sabbath-fonts")) return;
    const link = document.createElement("link");
    link.id = "sabbath-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@500;700;900&family=Heebo:wght@400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  // גלילה לראש בכל מעבר שלב + עדכון השלב הכי רחוק שהגענו אליו
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setMaxStep((m) => Math.max(m, step));
  }, [step]);

  // ---- נתונים מהתפריט ----
  const saladItems = useMemo(() => dishes.filter((d) => d.category === "סלטים"), []);
  const fishItems = useMemo(() => dishes.filter((d) => d.category === "דגים"), []);
  // מנות עיקריות: בשרים ועופות, בלי המנות שהוסרו (EXCLUDED_MAINS)
  const mainItems = useMemo(
    () => dishes.filter((d) => (d.category === "בשרים" || d.category === "עופות") && !isExcludedMain(d)),
    []
  );
  const sideItems = useMemo(() => dishes.filter((d) => d.category === "תוספות"), []);

  const toggle = (group, id, limit) =>
    setSel((prev) => {
      const list = prev[group];
      if (list.includes(id)) return { ...prev, [group]: list.filter((x) => x !== id) };
      if (limit && list.length >= limit) return prev;
      return { ...prev, [group]: [...list, id] };
    });

  const namesOf = (items, ids) => items.filter((i) => ids.includes(i.id)).map((i) => i.name);
  const saladNames = namesOf(saladItems, sel.salads);
  const fishNames = namesOf(fishItems, sel.fish);
  const mainNames = namesOf(mainItems, sel.mains);
  const sideNames = namesOf(sideItems, sel.sides);
  const hotNames = namesOf(HOT_ITEMS, sel.hot);
  const seuda3Names = namesOf(SEUDA3_ITEMS, sel.seuda3);

  const stepKey = STEPS[step].key;
  const isIntro = step === 0;
  const isSummary = step === LAST;

  // האם שלב מסוים חסר בחירות (מחזיר הודעה, או "" אם הכול תקין)
  const stepIncomplete = (key) => {
    if (key === "salads" && sel.salads.length !== SALADS_LIMIT)
      return `נא לבחור ${SALADS_LIMIT} סלטים (נבחרו ${sel.salads.length})`;
    if (key === "fish" && sel.fish.length !== FRIDAY_LIMITS.fish) return `נא לבחור ${FRIDAY_LIMITS.fish} דגים`;
    if (key === "mains" && sel.mains.length !== FRIDAY_LIMITS.mains)
      return `נא לבחור ${FRIDAY_LIMITS.mains} מנות עיקריות`;
    if (key === "sides" && sel.sides.length !== FRIDAY_LIMITS.sides)
      return `נא לבחור ${FRIDAY_LIMITS.sides} תוספות`;
    return "";
  };

  // האם אפשר להמשיך מהשלב הנוכחי
  const blocked = stepIncomplete(stepKey);

  const next = () => step < LAST && !blocked && setStep(step + 1);
  const back = () => step > 0 && setStep(step - 1);

  // קפיצה מהסרגל. קפיצה אחורה תמיד חופשית.
  // קפיצה קדימה עוצרת בשלב הראשון שחסרות בו בחירות (למשל אם הורדת סלט וחזרת קדימה)
  const goTo = (target) => {
    if (target > step) {
      for (let i = 0; i < target; i++) {
        if (stepIncomplete(STEPS[i].key)) {
          setStep(i);
          return;
        }
      }
    }
    setStep(target);
  };

  // ---- חישוב מחיר: מחיר בסיס לכל הסועדים + תוספות בתשלום לפי כמות ידנית ----
  const schnitzelQty = Math.min(extras.schnitzel, guestsEff);
  const salmonQty = Math.min(extras.salmon, guestsEff);
  const baseTotal = PRICE_PER_GUEST * guestsEff;
  const schnitzelTotal = schnitzelQty * SCHNITZEL_PRICE;
  const salmonTotal = salmonQty * SALMON_PRICE;
  const total = baseTotal + schnitzelTotal + salmonTotal;

  const extraNames = [
    ...(schnitzelQty > 0 ? [`${SCHNITZEL_ITEM.name} × ${schnitzelQty} (₪${schnitzelTotal.toLocaleString("he-IL")})`] : []),
    ...(salmonQty > 0 ? [`${SALMON_ITEM.name} × ${salmonQty} (₪${salmonTotal.toLocaleString("he-IL")})`] : []),
  ];

  // ---- בדיקת תקינות לכל השדות ----
  const validate = () => {
    const e = {};
    const name = form.name.trim();
    if (name.length < 2) e.name = "נא להזין שם מלא";
    else if (!/^[A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\s'"׳״.\-]*$/.test(name))
      e.name = "השם יכול להכיל אותיות בלבד";

    const phone = form.phone.replace(/[\s\-()]/g, "").replace(/^\+972/, "0");
    if (!/^0(5\d{8}|7\d{8}|[23489]\d{7})$/.test(phone)) e.phone = "נא להזין מספר טלפון ישראלי תקין";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = "נא להזין כתובת אימייל תקינה";

    if (!form.date) e.date = "נא לבחור את תאריך השבת";
    else {
      const d = new Date(`${form.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (Number.isNaN(d.getTime()) || d <= today) e.date = "נא לבחור תאריך עתידי";
      else if (d.getDay() !== 6) e.date = "התאריך חייב להיות יום שבת";
    }

    if (form.address.trim().length < 5) e.address = "נא להזין כתובת מלאה (עיר ורחוב)";
    if (guestsNum < MIN_GUESTS) e.guests = `מינימום ${MIN_GUESTS} סועדים`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const setField = (key, value) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // לחיצה על "שליחת הזמנה": בדיקה ואז דיאלוג אישור
  const handleSubmitClick = () => {
    setErrorMessage("");
    // הגנה: אם נשאר שלב לא שלם (אחרי קפיצות וחזרות), חוזרים אליו
    for (let i = 1; i < LAST; i++) {
      if (stepIncomplete(STEPS[i].key)) {
        setStep(i);
        return;
      }
    }
    if (!validate()) {
      setErrorMessage("יש שדות שצריך לתקן");
      return;
    }
    setConfirmOpen(true);
  };

  // סיכום הזמנה בפורמט שהשרת מצפה לו: אובייקט לפי קטגוריות, ובכל קטגוריה מערך של { dish_name }
  // המפתחות: salads / first_courses / main_courses / side_dishes (כמו kitchenCategory בסל הקניות)
  const createOrderSummary = () => {
    const mk = (name, meal) => ({
      dish_name: meal ? `${name} (${meal})` : name,
    });
    return {
      salads: saladNames.map((n) => mk(n, "")),
      first_courses: fishNames.map((n) => mk(n, "ליל שבת")),
      main_courses: mainNames.map((n) => mk(n, "ליל שבת")),
      side_dishes: [
        ...sideNames.map((n) => mk(n, "ליל שבת")),
        ...hotNames.map((n) => mk(n, "שבת בבוקר")),
        ...seuda3Names.map((n) => mk(n, "סעודה שלישית")),
        // תוספות בתשלום: הכמות והמחיר נכנסים לשם המנה כדי שיופיעו בהזמנה
        ...(schnitzelQty > 0
          ? [mk(`${SCHNITZEL_ITEM.name} × ${schnitzelQty} (תוספת ₪${SCHNITZEL_PRICE} למנה)`, "שבת בבוקר")]
          : []),
        ...(salmonQty > 0
          ? [mk(`${SALMON_ITEM.name} × ${salmonQty} (תוספת ₪${SALMON_PRICE} למנה)`, "סעודה שלישית")]
          : []),
      ],
    };
  };

  // ---- שליחת ההזמנה לשרת (אותו נתיב ואותם שדות כמו בסל הקניות) ----
  const handleFinalSubmit = async () => {
    setErrorMessage("");
    if (!validate()) {
      setConfirmOpen(false);
      return;
    }
    setSending(true);

    try {
      const phone = form.phone.replace(/[\s\-()]/g, "").replace(/^\+972/, "0");

      const response = await apiFetch("/api/addOrdersOnline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: form.name.trim(),
          userPhone: phone,
          guestCount: guestsEff,
          eventDate: form.date,
          orderMenu: createOrderSummary(),
          totalPrice: Number(total.toFixed(2)),
          shippingDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          email: form.email.trim(),
          event_location: form.address.trim(),
          address: form.address.trim(),
          shippingCost: 0,
          serviceCost: 0,
          toolsType: "",
          eventType: EVENT_TYPE,
        }),
      });

      setSending(false);
      setConfirmOpen(false);

      if (response.message === "נשלח בהצלחה") {
        setSuccessOpen(true);
      } else {
        setErrorMessage(response.message || "אירעה שגיאה בשליחת ההזמנה");
      }
    } catch (error) {
      console.error("שגיאה בשמירת ההזמנה:", error);
      setSending(false);
      setConfirmOpen(false);
      setErrorMessage("אירעה שגיאה בשליחת ההזמנה");
    }
  };

  // ============================================================
  // תוכן כל שלב
  // ============================================================
  const renderStep = () => {
    switch (stepKey) {
      case "salads":
        return (
          <>
            <Hero image={STEP_IMAGES.salads} title="בחירת הסלטים" subtitle="שמונה סלטים שילוו אתכם לאורך כל השבת" />
            <Body>
              <Counter label="הסלטים שלכם" count={sel.salads.length} limit={SALADS_LIMIT} />
              <PickGrid
                items={saladItems}
                picked={sel.salads}
                limit={SALADS_LIMIT}
                onToggle={(id) => toggle("salads", id, SALADS_LIMIT)}
              />
            </Body>
          </>
        );

      case "fish":
        return (
          <>
            <Hero image={STEP_IMAGES.friday} title="ליל שבת: הדגים" subtitle="בחרו שני דגים לפתיחת הסעודה" />
            <Body>
              <Counter label="דגים" count={sel.fish.length} limit={FRIDAY_LIMITS.fish} />
              <PickGrid
                items={fishItems}
                picked={sel.fish}
                limit={FRIDAY_LIMITS.fish}
                onToggle={(id) => toggle("fish", id, FRIDAY_LIMITS.fish)}
              />
            </Body>
          </>
        );

      case "mains":
        return (
          <>
            <Hero image={STEP_IMAGES.friday} title="ליל שבת: המנות העיקריות" subtitle="בחרו שתי מנות עיקריות" />
            <Body>
              <Counter label="מנות עיקריות" count={sel.mains.length} limit={FRIDAY_LIMITS.mains} />
              <PickGrid
                items={mainItems}
                picked={sel.mains}
                limit={FRIDAY_LIMITS.mains}
                onToggle={(id) => toggle("mains", id, FRIDAY_LIMITS.mains)}
              />
            </Body>
          </>
        );

      case "sides":
        return (
          <>
            <Hero image={STEP_IMAGES.friday} title="ליל שבת: התוספות" subtitle="בחרו שתי תוספות שילוו את המנות העיקריות" />
            <Body>
              <Counter label="תוספות" count={sel.sides.length} limit={FRIDAY_LIMITS.sides} />
              <PickGrid
                items={sideItems}
                picked={sel.sides}
                limit={FRIDAY_LIMITS.sides}
                onToggle={(id) => toggle("sides", id, FRIDAY_LIMITS.sides)}
              />
            </Body>
          </>
        );

      case "morning":
        return (
          <>
            <Hero
              image={STEP_IMAGES.morning}
              title="סעודת שבת בבוקר"
              subtitle="השולחן מלא, החמין על הפלטה, והריח מרחף באויר"
            />
            <Body>
              <Typography sx={{ fontFamily: SANS, color: C.ink, lineHeight: 1.9, fontSize: { xs: 15, md: 17 }, mt: 3 }}>
             <strong>   בבוקר אתם מקבלים סיר חמין מרוקאי בשרי, משובח וטעים.</strong> 
              </Typography>
              <Typography sx={{ fontFamily: SANS, color: C.ink, lineHeight: 1.9, fontSize: { xs: 15, md: 17 }, mt: 3 }}>
                {SALADS_LIMIT}  הסלטים שבחרתם מלווים אתכם בכל סעודות השבת.
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <ChosenList title={`הסלטים שבחרתם לכל הסעודות (${saladNames.length})`} names={saladNames} />
              </Box>
              <Counter label="מה תרצו להוסיף בצד החמין ?" count={sel.hot.length} />
              <PickGrid items={HOT_ITEMS} picked={sel.hot} onToggle={(id) => toggle("hot", id)} />

              {/* תוספת בתשלום: שניצל לאלה שלא אוכלים חמין */}
              <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: C.night, mt: 4, mb: 0.5 }}>
                לא כולם אוכלים חמין?
              </Typography>
              <Typography sx={{ fontFamily: SANS, color: C.mute, fontSize: { xs: 14, md: 15.5 }, mb: 1.5 }}>
                אפשר להוסיף מנות שניצל לכמה סועדים שתרצו, בתוספת ₪{SCHNITZEL_PRICE} למנה. זה לא משפיע על שאר הסועדים.
              </Typography>
              <ExtraQtyCard
                item={SCHNITZEL_ITEM}
                price={SCHNITZEL_PRICE}
                qty={schnitzelQty}
                max={guestsEff}
                onChange={(v) => setExtras((x) => ({ ...x, schnitzel: v }))}
              />
            </Body>
          </>
        );

      case "seuda3":
        return (
          <>
            <Hero
              image={STEP_IMAGES.seuda3}
              title="סעודה שלישית"
              subtitle="סעודה שקטה ליד נר ההבדלה, לפני שהשבת יוצאת"
            />
            <Body>
              <Typography sx={{ fontFamily: SANS, color: C.ink, lineHeight: 1.9, fontSize: { xs: 15, md: 17 }, mt: 3 }}>
                גם בסעודה השלישית מחכים לכם {SALADS_LIMIT} הסלטים שבחרתם. אפשר להוסיף עד {SEUDA3_LIMIT} תוספות: דג
                מטוגן, ועוד.
              </Typography>
              <Box sx={{ mt: 2 }}>
                <ChosenList title={`הסלטים שבחרתם (${saladNames.length})`} names={saladNames} />
              </Box>
              <Counter label="תוספות לסעודה שלישית" count={sel.seuda3.length} limit={SEUDA3_LIMIT} />
              <PickGrid
                items={SEUDA3_ITEMS}
                picked={sel.seuda3}
                limit={SEUDA3_LIMIT}
                onToggle={(id) => toggle("seuda3", id, SEUDA3_LIMIT)}
              />

              {/* תוספת בתשלום: סלמון */}
              <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 22, md: 28 }, color: C.night, mt: 4, mb: 0.5 }}>
                רוצים להעלות רמה? סלמון
              </Typography>
              <Typography sx={{ fontFamily: SANS, color: C.mute, fontSize: { xs: 14, md: 15.5 }, mb: 1.5 }}>
                אפשר להוסיף מנות סלמון לכמה סועדים שתרצו, בתוספת ₪{SALMON_PRICE} למנה.
              </Typography>
              <ExtraQtyCard
                item={SALMON_ITEM}
                price={SALMON_PRICE}
                qty={salmonQty}
                max={guestsEff}
                onChange={(v) => setExtras((x) => ({ ...x, salmon: v }))}
              />
            </Body>
          </>
        );

      case "summary":
        return (
          <>
            <Hero image={STEP_IMAGES.intro} title="סיכום ההזמנה" subtitle="בדקו שהכול כמו שחלמתם, ומשלימים פרטים" />
            <Body>
              <Box sx={{ mt: 3 }}>
                <ChosenList title="סלטים (כל השבת)" names={saladNames} />
                <ChosenList title="ליל שבת - דגים" names={fishNames} />
                <ChosenList title="ליל שבת - מנות עיקריות" names={mainNames} />
                <ChosenList title="ליל שבת - תוספות" names={sideNames} />
                <ChosenList title="שבת בבוקר - חמין" names={hotNames} />
                <ChosenList title="סעודה שלישית" names={seuda3Names} />
                {extraNames.length > 0 && <ChosenList title="תוספות בתשלום" names={extraNames} />}
              </Box>

              {/* כמות סועדים ומחיר */}
              <Box
                sx={{
                  bgcolor: C.night,
                  color: "#fff",
                  borderRadius: "18px",
                  p: { xs: 2.5, md: 4 },
                  mb: 3,
                  textAlign: "center",
                }}
              >
                <Typography sx={{ fontFamily: SANS, color: C.goldLight, fontSize: 15 }}>
                  מספר סועדים (מינימום {MIN_GUESTS})
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, my: 1.5 }}>
                  <IconButton
                    aria-label="הפחתת סועדים"
                    onClick={() => setGuests(String(Math.max(MIN_GUESTS, guestsNum - 5)))}
                    sx={{ color: C.goldLight, border: `1px solid ${C.gold}` }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Box
                    component="input"
                    type="number"
                    inputMode="numeric"
                    aria-label="מספר סועדים"
                    value={guests}
                    onChange={(e) => {
                      setGuests(e.target.value.replace(/\D/g, "").slice(0, 4));
                      if (errors.guests) setErrors((er) => ({ ...er, guests: undefined }));
                    }}
                    onBlur={() => guestsNum < MIN_GUESTS && setGuests(String(MIN_GUESTS))}
                    sx={{
                      width: 110,
                      textAlign: "center",
                      background: "transparent",
                      border: "none",
                      borderBottom: `2px solid ${C.gold}`,
                      outline: "none",
                      color: "#fff",
                      fontFamily: SERIF,
                      fontWeight: 700,
                      fontSize: 44,
                      MozAppearance: "textfield",
                      "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": { WebkitAppearance: "none", margin: 0 },
                    }}
                  />
                  <IconButton
                    aria-label="הוספת סועדים"
                    onClick={() => setGuests(String(guestsNum + 5))}
                    sx={{ color: C.goldLight, border: `1px solid ${C.gold}` }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                {errors.guests && (
                  <Typography sx={{ fontFamily: SANS, color: "#ff9aa8", fontSize: 14 }}>{errors.guests}</Typography>
                )}
                <Typography sx={{ fontFamily: SANS, color: "#c9cfdb", fontSize: 14 }}>
                  ₪{PRICE_PER_GUEST} למנה. אפשר להקליד או ללחוץ לשינוי של 5 סועדים
                </Typography>

                {/* פירוט המחיר */}
                <Box
                  sx={{
                    mt: 2,
                    mx: "auto",
                    maxWidth: 360,
                    fontFamily: SANS,
                    fontSize: 15,
                    color: "#dfe3ec",
                    textAlign: "right",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                    <span>
                      {guestsEff} סועדים × ₪{PRICE_PER_GUEST}
                    </span>
                    <span>₪{baseTotal.toLocaleString("he-IL")}</span>
                  </Box>
                  {schnitzelQty > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                      <span>
                        שניצל {schnitzelQty} × ₪{SCHNITZEL_PRICE}
                      </span>
                      <span>₪{schnitzelTotal.toLocaleString("he-IL")}</span>
                    </Box>
                  )}
                  {salmonQty > 0 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.3 }}>
                      <span>
                        סלמון {salmonQty} × ₪{SALMON_PRICE}
                      </span>
                      <span>₪{salmonTotal.toLocaleString("he-IL")}</span>
                    </Box>
                  )}
                </Box>

                <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: { xs: 34, md: 44 }, mt: 1.5 }}>
                  סה״כ ₪{total.toLocaleString("he-IL")}
                </Typography>
              </Box>

              {/* פרטי לקוח */}
              <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 26, color: C.night, mb: 1.5 }}>
                הפרטים שלכם
              </Typography>
              <Grid container spacing={1.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    label="שם מלא"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="tel"
                    label="טלפון"
                    value={form.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    slotProps={{ htmlInput: { inputMode: "tel", maxLength: 16, dir: "ltr", style: { textAlign: "right" } } }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="email"
                    label="אימייל"
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                    slotProps={{ htmlInput: { dir: "ltr", style: { textAlign: "right" } } }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="תאריך השבת"
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                    error={!!errors.date}
                    helperText={errors.date}
                    slotProps={{
                      inputLabel: { shrink: true },
                      htmlInput: { min: localDateStr(new Date(Date.now() + 86400000)) },
                    }}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    fullWidth
                    required
                    label="כתובת האירוע (עיר ורחוב)"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>

              {errorMessage && (
                <Typography sx={{ mt: 2, fontFamily: SANS, color: C.wine, fontWeight: 700, textAlign: "center" }}>
                  {errorMessage}
                </Typography>
              )}
            </Body>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ direction: "rtl", minHeight: "100vh", bgcolor: C.pearl, fontFamily: SANS }}>
      <NavbarHome sx={{ padding: 0, margin: 0 }} />
      <br /> <br /> <br />
      <br />

      {!isIntro && <JourneyBar step={step} maxStep={maxStep} onJump={goTo} total={total} />}

      {/* ===== שלב הפתיחה: חופה + מזל טוב ===== */}
      {isIntro && (
        <>
          <Hero
            tall
            image={STEP_IMAGES.intro}
            title="מזל טוב"
            subtitle="מה שחסר לשבת חתן מושלמת: התפריט של קייטרינג הפנינה"
          />
          <Box sx={{ maxWidth: 720, mx: "auto", textAlign: "center", px: 3, py: { xs: 4, md: 6 } }}>
            <Typography sx={{ fontFamily: SANS, color: C.ink, fontSize: { xs: 16, md: 19 }, lineHeight: 2 }}>
              בונים יחד את שבת החתן שלכם, סעודה אחר סעודה: סלטים לכל השבת, ליל שבת, שבת בבוקר וסעודה שלישית.
            </Typography>
            <Box
              sx={{
                display: "inline-flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 3,
                mt: 3,
                px: 3,
                py: 1.5,
                border: `1px solid ${C.gold}`,
                borderRadius: 99,
                fontFamily: SANS,
                color: C.night,
                fontWeight: 700,
                fontSize: { xs: 14, md: 16 },
              }}
            >
              <span>₪{PRICE_PER_GUEST} למנה</span>
              <span>מינימום {MIN_GUESTS} סועדים</span>
            </Box>
            <Box sx={{ mt: 4 }}>
              <Button
                onClick={() => setStep(1)}
                endIcon={<ArrowBackIcon />}
                sx={{
                  height: 58,
                  px: 6,
                  borderRadius: 99,
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 18,
                  color: C.night,
                  bgcolor: C.gold,
                  "&:hover": { bgcolor: C.goldLight },
                }}
              >
                בואו נתחיל
              </Button>
            </Box>
          </Box>
        </>
      )}

      {renderStep()}

      {/* ===== כפתורי ניווט ===== */}
      {!isIntro && (
        <Box sx={{ maxWidth: 1100, mx: "auto", px: { xs: 2, md: 3 }, mt: 4, mb: { xs: 8, md: 10 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column-reverse", sm: "row" },
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Button
              onClick={back}
              startIcon={<ArrowForwardIcon />}
              sx={{
                flex: { sm: "0 1 240px" },
                height: 54,
                borderRadius: 99,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 16,
                color: C.night,
                border: `1.5px solid ${C.night}`,
                "&:hover": { bgcolor: `${C.night}0F` },
              }}
            >
              חזרה
            </Button>

            {!isSummary ? (
              <Button
                onClick={next}
                disabled={!!blocked}
                endIcon={<ArrowBackIcon />}
                sx={{
                  flex: { sm: "0 1 300px" },
                  height: 54,
                  borderRadius: 99,
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 16,
                  color: "#fff",
                  bgcolor: C.night,
                  "&:hover": { bgcolor: C.nightSoft },
                  "&.Mui-disabled": { bgcolor: "#c9ced9", color: "#fff" },
                }}
              >
                {STEPS[step].next}
              </Button>
            ) : (
              <Button
                onClick={handleSubmitClick}
                disabled={sending}
                sx={{
                  flex: { sm: "0 1 320px" },
                  height: 54,
                  borderRadius: 99,
                  fontFamily: SANS,
                  fontWeight: 700,
                  fontSize: 17,
                  color: C.night,
                  bgcolor: C.gold,
                  "&:hover": { bgcolor: C.goldLight },
                }}
              >
                שליחת הזמנה
              </Button>
            )}
          </Box>

          {blocked && (
            <Typography sx={{ textAlign: "center", mt: 1.5, fontFamily: SANS, fontWeight: 600, fontSize: 14, color: C.wine }}>
              {blocked}
            </Typography>
          )}
        </Box>
      )}

      {/* ===== דיאלוג אישור אחרון לפני שליחה ===== */}
      <Dialog
        open={confirmOpen}
        onClose={() => !sending && setConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{ dir: "rtl", sx: { borderRadius: 4, m: 2, width: "calc(100% - 32px)" } }}
      >
        <Box sx={{ p: { xs: 2.5, sm: 3.5 }, textAlign: "center" }}>
          <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 28, color: C.night, mb: 0.5 }}>
            לפני שמסיימים
          </Typography>
          <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 30, color: C.gold, mb: 2 }}>
            סה״כ ₪{total.toLocaleString("he-IL")}
          </Typography>

          <Box sx={{ textAlign: "right", fontFamily: SANS, color: C.ink, fontSize: 15.5, lineHeight: 1.9 }}>
            <Box sx={{ mb: 1.2 }}>המחיר אינו כולל משלוח.</Box>
            <Box sx={{ mb: 1.2 }}>חובה על בעל ההזמנה לדאוג להחזרת סיר החמין בסוף השבת.</Box>
            <Box>
              ניתן לשנות, להוסיף או למחוק בכל זמן עד יומיים לפני השבת אצל שירות הלקוחות שלנו במספר{" "}
              <Box component="a" href={`tel:${SERVICE_PHONE}`} sx={{ color: C.wine, fontWeight: 700, direction: "ltr", display: "inline-block" }}>
                {SERVICE_PHONE}
              </Box>
              .
            </Box>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
            <Button
              onClick={handleFinalSubmit}
              disabled={sending}
              sx={{
                height: 52,
                borderRadius: 99,
                fontFamily: SANS,
                fontWeight: 700,
                fontSize: 16,
                color: C.night,
                bgcolor: C.gold,
                "&:hover": { bgcolor: C.goldLight },
              }}
            >
              {sending ? <CircularProgress size={22} sx={{ color: C.night }} /> : "אישור ושליחת ההזמנה"}
            </Button>
            <Button
              onClick={() => setConfirmOpen(false)}
              disabled={sending}
              sx={{ height: 44, fontFamily: SANS, fontWeight: 700, color: C.mute }}
            >
              חזרה לעריכה
            </Button>
          </Box>
        </Box>
      </Dialog>

      {/* ===== כרטיס ברכה אחרי שליחה מוצלחת ===== */}
      <Dialog
        open={successOpen}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          dir: "rtl",
          sx: { borderRadius: 4, m: 2, width: "calc(100% - 32px)", position: "relative", overflow: "hidden", bgcolor: "#fff" },
        }}
      >
        <ConfettiBurst />
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            px: 3,
            py: { xs: 5, sm: 6 },
            borderTop: `6px solid ${C.gold}`,
          }}
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.15 }}
          >
            <Typography sx={{ fontFamily: SERIF, fontWeight: 900, fontSize: { xs: 52, sm: 60 }, color: C.night, lineHeight: 1.1 }}>
              מזל טוב
            </Typography>
          </motion.div>
          <Box sx={{ width: 70, height: 3, bgcolor: C.gold, mx: "auto", my: 2.5, borderRadius: 99 }} />
          <Typography sx={{ fontFamily: SERIF, fontWeight: 700, fontSize: 22, color: C.ink, mb: 1.5 }}>
            ההזמנה נשלחה בהצלחה
          </Typography>
          <Typography sx={{ fontFamily: SANS, color: C.mute, fontSize: 16, lineHeight: 1.9 }}>
            נציגנו יחזור אליכם בהקדם להתקדמות ואישור תשלום.
          </Typography>
          <Button
            onClick={() => navigate("/")}
            sx={{
              mt: 3.5,
              height: 50,
              px: 5,
              borderRadius: 99,
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
              bgcolor: C.night,
              "&:hover": { bgcolor: C.nightSoft },
            }}
          >
            חזרה לדף הבית
          </Button>
        </Box>
      </Dialog>

      <Footer />
    </Box>
  );
}