const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const svgRoute = require('./svg.route');
const cardRoute = require('./card.route');
const boardRoute = require('./board.route');
const topicRoute = require('./topic.route');
const chapterRoute = require('./chapter.route');
const lessonRoute = require('./lesson.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/svg',
    route: svgRoute
  },
  {
    path: '/cards',
    route: cardRoute
  },
  { 
    path: '/boards',
    route: boardRoute
  }
  ,
  {
    path: '/topics',
    route: topicRoute
  },
  {
    path: '/chapters',
    route: chapterRoute
  },
  {
    path: '/lessons',
    route: lessonRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
