import React, { PureComponent, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import * as d3 from 'd3';
import { Checkbox } from 'antd';
import { getElementDiagramData } from './selectors/getElementDiagramData';
import colors from './colors';

const chartWidth = 600;
const chartHeight = 500;

export default class ElementDiagram extends PureComponent {
  static propTypes = {
    homeStore: PropTypes.object.isRequired,
    elementId: PropTypes.string.isRequired,
  };

  state = {
    showText: true,
  };

  componentDidMount() {
    this.svg = d3
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
    this.svg.append('svg:defs').selectAll('marker')
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

    // this.link = this.svg.append('g');
    // this.node = this.svg.append('g');
    // this.featureNodeInner = this.svg.append('g');
    // this.nodeText = this.svg.append('g');

    this.refresh(this.props);
  }

  componentWillReceiveProps(nextProps) {
    console.log('receive props.');
    this.refresh(nextProps);
  }

  @autobind
  dragstarted(d) {
    if (!d3.event.active) this.sim.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  @autobind
  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  @autobind
  dragended(d) {
    if (!d3.event.active) this.sim.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  refresh(props) {
    const data = getElementDiagramData(props.homeStore, props.elementId);// this.props.diagramData;
    console.log('refresh data: ', data);

    this.svg.selectAll('g').remove();

    this.sim = d3
      .forceSimulation()
      .force('link', d3.forceLink().id(d => d.id))
      .force('collide', d3.forceCollide(d => d.r + 15).strength(1).iterations(16))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(chartWidth / 2, chartHeight / 2))
    ;

    const link = this.svg.append('g')
      .selectAll('line')
      .attr('class', 'line')
      .data(data.links.filter(l => l.type !== 'no-line'))
      .enter()
      .append('line')
      .attr('stroke', '#555')
      .attr('stroke-dasharray', d => (d.target === props.elementId ? '3, 3' : ''))
      .attr('marker-end', l => (l.type === 'dep' ? `url(#${l.source === props.elementId ? 'dep-on' : 'dep-by'})` : ''))
    ;

    // const nodeColorMap = {
    //   action: '#FF81C3',
    //   component: '#FF9900',
    //   misc: '#8D6E63',
    //   // feature: '#00C0FF',
    //   feature: '#FFFFFF',
    // };

    const node = this.svg.append('g')
      .selectAll('circle')
      .attr('class', 'element-node')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('r', d => d.r)
      .attr('stroke-width', d => (d.type === 'feature' ? 1 : 0))
      .attr('stroke', '#555')
      .attr('cursor', 'pointer')
      .attr('fill', d => colors[d.type])
      .on('click', this.handleNodeClick)
    ;
    node
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
    ;

    const featureNodeInner = this.svg.append('g')
      .selectAll('circle')
      .attr('class', 'element-node-inner')
      .data(data.nodes.filter(n => n.type === 'feature'))
      .enter()
      .append('circle')
      .attr('r', d => d.r - 2)
      .attr('cursor', 'pointer')
      .attr('stroke-width', 1)
      .attr('stroke', '#555')
      .attr('fill', '#00C0FF')
      .on('click', this.handleNodeClick)
    ;
    featureNodeInner
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
    ;

    const nodeText = this.svg.append('g')
      .selectAll('.node-text')
      // .data(data.nodes.filter(n => n.id === this.props.elementId))
      .data(data.nodes)
      .enter()
      .append('g')
      .append('svg:text')
      .attr('class', d => `element-node-text ${d.id !== props.elementId && d.type !== 'feature' ? 'dep-node' : ''}`)
      .attr('transform', 'translate(0, 2)')
      .attr('text-anchor', 'middle')
      .attr('cursor', 'pointer')
      .attr('font-size', 8)
      .text(d => d.name)
      .on('click', this.handleNodeClick)
    ;
    nodeText
      .call(d3.drag()
        .on('start', this.dragstarted)
        .on('drag', this.dragged)
        .on('end', this.dragended)
      )
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

    this.sim
      .nodes(data.nodes)
      .on('tick', ticked);

    this.sim
      .force('link')
      .links(data.links)
      .distance(d => distanceMap[d.type] || 50)
      // .iterations(16)
    ;
  }

  @autobind
  handleNodeClick(node) {
    const home = this.props.homeStore;
    const ele = home.elementById[node.id];
    if (ele.type !== 'feature') {
      const file = ele.file.replace(`${home.projectRoot}/src/features/${ele.feature}/`, '');
      browserHistory.push(`/element/${ele.feature}/${encodeURIComponent(file)}/diagram`);
    }
    console.log('node click: ', ele);
  }

  @autobind
  handleToggleText(evt) {
    this.setState({
      showText: evt.target.checked,
    });
  }
  render() {
    return (
      <div className="diagram-element-diagram">
        <div className="diagram-header">
          <Checkbox checked={this.state.showText} onChange={this.handleToggleText}>Show text</Checkbox>
        </div>
        <div className={`d3-node ${!this.state.showText ? 'no-text' : ''}`} ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}
