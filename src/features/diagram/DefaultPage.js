import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import * as actions from './redux/actions';

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
            name: 'DefaultPage',
            usings: [
              {
                feature: 'rekit-cmds',
                type: 'action',
                name: 'showCmdDialog',
              },
            ]
          },
        ],
      },
      {
        name: 'Rekit cmds',
        actions: [
          {
            name: 'showCmdDialog',
            usings: [],
          }
        ],
      },
    ];

    return features;
  }

  componentDidMount() {
    console.log('d3 did mount', this.d3Node);
    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', 600)
      .attr('height', 600)
    ;
    const dataset = [1, 2, 3, 4, 5];

    const wx = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([0, 600])
    ;
    svg.selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('height', 20)
      .attr('y', (d, i) => i * 30)
      .transition()
      .duration(1000)
      .attr('x', 0)
      .delay((d, i) => i * 100)
      .attr('width', wx)
      .attr('fill', 'red')
    ;
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
