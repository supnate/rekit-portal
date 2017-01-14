import {
  DefaultPage,
  TestCoveragePage,
} from './index';

export default {
  path: 'rekit-tools',
  name: 'Rekit tools',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'test-coverage-page', name: 'Test coverage page', component: TestCoveragePage },
  ],
};
