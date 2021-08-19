const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const svgRoute = require('./svg.route');
const cardRoute = require('./card.route');
const boardRoute = require('./board.route');
const listeningBoardRoute = require('./listeningBoard.route');
const dialogBoardRoute = require('./dialogBoard.route');
const readingBoardRoute = require('./readingBoard.route');
const topicRoute = require('./topic.route');
const chapterRoute = require('./chapter.route');
const lessonRoute = require('./lesson.route');
const vocabRoute = require('./vocab.route');
const searchRoute = require('./search.route');
const dictionaryRoute = require('./dictionary.route');
const subTestRoute = require('./subTest.route');
const trialTestRoute = require('./trial-test.route');
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
  },
  {
    path: '/vocabs',
    route: vocabRoute
  },
  {
    path: '/listening-boards',
    route: listeningBoardRoute
  },
  {
    path: '/dialog-boards',
    route: dialogBoardRoute
  },
  {
    path: '/reading-boards',
    route: readingBoardRoute
  },
  {
    path: '/search',
    route: searchRoute
  },
  {
    path: '/dictionary',
    route: dictionaryRoute
  },
  {
    path: '/sub-tests',
    route: subTestRoute
  },
  {
    path: '/trial-tests',
    route: trialTestRoute
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
