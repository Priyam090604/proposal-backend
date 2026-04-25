const mongoose = require('mongoose');
module.exports = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS:8000 });
    console.log('✅  MongoDB connected');
  } catch(e) { console.error('❌  MongoDB:', e.message); process.exit(1); }
};
