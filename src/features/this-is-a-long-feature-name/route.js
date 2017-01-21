import {
  DefaultPage,
} from './';

export default {
  path: 'this-is-a-long-feature-name',
  name: 'This is a long feature name',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
