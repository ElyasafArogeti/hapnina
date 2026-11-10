import React,{useEffect,useState,useMemo,useRef} from 'react';
import {apiFetch} from '../api';
import '../../assets/stylesMain/OrdersOnline.css';
import {useNavigate} from 'react-router-dom';
import Confetti from 'react-confetti';
import dayjs from 'dayjs';
import Footer from './Footer';
import NavbarHome from './NavbarHome';
import Grid from '@mui/material/Grid2';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import TextMove from "./textMove";
import {Card, IconButton,CardContent,CardMedia,Checkbox,Snackbar,Alert,Modal,Box,Dialog,DialogActions,DialogContent,DialogTitle,TextField,Button,Typography,LinearProgress,Stack,CircularProgress,Paper,FormControl,InputLabel,Select,MenuItem,Divider,List,ListItem,ListItemText,Container} from '@mui/material';

/* ---------- עיצוב שחור-זהב ---------- */
const G='#D4AF37',BK='#0d0d0d',PN='#161616',TX='#f5f0e1',MU='#b9a566';
const paperSx={bgcolor:PN,color:TX,border:`1px solid ${G}`,borderRadius:3,boxShadow:`0 0 28px ${G}33`};
const fieldSx={'& .MuiOutlinedInput-root':{color:TX,'& fieldset':{borderColor:'#6b5a1f'},'&:hover fieldset':{borderColor:G},'&.Mui-focused fieldset':{borderColor:G}},'& label':{color:MU},'& label.Mui-focused':{color:G},'& .MuiFormHelperText-root':{color:MU},'& .MuiFormHelperText-root.Mui-error':{color:'#ff7b7b'},'& .MuiSelect-icon':{color:G}};
const goldBtn={bgcolor:G,color:BK,fontWeight:700,borderRadius:2,px:3,'&:hover':{bgcolor:'#f0d77b'},'&.Mui-disabled':{bgcolor:'#4a4120',color:'#8a7a40'}};
const menuProps={PaperProps:{sx:{bgcolor:PN,color:TX,border:`1px solid ${G}`}}};

/* ---------- קטגוריות ומכסות (בדיוק!) ---------- */
const CATS=[{k:'salads',t:'סלטים',n:'סלטים',max:8},{k:'first_courses',t:'מנה ראשונה',n:'מנות ראשונות',max:3},{k:'main_courses',t:'מנה עיקרית',n:'מנות עיקריות',max:3},{k:'side_dishes',t:'תוספות',n:'תוספות',max:3}];
const REGIONS={'ירושלים והסביבה':300,'בית שמש והסביבה':250,'תל אביב והמרכז':300,'קרית גת, אשקלון, אשדוד':150,'באר שבע והדרום':300,'אזור בנימין':400,'גוש עציון':350,'הרצליה והסביבה':400,'חיפה וצפון':500,'איסוף עצמי: גבעת שאול ירושלים':0};
const NO_ROUND=[3,8,11,12,28,29];
const roundW=w=>w<500?w:Math.ceil(w/500)*500;

/* ---------- התאמת תמונות: משאיר רק אותיות עבריות, מתעלם מסיומת/סיומת רנדומלית של Cloudinary ---------- */
const norm=s=>String(s||'').replace(/\.[a-z0-9]{2,4}$/i,'').replace(/[^\u05D0-\u05EA]/g,'');
const buildMap=arr=>{const m=new Map();(arr||[]).forEach(i=>{const url=i.url||i.secure_url;[i.display_name,i.public_id&&String(i.public_id).split('/').pop(),i.filename,i.name].forEach(n=>{const k=norm(n);if(k&&url&&!m.has(k))m.set(k,url)})});return m};
const findImg=(m,name)=>{const k=norm(name);if(!k)return null;if(m.has(k))return m.get(k);for(const[key,url]of m)if(key.length>2&&(key.includes(k)||k.includes(key)))return url;return null};



