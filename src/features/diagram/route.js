import {
  DetailedDiagram,
} from './';

export default {
  path: 'diagram',
  name: 'Diagram',
  childRoutes: [,
    { path: 'detailed', name: 'Detailed diagram', component: DetailedDiagram },
  ],
};
