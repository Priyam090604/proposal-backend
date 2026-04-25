require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cfg       = require('./site.config');   // shared config
const { sendYesEmail, sendCommentEmail } = require('./utils/email');
const ProposalResponse = require('./models/ProposalResponse');
const Comment          = require('./models/Comment');

const app = express();

app.use(helmet());
app.use(cors({
  origin: [process.env.FRONTEND_URL||'http://localhost:5173','http://localhost:3000'],
  credentials:true,
}));
app.use(rateLimit({ windowMs:15*60*1000, max:200 }));
app.use(express.json({ limit:'2mb' }));

/* ─── serve site config to frontend ─────────────────────────── */
app.get('/api/config', (_,res) => {
  // Send only safe fields (no secrets)
  res.json({
    herName       : cfg.herName,
    heroSubtext   : cfg.heroSubtext,
    proposalText  : cfg.proposalText,
    successMessage: cfg.successMessage,
    gallery       : cfg.gallery,
    story         : cfg.story,
    music         : cfg.music,
  });
});

app.get('/api/health', (_,res) => res.json({ ok:true }));

/* ─── proposal response ──────────────────────────────────────── */
app.post('/api/proposal-response', async (req,res) => {
  try {
    const { herName, response } = req.body;
    await ProposalResponse.create({ herName, response });
    // Fire-and-forget email
    sendYesEmail(herName||cfg.herName, response).catch(()=>{});
    res.status(201).json({ success:true });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
});

/* ─── comment / message ──────────────────────────────────────── */
app.post('/api/comment', async (req,res) => {
  try {
    const { name, message, mood, rating } = req.body;
    await Comment.create({ name, message, mood, rating });
    // Fire-and-forget email
    sendCommentEmail({ name, message, mood, rating }).catch(()=>{});
    res.status(201).json({ success:true });
  } catch(e) { res.status(400).json({ success:false, message:e.message }); }
});

/* ─── error handler ──────────────────────────────────────────── */
app.use((err,_req,res,_next) => {
  console.error(err);
  res.status(500).json({ success:false, message:'Server error' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => app.listen(PORT, ()=>console.log('🚀  http://localhost:'+PORT)));
