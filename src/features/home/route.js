import {
  ElementPage,
} from './index';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: '/element/:feature/:file/:type', name: 'Element page', component: ElementPage },
  ],
};
