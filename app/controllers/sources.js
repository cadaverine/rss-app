var mongoose = require('mongoose'),
    Source = mongoose.model('Source'),
    Article = mongoose.model('Article'),
    parser = require("rss-parser");
    

var sourceVar = { sources: [] };

var User = mongoose.model('User');
var currentUser;


//***************************
//***************************
//***************************
// "getSources" section:
//***************************
//***************************
//***************************


module.exports.getSources = (req, res) => {
  Source.remove({ link: "http://www.cnews.ru/inc/rss/news.xml" }, () => {});
  res.redirect('/sources/my');
}


module.exports.getMySources = (req, res) => {
  sourceVar["title"] = "Источники";
  sourceVar["page"] = "my_sources";
  User
    .findOne({_id: req.user._id})
    .populate('sources')
    .exec((error, user) => {
      if (error) { 
        req.flash('error_msg', error);
        res.render('sources', sourceVar);
      }
      else {
        sourceVar["sources"] = user.sources.map(source => {
            return {
              id: source._id,
              title: source.title,
              link: source.link,
              description: source.description
            }
          })
        res.render('sources', sourceVar); 
      }      
    })
}


module.exports.getAllSources = (req, res) => {
  sourceVar["title"] = "Источники";
  sourceVar["page"] = "all_sources";
  sourceVar["mySources"] = req.user.sources;

  Source.find({}, (error, sources) => {
    if(error) {
      throw error;
    }
    sourceVar["sources"] = sources.map(source => {
        return {
          id: source._id,
          title: source.title,
          link: source.link,
          description: source.description
        }
      })
    res.render('sources', sourceVar);
  })
}




//***************************
//***************************
//***************************
// "addSource" section:
//***************************
//***************************
//***************************


function checkLink(linkToCheck) {
  return new Promise((resolve, reject) => {
    if(!linkToCheck) reject("Введите URL.");
    Source.findOne({ link: linkToCheck }, (error, source) => {
      if(error) {
        reject(error);
      }
      else if(source) {
        let contains = currentUser.sources.indexOf(source._id);
        if(contains == -1) {
          currentUser.sources.push(source._id);
          currentUser.save((err) => {
            if(err) {
              reject(err);
            }
            else {
              reject();
            }
          })
        }
        else {
          reject('Этот URL уже добавлен.');
        }
      }
      else {
        resolve();
      }
    })
  })
}


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

function addSourceToDB(parsedObj){
  return new Promise((resolve, reject) => {
    new Source({
      link: parsedObj.rssLink,
      title: parsedObj.feed.title != "" ? parsedObj.feed.title : parsedObj.feed.link,
      description: parsedObj.feed.description
    }).save((error, source) => {
      if(error) {
        reject(error);
      }
      else {
        currentUser.sources.push(source._id);
        currentUser.save((err) => {
          if(err) {
            reject(err);
          }
          else {
            resolve();
          }
        })
      }
    })
  })
}

module.exports.addSource = (req, res) => {
  currentUser = req.user;
  checkLink(req.body.link)
    .then(() => parseLinkToVariable(req.body.link))
    .then(parsed => addSourceToDB(parsed))
    .then(() => res.redirect('/sources'))
    .catch(error => {
      // sourceVar.err = error;
      req.flash('error_msg', error);
      res.redirect('/sources/my');
  });
}


//***************************
//***************************
//***************************
// "AddSourceFromDB" section:
//***************************
//***************************
//***************************


module.exports.AddSourceFromDB = (req, res) => {

  var contains = req.user.sources.indexOf(req.params.id);
  if (contains == -1) {
    req.user.sources.push(req.params.id);
    req.user.save((err) => {
      if(err) {
        req.flash('error_msg', err);
        res.redirect('/sources/all');
      }
      else {
        res.redirect('/sources/all');
      }
    })
  }
  else {
    req.flash('error_msg', "Этот URL уже добавлен.");
    res.redirect('/sources/all');
  }
}





//***************************
//***************************
//***************************
// "deleteSource" section:
//***************************
//***************************
//***************************


module.exports.deleteSource = (req, res) => {
  var i = req.user.sources.indexOf(req.params.id);
  req.user.sources.splice(i, 1);
  req.user.save((err) => {
    if(err) {
      req.flash('error_msg', err);
      res.redirect('/sources/my');
    }
    else {
      res.redirect('/sources/my');
    }
  })
}

