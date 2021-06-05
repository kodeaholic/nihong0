import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/baseComponent',
  title: 'Base components',
  component: dynamicWrapper(app, [], () => import('./components'))
});

export default app => createRoute(app, routesConfig);