const darkBg = "linear-gradient(135deg, #111111 0%, #1d1b18 55%, #2a2418 100%)";
const GOLD = "#C9A96E", GOLD_DARK = "#8c6a25", INK = "#171614", CREAM = "#f6f3ec";


const OrdersOnline=()=>{
const nav=useNavigate();
const [inv,setInv]=useState({first_courses:[],main_courses:[],salads:[],side_dishes:[]});
const [imgs,setImgs]=useState({first_courses:[],main_courses:[],salads:[],side_dishes:[]});
const [sel,setSel]=useState({salads:[],first_courses:[],main_courses:[],side_dishes:[]});
const [qty,setQty]=useState({first_courses:{},main_courses:{}});
const [mainView,setMainView]=useState(true),[loginOpen,setLoginOpen]=useState(false),[qtyOpen,setQtyOpen]=useState(false),[sent,setSent]=useState(false),[loading,setLoading]=useState(false);
const [eventOwner,setEventOwner]=useState(''),[guestCount,setGuestCount]=useState(''),[eventDate,setEventDate]=useState(''),[phone,setPhone]=useState(''),[email,setEmail]=useState('');
const [region,setRegion]=useState(''),[shipCost,setShipCost]=useState(0),[exactLoc,setExactLoc]=useState('');
const [summary,setSummary]=useState(null),[totalPrice,setTotalPrice]=useState(0),[subtotal,setSubtotal]=useState(0),[vat,setVat]=useState(0);
const [errors,setErrors]=useState({}),[errMsg,setErrMsg]=useState(null),[zoom,setZoom]=useState(null);
const summaryRef=useRef(null),formRef=useRef(null);

useEffect(()=>{apiFetch('/api/inventoryAll').then(setInv).catch(e=>console.error('inventory',e))},[]);
useEffect(()=>{setLoading(true);apiFetch('/api/getUploadedImages').then(d=>{console.log('images from server:',d);setImgs(d)}).catch(e=>console.error('images',e)).finally(()=>setLoading(false))},[]);
useEffect(()=>{if(summary)summaryRef.current?.scrollIntoView({behavior:'smooth'})},[summary]);
const maps=useMemo(()=>Object.fromEntries(CATS.map(c=>[c.k,buildMap(imgs[c.k])])),[imgs]);

const toggle=(k,id,checked,max)=>setSel(p=>checked?(p[k].length>=max||p[k].includes(id)?p:{...p,[k]:[...p[k],id]}):{...p,[k]:p[k].filter(x=>x!==id)});
const tot=k=>Object.entries(qty[k]).filter(([id])=>sel[k].some(s=>String(s)===id)).reduce((a,[,v])=>a+Number(v||0),0);

/* בדיקה: בדיוק המכסה בכל קטגוריה */
const checkCounts=()=>{const bad=CATS.filter(c=>sel[c.k].length!==c.max).map(c=>`${c.n}: נבחרו ${sel[c.k].length} מתוך ${c.max}`);if(bad.length){setErrMsg('יש לבחור בדיוק את המכסה בכל קטגוריה. '+bad.join(' | '));return false}setErrMsg(null);return true};
const openDetails=()=>{if(checkCounts())setLoginOpen(true)};

const openQty=()=>{const e={};
if(!eventOwner.trim())e.eventOwner='יש להזין שם מלא';
if(!guestCount||guestCount<60||guestCount>1000)e.guestCount='כמות המוזמנים חייבת להיות בין 60 ל-1000';
if(!eventDate||dayjs(eventDate).isBefore(dayjs().add(3,'day'),'day'))e.eventDate='יש לבחור תאריך שלפחות 3 ימים מהיום';
setErrors(e);if(Object.keys(e).length)return;setLoginOpen(false);setErrMsg(null);setQtyOpen(true)};

const handleSubmit=()=>{
for(const[k,n]of[['first_courses','מנות ראשונות'],['main_courses','מנות עיקריות']]){const t=tot(k);if(t!==guestCount){setErrMsg(`סך ${n} חייב להיות בדיוק ${guestCount} (הוזן ${t})`);return}}
setErrMsg(null);let total=0;const out={};
CATS.forEach(c=>{out[c.k]=sel[c.k].map(id=>{const d=inv[c.k].find(x=>Number(x.id)===Number(id));if(!d)return null;
const w=Number(d.weight),p=Number(d.price),q=Number(qty[c.k]?.[id]||0);let tw,pr;
if(c.k==='salads'||c.k==='side_dishes'){tw=roundW(w*guestCount);pr=tw*p/1000}
else if(w>0&&w<2){tw=q;pr=q*p}
else{const raw=q*w;tw=(c.k==='main_courses'&&NO_ROUND.includes(Number(d.id)))?raw:roundW(raw);pr=tw*p/1000}
total+=pr;return{dish_name:d.dish_name,totalPrice:pr.toFixed(2),totalWeight:c.k==='main_courses'?(tw/1000).toFixed(1):Number(tw).toFixed(2),dishWeight:d.weight}}).filter(Boolean)});
total+=total*0.8;const v=total*0.18;
setSubtotal(Number(total.toFixed(2)));setVat(v);setTotalPrice(total+v);setSummary(out);setQtyOpen(false);setMainView(false)};

const validateFinal=()=>{const e={};if(!/^[0-9]{10}$/.test(phone))e.phoneNumber='מספר פלאפון לא תקין (10 ספרות בלבד)';if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))e.email='כתובת מייל לא חוקית';setErrors(e);return!Object.keys(e).length};
const addOrder=async()=>{try{setLoading(true);const d=await apiFetch('/api/addOrdersOnline',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({userName:eventOwner,userPhone:phone,guestCount,eventDate,orderMenu:summary,totalPrice,shippingDate:new Date().toISOString().slice(0,19).replace('T',' '),email,event_location:region,address:exactLoc,shippingCost:shipCost,serviceCost:0,toolsType:'ללא',eventType:'תפריט כללי'})});if(d.message==='נשלח בהצלחה')setSent(true)}catch(e){console.error('שגיאה בשמירת ההזמנה:',e);alert('אירעה שגיאה בשמירת ההזמנה.')}finally{setLoading(false)}};

