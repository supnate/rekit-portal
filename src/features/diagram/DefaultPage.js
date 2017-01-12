import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { Button, Checkbox, Icon, Popover, Radio } from 'antd';
import * as actions from './redux/actions';
import { getProjectDiagramData } from './selectors';

import { execCmd, showCmdDialog } from '../rekit-cmds/redux/actions';
import { TestPage } from '../rekit-cmds';
import { Hello } from '../home';
import { PageNotFound } from '../common';
import { testAction } from '../common/redux/actions';

window.d3 = d3;

export class DefaultPage extends Component {
  static propTypes = {
    diagram: PropTypes.object.isRequired,
    diagramData: PropTypes.any,
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    console.log('props: ', props.diagramData);
  }

  // getDataSet() {
  //   const features = [
  //     {
  //       name: 'Home',
  //       components: [
  //         {
  //           name: 'DefaultPage', connect: false, urlPath: 'xxx',
  //           usings: [
  //             { feature: 'rekit-cmds', type: 'action', name: 'showCmdDialog' },
  //             { feature: 'rekit-cmds', type: 'action', name: 'execCmd' },
  //           ]
  //         },
  //         {
  //           name: 'Page2', connect: true, urlPath: false,
  //           usings: [
  //             { feature: 'rekit-cmds', type: 'action', name: 'showCmdDialog1' },
  //             { feature: 'rekit-cmds', type: 'action', name: 'execCmd1' },
  //           ]
  //         },
  //       ],
  //     },
  //     {
  //       name: 'Rekit cmds',
  //       actions: [
  //         { name: 'showCmdDialog' },
  //         { name: 'execCmd' },
  //         { name: 'showCmdDialog1' },
  //         { name: 'execCmd1' },
  //       ],
  //     },
  //   ];

  //   return {
  //     nodes: [
  //       { name: 'Home', r: 30 },
  //       { name: 'Rekit cmds', r: 30 },
  //       { name: 'Common', r: 30 },
  //       { name: 'Common2', r: 30 },
  //     ],
  //     links: [
  //       { source: 0, target: 1, type: 'action', pos: 1 },
  //       { source: 0, target: 1, type: 'component', pos: 2 },
  //       // { source: 0, target: 1, type: 'component', pos: 3 },
  //       // { source: 0, target: 1, type: 'component', pos: 4 },
  //       { source: 0, target: 1, type: 'component', pos: -1 },
  //       { source: 0, target: 1, type: 'component', pos: -2 },
  //       // { source: 0, target: 1, type: 'component', pos: -3 },
  //       // { source: 0, target: 1, type: 'component', pos: -4 },

  //       { source: 0, target: 2, type: 'component', pos: -1 },
  //       { source: 0, target: 2, type: 'component', pos: 1 },

  //       // { source: 0, target: 2, type: 'component', pos: 0 },

  //       { source: 0, target: 3, type: 'component', pos: 0 },

  //       { source: 1, target: 3, type: 'component', pos: -1 },
  //       { source: 1, target: 3, type: 'component', pos: 1 },
  //     ],
  //   };
  // }

  getCurveData(d) {
    const ax = d.source.x;
    const ay = d.source.y;
    const bx = d.target.x;
    const by = d.target.y;

    const jx = (ax + bx) / 2;
    const jy = (ay + by) / 2;
    // console.log(mx, my);
    // We need a and b to find theta, and we need to know the sign of each to make sure that the orientation is correct.
    const a = bx - ax;
    const asign = (a < 0 ? -1 : 1);
    const b = by - ay;
    // const bsign = (b < 0 ? -1 : 1);
    const theta = Math.atan(b / a);

    // Find the point that's perpendicular to J on side
    const costheta = asign * Math.cos(theta);
    const sintheta = asign * Math.sin(theta);

    const m = 30 * d.pos;
    // Find c and d
    const c1 = m * sintheta;
    const d1 = m * costheta;

    // Use c and d to find Kx and Ky
    const mx = jx - c1;
    const my = jy + d1;

    return { ax, bx, ay, by, mx, my };
  }

