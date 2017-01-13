import {
  ElementPage,
} from './index';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: '/component/:feature/:component(/:tabKey)', name: 'Element page', component: ElementPage },
  ],
};
