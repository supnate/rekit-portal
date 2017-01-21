import _ from 'lodash';
import { createSelector } from 'reselect';

const featuresSelector = state => state.features;
const featureByIdSelector = state => state.featureById;
const sizeSelector = (state, size) => size;

// constants
const outerStrokeWidth = 16;
const innerStrokeWidth = 16;
const outerGapAngle = Math.PI / 60;
const innerGapAngle = Math.PI / 360;

const circleGap = 2;
const textSpace = 20;

function flattenMiscFiles(arr) {
  return _.flatten(arr.map(item => (item.children ? flattenMiscFiles(item.children) : item)));
}

function getMiscWeight(misc) {
  // misc files weight should exclude 4 entry files: actions.js, index.js, reducer.js, constants.js
  let weight = misc.filter(f => /\.js$/.test(f.file)).length - 4;
  if (weight <= 0) weight = 1;
  return weight;
}

function scaleAngleByWeight(groups, gapAngle, sumAngle) {
  if (!groups.length) return;
  let isCircle = false;
  if (!sumAngle) {
    // if no sumAngle provided, it's a circle
    isCircle = true;
    sumAngle = Math.PI * 2;
  }
  sumAngle -= groups.length * gapAngle;
  if (!isCircle) sumAngle += gapAngle;

  const sumWeight = _.sumBy(groups, 'weight');

  let nextStartAngle = groups[0].startAngle;
  groups.forEach((group) => {
    group.startAngle = nextStartAngle;
    group.endAngle = group.startAngle + sumAngle * group.weight / sumWeight;
    nextStartAngle = group.endAngle + gapAngle;
  });
}

