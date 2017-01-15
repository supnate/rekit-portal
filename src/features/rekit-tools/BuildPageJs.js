import React, { Component, PropTypes } from 'react';
import { autobind } from 'core-decorators';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert, Button, Col, Icon, Row } from 'antd';
import Convert from 'ansi-to-html';
import * as actions from './redux/actions';

const convert = new Convert();


export class BuildPageJs extends Component {
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
    return (
      <div className="rekit-tools-build-page-js">
        <h2>Build</h2>
        <Alert type="info" showIcon message="You have not run any build yet." />
        <Row>
          <Col span="16">
            <Button type="primary" onClick={this.handleBuildButtonClick}>Run build</Button>
          </Col>
          <Col span="8" style={{ textAlign: 'right' }}>
            <Button type="ghost"><Icon type="export" />Access the built application</Button>
          </Col>
        </Row>
        <hr />
        <div className="output-container">
          <ul>
            {output.map((text, i) =>
              <li key={i} dangerouslySetInnerHTML={{ __html: convert.toHtml(text).replace(/color:#555/g, 'color:#777') }} />
            )}
          </ul>
        </div>
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
)(BuildPageJs);
