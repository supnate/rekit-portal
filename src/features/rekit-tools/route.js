import {
  TestCoveragePage,
  BuildPageJs,
} from './index';

export default {
  path: 'tools',
  name: 'Rekit tools',
  childRoutes: [
    { path: 'test-coverage-page', name: 'Test coverage page', component: TestCoveragePage },
    { path: 'build', name: 'Build page js', component: BuildPageJs },
  ],
};