export const getOverviewChordDiagramData = createSelector(
  featuresSelector,
  featureByIdSelector,
  sizeSelector,
  (features, featureById, size) => {
    const circleRadius = size / 2 - textSpace;
    const outerRadius = circleRadius - outerStrokeWidth / 2;
    const innerRadius = circleRadius - outerStrokeWidth - circleGap - innerStrokeWidth / 2;
    const outerCount = features.length;
    const outerGroupAngleValue = Math.PI * 2 / outerCount - outerGapAngle;
    const x = size / 2;
    const y = size / 2;

    const outerGroups = features.map((fid, i) => {
      const feature = featureById[fid];
      const miscFiles = flattenMiscFiles(feature.misc);
      const startAngle = i * Math.PI * 2 / outerCount;
      const endAngle = startAngle + outerGroupAngleValue;
      return {
        id: fid,
        name: feature.name,
        type: 'feature',
        x,
        y,
        startAngle,
        endAngle,
        strokeWidth: outerStrokeWidth,
        radius: outerRadius,
        weight: getMiscWeight(miscFiles) + feature.components.length + feature.actions.length,
      };
    });

    scaleAngleByWeight(outerGroups, outerGapAngle);

    let innerGroups = [];
    outerGroups.forEach((outerGroup) => {
      const feature = featureById[outerGroup.id];
      const types = [];
      const miscFiles = flattenMiscFiles(feature.misc);
      if (feature.actions.length > 0) types.push({ name: 'actions', weight: feature.actions.length });
      if (feature.components.length > 0) types.push({ name: 'components', weight: feature.components.length });
      const miscWeight = getMiscWeight(miscFiles);
      if (miscWeight > 0) types.push({ name: 'misc', weight: miscWeight });

      const featureInnerGroups = [];
      types.forEach((type, i) => {
        const angleValue = (outerGroup.endAngle - outerGroup.startAngle - (types.length - 1) * innerGapAngle) / types.length;
        const startAngle = outerGroup.startAngle + (angleValue + innerGapAngle) * i;
        const endAngle = startAngle + angleValue;
        featureInnerGroups.push({
          id: `${outerGroup.id}-${type.name}`,
          feature: outerGroup.id,
          type: type.name,
          x,
          y,
          startAngle,
          endAngle,
          strokeWidth: innerStrokeWidth,
          radius: innerRadius,
          weight: type.weight,
        });
      });

      scaleAngleByWeight(featureInnerGroups, innerGapAngle, outerGroup.endAngle - outerGroup.startAngle);
      innerGroups = [...innerGroups, ...featureInnerGroups];
    });

    let links = [];
    const connectedFiles = {}; // all files that need to be connected
    const filesPos = {};
    features.forEach((fid) => {
      const f = featureById[fid];
      const allElements = [...f.components, ...f.actions, ...flattenMiscFiles(f.misc).filter(ele => /\.js$/.test(ele.file))];

      allElements.forEach((ele) => {
        if (!ele.deps) return;

        const allDeps = [
          ...ele.deps.actions,
          ...ele.deps.components,
          ...ele.deps.misc,
        ];

        if (!allDeps.length) return;

        connectedFiles[ele.file] = ele;
        allDeps.forEach((dep) => {
          connectedFiles[dep.file] = dep;

          links.push({
            source: ele,
            target: dep,
          });
        });
      });
    });

    innerGroups.forEach((innerGroup) => {
      const f = featureById[innerGroup.feature];
      let allEles = f[innerGroup.type];
      if (innerGroup.type === 'misc') allEles = flattenMiscFiles(allEles);
      const eles = allEles.filter(e => !!connectedFiles[e.file]); // all connected elements of the group
      const stepAngle = (innerGroup.endAngle - innerGroup.startAngle) / (eles.length + 1);
      const radius = innerRadius - innerStrokeWidth / 2;
      eles.forEach((e, i) => {
        const a = stepAngle * i + stepAngle + innerGroup.startAngle;
        const fx = x + radius * Math.cos(a);
        const fy = y + radius * Math.sin(a);
        filesPos[e.file] = {
          x: fx,
          y: fy,
          file: e.file,
          angle: a,
        };
      });
    });
    // links.forEach((link) => {
    //   if (!filesPos[link.source.file]) console.log('cant find pos for: ', `${link.source.feature}/${link.source.name}`);
    //   if (!filesPos[link.target.file]) console.log('cant find pos for: ', `${link.target.feature}/${link.target.name}`);
    // });

    // Convert links elements to coordinates
    links = links.filter(link => filesPos[link.source.file] && filesPos[link.target.file]).map((link) => {
      const source = filesPos[link.source.file];
      const target = filesPos[link.target.file];

      const x1 = source.x;
      const y1 = source.y;
      const x2 = target.x;
      const y2 = target.y;

      const jx = (x1 + x2) / 2;
      const jy = (y1 + y2) / 2;

      // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
      const a = x2 - x1;
      const asign = (a < 0 ? -1 : 1);
      const b = y2 - y1;
      // const bsign = (b < 0 ? -1 : 1);
      const theta = Math.atan(b / a);

      // Find the point that's perpendicular to J on side
      const costheta = asign * Math.cos(theta);
      const sintheta = asign * Math.sin(theta);

      const radius = innerRadius - innerStrokeWidth / 2;
      let ang = Math.abs(source.angle - target.angle);
      if (ang > Math.PI) ang -= Math.PI;
      const d1 = radius * Math.cos(ang);
      const d2 = radius - d1;
      const d3 = radius * Math.sin(ang);

      let d = d1;
      // if (d1 >= d2) d = d1;
      if (d > d3) d = d3;
      // const d = 40;
      d = 40;
      // if (ang > Math.PI / 1.5) d = 40;
      const m = source.angle < target.angle ? d : -d;
      // Find c and d
      const m1 = m * sintheta;
      const m2 = m * costheta;

      // Use c and d to find Kx and Ky
      const cpx = jx - m1;
      const cpy = jy + m2;

      // return { x2, x2, y1, y2, mx, my };
      return { x1, y1, x2, y2, cpx, cpy, source: link.source, target: link.target };
      // return true;
    });

    return { innerGroups, outerGroups, links };
  },
);
