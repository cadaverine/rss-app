const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ArticleSchema = new Schema({
  sourceId: String,
  imageLink: String,
  title: String,
  link: String,
  description: String,
  date: String
});


mongoose.model('Article', ArticleSchema);

