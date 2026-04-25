const mongoose = require('mongoose');
module.exports = mongoose.model('ProposalResponse', new mongoose.Schema({
  herName  : { type:String, default:'Barsha' },
  response : { type:String, enum:['yes','of_course'], required:true },
  createdAt: { type:Date, default:Date.now },
}));
