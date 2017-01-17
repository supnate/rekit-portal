import {
  ElementPage,
  RoutesPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: '/element/:feature/:file/:type', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes(/:type)', name: 'Routes page', component: RoutesPage },
  ],
};
