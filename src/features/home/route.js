import {
  ElementPage,
  RoutesPage,
  HomePage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: 'home', name: 'Home page', component: HomePage, isIndex: true },
    { path: '/element/:feature/:file(/:type)', name: 'Element page', component: ElementPage },
    { path: '/:feature/routes(/:type)', name: 'Routes page', component: RoutesPage },
  ],
};
