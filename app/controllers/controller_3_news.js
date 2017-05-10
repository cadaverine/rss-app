var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Source = mongoose.model('Source'),
    Article = mongoose.model('Article'),
    parser = require("rss-parser");

    

var maxNewsNum = 10,
    data = {},
    currentId;


module.exports = function (app) {
  app.use('/', router);
};



//***************************
//***************************
//***************************
// /update (PUT) section:
//***************************
//***************************
//***************************


function parseSourceToVariable(source) {
  return new Promise((resolve, reject) => {
    parser.parseURL(source.link, (error, parsed) => {
      if(error) {
        reject("Ошибка парсинга: ", error);
      }
      else {
        parsed.id = source._id;
        resolve(parsed);
      };
    });
  });
};


function saveArticlesToDB(parsed, newsNum) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let entries = parsed.feed.entries;
    let numOfArticles = entries.length > newsNum ? newsNum : entries.length;

    for (let i = 0; i < numOfArticles; i++){
      new Article({
        sourceId:    parsed.id,
        title:       entries[i].title,
        link:        entries[i].link,
        description: entries[i].contentSnippet,
        date:        (new Date(Date.parse(entries[i].pubDate))).toUTCString()
      }).save(error => {
        if(error){
          reject("Ошибка сохранения в БД: ", error);
        }
        else {
          count++;
          if(count == numOfArticles) {
            resolve();
          };
        };
      });
    };
  });
};

function update() {
  return new Promise((resolve, reject) => {
    Source.find((error, sources) => {
      if (error) {
        reject("Ошибка обновления: ", error);
      }
      else {
        if(sources.length) {
          for(let i = 0; i < sources.length; i++) {
            parseSourceToVariable(sources[i])
              .then(parsed => {
                Article.remove({ sourceId: sources[i]._id }, () => {
                  saveArticlesToDB(parsed, maxNewsNum);
                })
              })
              .then(() => {
                if(i == sources.length - 1) {
                  resolve()
                }
              })
              .catch(error => reject("Ошибка обновления: ", error));
          }
        }
        else {
          resolve();
        }

      }
    })
  })
}

router.put('/update', (req, res) => {
  update()
    .then(() => res.redirect('/'))
    .catch(error => {
      console.log("Произошла ошибка." + error);
      res.redirect('/');
    })
});





//***************************
//***************************
//***************************
// /:id? (GET) section:
//***************************
//***************************
//***************************


function findSources(){
  return new Promise((resolve, reject) => {
    Source.find((error, sources) => {
      if(error) {
        reject(error);
      }
      else{
        resolve(sources);
      }
    });  
  });
};

function findArticlesBySourceId(srcId) {
  return new Promise((resolve, reject) => {
    Article.find({ sourceId: srcId }, (error, articles) => {
      if(error) {
        reject(error);
      }
      else {
        sortedArticles = articles.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });
        resolve(sortedArticles);
      };
    });
  });
};

router.get('/:id?', (req, res) => {
  data.title = "Новости";
  let id = req.params.id;
  findSources()
    .then(sources => {
      data.sources = sources;

      if (currentId) {
        var flag = false;
        for (source of sources) {
          if (currentId == source._id) {
            flag = true;
          }
        }
        if (!flag) {
          currentId = undefined;
        }
      }
      if(!id && !currentId && sources.length) {
        id = currentId = sources[0]._id;
      }
      else if(!id) {
        id = currentId;
      }
      data.currentId = id;
    })
    .then(() => findArticlesBySourceId(id))
    .then(articles => data.articles = articles)
    .then(() => res.render('news', data))
    .then(() => currentId = id)
    .catch(error => { 
      console.error("Произошла ошибка.", error);
      res.render('news', data); // <== Неопределенное поведение? (ошибка)
    });
});

