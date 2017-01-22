import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { Checkbox, Col, Icon, Popover, Row } from 'antd';
import { getOverviewChordDiagramData } from './selectors/getOverviewChordDiagramData';

export class OverviewChordDiagram extends PureComponent {
  static propTypes = {
    home: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired, // eslint-disable-line
  };

  static defaultProps = {
    size: 500,
  };

  constructor(props) {
    super(props);
    this.state.selectedFeatures = props.home.features;
  }

  state = {
    sameFeatureDepsVisible: false,
    selectedFeatures: [],
  };

  componentDidMount() {
    this.refreshDiagram();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('component did update.');
    const props = this.props;
    const state = this.state;
    if (prevProps.home !== props.home || prevProps.size !== props.size || prevState.selectedFeatures !== state.selectedFeatures) {
      this.refreshDiagram();
    }
  }


  refreshDiagram() {
    console.log(this.props.diagramData);
    // const { diagramData } = this.props;
    const { home, size } = this.props;

    const diagramData = getOverviewChordDiagramData(home, size, this.state.selectedFeatures);
    if (this.svg) {
      this.svg.remove();
    }
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', this.props.size)
      .attr('height', this.props.size)
    ;

    this.svg.append('svg:defs').selectAll('marker')
      .data(['marker'])
      .enter()
      .append('svg:marker')
      .attr('id', String)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 10)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      // .style('fill', '#bbb')
      .attr('class', d => `triangle-marker ${d}`)
      .attr('orient', 'auto')
      .append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5');

    this.drawGroups(diagramData.outerGroups);
    this.drawGroups(diagramData.innerGroups);

    this.svg
      .append('svg:g')
      .selectAll('text')
      .data(diagramData.outerGroups)
      .enter()
      .append('svg:text')
      .style('font-size', 12)
      .style('fill', '#777')
      .style('overflow', 'hidden')
      .style('text-overflow', 'ellipsis')
      .style('cursor', 'default')
      .attr('dy', -12)
      .attr('class', d => `text-node feature-${d.id}`)
      .append('textPath')
      .attr('xlink:href', d => `#group-${d.type}-${d.id}`)
      .style('text-anchor', 'start')
      .attr('startOffset', '0%')
      .text(d => d.name)

      // .append('svg:title')
      // .text(d => d.name)
    ;

    function getLinkCssClass(d) {
      const source = d.source;
      const target = d.target;
      const sf = source.feature;
      const tf = target.feature;
      let st = source.type;
      let tt = target.type;
      // here source or target is the rekit element, type property doesn't have 's'.
      if (st === 'component' || st === 'action') st += 's';
      if (tt === 'component' || tt === 'action') tt += 's';
      const cssClass = [
        `from-feature-${sf}`,
        `from-feature-type-${st}`,
        `to-feature-${tf}`,
        `to-feature-type-${tt}`,
      ];

      if (source.feature === target.feature) {
        cssClass.push('same-feature-dep');
      }

      cssClass.push('link-line');
      return cssClass.join(' ');
    }

