import {
  DefaultPage,
} from './';

export default {
  path: 'f-345',
  name: 'F 345',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
