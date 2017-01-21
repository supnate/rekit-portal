import {
  DefaultPage,
} from './';

export default {
  path: 'f-2',
  name: 'F 2',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
