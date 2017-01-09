import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import * as actions from './redux/actions';
import { getDetailedProjectDiagramData } from './selectors';

export class DetailedDiagram extends Component {
  static propTypes = {
    diagram: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    diagramData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    console.log('props: ', props.diagramData);
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
    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', 600)
      .attr('height', 600)
    ;

    svg.append('svg:defs').selectAll('marker')
      .data(['action', 'component', 'misc'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 42)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    const data = this.props.diagramData;
    const chartWidth = 600;

    const sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 8).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(chartWidth / 2, chartWidth / 2))
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

    // const path = svg.append('svg:g').selectAll('path')
    //   .data(data.links)
    //   .enter()
    //   .append('svg:path')
    //   .attr('class', d => `link ${d.type}`)
    //   // .attr('stroke-width', 1)
    // ;

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links.filter(l => l.type !== 'f-f'))
      .enter()
      .append('line')
      .attr('stroke', 'black')
    ;

    const edgeLabelBg = svg.selectAll('.edge-label-bg')
      .data(data.links)
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
      .data(data.links)
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
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('svg:circle')
      .attr('class', d => `${d.type}-node`)
      .attr('r', d => d.r)
      .attr('stroke-width', d => (d.type === 'feature' ? 1 : 0))
      .attr('stroke', '#555')
      // .append('svg:title')
      // .text(d => d.name)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
    ;

    const nodeInner = svg.append('g')
      .attr('class', 'feature-node-inner')
      .selectAll('circle')
      .data(data.nodes.filter(n => n.type === 'feature'))
      .enter()
      .append('circle')
      .attr('r', d => d.r - 3)
      .attr('fill', '#aaccff')
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      )
    ;

    const nodeText = svg.selectAll('.node-text')
      .data(data.nodes)
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', 'node-text')
      .attr('fill', '#333')
      .attr('transform', d => `translate(0, ${d.type === 'feature' ? 2 : 12})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', 8)
      .text(d => d.name)
    ;

    const _this = this; // eslint-disable-line
    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      ;

      // path
      //   .attr('d', (d) => {
      //     const d3Path = d3.path();
      //     const curve = _this.getCurveData(d);
      //     d3Path.moveTo(curve.ax, curve.ay);
      //     d3Path.quadraticCurveTo(curve.mx, curve.my, curve.bx, curve.by);
      //     return d3Path.toString();
      //   })
      //   .attr('marker-end', function(d) { return 'url(#' + d.type + ')'; }) // eslint-disable-line
      //   .attr('stroke-width', 1)
      // ;

      // const getEdgeLabelPos = (d) => {
      //   const curve = _this.getCurveData(d);
      //   const jx = (curve.ax + curve.bx) / 2;
      //   const jy = (curve.ay + curve.by) / 2;
      //   const x = (curve.mx + jx) / 2;
      //   const y = (curve.my + jy) / 2;
      //   return { x, y };
      // };

      // edgeLabelBg
      //   .attr('cx', d => getEdgeLabelPos(d).x)
      //   .attr('cy', d => getEdgeLabelPos(d).y)
      // ;

      // edgeLabel
      //   .attr('x', d => getEdgeLabelPos(d).x)
      //   .attr('y', d => getEdgeLabelPos(d).y)
      // ;

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeInner
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

    const distanceMap = {
      child: 60,
      dep: 80,
      'f-f': 260,
    };

    sim
      .force('link')
      .links(data.links)
      .distance(d => distanceMap[d.type] || 100)
      .iterations(16)
    ;
    console.log('d3 did mount', this.d3Node);
  }

  render() {
    return (
      <div className="diagram-detailed-diagram diagram-container">
        Page Content: diagram/DetailedDiagram
        <div className="d3-node" ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    diagram: state.diagram,
    diagramData: getDetailedProjectDiagramData(state),
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
)(DetailedDiagram);
