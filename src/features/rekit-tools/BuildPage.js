import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Row } from 'antd';
import Convert from 'ansi-to-html';
import * as actions from './redux/actions';

const convert = new Convert();

export class BuildPage extends Component {
  static propTypes = {
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };
// <Alert type="info" showIcon message="You have not run build yet." />
//         <Alert type="error" showIcon message="Last build: failed, 2017.1.2 15:59:29" />
        
        //<Alert type="success" showIcon message="Last build: success, 2017.1.2 15:59:29" />
  @autobind
  handleBuildButtonClick() {
    this.props.actions.runBuild().catch((e) => {
      console.error('build failed: ', e);
    });
  }

  render() {
    const output = this.props.rekitTools.runBuildOutput || [];
    const { runBuildRunning } = this.props.rekitTools;
    return (
      <div className="rekit-tools-build-page">
        <Row>
          <Col span="16">
            <Button type="primary" disabled={runBuildRunning} onClick={this.handleBuildButtonClick}>
              {runBuildRunning ? 'Building...' : 'Run build'}
            </Button>
          </Col>
          <Col span="8" style={{ textAlign: 'right' }}>
            <Button type="ghost" disabled={runBuildRunning}><Icon type="export" />Access the built application</Button>
          </Col>
        </Row>
        <hr />
        {!runBuildRunning && !output.length && <div style={{ marginTop: 20 }}>Click run build button to start the build.</div>}
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
)(BuildPage);
