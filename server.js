require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const cfg       = require('./site.config');
const { sendYesEmail, sendCommentEmail } = require('./utils/email');
const ProposalResponse = require('./models/ProposalResponse');
const Comment          = require('./models/Comment');

const app = express();

app.use(helmet());

app.use(cors({
  origin: [
    "https://proposal-frontend-theta.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));;

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
}));

app.use(express.json({ limit: '2mb' }));

/* ─────────────────────────────────────────
   CONFIG API
───────────────────────────────────────── */
app.get('/api/config', (_, res) => {
  res.json({
    herName        : cfg.herName,
    heroSubtext    : cfg.heroSubtext,
    proposalText   : cfg.proposalText,
    successMessage : cfg.successMessage,
    gallery        : cfg.gallery,
    story          : cfg.story,
    music          : cfg.music,
  });
});

/* ─────────────────────────────────────────
   GALLERY API
───────────────────────────────────────── */
app.get('/api/gallery', (_, res) => {
  res.json(cfg.gallery || []);
});

/* ─────────────────────────────────────────
   STORY API
───────────────────────────────────────── */
app.get('/api/story', (_, res) => {
  res.json(cfg.story || []);
});

/* ─────────────────────────────────────────
   MUSIC API
───────────────────────────────────────── */
app.get('/api/music/active', (_, res) => {
  res.json(cfg.music || {});
});

/* ─────────────────────────────────────────
   HEALTH CHECK
───────────────────────────────────────── */
app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});

/* ─────────────────────────────────────────
   PROPOSAL RESPONSE
───────────────────────────────────────── */
app.post('/api/proposal-response', async (req, res) => {
  try {
    const { herName, response } = req.body;

    await ProposalResponse.create({
      herName,
      response
    });

    sendYesEmail(herName || cfg.herName, response).catch(() => {});

    res.status(201).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    });
  }
});

/* ─────────────────────────────────────────
   COMMENT API
───────────────────────────────────────── */
app.post('/api/comment', async (req, res) => {
  try {
    const { name, message, mood, rating } = req.body;

    await Comment.create({
      name,
      message,
      mood,
      rating
    });

    sendCommentEmail({
      name,
      message,
      mood,
      rating
    }).catch(() => {});

    res.status(201).json({
      success: true
    });

  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    });
  }
});

/* ─────────────────────────────────────────
   ERROR HANDLER
───────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: 'Server error'
  });
});

/* ─────────────────────────────────────────
   START SERVER
───────────────────────────────────────── */
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('🚀 Server running on port ' + PORT);
  });
});