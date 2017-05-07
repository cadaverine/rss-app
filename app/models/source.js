var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SourceSchema = new Schema({
  title: String,
  link: String,
  description: String
});


mongoose.model('Source', SourceSchema);
