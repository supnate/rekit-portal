import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;
const keywordSelector = (state, keyword) => keyword;
// const elementByIdSelector = state => state.elementById;
// const elementIdSelector = (state, elementId) => elementId;

function getMarks(feature, ele) {
  const marks = [];
  switch (ele.type) {
    case 'component':
      if (ele.connectToStore) marks.push('C');
      if (_.find(feature.routes, { component: ele.name })) marks.push('R');
      break;
    case 'action':
      if (ele.isAsync) marks.push('A');
      break;
    default:
      break;
  }
  return marks;
}

function getComponentsTreeData(feature) {
  const components = feature.components;

  return {
    key: `${feature.key}-components`,
    className: 'components',
    label: 'Components',
    icon: 'appstore-o',
    count: components.length,
    children: components.map(comp => ({
      key: comp.file,
      className: 'component',
      label: comp.name,
      icon: 'appstore-o',
      marks: getMarks(feature, comp),
    })),
  };
}

function getActionsTreeData(feature) {
  const actions = feature.actions;
  return {
    key: `${feature.key}-actions`,
    className: 'actions',
    label: 'Actions',
    icon: 'notification',
    count: actions.length,
    children: actions.map(action => ({
      key: action.file,
      className: 'action',
      label: action.name,
      icon: 'notification',
      marks: getMarks(feature, action),
    })),
  };
}

function getChildData(child) {
  return {
    key: child.file,
    className: child.children ? 'misc-folder' : 'misc-file',
    label: child.name,
    icon: child.children ? 'folder' : 'file',
    children: child.children ? child.children.map(getChildData) : null,
  };
}

function getMiscTreeData(feature) {
  const misc = feature.misc;
  return {
    key: `${feature.key}-misc`,
    className: 'misc',
    label: 'Misc',
    icon: 'folder',
    children: misc.map(getChildData),
  };
}

export const getExplorerTreeData = createSelector(
  featuresSelector,
  featureByIdSelector,
  (features, featureById) => {
    console.log('RE-COMPUTING tree data.');
    const nodes = features.map((fid) => {
      const feature = featureById[fid];
      return {
        key: feature.key,
        className: 'feature',
        label: feature.name,
        icon: 'book',
        children: [
          { label: 'Routes', key: `${fid}-routes`, className: 'routes', icon: 'share-alt', count: feature.routes.length },
          getActionsTreeData(feature),
          getComponentsTreeData(feature),
          getMiscTreeData(feature),
        ],
      };
    });

    return _.compact(nodes);
  }
);

export const getFilteredExplorerTreeData = createSelector(
  getExplorerTreeData,
  keywordSelector,
  (treeData, keyword) => {
    console.log('RE-COMPUTING filtered tree data.');
    
  }
);
