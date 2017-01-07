import {
  TestPage,
} from './index';

export default {
  path: 'rekit-cmds',
  name: 'Rekit cmds',
  childRoutes: [
    { path: 'test-page', name: 'Test page', component: TestPage },
  ],
};
