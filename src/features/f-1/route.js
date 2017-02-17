import {
  DefaultPage,
} from './';

export default {
  path: 'f-1',
  name: 'F 1',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
