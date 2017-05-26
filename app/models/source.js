var mongoose = require('mongoose');
  Schema = mongoose.Schema;

var SourceSchema = new Schema({
  id: Number,
  title: String,
  link: String,
  description: String
  // subscribersCount: Number
});


mongoose.model('Source', SourceSchema);