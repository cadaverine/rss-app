var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SourceSchema = new Schema({
	id: Number,
  title: String,
  link: String,
  description: String
});


mongoose.model('Source', SourceSchema);