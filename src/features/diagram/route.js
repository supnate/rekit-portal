import {
  DefaultPage,
  DetailedDiagram,
} from './index';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'detailed', name: 'Detailed diagram', component: DetailedDiagram },
  ],
};
