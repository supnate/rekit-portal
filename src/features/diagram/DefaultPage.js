import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import * as actions from './redux/actions';
window.d3 = d3;

export class DefaultPage extends Component {
  static propTypes = {
    diagram: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  getDataSet() {
    const features = [
      {
        name: 'Home',
        components: [
          {
            name: 'DefaultPage', connect: false, urlPath: 'xxx',
            usings: [
              { feature: 'rekit-cmds', type: 'action', name: 'showCmdDialog' },
              { feature: 'rekit-cmds', type: 'action', name: 'execCmd' },
            ]
          },
          {
            name: 'Page2', connect: true, urlPath: false,
            usings: [
              { feature: 'rekit-cmds', type: 'action', name: 'showCmdDialog1' },
              { feature: 'rekit-cmds', type: 'action', name: 'execCmd1' },
            ]
          },
        ],
      },
      {
        name: 'Rekit cmds',
        actions: [
          { name: 'showCmdDialog' },
          { name: 'execCmd' },
          { name: 'showCmdDialog1' },
          { name: 'execCmd1' },
        ],
      },
    ];

    return {
      nodes: [
        { name: 'Home', r: 30 },
        { name: 'Rekit cmds', r: 30 },
        { name: 'Common', r: 30 },
        { name: 'Common2', r: 30 },
      ],
      links: [
        { source: 0, target: 1, type: 'action', linknum: 1 },
        { source: 0, target: 1, type: 'component', linknum: 2 },
        // { source: 0, target: 1, type: 'component', linknum: 3 },
        // { source: 0, target: 1, type: 'component', linknum: 4 },
        { source: 0, target: 1, type: 'component', linknum: -1 },
        { source: 0, target: 1, type: 'component', linknum: -2 },
        // { source: 0, target: 1, type: 'component', linknum: -3 },
        // { source: 0, target: 1, type: 'component', linknum: -4 },

        { source: 0, target: 2, type: 'component', linknum: -1 },
        { source: 0, target: 2, type: 'component', linknum: 1 },

        // { source: 0, target: 2, type: 'component', linknum: 0 },

        { source: 0, target: 3, type: 'component', linknum: 0 },

        { source: 1, target: 3, type: 'component', linknum: -1 },
        { source: 1, target: 3, type: 'component', linknum: 1 },
      ],
    };
  }

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

    const m = 50 * d.linknum;
    // Find c and d
    const c1 = m * sintheta;
    const d1 = m * costheta;

    // Use c and d to find Kx and Ky
    const mx = jx - c1;
    const my = jy + d1;

    return { ax, bx, ay, by, mx, my };
  }

  componentDidMount() {
    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', 600)
      .attr('height', 600)
    ;

    svg.append('svg:defs').selectAll('marker')
      .data(['action', 'component', 'store', 'constant'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', -4)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    const data = this.getDataSet();
    const chartWidth = 600;

    // const forceManyBody = d3.forceManyBody();
    // forceManyBody.distanceMin(200);
    const sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.index))
      .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
      // .force('gravity', 0.2)
      // .gravity(0.2)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(chartWidth / 2, chartWidth / 2))
      // .force('y', d3.forceY(0))
      // .force('x', d3.forceX(0))
      ;

    const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', 'black')
    ;
    const path = svg.append('svg:g').selectAll('path')
      .data(data.links)
      .enter()
      .append('svg:path')
      .attr('class', d => `link ${d.type}`)
      // .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; });
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

    const edgeLabelBg = svg.selectAll('.edge-label-bg')
      .data(data.links)
      .enter()
      .append('g')
      .append('rect')
      .attr('class', 'edge-label-bg')
      .attr('fill', '#ffffff')
      .attr('width', 12)
      .attr('height', 12)
      .attr('transform', 'translate(-6, -10)')
    ;
    const edgeLabel = svg.selectAll('.edge-label')
      .data(data.links)
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'edge-label')
      .attr('fill', '#666666')
      .attr('transform', 'translate(-6, 0)')
      .attr('font-size', 10)
      .text(d => d.linknum);

    const node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

    const _this = this; // eslint-disable-line
    function ticked() {
      path.attr('d', (d) => {
        const d3Path = d3.path();
        const curve = _this.getCurveData(d);

        d3Path.moveTo(curve.ax, curve.ay);
        d3Path.quadraticCurveTo(curve.mx, curve.my, curve.bx, curve.by);
        return d3Path.toString();
      });

      const getEdgeLabelPos = (d) => {
        const curve = _this.getCurveData(d);
        const jx = (curve.ax + curve.bx) / 2;
        const jy = (curve.ay + curve.by) / 2;
        const x = (curve.mx + jx) / 2;
        const y = (curve.my + jy) / 2;
        return { x, y };
      };

      edgeLabelBg
        .attr('x', d => getEdgeLabelPos(d).x)
        .attr('y', d => getEdgeLabelPos(d).y)
      ;

      edgeLabel
        .attr('x', d => getEdgeLabelPos(d).x)
        .attr('y', d => getEdgeLabelPos(d).y)
      ;

      node
        .attr('fill', 'cyan')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;
    }

    sim
      .nodes(data.nodes)
      .on('tick', ticked);

    sim
      .force('link')
      .links(data.links)
      .distance(200)
      .iterations(16)
    ;
    console.log('d3 did mount', this.d3Node);
  }

  render() {
    return (
      <div className="diagram-default-page">
        Page Content: diagram/DefaultPage
        <div className="d3-node" ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    diagram: state.diagram,
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
