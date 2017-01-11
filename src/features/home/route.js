import {
  ComponentView,
} from './index';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: '/component/:feature/:component(/:tabKey)', name: 'Component view', component: ComponentView },
  ],
};
