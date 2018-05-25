const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SourceSchema = new Schema({
  id: Number,
  title: String,
  link: String,
  description: String
});


mongoose.model('Source', SourceSchema);