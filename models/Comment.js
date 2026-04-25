const mongoose = require('mongoose');
module.exports = mongoose.model('Comment', new mongoose.Schema({
  name     : { type:String, required:true },
  message  : { type:String, required:true },
  mood     : { type:String, enum:['happy','emotional','excited','shy'], default:'happy' },
  rating   : { type:Number, min:1, max:5, default:5 },
  createdAt: { type:Date, default:Date.now },
}));
