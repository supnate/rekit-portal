import {
  DefaultPage,
} from './index';

export default {
  path: 'rekit-cmds',
  name: 'Rekit cmds',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
  ],
};
