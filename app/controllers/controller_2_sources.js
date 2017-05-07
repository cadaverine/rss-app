var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Source = mongoose.model('Source'),
    Article = mongoose.model('Article'),
    parser = require("rss-parser");
    

var sourceVar = { err: "" };


module.exports = function (app) {
  app.use('/', router);
};





//***************************
//***************************
//***************************
// /sources (get) section:
//***************************
//***************************
//***************************

router.get('/sources', (req, res) => {
  Source.find((err, sources) => {
    if (err) return;
    sourceVar["title"] = "Источники";
    sourceVar["sources"] = sources.map(source => {
      return {
        id: source._id,
        title: source.title,
        link: source.link,
        description: source.description
      }
    })
    res.render('sources', sourceVar);
    sourceVar.err = "";
  })
})





//***************************
//***************************
//***************************
// /add_source (post) section:
//***************************
//***************************
//***************************

function checkLink(linkToCheck){
  return new Promise((resolve, reject) => {
    if(!linkToCheck) reject("Введите URL.")
    Source.find({ link: linkToCheck }, (error, sources) => {
      if(error) {
        reject(error);
      }
      else if(sources.length) {
        reject('Этот URL уже добавлен.');
      }
      else {
        resolve();
      };
    });
  });
};


function parseLinkToVariable(linkToParse) {
  return new Promise((resolve, reject) => {
    parser.parseURL(linkToParse, (err, parsed) => {
      if(err)
        reject('Некорректный URL.');
      else {
        parsed.rssLink = linkToParse;
        resolve(parsed);
      };
    });
  });
};

function addSource(parsedObj){
  return new Promise((resolve, reject) => {
    new Source({
      link: parsedObj.rssLink,
      title: parsedObj.feed.title,
      description: parsedObj.feed.description
    }).save(error => {
      if(error) {
        reject(error);
      }
      else {
        resolve();
      }
    })
  })
}


router.post('/add_source', (req, res) => {
  checkLink(req.body.link)
    .then(() => parseLinkToVariable(req.body.link))
    .then(parsed => addSource(parsed))
    .then(() => res.redirect('/sources'))
    .catch(error => {
      sourceVar.err = error;
      res.redirect('/sources');
  });
});





//***************************
//***************************
//***************************
// /:id (post) section (delete):
//***************************
//***************************
//***************************


// Нет обработки ошибок.
router.post("/:id", (req, res) => {
  Source.remove({ _id: req.params.id }, () => {
    Article.remove({ sourceId: req.params.id }, () => {
      res.redirect('/sources');      
    })
  })
})
