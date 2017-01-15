import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Row } from 'antd';
import Convert from 'ansi-to-html';
import * as actions from './redux/actions';

const convert = new Convert();

export class RunTestPage extends Component {
  static propTypes = {
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleTestButtonClick() {
    this.props.actions.runTest().catch((e) => {
      console.error('test failed: ', e);
    });
  }
  render() {
    const output = this.props.rekitTools.runTestOutput || [];
    const runTestRunning = this.props.rekitTools.runTestRunning;
    return (
      <div className="rekit-tools-run-test-page">
        <Row>
          <Col span="16">
            <Button type="primary" disabled={runTestRunning} onClick={this.handleTestButtonClick}>
              {runTestRunning ? 'Running tests...' : 'Run tests'}
            </Button>
          </Col>
          <Col span="8" style={{ textAlign: 'right' }}>
            <Button type="ghost" disabled={runTestRunning}><Icon type="pie-chart" />Test coverage</Button>
          </Col>
        </Row>
        <hr />
        {!runTestRunning && !output.length && <div style={{ marginTop: 20 }}>Click run tests button to start the tests.</div>}
        {output.length > 0 &&
          <div className="output-container">
            <ul>
              {output.map((text, i) =>
                text && <li key={i} dangerouslySetInnerHTML={{ __html: convert.toHtml(text).replace(/color:#555/g, 'color:#777') }} />
              )}
            </ul>
          </div>
        }
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    rekitTools: state.rekitTools,
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
)(RunTestPage);
