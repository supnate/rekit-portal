import {
  DefaultPage,
} from './index';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
