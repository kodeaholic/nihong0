import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/searchBar',
  title: 'Search bar',
  component: dynamicWrapper(app, [], () => import('./components'))
});

export default app => createRoute(app, routesConfig);