const Heading=({children})=><Box display="flex" alignItems="center" justifyContent="center" mb={3}><Box sx={{flex:1,height:'2px',bgcolor:G,mx:2}}/><Typography variant="h5" sx={{fontWeight:700,color:'#333',textAlign:'center',whiteSpace:'nowrap'}}>{children}</Typography><Box sx={{flex:1,height:'2px',bgcolor:G,mx:2}}/></Box>;




return(<div>
<NavbarHome sx={{padding:0,margin:0}}/> <br /> <br /> <br /> <br /> <TextMove />
      
<Box sx={{position:'relative',width:'100%',maxHeight:'500px',overflow:'hidden',mb:4}}>
<Box component="img" src="https://res.cloudinary.com/dhkegagjk/image/upload/v1794303890/IMG-20250713-WA0102_sacqao.jpg" alt="תמונת תפריט הזמנה" sx={{width:'100%',maxHeight:'400px',objectFit:'cover',filter:'brightness(50%)'}}/>
<Typography variant="h4" component="h1" translate="no" sx={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',fontWeight:'bold',fontSize:{xs:'2.5rem',md:'5rem'},color:G,textAlign:'center',textShadow:'2px 2px 4px black',zIndex:1000}}>תפריט הצעת מחיר</Typography>
</Box>

{mainView&&<div className="online-order-container">
<Container dir="rtl" sx={{maxWidth:'1200px',width:'100%',bgcolor:'rgba(255,255,255,0.92)',borderRadius:3,boxShadow:3,px:{xs:2,sm:4},py:{xs:3,sm:6}}}>
<Typography variant="h4" sx={{fontWeight:600,color:'#51432D',mb:2,fontSize:{xs:'1.4rem',sm:'1.5rem'},textAlign:'center'}}>תפריט GOLD - הצעת מחיר במקום </Typography>
<Typography variant="h6" sx={{color:'#4e342e',mb:2,fontSize:{xs:'1rem',sm:'1.2rem'},textAlign:'center'}}>קייטרינג הפנינה - כשר למהדרין יורה דעה הרב מחפוד</Typography>
<Typography sx={{mb:2,fontSize:{xs:'0.85rem',sm:'1rem'},fontWeight:500,textAlign:'center',color:'#333'}}>פלאפון: <strong>0795152820</strong> | מייל: <strong>hpnina6600200@gmail.com</strong></Typography>
<Typography variant="body2" sx={{color:'text.secondary',fontSize:{xs:'0.8rem',sm:'1rem'},mb:2,textAlign:'center'}}>ברוכים הבאים! לפניכם התפריט העשיר שלנו בו תקבלו בפשטות ובמהירות הצעת מחיר משתלמת במיוחד עבור האירוע שלכם.<br/>שליחת התפריט אינה מהווה התחייבות עד לאישור סופי מנציג.</Typography>
<Typography sx={{color:'#6d4228',fontWeight:600,textAlign:'center'}}>מינימום הזמנה 60 מנות !!</Typography>
</Container>

      {/* ===== מה כלול בחבילה + מחיר ===== */}
        <Box sx={{ mb: 3, borderRadius: "22px", background: darkBg, border: "1px solid #393024", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", p: { xs: 2.5, md: 4 }, textAlign: "center" }}>
          <Typography sx={{ color: GOLD, fontSize: 11, letterSpacing: 3, fontWeight: 700, mb: 1 }}>הצעת מחיר</Typography>
          <Typography sx={{ color: "#E4CC9D", fontWeight: 700, fontSize: { xs: 14, md: 16 }, mb: 1.5 }}>מה כלול בחבילה</Typography>
          <Box sx={{ display: "grid", gap: 1.2, gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" } }}>
            {[
              { label: "סלטים", n: 8 },
              { label: "מנות ראשונות", n: 3 },
              { label: "מנות עיקריות", n: 3 },
              { label: "תוספות", n: 3 },
            ].filter((x) => x.n > 0).map((x) => (
              <Box key={x.label} sx={{ py: 1.5, borderRadius: "14px", border: "1px solid #5b4a2c", bgcolor: "rgba(201,169,110,0.07)" }}>
                <Typography sx={{ color: GOLD, fontWeight: 800, fontSize: { xs: 26, md: 32 }, lineHeight: 1.1 }}>{x.n}</Typography>
                <Typography sx={{ color: "#F5E9D0", fontSize: { xs: 13, md: 14.5 }, fontWeight: 600 }}>{x.label}</Typography>           
              </Box>
              
            ))}
          </Box>
        <Typography sx={{ color: "#E4CC9D", fontWeight: 700, fontSize: { xs: 14, md: 16 }, mb: 1.5 }}>התחל בבחירת המוצרים שלך   </Typography>
        </Box>

<div dir="rtl" className="menu-container">
{loading&&<LinearProgress/>}
<Snackbar open={!!errMsg&&!qtyOpen} autoHideDuration={7000} anchorOrigin={{vertical:'bottom',horizontal:'left'}} onClose={()=>setErrMsg(null)}><Alert severity="error" sx={{width:'100%'}}>{errMsg}</Alert></Snackbar>

<Box mt={6}>
{CATS.map(c=>{const full=sel[c.k].length>=c.max;return(<Box key={c.k} mt={c.k==='salads'?0:6} mb={c.k==='side_dishes'?6:0}>
<Heading>{c.t} [{sel[c.k].length}/{c.max}]</Heading>
<Grid container spacing={2} justifyContent="center">
{inv[c.k].filter(d=>d.is_hidden).map(d=>{const url=findImg(maps[c.k],d.dish_name),on=sel[c.k].includes(d.id),off=full&&!on;return(
<Grid size={{xs:6,sm:3}} key={d.id}>
<Card onClick={()=>!off&&toggle(c.k,d.id,!on,c.max)} sx={{height:'100%',display:'flex',flexDirection:'column',justifyContent:'space-between',cursor:off?'not-allowed':'pointer',opacity:off?0.3:1,filter:off?'grayscale(1)':'none',transition:'all .25s',border:on?`2px solid ${G}`:'2px solid transparent',boxShadow:on?`0 0 14px ${G}99`:3}}>
{url?<CardMedia component="img" height="140" image={url} alt={d.dish_name} sx={{objectFit:'cover',cursor:'zoom-in'}} onClick={e=>{e.stopPropagation();setZoom(url)}}/>
:<Box height="140px" display="flex" alignItems="center" justifyContent="center" bgcolor="#f0f0f0" color="#888" fontSize="0.9rem" fontStyle="italic" textAlign="center" px={1}>טרם צולמה תמונה למנה</Box>}
<CardContent sx={{px:1.5,py:1}}><Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="row-reverse" gap={1}>
<Typography variant="subtitle1" fontWeight={600} sx={{fontSize:{xs:'0.75rem',sm:'0.9rem'},textAlign:'right',flexGrow:1,whiteSpace:'normal',overflowWrap:'break-word',lineHeight:1.4}}>{d.dish_name}</Typography>
<Checkbox size="small" checked={on} disabled={off} onClick={e=>e.stopPropagation()} onChange={e=>toggle(c.k,d.id,e.target.checked,c.max)} sx={{p:'4px',mr:0,'&.Mui-checked':{color:G}}}/>
</Box></CardContent>
</Card></Grid>)})}
</Grid></Box>)})}
</Box>



<div className="order-summary-container" ><br/><button className="order-summary-button" onClick={openDetails} >המשך לסיכום </button><br/><br/></div>
</div>



<Dialog open={!!zoom} onClose={()=>setZoom(null)} maxWidth="xl" fullWidth PaperProps={{sx:{bgcolor:'transparent',boxShadow:'none',m:0,p:0}}} BackdropProps={{sx:{bgcolor:'rgba(0,0,0,0.6)'}}}>
<DialogContent sx={{p:0,height:'100vh',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'pointer'}} onClick={()=>setZoom(null)}>
{zoom&&<Box component="img" src={zoom} alt="תמונה מוגדלת" onClick={e=>e.stopPropagation()} sx={{maxWidth:'95vw',maxHeight:'95vh',objectFit:'contain',borderRadius:2,border:`2px solid ${G}`}}/>}
</DialogContent></Dialog>
</div>}

{/* ---------- מודל פרטים ---------- */}
{loginOpen&&<Modal open onClose={()=>setLoginOpen(false)}>
<Box dir="rtl" sx={{...paperSx,position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',p:4,width:'90%',maxWidth:420}}>
<Stack spacing={3}>
<Typography variant="h6" align="center" sx={{color:G,fontWeight:700}}>בוא נחשב לך הצעת מחיר</Typography>
<TextField sx={fieldSx} label="שם מלא" value={eventOwner} onChange={e=>setEventOwner(e.target.value)} fullWidth required error={!!errors.eventOwner} helperText={errors.eventOwner||'נשתמש בשם כדי לפנות אליך אישית'}/>
<TextField sx={fieldSx} label="כמה אורחים צפויים?" type="number" value={guestCount} onChange={e=>setGuestCount(Number(e.target.value))} fullWidth inputProps={{inputMode:'numeric',min:60}} error={!!errors.guestCount} helperText={errors.guestCount||'מינימום 60 אורחים'} required/>
<TextField sx={{...fieldSx,'& input::-webkit-calendar-picker-indicator':{filter:'invert(0.8) sepia(1) saturate(4) hue-rotate(5deg)'}}} label="מתי האירוע?" type="date" value={eventDate} onChange={e=>setEventDate(e.target.value)} fullWidth InputLabelProps={{shrink:true}} error={!!errors.eventDate} helperText={errors.eventDate} required/>
<Button sx={goldBtn} size="large" onClick={openQty}>המשך להצעת מחיר</Button>
</Stack></Box></Modal>}




{/* ---------- מודל כמויות ---------- */}
<Dialog open={qtyOpen} PaperProps={{sx:paperSx}} dir="rtl">
<DialogTitle sx={{color:G,fontWeight:700,textAlign:'center'}}>עזור לנו לדעת מה רצונך</DialogTitle>
<DialogContent>
<Typography sx={{color:MU,textAlign:'center',mb:1}}>הגדר את כמות המנות במדויק עבור כל מנה שבחרת. בכל קטגוריה הסכום חייב להיות <strong style={{color:G}}>{guestCount}</strong> מנות.</Typography>
{[['first_courses','מנות ראשונות'],['main_courses','מנות עיקריות']].map(([k,n])=>{const t=tot(k);return(<Box key={k} mt={3}>
<Typography variant="h6" sx={{fontWeight:700,color:G,borderBottom:`1px solid ${G}55`,pb:.5}}>{n}</Typography>
{sel[k].map(id=>{const d=inv[k].find(x=>Number(x.id)===Number(id));return(<Grid container spacing={1} key={id} alignItems="center" sx={{mt:1}}>
<Grid size={{xs:12,sm:6}}><Typography sx={{color:TX}}>{d?.dish_name}</Typography></Grid>
<Grid size={{xs:12,sm:6}}><TextField sx={fieldSx} fullWidth type="number" inputProps={{min:0}} value={qty[k][id]??''} onChange={e=>{setQty(p=>({...p,[k]:{...p[k],[id]:e.target.value}}));setErrMsg(null)}} variant="outlined" size="small"/></Grid>
</Grid>)})}
<Typography variant="body2" sx={{mt:1,color:t===guestCount?'#7bd88f':'#ff7b7b'}}>הוזן {t} מתוך {guestCount}</Typography>
</Box>)})}
{errMsg&&<Typography sx={{mt:2,color:'#ff7b7b'}} variant="body2">{errMsg}</Typography>}
</DialogContent>
<DialogActions sx={{p:2,justifyContent:'space-between'}}>
<Button onClick={()=>{setQtyOpen(false);setLoginOpen(true)}} sx={{color:MU}}>חזרה</Button>
<Button onClick={handleSubmit} sx={goldBtn}>המשך להצעת מחיר</Button>
</DialogActions></Dialog>



{/* ---------- סיכום הצעת מחיר ---------- */}
{summary&&<Box ref={summaryRef} sx={{p:{xs:1,sm:4},maxWidth:1200,m:'auto'}}><br/>
<Paper ref={formRef} dir="rtl" elevation={0} sx={{...paperSx,p:{xs:2,sm:4}}}>
<Typography variant="h5" gutterBottom sx={{color:G,fontWeight:700}}>היי {eventOwner}, תודה שבחרת בקייטרינג הפנינה 🎉</Typography>
<Typography variant="h6" sx={{mt:2}}>הצעת המחיר שלך: <strong style={{color:G}}>₪ {totalPrice.toFixed(2)}</strong></Typography>
<Box sx={{mt:1,display:'flex',justifyContent:'center',gap:2,color:MU,flexWrap:'wrap'}}>
<Typography variant="body2">מספר המוזמנים: <strong style={{color:G}}>{guestCount}</strong></Typography><Typography variant="body2">|</Typography>
<Typography variant="body2">תאריך האירוע: <strong style={{color:G}}>{new Date(eventDate).toLocaleDateString('he-IL')}</strong></Typography></Box><br/>
<Typography sx={{mb:2,textAlign:'center',color:MU,fontSize:{xs:'0.9rem',sm:'1rem'},lineHeight:1.6}}>המחיר אינו כולל: דמי משלוח, שירותי מלצרות, כלי פורצלן ועוד</Typography>
<Typography sx={{mb:3,textAlign:'center',color:MU,fontSize:{xs:'0.9rem',sm:'1rem'},lineHeight:1.6}}>שימו ❤ - ניתן לבחור בשירותים נוספים להזמנה (שירות מלא / כלי פורצלן / דמי משלוח) על ידי הנציג שיחזור אליכם</Typography>

<Grid container spacing={3}>
<Grid size={{xs:12,sm:3}}><TextField sx={fieldSx} label="כתובת מייל" type="email" value={email} onChange={e=>setEmail(e.target.value)} fullWidth required error={!!errors.email} helperText={errors.email||''}/></Grid>
<Grid size={{xs:12,sm:3}}><TextField sx={fieldSx} label="מספר פלאפון" type="tel" value={phone} onChange={e=>setPhone(e.target.value)} fullWidth required error={!!errors.phoneNumber} helperText={errors.phoneNumber||''}/></Grid>
<Grid size={{xs:12,sm:3}}>
<FormControl fullWidth required sx={fieldSx}><InputLabel id="region-label">אזור משלוח הזמנה</InputLabel>
<Select labelId="region-label" label="אזור משלוח הזמנה" value={region} MenuProps={menuProps} onChange={e=>{setRegion(e.target.value);setShipCost(REGIONS[e.target.value]??0)}}>
{Object.keys(REGIONS).map(r=><MenuItem key={r} value={r}>{r}</MenuItem>)}</Select></FormControl>
{shipCost>0&&<><Typography variant="body2" sx={{color:MU}}>דמי משלוח <strong>החל מ-</strong> ₪{shipCost}</Typography><Typography variant="body2" sx={{color:MU}}>פרטים נוספים אצל הנציג</Typography></>}
{region&&shipCost===0&&<Typography variant="body2" sx={{color:MU}}>הזמנה לא כוללת דמי משלוח (איסוף עצמי)</Typography>}
</Grid>
<Grid size={{xs:12,sm:3}}><TextField sx={fieldSx} label="מיקום מדויק של האירוע" value={exactLoc} onChange={e=>setExactLoc(e.target.value)} fullWidth/></Grid>
</Grid>

<Box sx={{mt:5,maxWidth:'800px',mx:'auto'}}>
<Typography variant="h6" gutterBottom textAlign="center" sx={{color:G}}>🍽️ פרטי ההזמנה שלך 🍽️</Typography>
{CATS.map(c=>{const items=summary[c.k];if(!items?.length)return null;return(<Box key={c.k} sx={{mb:3}}>
<Typography variant="h6" sx={{fontWeight:'bold',textAlign:'center',borderBottom:`1px solid ${G}66`,pb:1,mb:2,color:G}}>{c.n}</Typography>
<List disablePadding>{items.map((it,i)=><ListItem key={`${it.dish_name}-${i}`} sx={{bgcolor:i%2?'#1d1d1d':'#242424',border:`1px solid ${G}33`,borderRadius:1,mb:1,px:2,py:1.5}}><ListItemText primary={<Typography textAlign="right" fontWeight={500} sx={{color:TX}}>{it.dish_name}</Typography>}/></ListItem>)}</List>
</Box>)})}
</Box>

<Divider sx={{my:3,borderColor:`${G}55`}}/>
<Box sx={{border:`1px solid ${G}66`,borderRadius:2,p:2,mt:2,width:'100%',maxWidth:400,mx:'auto',direction:'rtl'}}>
<Typography sx={{display:'flex',justifyContent:'space-between'}}><span>סכום לפני מע״מ:</span><strong>₪ {subtotal.toFixed(2)}</strong></Typography>
<Typography sx={{display:'flex',justifyContent:'space-between',mt:1}}><span>מע״מ (18%):</span><strong>₪ {vat.toFixed(2)}</strong></Typography>
<Divider sx={{my:1,borderColor:`${G}55`}}/>
<Typography variant="h6" sx={{display:'flex',justifyContent:'space-between'}}><span>סה״כ לתשלום:</span><strong style={{color:G}}>₪ {totalPrice.toFixed(2)}</strong></Typography>
</Box>

<Stack direction="row" spacing={2} sx={{mt:3}}>
<Button sx={goldBtn} onClick={()=>validateFinal()?addOrder():formRef.current?.scrollIntoView({behavior:'smooth'})} disabled={loading} startIcon={loading&&<CircularProgress size={20} color="inherit"/>}>{loading?'שולח הזמנה...':'שליחת ההזמנה'}</Button>
<Button sx={{color:MU,border:`1px solid ${MU}66`}} onClick={()=>{setSummary(null);setMainView(true)}}>חזרה לתפריט</Button>
</Stack>
</Paper></Box>}




{/* ---------- אישור שליחה ---------- */}
<Dialog open={sent} onClose={()=>nav('/')} fullScreen PaperProps={{sx:{m:0,p:0,display:'flex',justifyContent:'center',alignItems:'center',bgcolor:'rgba(0,0,0,0.85)',overflow:'hidden'}}}>

<Box sx={{position:'fixed',inset:0,zIndex:1500,pointerEvents:'none'}}><Confetti width={window.innerWidth} height={window.innerHeight} colors={[G,'#f0d77b','#ffffff','#8a7a40']}/></Box>
<Box sx={{...paperSx,position:'relative',zIndex:1600,textAlign:'center',direction:'rtl',p:4,width:{xs:'90%',sm:'70%',md:'50%'},maxHeight:'90vh',overflowY:'auto'}}>

<DialogTitle sx={{fontWeight:'bold',color:G}}>ברכת מזל טוב - {eventOwner}</DialogTitle>
<DialogContent>
<Typography variant="h5" sx={{mb:2,fontWeight:600,color:G}}>הזמנתך נשלחה בהצלחה!</Typography>
<Typography sx={{mb:1}}>ניצור איתך קשר בהקדם להמשך התהליך</Typography>
<Typography sx={{mb:1}}>לאחר אישור ההזמנה תקבלו תגובה במייל ותוכלו לראות את ההזמנות שלכם</Typography>
<Typography sx={{mb:3}}>תודה שבחרתם בקייטרינג הפנינה</Typography>
<Typography variant="body2" sx={{mt:3,fontStyle:'italic',color:MU}}>שימו לב: שליחת ההזמנה הינה שלב ראשוני בלבד ואינה מהווה התחייבות לתשלום או לאישור סופי.</Typography>
<Box sx={{mt:4}}><Button sx={goldBtn} onClick={()=>nav('/')}>סגור</Button></Box>
</DialogContent></Box></Dialog>
 {/* כפתורי קשר צפים - וואטסאפ וטלפון */}
      <Box
        sx={{
          position: "fixed",
          right: { xs: 14, md: 24 },
          bottom: { xs: 60, md: 60 },
          zIndex: 1500,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          alignItems: "center",
        }}
      >
        {/* WhatsApp */}
        <IconButton
          component="a"
          href="https://wa.me/972548520195"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שלחו לנו הודעה בוואטסאפ"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#fff",
            bgcolor: "#25D366",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              bgcolor: "#1ebe5d",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(37,211,102,0.35)",
            },
          }}
        >
          <WhatsAppIcon sx={{ fontSize: { xs: 29, md: 33 } }} />
        </IconButton>
      
        {/* שיחת טלפון */}
        <IconButton
          component="a"
          href="tel:0795152820"
          aria-label="התקשרו אלינו"
          sx={{
            width: { xs: 52, md: 58 },
            height: { xs: 52, md: 58 },
            color: "#17130a",
            background: "linear-gradient(135deg, #f5df9b, #c6a24b)",
            boxShadow: "0 5px 18px rgba(0,0,0,0.22)",
            border: "2px solid #fff",
            transition: "transform .25s ease, box-shadow .25s ease",
            "&:hover": {
              background: "linear-gradient(135deg, #ffe9a8, #d4b45f)",
              transform: "scale(1.08)",
              boxShadow: "0 8px 22px rgba(198,162,75,0.35)",
            },
          }}
        >
          <PhoneIcon sx={{ fontSize: { xs: 26, md: 30 } }} />
        </IconButton>


      </Box>

<Box dir="rtl"><Footer/></Box>
</div>)};

export default OrdersOnline;
