const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
const env = process.env.NODE_ENV || 'development';


const config = {
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
    db: process.env.MONGODB_URI
  },
  test: {
    root: rootPath,
    app: {
      name: 'rss-app'
    },
    port: process.env.PORT || 3000,
    db: process.env.MONGODB_URI
  }
};


module.exports = config[env];