  componentDidMount() {
    const chartWidth = 800;
    const chartHeight = 800;

    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', '100%')
      .attr('height', chartHeight)
    ;

    svg.append('svg:defs').selectAll('marker')
      .data(['action', 'component', 'misc'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 62)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    const data = this.props.diagramData;


    const sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 8).strength(1).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
      ;

    function dragstarted(d) {
      if (!d3.event.active) sim.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) sim.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const path = svg.append('svg:g').selectAll('path')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('svg:path')
      .attr('class', d => `link ${d.type}`)
      // .attr('stroke-width', 1)

    ;

    const edgeLabelBg = svg.selectAll('.edge-label-bg')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('g')
      .append('circle')
      .attr('class', d => `edge-label-bg ${d.type}`)
      // .attr('fill', '#ff0000')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('r', 6)
      // .attr('height', 12)
      // .attr('transform', 'translate(-6, -10)')
    ;

    const edgeLabel = svg.selectAll('.edge-label')
      .data(data.links.filter(d => d.type !== 'f-f'))
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'edge-label')
      .attr('fill', '#ffffff')
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('font-size', 7)
      .text(d => d.count);

    const node = svg.append('g')
      .attr('class', 'feature-node')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
    ;
      // .call(d3.drag()
      // .on('start', dragstarted)
      // .on('drag', dragged)
      // .on('end', dragended));

    const nodeInner = svg.append('g')
      .attr('class', 'feature-node-inner')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r - 3)
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended))
    ;

    const nodeText = svg.selectAll('.node-text')
      .data(data.nodes)
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'node-text')
      .attr('fill', '#333')
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .text(d => d.name)
    ;

    const _this = this; // eslint-disable-line
    function ticked() {
      path
        .attr('d', (d) => {
          const d3Path = d3.path();
          const curve = _this.getCurveData(d);
          d3Path.moveTo(curve.ax, curve.ay);
          d3Path.quadraticCurveTo(curve.mx, curve.my, curve.bx, curve.by);
          return d3Path.toString();
        })
        .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; }) // eslint-disable-line
        .attr('stroke-width', 1)
      ;

      const getEdgeLabelPos = (d) => {
        const curve = _this.getCurveData(d);
        const jx = (curve.ax + curve.bx) / 2;
        const jy = (curve.ay + curve.by) / 2;
        const x = (curve.mx + jx) / 2;
        const y = (curve.my + jy) / 2;
        return { x, y };
      };

      edgeLabelBg
        .attr('cx', d => getEdgeLabelPos(d).x)
        .attr('cy', d => getEdgeLabelPos(d).y)
      ;

      edgeLabel
        .attr('x', d => getEdgeLabelPos(d).x)
        .attr('y', d => getEdgeLabelPos(d).y)
      ;

      node
        .attr('fill', '#ffffff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeInner
        .attr('fill', '#aaccff')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeText
        .attr('x', d => d.x)
        .attr('y', d => d.y)
      ;
    }

    sim
      .nodes(data.nodes)
      .on('tick', ticked);

    sim
      .force('link')
      .links(data.links)
      .distance(d => (d.type === 'f-f' ? 300 : 200))
      .iterations(16)
    ;
    console.log('d3 did mount', this.d3Node);
  }

  handleSelectAll(evt) {
    console.log('select all: ', evt);
  }

  renderFeatureSelect() {
    const { features, featureById } = this.props.home;
    const options = features.map(fid => ({
      label: featureById[fid].name,
      value: fid,
    }));

    const content = (
      <div className="diagram-default-page-feature-selector">
        <Checkbox.Group options={options} />
      </div>
    );
    return (
      <Popover content={content}>
        <Button type="ghost">Selected: 5 features <Icon type="down" /></Button>
      </Popover>
    );
  }

  renderFocusedFeatureSelect() {
    const { features, featureById } = this.props.home;

    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    };

    const content = (
      <Radio.Group className="feature-selector-list">
        {features.map(fid => (
          <Radio style={radioStyle} value={fid} key={fid}>{featureById[fid].name}</Radio>
        ))}
      </Radio.Group>
    );

    return (
      <Popover content={content}>
        <Button type="ghost">Focus: none <Icon type="down" /></Button>
      </Popover>
    );
  }

  render() {
    return (
      <div className="diagram-default-page diagram-container">
        <div className="diagram-page-header">
          {this.renderFocusedFeatureSelect()}
          {this.renderFeatureSelect()}
          <h2>Project Overview</h2>
        </div>
        <div className="d3-node" ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
    diagram: state.diagram,
    diagramData: getProjectDiagramData(state.home),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
