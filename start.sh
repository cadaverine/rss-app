echo "This script prepares the environment to run the application."

export SECRET=1
export PORT=8080
export NODE_ENV="development"
export MONGODB_URI="mongodb://localhost/rss-app-development"

echo `service mongodb start &`
echo `npm start`