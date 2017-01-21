import React, { PureComponent, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import { colors } from '../common';
import { getOverviewChordDiagramData } from './selectors/getOverviewChordDiagramData';

class OverviewChordDiagram extends PureComponent {
  static propTypes = {
    diagramData: PropTypes.object.isRequired,
    size: PropTypes.number.isRequired, // eslint-disable-line
    sameFeatureDepVisible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    sameFeatureDepVisible: false,
    size: 500,
  };

  componentDidMount() {
    console.log(this.props.diagramData);
    const { diagramData } = this.props;
    this.svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', this.props.size)
      .attr('height', this.props.size)
    ;
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
      .append('textPath')
      .attr('xlink:href', d => `#group-${d.type}-${d.id}`)
      .style('text-anchor', 'start')
      .attr('startOffset', '0%')
      .text(d => d.name)
      // .append('svg:title')
      // .text(d => d.name)
    ;

    this.svg
      .append('svg:g')
      .selectAll('path')
      .data(diagramData.links)
      .enter()
      .append('svg:path')
      .attr('stroke-width', 1)
      .attr('stroke', colors.featureInner)
      .attr('fill', 'transparent')
      .attr('class', d => d.source.feature === d.target.feature ? 'same-feature-dep' : '')
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

  drawGroups(groups) {
    this.svg
      .append('svg:g')
      .selectAll('path')
      .data(groups)
      .enter()
      .append('svg:path')
      .attr('id', d => `group-${d.type}-${d.id}`)
      .attr('stroke-width', d => d.strokeWidth)
      .attr('class', d => `${d.type}-group`)
      .attr('fill', 'transparent')
      .attr('d', (d) => {
        // const featureAngle = Math.PI * 2 / groups.length - gapAngle;

        const d3Path = d3.path();
        d3Path.arc(d.x, d.y, d.radius, d.startAngle, d.endAngle);
        return d3Path;
      })
    ;
  }

  render() {
    return (
      <div className="diagram-overview-chord-diagram">
        <div ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state, props) {
  return {
    diagramData: getOverviewChordDiagramData(state.home, props.size),
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
