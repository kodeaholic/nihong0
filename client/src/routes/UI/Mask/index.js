import { dynamicWrapper, createRoute } from '@/utils/core';

const routesConfig = app => ({
  path: '/mask',
  title: '遮罩',
  component: dynamicWrapper(app, [], () => import('./components'))
});

export default app => createRoute(app, routesConfig);