    this.svg
      .append('svg:g')
      .selectAll('path')
      .data(diagramData.links)
      .enter()
      .append('svg:path')
      .attr('marker-end', 'url(#marker)') // eslint-disable-line
      .attr('class', getLinkCssClass)
      .attr('d', (d) => {
        // const featureAngle = Math.PI * 2 / data.length - gapAngle;

        // const curve = this.getCurveData(d);
        const d3Path = d3.path();
        d3Path.moveTo(d.x1, d.y1);
        d3Path.quadraticCurveTo(d.cpx, d.cpy, d.x2, d.y2);
        return d3Path;
      })
      // .append('svg:title')
      // .text(l => `${l.source.file} -> ${l.target.file}`)
    ;
  }

  @autobind
  handleGroupMouseover(d) {
    console.log('mouseover: ', d);

    this.svg.selectAll('.group-node, .link-line, .text-node').style('opacity', 0.15);
    const highlighted = [];
    // const halfHighlighted = [];
    const dashed = [];
    if (d.type === 'feature') {
      highlighted.push(`.group-node.feature-${d.id}`);
      highlighted.push(`.group-node.actions-of-${d.id}`);
      highlighted.push(`.group-node.components-of-${d.id}`);
      highlighted.push(`.group-node.misc-of-${d.id}`);

      highlighted.push(`.link-line.from-feature-${d.id}`);
      highlighted.push(`.link-line.to-feature-${d.id}`);
      highlighted.push(`.text-node.feature-${d.id}`);

      dashed.push(`.link-line.to-feature-${d.id}`);
    } else {
      highlighted.push(`.group-node.feature-${d.feature}`);
      highlighted.push(`.group-node.${d.type}-of-${d.feature}`);

      highlighted.push(`.link-line.from-feature-${d.feature}.from-feature-type-${d.type}`);
      highlighted.push(`.link-line.to-feature-${d.feature}.to-feature-type-${d.type}`);

      highlighted.push(`.text-node.feature-${d.feature}`);

      dashed.push(`.link-line.to-feature-${d.feature}.to-feature-type-${d.type}`);
    }

    if (highlighted.length) this.svg.selectAll(highlighted.join(',')).style('opacity', 1);
    // if (halfHighlighted.length) this.svg.selectAll(halfHighlighted.join(',')).style('opacity', 0.5);
    if (dashed.length) this.svg.selectAll(dashed.join(',')).style('stroke-dasharray', '3, 3');
  }

  @autobind
  handleGroupMouseout(d) {
    console.log('mouseout: ', d);
    this.svg.selectAll('.group-node, .link-line, .text-node').style('opacity', 1);
    this.svg.selectAll('.link-line').style('stroke-dasharray', '');
  }

  drawGroups(groups) {
    function getCssClass(d) {
      let cssClass = `group-${d.type}`;
      if (d.type === 'feature') cssClass += ` feature-${d.id}`;
      else cssClass += ` ${d.type}-of-${d.feature}`;
      cssClass += ' group-node';
      return cssClass;
    }
    this.svg
      .append('svg:g')
      .selectAll('path')
      .data(groups)
      .enter()
      .append('svg:path')
      .attr('id', d => `group-${d.type}-${d.id}`)
      .attr('stroke-width', d => d.strokeWidth)
      .attr('class', getCssClass)
      .attr('fill', 'transparent')
      .attr('d', (d) => {
        // const featureAngle = Math.PI * 2 / groups.length - gapAngle;

        const d3Path = d3.path();
        d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
        return d3Path;
      })
      .on('mouseover', this.handleGroupMouseover)
      .on('mouseout', this.handleGroupMouseout)
    ;
  }

  @autobind
  handleToggleSameFeatureDepsVisible(evt) {
    this.setState({
      sameFeatureDepsVisible: evt.target.checked,
    });
  }

  @autobind
  handleSelectFeature(fid, selected) {
    console.log('select feature: ', fid, selected);
    const newSelected = [...this.state.selectedFeatures];
    console.log(this.state.selectedFeatures);
    if (!selected) _.pull(newSelected, fid);
    else newSelected.push(fid);
    console.log(newSelected);
    this.setState({
      selectedFeatures: newSelected,
    });
  }

  renderFeaturesSelect() {
    const { features, featureById } = this.props.home;
    return (
      <ul className="diagram-overview-chord-diagram-feature-select">
      {
        features.map((fid) => {
          const selected = this.state.selectedFeatures;
          const checked = !selected.length || selected.includes(fid);
          const disabled = checked && selected.length === 1;
          return (
            <li key={fid}>
              <Checkbox
                checked={checked}
                disabled={disabled}
                onChange={evt => this.handleSelectFeature(fid, evt.target.checked)}
              >{featureById[fid].name}</Checkbox>
            </li>
          );
        })
      }
      </ul>
    );
  }

  render() {
    let featureSelectLabel = 'All features';
    if (this.state.selectedFeatures.length === 1) {
      featureSelectLabel = this.props.home.featureById[this.state.selectedFeatures[0]].name;
    } else if (this.state.selectedFeatures.length < this.props.home.features.length) {
      featureSelectLabel = `${this.state.selectedFeatures.length} features`;
    }
    return (
      <div className="diagram-overview-chord-diagram">
        <Row>
          <Col span="12">
            <Checkbox checked={this.state.sameFeatureDepsVisible} onChange={this.handleToggleSameFeatureDepsVisible}>
              <span title="Whether to show internal dependencies links inside a feature.">Show internal deps</span>
            </Checkbox>
          </Col>
          <Col span="12" style={{ textAlign: 'right' }}>
            <Popover placement="bottomRight" content={this.renderFeaturesSelect()}>
              <span style={{ cursor: 'default' }}>{featureSelectLabel} </span><Icon type="caret-down" style={{ fontSize: 10 }} />
            </Popover>
          </Col>
        </Row>
        <div className={`svg-container ${this.state.sameFeatureDepsVisible ? 'same-feature-deps-visible' : ''}`} ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state, props) {
  return {
    home: state.home,
    // diagramData: getOverviewChordDiagramData(state.home, props.size),
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OverviewChordDiagram);
