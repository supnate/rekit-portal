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
        { name: 'Home', r: 20 },
        { name: 'Rekit cmds', r: 20 },
        // { name: 'Common', r: 20 },
      ],
      links: [
        { source: 0, target: 1, type: 'action', linknum: 1 },
        { source: 0, target: 1, type: 'component', linknum: 2 },
        // { source: 0, target: 2, type: 'component', linknum: 1 },
        // { source: 1, target: 2, type: 'component', linknum: 1 },
      ],
    };
  }

  componentDidMount() {
    const svg = d3
      .select(this.d3Node)
      .append('svg')
      .attr('width', 600)
      .attr('height', 600)
    ;

    svg.append("svg:defs").selectAll("marker")
      .data(["action", "component", "store", "constant"])
      .enter().append("svg:marker")
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", -4)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .attr("d", "M0,-5L10,0L0,5");

    const data = this.getDataSet();
    const chartWidth = 600;

    const sim = d3
      .forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.index }))
      .force("collide",d3.forceCollide( function(d){return d.r + 8 }).iterations(16) )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(chartWidth / 2, chartWidth / 2))
      .force("y", d3.forceY(0))
      .force("x", d3.forceX(0))
      ;

    // var link = svg.append("g")
    //     .attr("class", "links")
    //     .selectAll("line")
    //     .data(data.links)
    //     .enter()
    //     .append("line")
    //     .attr("stroke", "black")
    
    var path = svg.append("svg:g").selectAll("path")
      .data(data.links)
      .enter().append("svg:path")
      .attr("class", function(d) { return "link " + d.type; })
      // .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", function(d){ return d.r })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    var ticked = function() {
        // link
        //   .attr("x1", function(d) { return d.source.x; })
        //   .attr("y1", function(d) { return d.source.y; })
        //   .attr("x2", function(d) { return d.target.x; })
        //   .attr("y2", function(d) { return d.target.y; });

        path.attr("d", function(d) {
          var dx = d.target.x - d.source.x,
              dy = d.target.y - d.source.y,
              dr = 100/d.linknum;  //linknum is defined above
            console.log(dr);
          return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,0 " + d.target.x + "," + d.target.y;
          return `M${d.source.x}, ${d.source.y} A200 ${dr} 0 0 1 ${d.target.x} ${d.target.y}`;
          // return "M" + d.source.x + "," + d.source.y + " A" + dr + "," + dr + " 0 0, 1 " + d.target.x + "," + d.target.y;
        });
        node
          .attr('fill', 'cyan')
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    }  
    
    sim
      .nodes(data.nodes)
      .on("tick", ticked);

    sim
      .force("link")
      .links(data.links)
      .distance(200)
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
