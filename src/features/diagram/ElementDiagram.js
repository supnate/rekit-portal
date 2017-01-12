import React, { PureComponent, PropTypes } from 'react';
import * as d3 from 'd3';
import { getElementDiagramData } from './selectors/getElementDiagramData';

export default class ElementDiagram extends PureComponent {
  static propTypes = {
    homeStore: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired,
  };

  componentDidMount() {
    const chartWidth = 800;
    const chartHeight = 600;

    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', '100%')
      .attr('height', chartHeight)
    ;

    // TODO: Why not equal to r?
    const refXMap = {
      'dep-on': 26,
      'dep-by': 76,
    };
    svg.append('svg:defs').selectAll('marker')
      .data(['dep-on', 'dep-by'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', d => refXMap[d])
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')
    ;

    const data = getElementDiagramData(this.props.homeStore, this.props.elementId);// this.props.diagramData;
console.log('data: ', data);

    const sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 15).strength(1).iterations(16))
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

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links.filter(l => l.type !== 'no-line'))
      .enter()
      .append('line')
      .attr('stroke', '#555')
      .attr('marker-end', l => (l.type === 'dep' ? `url(#${l.source === this.props.elementId ? 'dep-on' : 'dep-by'})` : ''))
    ;

    const nodeColorMap = {
      action: '#FF81C3',
      component: '#FF9900',
      misc: '#8D6E63',
      // feature: '#00C0FF',
      feature: '#FFFFFF',
    };

    const node = svg.append('g')
      .attr('class', 'feature-node')
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('stroke-width', d => (d.type === 'feature' ? 1 : 0))
      .attr('stroke', '#555')
      .attr('fill', d => nodeColorMap[d.type])
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    const featureNodeInner = svg.append('g')
      .attr('class', 'feature-node')
      .selectAll('circle')
      .data(data.nodes.filter(n => n.type === 'feature'))
      .enter()
      .append('circle')
      .attr('r', d => d.r - 2)
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
      .attr('fill', '#00C0FF')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
      );

    const nodeText = svg.selectAll('.node-text')
      // .data(data.nodes.filter(n => n.id === this.props.elementId))
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
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      ;

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      featureNodeInner
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
      ;

      nodeText
        .attr('x', d => d.x)
        .attr('y', d => d.y)
      ;
    }

    const distanceMap = {
      child: 100,
      dep: 100,
      'no-line': 260,
    };
    sim
      .nodes(data.nodes)
      .on('tick', ticked);

    sim
      .force('link')
      .links(data.links)
      .distance(d => distanceMap[d.type] || 50)
      // .iterations(16)
    ;
    console.log('d3 did mount', this.d3Node);
  }

  initDiagram() {
    
  }

  refreshDiagram(data) {

  }

  render() {
    return (
      <div className="diagram-element-diagram">
        <div className="d3-node" ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}
