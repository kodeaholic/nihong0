import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/toolbar',
  title: 'Toolbar',
  component: dynamicWrapper(app, [import('./model')], () => import('./components'))
});

export default app => createRoute(app, routesConfig);
