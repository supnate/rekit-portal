import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Col, Icon, Progress, Row } from 'antd';
import Convert from 'ansi-to-html';
import * as actions from './redux/actions';

const convert = new Convert();

export class BuildPage extends Component {
  static propTypes = {
    rekitTools: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  @autobind
  handleBuildButtonClick() {
    this.props.actions.runBuild().catch((e) => {
      console.error('build failed: ', e);
    });
  }

  render() {
    let output = this.props.rekitTools.runBuildOutput || [];
    const { runBuildRunning } = this.props.rekitTools;
    let percent = 0;
    output = _.uniq(output.map((t) => {
      const p = parseFloat(t.split('%'));
      if (p) percent = p;
      return t.replace(/.+%/, '>');
    }));

    return (
      <div className="rekit-tools-build-page">
        <Row>
          <Col span="16">
            <Button type="primary" disabled={runBuildRunning} onClick={this.handleBuildButtonClick}>
              {runBuildRunning ? 'Building...' : 'Run build'}
            </Button>
          </Col>
          <Col span="8" style={{ textAlign: 'right' }}>
            <Button type="ghost" disabled={runBuildRunning}><Icon type="export" />Go to the deployable application</Button>
          </Col>
        </Row>
        <hr />
        { (runBuildRunning || percent === 100) && <Progress percent={percent} />}
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
