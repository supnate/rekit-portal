import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { browserHistory } from 'react-router';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Modal, Row } from 'antd';
import Convert from 'ansi-to-html';
import { showDemoAlert } from '../home/redux/actions';
import * as actions from './redux/actions';
import { getTestFilePattern } from './utils';

const convert = new Convert();

export class RunTestPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
  };

  // componentDidMount() {
  //   this.checkAndRunTests(this.props);
  // }

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.params.testFile !== this.props.params.testFile) {
  //     this.checkAndRunTests(nextProps);
  //   }
  // }

  // checkAndRunTests(props) {
  //   const rekitTools = this.props.rekitTools;
  //   if (rekitTools.currentTestFile !== props.params.testFile && !rekitTools.runTestRunning) {
  //     this.props.actions.runTest(props.params.testFile).catch(this.handleRunTestError);
  //   }
  // }

  @autobind
  handleRunTestError(e) {
    if (process.env.REKIT_ENV === 'demo' && _.get(e, 'response.status') === 403) {
      this.props.actions.showDemoAlert();
    } else {
      Modal.error({
        title: 'Failed to run tests',
        content: <span style={{ color: 'red' }}>{this.props.rekitTools.runTestError}</span>,
      });
    }
  }

  @autobind
  handleTestButtonClick() {
    this.props.actions.runTest(this.props.params.testFile).catch(this.handleRunTestError);
  }
  @autobind
  handleTestCoverageClick() {
    browserHistory.push('/tools/coverage');
  }

  render() {
    const output = this.props.rekitTools.runTestOutput || [];
    const { runTestPending, runTestRunning } = this.props.rekitTools;
    return (
      <div className="rekit-tools-run-test-page">
        <h2><label>Run tests: </label>tests/{getTestFilePattern(this.props.params.testFile)}</h2>
        <Row>
          <Col span="16">
            <Button type="primary" disabled={runTestRunning} onClick={this.handleTestButtonClick}>
              {runTestRunning ? 'Running tests...' : 'Re-run tests'}
            </Button>
          </Col>
          <Col span="8" style={{ textAlign: 'right' }}>
            {!this.props.params.testFile && this.props.home.testCoverage &&
              <Button type="ghost" disabled={runTestRunning || runTestPending} onClick={this.handleTestCoverageClick}>
                <Icon type="pie-chart" />Test coverage
              </Button>}
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
    home: state.home,
    rekitTools: state.rekitTools,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ showDemoAlert, ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunTestPage);
