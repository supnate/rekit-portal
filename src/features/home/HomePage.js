import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Icon, Popover, Row } from 'antd';
import { OverviewChordDiagram } from '../diagram';
import { TestCoverageSummary } from '../rekit-tools';
import { getOverviewStat } from './selectors/getOverviewStat';
import * as actions from './redux/actions';

export class HomePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  state = {
    svgSize: 460,
  };

  componentWillMount() {
    this.handleWindowResize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize, false);
  }

  @autobind
  handleWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let size = Math.min(height - 280, (width - 320) * 2 / 3);
    if (size < 320) size = 320;
    this.setState({
      svgSize: size,
    });
  }

  renderOverviewDiagramHelp() {

  }

  render() {
    const { features, featureById } = this.props.home;
    const overviewStat = getOverviewStat({ features, featureById });
    return (
      <div className="home-home-page">
        <Row className="top-badges">
          <Col span="6">
            <div className="top-badge feature">
              <Icon type="book" />
              <label className="count">{overviewStat.features}</label>
              <label className="type">features</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge route">
              <Icon type="share-alt" />
              <label className="count">{overviewStat.routes}</label>
              <label className="type">routes</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge action">
              <Icon type="notification" />
              <label className="count">{overviewStat.actions}</label>
              <label className="type">actions</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge component">
              <Icon type="appstore-o" />
              <label className="count">{overviewStat.components}</label>
              <label className="type">components</label>
            </div>
          </Col>
        </Row>
        <Row style={{ minWidth: 800 }}>
          <Col span="16" className="diagram-container">
            <Popover placement="leftTop" title={<p style={{ fontSize: 18 }}>Overview diagram</p>} content={this.renderOverviewDiagramHelp()}>
              <Icon style={{ color: '#108ee9', fontSize: 16, float: 'right', marginTop: 38 }} type="question-circle-o" />
            </Popover>
            <h3>Overview diagram</h3>
            <OverviewChordDiagram size={this.state.svgSize} />
          </Col>
          <Col span="8" className="test-coverage-container">
            <Popover placement="leftTop" title={<p style={{ fontSize: 18 }}>Test coverage</p>} content={this.renderOverviewDiagramHelp()}>
              <Icon style={{ color: '#108ee9', fontSize: 16, float: 'right', marginTop: 38 }} type="question-circle-o" />
            </Popover>
            <h3>Test coverage</h3>
            <TestCoverageSummary />
          </Col>
        </Row>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
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
)(HomePage);
