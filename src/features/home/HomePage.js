import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Col, Icon, Row } from 'antd';
import { OverviewChordDiagram } from '../diagram';
import * as actions from './redux/actions';

export class HomePage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className="home-home-page">
        <Row className="top-badges">
          <Col span="6">
            <div className="top-badge feature">
              <Icon type="book" />
              <label className="count">6</label>
              <label className="type">features</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge action">
              <Icon type="notification" />
              <label className="count">32</label>
              <label className="type">actions</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge component">
              <Icon type="appstore-o" />
              <label className="count">162</label>
              <label className="type">components</label>
            </div>
          </Col>
          <Col span="6">
            <div className="top-badge misc">
              <Icon type="file" />
              <label className="count">89</label>
              <label className="type">misc files</label>
            </div>
          </Col>
        </Row>
        <Row style={{ minWidth: 1000 }}>
          <Col span="16" className="diagram-container">
            <h3>Overview diagram</h3>
            <OverviewChordDiagram size={500} />
          </Col>
          <Col span="8" className="test-coverage-container">
            <h3>Test coverage</h3>
            <div>No coverage data found. You need to run tests first.</div>
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
