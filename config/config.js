var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'rss-app'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/rss-app-development'
  },
  production: {
    root: rootPath,
    app: {
      name: 'rss-app'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/rss-app-production'
  },
  test: {
    root: rootPath,
    app: {
      name: 'rss-app'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/rss-app-test'
  }
  
};

module.exports = config[env];
