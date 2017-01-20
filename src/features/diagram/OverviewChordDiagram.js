import React, { PureComponent, PropTypes } from 'react';
import _ from 'lodash';
import { colors } from '../common';
import * as d3 from 'd3';

export default class OverviewChordDiagram extends PureComponent {
  static propTypes = {
    homeStore: PropTypes.object.required,
  };

  componentDidMount() {
    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', 500)
      .attr('height', 500)
    ;

    const gapAngle = Math.PI / 90;

    const data = this.props.homeStore.features;
    svg
      .append('svg:g')
      .selectAll('path')
      .data(data)
      .enter()
      .append('svg:path')
      .attr('id', d => `feature-arc-${d}`)
      .attr('stroke-width', 15)
      .attr('stroke', colors.featureInner)
      // .attr('opacity', '0.5')
      .attr('fill', 'transparent')
      .attr('d', (d, i) => {
        const featureAngle = Math.PI * 2 / data.length - gapAngle;

        const d3Path = d3.path();
        const startAngle = i * Math.PI * 2 / data.length;
        const endAngle = startAngle + featureAngle;
        d3Path.arc(250, 250, 200, startAngle, endAngle);
        return d3Path;
      })
    ;

    svg
      .append('svg:g')
      .selectAll('text')
      .data(data)
      .enter()
      .append('svg:text')
      .style('font-size', 12)
      .style('fill', '#777')
      .attr('dy', -12)
      .append('textPath')
      .attr('xlink:href', d => `#feature-arc-${d}`)
      // .style('text-anchor', 'middle')
      // .attr('startOffset', '50%')
      .style('text-anchor', 'start')
      .attr('startOffset', '0%')
      .text(d => this.props.homeStore.featureById[d].name)
    ;

    data.forEach((f, i) => {
      const featureAngle = Math.PI * 2 / data.length - gapAngle;
      const subAngle = (featureAngle - gapAngle * 2) / 3;
      svg.append('svg:g').selectAll('path')
        .data(['action', 'component', 'misc'])
        .enter()
        .append('svg:path')
        .attr('stroke-width', 15)
        .attr('stroke', d => colors[d])
        // .attr('opacity', '0.6')
        .attr('fill', 'transparent')
        .attr('d', (d, j) => {
          const startAngle = (i * Math.PI * 2 / data.length) + j * (subAngle + gapAngle);
          const endAngle = startAngle + subAngle;
          const d3Path = d3.path();
          d3Path.arc(250, 250, 180, startAngle, endAngle);
          return d3Path;
        })
      ;
    });
  }

  render() {
    return (
      <div className="diagram-overview-chord-diagram">
        <div ref={(node) => { this.d3Node = node; }} />
      </div>
    );
  }
}
