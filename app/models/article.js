var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  sourceId: String,
  imageLink: String,
  title: String,
  link: String,
  description: String,
  date: String
});


mongoose.model('Article', ArticleSchema);

