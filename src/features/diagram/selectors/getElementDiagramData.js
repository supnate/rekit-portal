import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;
const elementByIdSelector = state => state.elementById;
const elementIdSelector = (state, elementId) => elementId;

export const getElementDiagramData = createSelector(
  featuresSelector,
  featureByIdSelector,
  elementByIdSelector,
  elementIdSelector,
  (features, featureById, elementById, elementId) => {
    const element = elementById[elementId];

    let links = [];
    let nodes = [];

    nodes.push({
      name: element.name,
      id: element.file,
      type: element.type,
      file: element.file,
      r: 40,
    });

    features.forEach((fid) => {
      const f = featureById[fid];

      [...f.components, ...f.actions, ...f.misc].forEach((item) => {
        if (!item.deps) return;

        const allDeps = [
          ...item.deps.actions,
          ...item.deps.components,
          ...item.deps.constants,
          ...item.deps.misc,
        ];

        allDeps.forEach((dep) => {
          if (item.file === element.file) {
            // if the element depends on others
            nodes.push({
              name: dep.name,
              id: dep.file,
              type: dep.type,
              file: dep.file,
              r: 10,
            });
            links.push({
              source: item.file,
              target: dep.file,
              type: 'dep',
            });
          } else if (dep.file === element.file) {
            // if other depends on the element
            nodes.push({
              name: item.name,
              id: item.file,
              type: item.type,
              file: item.file,
              r: 10,
            });
            links.push({
              source: item.file,
              target: element.file,
              type: 'dep',
            });
          }
        });
      });
    });

    // remove duplicated nodes
    nodes = _.uniqBy(nodes, 'id');
    links = _.uniqBy(links, l => `${l.source}->${l.target}`);

    // add features node
    nodes.forEach((n) => {
      console.log(elementById, n.id);
      const ele = elementById[n.id];
      if (ele.feature !== element.feature) {
        if (!_.find(nodes, { id: ele.feature })) {
          nodes.push({
            name: featureById[ele.feature].name,
            id: ele.feature,
            type: 'feature',
            r: 20,
          });

          links.push({
            source: element.file,
            target: ele.feature,
            type: 'no-line',
          });
        }
        links.push({
          source: ele.feature,
          target: n.id,
          type: 'child',
        });
      }
    });

    return { nodes, links };
  },
);
